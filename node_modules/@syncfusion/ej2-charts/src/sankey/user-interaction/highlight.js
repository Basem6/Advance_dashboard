import { Browser, Animation } from '@syncfusion/ej2-base';
/**
 * Highlight behavior module for Sankey Chart.
 */
var SankeyHighlight = /** @class */ (function () {
    /**
     * Constructor.
     *
     * @param {Sankey} chart - Sankey chart instance.
     */
    function SankeyHighlight(chart) {
        this.lastHoveredId = null;
        this.animationTimeoutId = null;
        /** Default animation duration for highlight removal in milliseconds. */
        this.DEFAULT_ANIMATION_DURATION = 400;
        /** Minimum animation duration to ensure smooth transitions. */
        this.MIN_ANIMATION_DURATION = 50;
        /** Epsilon value for floating point opacity comparison. */
        this.OPACITY_EPSILON = 0.001;
        this.chart = chart;
        this.wireEvents();
    }
    /**
     * Wires legend interaction events to the chart for hover, move, click, and touch end behaviors.
     *
     * @returns {void}
     */
    SankeyHighlight.prototype.wireEvents = function () {
        if (this.chart.isDestroyed) {
            return;
        }
        var cancelEvent = Browser.isPointer ? 'pointerleave' : 'mouseleave';
        this.chart.on(cancelEvent, this.handleMouseLeave, this);
        this.chart.on(Browser.touchMoveEvent, this.handleMouseMove, this);
        // clear highlight on touch end / pointer up (chart notifies this event)
        this.chart.on(Browser.touchEndEvent, this.handleMouseMove, this);
    };
    /**
     * Unwires legend interaction events from the chart to release handlers and avoid memory leaks.
     *
     * @returns {void}
     */
    SankeyHighlight.prototype.unwireEvents = function () {
        if (this.chart.isDestroyed) {
            return;
        }
        this.chart.off(Browser.touchMoveEvent, this.handleMouseMove);
        this.chart.off(Browser.touchEndEvent, this.handleMouseMove);
        var cancelEvent = Browser.isPointer ? 'pointerleave' : 'mouseleave';
        this.chart.off(cancelEvent, this.handleMouseLeave);
    };
    /**
     * Retrieves all label elements from the chart's label collection.
     *
     * @returns {HTMLElement[]} - Array of label text elements, empty array if collection not found.
     * @private
     */
    SankeyHighlight.prototype.getLabelElements = function () {
        var labelCollection = document.getElementById(this.chart.element.id + '_label_collection');
        return labelCollection ? Array.prototype.slice.call(labelCollection.querySelectorAll('text')) : [];
    };
    /**
     * Clears active highlight when the pointer leaves the chart surface.
     *
     * @param {Event} _event - The leave event (unused).
     * @returns {void}
     * @private
     */
    SankeyHighlight.prototype.handleMouseLeave = function (_event) {
        this.clearHighlights();
    };
    /**
     * Tracks pointer/touch movement to identify interactive nodes/links and apply the corresponding highlight.
     * Uses debouncing to prevent duplicate highlight updates from multiple event sources.
     *
     * @param {PointerEvent | TouchEvent} event - The pointer or touch move event used to detect the hovered element.
     * @returns {void}
     * @private
     */
    SankeyHighlight.prototype.handleMouseMove = function (event) {
        var targetElement = (event && event.target);
        if (!targetElement) {
            this.clearHighlights();
            return;
        }
        var hitElement = this.getInteractiveTarget(targetElement);
        if (!hitElement) {
            this.clearHighlights();
            return;
        }
        if (hitElement.type === 'node' && hitElement.id) {
            if (this.lastHoveredId === 'node:' + hitElement.id) {
                return;
            }
            if (this.animationTimeoutId !== null) {
                clearTimeout(this.animationTimeoutId);
                this.animationTimeoutId = null;
            }
            this.stopAllAnimations();
            this.lastHoveredId = 'node:' + hitElement.id;
            this.highlightForNode(hitElement.id);
        }
        else if (hitElement.type === 'link') {
            if (this.lastHoveredId === 'link:' + (hitElement.id)) {
                return;
            }
            if (this.animationTimeoutId !== null) {
                clearTimeout(this.animationTimeoutId);
                this.animationTimeoutId = null;
            }
            this.stopAllAnimations();
            this.lastHoveredId = 'link:' + (hitElement.id);
            this.highlightForLink(hitElement.source, hitElement.target);
        }
        else {
            this.clearHighlights(true);
        }
    };
    /**
     * Walks up the DOM tree to find the nearest interactive Sankey element (node, link, label, or legend item).
     *
     * @param {Element} element - The starting DOM element from the event target.
     * @returns {Element | null} - returns element if found, or null.
     * @private
     */
    SankeyHighlight.prototype.getInteractiveTarget = function (element) {
        var currentElement = element;
        while (currentElement && currentElement !== document.body) {
            var elementId = currentElement.getAttribute('id');
            if (elementId) {
                if (elementId.indexOf('_node_level_') > -1) {
                    // node element
                    var nodeId = currentElement.getAttribute('aria-label');
                    return { type: 'node', id: nodeId };
                }
                else if (elementId.indexOf('_link_level_') > -1) {
                    var sourceId = currentElement.getAttribute('data-source');
                    var targetId = currentElement.getAttribute('data-target');
                    return { type: 'link', id: elementId, source: sourceId, target: targetId };
                }
                else if (elementId.indexOf('_label_level_') > -1) {
                    // labels map to node by level/index pattern
                    var splitIdParts = elementId.split('_');
                    var level = splitIdParts[splitIdParts.length - 2];
                    var index = splitIdParts[splitIdParts.length - 1];
                    var nodeElementId = this.chart.element.id + "_node_level_" + level + "_" + index;
                    var nodeElement = document.getElementById(nodeElementId);
                    if (nodeElement) {
                        var nodeLabel = nodeElement.getAttribute('aria-label');
                        return { type: 'node', id: nodeLabel };
                    }
                }
                else if (elementId.indexOf('_legend_') > -1 && this.chart.legendSettings.enableHighlight) {
                    var legendHighlightElement = void 0;
                    if (elementId.indexOf('_shape_') > -1 || elementId.indexOf('_text_') > -1) {
                        legendHighlightElement = currentElement.parentElement;
                    }
                    else {
                        legendHighlightElement = currentElement;
                    }
                    var nodeId = legendHighlightElement.getAttribute('aria-label');
                    return { type: 'node', id: nodeId };
                }
            }
            currentElement = currentElement.parentElement;
        }
        return null;
    };
    /**
     * Highlights the hovered node along with its directly connected neighbor nodes and links by applying active/inactive opacities.
     *
     * @param {string} nodeId - The node id whose related nodes and links should be highlighted.
     * @returns {void}
     * @private
     */
    SankeyHighlight.prototype.highlightForNode = function (nodeId) {
        var chart = this.chart;
        var linkCollection = document.getElementById(chart.element.id + '_link_collection');
        var nodeCollection = document.getElementById(chart.element.id + '_node_collection');
        var labelCollection = document.getElementById(chart.element.id + '_label_collection');
        if (!linkCollection || !nodeCollection) {
            return;
        }
        var linkElements = Array.prototype.slice.call(linkCollection.querySelectorAll('path'));
        var nodeElements = Array.prototype.slice.call(nodeCollection.querySelectorAll('rect'));
        var labelElements = labelCollection ? Array.prototype.slice.call(labelCollection.querySelectorAll('text')) : [];
        // collect neighbor node ids connected to hovered node
        var neighborNodeMap = {};
        var highlightOpacity = (chart.linkStyle && chart.linkStyle.highlightOpacity);
        var inactiveOpacity = (chart.linkStyle && chart.linkStyle.inactiveOpacity);
        var nodeHighlightOpacity = (chart.nodeStyle && chart.nodeStyle.highlightOpacity);
        var nodeInactiveOpacity = (chart.nodeStyle && chart.nodeStyle.inactiveOpacity);
        for (var _i = 0, linkElements_1 = linkElements; _i < linkElements_1.length; _i++) {
            var linkElement = linkElements_1[_i];
            var sourceId = linkElement.getAttribute('data-source');
            var targetId = linkElement.getAttribute('data-target');
            if (sourceId === nodeId || targetId === nodeId) {
                // matched link
                linkElement.setAttribute('opacity', String(highlightOpacity));
                // mark the neighbor node (other end)
                var otherNodeId = (sourceId === nodeId) ? targetId : sourceId;
                if (otherNodeId) {
                    neighborNodeMap[otherNodeId] = true;
                }
            }
            else {
                linkElement.setAttribute('opacity', String(inactiveOpacity));
            }
        }
        for (var _a = 0, nodeElements_1 = nodeElements; _a < nodeElements_1.length; _a++) {
            var nodeElement = nodeElements_1[_a];
            var nodeElementId = nodeElement.getAttribute('aria-label');
            if (nodeElementId === nodeId || (nodeElementId && neighborNodeMap[nodeElementId])) {
                nodeElement.setAttribute('opacity', String(nodeHighlightOpacity));
            }
            else {
                nodeElement.setAttribute('opacity', String(nodeInactiveOpacity));
            }
        }
        this.highlightLabelsForNodes([nodeId].concat(Object.keys(neighborNodeMap)), labelElements, inactiveOpacity);
    };
    /**
     * Highlights the hovered link and its source/target nodes by applying active/inactive opacities.
     *
     * @param {string | null} source - The source node id of the hovered link.
     * @param {string | null} target - The target node id of the hovered link.
     * @returns {void}
     * @private
     */
    SankeyHighlight.prototype.highlightForLink = function (source, target) {
        var chart = this.chart;
        var linkCollection = document.getElementById(chart.element.id + '_link_collection');
        var nodeCollection = document.getElementById(chart.element.id + '_node_collection');
        var labelCollection = document.getElementById(chart.element.id + '_label_collection');
        if (!linkCollection || !nodeCollection) {
            return;
        }
        var linkElements = Array.prototype.slice.call(linkCollection.querySelectorAll('path'));
        var nodeElements = Array.prototype.slice.call(nodeCollection.querySelectorAll('rect'));
        var labelElements = labelCollection ? Array.prototype.slice.call(labelCollection.querySelectorAll('text')) : [];
        var highlightOpacity = (chart.linkStyle && chart.linkStyle.highlightOpacity);
        var inactiveOpacity = (chart.linkStyle && chart.linkStyle.inactiveOpacity);
        var nodeHighlightOpacity = (chart.nodeStyle && chart.nodeStyle.highlightOpacity);
        var nodeInactiveOpacity = (chart.nodeStyle && chart.nodeStyle.inactiveOpacity);
        for (var _i = 0, linkElements_2 = linkElements; _i < linkElements_2.length; _i++) {
            var linkElement = linkElements_2[_i];
            var sourceId = linkElement.getAttribute('data-source');
            var targetId = linkElement.getAttribute('data-target');
            if (sourceId === source && targetId === target) {
                linkElement.setAttribute('opacity', String(highlightOpacity));
            }
            else {
                linkElement.setAttribute('opacity', String(inactiveOpacity));
            }
        }
        for (var _a = 0, nodeElements_2 = nodeElements; _a < nodeElements_2.length; _a++) {
            var nodeElement = nodeElements_2[_a];
            var nodeElementId = nodeElement.getAttribute('aria-label');
            if (nodeElementId === source || nodeElementId === target) {
                nodeElement.setAttribute('opacity', String(nodeHighlightOpacity));
            }
            else {
                nodeElement.setAttribute('opacity', String(nodeInactiveOpacity));
            }
        }
        var highlightedNodeIds = [];
        if (source) {
            highlightedNodeIds.push(source);
        }
        if (target) {
            highlightedNodeIds.push(target);
        }
        this.highlightLabelsForNodes(highlightedNodeIds, labelElements, inactiveOpacity);
    };
    /**
     * Clears active node/link highlight and restores default link and node opacity values.
     * Uses smooth animation for opacity transitions when truly leaving the chart.
     * Set animate to false for immediate clearing (e.g., on chart destruction).
     *
     * @param {boolean} [animate=true] - Whether to use animation for the clear transition.
     *                                    True: smooth fade over DEFAULT_ANIMATION_DURATION ms.
     *                                    False: immediate opacity reset to defaults.
     * @returns {void}
     * @private
     */
    SankeyHighlight.prototype.clearHighlights = function (animate) {
        if (animate === void 0) { animate = true; }
        if (this.lastHoveredId === null) {
            return;
        }
        this.lastHoveredId = null;
        if (animate) {
            this.performClearHighlightsWithAnimation();
        }
    };
    /**
     * Stops all ongoing animations on link, node, and label elements without changing their opacity.
     * Used when switching between highlights to allow new highlight values to be applied immediately.
     *
     * @returns {void}
     * @private
     */
    SankeyHighlight.prototype.stopAllAnimations = function () {
        var chart = this.chart;
        var linkCollection = document.getElementById(chart.element.id + '_link_collection');
        var nodeCollection = document.getElementById(chart.element.id + '_node_collection');
        if (!linkCollection || !nodeCollection) {
            return;
        }
        var linkElements = Array.prototype.slice.call(linkCollection.querySelectorAll('path'));
        var nodeElements = Array.prototype.slice.call(nodeCollection.querySelectorAll('rect'));
        var labelElements = this.getLabelElements();
        for (var _i = 0, linkElements_3 = linkElements; _i < linkElements_3.length; _i++) {
            var linkElement = linkElements_3[_i];
            if (linkElement.hasAttribute('e-animate')) {
                linkElement.removeAttribute('e-animate');
                Animation.stop(linkElement);
            }
        }
        for (var _a = 0, nodeElements_3 = nodeElements; _a < nodeElements_3.length; _a++) {
            var nodeElement = nodeElements_3[_a];
            if (nodeElement.hasAttribute('e-animate')) {
                nodeElement.removeAttribute('e-animate');
                Animation.stop(nodeElement);
            }
        }
        for (var _b = 0, labelElements_1 = labelElements; _b < labelElements_1.length; _b++) {
            var labelElement = labelElements_1[_b];
            if (labelElement.hasAttribute('e-animate')) {
                labelElement.removeAttribute('e-animate');
                Animation.stop(labelElement);
            }
        }
    };
    /**
     * Performs the clearing of highlights with smooth animation for opacity values.
     * Animates all link, node, and label opacity changes to the default values.
     *
     * @returns {void}
     * @private
     */
    SankeyHighlight.prototype.performClearHighlightsWithAnimation = function () {
        var _this = this;
        if (this.chart.isDestroyed) {
            return;
        }
        var chart = this.chart;
        var linkCollection = document.getElementById(chart.element.id + '_link_collection');
        var nodeCollection = document.getElementById(chart.element.id + '_node_collection');
        if (!linkCollection || !nodeCollection) {
            return;
        }
        var linkElements = Array.prototype.slice.call(linkCollection.querySelectorAll('path'));
        var nodeElements = Array.prototype.slice.call(nodeCollection.querySelectorAll('rect'));
        var labelElements = this.getLabelElements();
        var defaultLinkOpacity = (chart.linkStyle && chart.linkStyle.opacity);
        var defaultNodeOpacity = (chart.nodeStyle && chart.nodeStyle.opacity);
        for (var _i = 0, linkElements_4 = linkElements; _i < linkElements_4.length; _i++) {
            var linkElement = linkElements_4[_i];
            var currentOpacity = parseFloat(linkElement.getAttribute('opacity'));
            if (currentOpacity && Math.abs(currentOpacity - defaultLinkOpacity) > this.OPACITY_EPSILON) {
                this.animateOpacityChange(linkElement, currentOpacity, defaultLinkOpacity, this.DEFAULT_ANIMATION_DURATION);
            }
        }
        for (var _a = 0, nodeElements_4 = nodeElements; _a < nodeElements_4.length; _a++) {
            var nodeElement = nodeElements_4[_a];
            var currentOpacity = parseFloat(nodeElement.getAttribute('opacity'));
            if (currentOpacity && Math.abs(currentOpacity - defaultNodeOpacity) > this.OPACITY_EPSILON) {
                this.animateOpacityChange(nodeElement, currentOpacity, defaultNodeOpacity, this.DEFAULT_ANIMATION_DURATION);
            }
        }
        for (var _b = 0, labelElements_2 = labelElements; _b < labelElements_2.length; _b++) {
            var labelElement = labelElements_2[_b];
            var currentOpacity = parseFloat(labelElement.getAttribute('opacity') || '1');
            if (Math.abs(currentOpacity - 1) > this.OPACITY_EPSILON) {
                this.animateOpacityChange(labelElement, currentOpacity, 1, this.DEFAULT_ANIMATION_DURATION, true);
            }
        }
        if (this.DEFAULT_ANIMATION_DURATION > 0) {
            this.animationTimeoutId = window.setTimeout(function () {
                _this.animationTimeoutId = null;
            }, Math.max(this.DEFAULT_ANIMATION_DURATION, this.MIN_ANIMATION_DURATION));
        }
    };
    /**
     * Animates opacity change from start value to end value for an element.
     * Includes proper cleanup on chart destruction.
     *
     * @param {HTMLElement} element - The element to animate.
     * @param {number} startOpacity - The starting opacity value.
     * @param {number} endOpacity - The ending opacity value.
     * @param {number} duration - The animation duration in milliseconds.
     * @param {boolean} removeAttribute - Whether to remove the opacity attribute at the end (for labels).
     * @returns {void}
     * @private
     */
    SankeyHighlight.prototype.animateOpacityChange = function (element, startOpacity, endOpacity, duration, removeAttribute) {
        var _this = this;
        if (!element) {
            return;
        }
        var effectiveDuration = Math.max(duration, this.MIN_ANIMATION_DURATION);
        if (duration === 0) {
            if (removeAttribute) {
                element.removeAttribute('opacity');
            }
            else if (endOpacity < 1) {
                element.setAttribute('opacity', String(endOpacity));
            }
            else {
                element.removeAttribute('opacity');
            }
            return;
        }
        element.setAttribute('e-animate', 'true');
        new Animation({}).animate(element, {
            duration: effectiveDuration,
            progress: function (args) {
                // Stop animation if chart was destroyed
                if (_this.chart.isDestroyed) {
                    Animation.stop(element);
                    return;
                }
                element.style.animation = '';
                var progress = Math.min(args.timeStamp / args.duration, 1);
                var currentOpacity = startOpacity + (endOpacity - startOpacity) * progress;
                element.setAttribute('opacity', String(parseFloat(currentOpacity.toFixed(3))));
            },
            end: function () {
                // Only apply final opacity if animation was not interrupted (e-animate marker exists)
                if (element.hasAttribute('e-animate')) {
                    if (removeAttribute) {
                        element.removeAttribute('opacity');
                    }
                    else if (endOpacity < 1) {
                        element.setAttribute('opacity', String(endOpacity));
                    }
                    else {
                        element.removeAttribute('opacity');
                    }
                    element.removeAttribute('e-animate');
                }
            }
        });
    };
    /**
     * Highlights labels for the specified nodes and dims all other labels.
     *
     * @param {string[]} highlightedNodeIds - Array of node ids whose labels should be highlighted.
     * @param {SVGElement[]} labelElements - Array of all label text elements in the chart.
     * @param {number} inactiveOpacity - The opacity value to apply to non-highlighted labels.
     * @returns {void}
     * @private
     */
    SankeyHighlight.prototype.highlightLabelsForNodes = function (highlightedNodeIds, labelElements, inactiveOpacity) {
        for (var _i = 0, labelElements_3 = labelElements; _i < labelElements_3.length; _i++) {
            var labelElement = labelElements_3[_i];
            var labelElementId = labelElement.getAttribute('id');
            if (!labelElementId) {
                continue;
            }
            var nodeLabel = this.getNodeLabelFromLabelElement(labelElement);
            if (nodeLabel && highlightedNodeIds.indexOf(nodeLabel) > -1) {
                labelElement.removeAttribute('opacity');
            }
            else {
                labelElement.setAttribute('opacity', String(inactiveOpacity));
            }
        }
    };
    /**
     * Extracts the node label/id from a label text element by finding the corresponding node.
     *
     * @param {SVGElement} labelElement - The label text element to extract the node id from.
     * @returns {string | null} returns the node id if found, else null.
     * @private
     */
    SankeyHighlight.prototype.getNodeLabelFromLabelElement = function (labelElement) {
        var labelElementId = labelElement.getAttribute('id');
        if (!labelElementId) {
            return null;
        }
        var match = labelElementId.match(/_label_level_(\d+)_(\d+)$/);
        if (!match) {
            return null;
        }
        var level = match[1];
        var index = match[2];
        var chartId = this.chart.element.id;
        var nodeElementId = chartId + "_node_level_" + level + "_" + index;
        var nodeElement = document.getElementById(nodeElementId);
        if (nodeElement) {
            return nodeElement.getAttribute('aria-label');
        }
        return null;
    };
    /**
     * Gets the module name for the Sankey highlight component.
     *
     * @returns {string} returns module name
     * @private
     */
    SankeyHighlight.prototype.getModuleName = function () { return 'SankeyHighlight'; };
    /**
     * Destroys the highlight module by unwiring events and cleaning up any pending animations.
     *
     * @returns {void}
     * @private
     */
    SankeyHighlight.prototype.destroy = function () {
        if (this.animationTimeoutId !== null) {
            clearTimeout(this.animationTimeoutId);
            this.animationTimeoutId = null;
        }
        this.unwireEvents();
    };
    return SankeyHighlight;
}());
export { SankeyHighlight };

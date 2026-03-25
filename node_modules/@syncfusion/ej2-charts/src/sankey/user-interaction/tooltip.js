import { Tooltip as SVGTooltip } from '@syncfusion/ej2-svg-base';
import { withInBounds } from '../../common/utils/helper';
import { Browser } from '@syncfusion/ej2-base';
/**
 * Tooltip rendering module for Sankey Chart.
 */
var SankeyTooltip = /** @class */ (function () {
    /**
     * Constructor.
     *
     * @param {Sankey} sankey - Sankey chart instance.
     */
    function SankeyTooltip(sankey) {
        this.sankey = sankey;
        this.wireEvents();
    }
    /**
     * Wires all tooltip-related event listeners to the Sankey chart instance.
     *
     * This method attaches pointer, touch, mouse, and click events required for
     * tooltip rendering and lifecycle management.
     *
     * @returns {void}
     */
    SankeyTooltip.prototype.wireEvents = function () {
        var sankeyChart = this.sankey;
        if (!sankeyChart || sankeyChart.isDestroyed) {
            return;
        }
        var pointerLeaveEvent = Browser.isPointer ? 'pointerleave' : 'mouseleave';
        sankeyChart.on(Browser.touchMoveEvent, this.handlePointerMove, this);
        sankeyChart.on(Browser.touchEndEvent, this.handlePointerUp, this);
        sankeyChart.on(pointerLeaveEvent, this.handlePointerLeave, this);
        sankeyChart.on('click', this.handleChartClick, this);
    };
    /**
     * Unwires all tooltip-related event listeners from the Sankey chart instance.
     *
     * @returns {void}
     */
    SankeyTooltip.prototype.unwireEvents = function () {
        var sankeyChart = this.sankey;
        if (!sankeyChart || sankeyChart.isDestroyed) {
            return;
        }
        var pointerLeaveEvent = Browser.isPointer ? 'pointerleave' : 'mouseleave';
        sankeyChart.off(Browser.touchMoveEvent, this.handlePointerMove);
        sankeyChart.off(Browser.touchEndEvent, this.handlePointerUp);
        sankeyChart.off(pointerLeaveEvent, this.handlePointerLeave);
        sankeyChart.off('click', this.handleChartClick);
    };
    /**
     * Acts as a proxy to forward pointer and touch move events
     * to the existing handleMouseMove method.
     *
     * @param {PointerEvent | TouchEvent} event - The pointer or touch move event.
     * @returns {void}
     */
    SankeyTooltip.prototype.handlePointerMove = function (event) {
        // setMouseXY is already handled before notify, so mouse coordinates are available
        this.handleMouseMove(event);
    };
    /**
     * Handles chart click events to hideTooltip the tooltip when fade-out mode is set to click.
     *
     * @param {Event} event - The click event triggered on the chart.
     * @returns {void}
     * @private
     */
    SankeyTooltip.prototype.handleChartClick = function (event) {
        var sankeyChart = this.sankey;
        if (sankeyChart.tooltip.fadeOutMode === 'Click') {
            this.hideTooltip(0);
        }
    };
    /**
     * Listens mouse move events inside the Sankey chart.
     *
     * @param {PointerEvent} event - The mouse or pointer move event within the chart.
     * @returns {void}
     * @private
     */
    SankeyTooltip.prototype.handleMouseMove = function (event) {
        var sankeyChart = this.sankey;
        if (!sankeyChart.tooltip.enable || sankeyChart.disableTrackTooltip) {
            return;
        }
        if (withInBounds(sankeyChart.mouseX, sankeyChart.mouseY, sankeyChart.initialClipRect)) {
            this.renderTooltip(false, event);
        }
        else if (sankeyChart.tooltip.fadeOutMode === 'Move') {
            this.hideTooltip();
        }
    };
    /**
     * Shows tooltip for a given SVG element using the current chart mouse coordinates or a fallback position.
     *
     * @param {Element} targetElement - The SVG target element to show the tooltip for (node <rect> or link <path>).
     * @param {boolean} isInitialRender - Indicates whether the tooltip is being rendered for the first time.
     * @param {ChartLocation} [fallbackPosition] - Optional fallback position to place the tooltip when mouse coordinates are not applicable.
     * @returns {void}
     *
     * @private
     */
    SankeyTooltip.prototype.showTooltipForElement = function (targetElement, isInitialRender, fallbackPosition) {
        if (isInitialRender === void 0) { isInitialRender = false; }
        clearTimeout(this.tooltipTimer);
        var sankeyChart = this.sankey;
        var tooltipSettings = sankeyChart.tooltip;
        var POINTER_PADDING = 4;
        var location;
        // Hit-test
        var hitTarget = null;
        if (targetElement) {
            hitTarget = targetElement; // Use event.target (direct)
        }
        if (!hitTarget) {
            return this.hideTooltip();
        }
        if (fallbackPosition) {
            location = fallbackPosition;
        }
        else {
            // Mouse hover → use current mouse position
            var adjustedX = sankeyChart.mouseX - sankeyChart.initialClipRect.x + (POINTER_PADDING * 2);
            var adjustedY = sankeyChart.mouseY - sankeyChart.initialClipRect.y + POINTER_PADDING;
            location = { x: adjustedX, y: adjustedY };
        }
        // Detect node or link
        var nodeElementIdPrefix = sankeyChart.element.id + "_node_";
        var linkCollectionId = sankeyChart.element.id + "_link_collection";
        var content = '';
        var template = null;
        var tooltipData;
        var isNodeElement = hitTarget.id.indexOf('_node_level_') > -1 && hitTarget instanceof SVGRectElement;
        if (isNodeElement) {
            // Node
            var nodeId = hitTarget.getAttribute('aria-label');
            var nodeAggregates = this.computeNodeAggregates(nodeId, hitTarget.getAttribute('fill'));
            tooltipData = {
                name: nodeAggregates.name,
                value: nodeAggregates.value,
                inValue: nodeAggregates.inValue,
                outValue: nodeAggregates.outValue
            };
            template = tooltipSettings.nodeTemplate || null;
            if (template) {
                if (typeof template === 'string') {
                    // Interpolate placeholders in string template
                    content = template
                        .replace(/\${name}/g, tooltipData.name)
                        .replace(/\${value}/g, tooltipData.value.toString())
                        .replace(/\${in}/g, tooltipData.inValue.toString())
                        .replace(/\${out}/g, tooltipData.outValue.toString());
                }
                else if (typeof template === 'function') {
                    // Call function with tooltipData
                    content = template(tooltipData);
                }
            }
            else {
                // Fallback to default format
                var defaultFormat = tooltipSettings.nodeFormat || '$name : $value';
                defaultFormat = defaultFormat
                    .replace(/\$\{name\}/g, '$name')
                    .replace(/\$\{value\}/g, '$value')
                    .replace(/\$\{in\}/g, '$in')
                    .replace(/\$\{out\}/g, '$out');
                content = defaultFormat
                    .replace(/\$name/g, nodeAggregates.name)
                    .replace(/\$value/g, nodeAggregates.value.toString())
                    .replace(/\$in/g, nodeAggregates.inValue.toString())
                    .replace(/\$out/g, nodeAggregates.outValue.toString());
            }
        }
        else if (hitTarget.tagName.toLowerCase() === 'path' &&
            hitTarget.closest("[id=\"" + linkCollectionId + "\"]")) {
            var linkPathElement = hitTarget.closest('path');
            var sourceId = linkPathElement.getAttribute('data-source');
            var targetId = linkPathElement.getAttribute('data-target');
            var valueText = linkPathElement.getAttribute('data-value');
            if (!sourceId || !targetId || valueText == null) {
                return this.hideTooltip();
            }
            var value = +valueText;
            var sourceAggregates = this.computeNodeAggregates(sourceId);
            var targetAggregates = this.computeNodeAggregates(targetId);
            tooltipData = {
                start: {
                    name: sourceAggregates.name,
                    value: sourceAggregates.value,
                    in: sourceAggregates.inValue,
                    out: sourceAggregates.outValue
                },
                target: {
                    name: targetAggregates.name,
                    value: targetAggregates.value,
                    in: targetAggregates.inValue,
                    out: targetAggregates.outValue
                },
                value: value
            }; // structure used downstream for templating
            template = tooltipSettings.linkTemplate || null;
            if (template) {
                if (typeof template === 'string') {
                    // Interpolate placeholders in string template
                    content = template
                        .replace(/\${start\.name}/g, tooltipData.start.name)
                        .replace(/\${start\.value}/g, tooltipData.start.value.toString())
                        .replace(/\${start\.in}/g, tooltipData.start.in.toString())
                        .replace(/\${start\.out}/g, tooltipData.start.out.toString())
                        .replace(/\${target\.name}/g, tooltipData.target.name)
                        .replace(/\${target\.value}/g, tooltipData.target.value.toString())
                        .replace(/\${target\.in}/g, tooltipData.target.in.toString())
                        .replace(/\${target\.out}/g, tooltipData.target.out.toString())
                        .replace(/\${value}/g, tooltipData.value.toString());
                }
                else if (typeof template === 'function') {
                    // Call function with tooltipData
                    content = template(tooltipData);
                }
            }
            else {
                // Fallback to default format
                var defaultFormat = tooltipSettings.linkFormat || '$start.name → $target.name : $value';
                // Support both ${...} and $... placeholders
                defaultFormat = defaultFormat
                    .replace(/\$\{start\.name\}/g, '$start.name')
                    .replace(/\$\{start\.value\}/g, '$start.value')
                    .replace(/\$\{start\.in\}/g, '$start.in')
                    .replace(/\$\{start\.out\}/g, '$start.out')
                    .replace(/\$\{target\.name\}/g, '$target.name')
                    .replace(/\$\{target\.value\}/g, '$target.value')
                    .replace(/\$\{target\.in\}/g, '$target.in')
                    .replace(/\$\{target\.out\}/g, '$target.out')
                    .replace(/\$\{value\}/g, '$value');
                content = defaultFormat
                    .replace(/\$start\.name/g, sourceAggregates.name)
                    .replace(/\$start\.value/g, sourceAggregates.value.toString())
                    .replace(/\$start\.in/g, sourceAggregates.inValue.toString())
                    .replace(/\$start\.out/g, sourceAggregates.outValue.toString())
                    .replace(/\$target\.name/g, targetAggregates.name)
                    .replace(/\$target\.value/g, targetAggregates.value.toString())
                    .replace(/\$target\.in/g, targetAggregates.inValue.toString())
                    .replace(/\$target\.out/g, targetAggregates.outValue.toString())
                    .replace(/\$value/g, value.toString());
            }
        }
        else {
            return this.hideTooltip();
        }
        // Trigger tooltipRendering event
        var eventNode = null;
        var eventLink = null;
        if (hitTarget.id.indexOf(nodeElementIdPrefix) === 0) {
            var nodeId = hitTarget.getAttribute('aria-label');
            var matchedNode = null;
            var nodesArray = sankeyChart.nodes;
            for (var i = 0; i < nodesArray.length; i++) {
                var candidate = nodesArray[i];
                if (candidate && candidate.id === nodeId) {
                    matchedNode = candidate;
                    break;
                }
            }
            eventNode = matchedNode;
        }
        else if (hitTarget.tagName.toLowerCase() === 'path' && hitTarget.closest("[id=\"" + linkCollectionId + "\"]")) {
            var sourceAttr = hitTarget.getAttribute('data-source');
            var targetAttr = hitTarget.getAttribute('data-target');
            var matchedLink = null;
            var linksArray = sankeyChart.links;
            for (var i = 0; i < linksArray.length; i++) {
                var candidate = linksArray[i];
                if (candidate && candidate.sourceId === sourceAttr && candidate.targetId === targetAttr) {
                    matchedLink = candidate;
                    break;
                }
            }
            eventLink = matchedLink;
        }
        var tooltipRenderArgs = {
            text: content,
            node: eventNode,
            link: eventLink
        };
        sankeyChart.trigger('tooltipRendering', tooltipRenderArgs);
        content = tooltipRenderArgs.text;
        // Container
        var tooltipContainer = document.getElementById(sankeyChart.element.id + "_tooltip_parent");
        if (!tooltipContainer) {
            tooltipContainer = document.createElement('div');
            tooltipContainer.id = sankeyChart.element.id + "_tooltip_parent";
            tooltipContainer.style.cssText = 'position:absolute; left:0; top:0; pointer-events:none; z-index:100;';
            sankeyChart.element.appendChild(tooltipContainer); // attach to chart root for consistent offsets
        }
        // Assemble config - Note: Set template to undefined to use content as HTML
        var tooltipConfig = {
            opacity: tooltipSettings.opacity,
            header: '',
            content: [content],
            fill: tooltipSettings.fill,
            location: location,
            offset: 0,
            enableAnimation: tooltipSettings.enableAnimation,
            shared: false,
            crosshair: false,
            clipBounds: sankeyChart.initialClipRect,
            areaBounds: sankeyChart.initialClipRect,
            template: undefined,
            theme: sankeyChart.theme,
            textStyle: tooltipSettings.textStyle,
            isCanvas: false,
            isFixed: false,
            controlName: 'Sankey',
            enableRTL: sankeyChart.enableRtl,
            arrowPadding: 0,
            availableSize: sankeyChart.availableSize
        };
        // Show or update
        if (isInitialRender || !this.svgTooltip) {
            this.svgTooltip = new SVGTooltip(tooltipConfig);
            this.svgTooltip.appendTo(tooltipContainer);
        }
        else {
            for (var key in tooltipConfig) {
                if (Object.prototype.hasOwnProperty.call(tooltipConfig, key)) {
                    (this.svgTooltip)[key] = (tooltipConfig)[key];
                }
            }
            this.svgTooltip.dataBind();
        }
    };
    /**
     * Triggers tooltip rendering logic when a mouse or pointer release
     * action occurs inside the Sankey chart series area.
     *
     * @param {PointerEvent} event - The mouse or pointer up event within the chart.
     * @returns {void}
     *
     * @private
     */
    SankeyTooltip.prototype.handlePointerUp = function (event) {
        var sankeyChart = this.sankey;
        if (!sankeyChart.tooltip.enable) {
            return;
        }
        if (sankeyChart.isTouch && withInBounds(sankeyChart.mouseX, sankeyChart.mouseY, sankeyChart.initialClipRect)) {
            this.renderTooltip(true, event);
            if (sankeyChart.tooltip.fadeOutMode === 'Move') {
                this.hideTooltip(sankeyChart.tooltip.fadeOutDuration);
            }
        }
        else if (sankeyChart.tooltip.fadeOutMode === 'Click') {
            this.hideTooltip(0);
        }
    };
    /**
     * Resolves the nearest interactive SVG element (node or link) starting from the given element.
     *
     * @param {string} chartId - The root chart element id used to construct node ids from label ids.
     * @param {Element | null} startElement - The starting element to inspect and traverse from.
     * @returns {Element | null }} The resolved element and its type ('node' or 'link').
     *
     * @private
     */
    SankeyTooltip.prototype.resolveInteractiveTarget = function (chartId, startElement) {
        var currentElement = startElement;
        while (currentElement && currentElement !== document.body) {
            var elementId = currentElement.getAttribute('id') || '';
            if (elementId.indexOf('_node_level_') > -1 && currentElement instanceof SVGRectElement) {
                return { element: currentElement, type: 'node' };
            }
            if (elementId.indexOf('_link_level_') > -1) {
                var pathElement = currentElement.closest('path');
                return { element: pathElement || currentElement, type: 'link' };
            }
            if (elementId.indexOf('_label_level_') > -1) {
                var idParts = elementId.split('_');
                var level = idParts[idParts.length - 2];
                var index = idParts[idParts.length - 1];
                var nodeId = chartId + "_node_level_" + level + "_" + index;
                var nodeElement = document.getElementById(nodeId);
                if (nodeElement instanceof SVGRectElement) {
                    return { element: nodeElement, type: 'node' };
                }
            }
            currentElement = currentElement.parentElement;
        }
        return { element: null, type: null };
    };
    /**
     * Triggers tooltip hiding if mouse away from chart series area.
     *
     * @returns {void}
     * @private
     */
    SankeyTooltip.prototype.handlePointerLeave = function () {
        this.hideTooltip(this.sankey.tooltip.fadeOutDuration);
    };
    /**
     * Triggers tooltip rendering logic when a mouse or pointer action
     * occurs within the Sankey chart series area.
     *
     * Determines the nearest interactive Sankey element (node or link)
     * based on the event target and renders or hideTooltips the tooltip accordingly.
     *
     * @param {boolean} isInitialRender - Indicates whether the tooltip is being rendered for the first time.
     * @param {PointerEvent} event - The mouse or pointer event occurring inside the chart.
     * @returns {void}
     * @private
     */
    SankeyTooltip.prototype.renderTooltip = function (isInitialRender, event) {
        var targetElement = event.target;
        if (!targetElement) {
            this.hideTooltip();
            return;
        }
        var resolvedElement = this.resolveInteractiveTarget(this.sankey.element.id, targetElement);
        var interactiveElement = resolvedElement.element;
        if (interactiveElement) {
            this.showTooltipForElement(interactiveElement, isInitialRender);
        }
        else {
            // Hide tooltip only when the pointer is outside interactive Sankey element
            this.hideTooltip(this.sankey.tooltip.fadeOutDuration);
        }
    };
    /**
     * Computes aggregated metrics for a Sankey node to be used in tooltip content.
     *
     * Calculates total inbound and outbound values for the given node id,
     * and resolves its display name and color (if provided).
     *
     * @param {string} nodeId - The Sankey node identifier to aggregate values for.
     * @param {string} [color] - Optional color associated with the node.
     * @returns {SankeyNodeAggregates} Aggregated values for the specified node.
     * @private
     */
    SankeyTooltip.prototype.computeNodeAggregates = function (nodeId, color) {
        var inValue = 0;
        var outValue = 0;
        // Sum inbound and outbound values for the node
        for (var _i = 0, _a = this.sankey.links; _i < _a.length; _i++) {
            var link = _a[_i];
            if (link.targetId === nodeId) {
                inValue += link.value;
            }
            if (link.sourceId === nodeId) {
                outValue += link.value;
            }
        }
        // Find matching node metadata (for display name / color)
        var matchedNode = null;
        var nodesArray = this.sankey.nodes;
        for (var i = 0; i < nodesArray.length; i++) {
            if (nodesArray[i].id === nodeId) {
                matchedNode = nodesArray[i];
                break;
            }
        }
        var matchedNodeLayout = this.sankey.nodeLayoutMap[matchedNode && matchedNode.id];
        return {
            id: nodeId,
            name: (matchedNode && matchedNode.label.text) ? matchedNode.label.text : (matchedNodeLayout && matchedNodeLayout.label) ?
                matchedNodeLayout.label : nodeId,
            inValue: inValue,
            outValue: outValue,
            value: Math.max(inValue, outValue),
            color: color
        };
    };
    /**
     * Hides the tooltip after the specified delay.
     *
     * @param {number} delay - The delay in milliseconds before hiding the tooltip.
     * @returns {void}
     * @private
     */
    SankeyTooltip.prototype.hideTooltip = function (delay) {
        var _this = this;
        if (delay === void 0) { delay = this.sankey.tooltip.fadeOutDuration; }
        clearTimeout(this.tooltipTimer);
        if (this.svgTooltip) {
            this.tooltipTimer = window.setTimeout(function () {
                if (_this.svgTooltip) {
                    _this.svgTooltip.fadeOut();
                }
                setTimeout(function () {
                    _this.svgTooltip = null; // Ensure tooltip reference is cleared after animation
                }, 400);
            }, delay);
        }
    };
    /**
     * Get module name.
     *
     * @returns {string} - Returns the module name.
     */
    SankeyTooltip.prototype.getModuleName = function () {
        return 'SankeyTooltip';
    };
    /**
     * To destroy the tooltip.
     *
     * @returns {void}
     * @private
     */
    SankeyTooltip.prototype.destroy = function () {
        this.unwireEvents(); // ensure detach
    };
    return SankeyTooltip;
}());
export { SankeyTooltip };

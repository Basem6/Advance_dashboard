var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Component, Property, NotifyPropertyChanges, Internationalization, Complex, Browser, EventHandler, Collection, Event } from '@syncfusion/ej2-base';
import { Margin, Border, Accessibility, Animation } from '../common/model/base';
import { Rect, Size, SvgRenderer, TextOption, measureText } from '@syncfusion/ej2-svg-base';
import { appendChildElement, createSvg, getTextAnchor, getTitle, textElement, titlePositionX, ImageOption, redrawElement } from '../common/utils/helper';
import { RectOption, removeElement } from '../common/utils/helper';
import { SankeySeries } from './series/series';
import { SankeyLabelSettings, SankeyLinkSettings, SankeyNodeSettings, SankeyTitleStyle, SankeyLegendSettings, SankeyTooltipSettings, SankeyNode, SankeyLink } from './model/sankey-base';
import { SankeyTooltip } from './user-interaction/tooltip';
import { PrintUtils } from '../common/utils/print';
import { SankeyHighlight } from './user-interaction/highlight';
import { getSankeyThemeColor } from './model/sankey-theme';
/**
 * Represents the Sankey diagram control for visualizing flow quantities between entities.
 *
 * const sankey = new Sankey({
 *   nodes: [
 *     { id: 'A', label: 'Source A' },
 *     { id: 'B', label: 'Process B' },
 *     { id: 'C', label: 'Destination C' }
 *   ],
 *   links: [
 *     { source: 'A', target: 'B', value: 40 },
 *     { source: 'B', target: 'C', value: 35 },
 *     { source: 'A', target: 'C', value: 5 }
 *   ],
 *   orientation: 'Horizontal,
 *   tooltip: { enabled: true }
 * });
 *
 * @public
 */
var Sankey = /** @class */ (function (_super) {
    __extends(Sankey, _super);
    /**
     * Initializes the Sankey chart instance and its core modules.
     *
     * @param {SankeyModel} [options] - The Sankey configuration model used to initialize the component.
     * @param {string | HTMLElement} [element] - The host element or element id used to render the component.
     * @private
     */
    function Sankey(options, element) {
        var _this = _super.call(this, options, element) || this;
        /** @private */
        _this.previousTargetId = '';
        /** @private */
        _this.currentGroup = null;
        /** @private */
        _this.currentNodeIndex = 0;
        /** @private */
        _this.currentLinkIndex = 0;
        /** @private */
        _this.currentLegendIndex = 0;
        /** @private */
        _this.resizeBound = null;
        /**
         * Holds the currently hovered Sankey node instance.
         *
         * @private
         */
        _this.hoveredNode = null;
        /**
         * Holds the currently hovered Sankey link instance.
         *
         * @private
         */
        _this.hoveredLink = null;
        _this.sankeySeriesModule = new SankeySeries(_this);
        return _this;
    }
    /**
     * Prepares the Sankey component for rendering by wiring events, applying culture/RTL settings, and computing available size.
     *
     * @returns {void}
     * @private
     */
    Sankey.prototype.preRender = function () {
        this.allowServerDataBinding = false;
        this.unWireEvents();
        this.setCulture();
        this.wireEvents();
        if (this.element && this.element.className.indexOf('e-sankey') === -1) {
            this.element.classList.add('e-sankey');
        }
        this.element.setAttribute('dir', this.enableRtl ? 'rtl' : 'ltr');
        this.element.style.outline = 'none';
        this.animateSeries = true;
        this.calculateAvailableSize();
    };
    /**
     * Renders the Sankey component by initializing SVG, computing nodes/legend/bounds, and drawing visual elements.
     *
     * @returns {void}
     * @private
     */
    Sankey.prototype.render = function () {
        var _this = this;
        var loadEventData = {
            chart: this, theme: this.theme, cancel: false
        };
        this.element.setAttribute('role', this.accessibility.accessibilityRole || 'region');
        this.element.setAttribute('tabindex', this.accessibility.focusable ? String(this.accessibility.tabIndex) : '-1');
        var regionLabel = this.accessibility.accessibilityDescription
            || (this.title ? this.title + ". Interactive Sankey diagram." : 'Interactive Sankey diagram.');
        this.element.setAttribute('aria-label', regionLabel);
        // Trigger `load` event and proceed with rendering inside the callback
        this.trigger('load', loadEventData, function () {
            _this.renderer = new SvgRenderer(_this.element.id);
            _this.setTheme();
            _this.calculateAvailableSize();
            _this.createChartSvg();
            if (!_this.sankeySeriesModule) {
                _this.sankeySeriesModule = new SankeySeries(_this);
            }
            if (_this.sankeyHighlightModule) {
                _this.sankeyHighlightModule.destroy();
                _this.sankeyHighlightModule = null;
            }
            if (_this.linkStyle && (_this.linkStyle.highlightOpacity !== _this.linkStyle.opacity
                || _this.linkStyle.inactiveOpacity !== _this.linkStyle.opacity) ||
                (_this.nodeStyle && (_this.nodeStyle.highlightOpacity !== _this.nodeStyle.opacity
                    || _this.nodeStyle.inactiveOpacity !== _this.nodeStyle.opacity))) {
                _this.sankeyHighlightModule = new SankeyHighlight(_this);
            }
            _this.nodeLayoutMap = _this.sankeySeriesModule.buildNodes(_this.links, _this);
            if (_this.sankeyLegendModule && _this.legendSettings.visible) {
                _this.sankeyLegendModule.getLegendOptions(_this);
            }
            _this.calculateBounds();
            _this.renderElements();
            _this.allowServerDataBinding = true;
        });
    };
    /**
     * Creates the chart SVG by removing the existing SVG and initializing a new one.
     *
     * @returns {void}
     * @private
     */
    Sankey.prototype.createChartSvg = function () { this.removeSvg(); createSvg(this); };
    /**
     * Removes the existing SVG and tooltip parent element from the DOM.
     *
     * @returns {void}
     * @private
     */
    Sankey.prototype.removeSvg = function () {
        removeElement(this.element.id + '_tooltip_parent');
        if (this.svgObject) {
            while (this.svgObject.childNodes.length) {
                this.svgObject.removeChild(this.svgObject.firstChild);
            }
        }
    };
    /**
     * Creates the secondary tooltip container element used for rendering tooltip content.
     *
     * @returns {void}
     * @private
     */
    Sankey.prototype.createSecondaryElement = function () {
        if (this.element.tagName !== 'g') {
            var tooltipDiv = redrawElement(false, this.element.id + '_Secondary_Element') ||
                this.createElement('div');
            tooltipDiv.id = this.element.id + '_Secondary_Element';
            tooltipDiv.style.cssText = 'position: relative';
            var tooltipHostElement = document.getElementById(this.element.id + '_tooltip_parent');
            if (!tooltipHostElement) {
                tooltipHostElement = document.createElement('div');
                tooltipHostElement.id = this.element.id + '_tooltip_parent';
                tooltipHostElement.style.cssText = " position: absolute; left: 0; top: 0; pointer-events: none;\n            z-index: 100; overflow: hidden; contain: layout style paint; ";
                appendChildElement(false, tooltipDiv, tooltipHostElement, false);
            }
            appendChildElement(false, this.element, tooltipDiv, false);
        }
    };
    /**
     * Positions and applies required styles to the secondary tooltip container element.
     *
     * @returns {void}
     */
    Sankey.prototype.positionSecondaryElement = function () {
        var secondaryElement = document.getElementById((this.element ? this.element.id : '') + '_tooltip_parent');
        if (!secondaryElement || !this.svgObject) {
            return;
        }
        secondaryElement.style.left = '0px';
        secondaryElement.style.top = '0px';
        secondaryElement.style.position = 'absolute';
        secondaryElement.style.pointerEvents = 'none';
        secondaryElement.style.zIndex = '1';
        secondaryElement.style.overflow = 'hidden';
    };
    /**
     * Calculates the initial clip rect and legend bounds based on margins, borders, titles, and available size.
     *
     * @returns {void}
     */
    Sankey.prototype.calculateBounds = function () {
        this.calculateAvailableSize();
        var margin = this.margin;
        var titleHeight = 0;
        var subTitleHeight = 0;
        var titlePadding = 10;
        var borderWidth = (this.border && this.border.width);
        var clipLeft = (margin.left) + borderWidth;
        var clipWidth = this.availableSize.width - clipLeft - (margin.right) - borderWidth;
        var clipTop = (margin.top) + borderWidth;
        var clipHeight = this.availableSize.height - clipTop - borderWidth - (margin.bottom);
        var titleCollection = this.title ? getTitle(this.title, this.titleStyle, clipWidth, this.enableRtl, this.themeStyle.chartTitleFont) : [];
        if (this.title) {
            titleHeight = (measureText(this.title, this.titleStyle, this.themeStyle.chartTitleFont).height
                * titleCollection.length) + titlePadding;
            if (this.subTitle) {
                var subTitleCollection = getTitle(this.subTitle, this.subTitleStyle, clipWidth, this.enableRtl, this.themeStyle.chartSubTitleFont);
                // use consistent 10px gap between title and subtitle lines
                subTitleHeight = (measureText(this.subTitle, this.subTitleStyle, this.themeStyle.chartSubTitleFont).height
                    * subTitleCollection.length) + 10;
            }
        }
        var totalTitlesHeight = titleHeight + subTitleHeight;
        clipTop += totalTitlesHeight;
        clipHeight -= totalTitlesHeight; // place titles on top by default
        this.initialClipRect = new Rect(clipLeft, clipTop, Math.max(0, clipWidth), Math.max(0, clipHeight));
        if (this.sankeyLegendModule && this.legendSettings.visible) {
            this.sankeyLegendModule.calculateLegendBounds(this.initialClipRect, this.availableSize, null);
        }
    };
    /**
     * Renders all visual elements of the Sankey chart including border, title, series, legend, and accessibility features.
     *
     * @returns {void}
     */
    Sankey.prototype.renderElements = function () {
        this.renderBorder();
        this.renderTitle();
        this.createSecondaryElement();
        if (!this.element.contains(this.svgObject)) {
            this.element.appendChild(this.svgObject);
        }
        if (this.sankeySeriesModule && this.initialClipRect && this.links && this.links.length > 0) {
            this.sankeySeriesModule.render(this);
        }
        this.renderLegend();
        this.positionSecondaryElement();
        this.initKeyboardTabOrder();
        this.trigger('loaded', { chart: this, theme: this.theme });
    };
    /**
     * Renders the chart border and background (including optional background image) into the SVG.
     *
     * @returns {void}
     */
    Sankey.prototype.renderBorder = function () {
        var padding = this.border.width;
        var borderRectOptions = new RectOption(this.element.id + '_border', this.background || this.themeStyle.background, this.border, 1, new Rect(padding / 2, padding / 2, this.availableSize.width - padding, this.availableSize.height - padding), 0, 0, '', this.border.dashArray);
        var borderElement = this.renderer.drawRectangle(borderRectOptions);
        borderElement.setAttribute('aria-hidden', 'true');
        appendChildElement(false, this.svgObject, borderElement, false);
        if (this.backgroundImage) {
            var backgroundImageOptions = new ImageOption(this.availableSize.height - padding, this.availableSize.width - padding, this.backgroundImage, 0, 0, this.element.id + '_background', 'visible', 'none');
            var backgroundImageElement = this.renderer.drawImage(backgroundImageOptions);
            backgroundImageElement.setAttribute('aria-hidden', 'true');
            appendChildElement(false, this.svgObject, backgroundImageElement, false);
        }
    };
    /**
     * Renders the chart title and subtitle text elements with accessibility attributes applied.
     *
     * @returns {void}
     */
    Sankey.prototype.renderTitle = function () {
        if (!this.title && !this.subTitle) {
            return;
        }
        var margin = this.margin;
        var titleRect = new Rect(margin.left, 0, (this.availableSize.width - (margin.left) - (margin.right)), 0);
        var titleTextSize = this.title ? measureText(this.title, this.titleStyle, this.themeStyle.chartTitleFont) : new Size(0, 0);
        var titleCollection = this.title
            ? getTitle(this.title, this.titleStyle, titleRect.width, this.enableRtl, this.themeStyle.chartTitleFont)
            : [];
        var titleX = titlePositionX(titleRect, this.titleStyle);
        var titleY = (margin.top) + ((titleTextSize.height) * 3 / 4);
        if (this.title) {
            var titleTextOptions = new TextOption(this.element.id + '_title', titleX, titleY, getTextAnchor(this.titleStyle.textAlignment, this.enableRtl), titleCollection, undefined, 'auto');
            var titleTextElement = textElement(this.renderer, titleTextOptions, this.titleStyle, this.titleStyle.color || this.themeStyle.chartTitleFont.color, this.svgObject, null, null, null, null, null, null, null, null, false, null, this.themeStyle.chartTitleFont);
            titleTextElement.setAttribute('role', 'heading');
            titleTextElement.setAttribute('aria-level', '1');
            titleTextElement.setAttribute('tabindex', '-1'); // Readable but non-focusable
            titleTextElement.setAttribute('aria-label', this.title);
        }
        if (this.subTitle) {
            var subTitleCollection = getTitle(this.subTitle, this.subTitleStyle, titleRect.width, this.enableRtl, this.themeStyle.chartSubTitleFont);
            var subTitleLineSize = measureText(this.subTitle, this.subTitleStyle, this.themeStyle.chartSubTitleFont);
            var titleLines = this.title ? (titleCollection.length || 1) : 0;
            var subTitleY = this.title
                ? (margin.top + (titleTextSize.height * 3 / 4) + (titleTextSize.height * titleLines) + 10)
                : (margin.top + (subTitleLineSize.height * 3 / 4));
            var subAlign = (this.subTitleStyle && this.subTitleStyle.textAlignment) ? this.subTitleStyle.textAlignment : 'Center';
            var subTitleX = titlePositionX(titleRect, { textAlignment: subAlign });
            var subTitleTextOptions = new TextOption(this.element.id + '_subtitle', subTitleX, subTitleY, getTextAnchor(subAlign, this.enableRtl), subTitleCollection, undefined, 'auto');
            var subTitleTextElement = textElement(this.renderer, subTitleTextOptions, this.subTitleStyle, this.subTitleStyle.color || this.themeStyle.chartSubTitleFont.color, this.svgObject, null, null, null, null, null, null, null, null, false, null, this.themeStyle.chartSubTitleFont);
            subTitleTextElement.setAttribute('role', 'heading');
            subTitleTextElement.setAttribute('aria-level', '2');
            subTitleTextElement.setAttribute('tabindex', '-1');
            subTitleTextElement.setAttribute('aria-label', this.subTitle);
        }
    };
    /**
     * Renders the Sankey legend if the legend module is available and legend visibility is enabled.
     *
     * @returns {void}
     */
    Sankey.prototype.renderLegend = function () {
        if (this.sankeyLegendModule && this.sankeyLegendModule.legendCollections.length &&
            this.legendSettings.visible) {
            this.sankeyLegendModule.calTotalPage = true;
            var legendBounds = this.sankeyLegendModule.legendBounds;
            this.sankeyLegendModule.renderLegend(this, this.legendSettings, legendBounds);
        }
    };
    /**
     * Finds and returns a user-defined node by id from the nodes collection.
     *
     * @param {string} id - The node id used to locate the node definition.
     * @returns {SankeyNode | null} returns node if present, else null.
     * @private
     */
    Sankey.prototype.findNode = function (id) {
        var nodesArray = Array.isArray(this.nodes) ? this.nodes : [];
        for (var nodeIndex = 0; nodeIndex < nodesArray.length; nodeIndex++) {
            if (nodesArray[nodeIndex] && nodesArray[nodeIndex].id === id) {
                return nodesArray[nodeIndex];
            }
        }
        return null;
    };
    // helper: find link by source/target
    /**
     * Finds and returns a user-defined link by source and target ids from the links collection.
     *
     * @param {string} sourceId - The source node id used to locate the link definition.
     * @param {string} targetId - The target node id used to locate the link definition.
     * @returns {SankeyLink | null} returns link if present, else null.
     *
     * @private
     */
    Sankey.prototype.findLink = function (sourceId, targetId) {
        var linksArray = Array.isArray(this.links) ? this.links : [];
        for (var linkIndex = 0; linkIndex < linksArray.length; linkIndex++) {
            var currentLink = linksArray[linkIndex];
            if (currentLink && currentLink.sourceId === sourceId &&
                currentLink.targetId === targetId) {
                return currentLink;
            }
        }
        return null;
    };
    /**
     * Initializes the internationalization instance used by the component.
     *
     * @returns {void}
     */
    Sankey.prototype.setCulture = function () { this.intl = new Internationalization(); };
    /**
     * Applies theme styles for the current chart theme.
     *
     * @returns {void}
     */
    Sankey.prototype.setTheme = function () { this.themeStyle = getSankeyThemeColor(this.theme); };
    /**
     * Calculates the available rendering size based on configured width/height or element client size.
     *
     * @returns {void}
     *
     * @private
     */
    Sankey.prototype.calculateAvailableSize = function () {
        var _this = this;
        // Use given width/height or fall back to parent/client size, defaulting to 600x450 when zero
        var parseSize = function (v, fallback, client) {
            if (!v) {
                return client > 0 ? client : fallback;
            }
            var sizeText = v.toString();
            if (sizeText.indexOf('%') > -1) {
                var percent = parseFloat(sizeText);
                var base = (_this.element && _this.element.parentElement) ? _this.element.parentElement.clientWidth : client;
                var value = (isNaN(percent) ? 100 : percent) / 100 * base;
                return value > 0 ? value : fallback;
            }
            var pixelValue = parseFloat(sizeText);
            return (pixelValue > 0 ? pixelValue : (client > 0 ? client : fallback));
        };
        var clientWidth = this.element ? this.element.clientWidth : 0;
        var clientHeight = this.element ? this.element.clientHeight : 0;
        var computedWidth = parseSize(this.width, 600, clientWidth);
        var computedHeight = parseSize(this.height, 450, clientHeight);
        this.availableSize = new Size(computedWidth, computedHeight);
    };
    /**
     * Unbinds all DOM and window event listeners attached for Sankey interactions.
     *
     * @returns {void}
     *
     * @private
     */
    Sankey.prototype.unWireEvents = function () {
        var touchStartEvent = Browser.touchStartEvent;
        var touchMoveEvent = Browser.touchMoveEvent;
        var touchEndEvent = Browser.touchEndEvent;
        var pointerLeaveOrMouseLeaveEvent = Browser.isPointer ? 'pointerleave' : 'mouseleave';
        /** UnBind the Event handler */
        EventHandler.remove(this.element, touchStartEvent, this.handleMouseDown);
        EventHandler.remove(this.element, touchMoveEvent, this.mouseMove);
        EventHandler.remove(this.element, touchEndEvent, this.mouseEnd);
        EventHandler.remove(this.element, 'click', this.handleMouseClick);
        EventHandler.remove(this.element, pointerLeaveOrMouseLeaveEvent, this.mouseLeave);
        EventHandler.remove(this.element, 'keydown', this.handleKeyDown);
        EventHandler.remove(document.body, 'keydown', this.handleDocumentKeyDown);
        EventHandler.remove(this.element, 'keyup', this.handleKeyUp);
        EventHandler.remove(this.element, 'focusin', this.handleFocusIn);
        window.removeEventListener((Browser.isTouch && ('orientation' in window && 'onorientationchange' in window)) ? 'orientationchange' : 'resize', this.resizeBound);
    };
    /**
     * Binds all required DOM and window event listeners for Sankey interactions.
     *
     * @returns {void}
     *
     * @private
     */
    Sankey.prototype.wireEvents = function () {
        /**
         * To fix react timeout destroy issue.
         */
        if (!this.element) {
            return;
        }
        /** Find the Events type */
        var pointerLeaveOrMouseLeaveEvent = Browser.isPointer ? 'pointerleave' : 'mouseleave';
        /** Bind the Event handler */
        EventHandler.add(this.element, Browser.touchStartEvent, this.handleMouseDown, this);
        EventHandler.add(this.element, Browser.touchMoveEvent, this.mouseMove, this);
        EventHandler.add(this.element, Browser.touchEndEvent, this.mouseEnd, this);
        EventHandler.add(this.element, 'click', this.handleMouseClick, this);
        EventHandler.add(this.element, pointerLeaveOrMouseLeaveEvent, this.mouseLeave, this);
        this.resizeBound = this.chartResize.bind(this);
        window.addEventListener((Browser.isTouch && ('orientation' in window && 'onorientationchange' in window)) ? 'orientationchange' : 'resize', this.resizeBound);
        EventHandler.add(this.element, 'keydown', this.handleKeyDown, this);
        EventHandler.add(document.body, 'keydown', this.handleDocumentKeyDown, this); // optional Alt+J
        EventHandler.add(this.element, 'keyup', this.handleKeyUp, this);
        EventHandler.add(this.element, 'focusin', this.handleFocusIn, this);
        this.element.addEventListener('pointermove', this.handlePointerMove.bind(this));
        this.element.addEventListener('pointerup', this.handlePointerUp.bind(this));
        this.element.addEventListener('pointerleave', this.handlePointerLeave.bind(this));
        this.setStyle(this.element);
    };
    /**
     * Applying styles for sankey chart element.
     *
     * @param {HTMLElement} element - Specifies the element.
     * @returns {void}
     */
    Sankey.prototype.setStyle = function (element) {
        element.style.touchAction = 'element';
        element.style.msTouchAction = 'element';
        element.style.msContentZooming = 'none';
        element.style.msUserSelect = 'none';
        element.style.webkitUserSelect = 'none';
        element.style.position = 'relative';
        element.style.display = 'block';
        element.style.overflow = 'hidden';
        element.style.height = (element.style.height || (this.height && this.height.indexOf('%') === -1)) ? element.style.height : 'inherit';
    };
    /**
     * Handles document-level keyboard shortcuts for the Sankey chart.
     *
     * Moves focus to the chart container when the Alt + J key combination is pressed
     * and applies the container navigation focus styling.
     *
     * @param {KeyboardEvent} keyboardEvent - The keyboard event triggered on the document.
     * @returns {void}
     *
     * @private
     */
    Sankey.prototype.handleDocumentKeyDown = function (keyboardEvent) {
        if (keyboardEvent.altKey && keyboardEvent.key.toLowerCase() === 'j' && this.element) {
            this.element.focus();
            this.clearNavigationStyles();
            this.setContainerNavigationStyle();
        }
    };
    /**
     * Applies keyboard navigation focus styling to the Sankey chart container.
     *
     * @returns {void}
     *
     * @private
     */
    Sankey.prototype.setContainerNavigationStyle = function () {
        var chartElement = this.element;
        var focusColor = this.focusBorderColor || this.themeStyle.tabColor;
        chartElement.style.setProperty('outline', this.focusBorderWidth + "px solid " + focusColor);
        chartElement.style.setProperty('outline-offset', this.focusBorderMargin + "px");
    };
    /**
     * Handles pointer or mouse move events on the chart area.
     *
     * Updates the internal mouse position used for hit-testing
     * and tooltip positioning.
     *
     * @param {PointerEvent | MouseEvent} event - The pointer or mouse move event.
     * @returns {boolean} Returns false to prevent further propagation.
     */
    Sankey.prototype.handlePointerMove = function (event) {
        this.updateMousePosition(event);
        this.notify(Browser.touchMoveEvent, event);
        return false;
    };
    /**
     * Handles pointer or mouse up events on the chart area.
     *
     * Updates the internal mouse position used for interaction handling.
     *
     * @param {PointerEvent | MouseEvent} event - The pointer or mouse up event.
     * @returns {boolean} Returns false to prevent further propagation.
     */
    Sankey.prototype.handlePointerUp = function (event) {
        this.updateMousePosition(event);
        this.notify(Browser.touchEndEvent, event);
        return false;
    };
    /**
     * Handles pointer or mouse leave events on the chart area.
     *
     * Updates the mouse position (if available) and resets
     * the internal pointer movement state.
     *
     * @param {PointerEvent | MouseEvent} [event] - The optional pointer or mouse leave event.
     * @returns {boolean} Returns false to prevent further propagation.
     *
     * @private
     */
    Sankey.prototype.handlePointerLeave = function (event) {
        if (event) {
            this.updateMousePosition(event);
            this.notify(Browser.isPointer ? 'pointerleave' : 'mouseleave', event);
        }
        this.startMove = false;
        return false;
    };
    /**
     * Handles window resize by recalculating available size, triggering sizeChanged, and re-rendering only when dimensions differ.
     *
     * @returns {boolean} returns boolean based on chart resize actions.
     *
     * @private
     */
    Sankey.prototype.chartResize = function () {
        this.animateSeries = false;
        var previousAvailableSize = new Size(this.availableSize.width, this.availableSize.height);
        // Recompute available size first
        this.calculateAvailableSize();
        // If size hasn't changed, skip a full re-render but still update secondary elements and emit sizeChanged
        var isSizeChanged = (previousAvailableSize.width !== this.availableSize.width) ||
            (previousAvailableSize.height !== this.availableSize.height);
        // Trigger sizeChanged event regardless
        var sizeChangedEventArgs = {
            previousSize: previousAvailableSize,
            currentSize: this.availableSize
        };
        this.trigger('sizeChanged', sizeChangedEventArgs);
        // If the chart size actually changed, recreate svg and re-render all elements
        if (isSizeChanged) {
            // recreate renderer + svg to ensure correct dimensions
            this.renderer = new SvgRenderer(this.element.id);
            this.setTheme();
            this.createChartSvg();
            this.nodeLayoutMap = this.sankeySeriesModule.buildNodes(this.links, this);
            if (this.sankeyLegendModule && this.legendSettings.visible) {
                this.sankeyLegendModule.getLegendOptions(this);
            }
            this.calculateBounds();
            this.renderElements();
        }
        else {
            // Update secondary DOM positions and clear tooltip state
            this.positionSecondaryElement();
            if (this.tooltipModule) {
                this.tooltipModule.svgTooltip = null;
            }
        }
        return false;
    };
    /**
     * Sets the mouse coordinates relative to the chart SVG for pointer and mouse events.
     *
     * @param {PointerEvent | MouseEvent} event - Mouse/pointer event with client coordinates.
     * @returns {void}
     *
     * @private
     */
    Sankey.prototype.updateMousePosition = function (event) {
        var svgHostElement = this.svgObject;
        if (!svgHostElement || !event) {
            return;
        }
        var svgClientRect = svgHostElement.getBoundingClientRect();
        var clientX = event.clientX;
        var clientY = event.clientY;
        this.mouseX = clientX - svgClientRect.left;
        this.mouseY = clientY - svgClientRect.top;
    };
    /**
     * Tracks pointer/touch movement, updates chart-relative mouse coordinates, and forwards the move event to the chart handler.
     *
     * @param {(PointerEvent | TouchEvent)} event - Pointer or touch move event containing client coordinates.
     * @returns {boolean} returns boolean based on mouse actions.
     *
     * @private
     */
    Sankey.prototype.mouseMove = function (event) {
        var clientX;
        var clientY;
        if (event.type === 'touchmove') {
            this.isTouch = true;
            var touchMoveEvent = event;
            clientX = touchMoveEvent.changedTouches[0].clientX;
            clientY = touchMoveEvent.changedTouches[0].clientY;
        }
        else {
            var pointerMoveEvent = event;
            this.isTouch = (pointerMoveEvent.pointerType === 'touch' || pointerMoveEvent.pointerType === '2') || this.isTouch;
            clientX = pointerMoveEvent.clientX;
            clientY = pointerMoveEvent.clientY;
        }
        this.updateMousePosition({ clientX: clientX, clientY: clientY });
        if (this.handleMouseMove) {
            this.handleMouseMove(event);
        }
        return false;
    };
    /**
     * Tracks pointer/touch end, updates chart-relative mouse coordinates, and forwards the end event to the mouse-leave handler.
     *
     * @param {(PointerEvent | TouchEvent)} event - Pointer or touch end event containing client coordinates.
     * @returns {boolean} returns boolean based on mouse actions.
     *
     * @private
     */
    Sankey.prototype.mouseEnd = function (event) {
        var clientX;
        var clientY;
        if (event.type === 'touchend') {
            var touchEndEvent = event;
            clientX = touchEndEvent.changedTouches[0].clientX;
            clientY = touchEndEvent.changedTouches[0].clientY;
            this.isTouch = true;
        }
        else {
            var pointerEndEvent = event;
            clientX = pointerEndEvent.clientX;
            clientY = pointerEndEvent.clientY;
            this.isTouch = (pointerEndEvent.pointerType === 'touch' || pointerEndEvent.pointerType === '2');
        }
        this.updateMousePosition({ clientX: clientX, clientY: clientY });
        if (event.type === 'touchend') {
            this.notify(Browser.touchEndEvent, event);
        }
        return false;
    };
    /**
     * Handles mouse move interactions over the Sankey chart.
     *
     * Detects whether the pointer is over a node or a link, triggers the corresponding
     * enter/leave events, and maintains the current hovered node/link state.
     *
     * @param {MouseEvent} event - The mouse move event dispatched on the chart.
     * @returns {boolean} Always returns false to prevent default propagation in the control.
     *
     * @private
     */
    Sankey.prototype.handleMouseMove = function (event) {
        this.updateMousePosition(event);
        var targetElement = event.target;
        var nodeIdPrefix = this.element.id + "_node_";
        var linkGroupId = this.element.id + "_link_collection";
        // Node hit
        if (targetElement && targetElement.id && targetElement.id.indexOf(nodeIdPrefix) === 0) {
            var nodeId = targetElement.getAttribute('aria-label');
            if (!this.hoveredNode || (this.hoveredNode && this.hoveredNode.id !== nodeId)) {
                if (this.hoveredNode) {
                    this.trigger('nodeLeave', { node: this.hoveredNode });
                    this.hoveredNode = null;
                }
                var nodeObject = this.findNode(nodeId);
                if (nodeObject) {
                    this.trigger('nodeEnter', { node: nodeObject });
                    this.hoveredNode = nodeObject;
                }
                if (this.hoveredLink) {
                    this.trigger('linkLeave', { link: this.hoveredLink });
                    this.hoveredLink = null;
                }
            }
        }
        // Link hit
        else if (targetElement && targetElement.tagName.toLowerCase() === 'path' && targetElement.closest("[id=\"" + linkGroupId + "\"]")) {
            var sourceId = targetElement.getAttribute('data-source');
            var targetId = targetElement.getAttribute('data-target');
            if (!this.hoveredLink || (this.hoveredLink && (this.hoveredLink.sourceId !== sourceId
                || this.hoveredLink.targetId !== targetId))) {
                if (this.hoveredLink) {
                    this.trigger('linkLeave', { link: this.hoveredLink });
                    this.hoveredLink = null;
                }
                var linkObject = this.findLink(sourceId, targetId);
                if (linkObject) {
                    this.trigger('linkEnter', { link: linkObject });
                    this.hoveredLink = linkObject;
                }
                if (this.hoveredNode) {
                    this.trigger('nodeLeave', { node: this.hoveredNode });
                    this.hoveredNode = null;
                }
            }
        }
        else {
            if (this.hoveredNode) {
                this.trigger('nodeLeave', { node: this.hoveredNode });
                this.hoveredNode = null;
            }
            if (this.hoveredLink) {
                this.trigger('linkLeave', { link: this.hoveredLink });
                this.hoveredLink = null;
            }
        }
        this.notify(Browser.touchMoveEvent, event);
        return false;
    };
    /**
     * Notifies the chart about the pointer/touch start event to initiate interaction handling.
     *
     * @param {PointerEvent} event - Pointer down event raised on the chart surface.
     * @returns {boolean} returns boolean based on mouse actions.
     *
     * @private
     */
    Sankey.prototype.handleMouseDown = function (event) {
        this.notify(Browser.touchStartEvent, event);
        return false;
    };
    /**
     * Handles mouse leave by clearing hover states, triggering leave events, and notifying the chart about interaction end.
     *
     * @param {MouseEvent} event - Mouse leave event raised when the pointer exits the chart surface.
     * @returns {boolean} returns boolean based on mouse actions.
     *
     * @private
     */
    Sankey.prototype.mouseLeave = function (event) {
        this.updateMousePosition(event);
        if (this.hoveredNode) {
            this.trigger('nodeLeave', { node: this.hoveredNode });
            this.hoveredNode = null;
        }
        if (this.hoveredLink) {
            this.trigger('linkLeave', { link: this.hoveredLink });
            this.hoveredLink = null;
        }
        this.notify(Browser.touchEndEvent, event);
        return false;
    };
    /**
     * Handles the mouse click on the chart.
     *
     * @param {PointerEvent | TouchEvent} e - The mouse or touch event.
     * @returns {boolean} -  Return false.
     * @private
     *
     */
    Sankey.prototype.handleMouseClick = function (e) {
        this.updateMousePosition(e);
        var target = e.target;
        // Check if node was clicked
        var nodePrefix = this.element.id + "_node_";
        if (target.id && target.id.indexOf(nodePrefix) === 0) {
            var nodeId = target.getAttribute('aria-label');
            var node = this.findNode(nodeId);
            if (node) {
                var nodeClickArgs = { node: node };
                this.trigger('nodeClick', nodeClickArgs);
            }
        }
        // Check if link was clicked
        var linkGroupId = this.element.id + "_link_collection";
        if (target.tagName.toLowerCase() === 'path' && target.closest("[id=\"" + linkGroupId + "\"]")) {
            var sourceID = target.getAttribute('data-source');
            var targetID = target.getAttribute('data-target');
            var link = this.findLink(sourceID, targetID);
            if (link) {
                var linkClickArgs = { link: link };
                this.trigger('linkClick', linkClickArgs);
            }
        }
        this.notify('click', e);
        return false;
    };
    /**
     * Export method for the chart.
     *
     * @param {ExportType} type - Specifies the type of the export.
     * @param {string} fileName - Specifies the file name of the exported file.
     * @returns {void}
     *
     * @private
     */
    Sankey.prototype.export = function (type, fileName) {
        if (this.sankeyExportModule) {
            this.sankeyExportModule.export(type, fileName);
            if (this.afterExport) {
                this.sankeyExportModule.getDataUrl(this);
            }
        }
    };
    /**
     * Prints the chart in the page.
     *
     * @param {string[] | string | Element} id - The id of the chart to be printed on the page.
     * @returns {void}
     *
     * @private
     */
    Sankey.prototype.print = function (id) {
        var argsData = {
            cancel: false, htmlContent: this.svgObject
        };
        this.trigger('beforePrint', argsData);
        if (!argsData.cancel) {
            var printChart = new PrintUtils(this);
            printChart.print(id);
        }
    };
    /**
     * Returns the persisted state of the component.
     *
     * @returns {string} the persisted state.
     *
     * @private
     */
    Sankey.prototype.getPersistData = function () { return ''; };
    /**
     * Handles property updates and refreshes the Sankey rendering based on the changed properties.
     *
     * @param {SankeyModel} newProp - Newly updated property values.
     * @param {SankeyModel} _oldProp - Previously existing property values.
     * @returns {void}
     *
     * @private
     */
    Sankey.prototype.onPropertyChanged = function (newProp, _oldProp) {
        var renderer = false;
        var refreshBounds = false;
        this.animateSeries = false;
        for (var _i = 0, _a = Object.keys(newProp); _i < _a.length; _i++) {
            var prop = _a[_i];
            switch (prop) {
                case 'width':
                case 'height':
                    this.createChartSvg();
                    refreshBounds = true;
                    break;
                case 'title':
                case 'subTitle':
                    refreshBounds = true;
                    break;
                case 'titleStyle':
                case 'subTitleStyle':
                    renderer = true;
                    break;
                case 'orientation':
                case 'nodes':
                case 'links':
                case 'labelSettings':
                case 'nodeStyle':
                case 'linkStyle':
                case 'margin':
                case 'border':
                case 'background':
                case 'backgroundImage':
                case 'legendSettings':
                    refreshBounds = true;
                    break;
                case 'enableExport':
                    renderer = true;
                    break;
                case 'tooltip':
                    renderer = true;
                    break;
                case 'animation':
                    renderer = true;
                    break;
                case 'enableRtl':
                case 'locale':
                    this.refresh();
                    break;
                case 'theme':
                    this.animateSeries = true;
                    renderer = true;
                    break;
                default:
                    renderer = true;
                    break;
            }
        }
        if (refreshBounds) {
            this.nodeLayoutMap = this.sankeySeriesModule.buildNodes(this.links, this);
            if (this.sankeyLegendModule && this.legendSettings.visible) {
                this.sankeyLegendModule.getLegendOptions(this);
            }
            this.calculateAvailableSize();
            this.createChartSvg();
            if (this.isReact) {
                this.clearTemplate();
            }
            this.calculateBounds();
            this.renderElements();
        }
        else if (renderer) {
            this.removeSvg();
            if (this.isReact) {
                this.clearTemplate();
            }
            this.renderElements();
        }
    };
    /**
     * Handles focus-in events within the Sankey chart to manage keyboard navigation,
     * highlighting, and tooltip behavior based on the focused element group.
     *
     * @param {FocusEvent} event - The focus-in event dispatched on the chart.
     * @returns {void}
     * @private
     */
    Sankey.prototype.handleFocusIn = function (event) {
        var targetElement = event.target;
        if (!targetElement || !targetElement.id) {
            return;
        }
        var canUseMatches = !!(targetElement).matches && typeof (targetElement).matches === 'function';
        if (canUseMatches && !(targetElement).matches(':focus-visible')) {
            this.clearNavigationStyles();
            var groupName = this.getGroupOf(targetElement.id);
            if (groupName) {
                this.currentGroup = groupName;
            }
            this.previousTargetId = targetElement.id;
            return;
        }
        this.clearNavigationStyles();
        this.applyNavigationStyle(targetElement.id);
        var group = this.getGroupOf(targetElement.id);
        if (group === 'nodes' || group === 'links') {
            if (this.ensureTooltip()) {
                var focusedElement = document.activeElement || targetElement;
                this.applyHighlightForElement(focusedElement);
                var centerPosition = void 0;
                if (!centerPosition) {
                    centerPosition = this.getElementCenterInChartCoords(focusedElement);
                }
                if (centerPosition) {
                    this.tooltipModule.showTooltipForElement(focusedElement, !this.tooltipModule.svgTooltip, centerPosition);
                }
            }
        }
        else {
            if (this.tooltipModule) {
                this.tooltipModule.hideTooltip(0);
            }
            if (group === 'legend' && this.sankeyHighlightModule) {
                var label = targetElement.getAttribute('aria-label');
                if (label) {
                    this.sankeyHighlightModule.highlightForNode(label);
                }
            }
        }
        if (group) {
            this.currentGroup = group;
        }
        this.previousTargetId = targetElement.id;
    };
    /**
     * Initializes the keyboard tab order for focusable groups within the Sankey chart.
     *
     * The order is: Title → Subtitle → Nodes → Links → Legend.
     * Only the first element of each group is tabbable by default; others use roving tabindex.
     *
     * @returns {void}
     */
    Sankey.prototype.initKeyboardTabOrder = function () {
        // Title → Subtitle → Nodes → Links → Legend (first element in each group is tabbable)
        var titleElement = document.getElementById(this.element.id + "_title");
        var subtitleElement = document.getElementById(this.element.id + "_subtitle");
        var nodeElements = this.getNodeElements();
        var linkElements = this.getLinkElements();
        var legendItems = this.getLegendItems();
        // Set tabindex states
        if (titleElement) {
            titleElement.setAttribute('tabindex', '0');
        }
        if (subtitleElement) {
            subtitleElement.setAttribute('tabindex', '0');
        } // requirement
        if (nodeElements.length) {
            nodeElements[0].setAttribute('tabindex', '0');
        }
        if (linkElements.length) {
            linkElements[0].setAttribute('tabindex', '0');
        }
        if (legendItems.length) {
            legendItems[0].setAttribute('tabindex', '0');
        }
        // Force all other legend <g> to -1 (avoid tabindex="")
        for (var i = 1; i < legendItems.length; i++) {
            var legendGroup = legendItems[i];
            if (legendGroup instanceof HTMLElement || legendGroup instanceof SVGElement) {
                legendGroup.setAttribute('tabindex', '-1');
            }
        }
        // Reset roving indexes to 0 for Arrow navigation
        this.currentNodeIndex = 0;
        this.currentLinkIndex = 0;
        this.currentLegendIndex = 0;
        // Do not set currentGroup by default; we will infer from focused element.
        this.currentGroup = null;
        this.previousTargetId = '';
    };
    /**
     * Updates tabindex so the previous element becomes unfocusable and the next element becomes focusable.
     *
     * @param {Element | null} [previousElement] - The element to make unfocusable.
     * @param {Element | null} [nextElement] - The element to make focusable.
     * @returns {void}
     *
     * @private
     */
    Sankey.prototype.updateTabIndex = function (previousElement, nextElement) {
        if (previousElement instanceof HTMLElement || previousElement instanceof SVGElement) {
            previousElement.setAttribute('tabindex', '-1');
        }
        if (nextElement instanceof HTMLElement || nextElement instanceof SVGElement) {
            nextElement.setAttribute('tabindex', '0');
        }
    };
    /**
     * Wraps an index into the valid range [0, total - 1].
     *
     * @param {number} index - The index to normalize.
     * @param {number} total - The total number of items in the collection.
     * @returns {number} The normalized index within bounds.
     *
     * @private
     */
    Sankey.prototype.normalizeIndex = function (index, total) {
        return index > total - 1 ? 0 : (index < 0 ? total - 1 : index);
    };
    /**
     * Finds the index of an element by id within a list of elements.
     *
     * @param {Element[]} elements - The collection to search.
     * @param {string} targetId - The id of the element to find.
     * @returns {number} The index of the matching element, or 0 if not found.
     *
     * @private
     */
    Sankey.prototype.indexOfElementById = function (elements, targetId) {
        for (var i = 0; i < elements.length; i++) {
            if (elements[i].id === targetId) {
                return i;
            }
        }
        return 0;
    };
    /**
     * Removes the focused CSS class from elements currently marked as focused.
     *
     * @returns {void}
     */
    Sankey.prototype.clearFocusedClasses = function () {
        var focusedElements = this.element.querySelectorAll('.e-sankey-focused');
        focusedElements.forEach(function (element) {
            element.classList.remove('e-sankey-focused');
        });
    };
    /**
     * Focuses the specified element, applies the focused class, and ensures it is tabbable.
     *
     * @param {Element} element - The element to focus.
     * @returns {string} The id of the focused element, or an empty string if focus was not applied.
     *
     * @private
     */
    Sankey.prototype.focusElement = function (element) {
        if (!(element instanceof HTMLElement || element instanceof SVGElement)) {
            return '';
        }
        this.clearFocusedClasses();
        element.setAttribute('tabindex', '0');
        element.classList.add('e-sankey-focused');
        element.focus();
        return element.id;
    };
    /**
     * Applies keyboard navigation outline styling to the specified target element by id.
     *
     * @param {string} targetId - The id of the element to style.
     * @returns {void}
     *
     * @private
     */
    Sankey.prototype.applyNavigationStyle = function (targetId) {
        var targetElement = document.getElementById(targetId);
        if (!targetElement) {
            return;
        }
        var focusColor = this.focusBorderColor || this.themeStyle.tabColor;
        targetElement.style.setProperty('outline', this.focusBorderWidth + "px solid " + focusColor);
        targetElement.style.setProperty('margin', this.focusBorderMargin + "px");
        // Ensure legacy outline-offset is cleared
        targetElement.style.removeProperty('outline-offset');
    };
    /**
     * Removes navigation outline styling from all focusable elements within the Sankey chart.
     *
     * @returns {void}
     *
     * @private
     */
    Sankey.prototype.clearNavigationStyles = function () {
        // Clear container outline (Alt+J focus)
        var hostElement = this.element;
        hostElement.style.setProperty('outline', 'none');
        hostElement.style.setProperty('outline-offset', '');
        var selector = "#" + this.element.id + "_title, " +
            ("#" + this.element.id + "_subtitle, ") +
            ("#" + this.element.id + " [id*=\"_node_level_\"], ") +
            ("#" + this.element.id + " [id*=\"_link_level_\"], ") +
            ("#" + this.element.id + " [id*=\"_chart_legend_\"]");
        var elements = document.querySelectorAll(selector);
        elements.forEach(function (el) {
            if (el instanceof HTMLElement || el instanceof SVGElement) {
                el.style.setProperty('outline', 'none');
                el.style.setProperty('outline-offset', '');
                el.style.setProperty('margin', '');
            }
        });
    };
    /**
     * Determines the Sankey navigation group of a given element id.
     *
     * @param {string} targetId - The id of the element to classify.
     * @returns {'title' | 'subtitle' | 'nodes' | 'links' | 'legend' | null} The group name, or null if not recognized.
     *
     * @private
     */
    Sankey.prototype.getGroupOf = function (targetId) {
        if (!targetId) {
            return null;
        }
        if (targetId === this.element.id + "_title") {
            return 'title';
        }
        if (targetId === this.element.id + "_subtitle") {
            return 'subtitle';
        }
        if (targetId.indexOf('_node_level_') > -1) {
            return 'nodes';
        }
        if (targetId.indexOf('_link_level_') > -1) {
            return 'links';
        }
        if (targetId.indexOf('_chart_legend_g_') > -1) {
            return 'legend';
        }
        return null;
    };
    /**
     * Gets all SVG node <rect> elements within the Sankey node collection.
     *
     * @returns {Element[]} An array of node elements.
     *
     * @private
     */
    Sankey.prototype.getNodeElements = function () {
        var nodeList = document.querySelectorAll("#" + this.element.id + "_node_collection rect");
        return Array.prototype.slice.call(nodeList);
    };
    /**
     * Gets all SVG link <path> elements within the Sankey link collection.
     *
     * @returns {Element[]} An array of link elements.
     *
     * @private
     */
    Sankey.prototype.getLinkElements = function () {
        var nodeList = document.querySelectorAll("#" + this.element.id + "_link_collection path");
        return Array.prototype.slice.call(nodeList);
    };
    /**
     * Gets all legend group elements within the Sankey legend container.
     *
     * @returns {Element[]} An array of legend group elements.
     *
     * @private
     */
    Sankey.prototype.getLegendItems = function () {
        var nodeList = document.querySelectorAll("#" + this.element.id + "_chart_legend_translate_g > g");
        return Array.prototype.slice.call(nodeList);
    };
    /**
     * Moves keyboard focus within the specified group by the given step (delta).
     *
     * Uses a roving tabindex strategy among Nodes, Links, or Legend items.
     *
     * @param {'nodes' | 'links' | 'legend'} group - The group to navigate within.
     * @param {1 | -1} delta - The step to move focus by (1 for next, -1 for previous).
     * @returns {string | null} The id of the newly focused element, or null if none.
     *
     * @private
     */
    Sankey.prototype.moveFocusWithinGroup = function (group, delta) {
        var items = group === 'nodes' ? this.getNodeElements()
            : group === 'links' ? this.getLinkElements()
                : this.getLegendItems();
        if (!items.length) {
            return null;
        }
        var currentIndex = group === 'nodes' ? this.currentNodeIndex
            : group === 'links' ? this.currentLinkIndex
                : this.currentLegendIndex;
        var nextIndex = this.normalizeIndex(currentIndex + delta, items.length);
        this.updateTabIndex(items[currentIndex], items[nextIndex]);
        var newFocusedId = this.focusElement(items[nextIndex]);
        this.clearNavigationStyles();
        this.applyNavigationStyle(newFocusedId);
        if (group === 'nodes') {
            this.currentNodeIndex = nextIndex;
        }
        else if (group === 'links') {
            this.currentLinkIndex = nextIndex;
        }
        else {
            this.currentLegendIndex = nextIndex;
        }
        return newFocusedId;
    };
    /**
     * Applies highlight behavior based on the given element type (node or link).
     *
     * @param {Element} element - The element to highlight (node <rect> or link <path>).
     * @returns {void}
     *
     * @private
     */
    Sankey.prototype.applyHighlightForElement = function (element) {
        if (!this.sankeyHighlightModule) {
            return;
        }
        var elementId = element.id;
        if (elementId.indexOf('_node_level_') > -1) {
            var nodeId = element.getAttribute('aria-label');
            if (nodeId) {
                this.sankeyHighlightModule.highlightForNode(nodeId);
            }
        }
        else if (elementId.indexOf('_link_level_') > -1) {
            var sourceId = element.getAttribute('data-source');
            var targetId = element.getAttribute('data-target');
            if (sourceId && targetId) {
                this.sankeyHighlightModule.highlightForLink(sourceId, targetId);
            }
        }
    };
    /**
     * Ensures the tooltip module is created when tooltip is enabled.
     *
     * @returns {boolean} True if the tooltip module is available; otherwise, false.
     *
     * @private
     */
    Sankey.prototype.ensureTooltip = function () {
        if (!this.tooltipModule && this.tooltip && this.tooltip.enable) {
            this.tooltipModule = new SankeyTooltip(this);
        }
        return !!this.tooltipModule;
    };
    /**
     * Computes a fallback center position for an SVG element using client bounding rectangles.
     *
     * Converts the element's visual center from viewport coordinates to chart coordinate space,
     * relative to the initial clip rectangle.
     *
     * @param {Element} targetElement - The SVG element whose center should be calculated.
     * @returns {number | null} The computed center position, or null on failure.
     *
     * @private
     */
    Sankey.prototype.getElementCenterInChartCoords = function (targetElement) {
        var svgHost = this.svgObject;
        if (!svgHost) {
            return null;
        }
        var svgRect = svgHost.getBoundingClientRect();
        var elementRect = targetElement.getBoundingClientRect();
        var centerX = (elementRect.left + elementRect.width / 2) - svgRect.left;
        var centerY = (elementRect.top + elementRect.height / 2) - svgRect.top;
        return {
            x: centerX - this.initialClipRect.x + 4,
            y: centerY - this.initialClipRect.y + 4
        };
    };
    /**
     * Handles keydown events for Sankey keyboard interactions.
     *
     * Prevents default arrow key scrolling, clears effects on Escape,
     * and removes navigation outline on Tab. Triggers print on CtrlP.
     *
     * @param {KeyboardEvent} keyboardEvent - The keydown event.
     * @returns {boolean} Always returns false to prevent default behavior within the control.
     *
     * @private
     */
    Sankey.prototype.handleKeyDown = function (keyboardEvent) {
        var code = keyboardEvent.code;
        if (code && code.indexOf('Arrow') > -1) {
            keyboardEvent.preventDefault();
        }
        if (code === 'Tab') {
            this.clearNavigationStyles();
        }
        if (code === 'Escape') {
            this.clearNavigationStyles();
            if (this.sankeyHighlightModule) {
                this.sankeyHighlightModule.clearHighlights();
            }
            if (this.tooltipModule) {
                this.tooltipModule.hideTooltip(0);
            }
        }
        if (code === 'CtrlP') {
            this.print();
        }
        return false;
    };
    /**
     * Handles keyup events and delegates to Sankey keyboard navigation logic.
     *
     * Detects Tab, Arrow, and Escape actions and invokes the navigation handler.
     *
     * @param {KeyboardEvent} keyboardEvent - The keyup event.
     * @returns {boolean} Always returns false to prevent default behavior within the control.
     *
     * @private
     */
    Sankey.prototype.handleKeyUp = function (keyboardEvent) {
        var targetElement = keyboardEvent.target;
        var targetId = targetElement && targetElement.id ? targetElement.id : '';
        var action = '';
        var code = keyboardEvent.code || '';
        if (code === 'Tab') {
            action = 'Tab';
        }
        else if (code.indexOf('Arrow') > -1) {
            action = 'ArrowMove';
        }
        else if (code === 'Escape') {
            action = 'ESC';
        }
        if (!action) {
            return false;
        }
        this.handleKeyboardNavigation(keyboardEvent, targetId, action);
        return false;
    };
    /**
     * Executes roving tabindex navigation and tooltip/highlight behavior based on keyboard actions.
     *
     * Supports Arrow key movement within groups and Tab to move focus between groups, applying
     * highlight for nodes/links and hiding tooltip for non-tooltip groups (e.g., legend).
     *
     * @param {KeyboardEvent} keyboardEvent - The keyboard event that triggered navigation.
     * @param {string} targetId - The id of the currently focused element before navigation.
     * @param {'Tab' | 'ArrowMove' | 'Enter' | 'Space' | 'ESC'} action - The navigation action to perform.
     * @returns {void}
     *
     * @private
     */
    Sankey.prototype.handleKeyboardNavigation = function (keyboardEvent, targetId, action) {
        var group = this.getGroupOf(targetId) || this.currentGroup;
        if ((action === 'ArrowMove' || action === 'Tab') && group) {
            var newElementId = null;
            if (action === 'ArrowMove') {
                var forward = (keyboardEvent.code === 'ArrowRight' || keyboardEvent.code === 'ArrowDown') ? 1 : -1;
                if (group === 'nodes') {
                    var nodeElements = this.getNodeElements();
                    this.currentNodeIndex = this.indexOfElementById(nodeElements, targetId);
                    newElementId = this.moveFocusWithinGroup('nodes', forward);
                }
                else if (group === 'links') {
                    var linkElements = this.getLinkElements();
                    this.currentLinkIndex = this.indexOfElementById(linkElements, targetId);
                    newElementId = this.moveFocusWithinGroup('links', forward);
                }
                else if (group === 'legend') {
                    var legendItems = this.getLegendItems();
                    this.currentLegendIndex = this.indexOfElementById(legendItems, targetId);
                    newElementId = this.moveFocusWithinGroup('legend', forward);
                }
            }
            else {
                var activeElement = document.activeElement;
                newElementId = activeElement && activeElement.id ? activeElement.id : targetId;
                var resolvedGroup = newElementId ? this.getGroupOf(newElementId) : null;
                if (resolvedGroup) {
                    group = resolvedGroup;
                }
                if (newElementId && (group === 'nodes' || group === 'links')) {
                    this.applyNavigationStyle(newElementId);
                }
            }
            if (!newElementId) {
                return;
            }
            var element = document.getElementById(newElementId);
            if (element && (group === 'nodes' || group === 'links')) {
                this.applyHighlightForElement(element);
                if (this.ensureTooltip()) {
                    var centerPosition = void 0;
                    if (!centerPosition) {
                        centerPosition = this.getElementCenterInChartCoords(element);
                    }
                    if (centerPosition) {
                        var isFirst = !this.tooltipModule.svgTooltip;
                        this.tooltipModule.showTooltipForElement(element, isFirst, centerPosition);
                    }
                }
            }
            else {
                if (this.tooltipModule) {
                    this.tooltipModule.hideTooltip(0);
                }
                if (group === 'legend' && this.sankeyHighlightModule && element) {
                    var label = element.getAttribute('aria-label');
                    if (label) {
                        this.sankeyHighlightModule.highlightForNode(label);
                    }
                    else {
                        this.sankeyHighlightModule.clearHighlights();
                    }
                }
            }
            return;
        }
    };
    /**
     * Provides the list of modules required to render the control (series, tooltip, legend, export, etc.).
     *
     * @returns {ModuleDeclaration[]} returns required modules injected in sample.
     *
     * @private
     */
    Sankey.prototype.requiredModules = function () {
        var modules = [];
        if (this.tooltip && this.tooltip.enable) {
            modules.push({ member: 'SankeyTooltip', args: [this] });
        }
        if (this.legendSettings && this.legendSettings.visible) {
            modules.push({ member: 'SankeyLegend', args: [this] });
        }
        if (this.enableExport) {
            modules.push({
                member: 'SankeyExport',
                args: [this]
            });
        }
        return modules;
    };
    /**
     * To destroy the widget
     *
     * @returns {void}
     * @private
     */
    Sankey.prototype.destroy = function () {
        this.nodeLayoutMap = null;
        removeElement('chartmeasuretext');
        if (this.element) {
            removeElement(this.element.id + '_tooltip_parent');
            this.unWireEvents();
            if (this.isReact) {
                this.clearTemplate();
            }
            _super.prototype.destroy.call(this);
            this.removeSvg();
            this.svgObject = null;
        }
    };
    /**
     * Returns the name of the module used for Sankey control identification.
     *
     * @returns {string} - the module name
     * @private
     */
    Sankey.prototype.getModuleName = function () {
        return 'sankey';
    };
    __decorate([
        Property(null)
    ], Sankey.prototype, "width", void 0);
    __decorate([
        Property(null)
    ], Sankey.prototype, "height", void 0);
    __decorate([
        Property('')
    ], Sankey.prototype, "title", void 0);
    __decorate([
        Property('')
    ], Sankey.prototype, "subTitle", void 0);
    __decorate([
        Complex({ fontFamily: null, size: null, fontStyle: null, fontWeight: null, color: null }, SankeyTitleStyle)
    ], Sankey.prototype, "titleStyle", void 0);
    __decorate([
        Complex({ fontFamily: null, size: null, fontStyle: null, fontWeight: null, color: null }, SankeyTitleStyle)
    ], Sankey.prototype, "subTitleStyle", void 0);
    __decorate([
        Property(null)
    ], Sankey.prototype, "background", void 0);
    __decorate([
        Property(null)
    ], Sankey.prototype, "backgroundImage", void 0);
    __decorate([
        Complex({ bottom: 10, left: 10, right: 10, top: 10 }, Margin)
    ], Sankey.prototype, "margin", void 0);
    __decorate([
        Complex({ color: '', width: 1 }, Border)
    ], Sankey.prototype, "border", void 0);
    __decorate([
        Property('Material')
    ], Sankey.prototype, "theme", void 0);
    __decorate([
        Collection([{}], SankeyLink)
    ], Sankey.prototype, "links", void 0);
    __decorate([
        Collection([{}], SankeyNode)
    ], Sankey.prototype, "nodes", void 0);
    __decorate([
        Property('Horizontal')
    ], Sankey.prototype, "orientation", void 0);
    __decorate([
        Complex({}, SankeyLabelSettings)
    ], Sankey.prototype, "labelSettings", void 0);
    __decorate([
        Complex({}, SankeyNodeSettings)
    ], Sankey.prototype, "nodeStyle", void 0);
    __decorate([
        Complex({}, SankeyLinkSettings)
    ], Sankey.prototype, "linkStyle", void 0);
    __decorate([
        Complex({}, SankeyLegendSettings)
    ], Sankey.prototype, "legendSettings", void 0);
    __decorate([
        Complex({}, SankeyTooltipSettings)
    ], Sankey.prototype, "tooltip", void 0);
    __decorate([
        Complex({}, Animation)
    ], Sankey.prototype, "animation", void 0);
    __decorate([
        Property(true)
    ], Sankey.prototype, "enableExport", void 0);
    __decorate([
        Property(false)
    ], Sankey.prototype, "allowExport", void 0);
    __decorate([
        Complex({}, Accessibility)
    ], Sankey.prototype, "accessibility", void 0);
    __decorate([
        Event()
    ], Sankey.prototype, "legendItemRendering", void 0);
    __decorate([
        Event()
    ], Sankey.prototype, "legendItemHover", void 0);
    __decorate([
        Event()
    ], Sankey.prototype, "labelRendering", void 0);
    __decorate([
        Event()
    ], Sankey.prototype, "nodeRendering", void 0);
    __decorate([
        Event()
    ], Sankey.prototype, "linkRendering", void 0);
    __decorate([
        Event()
    ], Sankey.prototype, "sizeChanged", void 0);
    __decorate([
        Event()
    ], Sankey.prototype, "tooltipRendering", void 0);
    __decorate([
        Event()
    ], Sankey.prototype, "exportCompleted", void 0);
    __decorate([
        Event()
    ], Sankey.prototype, "nodeClick", void 0);
    __decorate([
        Event()
    ], Sankey.prototype, "nodeEnter", void 0);
    __decorate([
        Event()
    ], Sankey.prototype, "nodeLeave", void 0);
    __decorate([
        Event()
    ], Sankey.prototype, "linkClick", void 0);
    __decorate([
        Event()
    ], Sankey.prototype, "linkEnter", void 0);
    __decorate([
        Event()
    ], Sankey.prototype, "linkLeave", void 0);
    __decorate([
        Event()
    ], Sankey.prototype, "loaded", void 0);
    __decorate([
        Event()
    ], Sankey.prototype, "load", void 0);
    __decorate([
        Event()
    ], Sankey.prototype, "beforeExport", void 0);
    __decorate([
        Event()
    ], Sankey.prototype, "afterExport", void 0);
    __decorate([
        Event()
    ], Sankey.prototype, "beforePrint", void 0);
    __decorate([
        Property(null)
    ], Sankey.prototype, "focusBorderColor", void 0);
    __decorate([
        Property(1.5)
    ], Sankey.prototype, "focusBorderWidth", void 0);
    __decorate([
        Property(0)
    ], Sankey.prototype, "focusBorderMargin", void 0);
    Sankey = __decorate([
        NotifyPropertyChanges
    ], Sankey);
    return Sankey;
}(Component));
export { Sankey };

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
/* eslint-disable security/detect-object-injection */
/* eslint-disable no-useless-escape */
/* eslint-disable security/detect-non-literal-regexp */
/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable jsdoc/require-param */
/* eslint-disable jsdoc/require-returns */
/* eslint-disable valid-jsdoc */
import { NotifyPropertyChanges, Property, Event, Complex, updateBlazorTemplate } from '@syncfusion/ej2-base';
import { extend, compile as templateComplier, Component, resetBlazorTemplate, isBlazor, isNullOrUndefined } from '@syncfusion/ej2-base';
import { SvgRenderer } from '../svg-render/index';
import { ChildProperty, createElement, remove, Browser, Animation, animationMode } from '@syncfusion/ej2-base';
import { getTooltipThemeColor } from './interface';
import { Size, Rect, Side, measureText, getElement, findDirection, drawSymbol, textElement } from './helper';
import { removeElement, TextOption, TooltipLocation, PathOption, withInAreaBounds } from './helper';
/**
 * Configures the fonts in charts.
 *
 * @private
 */
var TextStyle = /** @class */ (function (_super) {
    __extends(TextStyle, _super);
    function TextStyle() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate([
        Property(null)
    ], TextStyle.prototype, "size", void 0);
    __decorate([
        Property('')
    ], TextStyle.prototype, "color", void 0);
    __decorate([
        Property('Segoe UI')
    ], TextStyle.prototype, "fontFamily", void 0);
    __decorate([
        Property('Normal')
    ], TextStyle.prototype, "fontWeight", void 0);
    __decorate([
        Property('Normal')
    ], TextStyle.prototype, "fontStyle", void 0);
    __decorate([
        Property(1)
    ], TextStyle.prototype, "opacity", void 0);
    __decorate([
        Property(null)
    ], TextStyle.prototype, "headerTextSize", void 0);
    __decorate([
        Property(null)
    ], TextStyle.prototype, "boldTextSize", void 0);
    return TextStyle;
}(ChildProperty));
export { TextStyle };
/**
 * Configures the borders in the chart.
 *
 * @private
 */
var TooltipBorder = /** @class */ (function (_super) {
    __extends(TooltipBorder, _super);
    function TooltipBorder() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate([
        Property('')
    ], TooltipBorder.prototype, "color", void 0);
    __decorate([
        Property(1)
    ], TooltipBorder.prototype, "width", void 0);
    __decorate([
        Property('')
    ], TooltipBorder.prototype, "dashArray", void 0);
    return TooltipBorder;
}(ChildProperty));
export { TooltipBorder };
/**
 * Configures the borders in the chart.
 *
 * @private
 */
var AreaBounds = /** @class */ (function (_super) {
    __extends(AreaBounds, _super);
    function AreaBounds() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate([
        Property(0)
    ], AreaBounds.prototype, "x", void 0);
    __decorate([
        Property(0)
    ], AreaBounds.prototype, "y", void 0);
    __decorate([
        Property(0)
    ], AreaBounds.prototype, "width", void 0);
    __decorate([
        Property(0)
    ], AreaBounds.prototype, "height", void 0);
    return AreaBounds;
}(ChildProperty));
export { AreaBounds };
/**
 * Configures the borders in the chart.
 *
 * @private
 */
var ToolLocation = /** @class */ (function (_super) {
    __extends(ToolLocation, _super);
    function ToolLocation() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate([
        Property(0)
    ], ToolLocation.prototype, "x", void 0);
    __decorate([
        Property(0)
    ], ToolLocation.prototype, "y", void 0);
    return ToolLocation;
}(ChildProperty));
export { ToolLocation };
/**
 * Represents the Tooltip control.
 * ```html
 * <div id="tooltip"/>
 * <script>
 *   var tooltipObj = new Tooltip({ isResponsive : true });
 *   tooltipObj.appendTo("#tooltip");
 * </script>
 * ```
 *
 * @private
 */
var Tooltip = /** @class */ (function (_super) {
    __extends(Tooltip, _super);
    /**
     * Constructor for creating the widget
     *
     * @hidden
     */
    function Tooltip(options, element) {
        return _super.call(this, options, element) || this;
    }
    /**
     * Initialize the event handler.
     *
     * @private
     */
    Tooltip.prototype.preRender = function () {
        this.allowServerDataBinding = false;
        this.initPrivateVariable();
        if (!this.isCanvas) {
            this.removeSVG();
        }
        this.createTooltipElement();
    };
    Tooltip.prototype.initPrivateVariable = function () {
        this.renderer = new SvgRenderer(this.element.id);
        this.themeStyle = getTooltipThemeColor(this.theme);
        this.formattedText = [];
        this.padding = 5;
        this.highlightPadding = 3;
        this.areaMargin = 10;
        this.isFirst = true;
        this.markerPoint = [];
    };
    Tooltip.prototype.removeSVG = function () {
        var svgObject = document.getElementById(this.element.id + '_svg');
        var templateObject = document.getElementById(this.element.id + 'parent_template');
        if (this.blazorTemplate) {
            resetBlazorTemplate(this.element.id + 'parent_template' + '_blazorTemplate');
        }
        if (svgObject && svgObject.parentNode) {
            remove(svgObject);
        }
        if (templateObject && templateObject.parentNode) {
            remove(templateObject);
        }
    };
    /**
     * To Initialize the control rendering.
     */
    Tooltip.prototype.render = function () {
        this.fadeOuted = false;
        if (!this.template) {
            if (this.split) {
                this.renderSplitTooltip();
            }
            else {
                this.renderText(this.isFirst);
                var argsData = {
                    cancel: false, name: 'tooltipRender', tooltip: this
                };
                this.trigger('tooltipRender', argsData);
                var markerSide = this.renderTooltipElement(this.areaBounds, this.location, 0);
                this.drawMarker(markerSide.isBottom, markerSide.isRight, this.markerSize, 0);
            }
        }
        else {
            if (this.split) {
                for (var splitIndex = 0; splitIndex < this.data.length; splitIndex++) {
                    this.updateTemplateFn();
                    this.createTemplate(this.areaBounds, this.location, splitIndex);
                }
            }
            else {
                this.updateTemplateFn();
                this.createTemplate(this.areaBounds, this.location);
            }
        }
        this.trigger('loaded', { tooltip: this });
        var element = document.getElementById('chartmeasuretext');
        if (element) {
            remove(element);
        }
        this.allowServerDataBinding = true;
    };
    /**
     * Handles rendering when split tooltip is enabled (creates/removes per-split groups/paths,
     * renders text for each split item, computes auto positions and renders each split tooltip).
     * @private
     */
    Tooltip.prototype.renderSplitTooltip = function () {
        var svgRoot = getElement(this.element.id + '_svg');
        var prevCount = (this.previousContent && this.previousContent.length) ? this.previousContent.length : 0;
        var currentCount = this.content.length;
        if (svgRoot) {
            if (currentCount > prevCount) {
                for (var index = prevCount; index < currentCount; index++) {
                    var tooltipGroup = document.getElementById(this.element.id + '_group_' + index);
                    if (!tooltipGroup) {
                        tooltipGroup = this.renderer.createGroup({ id: this.element.id + '_group_' + index });
                        tooltipGroup.setAttribute('transform', 'translate(0,0)');
                        svgRoot.appendChild(tooltipGroup);
                        var tooltipPath = this.renderer.drawPath({
                            'id': this.element.id + '_path_' + index,
                            'stroke-width': ((this.theme === 'Fabric' || this.theme === 'Fluent' || this.theme === 'Fluent2' || this.theme === 'Fluent2HighContrast') && !this.border.width) ? 1 : this.border.width,
                            'fill': this.fill || this.themeStyle.tooltipFill,
                            'opacity': ((this.theme === 'TailwindDark' || this.theme === 'Tailwind' || this.theme === 'Tailwind3Dark' || this.theme === 'Tailwind3' || this.theme === 'Bootstrap5' || this.theme === 'Bootstrap5Dark' || this.theme.indexOf('Fluent2') > -1) && this.opacity === 0.75) ? 1 : this.opacity,
                            'stroke': this.border.color || (this.theme === 'Fabric' || this.theme === 'Fluent' || this.theme === 'Fluent2' ? '#D2D0CE' : this.border.color)
                        });
                        tooltipGroup.appendChild(tooltipPath);
                    }
                }
            }
            else if (currentCount < prevCount) {
                for (var index = currentCount; index < prevCount; index++) {
                    removeElement(this.element.id + '_group_' + index);
                    removeElement(this.element.id + '_path_' + index);
                    removeElement(this.element.id + '_trackball_group_' + index);
                    removeElement(this.element.id + '_tooltip_connector_' + index);
                }
            }
        }
        this.splitTooltipRectCollection = [];
        this.hasHorizontalOverflow = false;
        for (var splitIndex = 0; splitIndex < currentCount; splitIndex++) {
            this.renderText(this.isFirst, splitIndex);
        }
        if (this.split) {
            this.calculateAutoPositions();
        }
        for (var splitIndex = 0; splitIndex < currentCount; splitIndex++) {
            var argsData = {
                cancel: false, name: 'tooltipRender', tooltip: this
            };
            this.trigger('tooltipRender', argsData);
            var markerSide = this.renderTooltipElement(this.areaBounds, this.location, splitIndex);
            this.drawMarker(markerSide.isBottom, markerSide.isRight, this.markerSize, splitIndex);
        }
        this.previousContent = this.content;
    };
    /**
     * Calculates the actual clip rectangle that encompasses all split clip bounds.
     * @returns The combined clip rectangle
     * @private
     */
    Tooltip.prototype.getActualSplitClipRect = function () {
        if (!this.splitClipBounds || this.splitClipBounds.length === 0) {
            return new Rect(0, 0, 0, 0);
        }
        var minY = Infinity;
        var maxY = -Infinity;
        var minX = Infinity;
        var maxX = -Infinity;
        for (var _i = 0, _a = this.splitClipBounds; _i < _a.length; _i++) {
            var clipBound = _a[_i];
            var boundTop = clipBound.y;
            var boundBottom = clipBound.y + clipBound.height;
            var boundLeft = clipBound.x;
            var boundRight = clipBound.x + clipBound.width;
            minY = Math.min(minY, boundTop);
            maxY = Math.max(maxY, boundBottom);
            minX = Math.min(minX, boundLeft);
            maxX = Math.max(maxX, boundRight);
        }
        var actualWidth = maxX - minX;
        var actualHeight = maxY - minY;
        return new Rect(minX, minY, actualWidth, actualHeight);
    };
    /**
     * Calculates adjusted positions for split tooltips to prevent overlap
     * Centers overlapping clusters with median at the gap center
     *
     * @private
     */
    Tooltip.prototype.calculateAutoPositions = function () {
        if (!this.split || this.splitTooltipRectCollection.length < 1) {
            return;
        }
        var TOOLTIP_PADDING = 20;
        var MINIMUM_GAP = 5;
        var OVERFLOW_BUFFER = 5;
        var totalXPosition = 0;
        var areaBoundsRight = this.areaBounds.x + this.areaBounds.width;
        if (!this.inverted) {
            for (var _i = 0, _a = this.splitTooltipRectCollection; _i < _a.length; _i++) {
                var tooltipRect = _a[_i];
                var tooltipRightEdge = tooltipRect.x + tooltipRect.width;
                if (tooltipRightEdge > areaBoundsRight) {
                    this.hasHorizontalOverflow = true;
                }
                totalXPosition += tooltipRect.x;
            }
            var averageXPosition = totalXPosition / this.splitTooltipRectCollection.length;
            for (var _b = 0, _c = this.splitTooltipRectCollection; _b < _c.length; _b++) {
                var tooltipRect = _c[_b];
                tooltipRect.x = this.hasHorizontalOverflow
                    ? averageXPosition - (tooltipRect.width + 2 * TOOLTIP_PADDING)
                    : averageXPosition;
            }
        }
        else {
            var horizontalItems = this.splitTooltipRectCollection
                .map(function (rect, originalIndex) { return ({
                xPosition: rect.x,
                yPosition: rect.y,
                width: rect.width,
                height: rect.height,
                originalIndex: originalIndex
            }); })
                .sort(function (leftItem, rightItem) { return leftItem.xPosition - rightItem.xPosition; });
            for (var itemIndex = 1; itemIndex < horizontalItems.length; itemIndex++) {
                var previousItem = horizontalItems[itemIndex - 1];
                var currentItem = horizontalItems[itemIndex];
                var requiredX = previousItem.xPosition + previousItem.width + MINIMUM_GAP + OVERFLOW_BUFFER;
                if (currentItem.xPosition < requiredX) {
                    currentItem.xPosition = requiredX;
                }
            }
            for (var _d = 0, horizontalItems_1 = horizontalItems; _d < horizontalItems_1.length; _d++) {
                var sortedItem = horizontalItems_1[_d];
                this.splitTooltipRectCollection[sortedItem.originalIndex].x = sortedItem.xPosition;
            }
            return;
        }
        var sortedTooltipItems = this.splitTooltipRectCollection
            .map(function (rect, originalIndex) { return ({
            xPosition: rect.x,
            width: rect.width,
            yPosition: rect.y,
            height: rect.height,
            originalIndex: originalIndex
        }); })
            .sort(function (firstItem, secondItem) {
            return firstItem.yPosition - secondItem.yPosition;
        });
        var clusterStartIndex = 0;
        var previousClusterBottomY = -Infinity;
        while (clusterStartIndex < sortedTooltipItems.length) {
            var currentCluster = [sortedTooltipItems[clusterStartIndex]];
            var nextItemIndex = clusterStartIndex + 1;
            while (nextItemIndex < sortedTooltipItems.length) {
                var previousTooltip = currentCluster[currentCluster.length - 1];
                var currentTooltip = sortedTooltipItems[nextItemIndex];
                var previousTooltipBottom = previousTooltip.yPosition + previousTooltip.height;
                if (currentTooltip.yPosition < previousTooltipBottom + MINIMUM_GAP) {
                    currentCluster.push(currentTooltip);
                    nextItemIndex++;
                }
                else {
                    break;
                }
            }
            if (currentCluster.length > 1) {
                var totalCenterPoints = 0;
                var clusterTotalHeight = 0;
                for (var _e = 0, currentCluster_1 = currentCluster; _e < currentCluster_1.length; _e++) {
                    var tooltipItem = currentCluster_1[_e];
                    var centerY = tooltipItem.yPosition + (tooltipItem.height / 2);
                    totalCenterPoints += centerY;
                    clusterTotalHeight += tooltipItem.height;
                }
                var medianCenterY = totalCenterPoints / currentCluster.length;
                var totalHeightWithGaps = clusterTotalHeight + MINIMUM_GAP * (currentCluster.length - 1);
                var currentYPosition = Math.max(medianCenterY - (totalHeightWithGaps / 2), previousClusterBottomY + MINIMUM_GAP);
                for (var _f = 0, currentCluster_2 = currentCluster; _f < currentCluster_2.length; _f++) {
                    var tooltipItem = currentCluster_2[_f];
                    tooltipItem.yPosition = currentYPosition;
                    currentYPosition += tooltipItem.height + MINIMUM_GAP;
                }
                previousClusterBottomY = currentYPosition - MINIMUM_GAP;
            }
            else {
                var singleTooltip = currentCluster[0];
                var requiredMinimumY = previousClusterBottomY + MINIMUM_GAP;
                if (singleTooltip.yPosition < requiredMinimumY) {
                    singleTooltip.yPosition = requiredMinimumY;
                }
                previousClusterBottomY = singleTooltip.yPosition + singleTooltip.height;
            }
            clusterStartIndex = nextItemIndex;
        }
        var itemCount = sortedTooltipItems.length;
        if (itemCount === 0) {
            return;
        }
        var lastTooltip = sortedTooltipItems[itemCount - 1];
        var lastTooltipBottom = lastTooltip.yPosition + lastTooltip.height;
        var actualClipRect = this.getActualSplitClipRect();
        if (lastTooltipBottom > (actualClipRect.y + actualClipRect.height)) {
            var overflowAmount = lastTooltipBottom - actualClipRect.height + OVERFLOW_BUFFER;
            for (var currentIndex = itemCount - 1; currentIndex >= 0; currentIndex--) {
                var currentTooltipY = sortedTooltipItems[currentIndex].yPosition;
                var previousTooltipBottom = currentIndex === 0
                    ? actualClipRect.y
                    : sortedTooltipItems[currentIndex - 1].yPosition + sortedTooltipItems[currentIndex - 1].height;
                var availableSpace = currentTooltipY - previousTooltipBottom;
                if (availableSpace > overflowAmount) {
                    for (var shiftIndex = currentIndex; shiftIndex < itemCount; shiftIndex++) {
                        sortedTooltipItems[shiftIndex].yPosition -= overflowAmount;
                    }
                    break;
                }
            }
        }
        var firstTooltip = sortedTooltipItems[0];
        if (firstTooltip.yPosition < (actualClipRect.y)) {
            var overflowAmount = actualClipRect.y - firstTooltip.yPosition + OVERFLOW_BUFFER;
            for (var currentIndex = 0; currentIndex < itemCount; currentIndex++) {
                var currentTooltipBottom = sortedTooltipItems[currentIndex].yPosition + sortedTooltipItems[currentIndex].height;
                var nextTooltipY = currentIndex === itemCount - 1
                    ? (actualClipRect.height)
                    : sortedTooltipItems[currentIndex + 1].yPosition;
                var availableSpace = nextTooltipY - currentTooltipBottom;
                if (availableSpace > overflowAmount) {
                    for (var shiftIndex = currentIndex; shiftIndex >= 0; shiftIndex--) {
                        sortedTooltipItems[shiftIndex].yPosition += overflowAmount;
                    }
                    break;
                }
            }
        }
        for (var _g = 0, sortedTooltipItems_1 = sortedTooltipItems; _g < sortedTooltipItems_1.length; _g++) {
            var tooltipItem = sortedTooltipItems_1[_g];
            this.splitTooltipRectCollection[tooltipItem.originalIndex].y = tooltipItem.yPosition;
        }
    };
    /**
     * Draws a connector line between the default tooltip position and the actual position
     * @param splitIndex - Index of the split tooltip
     * @param pointLocationX - pointLocation X position of the tooltip
     * @param pointLocationY - pointLocation Y position of the tooltip
     * @returns The connector line element
     * @private
     */
    Tooltip.prototype.drawConnectorLine = function (splitIndex, pointLocationX, pointLocationY) {
        var startX = pointLocationX - this.splitTooltipRectCollection[splitIndex].x;
        var startY = pointLocationY - this.splitTooltipRectCollection[splitIndex].y;
        var endX = this.hasHorizontalOverflow ? this.splitTooltipRectCollection[splitIndex].width : 0;
        var endY = this.splitTooltipRectCollection[splitIndex].height / 2;
        var connectorPath = 'M ' + startX + ' ' + startY + ' L ' + endX + ' ' + endY;
        var connectorLine = this.renderer.drawPath({
            'id': this.element.id + '_tooltip_connector_' + splitIndex,
            'd': connectorPath,
            'stroke': this.palette[splitIndex],
            'stroke-width': 1,
            'opacity': this.opacity
        });
        return connectorLine;
    };
    /**
     * Handle split tooltip connector and compute initial rect and overflow.
     * Returns the rect, whether tooltip overflows and whether it should be left-aligned.
     */
    Tooltip.prototype.handleSplitPosition = function (splitIndex, groupElement, areaBounds, arrowLocation, tipLocation) {
        var pointLocationX = this.splitLocations[splitIndex].x + this.splitClipBounds[splitIndex].x;
        var pointLocationY = this.splitLocations[splitIndex].y + this.splitClipBounds[splitIndex].y;
        var isConnectorLineNeeded = pointLocationY !== (this.splitTooltipRectCollection[splitIndex].y + this.splitTooltipRectCollection[splitIndex].height / 2) && (this.seriesTypes[splitIndex] !== 'Column');
        var isLeft = false;
        if (isConnectorLineNeeded) {
            var connectorLine = this.drawConnectorLine(splitIndex, pointLocationX, pointLocationY);
            groupElement.appendChild(connectorLine);
        }
        else {
            if (document.getElementById(this.element.id + '_tooltip_connector_' + splitIndex)) {
                removeElement(this.element.id + '_tooltip_connector_' + splitIndex);
            }
            arrowLocation.x = this.hasHorizontalOverflow ? this.splitTooltipRectCollection[splitIndex].width : 0;
            arrowLocation.y = this.splitTooltipRectCollection[splitIndex].height / 2;
            tipLocation.y = this.splitTooltipRectCollection[splitIndex].height / 2;
            if (this.hasHorizontalOverflow) {
                isLeft = true;
            }
        }
        var rect = this.splitTooltipRectCollection[splitIndex];
        var tooltipOverflow = (rect.y < (0) || rect.y + rect.height > (areaBounds.height)) ||
            !(withInAreaBounds(pointLocationX, pointLocationY, this.splitClipBounds[splitIndex]));
        return { rect: rect, tooltipOverflow: tooltipOverflow, isLeft: isLeft, isConnectorLineNeeded: isConnectorLineNeeded };
    };
    Tooltip.prototype.createTooltipElement = function () {
        this.textElements = [];
        if (!this.template || this.shared) {
            // SVG element for tooltip
            if (this.enableRTL) {
                this.element.setAttribute('dir', 'ltr');
            }
            var svgObject = this.renderer.createSvg({ id: this.element.id + '_svg' });
            this.element.appendChild(svgObject);
            if (this.split) {
                this.configureSplitTooltipElements(svgObject);
            }
            else {
                // Group to hold text and path.
                var groupElement = document.getElementById(this.element.id + '_group');
                if (!groupElement) {
                    groupElement = this.renderer.createGroup({ id: this.element.id + '_group' });
                    groupElement.setAttribute('transform', 'translate(0,0)');
                }
                svgObject.appendChild(groupElement);
                var pathElement = this.renderer.drawPath({
                    'id': this.element.id + '_path',
                    'stroke-width': ((this.theme === 'Fabric' || this.theme === 'Fluent' || this.theme === 'Fluent2' || this.theme === 'Fluent2HighContrast') && !this.border.width) ? 1 : this.border.width,
                    'fill': this.fill || this.themeStyle.tooltipFill,
                    'opacity': ((this.theme === 'TailwindDark' || this.theme === 'Tailwind' || this.theme === 'Tailwind3Dark' || this.theme === 'Tailwind3' || this.theme === 'Bootstrap5' || this.theme === 'Bootstrap5Dark' || this.theme.indexOf('Fluent2') > -1) && this.opacity === 0.75) ? 1 : this.opacity,
                    'stroke': this.border.color || (this.theme === 'Fabric' || this.theme === 'Fluent' || this.theme === 'Fluent2' ? '#D2D0CE' : this.border.color)
                });
                groupElement.appendChild(pathElement);
            }
        }
    };
    /**
     * Create groups and paths for split tooltip mode.
     * @private
     */
    Tooltip.prototype.configureSplitTooltipElements = function (svgObject) {
        for (var splitIndex = 0; splitIndex < (this.split ? this.content.length : 1); splitIndex++) {
            // Group to hold text and path for each split tooltip.
            var groupElement = document.getElementById(this.element.id + '_group_' + splitIndex);
            if (!groupElement) {
                groupElement = this.renderer.createGroup({ id: this.element.id + '_group_' + splitIndex });
                groupElement.setAttribute('transform', 'translate(0,0)');
            }
            svgObject.appendChild(groupElement);
            var pathElement = this.renderer.drawPath({
                'id': this.element.id + '_path_' + splitIndex,
                'stroke-width': ((this.theme === 'Fabric' || this.theme === 'Fluent' || this.theme === 'Fluent2' || this.theme === 'Fluent2HighContrast') && !this.border.width) ? 1 : this.border.width,
                'fill': this.fill || this.themeStyle.tooltipFill,
                'opacity': ((this.theme === 'TailwindDark' || this.theme === 'Tailwind' || this.theme === 'Tailwind3Dark' || this.theme === 'Tailwind3' || this.theme === 'Bootstrap5' || this.theme === 'Bootstrap5Dark' || this.theme.indexOf('Fluent2') > -1) && this.opacity === 0.75) ? 1 : this.opacity,
                'stroke': this.border.color || (this.theme === 'Fabric' || this.theme === 'Fluent' || this.theme === 'Fluent2' ? '#D2D0CE' : this.border.color)
            });
            groupElement.appendChild(pathElement);
        }
    };
    Tooltip.prototype.drawMarker = function (isBottom, isRight, size, splitIndex) {
        if (this.shapes.length <= 0) {
            return null;
        }
        var shapeOption;
        var count = 0;
        var markerGroup = this.renderer.createGroup({ id: (this.split ? this.element.id + '_trackball_group_' + splitIndex : this.element.id + '_trackball_group') });
        var groupElement = getElement(this.split ? this.element.id + '_group_' + splitIndex : this.element.id + '_group');
        if (!groupElement) {
            return null;
        }
        var x = ((this.enableRTL) ? (this.split ? this.splitTooltipRectCollection[splitIndex].width
            - size - this.marginX : this.elementSize.width - (size / 2)) :
            (this.marginX * 2) + (size / 2)) + (isRight ? this.arrowPadding : 0);
        for (var index = 0; index < this.shapes.length; index++) {
            var shape = this.shapes[this.split ? splitIndex : index];
            if (!(this.split && (splitIndex !== index))) {
                if (shape !== 'None') {
                    shapeOption = new PathOption(this.element.id + ('_Trackball_' + (this.split ? splitIndex : count)), this.palette[(this.split ? splitIndex : count)], 1, '#cccccc', 1, null);
                    if (this.markerPoint[(this.split ? 0 : count)]) {
                        var padding = 0;
                        if (this.header.indexOf('<br') > -1) {
                            padding = this.header.split(/<br.*?>/g).length + (this.split ? splitIndex : count);
                        }
                        var tooltipContent = (this.formattedText && this.formattedText.length >= 2)
                            ? this.getTooltipTextContent(this.formattedText[1]) + ", " + this.getTooltipTextContent(this.formattedText[0])
                            : '';
                        markerGroup.appendChild(drawSymbol(new TooltipLocation(x, this.markerPoint[(this.split ? 0 : count)]
                            - this.padding + (isBottom ? this.arrowPadding : padding)), shape, new Size(size, size), this.markerImage, shapeOption, 'img', tooltipContent));
                    }
                    count++;
                }
            }
        }
        groupElement.appendChild(markerGroup);
    };
    Tooltip.prototype.renderTooltipElement = function (areaBounds, location, splitIndex) {
        var tooltipDiv = getElement(this.element.id);
        var arrowLocation = new TooltipLocation(0, 0);
        var tipLocation = new TooltipLocation(0, 0);
        var svgObject = getElement(this.element.id + '_svg');
        var groupElement = getElement(this.split ? this.element.id + '_group_' + splitIndex : this.element.id + '_group');
        var pathElement = getElement(this.split ? this.element.id + '_path_' + splitIndex : this.element.id + '_path');
        var rect;
        var isConnectorLineNeeded;
        var isTop = false;
        var isLeft = false;
        var isBottom = false;
        var x = 0;
        var y = 0;
        var tooltipOverflow;
        if (!isNullOrUndefined(groupElement)) {
            if (this.header !== '' && this.showHeaderLine) {
                this.elementSize.height += this.marginY;
            }
            if (this.split) {
                var splitResult = this.handleSplitPosition(splitIndex, groupElement, areaBounds, arrowLocation, tipLocation);
                rect = splitResult.rect;
                tooltipOverflow = splitResult.tooltipOverflow;
                isConnectorLineNeeded = splitResult.isConnectorLineNeeded;
                isLeft = splitResult.isLeft;
            }
            else if (this.isFixed) {
                var width = this.elementSize.width + (2 * this.marginX);
                var height = this.elementSize.height + (2 * this.marginY);
                rect = new Rect(location.x, location.y, width, height);
            }
            else if (this.content.length > 1 || this.followPointer) {
                rect = this.sharedTooltipLocation(areaBounds, this.location.x, this.location.y);
                isTop = true;
            }
            else {
                rect = this.tooltipLocation(areaBounds, location, arrowLocation, tipLocation);
                if (!this.inverted) {
                    isTop = (rect.y < (location.y + this.clipBounds.y));
                    isBottom = !isTop;
                    y = (isTop ? 0 : this.arrowPadding);
                }
                else {
                    isLeft = (rect.x < (location.x + this.clipBounds.x));
                    x = (isLeft ? 0 : this.arrowPadding);
                    if (this.allowHighlight) {
                        rect.x += isLeft ? this.highlightPadding : -(2 * this.highlightPadding);
                    }
                }
            }
            if (this.header !== '' && this.showHeaderLine && !this.split) {
                var wrapPadding = 2;
                var padding = 0;
                var wrapHeader = this.isWrap ? this.wrappedText : this.header;
                if (this.isWrap && typeof (wrapHeader) === 'string' && (wrapHeader.indexOf('<') > -1 || wrapHeader.indexOf('>') > -1)) {
                    var textArray = wrapHeader.split('<br>');
                    wrapPadding = textArray.length;
                }
                if (this.header.indexOf('<br') > -1) {
                    padding = 5 * (this.header.split(/<br.*?>/g).length - 1);
                }
                var key = 'properties';
                var font = extend({}, this.textStyle, null, true)[key];
                var headerSize = measureText(this.isWrap ? this.wrappedText : this.header, font, this.themeStyle.textStyle).height
                    + (this.marginY * wrapPadding) + (isBottom ? this.arrowPadding : 0) + (this.isWrap ? 5 : padding); //header padding;
                var xLength = (this.marginX * 3) + (!isLeft && !isTop && !isBottom ? this.arrowPadding : 0);
                var direction = 'M ' + xLength + ' ' + headerSize +
                    'L ' + (rect.width + (!isLeft && !isTop && !isBottom ? this.arrowPadding : 0) - (this.marginX * 2)) +
                    ' ' + headerSize;
                var pathElement_1 = this.renderer.drawPath({
                    'id': this.element.id + '_header_path', 'stroke-width': 1,
                    'fill': null, 'opacity': this.theme === 'Material3' || this.theme === 'Material3Dark' ? 0.2 : 0.8, 'stroke': this.themeStyle.tooltipHeaderLine, 'd': direction
                });
                groupElement.appendChild(pathElement_1);
            }
            var start = this.border.width / 2;
            var pointRect = new Rect(start + x, start + y, rect.width - start, rect.height - start);
            groupElement.setAttribute('opacity', this.split && tooltipOverflow ? '0' : '1');
            if (this.enableAnimation && !this.isFirst && !this.crosshair) {
                this.animateTooltipDiv((this.split ? groupElement : tooltipDiv), rect);
            }
            else {
                this.updateDiv((this.split ? groupElement : tooltipDiv), rect.x, rect.y);
            }
            // eslint-disable-next-line no-extra-boolean-cast
            svgObject.setAttribute('height', (this.split ? this.areaBounds.height : (rect.height + this.border.width + (!((!this.inverted)) ? 0 : this.arrowPadding) + 5)).toString());
            svgObject.setAttribute('width', (this.split ? this.areaBounds.width : (rect.width + this.border.width + (((!this.inverted)) ? 0 : this.arrowPadding) + 5)).toString());
            svgObject.setAttribute('opacity', '1');
            if (!isNullOrUndefined(this.tooltipPlacement)) {
                isTop = this.tooltipPlacement.indexOf('Top') > -1;
                isBottom = this.tooltipPlacement.indexOf('Bottom') > -1;
                isLeft = this.tooltipPlacement.indexOf('Left') > -1;
            }
            pathElement.setAttribute('d', findDirection(this.rx, this.ry, pointRect, arrowLocation, isConnectorLineNeeded ? 0 : this.arrowPadding, isTop, isBottom, isLeft, tipLocation.x, tipLocation.y, this.controlName));
            if ((this.enableShadow && this.theme !== 'Bootstrap4') || this.theme.indexOf('Fluent2') > -1) {
                // To fix next chart initial tooltip opacity issue in tab control
                var shadowId = this.element.id + '_shadow';
                if (this.theme === 'Tailwind' || this.theme === 'TailwindDark' || this.theme === 'Tailwind3' || this.theme === 'Tailwind3Dark'
                    || this.theme === 'Bootstrap5' || this.theme === 'Bootstrap5Dark') {
                    pathElement.setAttribute('box-shadow', '0px 1px 2px rgba(0, 0, 0, 0.06), 0px 1px 3px rgba(0, 0, 0, 0.1)');
                }
                else {
                    pathElement.setAttribute('filter', Browser.isIE ? '' : 'url(#' + shadowId + ')');
                }
                var shadow = '<filter id="' + shadowId + '" height="130%"><feGaussianBlur in="SourceAlpha" stdDeviation="3"/>';
                if (this.theme.indexOf('Fluent2') > -1) {
                    shadow += '<feOffset dx="-1" dy="3.6" result="offsetblur"/><feComponentTransfer><feFuncA type="linear" slope="0.2"/>';
                }
                else {
                    shadow += '<feOffset dx="3" dy="3" result="offsetblur"/><feComponentTransfer><feFuncA type="linear" slope="0.5"/>';
                }
                shadow += '</feComponentTransfer><feMerge><feMergeNode/><feMergeNode in="SourceGraphic"/></feMerge></filter>';
                var defElement = this.renderer.createDefs();
                defElement.setAttribute('id', this.element.id + 'SVG_tooltip_definition');
                groupElement.appendChild(defElement);
                defElement.innerHTML = shadow;
            }
            var borderColor = ((this.theme === 'Fabric' || this.theme === 'Fluent' || this.theme === 'Fluent2') && !this.border.color) ? '#D2D0CE' : this.theme === 'Fluent2HighContrast' ? '#FFFFFF' : this.border.color;
            pathElement.setAttribute('stroke', borderColor);
            if (!isNullOrUndefined(this.border.dashArray)) {
                pathElement.setAttribute('stroke-dasharray', this.border.dashArray);
            }
            this.changeText(new TooltipLocation(x, y), isBottom, !isLeft && !isTop && !isBottom, splitIndex);
            if (this.revert) {
                this.inverted = !this.inverted;
                this.revert = false;
            }
        }
        return new Side(isBottom, !isLeft && !isTop && !isBottom);
    };
    Tooltip.prototype.changeText = function (point, isBottom, isRight, splitIndex) {
        var element = document.getElementById(this.split ? this.element.id + '_text_' + splitIndex : this.element.id + '_text');
        if (isBottom) {
            element.setAttribute('transform', 'translate(0,' + this.arrowPadding + ')');
        }
        if (isRight) {
            element.setAttribute('transform', 'translate(' + this.arrowPadding + ' 0)');
        }
    };
    Tooltip.prototype.findFormattedText = function (splitIndex) {
        this.formattedText = [];
        if (this.header.replace(/<b>/g, '').replace(/<\/b>/g, '').trim() !== '' && !this.split) {
            this.formattedText = this.formattedText.concat(this.header);
        }
        this.formattedText = this.formattedText.concat(this.split ? this.content[splitIndex] : this.content);
    };
    // tslint:disable-next-line:max-func-body-length
    Tooltip.prototype.renderText = function (isRender, splitIndex) {
        var height = 0;
        var width = 0; // Padding for text;
        var subWidth = 0;
        var lines;
        var key = 'properties';
        var font = extend({}, this.textStyle, null, true)[key];
        var groupElement = getElement(this.split ? this.element.id + '_group_' + splitIndex : this.element.id + '_group');
        var tspanElement;
        var textCollection;
        var tspanStyle = '';
        var line;
        var tspanOption;
        this.findFormattedText(splitIndex);
        this.isWrap = false;
        var isRtlEnabled = document.body.getAttribute('dir') === 'rtl';
        var anchor = isRtlEnabled && !this.enableRTL ? 'end' : 'start';
        this.leftSpace = this.areaBounds.x + this.location.x;
        this.rightSpace = (this.areaBounds.x + this.areaBounds.width) - this.leftSpace;
        var headerContent = this.split ? '' : this.header.replace(/<b>/g, '').replace(/<\/b>/g, '').trim();
        var isBoldTag = this.header.indexOf('<b>') > -1 && this.header.indexOf('</b>') > -1;
        var headerWidth = measureText(this.formattedText[0], font, this.themeStyle.textStyle).width
            + (2 * this.marginX) + this.arrowPadding;
        var isLeftSpace = (this.location.x - headerWidth) < this.location.x;
        var isRightSpace = (this.areaBounds.x + this.areaBounds.width) < (this.location.x + headerWidth);
        var header;
        var headerSpace = (headerContent !== '' && this.showHeaderLine) ? this.marginY : 0;
        var isRow = true;
        var isColumn = true;
        this.markerPoint = [];
        var markerSize = (this.shapes.length > 0) ? 10 : 0;
        var markerPadding = (this.shapes.length > 0) ? 5 : 0;
        var spaceWidth = 4;
        var subStringLength;
        var fontSize = '12px';
        var fontWeight = '400';
        var labelColor = this.themeStyle.tooltipLightLabel;
        var dy = (22 / parseFloat(fontSize)) * (parseFloat(font.size || this.themeStyle.textStyle.size));
        var contentWidth = [];
        var textHeight = 0;
        if (!isRender || this.isCanvas) {
            removeElement(this.split ? this.element.id + '_text_' + splitIndex : this.element.id + '_text');
            removeElement(this.element.id + '_header_path');
            removeElement(this.split ? this.element.id + '_trackball_group_' + splitIndex : this.element.id + '_trackball_group');
            removeElement(this.element.id + 'SVG_tooltip_definition');
        }
        // Condition to resolve the text size issue only in chart.
        if (this.controlName === 'Chart' && parseFloat(fontSize) < parseFloat(font.size || this.themeStyle.textStyle.headerTextSize)) {
            textHeight = (parseFloat(font.size || this.themeStyle.textStyle.size) - parseFloat(fontSize));
        }
        var options = new TextOption(this.split ? this.element.id + '_text_' + splitIndex : this.element.id + '_text', this.marginX * 2, (textHeight + this.marginY * 2 + this.padding * 2 + (this.marginY === 2 ? this.controlName === 'RangeNavigator' ? 5 : 3 : 0)), anchor, '');
        var parentElement = textElement(options, font, font.color || this.themeStyle.tooltipBoldLabel, groupElement, this.themeStyle.textStyle);
        var withoutHeader = this.formattedText.length === 1 && this.formattedText[0].indexOf(' : <b>') > -1;
        var isHeader = this.split ? false : this.header !== '';
        var size = isHeader && isBoldTag ? 16 : 13;
        for (var k = 0, pointsLength = this.formattedText.length; k < pointsLength; k++) {
            textCollection = this.formattedText[k].replace(/<(b|strong)>/g, '<b>')
                .replace(/<\/(b|strong)>/g, '</b>')
                .split(/<br.*?>/g);
            if (this.isTextWrap && this.header !== this.formattedText[k] && this.formattedText[k].indexOf('<br') === -1) {
                subStringLength = Math.round(this.leftSpace > this.rightSpace ? (this.leftSpace / size) : (this.rightSpace / size));
                textCollection = this.formattedText[k].match(new RegExp('.{1,' + subStringLength + '}', 'g'));
            }
            if (k === 0 && !withoutHeader && this.isTextWrap &&
                (this.leftSpace < headerWidth || isLeftSpace) &&
                (this.rightSpace < headerWidth || isRightSpace)) {
                subStringLength = Math.round(this.leftSpace > this.rightSpace ? (this.leftSpace / size) : (this.rightSpace / size));
                header = headerContent !== '' ? headerContent : this.formattedText[k];
                textCollection = header.match(new RegExp('.{1,' + subStringLength + '}', 'g'));
                this.wrappedText = isBoldTag ? '<b>' + textCollection.join('<br>') + '</b>' : textCollection.join('<br>');
                this.isWrap = textCollection.length > 1;
            }
            if (textCollection[0] === '') {
                continue;
            }
            if ((k !== 0) || (headerContent === '')) {
                this.markerPoint.push(((headerContent !== '' && this.showHeaderLine) ? (this.marginY) : 0) + options.y + height - (textHeight !== 0 ? ((textHeight / this.markerSize) * (parseFloat(font.size || this.themeStyle.textStyle.headerTextSize) / this.markerSize)) : 0));
            }
            for (var i = 0, len = textCollection.length; i < len; i++) { // string value of unicode for LTR is \u200E
                lines = textCollection[i].replace(/<b>/g, '<br><b>').replace(/<\/b>/g, '</b><br>').replace(/:/g, (this.enableRTL) ? '<br>\u200E: <br>' : '<br>\u200E:<br>')
                    .split('<br>');
                if (this.enableRTL && lines.length > 0) {
                    var colonMatches = textCollection[i].match(/:/g);
                    var colonCount = colonMatches ? colonMatches.length : 0;
                    var shouldReverse = colonCount > 0 &&
                        (this.controlName === 'Sankey' ? colonCount === 1 : true);
                    if (shouldReverse) {
                        lines[0] = lines[0].trim();
                        lines.reverse();
                    }
                }
                subWidth = 0;
                isColumn = true;
                height += dy;
                for (var j = 0, len_1 = lines.length; j < len_1; j++) {
                    line = lines[j];
                    if (this.enableRTL && line !== '' && this.isRTLText(line)) {
                        line = line.concat('\u200E');
                    }
                    if (!/\S/.test(line) && line !== '') {
                        line = ' '; //to trim multiple white spaces to single white space
                    }
                    if ((!isColumn && line === ' ') || (line.replace(/<b>/g, '').replace(/<\/b>/g, '').trim() !== '')) {
                        subWidth += line !== ' ' ? spaceWidth : 0;
                        if (isColumn && !isRow) {
                            if (this.header.indexOf('<br') > -1 && k !== 0) {
                                headerSpace += this.header.split(/<br.*?>/g).length;
                            }
                            tspanOption = {
                                x: (this.marginX * 2) + (markerSize + markerPadding),
                                dy: dy + ((isColumn) ? headerSpace : 0), fill: ''
                            };
                            headerSpace = null;
                        }
                        else {
                            if (isRow && isColumn) {
                                tspanOption = {
                                    x: (headerContent === '') ? ((this.marginX * 2) + (markerSize + markerPadding))
                                        : (this.marginX * 2) + (this.isWrap ? (markerSize + markerPadding) : 0)
                                };
                            }
                            else {
                                tspanOption = {};
                            }
                        }
                        isColumn = false;
                        tspanElement = this.renderer.createTSpan(tspanOption, '');
                        parentElement.appendChild(tspanElement);
                        if (line.indexOf('<b>') > -1 || ((isBoldTag && j === 0 && k === 0) && (isHeader || this.isWrap))) {
                            fontWeight = '600';
                            labelColor = this.themeStyle.tooltipBoldLabel;
                            tspanStyle = 'font-weight:' + fontWeight;
                            font.fontWeight = fontWeight;
                            (tspanElement).setAttribute('fill', this.textStyle.color || labelColor);
                        }
                        else {
                            tspanStyle = fontWeight === '600' ? 'font-weight:' + fontWeight : '';
                            font.fontWeight = fontWeight;
                            (tspanElement).setAttribute('fill', this.textStyle.color || labelColor);
                        }
                        if (line.indexOf('</b>') > -1 || ((isBoldTag && j === len_1 - 1 && k === 0) && (isHeader || this.isWrap))) {
                            fontWeight = 'Normal';
                            labelColor = this.themeStyle.tooltipLightLabel;
                        }
                        // eslint-disable-next-line no-useless-escape
                        if (tspanStyle !== '') {
                            tspanElement.style.fontWeight = tspanStyle.split('font-weight:')[1];
                            tspanElement.style.color = tspanElement.getAttribute('fill');
                        }
                        // 'inherit' will apply css style from parent element.
                        tspanElement.style.fontFamily = 'inherit';
                        tspanElement.style.fontStyle = 'inherit';
                        tspanElement.style.fontSize = (this.header === this.formattedText[k]) ? font.size || this.themeStyle.textStyle.headerTextSize : (line.indexOf('<b>') > -1 || line.indexOf('</b>') > -1) ? font.size || this.themeStyle.textStyle.boldTextSize : font.size || this.themeStyle.textStyle.size;
                        tspanElement.style.fontWeight = (this.header === this.formattedText[k] && (this.header.indexOf('<b>') === -1 || this.header.indexOf('</b>') === -1)) ? (this.textStyle.fontWeight || (this.theme.indexOf('Tailwind3') > -1 ? '500' : '600')) : line.indexOf('<b>') > -1 || line.indexOf('</b>') > -1 ? (this.theme.indexOf('Bootstrap5') > -1) ? (this.textStyle.fontWeight || '600') : 'bold' : ((line.indexOf('<b>') === -1 || line.indexOf('</b>') === -1) && (this.theme.indexOf('Bootstrap5') > -1 || this.theme.indexOf('Tailwind3') > -1)) ? this.textStyle.fontWeight || (this.theme.indexOf('Tailwind3') > -1 ? '500' : '600') : (this.textStyle.fontWeight || font.fontWeight);
                        var textFont = extend({}, this.textStyle, null, true)[key];
                        textFont.fontWeight = tspanElement.style.fontWeight;
                        textFont.size = tspanElement.style.fontSize;
                        isRow = false;
                        (tspanElement).textContent = line = this.getTooltipTextContent(line);
                        subWidth += measureText(line, textFont, this.themeStyle.textStyle).width;
                    }
                }
                subWidth -= spaceWidth;
                width = Math.max(width, subWidth);
                contentWidth.push(subWidth);
            }
        }
        this.elementSize = new Size(width + (width > 0 ? (2 * this.marginX) : 0), height);
        this.elementSize.width += (markerSize + markerPadding); // marker size + marker Spacing
        var element = (parentElement.childNodes[0]);
        if (headerContent !== '' && element && !this.isWrap) {
            font.fontWeight = '600';
            var width_1 = (this.elementSize.width + (2 * this.padding)) / 2 - measureText(headerContent, font, this.themeStyle.textStyle, true).width
                / 2;
            element.setAttribute('x', width_1.toString());
        }
        this.renderContentRTL(parentElement, isHeader, markerSize + markerPadding, contentWidth);
        if (this.split) {
            var padding = 20;
            var elementWidth = this.elementSize.width + (2 * this.marginX);
            var elementHeight = this.elementSize.height + (2 * this.marginY);
            var rect = new Rect(this.splitLocations[splitIndex].x
                + this.splitClipBounds[splitIndex].x + padding, (this.splitLocations[splitIndex].y
                + this.splitClipBounds[splitIndex].y) - elementHeight / 2, elementWidth, elementHeight);
            this.splitTooltipRectCollection.push(rect);
        }
    };
    Tooltip.prototype.renderContentRTL = function (textElement, isHeader, markerSize, contentWidth) {
        if (this.enableRTL) {
            var tspanElement = void 0;
            var contentWidthIndex = isHeader ? 1 : 0;
            for (var i = 0; i < textElement.childNodes.length; i++) {
                tspanElement = (textElement.childNodes[i]);
                if ((!isHeader || i > 0) && !isNullOrUndefined(tspanElement.getAttribute('x'))) {
                    tspanElement.setAttribute('x', (this.elementSize.width - (markerSize + contentWidth[contentWidthIndex])).toString());
                    contentWidthIndex++;
                }
            }
        }
    };
    Tooltip.prototype.getTooltipTextContent = function (tooltipText) {
        var characterCollection = tooltipText.match(/<[a-zA-Z\/](.|\n)*?>/g);
        if (isNullOrUndefined(characterCollection)) {
            return tooltipText;
        }
        var isRtlText = this.isRTLText(tooltipText);
        for (var i = 0; i < characterCollection.length; i++) {
            if (this.isValidHTMLElement(characterCollection[i].replace('<', '').replace('/', '').replace('>', '').trim())) {
                tooltipText = tooltipText.replace(characterCollection[i], isRtlText ? '\u200E' : '');
            }
        }
        return tooltipText;
    };
    Tooltip.prototype.isValidHTMLElement = function (element) {
        return document.createElement(element).toString() !== '[object HTMLUnknownElement]';
    };
    Tooltip.prototype.isRTLText = function (tooltipContent) {
        return /[\u0590-\u07FF\u200F\u202B\u202E\uFB1D-\uFDFD\uFE70-\uFEFC]/.test(tooltipContent);
    };
    Tooltip.prototype.createTemplate = function (areaBounds, location, splitIndex) {
        var argsData = { cancel: false, name: 'tooltipRender', tooltip: this };
        this.trigger('tooltipRender', argsData);
        var parent = document.getElementById(this.element.id);
        if (this.isCanvas) {
            this.removeSVG();
        }
        if (this.split && !isNullOrUndefined(splitIndex)) {
            parent.setAttribute('opacity', '1');
            parent.style.display = '';
            var splitParentId = this.element.id + 'parent_template' + splitIndex;
            var splitParentElem = document.getElementById(splitParentId);
            if (splitParentElem) {
                remove(splitParentElem);
            }
        }
        else {
            var firstElement = !isNullOrUndefined(parent) ? parent.firstElementChild : null;
            if (firstElement) {
                remove(firstElement);
            }
        }
        if (!argsData.cancel) {
            var elem = createElement('div', { id: this.split ? this.element.id + 'parent_template' + splitIndex : this.element.id + 'parent_template' });
            var templateElement = void 0;
            if (this.controlName === 'Chart' && this.shared) {
                for (var i = 0; i < this.data.length; i++) {
                    var sharedTemplateElement = this.templateFn(this.data[i], this.controlInstance, elem.id, elem.id + '_blazorTemplate', '');
                    if (i === 0) {
                        templateElement = sharedTemplateElement;
                    }
                    else {
                        if (sharedTemplateElement.length > 1) {
                            templateElement[i].outerHTML = sharedTemplateElement[i].outerHTML || sharedTemplateElement[i].textContent;
                        }
                        else {
                            templateElement[templateElement.length - 1].outerHTML += sharedTemplateElement[0].outerHTML;
                        }
                    }
                }
            }
            else {
                templateElement = this.templateFn(this.split ? this.data[splitIndex] : this.data, this.controlInstance, elem.id, elem.id + '_blazorTemplate', '');
            }
            while (templateElement && templateElement.length > 0) {
                if (isBlazor() || templateElement.length === 1) {
                    elem.appendChild(templateElement[0]);
                    templateElement = null;
                }
                else {
                    elem.appendChild(templateElement[0]);
                }
            }
            if (!isNullOrUndefined(parent)) {
                parent.appendChild(elem);
            }
            var element = this.split || this.isCanvas ? elem : this.element;
            var rect = element.getBoundingClientRect();
            this.padding = 0;
            this.elementSize = new Size(rect.width, rect.height);
            var tooltipRect = void 0;
            if (this.split && !isNullOrUndefined(splitIndex)) {
                var padding = 20;
                var elementWidth = this.elementSize.width + (2 * this.marginX);
                var elementHeight = this.elementSize.height + (2 * this.marginY);
                var rect_1 = new Rect(this.splitLocations[splitIndex].x
                    + this.splitClipBounds[splitIndex].x + padding, (this.splitLocations[splitIndex].y
                    + this.splitClipBounds[splitIndex].y) - elementHeight / 2, elementWidth, elementHeight);
                tooltipRect = rect_1;
            }
            else {
                tooltipRect = this.shared ? this.sharedTooltipLocation(areaBounds, this.location.x, this.location.y)
                    : this.tooltipLocation(areaBounds, location, new TooltipLocation(0, 0), new TooltipLocation(0, 0));
            }
            if (this.enableAnimation && !this.isFirst && !this.crosshair) {
                this.animateTooltipDiv(this.element, tooltipRect);
            }
            else {
                this.updateDiv(element, tooltipRect.x, tooltipRect.y);
            }
            if (this.blazorTemplate) {
                //Customer issue - F149037  Call back function to handle the blazor tooltip alignment issues
                var tooltipRendered = function () {
                    var rect1 = getElement(thisObject_1.element.id).getBoundingClientRect();
                    thisObject_1.elementSize = new Size(rect1.width, rect1.height);
                    var tooltipRect1 = thisObject_1.tooltipLocation(areaBounds, location, new TooltipLocation(0, 0), new TooltipLocation(0, 0));
                    thisObject_1.updateDiv(getElement(thisObject_1.element.id), tooltipRect1.x, tooltipRect1.y);
                };
                // eslint-disable-next-line @typescript-eslint/no-this-alias
                var thisObject_1 = this;
                tooltipRendered.bind(thisObject_1, areaBounds, location);
                updateBlazorTemplate(this.element.id + 'parent_template' + '_blazorTemplate', this.blazorTemplate.name, this.blazorTemplate.parent, undefined, tooltipRendered);
            }
        }
        else {
            remove(getElement(this.element.id + '_tooltip'));
        }
    };
    Tooltip.prototype.sharedTooltipLocation = function (bounds, x, y) {
        var width = this.elementSize.width + (2 * this.marginX);
        var height = this.elementSize.height + (2 * this.marginY);
        var pointerTooltipRect = new Rect((this.shared || this.inverted)
            ? (x + 2 * this.padding) : (x - width / 2), (this.shared || this.inverted) ? (y - height / 2)
            : (y - (height + this.padding)), width, height);
        var tooltipRect = this.followPointer ? pointerTooltipRect : new Rect(x + 2 * this.padding, y - height - this.padding, width, height);
        if (tooltipRect.y < bounds.y) {
            tooltipRect.y += (tooltipRect.height + 2 * this.padding);
        }
        if (tooltipRect.y + tooltipRect.height > bounds.y + bounds.height) {
            tooltipRect.y = Math.max((bounds.y + bounds.height) - (tooltipRect.height + 2 * this.padding), bounds.y);
        }
        if (tooltipRect.x + tooltipRect.width > bounds.x + bounds.width) {
            tooltipRect.x = (bounds.x + this.location.x) - (tooltipRect.width + 4 * this.padding);
        }
        if (tooltipRect.x < bounds.x) {
            tooltipRect.x = bounds.x;
        }
        return tooltipRect;
    };
    /** @private */
    Tooltip.prototype.getCurrentPosition = function (bounds, symbolLocation, arrowLocation, tipLocation) {
        var position = this.tooltipPlacement;
        var clipX = this.clipBounds.x;
        var clipY = this.clipBounds.y;
        var markerHeight = this.offset;
        var width = this.elementSize.width + (2 * this.marginX);
        var height = this.elementSize.height + (2 * this.marginY);
        var location = new TooltipLocation(symbolLocation.x, symbolLocation.y);
        if (position === 'Top' || position === 'Bottom') {
            location = new TooltipLocation(location.x + clipX - this.elementSize.width / 2 - this.padding, location.y + clipY - this.elementSize.height - (2 * this.padding) - this.arrowPadding - markerHeight);
            arrowLocation.x = tipLocation.x = width / 2;
            if (position === 'Bottom') {
                location.y = symbolLocation.y + clipY + markerHeight;
            }
            if (bounds.x + bounds.width < location.x + width) {
                location.x = (bounds.width > width) ? ((bounds.x + bounds.width) - width + 6) : bounds.x;
                arrowLocation.x = tipLocation.x = (bounds.width > width) ? (bounds.x + symbolLocation.x - location.x) : symbolLocation.x;
            }
            else if (bounds.x > location.x) {
                location.x = bounds.x;
                arrowLocation.x = tipLocation.x = symbolLocation.x;
            }
        }
        else {
            location = new TooltipLocation(location.x + clipX + markerHeight, location.y + clipY - this.elementSize.height / 2 - (this.padding));
            arrowLocation.y = tipLocation.y = height / 2;
            if (position === 'Left') {
                location.x = symbolLocation.x + clipX - markerHeight - (width + this.arrowPadding);
            }
            if (bounds.y + bounds.height < location.y + height) {
                location.y = (bounds.height > height) ? ((bounds.y + bounds.height) - height + 6) : bounds.y;
                arrowLocation.y = tipLocation.y = (bounds.height > height) ? (bounds.y + symbolLocation.y - location.y) : symbolLocation.y;
            }
            else if (bounds.y > location.y) {
                location.y = bounds.y;
                arrowLocation.y = tipLocation.y = symbolLocation.y;
            }
        }
        return new Rect(location.x, location.y, width, height);
    };
    // tslint:disable-next-line:max-func-body-length
    /** @private */
    Tooltip.prototype.tooltipLocation = function (bounds, symbolLocation, arrowLocation, tipLocation) {
        if (!isNullOrUndefined(this.tooltipPlacement)) {
            var tooltipRect = this.getCurrentPosition(bounds, symbolLocation, arrowLocation, tipLocation);
            return tooltipRect;
        }
        var location = new TooltipLocation(symbolLocation.x, symbolLocation.y);
        var width = this.elementSize.width + (2 * this.marginX);
        var height = this.elementSize.height + (2 * this.marginY);
        var markerHeight = this.offset;
        var clipX = this.clipBounds.x;
        var clipY = this.clipBounds.y;
        var clipWidth = this.clipBounds.width;
        var clipHeight = this.clipBounds.height;
        var boundsX = bounds.x;
        var boundsY = bounds.y;
        this.outOfBounds = false;
        if (!this.inverted) {
            location = new TooltipLocation(location.x + clipX - this.elementSize.width / 2 - this.padding, location.y + clipY - this.elementSize.height - (2 * (this.allowHighlight ? this.highlightPadding : this.padding)) -
                this.arrowPadding - markerHeight);
            arrowLocation.x = tipLocation.x = width / 2;
            if ((location.y < boundsY || (this.isNegative)) && !(this.controlName === 'Progressbar')) {
                location.y = (symbolLocation.y < 0 ? 0 : symbolLocation.y) + clipY + markerHeight;
            }
            if (location.y + height + this.arrowPadding > boundsY + bounds.height) {
                location.y = Math.min(symbolLocation.y, boundsY + bounds.height) + clipY
                    - this.elementSize.height - (2 * this.padding) - this.arrowPadding - markerHeight;
            }
            if (((location.x + width > boundsX + bounds.width) && location.y < boundsY || (this.isNegative)) && !(this.controlName === 'Progressbar')) {
                location.y = (symbolLocation.y < 0 ? 0 : symbolLocation.y) + clipY + markerHeight;
            }
            tipLocation.x = width / 2;
            if (location.x < boundsX && !(this.controlName === 'Progressbar')) {
                arrowLocation.x -= (boundsX - location.x);
                tipLocation.x -= (boundsX - location.x);
                location.x = boundsX;
            }
            if (location.x + width > boundsX + bounds.width && !(this.controlName === 'Progressbar')) {
                arrowLocation.x += ((location.x + width) - (boundsX + bounds.width));
                tipLocation.x += ((location.x + width) - (boundsX + bounds.width));
                location.x -= ((location.x + width) - (boundsX + bounds.width));
            }
            if (location.x < boundsX && !(this.controlName === 'Progressbar')) {
                arrowLocation.x -= (boundsX - location.x);
                tipLocation.x -= (boundsX - location.x);
                location.x = boundsX;
            }
            if (arrowLocation.x + this.arrowPadding > width - this.rx) {
                arrowLocation.x = width - this.rx - this.arrowPadding;
                tipLocation.x = width - this.rx - this.arrowPadding;
            }
            if (arrowLocation.x - this.arrowPadding < this.rx) {
                arrowLocation.x = tipLocation.x = this.rx + this.arrowPadding;
            }
            if (this.controlName === 'Chart') {
                if (((bounds.x + bounds.width) - (location.x + arrowLocation.x)) < this.areaMargin + this.arrowPadding ||
                    (location.x + arrowLocation.x) < this.areaMargin + this.arrowPadding) {
                    this.outOfBounds = true;
                }
                if (this.template && (location.y < 0)) {
                    location.y = symbolLocation.y + clipY + markerHeight;
                }
                if (!withInAreaBounds(location.x, location.y, bounds) || this.outOfBounds) {
                    this.inverted = !this.inverted;
                    this.revert = true;
                    location = new TooltipLocation(symbolLocation.x + markerHeight + clipX, symbolLocation.y + clipY - this.elementSize.height / 2 - (this.padding));
                    tipLocation.x = arrowLocation.x = 0;
                    tipLocation.y = arrowLocation.y = height / 2;
                    if ((location.x + this.arrowPadding + width > boundsX + bounds.width) || (this.isNegative)) {
                        location.x = (symbolLocation.x > boundsX + bounds.width ? bounds.width : symbolLocation.x)
                            + clipX - markerHeight - (this.arrowPadding + width);
                    }
                    if (location.x < boundsX) {
                        location.x = (symbolLocation.x < 0 ? 0 : symbolLocation.x) + markerHeight + clipX;
                    }
                    if (location.y <= boundsY) {
                        tipLocation.y -= (boundsY - location.y);
                        arrowLocation.y -= (boundsY - location.y);
                        location.y = boundsY;
                    }
                    if (location.y + height >= bounds.height + boundsY) {
                        arrowLocation.y += ((location.y + height) - (bounds.height + boundsY));
                        tipLocation.y += ((location.y + height) - (bounds.height + boundsY));
                        location.y -= ((location.y + height) - (bounds.height + boundsY));
                    }
                    if ((this.arrowPadding) + arrowLocation.y > height - this.ry) {
                        arrowLocation.y = height - this.arrowPadding - this.ry;
                        tipLocation.y = height;
                    }
                    if (arrowLocation.y - this.arrowPadding < this.ry) {
                        arrowLocation.y = (this.arrowPadding) + this.ry;
                        tipLocation.y = 0;
                    }
                }
            }
        }
        else {
            location = new TooltipLocation(location.x + clipX + markerHeight, location.y + clipY - this.elementSize.height / 2 - (this.padding));
            arrowLocation.y = tipLocation.y = height / 2;
            if ((location.x + width + this.arrowPadding > boundsX + bounds.width) || (this.isNegative)) {
                location.x = (symbolLocation.x > bounds.width + bounds.x ? bounds.width : symbolLocation.x)
                    + clipX - markerHeight - (width + this.arrowPadding);
            }
            if (symbolLocation.x > clipWidth) {
                location.x = clipWidth + clipX - (width + this.arrowPadding);
            }
            if (location.x < boundsX) {
                location.x = (symbolLocation.x < 0 ? 0 : symbolLocation.x) + clipX + markerHeight;
            }
            if ((location.x + width + this.arrowPadding > boundsX + bounds.width)) {
                location.x = (symbolLocation.x > bounds.width + bounds.x ? bounds.width : symbolLocation.x)
                    + clipX - markerHeight - (width + this.arrowPadding);
            }
            if (location.y <= boundsY) {
                arrowLocation.y -= (boundsY - location.y);
                tipLocation.y -= (boundsY - location.y);
                location.y = boundsY;
            }
            if (location.y + height >= boundsY + bounds.height) {
                arrowLocation.y += ((location.y + height) - (boundsY + bounds.height));
                tipLocation.y += ((location.y + height) - (boundsY + bounds.height));
                location.y -= ((location.y + height) - (boundsY + bounds.height));
            }
            if (location.x + width >= boundsX + bounds.width && this.controlName === 'Chart') {
                arrowLocation.x += ((location.x + width) - (boundsX + bounds.width));
                tipLocation.x += ((location.x + width) - (boundsX + bounds.width));
                location.x -= ((location.x + width) - (boundsX + bounds.width));
                location.x = location.x - this.arrowPadding - this.padding;
            }
            if (arrowLocation.y + this.arrowPadding > height - this.ry) {
                arrowLocation.y = height - this.ry - this.arrowPadding;
                tipLocation.y = height;
            }
            if (arrowLocation.y - this.arrowPadding < this.ry) {
                arrowLocation.y = tipLocation.y = this.ry + this.arrowPadding;
            }
            if (this.controlName === 'Chart') {
                if ((location.y + arrowLocation.y) < this.areaMargin + this.arrowPadding ||
                    ((bounds.y + bounds.height) - (location.y + arrowLocation.y)) < this.areaMargin + this.arrowPadding) {
                    this.outOfBounds = true;
                }
                if (!withInAreaBounds(location.x, location.y, bounds) || this.outOfBounds) {
                    this.inverted = !this.inverted;
                    location = new TooltipLocation(symbolLocation.x + clipX - this.padding - this.elementSize.width / 2, symbolLocation.y + clipY - this.elementSize.height - (2 * this.padding) - markerHeight - this.arrowPadding);
                    this.revert = true;
                    tipLocation.x = arrowLocation.x = width / 2;
                    tipLocation.y = arrowLocation.y = 0;
                    if (location.y < boundsY || (this.isNegative)) {
                        location.y = (symbolLocation.y < 0 ? 0 : symbolLocation.y) + markerHeight + clipY;
                    }
                    if (location.y + this.arrowPadding + height > boundsY + bounds.height) {
                        location.y = Math.min(symbolLocation.y, boundsY + bounds.height) + clipY
                            - this.elementSize.height - (2 * this.padding) - markerHeight - this.arrowPadding;
                    }
                    tipLocation.x = width / 2;
                    if (location.x < boundsX) {
                        tipLocation.x -= (boundsX - location.x);
                        arrowLocation.x -= (boundsX - location.x);
                        location.x = boundsX;
                    }
                    if (location.x + width > bounds.width + boundsX) {
                        arrowLocation.x += ((location.x + width) - (bounds.width + boundsX));
                        tipLocation.x += ((location.x + width) - (bounds.width + boundsX));
                        location.x -= ((location.x + width) - (bounds.width + boundsX));
                    }
                    if ((this.arrowPadding) + arrowLocation.x > width - this.rx) {
                        tipLocation.x = width - this.rx - (this.arrowPadding);
                        arrowLocation.x = width - this.rx - (this.arrowPadding);
                    }
                    if (arrowLocation.x - (this.arrowPadding) < this.rx) {
                        arrowLocation.x = tipLocation.x = this.rx + (this.arrowPadding);
                    }
                }
            }
            if (this.enableRTL && this.controlName === 'Sankey') {
                var relativeX = location.x - boundsX;
                var mirroredRelativeX = bounds.width - relativeX - (this.elementSize.width + (2 * this.marginX));
                location.x = boundsX + mirroredRelativeX;
            }
        }
        return new Rect(location.x, location.y, width, height);
    };
    Tooltip.prototype.animateTooltipDiv = function (tooltipDiv, rect) {
        var _this = this;
        var x = parseFloat(tooltipDiv.style.left);
        var y = parseFloat(tooltipDiv.style.top);
        var duration = (this.duration === 0 && animationMode === 'Enable') ? 300 : this.duration;
        if ((this.controlName === 'Chart' && (this.shared || this.split)) && !this.enableRTL) {
            var transformValues = (this.split ? tooltipDiv : this.element).style.transform.split(/[(),\s]+/);
            x = parseFloat(transformValues[1]);
            y = parseFloat(transformValues[2]);
            tooltipDiv.style.transition = 'transform ' + duration + 'ms ease';
        }
        else if (this.controlName === 'Sankey' && this.enableRTL) {
            var width = this.elementSize.width + (2 * this.marginX);
            var containerWidth = (this.availableSize && this.availableSize.width) ?
                this.availableSize.width : (this.areaBounds.x + this.areaBounds.width);
            var targetRight = containerWidth - (rect.x + width);
            // Ensure positioning is anchored only by 'right' in RTL
            tooltipDiv.style.left = '';
            tooltipDiv.style.transform = '';
            tooltipDiv.style.transition = "right " + duration + "ms ease, top " + duration + "ms ease";
            tooltipDiv.style.right = targetRight + "px";
            tooltipDiv.style.top = rect.y + "px";
            new Animation({}).animate(tooltipDiv, {
                duration: duration,
                progress: function () { },
                end: function () {
                    _this.updateDiv(tooltipDiv, rect.x, rect.y);
                    _this.trigger('animationComplete', { tooltip: _this });
                }
            });
            return;
        }
        var currenDiff;
        new Animation({}).animate(tooltipDiv, {
            duration: duration,
            progress: function (args) {
                currenDiff = (args.timeStamp / args.duration);
                tooltipDiv.style.animation = null;
                if ((_this.controlName === 'Chart' && (_this.shared || _this.split)) && !_this.enableRTL) {
                    tooltipDiv.style.transform = 'translate(' + (x + (rect.x - x)) + 'px,' + (y + rect.y - y) + 'px)';
                    tooltipDiv.style.left = '';
                    tooltipDiv.style.top = '';
                }
                else if (_this.controlName === 'Chart' && _this.showNearestTooltip) {
                    tooltipDiv.style.transition = 'left ' + args.duration + 'ms ease-out, top ' + args.duration + 'ms ease-out';
                    tooltipDiv.style.left = rect.x + 'px';
                    tooltipDiv.style.top = rect.y + 'px';
                }
                else {
                    tooltipDiv.style.left = (x + currenDiff * (rect.x - x)) + 'px';
                    tooltipDiv.style.top = (y + currenDiff * (rect.y - y)) + 'px';
                    tooltipDiv.style.transform = _this.controlName === 'RangeNavigator' ? tooltipDiv.style.transform : '';
                }
            },
            end: function (model) {
                _this.updateDiv(tooltipDiv, rect.x, rect.y);
                _this.trigger('animationComplete', { tooltip: _this });
            }
        });
    };
    Tooltip.prototype.updateDiv = function (tooltipDiv, x, y) {
        if ((this.controlName === 'Chart' && ((this.shared && !this.crosshair) || this.split)) && (!this.enableRTL || this.split)) {
            tooltipDiv.style.transform = 'translate(' + x + 'px,' + y + 'px)';
            tooltipDiv.style.left = '';
            tooltipDiv.style.top = '';
            tooltipDiv.style.right = '';
        }
        else if (this.controlName === 'Sankey' && this.enableRTL) {
            var width = this.elementSize.width + (2 * this.marginX);
            var containerWidth = (this.availableSize && this.availableSize.width) ?
                this.availableSize.width : (this.areaBounds.x + this.areaBounds.width);
            var right = containerWidth - (x + width);
            tooltipDiv.style.right = right + 'px';
            tooltipDiv.style.left = '';
            tooltipDiv.style.top = y + 'px';
            tooltipDiv.style.transform = '';
        }
        else {
            tooltipDiv.style.left = x + 'px';
            tooltipDiv.style.top = y + 'px';
            tooltipDiv.style.transform = this.controlName === 'RangeNavigator' ? tooltipDiv.style.transform : '';
            tooltipDiv.style.right = '';
        }
    };
    Tooltip.prototype.updateTemplateFn = function () {
        if (this.template) {
            try {
                if (typeof this.template !== 'function' && document.querySelectorAll(this.template).length) {
                    this.templateFn = templateComplier(document.querySelector(this.template).innerHTML.trim());
                }
                else {
                    this.templateFn = templateComplier(this.template);
                }
            }
            catch (e) {
                this.templateFn = templateComplier(this.template);
            }
        }
    };
    /** @private */
    Tooltip.prototype.fadeOut = function () {
        var _this = this;
        var tooltipElement = (this.isCanvas && !this.template) ? getElement(this.element.id + '_svg') :
            getElement(this.element.id);
        var tooltipDiv = getElement(this.element.id);
        if (tooltipElement) {
            var tooltipGroup_1 = this.split ? tooltipElement : tooltipElement.firstChild;
            if (tooltipGroup_1 && tooltipGroup_1.nodeType !== Node.ELEMENT_NODE) {
                tooltipGroup_1 = tooltipElement.firstElementChild;
            }
            if (this.isCanvas && !this.template) {
                tooltipGroup_1 = document.getElementById(this.element.id + '_group') ? document.getElementById(this.element.id + '_group') :
                    tooltipGroup_1;
            }
            if (!tooltipGroup_1) {
                return null;
            }
            var opacity_1 = parseFloat(tooltipGroup_1.getAttribute('opacity'));
            opacity_1 = !isNullOrUndefined(opacity_1) ? opacity_1 : 1;
            new Animation({}).animate(tooltipGroup_1, {
                duration: 200,
                progress: function (args) {
                    //  tooltipGroup.removeAttribute('e-animate');
                    _this.progressAnimation(tooltipGroup_1, opacity_1, (args.timeStamp / args.duration));
                },
                end: function () {
                    _this.fadeOuted = true;
                    _this.endAnimation(tooltipGroup_1);
                    tooltipDiv.style.transition = '';
                }
            });
        }
    };
    Tooltip.prototype.progressAnimation = function (tooltipGroup, opacity, timeStamp) {
        tooltipGroup.style.animation = '';
        tooltipGroup.setAttribute('opacity', (opacity - timeStamp).toString());
    };
    /*
     * @hidden
     */
    Tooltip.prototype.endAnimation = function (tooltipGroup) {
        tooltipGroup.setAttribute('opacity', '0');
        if (this.template) {
            tooltipGroup.style.display = 'none';
        }
        this.trigger('animationComplete', { tooltip: this });
    };
    /**
     * Get the properties to be maintained in the persisted state.
     *
     * @private
     */
    Tooltip.prototype.getPersistData = function () {
        var keyEntity = [];
        return this.addOnPersist(keyEntity);
    };
    /**
     * Get component name
     *
     *  @private
     */
    Tooltip.prototype.getModuleName = function () {
        return 'tooltip';
    };
    /**
     * To destroy the accumulationcharts
     *
     * @private
     */
    Tooltip.prototype.destroy = function () {
        _super.prototype.destroy.call(this);
        this.element.classList.remove('e-tooltip');
    };
    /**
     * Called internally if any of the property value changed.
     *
     * @returns {void}
     * @private
     */
    Tooltip.prototype.onPropertyChanged = function (newProp, oldProp) {
        if (this.blazorTemplate) {
            resetBlazorTemplate(this.element.id + 'parent_template' + '_blazorTemplate');
        }
        this.isFirst = false;
        this.render();
    };
    __decorate([
        Property(false)
    ], Tooltip.prototype, "enable", void 0);
    __decorate([
        Property(false)
    ], Tooltip.prototype, "shared", void 0);
    __decorate([
        Property(false)
    ], Tooltip.prototype, "split", void 0);
    __decorate([
        Property(false)
    ], Tooltip.prototype, "followPointer", void 0);
    __decorate([
        Property(false)
    ], Tooltip.prototype, "crosshair", void 0);
    __decorate([
        Property(false)
    ], Tooltip.prototype, "enableShadow", void 0);
    __decorate([
        Property(null)
    ], Tooltip.prototype, "fill", void 0);
    __decorate([
        Property('')
    ], Tooltip.prototype, "header", void 0);
    __decorate([
        Property(0.75)
    ], Tooltip.prototype, "opacity", void 0);
    __decorate([
        Complex({ size: '12px', fontWeight: null, color: null, fontStyle: 'Normal', fontFamily: null }, TextStyle)
    ], Tooltip.prototype, "textStyle", void 0);
    __decorate([
        Property(null)
    ], Tooltip.prototype, "template", void 0);
    __decorate([
        Property(true)
    ], Tooltip.prototype, "enableAnimation", void 0);
    __decorate([
        Property(300)
    ], Tooltip.prototype, "duration", void 0);
    __decorate([
        Property(false)
    ], Tooltip.prototype, "inverted", void 0);
    __decorate([
        Property(false)
    ], Tooltip.prototype, "isNegative", void 0);
    __decorate([
        Complex({ color: null, width: null }, TooltipBorder)
    ], Tooltip.prototype, "border", void 0);
    __decorate([
        Property([])
    ], Tooltip.prototype, "content", void 0);
    __decorate([
        Property(10)
    ], Tooltip.prototype, "markerSize", void 0);
    __decorate([
        Complex({ x: 0, y: 0 }, ToolLocation)
    ], Tooltip.prototype, "clipBounds", void 0);
    __decorate([
        Property([])
    ], Tooltip.prototype, "splitClipBounds", void 0);
    __decorate([
        Property([])
    ], Tooltip.prototype, "palette", void 0);
    __decorate([
        Property([])
    ], Tooltip.prototype, "shapes", void 0);
    __decorate([
        Property('')
    ], Tooltip.prototype, "markerImage", void 0);
    __decorate([
        Complex({ x: 0, y: 0 }, ToolLocation)
    ], Tooltip.prototype, "location", void 0);
    __decorate([
        Complex({ x: 0, y: 0 }, ToolLocation)
    ], Tooltip.prototype, "splitLocations", void 0);
    __decorate([
        Property([])
    ], Tooltip.prototype, "seriesTypes", void 0);
    __decorate([
        Property(0)
    ], Tooltip.prototype, "offset", void 0);
    __decorate([
        Property(4)
    ], Tooltip.prototype, "rx", void 0);
    __decorate([
        Property(4)
    ], Tooltip.prototype, "ry", void 0);
    __decorate([
        Property(5)
    ], Tooltip.prototype, "marginX", void 0);
    __decorate([
        Property(5)
    ], Tooltip.prototype, "marginY", void 0);
    __decorate([
        Property(7)
    ], Tooltip.prototype, "arrowPadding", void 0);
    __decorate([
        Property(null)
    ], Tooltip.prototype, "data", void 0);
    __decorate([
        Property('Material')
    ], Tooltip.prototype, "theme", void 0);
    __decorate([
        Complex({ x: 0, y: 0, width: 0, height: 0 }, AreaBounds)
    ], Tooltip.prototype, "areaBounds", void 0);
    __decorate([
        Property(null)
    ], Tooltip.prototype, "availableSize", void 0);
    __decorate([
        Property()
    ], Tooltip.prototype, "blazorTemplate", void 0);
    __decorate([
        Property(false)
    ], Tooltip.prototype, "isCanvas", void 0);
    __decorate([
        Property(false)
    ], Tooltip.prototype, "isTextWrap", void 0);
    __decorate([
        Property(false)
    ], Tooltip.prototype, "isFixed", void 0);
    __decorate([
        Property(null)
    ], Tooltip.prototype, "tooltipPlacement", void 0);
    __decorate([
        Property(null)
    ], Tooltip.prototype, "controlInstance", void 0);
    __decorate([
        Property('')
    ], Tooltip.prototype, "controlName", void 0);
    __decorate([
        Property(false)
    ], Tooltip.prototype, "showNearestTooltip", void 0);
    __decorate([
        Event()
    ], Tooltip.prototype, "tooltipRender", void 0);
    __decorate([
        Event()
    ], Tooltip.prototype, "loaded", void 0);
    __decorate([
        Event()
    ], Tooltip.prototype, "animationComplete", void 0);
    __decorate([
        Property(false)
    ], Tooltip.prototype, "enableRTL", void 0);
    __decorate([
        Property(false)
    ], Tooltip.prototype, "allowHighlight", void 0);
    __decorate([
        Property(true)
    ], Tooltip.prototype, "showHeaderLine", void 0);
    Tooltip = __decorate([
        NotifyPropertyChanges
    ], Tooltip);
    return Tooltip;
}(Component));
export { Tooltip };

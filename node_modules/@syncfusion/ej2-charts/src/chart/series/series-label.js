import { measureText, Rect, TextOption } from '@syncfusion/ej2-svg-base';
import { extend, getValue } from '@syncfusion/ej2-base';
import { getVisiblePoints, ChartLocation, convertHexToColor, colorNameToHex, textElement, isCollide, RectOption, appendChildElement } from '../../common/utils/helper';
/**
 * The 'SeriesLabel' module is used to render the series name near the series.
 */
var SeriesLabel = /** @class */ (function () {
    /**
     * Constructor for the series label module.
     *
     * @param {Chart} chart - The parent chart.
     */
    function SeriesLabel(chart) {
        this.chart = chart;
    }
    /**
     * Render the series label for series.
     *
     * @param {Series} series - The series to render.
     * @param {Chart} chart - The parent chart.
     * @param {SeriesLabelSettingsModel} seriesLabel - The settings for series labels.
     * @returns {void}
     * @private
     */
    SeriesLabel.prototype.render = function (series, chart, seriesLabel) {
        if (!series.visible || !seriesLabel.visible) {
            return;
        }
        var group = chart.seriesLabelElements;
        var visiblePoints = this.getZoomVisiblePoints(series);
        if (visiblePoints.length < 1) {
            return;
        }
        this.renderSeriesLabel(series, visiblePoints, group, seriesLabel);
    };
    /**
     * Render series label per series in proper anchor position.
     *
     * @param {Series} series - The current series object.
     * @param {Points[]} visiblePoints - the array of visible points in the series.
     * @param {HTMLElement} element - element that contains the series label elements
     * @param {SeriesLabelSettingsModel} seriesLabel - series label setting model.
     * @returns {Element[]} - Returns the created series label elements (empty if not placed).
     * @private
     */
    SeriesLabel.prototype.renderSeriesLabel = function (series, visiblePoints, element, seriesLabel) {
        var labelElements = [];
        var labelText = series.labelSettings.text ? series.labelSettings.text : series.name;
        var font = extend({}, getValue('properties', seriesLabel.font), null, true);
        var textSize = measureText(labelText, font, this.chart.themeStyle.seriesLabelFont);
        var seriesRect = [];
        var clip = series.clipRect;
        var offset = 5;
        var errorBarRects = this.buildErrorBarRects(series);
        var blockers = this.chart.seriesLabelCollections.concat(this.chart.dataLabelCollections, this.chart.axisLabelCollections, this.chart.markerCollections, errorBarRects);
        var allowOverlap = seriesLabel.showOverlapText;
        var validPoints = visiblePoints.filter(function (point) {
            return !!(point && point.symbolLocations && point.symbolLocations[0]);
        });
        var finalOpacity = series.labelSettings.opacity ? series.labelSettings.opacity : series.labelSettings.font.opacity;
        var animationDelay = series.animation.enable ? (series.animation.duration + series.animation.delay) : 0;
        var isInitialRender = !this.chart.redraw && series.animation.enable;
        // Early return if no valid points
        if (validPoints.length === 0 || !clip) {
            return labelElements;
        }
        // Get the last valid point (or first if only one)
        var lastPoint = validPoints[validPoints.length - 1];
        var lastSymbolLocation = lastPoint.symbolLocations[0];
        // Find peak point (point with minimum Y value)
        var peakPoint = validPoints.reduce(function (prev, curr) {
            var prevY = prev.symbolLocations[0].y;
            var currY = curr.symbolLocations[0].y;
            return currY < prevY ? curr : prev;
        }, validPoints[0]);
        var anchorCandidates = [
            this.addClipRectToPosition(lastSymbolLocation, clip),
            this.addClipRectToPosition(peakPoint.symbolLocations[0], clip)
        ];
        var padding = 4;
        var background = seriesLabel.background;
        var border = seriesLabel.border;
        var useShape = (background && background !== 'transparent') || (border && border.width && border.width > 0);
        var effectiveWidth = textSize.width + (useShape ? padding * 2 : 0);
        for (var j = 0; j < this.chart.visibleSeries.length; j++) {
            var currentSeries = this.chart.visibleSeries[j];
            var seriesPoints = currentSeries.points;
            if (!currentSeries || !currentSeries.visible || !seriesPoints || !Array.isArray(seriesPoints)) {
                continue;
            }
            var lineWidth = currentSeries.border.width || 2;
            for (var pointIndex = seriesPoints.length - 1; pointIndex > 0; pointIndex--) {
                var currPoint = seriesPoints[pointIndex];
                var prevPoint = seriesPoints[pointIndex - 1];
                if (currPoint && prevPoint &&
                    currPoint.symbolLocations && prevPoint.symbolLocations &&
                    currPoint.symbolLocations[0] && prevPoint.symbolLocations[0]) {
                    var currentPosition = this.addClipRectToPosition(currPoint.symbolLocations[0], currentSeries.clipRect);
                    var previousPosition = this.addClipRectToPosition(prevPoint.symbolLocations[0], currentSeries.clipRect);
                    var segmentRect = this.createRectFromPoints(currentPosition, previousPosition);
                    var halfWidth = lineWidth / 2;
                    segmentRect.y -= halfWidth;
                    segmentRect.height += lineWidth;
                    seriesRect.push(segmentRect);
                    if (Math.abs(currentPosition.x - previousPosition.x) < effectiveWidth) {
                        if (pointIndex - 2 >= 0 && seriesPoints[pointIndex - 2] &&
                            seriesPoints[pointIndex - 2].symbolLocations &&
                            seriesPoints[pointIndex - 2].symbolLocations[0]) {
                            var adjRect = this.createRectFromPoints(previousPosition, this.addClipRectToPosition(seriesPoints[pointIndex - 2].symbolLocations[0], clip));
                            adjRect.y -= halfWidth;
                            adjRect.height += lineWidth;
                            seriesRect.push(adjRect);
                        }
                        if (pointIndex + 1 < seriesPoints.length && seriesPoints[pointIndex + 1] &&
                            seriesPoints[pointIndex + 1].symbolLocations && seriesPoints[pointIndex + 1].symbolLocations[0]) {
                            var adjRect = this.createRectFromPoints(currentPosition, this.addClipRectToPosition(seriesPoints[pointIndex + 1].symbolLocations[0], clip));
                            adjRect.y -= halfWidth;
                            adjRect.height += lineWidth;
                            seriesRect.push(adjRect);
                        }
                    }
                }
            }
        }
        if (validPoints.length > 1) {
            for (var i = validPoints.length - 1; i > 0; i--) {
                var currentPoint = validPoints[i];
                var previousPoint = validPoints[i - 1];
                if (currentPoint && previousPoint &&
                    currentPoint.symbolLocations && previousPoint.symbolLocations &&
                    currentPoint.symbolLocations[0] && previousPoint.symbolLocations[0]) {
                    var currentSegmentPoint = this.addClipRectToPosition(currentPoint.symbolLocations[0], clip);
                    var previousSegmentPoint = this.addClipRectToPosition(previousPoint.symbolLocations[0], clip);
                    if (currentSegmentPoint && previousSegmentPoint) {
                        anchorCandidates.push({
                            x: (currentSegmentPoint.x + previousSegmentPoint.x) / 2,
                            y: (currentSegmentPoint.y + previousSegmentPoint.y) / 2
                        });
                    }
                }
            }
        }
        var lastTriedInClipPosition = null;
        for (var _i = 0, anchorCandidates_1 = anchorCandidates; _i < anchorCandidates_1.length; _i++) {
            var anchor = anchorCandidates_1[_i];
            var isFilled = this.isFilledSeries(series);
            var candidatePositions = isFilled
                ? [{ x: anchor.x - textSize.width / 2, y: anchor.y + offset + 5 }]
                : [
                    { x: anchor.x - textSize.width / 2, y: anchor.y - offset - textSize.height },
                    { x: anchor.x - textSize.width / 2, y: anchor.y + offset + 5 }
                ];
            for (var _a = 0, candidatePositions_1 = candidatePositions; _a < candidatePositions_1.length; _a++) {
                var position = candidatePositions_1[_a];
                if (!this.withinClip(position, textSize, clip)) {
                    continue;
                }
                lastTriedInClipPosition = { x: position.x, y: position.y };
                var rectToPush = new Rect(position.x, position.y, textSize.width, textSize.height);
                if (useShape) {
                    rectToPush = new Rect(position.x - padding, position.y - padding, textSize.width + padding * 2, textSize.height + padding * 2);
                }
                var emptyRect = { x: 0, y: 0, width: 0, height: 0 };
                if (!isCollide(rectToPush, blockers, emptyRect) && !isCollide(rectToPush, seriesRect, emptyRect)) {
                    this.chart.seriesLabelCollections.push(rectToPush);
                    blockers.push(rectToPush);
                    var color = this.getLabelColor(series, font);
                    var labelId = this.chart.element.id + '_Point_' + (series.index) + '_Text_' + (series.index);
                    // draw background shape if required
                    var shapeElement = null;
                    if (useShape) {
                        var shapeId = labelId + '_Shape';
                        var rectOption = new RectOption(shapeId, background, border, seriesLabel.opacity, rectToPush, 0, 0, '');
                        shapeElement = this.chart.renderer.drawRectangle(rectOption, new Int32Array([clip.x, clip.y]));
                        appendChildElement(this.chart.enableCanvas, element, shapeElement, this.chart.redraw, true, 'x', 'y', null, '', false, false, null, series.animation.duration);
                        if (shapeElement) {
                            if (isInitialRender) {
                                shapeElement.setAttribute('opacity', '0');
                                this.animateElementOpacity(shapeElement, 200, finalOpacity, animationDelay);
                            }
                            else {
                                // On redraw (touch/click): set final opacity immediately, no animation
                                shapeElement.setAttribute('opacity', finalOpacity.toString());
                            }
                        }
                    }
                    var labelElement = textElement(this.chart.renderer, new TextOption(labelId, position.x + textSize.width / 2, position.y + textSize.height / 1.5, 'middle', labelText), font, color, element, false, this.chart.redraw, true, false, series.animation.duration, clip, null, null, this.chart.enableCanvas, null, this.chart.themeStyle.seriesLabelFont, new ChartLocation(position.x, position.y));
                    if (labelElement) {
                        if (isInitialRender) {
                            labelElement.setAttribute('opacity', '0');
                            this.animateElementOpacity(labelElement, 200, finalOpacity, animationDelay);
                        }
                        else {
                            // On redraw (touch/click): set final opacity immediately, no animation
                            labelElement.setAttribute('opacity', finalOpacity.toString());
                        }
                        labelElements.push(labelElement);
                    }
                    return labelElements;
                }
            }
        }
        if (allowOverlap && lastTriedInClipPosition) {
            var position = lastTriedInClipPosition;
            var color = this.getLabelColor(series, font);
            var labelId = this.chart.element.id + '_Point_' + (series.index) + '_Text_' + (series.index);
            var rectToPush = new Rect(position.x, position.y, textSize.width, textSize.height);
            if (useShape) {
                rectToPush = new Rect(position.x - padding, position.y - padding, textSize.width + padding * 2, textSize.height + padding * 2);
            }
            this.chart.seriesLabelCollections.push(rectToPush);
            blockers.push(rectToPush);
            if (useShape) {
                var shapeId = labelId + '_Shape';
                var rectOption = new RectOption(shapeId, background, border, seriesLabel.opacity, rectToPush, 0, 0, '');
                var shapeElement = this.chart.renderer.drawRectangle(rectOption, new Int32Array([clip.x, clip.y]));
                appendChildElement(this.chart.enableCanvas, element, shapeElement, this.chart.redraw, true, 'x', 'y', null, '', false, false, null, series.animation.duration);
                if (shapeElement) {
                    if (isInitialRender) {
                        shapeElement.setAttribute('opacity', '0');
                        this.animateElementOpacity(shapeElement, 200, finalOpacity, animationDelay);
                    }
                    else {
                        shapeElement.setAttribute('opacity', finalOpacity.toString());
                    }
                }
            }
            var labelElement = textElement(this.chart.renderer, new TextOption(labelId, position.x + textSize.width / 2, position.y + textSize.height / 1.5, 'middle', labelText), font, color, element, false, this.chart.redraw, true, false, series.animation.duration, clip, null, null, this.chart.enableCanvas, null, this.chart.themeStyle.seriesLabelFont, new ChartLocation(position.x, position.y));
            if (labelElement) {
                if (isInitialRender) {
                    labelElement.setAttribute('opacity', '0');
                    this.animateElementOpacity(labelElement, 200, finalOpacity, animationDelay);
                }
                else {
                    labelElement.setAttribute('opacity', finalOpacity.toString());
                }
                labelElements.push(labelElement);
            }
        }
        return labelElements;
    };
    /**
     * Create rect by using two points as diagonal from the top-left and bottom-right points.
     *
     * @param {ChartLocation} startPoint - the first point's position on the chart
     * @param {ChartLocation} endPoint - the second point's position on the chart.
     * @returns {Rect} - a rect created with 2 points.
     */
    SeriesLabel.prototype.createRectFromPoints = function (startPoint, endPoint) {
        var x = Math.min(startPoint.x, endPoint.x);
        var y = Math.min(startPoint.y, endPoint.y);
        var width = Math.abs(endPoint.x - startPoint.x);
        var height = Math.abs(endPoint.y - startPoint.y);
        return new Rect(x, y, width, height);
    };
    /**
     * Adding clip rect to the positions of each data points before placing labels.
     *
     * @param {ChartLocation} position - Location of the point in the chart.
     * @param {Rect} clipRect - created imaginary rect per point.
     * @returns {ChartLocation} Suitable rect position for anchors.
     */
    SeriesLabel.prototype.addClipRectToPosition = function (position, clipRect) {
        if (!position || typeof position.x !== 'number' || typeof position.y !== 'number' ||
            !clipRect || typeof clipRect.x !== 'number' || typeof clipRect.y !== 'number') {
            return { x: 0, y: 0 };
        }
        return {
            x: position.x + clipRect.x,
            y: position.y + clipRect.y
        };
    };
    /**
     * Check the point is within the clip rectangle.
     *
     * @param {ChartLocation} pos - position of data points in chart.
     * @param {Size} size - size of label text.
     * @param {Rect} clip - created imaginary Rect for data points.
     * @returns {boolean} true if within the rect, else false.
     */
    SeriesLabel.prototype.withinClip = function (pos, size, clip) {
        return (pos.x >= clip.x && pos.y >= clip.y && pos.x + size.width <= clip.x + clip.width &&
            pos.y + size.height <= clip.y + clip.height);
    };
    /**
     * Render the series labels with animation.
     *
     * @param {HTMLElement} element - current label element per series.
     * @param {number} duration - animation duration.
     * @param {number} finalOpacity - opacity set by user.
     * @param {number} delay - animation delay.
     * @returns {void}
     * @private
     */
    SeriesLabel.prototype.animateElementOpacity = function (element, duration, finalOpacity, delay) {
        // Animate ONLY during initial series animation, not during redraw interactions.
        var isInitialSeriesAnimation = !this.chart.redraw && (this.chart).animateSeries;
        if (!isInitialSeriesAnimation || duration <= 0) {
            element.setAttribute('opacity', finalOpacity.toString());
            return;
        }
        element.setAttribute('opacity', '0');
        var startAnimation = function () {
            var startTime = null;
            var animate = function (time) {
                if (startTime === null) {
                    startTime = time;
                }
                var progress = Math.min((time - startTime) / duration, 1);
                element.setAttribute('opacity', (progress * finalOpacity).toString());
                if (progress < 1) {
                    requestAnimationFrame(animate);
                }
                else {
                    element.setAttribute('opacity', finalOpacity.toString());
                }
            };
            requestAnimationFrame(animate);
        };
        if (delay && delay > 0) {
            setTimeout(startAnimation, delay);
        }
        else {
            startAnimation();
        }
    };
    /**
     * Determine the color for each label based on the background & theme.
     *
     * @param {Series} series - current series.
     * @param {FontModel} font - font properties.
     * @returns {string} - the color of label.
     */
    SeriesLabel.prototype.getLabelColor = function (series, font) {
        if (this.isFilledSeries(series)) {
            var baseColor = series.interior;
            var rgb = convertHexToColor(colorNameToHex(baseColor));
            var brightness = Math.round((rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000);
            var contrastColor = brightness >= 128 ? 'black' : 'white';
            return font.color || contrastColor;
        }
        return font.color || series.border.color || series.interior;
    };
    /**
     * Check whether the current series is a filled-type series.
     *
     * @param {Series} series - current series.
     * @returns {boolean} true if filled-type, else false.
     */
    SeriesLabel.prototype.isFilledSeries = function (series) {
        return (series.type === 'Area' || series.type === 'StackingArea' || series.type === 'RangeArea' ||
            series.type === 'StepArea' || series.type === 'SplineArea' || series.type === 'RangeStepArea');
    };
    /**
     * Calculate the dimensions for error bars if present.
     *
     * @param {Series} series - current series.
     * @returns {Rect[]} a rect for error bars.
     */
    SeriesLabel.prototype.buildErrorBarRects = function (series) {
        var rects = [];
        if (!series || !series.errorBar || !series.errorBar.visible) {
            return rects;
        }
        if (!series.chart || !series.chart.errorBarModule) {
            return rects;
        }
        var positiveHeight = series.chart.errorBarModule.positiveHeight || 0;
        var negativeHeight = series.chart.errorBarModule.negativeHeight || 0;
        // Decide which spans to include based on direction
        var direction = series.errorBar.direction;
        var includePlus = (direction === 'Plus' || direction === 'Both');
        var includeMinus = (direction === 'Minus' || direction === 'Both');
        // Cap width (fallback to a small width if not set)
        var capWidth = Math.max(6, series.errorBar.errorBarCap.width);
        for (var _i = 0, _a = series.points; _i < _a.length; _i++) {
            var points = _a[_i];
            if (!points || !points.visible || !points.symbolLocations || !points.symbolLocations[0]) {
                continue;
            }
            var symbolLocation = points.symbolLocations[0];
            // Base point in chart coords
            var cx = symbolLocation.x + series.clipRect.x;
            var cy = symbolLocation.y + series.clipRect.y;
            // Vertical span for blockers:
            var up = includePlus ? positiveHeight : 0;
            var down = includeMinus ? Math.abs(negativeHeight) : 0;
            if (up === 0 && down === 0) {
                continue;
            }
            var top_1 = cy - up;
            var bottom = cy + down;
            rects.push(new Rect(cx - capWidth / 2, Math.min(top_1, bottom), capWidth, Math.abs(bottom - top_1)));
        }
        return rects;
    };
    /**
     * Get visible points based on current axis zoom state.
     *
     * @param {Series} series - The series to filter.
     * @returns {Points[]} - Array of points within the visible axis range.
     * @private
     */
    SeriesLabel.prototype.getZoomVisiblePoints = function (series) {
        var allVisiblePoints = getVisiblePoints(series);
        if (!series.xAxis || !series.yAxis) {
            return allVisiblePoints;
        }
        var xAxis = series.xAxis;
        var yAxis = series.yAxis;
        // Check if chart is zoomed
        var isZoomed = (xAxis.zoomFactor !== 1 || xAxis.zoomPosition !== 0 ||
            yAxis.zoomFactor !== 1 || yAxis.zoomPosition !== 0);
        if (!isZoomed) {
            return allVisiblePoints;
        }
        // Get visible ranges
        var xRange = xAxis.visibleRange;
        var yRange = yAxis.visibleRange;
        // Filter points within visible range
        return allVisiblePoints.filter(function (point) {
            if (!point || point.x === null || point.y === null) {
                return false;
            }
            var xValue = typeof point.x === 'number' ? point.x :
                point.x instanceof Date ? point.x.getTime() :
                    parseFloat(point.x);
            if (xValue < xRange.min || xValue > xRange.max) {
                return false;
            }
            var yValue = typeof point.y === 'number' ? point.y : parseFloat(point.y);
            if (yValue < yRange.min || yValue > yRange.max) {
                return false;
            }
            return true;
        });
    };
    /**
     * Clear existing series labels from the chart.
     *
     * @returns {void}
     * @private
     */
    SeriesLabel.prototype.clearLabels = function () {
        if (this.chart.seriesLabelElements) {
            while (this.chart.seriesLabelElements.firstChild) {
                this.chart.seriesLabelElements.removeChild(this.chart.seriesLabelElements.firstChild);
            }
        }
        // Clear the collision collection
        this.chart.seriesLabelCollections = [];
    };
    /**
     * Get module name.
     *
     * @returns {string} - Returns the module name.
     */
    SeriesLabel.prototype.getModuleName = function () {
        // Returns the module name
        return 'SeriesLabel';
    };
    /**
     * To destroy the series label module.
     *
     * @returns {void}
     * @private
     */
    SeriesLabel.prototype.destroy = function () {
        // Destroy method performed here
    };
    return SeriesLabel;
}());
export { SeriesLabel };

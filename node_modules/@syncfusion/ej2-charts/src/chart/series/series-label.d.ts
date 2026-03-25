import { Chart } from '../chart';
import { Points, Series } from './chart-series';
import { SeriesLabelSettingsModel } from './chart-series-model';
/**
 * The 'SeriesLabel' module is used to render the series name near the series.
 */
export declare class SeriesLabel {
    private chart;
    /**
     * Constructor for the series label module.
     *
     * @param {Chart} chart - The parent chart.
     */
    constructor(chart: Chart);
    /**
     * Render the series label for series.
     *
     * @param {Series} series - The series to render.
     * @param {Chart} chart - The parent chart.
     * @param {SeriesLabelSettingsModel} seriesLabel - The settings for series labels.
     * @returns {void}
     * @private
     */
    render(series: Series, chart: Chart, seriesLabel: SeriesLabelSettingsModel): void;
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
    renderSeriesLabel(series: Series, visiblePoints: Points[], element: HTMLElement, seriesLabel: SeriesLabelSettingsModel): Element[];
    /**
     * Create rect by using two points as diagonal from the top-left and bottom-right points.
     *
     * @param {ChartLocation} startPoint - the first point's position on the chart
     * @param {ChartLocation} endPoint - the second point's position on the chart.
     * @returns {Rect} - a rect created with 2 points.
     */
    private createRectFromPoints;
    /**
     * Adding clip rect to the positions of each data points before placing labels.
     *
     * @param {ChartLocation} position - Location of the point in the chart.
     * @param {Rect} clipRect - created imaginary rect per point.
     * @returns {ChartLocation} Suitable rect position for anchors.
     */
    private addClipRectToPosition;
    /**
     * Check the point is within the clip rectangle.
     *
     * @param {ChartLocation} pos - position of data points in chart.
     * @param {Size} size - size of label text.
     * @param {Rect} clip - created imaginary Rect for data points.
     * @returns {boolean} true if within the rect, else false.
     */
    private withinClip;
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
    animateElementOpacity(element: HTMLElement, duration: number, finalOpacity: number, delay?: number): void;
    /**
     * Determine the color for each label based on the background & theme.
     *
     * @param {Series} series - current series.
     * @param {FontModel} font - font properties.
     * @returns {string} - the color of label.
     */
    private getLabelColor;
    /**
     * Check whether the current series is a filled-type series.
     *
     * @param {Series} series - current series.
     * @returns {boolean} true if filled-type, else false.
     */
    private isFilledSeries;
    /**
     * Calculate the dimensions for error bars if present.
     *
     * @param {Series} series - current series.
     * @returns {Rect[]} a rect for error bars.
     */
    private buildErrorBarRects;
    /**
     * Get visible points based on current axis zoom state.
     *
     * @param {Series} series - The series to filter.
     * @returns {Points[]} - Array of points within the visible axis range.
     * @private
     */
    private getZoomVisiblePoints;
    /**
     * Clear existing series labels from the chart.
     *
     * @returns {void}
     * @private
     */
    clearLabels(): void;
    /**
     * Get module name.
     *
     * @returns {string} - Returns the module name.
     */
    protected getModuleName(): string;
    /**
     * To destroy the series label module.
     *
     * @returns {void}
     * @private
     */
    destroy(): void;
}

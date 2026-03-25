import { Chart } from '../chart';
import { PointData } from '../../common/utils/helper';
import { BaseTooltip } from '../../common/user-interaction/tooltip';
/**
 * The `Tooltip` module is used to render tooltips for chart series.
 */
export declare class Tooltip extends BaseTooltip {
    /**
     * Constructor for the Touch module.
     *
     * @param {Chart} chart - The chart instance.
     */
    constructor(chart: Chart);
    /**
     * Adds event listeners for the chart.
     *
     * @returns {void}
     */
    private addEventListener;
    private mouseUpHandler;
    private mouseLeaveHandler;
    mouseMoveHandler(): void;
    /**
     * Handles the long press on chart.
     *
     * @returns {boolean} false
     * @private
     */
    private longPress;
    /**
     * Renders the tooltip.
     *
     * @returns {void}
     * @private
     */
    tooltip(): void;
    private findHeader;
    private findShapes;
    private renderSeriesTooltip;
    private triggerTooltipRender;
    private findMarkerHeight;
    private findData;
    private getSymbolLocation;
    private getRangeArea;
    private getWaterfallRegion;
    private getTooltipText;
    private getTemplateText;
    private renderGroupedTooltip;
    /**
     * Applies the tooltip distance offset to the resolved tooltip location.
     *
     * @param {ChartLocation} location - The resolved tooltip location to be adjusted.
     * @param {PointData} point - The point data for which the tooltip is rendered.
     * @param {Chart} chart - The chart instance used to determine orientation and RTL.
     * @returns {void}
     * @private
     */
    private applyTooltipDistance;
    private triggerSharedTooltip;
    private findSharedLocation;
    /**
     * Get symbol locations for the current points.
     * @returns {ChartLocation[]} Array of ChartLocation; invalid points are { x: null, y: null }.
     */
    private findSplitLocation;
    /**
     * Get clip bounds for each current point's series.
     * @returns {[Rect[], string[]]} clipBounds and seriesTypes arrays.
     * Missing series produce { x: null, y: null, width: null, height: null } and ''.
     */
    private findSplitClipBounds;
    private getBoxLocation;
    private parseTemplate;
    private formatPointValue;
    private getFormat;
    private getIndicatorTooltipFormat;
    removeHighlightedMarker(data: PointData[], fadeOut: boolean): void;
    /**
     * Get module name.
     *
     * @returns {string} - Returns the module name.
     */
    protected getModuleName(): string;
    /**
     * To destroy the tooltip.
     *
     * @returns {void}
     * @private
     */
    destroy(): void;
}

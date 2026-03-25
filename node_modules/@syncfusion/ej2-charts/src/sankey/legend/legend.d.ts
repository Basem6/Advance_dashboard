/**
 * Sankey chart legend
 */
import { BaseLegend, LegendOptions } from '../../common/legend/legend';
import { Size, Rect } from '@syncfusion/ej2-svg-base';
import { ChartLocation } from '../../common/utils/helper';
import { Sankey } from '../sankey';
import { LegendSettingsModel } from '../../common/legend/legend-model';
/**
 * The `Legend` module is used to render the legend for the sankey chart.
 */
export declare class SankeyLegend extends BaseLegend {
    constructor(chart: Sankey);
    /**
     * Binding events for legend module.
     *
     * @returns {void}
     * @private
     */
    wireEvents(): void;
    /**
     * UnBinding events for legend module.
     *
     * @returns {void}
     * @private
     */
    unWireEvents(): void;
    /**
     * Handles mouse handleLegendMove events on the legend when legend interaction is enabled and the chart is not in touch mode.
     *
     * @param {MouseEvent} event - The mouse handleLegendMove event triggered by the user.
     * @returns {void}
     */
    private handleMouseMove;
    /**
     * Handles mouse end events on the legend when legend interaction is enabled and the chart is in touch mode.
     *
     * @param {MouseEvent} event - The mouse end event triggered by the user.
     * @returns {void}
     * @private
     */
    handleMouseEnd(event: MouseEvent): void;
    /**
     * Builds legend items from the Sankey node collection and applies RTL/reverse ordering rules.
     *
     * @param {Sankey} chart - The Sankey chart instance used to derive legend items.
     * @returns {void}
     * @private
     */
    getLegendOptions(chart: Sankey): void;
    /**
     * Calculates legend layout metrics and updates bounds including pagination based on available space.
     *
     * @param {Size} availableSize - The available rendering size for the legend.
     * @param {Rect} legendBounds - The legend bounds to be updated based on computed layout.
     * @param {LegendSettingsModel} legend - The legend settings model used for layout calculations.
     * @returns {void}
     * @private
     */
    getLegendBounds(availableSize: Size, legendBounds: Rect, legend: LegendSettingsModel): void;
    /**
     * Updates legend item text collection and height when wrapping is enabled and the item exceeds the available row width.
     *
     * @param {LegendOptions} legendOption - The legend item to update with wrapped text and computed height.
     * @param {LegendSettingsModel} legend - The legend settings used to determine wrapping and padding behavior.
     * @param {Rect} legendBounds - The bounding rectangle that limits legend layout width.
     * @param {number} rowWidth - The current accumulated row width including previous legend items.
     * @param {number} legendHeight - The base height used to compute wrapped text block height.
     * @param {number} padding - The padding value used in legend layout calculations.
     * @returns {void}
     * @private
     */
    getLegendHeight(legendOption: LegendOptions, legend: LegendSettingsModel, legendBounds: Rect, rowWidth: number, legendHeight: number, padding: number): void;
    /**
     * Calculates and assigns the legend item render location and applies trim overflow based on available width.
     *
     * @param {LegendOptions} legendOption - The legend item whose render point is being computed.
     * @param {ChartLocation} start - The starting location for the current row/column layout.
     * @param {number} textPadding - The padding to apply between shape and text for positioning calculations.
     * @param {LegendOptions} previousLegend - The previous legend item used as a reference for placement.
     * @param {Rect} rect - The layout bounds rectangle used to determine line breaks/column breaks.
     * @param {number} count - The current legend item index in the collection.
     * @param {number} firstLegend - The index of the first legend item in the current page/section.
     * @returns {void}
     * @private
     */
    getRenderPoint(legendOption: LegendOptions, start: ChartLocation, textPadding: number, previousLegend: LegendOptions, rect: Rect, count: number, firstLegend: number): void;
    /**
     * Checks whether the next legend item will exceed the provided bounds based on RTL direction.
     *
     * @param {number} previousBound - The computed boundary position from the previous legend item.
     * @param {number} textWidth - The width to be tested against the bounds.
     * @param {Rect} rect - The bounding rectangle used for overflow detection.
     * @returns {boolean} true if within bouunds, else false.
     *
     * @private
     */
    isWithinLegendBounds(previousBound: number, textWidth: number, rect: Rect): boolean;
    /**
     * Processes legend hover/trim-tooltip behavior based on the current pointer target within the legend.
     *
     * @param {Event} event - The interaction event used to resolve the current legend target element.
     * @returns {void}
     *
     * @private
     */
    handleLegendMove(event: Event): void;
    /**
     * Handles legend click interactions for paging controls when legend is visible.
     *
     * @param {Event | PointerEvent} event - The click or pointer event raised from the legend element.
     * @returns {void}
     *
     * @private
     */
    handleClick(event: Event | PointerEvent): void;
    /**
     * Gets the module name for the Sankey legend component.
     *
     * @returns {string} - the module name
     */
    protected getModuleName(): string;
    /**
     * To destroy the Legend.
     *
     * @returns {void}
     * @private
     */
    destroy(): void;
}

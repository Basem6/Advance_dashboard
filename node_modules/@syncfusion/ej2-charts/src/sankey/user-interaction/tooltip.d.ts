import { Sankey } from '../sankey';
import { Tooltip as SVGTooltip } from '@syncfusion/ej2-svg-base';
import { ChartLocation } from '../../common/utils/helper';
import { SankeyNodeAggregates } from '../model/sankey-interface';
/**
 * Tooltip rendering module for Sankey Chart.
 */
export declare class SankeyTooltip {
    /** @private */
    sankey: Sankey;
    /** @private */
    svgTooltip: SVGTooltip;
    private tooltipTimer;
    /**
     * Constructor.
     *
     * @param {Sankey} sankey - Sankey chart instance.
     */
    constructor(sankey: Sankey);
    /**
     * Wires all tooltip-related event listeners to the Sankey chart instance.
     *
     * This method attaches pointer, touch, mouse, and click events required for
     * tooltip rendering and lifecycle management.
     *
     * @returns {void}
     */
    private wireEvents;
    /**
     * Unwires all tooltip-related event listeners from the Sankey chart instance.
     *
     * @returns {void}
     */
    private unwireEvents;
    /**
     * Acts as a proxy to forward pointer and touch move events
     * to the existing handleMouseMove method.
     *
     * @param {PointerEvent | TouchEvent} event - The pointer or touch move event.
     * @returns {void}
     */
    private handlePointerMove;
    /**
     * Handles chart click events to hideTooltip the tooltip when fade-out mode is set to click.
     *
     * @param {Event} event - The click event triggered on the chart.
     * @returns {void}
     * @private
     */
    handleChartClick(event: Event): void;
    /**
     * Listens mouse move events inside the Sankey chart.
     *
     * @param {PointerEvent} event - The mouse or pointer move event within the chart.
     * @returns {void}
     * @private
     */
    handleMouseMove(event: PointerEvent): void;
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
    showTooltipForElement(targetElement: Element, isInitialRender?: boolean, fallbackPosition?: ChartLocation): void;
    /**
     * Triggers tooltip rendering logic when a mouse or pointer release
     * action occurs inside the Sankey chart series area.
     *
     * @param {PointerEvent} event - The mouse or pointer up event within the chart.
     * @returns {void}
     *
     * @private
     */
    handlePointerUp(event: PointerEvent): void;
    /**
     * Resolves the nearest interactive SVG element (node or link) starting from the given element.
     *
     * @param {string} chartId - The root chart element id used to construct node ids from label ids.
     * @param {Element | null} startElement - The starting element to inspect and traverse from.
     * @returns {Element | null }} The resolved element and its type ('node' or 'link').
     *
     * @private
     */
    resolveInteractiveTarget(chartId: string, startElement: Element | null): {
        element: Element | null;
        type: 'node' | 'link' | null;
    };
    /**
     * Triggers tooltip hiding if mouse away from chart series area.
     *
     * @returns {void}
     * @private
     */
    handlePointerLeave(): void;
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
    renderTooltip(isInitialRender: boolean, event: PointerEvent): void;
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
    computeNodeAggregates(nodeId: string, color?: string): SankeyNodeAggregates;
    /**
     * Hides the tooltip after the specified delay.
     *
     * @param {number} delay - The delay in milliseconds before hiding the tooltip.
     * @returns {void}
     * @private
     */
    hideTooltip(delay?: number): void;
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

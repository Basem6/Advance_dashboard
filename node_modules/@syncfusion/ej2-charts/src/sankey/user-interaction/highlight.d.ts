import { Sankey } from '../sankey';
/**
 * Highlight behavior module for Sankey Chart.
 */
export declare class SankeyHighlight {
    private chart;
    private lastHoveredId;
    private animationTimeoutId;
    /** Default animation duration for highlight removal in milliseconds. */
    private readonly DEFAULT_ANIMATION_DURATION;
    /** Minimum animation duration to ensure smooth transitions. */
    private readonly MIN_ANIMATION_DURATION;
    /** Epsilon value for floating point opacity comparison. */
    private readonly OPACITY_EPSILON;
    /**
     * Constructor.
     *
     * @param {Sankey} chart - Sankey chart instance.
     */
    constructor(chart: Sankey);
    /**
     * Wires legend interaction events to the chart for hover, move, click, and touch end behaviors.
     *
     * @returns {void}
     */
    private wireEvents;
    /**
     * Unwires legend interaction events from the chart to release handlers and avoid memory leaks.
     *
     * @returns {void}
     */
    private unwireEvents;
    /**
     * Retrieves all label elements from the chart's label collection.
     *
     * @returns {HTMLElement[]} - Array of label text elements, empty array if collection not found.
     * @private
     */
    getLabelElements(): HTMLElement[];
    /**
     * Clears active highlight when the pointer leaves the chart surface.
     *
     * @param {Event} _event - The leave event (unused).
     * @returns {void}
     * @private
     */
    handleMouseLeave(_event: Event): void;
    /**
     * Tracks pointer/touch movement to identify interactive nodes/links and apply the corresponding highlight.
     * Uses debouncing to prevent duplicate highlight updates from multiple event sources.
     *
     * @param {PointerEvent | TouchEvent} event - The pointer or touch move event used to detect the hovered element.
     * @returns {void}
     * @private
     */
    handleMouseMove(event: PointerEvent | TouchEvent): void;
    /**
     * Walks up the DOM tree to find the nearest interactive Sankey element (node, link, label, or legend item).
     *
     * @param {Element} element - The starting DOM element from the event target.
     * @returns {Element | null} - returns element if found, or null.
     * @private
     */
    getInteractiveTarget(element: Element): {
        type: string;
        id?: string;
        source?: string;
        target?: string;
    } | null;
    /**
     * Highlights the hovered node along with its directly connected neighbor nodes and links by applying active/inactive opacities.
     *
     * @param {string} nodeId - The node id whose related nodes and links should be highlighted.
     * @returns {void}
     * @private
     */
    highlightForNode(nodeId: string): void;
    /**
     * Highlights the hovered link and its source/target nodes by applying active/inactive opacities.
     *
     * @param {string | null} source - The source node id of the hovered link.
     * @param {string | null} target - The target node id of the hovered link.
     * @returns {void}
     * @private
     */
    highlightForLink(source: string | null, target: string | null): void;
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
    clearHighlights(animate?: boolean): void;
    /**
     * Stops all ongoing animations on link, node, and label elements without changing their opacity.
     * Used when switching between highlights to allow new highlight values to be applied immediately.
     *
     * @returns {void}
     * @private
     */
    stopAllAnimations(): void;
    /**
     * Performs the clearing of highlights with smooth animation for opacity values.
     * Animates all link, node, and label opacity changes to the default values.
     *
     * @returns {void}
     * @private
     */
    performClearHighlightsWithAnimation(): void;
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
    animateOpacityChange(element: HTMLElement | null, startOpacity: number, endOpacity: number, duration: number, removeAttribute?: boolean): void;
    /**
     * Highlights labels for the specified nodes and dims all other labels.
     *
     * @param {string[]} highlightedNodeIds - Array of node ids whose labels should be highlighted.
     * @param {SVGElement[]} labelElements - Array of all label text elements in the chart.
     * @param {number} inactiveOpacity - The opacity value to apply to non-highlighted labels.
     * @returns {void}
     * @private
     */
    highlightLabelsForNodes(highlightedNodeIds: string[], labelElements: SVGElement[], inactiveOpacity: number): void;
    /**
     * Extracts the node label/id from a label text element by finding the corresponding node.
     *
     * @param {SVGElement} labelElement - The label text element to extract the node id from.
     * @returns {string | null} returns the node id if found, else null.
     * @private
     */
    getNodeLabelFromLabelElement(labelElement: SVGElement): string | null;
    /**
     * Gets the module name for the Sankey highlight component.
     *
     * @returns {string} returns module name
     * @private
     */
    getModuleName(): string;
    /**
     * Destroys the highlight module by unwiring events and cleaning up any pending animations.
     *
     * @returns {void}
     * @private
     */
    destroy(): void;
}

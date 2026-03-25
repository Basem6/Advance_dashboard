import { Component, Internationalization, INotifyPropertyChanged, ModuleDeclaration, EmitType } from '@syncfusion/ej2-base';
import { MarginModel, BorderModel, AccessibilityModel, AnimationModel } from '../common/model/base-model';
import { ChartTheme, ExportType, Orientation } from '../common/utils/enum';
import { Rect, Size, SvgRenderer } from '@syncfusion/ej2-svg-base';
import { SankeySeries } from './series/series';
import { SankeyModel } from './sankey-model';
import { SankeyNode, SankeyLink } from './model/sankey-base';
import { SankeyLabelSettingsModel, SankeyNodeSettingsModel, SankeyLinkSettingsModel, SankeyTitleStyleModel, SankeyLegendSettingsModel, SankeyTooltipSettingsModel, SankeyNodeModel, SankeyLinkModel } from './model/sankey-base-model';
import { ISankeyThemeStyle, SankeyExportedEventArgs, SankeyExportEventArgs, SankeyLabelRenderEventArgs, SankeyLegendItemHoverEventArgs, SankeyLegendRenderEventArgs, SankeyLinkEventArgs, SankeyLinkRenderEventArgs, SankeyLoadedEventArgs, SankeyNodeEventArgs, SankeyNodeLayout, SankeyNodeRenderEventArgs, SankeyPrintEventArgs, SankeySizeChangedEventArgs, SankeyTooltipRenderEventArgs } from './model/sankey-interface';
import { SankeyLegend } from './legend/legend';
import { SankeyTooltip } from './user-interaction/tooltip';
import { IAfterExportEventArgs } from '../common';
import { SankeyExport } from './print-export/export';
import { SankeyHighlight } from './user-interaction/highlight';
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
export declare class Sankey extends Component<HTMLElement> implements INotifyPropertyChanged {
    /**
     * The width of the sankey diagram as a string, accepting values like '100px' or '100%'.
     * If specified as '100%', the component renders to the full width of its parent element.
     *
     * @default null
     */
    width: string;
    /**
     * The height of the sankey diagram as a string, accepting values like '100px' or '100%'.
     * If specified as '100%', the component renders to the full height of its parent element.
     *
     * @default null
     */
    height: string;
    /**
     * The title displayed at the top of the sankey diagram.
     *
     * @default ''
     */
    title: string;
    /**
     * The subtitle displayed below the main title.
     *
     * @default ''
     */
    subTitle: string;
    /**
     * Options to customize the appearance of the title text.
     */
    titleStyle: SankeyTitleStyleModel;
    /**
     * Options to customize the appearance of the subtitle text.
     */
    subTitleStyle: SankeyTitleStyleModel;
    /**
     * Background color of the sankey diagram. Accepts valid CSS color values.
     *
     * @default null
     */
    background: string;
    /**
     * Background image URL of the sankey diagram.
     *
     * @default null
     */
    backgroundImage: string;
    /**
     * Options to configure the margins around the component.
     */
    margin: MarginModel;
    /**
     * Options to configure the outer border of the component.
     */
    border: BorderModel;
    /**
     * Defines the theme of the component.
     *
     * @default 'Material'
     */
    theme: ChartTheme;
    /**
     * Collection of Sankey links that represent the flow between nodes.
     * Each link defines properties such as source, target, and value.
     *
     * @default []
     */
    links: SankeyLinkModel[];
    /**
     * Collection of Sankey nodes that represent entities in the diagram.
     * Each node defines properties such as name, color, and position.
     *
     * @default []
     */
    nodes: SankeyNodeModel[];
    /**
     * Defines the orientation of the Sankey diagram.
     * The options are:
     * * Horizontal - Renders nodes from left to right.
     * * Vertical - Renders nodes from top to bottom.
     *
     * @default 'Horizontal'
     */
    orientation: Orientation;
    /**
     * Customize labels using labelSettings to improve clarity and alignment with application design.
     */
    labelSettings: SankeyLabelSettingsModel;
    /**
     * Node style configuration for the sankey diagram.
     * Customize node appearance, size, opacity, and text alignment.
     */
    nodeStyle: SankeyNodeSettingsModel;
    /**
     * Link style configuration for the sankey diagram.
     * Customize link color, opacity, and hover behavior.
     */
    linkStyle: SankeyLinkSettingsModel;
    /**
     * Legend configuration for the sankey diagram.
     */
    legendSettings: SankeyLegendSettingsModel;
    /**
     * Tooltip configuration for displaying details on hover.
     */
    tooltip: SankeyTooltipSettingsModel;
    /**
     * Options for customizing the animation.
     *
     */
    animation: AnimationModel;
    /**
     * When set to true, enables export of the diagram into supported formats.
     *
     * @default true
     */
    enableExport: boolean;
    /**
     * Enables export in specific scenarios.
     *
     * @default false
     */
    allowExport: boolean;
    /**
     * Accessibility options for the component.
     */
    accessibility: AccessibilityModel;
    /**
     * Triggers before a legend item is rendered. Allows customization of legend text and shape color.
     *
     * @event legendItemRendering
     */
    legendItemRendering: EmitType<SankeyLegendRenderEventArgs>;
    /**
     * Triggers when the mouse hovers over a legend item.
     *
     * @event legendItemHover
     */
    legendItemHover: EmitType<SankeyLegendItemHoverEventArgs>;
    /**
     * Triggers before a label is rendered. Allows customization of label text and style.
     *
     * @event labelRendering
     */
    labelRendering: EmitType<SankeyLabelRenderEventArgs>;
    /**
     * Triggers before a node is rendered. Allows customization of node appearance.
     *
     * @event nodeRendering
     */
    nodeRendering: EmitType<SankeyNodeRenderEventArgs>;
    /**
     * Triggers before a link is rendered. Allows customization of link appearance.
     *
     * @event linkRendering
     */
    linkRendering: EmitType<SankeyLinkRenderEventArgs>;
    /**
     * Triggers when the chart size changes.
     *
     * @event sizeChanged
     */
    sizeChanged: EmitType<SankeySizeChangedEventArgs>;
    /**
     * Triggers before a tooltip is rendered. Allows customization of tooltip text.
     *
     * @event tooltipRendering
     */
    tooltipRendering: EmitType<SankeyTooltipRenderEventArgs>;
    /**
     * Triggers after the chart export is completed.
     *
     * @event exportCompleted
     */
    exportCompleted: EmitType<SankeyExportedEventArgs>;
    /**
     * Triggers when a node is clicked.
     *
     * @event nodeClick
     */
    nodeClick: EmitType<SankeyNodeEventArgs>;
    /**
     * Triggers when the mouse enters a node.
     *
     * @event nodeEnter
     */
    nodeEnter: EmitType<SankeyNodeEventArgs>;
    /**
     * Triggers when the mouse leaves a node.
     *
     * @event nodeLeave
     */
    nodeLeave: EmitType<SankeyNodeEventArgs>;
    /**
     * Triggers when a link is clicked.
     *
     * @event linkClick
     */
    linkClick: EmitType<SankeyLinkEventArgs>;
    /**
     * Triggers when the mouse enters a link.
     *
     * @event linkEnter
     */
    linkEnter: EmitType<SankeyLinkEventArgs>;
    /**
     * Triggers when the mouse leaves a link.
     *
     * @event linkLeave
     */
    linkLeave: EmitType<SankeyLinkEventArgs>;
    /**
     * Triggers after the sankey has fully loaded.
     *
     * @event loaded
     * @blazorProperty 'Loaded'
     */
    loaded: EmitType<SankeyLoadedEventArgs>;
    /**
     * Triggers before the sankey loads. This event allows for customization and configuration before the sankey is rendered.
     *
     * @event load
     */
    load: EmitType<SankeyLoadedEventArgs>;
    /**
     * Triggers before the export gets started.
     *
     * @event beforeExport
     */
    beforeExport: EmitType<SankeyExportEventArgs>;
    /**
     * Triggers after the export completed.
     *
     * @event afterExport
     */
    afterExport: EmitType<IAfterExportEventArgs>;
    /**
     * Triggers before the prints gets started.
     *
     * @event beforePrint
     */
    beforePrint: EmitType<SankeyPrintEventArgs>;
    /**
     * Customize the focus border color.
     * If not specified, the element will use the default focus border color.
     *
     * @default null
     */
    focusBorderColor: string;
    /**
     * Customize the focus border width.
     * If not specified, the element will use the default focus border width.
     *
     * @default 1.5
     */
    focusBorderWidth: number;
    /**
     * Customize the focus border margin.
     * If not specified, the element will use the default focus border margin.
     *
     * @default 0
     */
    focusBorderMargin: number;
    /** @private */
    sankeySeriesModule: SankeySeries;
    /** @private */
    sankeyLegendModule: SankeyLegend;
    /** @private */
    previousTargetId: string;
    /** @private */
    currentGroup: 'title' | 'subtitle' | 'nodes' | 'links' | 'legend' | null;
    /** @private */
    currentNodeIndex: number;
    /** @private */
    currentLinkIndex: number;
    /** @private */
    private currentLegendIndex;
    /** @private */
    intl: Internationalization;
    /** @private */
    isTouch: boolean;
    /** @private */
    startMove: boolean;
    /** @private */
    mouseX: number;
    /** @private */
    mouseY: number;
    /** @private */
    disableTrackTooltip: boolean;
    /** @private */
    svgObject: Element;
    /** @private */
    renderer: SvgRenderer;
    /** @private */
    availableSize: Size;
    /** @private */
    initialClipRect: Rect;
    /** @private */
    themeStyle: ISankeyThemeStyle;
    /** @private */
    private resizeBound;
    /** @private */
    animateSeries: boolean;
    /** @private */
    /**
     * Stores the computed Sankey node layout map keyed by node id.
     */
    nodeLayoutMap: {
        [key: string]: SankeyNodeLayout;
    };
    /**
     * Provides the tooltip module used to render Sankey tooltips.
     *
     * @private
     */
    tooltipModule: SankeyTooltip;
    /**
     * Holds the currently hovered Sankey node instance.
     *
     * @private
     */
    hoveredNode: SankeyNode;
    /**
     * Holds the currently hovered Sankey link instance.
     *
     * @private
     */
    hoveredLink: SankeyLink;
    /**
     * The Export Module is used to export chart.
     *
     * @private
     */
    sankeyExportModule: SankeyExport;
    /**
     * Provides the highlight module used for node/link hover interactions.
     *
     * @private
     */
    sankeyHighlightModule: SankeyHighlight;
    /**
     * Initializes the Sankey chart instance and its core modules.
     *
     * @param {SankeyModel} [options] - The Sankey configuration model used to initialize the component.
     * @param {string | HTMLElement} [element] - The host element or element id used to render the component.
     * @private
     */
    constructor(options?: SankeyModel, element?: string | HTMLElement);
    /**
     * Prepares the Sankey component for rendering by wiring events, applying culture/RTL settings, and computing available size.
     *
     * @returns {void}
     * @private
     */
    protected preRender(): void;
    /**
     * Renders the Sankey component by initializing SVG, computing nodes/legend/bounds, and drawing visual elements.
     *
     * @returns {void}
     * @private
     */
    protected render(): void;
    /**
     * Creates the chart SVG by removing the existing SVG and initializing a new one.
     *
     * @returns {void}
     * @private
     */
    createChartSvg(): void;
    /**
     * Removes the existing SVG and tooltip parent element from the DOM.
     *
     * @returns {void}
     * @private
     */
    removeSvg(): void;
    /**
     * Creates the secondary tooltip container element used for rendering tooltip content.
     *
     * @returns {void}
     * @private
     */
    createSecondaryElement(): void;
    /**
     * Positions and applies required styles to the secondary tooltip container element.
     *
     * @returns {void}
     */
    private positionSecondaryElement;
    /**
     * Calculates the initial clip rect and legend bounds based on margins, borders, titles, and available size.
     *
     * @returns {void}
     */
    private calculateBounds;
    /**
     * Renders all visual elements of the Sankey chart including border, title, series, legend, and accessibility features.
     *
     * @returns {void}
     */
    private renderElements;
    /**
     * Renders the chart border and background (including optional background image) into the SVG.
     *
     * @returns {void}
     */
    private renderBorder;
    /**
     * Renders the chart title and subtitle text elements with accessibility attributes applied.
     *
     * @returns {void}
     */
    private renderTitle;
    /**
     * Renders the Sankey legend if the legend module is available and legend visibility is enabled.
     *
     * @returns {void}
     */
    private renderLegend;
    /**
     * Finds and returns a user-defined node by id from the nodes collection.
     *
     * @param {string} id - The node id used to locate the node definition.
     * @returns {SankeyNode | null} returns node if present, else null.
     * @private
     */
    findNode(id: string): SankeyNode | null;
    /**
     * Finds and returns a user-defined link by source and target ids from the links collection.
     *
     * @param {string} sourceId - The source node id used to locate the link definition.
     * @param {string} targetId - The target node id used to locate the link definition.
     * @returns {SankeyLink | null} returns link if present, else null.
     *
     * @private
     */
    findLink(sourceId: string, targetId: string): SankeyLink | null;
    /**
     * Initializes the internationalization instance used by the component.
     *
     * @returns {void}
     */
    private setCulture;
    /**
     * Applies theme styles for the current chart theme.
     *
     * @returns {void}
     */
    private setTheme;
    /**
     * Calculates the available rendering size based on configured width/height or element client size.
     *
     * @returns {void}
     *
     * @private
     */
    calculateAvailableSize(): void;
    /**
     * Unbinds all DOM and window event listeners attached for Sankey interactions.
     *
     * @returns {void}
     *
     * @private
     */
    unWireEvents(): void;
    /**
     * Binds all required DOM and window event listeners for Sankey interactions.
     *
     * @returns {void}
     *
     * @private
     */
    wireEvents(): void;
    /**
     * Applying styles for sankey chart element.
     *
     * @param {HTMLElement} element - Specifies the element.
     * @returns {void}
     */
    private setStyle;
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
    handleDocumentKeyDown(keyboardEvent: KeyboardEvent): void;
    /**
     * Applies keyboard navigation focus styling to the Sankey chart container.
     *
     * @returns {void}
     *
     * @private
     */
    setContainerNavigationStyle(): void;
    /**
     * Handles pointer or mouse move events on the chart area.
     *
     * Updates the internal mouse position used for hit-testing
     * and tooltip positioning.
     *
     * @param {PointerEvent | MouseEvent} event - The pointer or mouse move event.
     * @returns {boolean} Returns false to prevent further propagation.
     */
    private handlePointerMove;
    /**
     * Handles pointer or mouse up events on the chart area.
     *
     * Updates the internal mouse position used for interaction handling.
     *
     * @param {PointerEvent | MouseEvent} event - The pointer or mouse up event.
     * @returns {boolean} Returns false to prevent further propagation.
     */
    private handlePointerUp;
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
    handlePointerLeave(event?: PointerEvent | MouseEvent): boolean;
    /**
     * Handles window resize by recalculating available size, triggering sizeChanged, and re-rendering only when dimensions differ.
     *
     * @returns {boolean} returns boolean based on chart resize actions.
     *
     * @private
     */
    chartResize(): boolean;
    /**
     * Sets the mouse coordinates relative to the chart SVG for pointer and mouse events.
     *
     * @param {PointerEvent | MouseEvent} event - Mouse/pointer event with client coordinates.
     * @returns {void}
     *
     * @private
     */
    updateMousePosition(event: {
        clientX: number;
        clientY: number;
    } | PointerEvent | MouseEvent): void;
    /**
     * Tracks pointer/touch movement, updates chart-relative mouse coordinates, and forwards the move event to the chart handler.
     *
     * @param {(PointerEvent | TouchEvent)} event - Pointer or touch move event containing client coordinates.
     * @returns {boolean} returns boolean based on mouse actions.
     *
     * @private
     */
    mouseMove(event: PointerEvent | TouchEvent): boolean;
    /**
     * Tracks pointer/touch end, updates chart-relative mouse coordinates, and forwards the end event to the mouse-leave handler.
     *
     * @param {(PointerEvent | TouchEvent)} event - Pointer or touch end event containing client coordinates.
     * @returns {boolean} returns boolean based on mouse actions.
     *
     * @private
     */
    mouseEnd(event: PointerEvent | TouchEvent): boolean;
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
    handleMouseMove(event: MouseEvent): boolean;
    /**
     * Notifies the chart about the pointer/touch start event to initiate interaction handling.
     *
     * @param {PointerEvent} event - Pointer down event raised on the chart surface.
     * @returns {boolean} returns boolean based on mouse actions.
     *
     * @private
     */
    handleMouseDown(event: PointerEvent): boolean;
    /**
     * Handles mouse leave by clearing hover states, triggering leave events, and notifying the chart about interaction end.
     *
     * @param {MouseEvent} event - Mouse leave event raised when the pointer exits the chart surface.
     * @returns {boolean} returns boolean based on mouse actions.
     *
     * @private
     */
    mouseLeave(event: MouseEvent): boolean;
    /**
     * Handles the mouse click on the chart.
     *
     * @param {PointerEvent | TouchEvent} e - The mouse or touch event.
     * @returns {boolean} -  Return false.
     * @private
     *
     */
    handleMouseClick(e: PointerEvent | TouchEvent): boolean;
    /**
     * Export method for the chart.
     *
     * @param {ExportType} type - Specifies the type of the export.
     * @param {string} fileName - Specifies the file name of the exported file.
     * @returns {void}
     *
     * @private
     */
    export(type: ExportType, fileName: string): void;
    /**
     * Prints the chart in the page.
     *
     * @param {string[] | string | Element} id - The id of the chart to be printed on the page.
     * @returns {void}
     *
     * @private
     */
    print(id?: string[] | string | Element): void;
    /**
     * Returns the persisted state of the component.
     *
     * @returns {string} the persisted state.
     *
     * @private
     */
    getPersistData(): string;
    /**
     * Handles property updates and refreshes the Sankey rendering based on the changed properties.
     *
     * @param {SankeyModel} newProp - Newly updated property values.
     * @param {SankeyModel} _oldProp - Previously existing property values.
     * @returns {void}
     *
     * @private
     */
    onPropertyChanged(newProp: SankeyModel, _oldProp: SankeyModel): void;
    /**
     * Handles focus-in events within the Sankey chart to manage keyboard navigation,
     * highlighting, and tooltip behavior based on the focused element group.
     *
     * @param {FocusEvent} event - The focus-in event dispatched on the chart.
     * @returns {void}
     * @private
     */
    handleFocusIn(event: FocusEvent): void;
    /**
     * Initializes the keyboard tab order for focusable groups within the Sankey chart.
     *
     * The order is: Title → Subtitle → Nodes → Links → Legend.
     * Only the first element of each group is tabbable by default; others use roving tabindex.
     *
     * @returns {void}
     */
    private initKeyboardTabOrder;
    /**
     * Updates tabindex so the previous element becomes unfocusable and the next element becomes focusable.
     *
     * @param {Element | null} [previousElement] - The element to make unfocusable.
     * @param {Element | null} [nextElement] - The element to make focusable.
     * @returns {void}
     *
     * @private
     */
    updateTabIndex(previousElement?: Element | null, nextElement?: Element | null): void;
    /**
     * Wraps an index into the valid range [0, total - 1].
     *
     * @param {number} index - The index to normalize.
     * @param {number} total - The total number of items in the collection.
     * @returns {number} The normalized index within bounds.
     *
     * @private
     */
    normalizeIndex(index: number, total: number): number;
    /**
     * Finds the index of an element by id within a list of elements.
     *
     * @param {Element[]} elements - The collection to search.
     * @param {string} targetId - The id of the element to find.
     * @returns {number} The index of the matching element, or 0 if not found.
     *
     * @private
     */
    indexOfElementById(elements: Element[], targetId: string): number;
    /**
     * Removes the focused CSS class from elements currently marked as focused.
     *
     * @returns {void}
     */
    private clearFocusedClasses;
    /**
     * Focuses the specified element, applies the focused class, and ensures it is tabbable.
     *
     * @param {Element} element - The element to focus.
     * @returns {string} The id of the focused element, or an empty string if focus was not applied.
     *
     * @private
     */
    focusElement(element: Element): string;
    /**
     * Applies keyboard navigation outline styling to the specified target element by id.
     *
     * @param {string} targetId - The id of the element to style.
     * @returns {void}
     *
     * @private
     */
    applyNavigationStyle(targetId: string): void;
    /**
     * Removes navigation outline styling from all focusable elements within the Sankey chart.
     *
     * @returns {void}
     *
     * @private
     */
    clearNavigationStyles(): void;
    /**
     * Determines the Sankey navigation group of a given element id.
     *
     * @param {string} targetId - The id of the element to classify.
     * @returns {'title' | 'subtitle' | 'nodes' | 'links' | 'legend' | null} The group name, or null if not recognized.
     *
     * @private
     */
    getGroupOf(targetId: string): 'title' | 'subtitle' | 'nodes' | 'links' | 'legend' | null;
    /**
     * Gets all SVG node <rect> elements within the Sankey node collection.
     *
     * @returns {Element[]} An array of node elements.
     *
     * @private
     */
    getNodeElements(): Element[];
    /**
     * Gets all SVG link <path> elements within the Sankey link collection.
     *
     * @returns {Element[]} An array of link elements.
     *
     * @private
     */
    getLinkElements(): Element[];
    /**
     * Gets all legend group elements within the Sankey legend container.
     *
     * @returns {Element[]} An array of legend group elements.
     *
     * @private
     */
    getLegendItems(): Element[];
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
    moveFocusWithinGroup(group: 'nodes' | 'links' | 'legend', delta: 1 | -1): string | null;
    /**
     * Applies highlight behavior based on the given element type (node or link).
     *
     * @param {Element} element - The element to highlight (node <rect> or link <path>).
     * @returns {void}
     *
     * @private
     */
    applyHighlightForElement(element: Element): void;
    /**
     * Ensures the tooltip module is created when tooltip is enabled.
     *
     * @returns {boolean} True if the tooltip module is available; otherwise, false.
     *
     * @private
     */
    ensureTooltip(): boolean;
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
    getElementCenterInChartCoords(targetElement: Element): {
        x: number;
        y: number;
    } | null;
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
    handleKeyDown(keyboardEvent: KeyboardEvent): boolean;
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
    handleKeyUp(keyboardEvent: KeyboardEvent): boolean;
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
    handleKeyboardNavigation(keyboardEvent: KeyboardEvent, targetId: string, action: 'Tab' | 'ArrowMove' | 'Enter' | 'Space' | 'ESC'): void;
    /**
     * Provides the list of modules required to render the control (series, tooltip, legend, export, etc.).
     *
     * @returns {ModuleDeclaration[]} returns required modules injected in sample.
     *
     * @private
     */
    requiredModules(): ModuleDeclaration[];
    /**
     * To destroy the widget
     *
     * @returns {void}
     * @private
     */
    destroy(): void;
    /**
     * Returns the name of the module used for Sankey control identification.
     *
     * @returns {string} - the module name
     * @private
     */
    getModuleName(): string;
}

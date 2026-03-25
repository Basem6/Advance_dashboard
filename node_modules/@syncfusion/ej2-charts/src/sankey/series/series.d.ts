import { Rect } from '@syncfusion/ej2-svg-base';
import { Sankey } from '../sankey';
import { SankeyNodeLayout } from '../model/sankey-interface';
import { SankeyLinkModel } from '../model/sankey-base-model';
export declare class SankeySeries {
    private nodeWidth;
    private nodePadding;
    private linkOpacity;
    private linkCurvature;
    /** @private */
    chart: Sankey;
    private dataLabelRects;
    /**
     * Renders the Sankey diagram by computing layout, creating clip path, and drawing links, nodes, and data labels.
     *
     * @param {Sankey} chart - The Sankey chart instance used for rendering.
     * @returns {void}
     *
     * @private
     */
    render(chart: Sankey): void;
    /**
     * Builds and returns a node layout map from the given links and user-defined node configuration.
     *
     * @param {SankeyLinkModel[]} links - Collection of Sankey links used to compute node in/out values.
     * @param {Sankey} chart - The Sankey chart instance that provides theme and user node definitions.
     * @returns {SankeyNodeLayout} returns node layout map for links and nodes.
     *
     * @private
     */
    buildNodes(links: SankeyLinkModel[], chart: Sankey): {
        [key: string]: SankeyNodeLayout;
    };
    /**
     * Assigns hierarchical levels to Sankey nodes using link direction and returns the total number of levels.
     *
     * @param {SankeyNodeLayout} nodes - Map of node id to its computed layout object.
     * @param {SankeyLinkModel[]} links - Collection of links used to compute node levels.
     * @returns {number} returns total number of levels.
     *
     * @private
     */
    assignLevels(nodes: {
        [key: string]: SankeyNodeLayout;
    }, links: SankeyLinkModel[]): number;
    /**
     * Computes node layout using vertical or horizontal strategy based on the chart orientation.
     *
     * @param {SankeyNodeLayout} nodes - Map of node id to its computed layout object.
     * @param {number} levelCount - Total number of levels used to distribute nodes.
     * @param {Rect} rect - The available clipping rectangle used for layout calculations.
     * @returns {void}
     */
    private computeLayout;
    /**
     * Computes the horizontal layout positions and sizes for nodes across levels within the given rectangle.
     *
     * @param {SankeyNodeLayout} nodes - Map of node id to its computed layout object.
     * @param {number} levelCount - Total number of levels used to distribute nodes.
     * @param {Rect} rect - The available clipping rectangle used for layout calculations.
     * @returns {void}
     *
     * @private
     */
    computeHorizontalLayout(nodes: {
        [key: string]: SankeyNodeLayout;
    }, levelCount: number, rect: Rect): void;
    /**
     * Computes the vertical layout positions and sizes for nodes across levels within the given rectangle.
     *
     * @param {SankeyNodeLayout} nodes - Map of node id to its computed layout object.
     * @param {number} levelCount - Total number of levels used to distribute nodes.
     * @param {Rect} rect - The available clipping rectangle used for layout calculations.
     * @returns {void}
     *
     * @private
     */
    computeVerticalLayout(nodes: {
        [key: string]: SankeyNodeLayout;
    }, levelCount: number, rect: Rect): void;
    /**
     * Creates and appends SVG groups for links, nodes, and labels with a clip-path applied.
     *
     * @param {Sankey} chart - The Sankey chart instance used to create and attach rendering groups.
     * @returns {void}
     */
    private renderGroups;
    /**
     * Renders Sankey data labels near nodes with collision handling and label rendering event support.
     *
     * @param {Sankey} chart - The Sankey chart instance used to render node labels.
     * @param {SankeyNodeLayout} nodes - Map of node id to its computed layout object.
     * @returns {void} returns void.
     */
    private renderDataLabels;
    /**
     * Renders Sankey node rectangles into level-based SVG groups using configured node styles and rendering events.
     *
     * @param {Sankey} chart - The Sankey chart instance used for rendering nodes.
     * @param {SankeyNodeLayout} nodes - Map of node id to its computed layout object.
     * @returns {void} returns void.
     *
     * @private
     */
    renderNodes(chart: Sankey, nodes: {
        [key: string]: SankeyNodeLayout;
    }): void;
    /**
     * Renders Sankey links into the link collection group with ordering, styling, and link rendering event support.
     *
     * @param {Sankey} chart - The Sankey chart instance used for rendering links.
     * @param {SankeyLinkModel[]} links - Collection of link models used to create rendered link paths.
     * @param { SankeyNodeLayout } nodes - Map of node id to its computed layout object.
     * @returns {void}
     *
     * @private
     */
    renderLinks(chart: Sankey, links: SankeyLinkModel[], nodes: {
        [key: string]: SankeyNodeLayout;
    }): void;
    /**
     * Renders a horizontal Sankey link path between source and target nodes and appends it into a level-based SVG group.
     *
     * @param {Element} linkCollectionGroup - The parent SVG group that holds all rendered link groups.
     * @param {SankeyLinkModel} currentLink - The current link model used to compute the rendered path and metadata.
     * @param {SankeyNodeLayout} sourceNode - The source node layout used to compute link start position and thickness.
     * @param {SankeyNodeLayout} targetNode - The target node layout used to compute link end position and thickness.
     * @param {number} gapBetweenLevels - The horizontal gap between node levels used for bezier curvature calculation.
     * @param {number} linkOpacity - The opacity value applied to the rendered link path.
     * @param {number} index - The link index used to generate a stable link key attribute.
     * @param {string} fill - The fill colcor based on the selected theme style.
     * @returns {void}
     *
     * @private
     */
    renderHorizontalLink(linkCollectionGroup: Element, currentLink: SankeyLinkModel, sourceNode: SankeyNodeLayout, targetNode: SankeyNodeLayout, gapBetweenLevels: number, linkOpacity: number, index: number, fill: string): void;
    /**
     * Renders a vertical Sankey link as a filled ribbon path between source and target nodes and appends it into a level-based SVG group.
     *
     * @param {Element} linkCollectionGroup - The parent SVG group that holds all rendered link groups.
     * @param {SankeyLinkModel} currentLink - The current link model used to compute the rendered ribbon path and metadata.
     * @param {SankeyNodeLayout} sourceNode - The source node layout used to compute ribbon start position and thickness.
     * @param {SankeyNodeLayout} targetNode - The target node layout used to compute ribbon end position and thickness.
     * @param {number} gapBetweenLevels - The vertical gap between node levels used for curvature calculation.
     * @param {number} linkOpacity - The opacity value applied to the rendered ribbon path.
     * @param {number} index - The link index used to generate a stable link key attribute.
     * @param {string} fill - The fill color of link based on theme color selected.
     * @returns {void}
     *
     * @private
     */
    renderVerticalLink(linkCollectionGroup: Element, currentLink: SankeyLinkModel, sourceNode: SankeyNodeLayout, targetNode: SankeyNodeLayout, gapBetweenLevels: number, linkOpacity: number, index: number, fill: string): void;
    /**
     * Calculates the horizontal gap between node levels based on the minimum and maximum levels present.
     *
     * @param { SankeyNodeLayout } nodes - Map of node id to its computed layout object.
     * @param {Rect} rect - The available clipping rectangle used for gap calculation.
     * @returns {number} returns gap in number
     *
     * @private
     */
    getHorizontalGapBetweenLevels(nodes: {
        [key: string]: SankeyNodeLayout;
    }, rect: Rect): number;
    /**
     * Calculates the vertical gap between node levels based on the minimum and maximum levels present.
     *
     * @param {SankeyNodeLayout} nodes - Map of node id to its computed layout object.
     * @param {Rect} rect - The available clipping rectangle used for gap calculation.
     * @returns {number} returns gap in number
     *
     * @private
     */
    getVerticalGapBetweenLevels(nodes: {
        [key: string]: SankeyNodeLayout;
    }, rect: Rect): number;
    /**
     * Sanitizes a string value into a DOM-safe identifier by replacing unsupported characters with underscores.
     *
     * @param {string} text - The input text to be sanitized for DOM id usage.
     * @returns {string} return string of Id.
     */
    private sanitizeId;
    /**
     * Creates (or reuses) an SVG <linearGradient> definition for a link that transitions from startColor to endColor.
     *
     * @param {Sankey} chart - The Sankey chart instance used to access the SVG root and renderer.
     * @param {string} startColor - The gradient start color applied at 0% offset.
     * @param {string} endColor - The gradient end color applied at 100% offset.
     * @param {boolean} isHorizontal - Indicates whether the link gradient should be applied horizontally.
     * @param {boolean} isRtl - Indicates whether the gradient direction should be reversed for RTL layouts.
     * @param {number} index - The link index used to generate a stable unique gradient id.
     * @param {string} sourceId - The source node id used to generate a stable unique gradient id.
     * @param {string} targetId - The target node id used to generate a stable unique gradient id.
     * @returns {string} The id of the created/reused gradient, or a fallback solid color when SVG is unavailable.
     *
     * @private
     */
    getOrCreateLinkGradient(chart: Sankey, startColor: string, endColor: string, isHorizontal: boolean, isRtl: boolean, index: number, sourceId: string, targetId: string): string;
    /**
     * Constructor.
     *
     * @param {Sankey} chart - Sankey chart instance.
     */
    constructor(chart: Sankey);
    /**
     * To destroy the series.
     *
     * @returns {void}
     * @private
     */
    destroy(): void;
    /**
     * Get module name.
     *
     * @returns {string} - Returns the module name.
     */
    protected getModuleName(): string;
    /**
     * Animate the clip rect for Sankey reveal.
     *
     * @param {HTMLElement} clipElement - The clip rectangle element used to reveal Sankey elements.
     * @param {Rect} rect - The clipping rectangle bounds used to compute the reveal transform.
     * @param {Sankey} chart - The Sankey chart instance used to resolve animation settings and orientation.
     * @returns {void}
     */
    private animateClipRect;
}

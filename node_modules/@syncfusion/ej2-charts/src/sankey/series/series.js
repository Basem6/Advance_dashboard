import { Rect, measureText } from '@syncfusion/ej2-svg-base';
import { RectOption, appendChildElement, isCollide, getAnimationFunction } from '../../common/utils/helper';
import { Animation, isNullOrUndefined } from '@syncfusion/ej2-base';
import { getNodeColor } from '../model/sankey-theme';
var SankeySeries = /** @class */ (function () {
    /**
     * Constructor.
     *
     * @param {Sankey} chart - Sankey chart instance.
     */
    function SankeySeries(chart) {
        this.dataLabelRects = [];
        this.chart = chart;
    }
    /**
     * Renders the Sankey diagram by computing layout, creating clip path, and drawing links, nodes, and data labels.
     *
     * @param {Sankey} chart - The Sankey chart instance used for rendering.
     * @returns {void}
     *
     * @private
     */
    SankeySeries.prototype.render = function (chart) {
        if (!chart.svgObject) {
            return;
        }
        // Process data source if available, otherwise use links array
        var sankeyLinks = chart.links;
        if (!sankeyLinks.length) {
            return;
        }
        var clipRect = chart.initialClipRect;
        if (!clipRect) {
            return;
        }
        this.nodeWidth = chart.nodeStyle.width;
        this.nodePadding = chart.nodeStyle.padding;
        this.linkOpacity = chart.linkStyle.opacity;
        this.linkCurvature = chart.linkStyle.curvature;
        this.chart = chart;
        var nodeLevels = this.assignLevels(chart.nodeLayoutMap, sankeyLinks);
        this.computeLayout(chart.nodeLayoutMap, nodeLevels, clipRect);
        this.renderGroups(chart);
        // Create a clipPath for Sankey rendering and apply to groups so we can animate reveal
        var clipId = chart.element.id + '_sankey_clip';
        var clipPathElement = chart.renderer.createClipPath({ id: clipId });
        var clipRectOptions = new RectOption(clipId + '_rect', '', {}, 1, new Rect(clipRect.x - 10, clipRect.y - 10, clipRect.width + 20, chart.availableSize.height + 20));
        var clipRectElement = chart.renderer.drawRectangle(clipRectOptions);
        clipPathElement.appendChild(clipRectElement);
        appendChildElement(false, chart.svgObject, clipPathElement, false);
        this.renderLinks(chart, sankeyLinks, chart.nodeLayoutMap);
        this.renderNodes(chart, chart.nodeLayoutMap);
        this.renderDataLabels(chart, chart.nodeLayoutMap);
        // Animate the clip rect to reveal Sankey elements
        if (chart.animation.enable && chart.animateSeries && chart.animation.duration > 0) {
            this.animateClipRect(clipRectElement, clipRect, chart);
            chart.animateSeries = false;
        }
    };
    /**
     * Builds and returns a node layout map from the given links and user-defined node configuration.
     *
     * @param {SankeyLinkModel[]} links - Collection of Sankey links used to compute node in/out values.
     * @param {Sankey} chart - The Sankey chart instance that provides theme and user node definitions.
     * @returns {SankeyNodeLayout} returns node layout map for links and nodes.
     *
     * @private
     */
    SankeySeries.prototype.buildNodes = function (links, chart) {
        var nodeLayouts = {};
        var colorPalette = getNodeColor(chart.theme);
        var userDefinedNodes = Array.isArray(chart.nodes) ? chart.nodes : [];
        var currentColorIndex = 0;
        var getNextColor = function () {
            var selectedColor = colorPalette[currentColorIndex % colorPalette.length];
            currentColorIndex++;
            return selectedColor;
        };
        var createNodeLayout = function (nodeId, nodeColor, nodeLabel) {
            return {
                id: nodeId,
                value: 0,
                inValue: 0,
                outValue: 0,
                level: 0,
                x: 0,
                y: 0,
                height: 0,
                outOffset: 0,
                inOffset: 0,
                color: nodeColor || getNextColor(),
                label: nodeLabel
            };
        };
        for (var _i = 0, userDefinedNodes_1 = userDefinedNodes; _i < userDefinedNodes_1.length; _i++) {
            var userNode = userDefinedNodes_1[_i];
            if (!userNode || !userNode.id) {
                continue;
            }
            nodeLayouts[userNode.id] = createNodeLayout(userNode.id, userNode.color, userNode.label.text);
            if (!isNullOrUndefined(userNode.offset)) {
                nodeLayouts[userNode.id].offset = userNode.offset;
            }
        }
        var getOrCreateNode = function (nodeId) {
            if (!nodeLayouts[nodeId]) {
                nodeLayouts[nodeId] = createNodeLayout(nodeId);
            }
            return nodeLayouts[nodeId];
        };
        for (var _a = 0, links_1 = links; _a < links_1.length; _a++) {
            var link = links_1[_a];
            var sourceNodeLayout = getOrCreateNode(link.sourceId);
            var targetNodeLayout = getOrCreateNode(link.targetId);
            sourceNodeLayout.outValue += link.value;
            targetNodeLayout.inValue += link.value;
        }
        var nodeIds = Object.keys(nodeLayouts);
        for (var index = 0; index < nodeIds.length; index++) {
            var nodeLayout = nodeLayouts[nodeIds[index]];
            nodeLayout.value = nodeLayout.inValue > nodeLayout.outValue ? nodeLayout.inValue : nodeLayout.outValue;
        }
        return nodeLayouts;
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
    SankeySeries.prototype.assignLevels = function (nodes, links) {
        var nodeInDegreeMap = {};
        var nodeIds = Object.keys(nodes);
        for (var nodeIndex = 0; nodeIndex < nodeIds.length; nodeIndex++) {
            nodeInDegreeMap[nodeIds[nodeIndex]] = 0;
        }
        for (var _i = 0, links_2 = links; _i < links_2.length; _i++) {
            var link = links_2[_i];
            nodeInDegreeMap[link.targetId] = (nodeInDegreeMap[link.targetId] || 0) + 1;
        }
        var processingQueue = [];
        var allNodeIds = Object.keys(nodeInDegreeMap);
        for (var nodeIndex = 0; nodeIndex < allNodeIds.length; nodeIndex++) {
            var nodeId = allNodeIds[nodeIndex];
            if (nodeInDegreeMap[nodeId] === 0) {
                processingQueue.push(nodeId);
            }
        }
        var adjacencyList = {};
        for (var _a = 0, links_3 = links; _a < links_3.length; _a++) {
            var link = links_3[_a];
            if (!adjacencyList[link.sourceId]) {
                adjacencyList[link.sourceId] = [];
            }
            adjacencyList[link.sourceId].push(link.targetId);
        }
        var maximumLevel = 0;
        while (processingQueue.length) {
            var currentNodeId = processingQueue.shift();
            var currentLevel = nodes[currentNodeId] ? nodes[currentNodeId].level : 0;
            var childNodeIds = adjacencyList[currentNodeId] || [];
            for (var childIndex = 0; childIndex < childNodeIds.length; childIndex++) {
                var childNodeId = childNodeIds[childIndex];
                var childNode = nodes[childNodeId];
                if (childNode) {
                    childNode.level = childNode.level > (currentLevel + 1) ? childNode.level : (currentLevel + 1);
                    maximumLevel = maximumLevel > childNode.level ? maximumLevel : childNode.level;
                }
                nodeInDegreeMap[childNodeId] = (nodeInDegreeMap[childNodeId] || 0) - 1;
                if (nodeInDegreeMap[childNodeId] === 0) {
                    processingQueue.push(childNodeId);
                }
            }
        }
        return maximumLevel + 1;
    };
    /**
     * Computes node layout using vertical or horizontal strategy based on the chart orientation.
     *
     * @param {SankeyNodeLayout} nodes - Map of node id to its computed layout object.
     * @param {number} levelCount - Total number of levels used to distribute nodes.
     * @param {Rect} rect - The available clipping rectangle used for layout calculations.
     * @returns {void}
     */
    SankeySeries.prototype.computeLayout = function (nodes, levelCount, rect) {
        var isVerticalLayout = this.chart && this.chart.orientation === 'Vertical';
        if (isVerticalLayout) {
            this.computeVerticalLayout(nodes, levelCount, rect);
        }
        else {
            this.computeHorizontalLayout(nodes, levelCount, rect);
        }
    };
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
    SankeySeries.prototype.computeHorizontalLayout = function (nodes, levelCount, rect) {
        var horizontalGapBetweenLevels = (levelCount > 1) ? (rect.width - this.nodeWidth) / (levelCount - 1) : 0;
        var nodesGroupedByLevel = {};
        var nodeIds = Object.keys(nodes);
        for (var nodeIndex = 0; nodeIndex < nodeIds.length; nodeIndex++) {
            var currentNodeLayout = nodes[nodeIds[nodeIndex]];
            if (currentNodeLayout) {
                var nodesAtCurrentLevel = nodesGroupedByLevel[currentNodeLayout.level] || [];
                nodesAtCurrentLevel.push(currentNodeLayout);
                nodesGroupedByLevel[currentNodeLayout.level] = nodesAtCurrentLevel;
            }
        }
        // Prepare global scaling: compute totals per level and use the largest-level total to derive a global scale.
        var levelTotals = [];
        var maxTotalValue = 0;
        var maxNodesInLevel = 0;
        for (var levelIndex = 0; levelIndex < levelCount; levelIndex++) {
            var nodesInCurrentLevel = nodesGroupedByLevel[levelIndex] || [];
            var totalValueInLevel = 0;
            for (var nodeIndex = 0; nodeIndex < nodesInCurrentLevel.length; nodeIndex++) {
                totalValueInLevel += nodesInCurrentLevel[nodeIndex].value;
            }
            levelTotals[levelIndex] = totalValueInLevel;
            if (totalValueInLevel > maxTotalValue) {
                maxTotalValue = totalValueInLevel;
            }
            if (nodesInCurrentLevel.length > maxNodesInLevel) {
                maxNodesInLevel = nodesInCurrentLevel.length;
            }
        }
        var maxTotalPadding = Math.max(maxNodesInLevel - 1, 0) * this.nodePadding;
        var globalValueToHeightScale = maxTotalValue > 0 ? (rect.height - maxTotalPadding) / maxTotalValue : 0;
        var _loop_1 = function (levelIndex) {
            var nodesInCurrentLevel = nodesGroupedByLevel[levelIndex] || [];
            var valueToHeightScale = globalValueToHeightScale;
            // compute heights for this level
            var nodeHeights = nodesInCurrentLevel.map(function (nodeLayout) {
                return Math.max(1, nodeLayout.value * valueToHeightScale);
            });
            var totalNodeHeights = nodeHeights.reduce(function (sum, height) { return sum + height; }, 0);
            var occupiedHeight = totalNodeHeights + Math.max(0, nodeHeights.length - 1) * this_1.nodePadding;
            // center the level vertically inside rect
            var startY = rect.y;
            if (occupiedHeight < rect.height) {
                startY = rect.y + (rect.height - occupiedHeight) / 2;
            }
            var currentYPosition = startY;
            for (var nodeIndex = 0; nodeIndex < nodesInCurrentLevel.length; nodeIndex++) {
                var currentNodeLayout = nodesInCurrentLevel[nodeIndex];
                // Position nodes left-to-right normally; if RTL enabled, position right-to-left.
                if (this_1.chart && this_1.chart.enableRtl) {
                    currentNodeLayout.x = rect.x + rect.width - (levelIndex * horizontalGapBetweenLevels) - this_1.nodeWidth;
                }
                else {
                    currentNodeLayout.x = rect.x + levelIndex * horizontalGapBetweenLevels;
                }
                currentNodeLayout.height = nodeHeights[nodeIndex];
                currentNodeLayout.y = currentYPosition;
                currentNodeLayout.outOffset = 0;
                currentNodeLayout.inOffset = 0;
                // Apply user-specified offset (pixels or percentage string)
                if (!isNullOrUndefined(currentNodeLayout.offset)) {
                    currentNodeLayout.y += currentNodeLayout.offset;
                }
                currentYPosition += currentNodeLayout.height + this_1.nodePadding;
            }
        };
        var this_1 = this;
        for (var levelIndex = 0; levelIndex < levelCount; levelIndex++) {
            _loop_1(levelIndex);
        }
    };
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
    SankeySeries.prototype.computeVerticalLayout = function (nodes, levelCount, rect) {
        var verticalGapBetweenLevels = (levelCount > 1) ? (rect.height - this.nodeWidth) / (levelCount - 1) : 0;
        var nodesGroupedByLevel = {};
        var nodeIds = Object.keys(nodes);
        // Group nodes by their level
        for (var nodeIndex = 0; nodeIndex < nodeIds.length; nodeIndex++) {
            var currentNodeLayout = nodes[nodeIds[nodeIndex]];
            if (currentNodeLayout) {
                var nodesAtCurrentLevel = nodesGroupedByLevel[currentNodeLayout.level] || [];
                nodesAtCurrentLevel.push(currentNodeLayout);
                nodesGroupedByLevel[currentNodeLayout.level] = nodesAtCurrentLevel;
            }
        }
        // Position nodes for each level (vertical orientation). Use global scaling similar to horizontal mode
        var levelTotalsVertical = [];
        var maxTotalValueVertical = 0;
        var maxNodesInLevelVertical = 0;
        for (var levelIndex = 0; levelIndex < levelCount; levelIndex++) {
            var nodesInCurrentLevel = nodesGroupedByLevel[levelIndex] || [];
            var totalValueInLevel = 0;
            for (var nodeIndex = 0; nodeIndex < nodesInCurrentLevel.length; nodeIndex++) {
                totalValueInLevel += nodesInCurrentLevel[nodeIndex].value;
            }
            levelTotalsVertical[levelIndex] = totalValueInLevel;
            if (totalValueInLevel > maxTotalValueVertical) {
                maxTotalValueVertical = totalValueInLevel;
            }
            if (nodesInCurrentLevel.length > maxNodesInLevelVertical) {
                maxNodesInLevelVertical = nodesInCurrentLevel.length;
            }
        }
        var maxTotalPaddingV = Math.max(maxNodesInLevelVertical - 1, 0) * this.nodePadding;
        var globalValueToWidthScale = maxTotalValueVertical > 0 ? (rect.width - maxTotalPaddingV) / maxTotalValueVertical : 0;
        for (var levelIndex = 0; levelIndex < levelCount; levelIndex++) {
            var nodesInCurrentLevel = nodesGroupedByLevel[levelIndex] || [];
            var levelY = rect.y + levelIndex * verticalGapBetweenLevels;
            // compute widths (stored in height) for this level
            var nodeSpanWidths = nodesInCurrentLevel.map(function (nodeLayout) {
                return Math.max(1, nodeLayout.value * globalValueToWidthScale);
            });
            var totalNodeWidths = nodeSpanWidths.reduce(function (sum, width) { return sum + width; }, 0);
            var occupiedWidth = totalNodeWidths + Math.max(0, nodeSpanWidths.length - 1) * this.nodePadding;
            // center horizontally inside rect
            var startX = rect.x;
            if (occupiedWidth < rect.width) {
                startX = rect.x + (rect.width - occupiedWidth) / 2;
            }
            var currentXPosition = startX;
            for (var nodeIndex = 0; nodeIndex < nodesInCurrentLevel.length; nodeIndex++) {
                var currentNodeLayout = nodesInCurrentLevel[nodeIndex];
                currentNodeLayout.y = levelY;
                currentNodeLayout.x = currentXPosition;
                currentNodeLayout.height = nodeSpanWidths[nodeIndex];
                currentNodeLayout.outOffset = 0;
                currentNodeLayout.inOffset = 0;
                // Apply user-specified offset (pixels or percentage string) horizontally in vertical layout
                if (!isNullOrUndefined(currentNodeLayout.offset)) {
                    currentNodeLayout.x += currentNodeLayout.offset;
                }
                currentXPosition += currentNodeLayout.height + this.nodePadding;
            }
        }
    };
    /**
     * Creates and appends SVG groups for links, nodes, and labels with a clip-path applied.
     *
     * @param {Sankey} chart - The Sankey chart instance used to create and attach rendering groups.
     * @returns {void}
     */
    SankeySeries.prototype.renderGroups = function (chart) {
        var chartElementId = chart.element.id;
        var linkGroupId = chartElementId + '_link_collection';
        var nodeGroupId = chartElementId + '_node_collection';
        var labelGroupId = chartElementId + '_label_collection';
        var clipId = chart.element.id + '_sankey_clip';
        var existingLinkGroup = document.getElementById(linkGroupId);
        if (existingLinkGroup && existingLinkGroup.parentNode) {
            existingLinkGroup.parentNode.removeChild(existingLinkGroup);
        }
        var existingNodeGroup = document.getElementById(nodeGroupId);
        if (existingNodeGroup && existingNodeGroup.parentNode) {
            existingNodeGroup.parentNode.removeChild(existingNodeGroup);
        }
        var existingLabelGroup = document.getElementById(labelGroupId);
        if (existingLabelGroup && existingLabelGroup.parentNode) {
            existingLabelGroup.parentNode.removeChild(existingLabelGroup);
        }
        var svgRenderer = chart.renderer;
        var linkCollectionGroup = svgRenderer.createGroup({ id: linkGroupId, 'clip-path': 'url(#' + clipId + ')' });
        var nodeCollectionGroup = svgRenderer.createGroup({ id: nodeGroupId, 'clip-path': 'url(#' + clipId + ')' });
        var labelCollectionGroup = svgRenderer.createGroup({ id: labelGroupId, 'clip-path': 'url(#' + clipId + ')' });
        // Append nodes first so links draw on top of nodes, then labels on top
        appendChildElement(false, chart.svgObject, nodeCollectionGroup, false);
        appendChildElement(false, chart.svgObject, linkCollectionGroup, false);
        appendChildElement(false, chart.svgObject, labelCollectionGroup, false);
    };
    /**
     * Renders Sankey data labels near nodes with collision handling and label rendering event support.
     *
     * @param {Sankey} chart - The Sankey chart instance used to render node labels.
     * @param {SankeyNodeLayout} nodes - Map of node id to its computed layout object.
     * @returns {void} returns void.
     */
    SankeySeries.prototype.renderDataLabels = function (chart, nodes) {
        var labelSettings = chart.labelSettings;
        if (!(labelSettings).visible) {
            return;
        }
        var labelPadding;
        var labelFontSize = String((labelSettings).fontSize);
        var labelFontFamily = (labelSettings).fontFamily ? String((labelSettings).fontFamily) : '';
        var labelFontWeight = String((labelSettings).fontWeight);
        var labelFontStyle = String((labelSettings).fontStyle);
        var defaultLabelColor = String((labelSettings).color ||
            (chart.themeStyle && chart.themeStyle.datalabelFont && chart.themeStyle.datalabelFont.color) ||
            ((chart.theme && /Dark|HighContrast/i.test(String(chart.theme))) ? '#FFFFFF' : '#334155'));
        // Store for use in label rendering event
        var labelStyle = labelSettings;
        // Build totals for each node: prefer inValue (total incoming), else outValue
        var nodeTotals = {};
        var nodeIds = Object.keys(nodes);
        var maxLevel = -1;
        for (var nodeIndex = 0; nodeIndex < nodeIds.length; nodeIndex++) {
            var nodeId = nodeIds[nodeIndex];
            var nodeLayout = nodes[nodeId];
            nodeTotals[nodeId] = nodeLayout.inValue > 0 ? nodeLayout.inValue : nodeLayout.outValue;
            if (nodeLayout.level > maxLevel) {
                maxLevel = nodeLayout.level;
            }
        }
        this.dataLabelRects = [];
        // Ensure per-level label groups inside label collection
        var labelCollection = document.getElementById(chart.element.id + '_label_collection');
        labelCollection.setAttribute('aria-hidden', 'true');
        var ensureLevelLabelGroup = function (level) {
            var levelGroup = document.getElementById(chart.element.id + "_label_level_" + level + "_g");
            if (!levelGroup) {
                levelGroup = chart.renderer.createGroup({ id: chart.element.id + "_label_level_" + level + "_g" });
                appendChildElement(false, labelCollection, levelGroup, false);
            }
            return levelGroup;
        };
        var isVertical = chart.orientation === 'Vertical';
        // Render labels next to nodes
        for (var nodeIndex = 0; nodeIndex < nodeIds.length; nodeIndex++) {
            var nodeLayout = nodes[nodeIds[nodeIndex]];
            var textElement = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            // Use custom label if available, otherwise use node ID
            var displayName = nodeLayout.label || nodeLayout.id;
            var labelText = displayName + ' ' + (nodeTotals[nodeLayout.id]);
            var labelColor = defaultLabelColor;
            var eventNode = null;
            var eventLink = null;
            var userNodes = Array.isArray(chart.nodes) ? chart.nodes : [];
            for (var userNodeIndex = 0; userNodeIndex < userNodes.length; userNodeIndex++) {
                var userNode = userNodes[userNodeIndex];
                if (userNode && userNode.id === nodeLayout.id) {
                    eventNode = userNode;
                    break;
                }
            }
            var userLinks = Array.isArray(chart.links) ? chart.links : [];
            for (var userLinkIndex = 0; userLinkIndex < userLinks.length; userLinkIndex++) {
                var userLink = userLinks[userLinkIndex];
                if (userLink && (userLink.sourceId === nodeLayout.id)) {
                    eventLink = userLink;
                    break;
                }
            }
            // Prefer node-level label settings over chart-level labelSettings
            var nodeLabelSettings = eventNode ? eventNode.label : null;
            labelPadding = (nodeLabelSettings && !isNullOrUndefined(nodeLabelSettings.padding)) ? nodeLabelSettings.padding :
                (labelSettings).padding;
            var labelRenderArgs = {
                text: labelText,
                node: eventNode,
                link: eventLink,
                labelStyle: labelStyle
            };
            var beforeLabelRendering = labelText;
            chart.trigger('labelRendering', labelRenderArgs);
            if (beforeLabelRendering !== labelRenderArgs.text) {
                nodeLayout.label = labelRenderArgs.text;
            }
            labelText = labelRenderArgs.text;
            labelColor = labelRenderArgs.labelStyle.color || defaultLabelColor;
            var levelGroup = ensureLevelLabelGroup(nodeLayout.level);
            var childIndex = levelGroup.childElementCount;
            textElement.setAttribute('id', chart.element.id + "_label_level_" + nodeLayout.level + "_" + childIndex);
            textElement.setAttribute('fill', labelColor);
            textElement.setAttribute('font-size', labelFontSize);
            if (labelFontFamily) {
                textElement.setAttribute('font-family', labelFontFamily);
            }
            if (labelFontWeight) {
                textElement.setAttribute('font-weight', labelFontWeight);
            }
            if (labelFontStyle) {
                textElement.setAttribute('font-style', labelFontStyle);
            }
            textElement.textContent = labelText;
            var fontModel = {
                size: labelFontSize,
                fontFamily: labelFontFamily,
                fontWeight: labelFontWeight,
                fontStyle: labelFontStyle
            };
            var textSize = measureText(labelText, fontModel, chart.themeStyle.datalabelFont);
            var labelWidth = textSize.width;
            var labelHeight = textSize.height;
            var xPos = void 0;
            var yPos = void 0;
            var rectX = void 0;
            var rectY = void 0;
            // Make isLastColumn available outside the branch so collision-shift can reuse the RTL-aware value
            var isLastColumn = false;
            if (isVertical) {
                isLastColumn = nodeLayout.level === maxLevel;
                var isLastRow = isLastColumn;
                yPos = isLastRow ? (nodeLayout.y - labelPadding) : (nodeLayout.y + this.nodeWidth + labelPadding);
                xPos = nodeLayout.x + nodeLayout.height / 2;
                var anchor = isLastRow ? 'end' : 'start';
                textElement.setAttribute('x', String(xPos));
                textElement.setAttribute('y', String(yPos));
                textElement.setAttribute('dominant-baseline', anchor === 'end' ? 'baseline' : 'hanging');
                textElement.setAttribute('text-anchor', 'middle');
                if (isLastRow) {
                    rectY = yPos - labelHeight;
                }
                else {
                    rectY = yPos;
                }
                rectX = xPos - labelWidth / 2;
            }
            else {
                isLastColumn = isVertical ? (nodeLayout.level === maxLevel) : ((chart.enableRtl) ? (nodeLayout.level === 0)
                    : (nodeLayout.level === maxLevel));
                xPos = isLastColumn ? (nodeLayout.x - labelPadding) : (nodeLayout.x + this.nodeWidth + labelPadding);
                yPos = nodeLayout.y + nodeLayout.height / 2;
                var anchor = isLastColumn ? 'end' : 'start';
                // Flip start/end anchor semantics for RTL so text alignment matches direction
                var anchorText = (chart && chart.enableRtl) ? (anchor === 'end' ? 'start' : (anchor === 'start' ? 'end' : anchor)) : anchor;
                textElement.setAttribute('x', String(xPos));
                textElement.setAttribute('y', String(yPos));
                textElement.setAttribute('dominant-baseline', 'middle');
                textElement.setAttribute('text-anchor', anchorText);
                if (isLastColumn) {
                    rectX = xPos - labelWidth;
                }
                else {
                    rectX = xPos;
                }
                rectY = yPos - labelHeight / 2;
            }
            var labelRect = new Rect(rectX, rectY, labelWidth, labelHeight);
            var tries = 0;
            var maxTries = 6;
            var step = 10;
            while (isCollide(labelRect, this.dataLabelRects, { x: 0, y: 0, width: 0, height: 0 }) && tries < maxTries) {
                tries++;
                if (isVertical) {
                    labelRect.y += (nodeLayout.level === maxLevel) ? -step : step;
                    yPos += (nodeLayout.level === maxLevel) ? -step : step;
                    textElement.setAttribute('y', String(yPos));
                }
                else {
                    // use the RTL-aware isLastColumn (declared above) when shifting to avoid LTR-only logic
                    labelRect.x += isLastColumn ? -step : step;
                    xPos += isLastColumn ? -step : step;
                    textElement.setAttribute('x', String(xPos));
                }
            }
            if (!isCollide(labelRect, this.dataLabelRects, { x: 0, y: 0, width: 0, height: 0 })) {
                levelGroup.appendChild(textElement);
                this.dataLabelRects.push(labelRect);
            }
        }
    };
    /**
     * Renders Sankey node rectangles into level-based SVG groups using configured node styles and rendering events.
     *
     * @param {Sankey} chart - The Sankey chart instance used for rendering nodes.
     * @param {SankeyNodeLayout} nodes - Map of node id to its computed layout object.
     * @returns {void} returns void.
     *
     * @private
     */
    SankeySeries.prototype.renderNodes = function (chart, nodes) {
        var nodeCollectionGroup = document.getElementById(chart.element.id + '_node_collection');
        if (!nodeCollectionGroup) {
            return;
        }
        var nodeStyle = chart.nodeStyle ? chart.nodeStyle : {};
        var nodeStroke = nodeStyle.stroke;
        var nodeStrokeWidth = typeof nodeStyle.strokeWidth === 'number' ? nodeStyle.strokeWidth : 1;
        var nodeOpacity = typeof nodeStyle.opacity === 'number' ? nodeStyle.opacity : 1;
        var nodeFill = nodeStyle.fill;
        var isVertical = chart.orientation === 'Vertical';
        var nodeIds = Object.keys(nodes);
        for (var nodeIndex = 0; nodeIndex < nodeIds.length; nodeIndex++) {
            var currentNodeLayout = nodes[nodeIds[nodeIndex]];
            // ensure level group exists
            var levelGroupId = chart.element.id + "_node_level_" + currentNodeLayout.level + "_g";
            var levelGroup = document.getElementById(levelGroupId);
            if (!levelGroup) {
                levelGroup = chart.renderer.createGroup({ id: levelGroupId });
                appendChildElement(false, nodeCollectionGroup, levelGroup, false);
            }
            var fillColor = nodeFill || currentNodeLayout.color;
            // Trigger nodeRendering event
            var eventNode = null;
            var userNodes = chart.nodes || [];
            for (var userNodeIndex = 0; userNodeIndex < userNodes.length; userNodeIndex++) {
                var userNode = userNodes[userNodeIndex];
                if (userNode && userNode.id === currentNodeLayout.id) {
                    eventNode = userNode;
                    break;
                }
            }
            var nodeRenderArgs = {
                node: eventNode,
                fill: fillColor
            };
            chart.trigger('nodeRendering', nodeRenderArgs);
            fillColor = nodeRenderArgs.fill;
            var nodeWidth = this.nodeWidth;
            var nodeHeight = currentNodeLayout.height;
            if (isVertical) {
                nodeWidth = currentNodeLayout.height;
                nodeHeight = this.nodeWidth;
            }
            var nodeRectOptions = new RectOption('', fillColor, { color: nodeStroke, width: nodeStrokeWidth }, 1, new Rect(currentNodeLayout.x, currentNodeLayout.y, nodeWidth, nodeHeight));
            var nodeRectElement = chart.renderer.drawRectangle(nodeRectOptions);
            // assign level-based sequential id: <chartId>_node_level_<level>_<index>
            var levelChildCount = levelGroup.childElementCount;
            var nodeElementId = chart.element.id + "_node_level_" + currentNodeLayout.level + "_" + levelChildCount;
            nodeRectElement.setAttribute('id', nodeElementId);
            nodeRectElement.setAttribute('aria-label', currentNodeLayout.id);
            nodeRectElement.setAttribute('role', 'region');
            nodeRectElement.setAttribute('tabindex', '-1'); // Readable, non-focusable
            nodeRectElement.setAttribute('aria-hidden', 'false');
            // Apply opacity
            if (nodeOpacity < 1) {
                nodeRectElement.setAttribute('opacity', nodeOpacity.toString());
            }
            appendChildElement(false, levelGroup, nodeRectElement, false);
        }
    };
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
    SankeySeries.prototype.renderLinks = function (chart, links, nodes) {
        var _this = this;
        var linkCollectionGroup = document.getElementById(chart.element.id + '_link_collection');
        if (!linkCollectionGroup) {
            return;
        }
        var linkStyle = chart.linkStyle;
        var effectiveLinkOpacity = typeof linkStyle.opacity === 'number' ? linkStyle.opacity : this.linkOpacity;
        var isVertical = chart.orientation === 'Vertical';
        var gapBetweenLevels = isVertical ?
            this.getVerticalGapBetweenLevels(nodes, chart.initialClipRect) :
            this.getHorizontalGapBetweenLevels(nodes, chart.initialClipRect);
        // Sort links to produce tidy stacking
        var sortedLinks = links.slice().sort(function (linkA, linkB) {
            var sourceA = nodes[linkA.sourceId];
            var sourceB = nodes[linkB.sourceId];
            var targetA = nodes[linkA.targetId];
            var targetB = nodes[linkB.targetId];
            if (isVertical) {
                var levelA = sourceA ? sourceA.level : 0;
                var levelB = sourceB ? sourceB.level : 0;
                if (levelA !== levelB) {
                    return levelA - levelB;
                }
                var sourceXDiff = (sourceA ? sourceA.x : 0) - (sourceB ? sourceB.x : 0);
                if (sourceXDiff !== 0) {
                    return sourceXDiff;
                }
                return (targetA ? targetA.x : 0) - (targetB ? targetB.x : 0);
            }
            else {
                var isrtl = !!(_this.chart && _this.chart.enableRtl);
                var sourceXA = sourceA ? sourceA.x : 0;
                var sourceXB = sourceB ? sourceB.x : 0;
                var primary = isrtl ? (sourceXB - sourceXA) : (sourceXA - sourceXB);
                if (primary !== 0) {
                    return primary;
                }
                var targetYA = targetA ? targetA.y : 0;
                var targetYB = targetB ? targetB.y : 0;
                return targetYA - targetYB;
            }
        });
        var userLinks = chart.links || [];
        var colorType = chart.linkStyle && (chart.linkStyle).colorType;
        for (var linkIndex = 0; linkIndex < sortedLinks.length; linkIndex++) {
            var currentLink = sortedLinks[linkIndex];
            var sourceNodeLayout = nodes[currentLink.sourceId];
            var targetNodeLayout = nodes[currentLink.targetId];
            if (!sourceNodeLayout || !targetNodeLayout) {
                continue;
            }
            // Find matching user link for event payload (if any)
            var eventLink = null;
            for (var j = 0; j < userLinks.length; j++) {
                var ul = userLinks[j];
                if (ul && ul.sourceId === currentLink.sourceId && ul.targetId === currentLink.targetId) {
                    eventLink = ul;
                    break;
                }
            }
            // Determine default link color based on configured colorType: Blend, Source, or Target
            var defaultLinkColor = void 0;
            if (colorType === 'Target') {
                defaultLinkColor = targetNodeLayout.color;
            }
            else if (colorType === 'Blend') {
                // Use gradient id
                var gradId = this.getOrCreateLinkGradient(chart, sourceNodeLayout.color, targetNodeLayout.color, 
                /* isHorizontal */ !isVertical, 
                /* isRtl */ !!chart.enableRtl, 
                /* index */ linkIndex, currentLink.sourceId, currentLink.targetId);
                defaultLinkColor = gradId; // renderer will convert to url(#id)
            }
            else {
                // 'Source' or fallback
                defaultLinkColor = sourceNodeLayout.color;
            }
            var linkRenderArgs = {
                // Prefer the user-facing link object; fall back to model if needed
                link: (eventLink) || currentLink,
                fill: defaultLinkColor
            };
            chart.trigger('linkRendering', linkRenderArgs);
            var finalFill = (linkRenderArgs && linkRenderArgs.fill) ? linkRenderArgs.fill : defaultLinkColor;
            if (isVertical) {
                this.renderVerticalLink(linkCollectionGroup, currentLink, sourceNodeLayout, targetNodeLayout, gapBetweenLevels, effectiveLinkOpacity, linkIndex, finalFill);
            }
            else {
                this.renderHorizontalLink(linkCollectionGroup, currentLink, sourceNodeLayout, targetNodeLayout, gapBetweenLevels, effectiveLinkOpacity, linkIndex, finalFill);
            }
        }
    };
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
    SankeySeries.prototype.renderHorizontalLink = function (linkCollectionGroup, currentLink, sourceNode, targetNode, gapBetweenLevels, linkOpacity, index, fill) {
        var outgoingLinkHeight = sourceNode.value > 0 ? (currentLink.value / sourceNode.value) * sourceNode.height : 0;
        var incomingLinkHeight = targetNode.value > 0 ? (currentLink.value / targetNode.value) * targetNode.height : 0;
        var linkHeight = Math.max(0, Math.min(outgoingLinkHeight, incomingLinkHeight));
        var isRtl = this.chart && this.chart.enableRtl;
        // In RTL mode: source connects from left, target connects to right
        // In LTR mode: source connects from right, target connects to left
        var sourceX = isRtl ? sourceNode.x : (sourceNode.x + this.nodeWidth);
        var sourceY = sourceNode.y + sourceNode.outOffset + linkHeight / 2;
        var targetX = isRtl ? (targetNode.x + this.nodeWidth) : targetNode.x;
        var targetY = targetNode.y + targetNode.inOffset + linkHeight / 2;
        sourceNode.outOffset += linkHeight;
        targetNode.inOffset += linkHeight;
        var curvatureOffset = gapBetweenLevels * this.linkCurvature;
        var pointX = isRtl ? (sourceX - curvatureOffset) : (sourceX + curvatureOffset);
        var pointY = isRtl ? (targetX + curvatureOffset) : (targetX - curvatureOffset);
        // Build closed ribbon path (top edge -> target top -> target bottom -> source bottom -> close)
        var sourceTop = (sourceY - linkHeight / 2) || 0;
        var sourceBottom = (sourceY + linkHeight / 2) || 0;
        var targetTop = (targetY - linkHeight / 2) || 0;
        var targetBottom = (targetY + linkHeight / 2) || 0;
        var pathD = 'M ' + sourceX + ' ' + sourceTop +
            ' C ' + pointX + ' ' + sourceTop + ', ' + pointY + ' ' + targetTop + ', ' + targetX + ' ' + targetTop +
            ' L ' + targetX + ' ' + targetBottom +
            ' C ' + pointY + ' ' + targetBottom + ', ' + pointX + ' ' + sourceBottom + ', ' + sourceX + ' ' + sourceBottom +
            ' Z';
        var linkPathElement = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        var levelGroupId = this.chart.element.id + "_link_level_" + sourceNode.level + "_g";
        var levelGroup = document.getElementById(levelGroupId);
        if (!levelGroup) {
            levelGroup = this.chart.renderer.createGroup({ id: levelGroupId });
            appendChildElement(false, linkCollectionGroup, levelGroup, false);
        }
        var levelChildCount = levelGroup.childElementCount;
        var generatedLinkId = this.chart.element.id + "_link_level_" + sourceNode.level + "_" + levelChildCount;
        linkPathElement.setAttribute('id', generatedLinkId);
        linkPathElement.setAttribute('d', pathD);
        // Use gradient URL if grad id provided, otherwise color fill
        if (fill && fill.indexOf('gradient-') === 0) {
            linkPathElement.setAttribute('fill', "url(#" + fill + ")");
            linkPathElement.setAttribute('stroke', 'none');
            linkPathElement.setAttribute('stroke-width', '0');
        }
        else if (fill && fill.indexOf('url(') === 0) {
            linkPathElement.setAttribute('fill', fill);
            linkPathElement.setAttribute('stroke', 'none');
            linkPathElement.setAttribute('stroke-width', '0');
        }
        else {
            linkPathElement.setAttribute('fill', fill || sourceNode.color);
            linkPathElement.setAttribute('stroke', 'none');
            linkPathElement.setAttribute('stroke-width', '0');
        }
        linkPathElement.setAttribute('opacity', linkOpacity ? linkOpacity.toString() : '1');
        linkPathElement.setAttribute('data-source', currentLink.sourceId);
        linkPathElement.setAttribute('data-target', currentLink.targetId);
        linkPathElement.setAttribute('data-value', currentLink.value.toString());
        linkPathElement.setAttribute('data-link-key', currentLink.sourceId + "__" + currentLink.targetId + "__" + index);
        linkPathElement.setAttribute('role', 'link');
        var linkDescription = this.chart.accessibility.accessibilityDescription ||
            "From " + currentLink.sourceId + " to " + currentLink.targetId + ": Value " + currentLink.value;
        linkPathElement.setAttribute('aria-label', linkDescription);
        linkPathElement.setAttribute('tabindex', '-1');
        appendChildElement(false, levelGroup, linkPathElement, false);
    };
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
    SankeySeries.prototype.renderVerticalLink = function (linkCollectionGroup, currentLink, sourceNode, targetNode, gapBetweenLevels, linkOpacity, index, fill) {
        var outBandWidth = sourceNode.value > 0 ? (currentLink.value / sourceNode.value) * sourceNode.height : 0;
        var inBandWidth = targetNode.value > 0 ? (currentLink.value / targetNode.value) * targetNode.height : 0;
        var linkBaseWidt = Math.min(outBandWidth, inBandWidth);
        // Clamp to remaining band on each node so the last link closes cleanly
        var sourceRemainingWidth = Math.max(0, sourceNode.height - sourceNode.outOffset);
        var targetRemainingWidth = Math.max(0, targetNode.height - targetNode.inOffset);
        var linkWidth = Math.max(0, Math.min(linkBaseWidt, sourceRemainingWidth, targetRemainingWidth));
        if (sourceRemainingWidth - linkWidth < 0.5 || targetRemainingWidth - linkWidth < 0.5) {
            linkWidth = Math.min(sourceRemainingWidth, targetRemainingWidth);
        }
        // Left/right edges on source and target nodes (in vertical layout, node.height represents horizontal span)
        var sourceLeftX = sourceNode.x + sourceNode.outOffset;
        var sourceRightX = sourceLeftX + linkWidth;
        var targetLeftX = targetNode.x + targetNode.inOffset;
        var targetRightX = targetLeftX + linkWidth;
        // Y coordinates: from bottom of source row to top of target row
        var y1 = sourceNode.y + this.nodeWidth; // bottom of source node (row thickness = nodeWidth)
        var y2 = targetNode.y; // top of target node
        // Update offsets AFTER we compute this band
        sourceNode.outOffset += linkWidth;
        targetNode.inOffset += linkWidth;
        // Curvature clamped to half the gap
        var rawCurv = gapBetweenLevels * this.linkCurvature;
        var vGap = Math.max(0, y2 - y1);
        var curve = Math.min(rawCurv, Math.max(0, vGap / 2 - 1));
        var c1Y = y1 + curve;
        var c2Y = y2 - curve;
        // Build closed ribbon path
        var pathD = 'M ' + sourceLeftX + ' ' + y1 +
            ' C ' + sourceLeftX + ' ' + c1Y + ', ' + targetLeftX + ' ' + c2Y + ', ' + targetLeftX + ' ' + y2 +
            ' L ' + targetRightX + ' ' + y2 +
            ' C ' + targetRightX + ' ' + c2Y + ', ' + sourceRightX + ' ' + c1Y + ', ' + sourceRightX + ' ' + y1 +
            ' Z';
        var linkPathElement = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        var levelGroupId = this.chart.element.id + "_link_level_" + sourceNode.level + "_g";
        var levelGroup = document.getElementById(levelGroupId);
        if (!levelGroup) {
            levelGroup = this.chart.renderer.createGroup({ id: levelGroupId });
            appendChildElement(false, linkCollectionGroup, levelGroup, false);
        }
        var levelChildCount = levelGroup.childElementCount;
        var generatedLinkId = this.chart.element.id + "_link_level_" + sourceNode.level + "_" + levelChildCount;
        linkPathElement.setAttribute('id', generatedLinkId);
        linkPathElement.setAttribute('d', pathD);
        // Use gradient URL if grad id provided, otherwise color fill
        if (fill && fill.indexOf('gradient-') === 0) {
            linkPathElement.setAttribute('fill', "url(#" + fill + ")");
        }
        else if (fill && fill.indexOf('url(') === 0) {
            linkPathElement.setAttribute('fill', fill);
        }
        else {
            linkPathElement.setAttribute('fill', fill || sourceNode.color);
        }
        linkPathElement.setAttribute('opacity', linkOpacity.toString());
        linkPathElement.setAttribute('data-source', currentLink.sourceId);
        linkPathElement.setAttribute('data-target', currentLink.targetId);
        linkPathElement.setAttribute('data-value', currentLink.value.toString());
        linkPathElement.setAttribute('data-link-key', currentLink.sourceId + "__" + currentLink.targetId + "__" + index);
        linkPathElement.setAttribute('role', 'link');
        var linkDescription = this.chart.accessibility.accessibilityDescription ||
            "From " + currentLink.sourceId + " to " + currentLink.targetId + ": Value " + currentLink.value;
        linkPathElement.setAttribute('aria-label', linkDescription);
        linkPathElement.setAttribute('tabindex', '-1');
        appendChildElement(false, levelGroup, linkPathElement, false);
    };
    /**
     * Calculates the horizontal gap between node levels based on the minimum and maximum levels present.
     *
     * @param { SankeyNodeLayout } nodes - Map of node id to its computed layout object.
     * @param {Rect} rect - The available clipping rectangle used for gap calculation.
     * @returns {number} returns gap in number
     *
     * @private
     */
    SankeySeries.prototype.getHorizontalGapBetweenLevels = function (nodes, rect) {
        var minimumLevel = 9007199254740991; // Number.MAX_SAFE_INTEGER alternative
        var maximumLevel = -1;
        var nodeIds = Object.keys(nodes);
        for (var nodeIndex = 0; nodeIndex < nodeIds.length; nodeIndex++) {
            var currentNodeLayout = nodes[nodeIds[nodeIndex]];
            minimumLevel = minimumLevel < currentNodeLayout.level ? minimumLevel : currentNodeLayout.level;
            maximumLevel = maximumLevel > currentNodeLayout.level ? maximumLevel : currentNodeLayout.level;
        }
        var totalLevels = (maximumLevel - minimumLevel > 0 ? (maximumLevel - minimumLevel) : 0) + 1;
        return (totalLevels > 1) ? (rect.width - this.nodeWidth) / (totalLevels - 1) : rect.width;
    };
    /**
     * Calculates the vertical gap between node levels based on the minimum and maximum levels present.
     *
     * @param {SankeyNodeLayout} nodes - Map of node id to its computed layout object.
     * @param {Rect} rect - The available clipping rectangle used for gap calculation.
     * @returns {number} returns gap in number
     *
     * @private
     */
    SankeySeries.prototype.getVerticalGapBetweenLevels = function (nodes, rect) {
        var minimumLevel = 9007199254740991; // Number.MAX_SAFE_INTEGER alternative
        var maximumLevel = -1;
        var nodeIds = Object.keys(nodes);
        for (var nodeIndex = 0; nodeIndex < nodeIds.length; nodeIndex++) {
            var currentNodeLayout = nodes[nodeIds[nodeIndex]];
            minimumLevel = minimumLevel < currentNodeLayout.level ? minimumLevel : currentNodeLayout.level;
            maximumLevel = maximumLevel > currentNodeLayout.level ? maximumLevel : currentNodeLayout.level;
        }
        var totalLevels = (maximumLevel - minimumLevel > 0 ? (maximumLevel - minimumLevel) : 0) + 1;
        return (totalLevels > 1) ? (rect.height - this.nodeWidth) / (totalLevels - 1) : rect.height;
    };
    /**
     * Sanitizes a string value into a DOM-safe identifier by replacing unsupported characters with underscores.
     *
     * @param {string} text - The input text to be sanitized for DOM id usage.
     * @returns {string} return string of Id.
     */
    SankeySeries.prototype.sanitizeId = function (text) {
        return text.replace(/[^a-zA-Z0-9_]/g, '_');
    };
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
    SankeySeries.prototype.getOrCreateLinkGradient = function (chart, startColor, endColor, isHorizontal, isRtl, index, sourceId, targetId) {
        var svgRootElement = chart.svgObject;
        if (!svgRootElement) {
            return startColor || endColor || '#000000';
        }
        // Use renderer to create defs to match existing patterns in the codebase
        var defsElement = svgRootElement.querySelector('defs');
        if (!defsElement) {
            defsElement = chart.renderer.createDefs();
            svgRootElement.append(defsElement);
        }
        var gradientId = "gradient-" + this.sanitizeId(chart.element.id) + "_" +
            (this.sanitizeId(String(sourceId)) + "_") +
            (this.sanitizeId(String(targetId)) + "_") +
            ("" + index);
        if (defsElement.querySelector("#" + gradientId)) {
            return gradientId;
        }
        var svgNamespaceUri = 'http://www.w3.org/2000/svg';
        var linearGradientElement = document.createElementNS(svgNamespaceUri, 'linearGradient');
        linearGradientElement.setAttribute('id', gradientId);
        if (isHorizontal) {
            if (isRtl) {
                linearGradientElement.setAttribute('x1', '100%');
                linearGradientElement.setAttribute('y1', '0%');
                linearGradientElement.setAttribute('x2', '0%');
                linearGradientElement.setAttribute('y2', '0%');
            }
            else {
                linearGradientElement.setAttribute('x1', '0%');
                linearGradientElement.setAttribute('y1', '0%');
                linearGradientElement.setAttribute('x2', '100%');
                linearGradientElement.setAttribute('y2', '0%');
            }
        }
        else {
            linearGradientElement.setAttribute('x1', '0%');
            linearGradientElement.setAttribute('y1', '0%');
            linearGradientElement.setAttribute('x2', '0%');
            linearGradientElement.setAttribute('y2', '100%');
        }
        var startStopElement = document.createElementNS(svgNamespaceUri, 'stop');
        startStopElement.setAttribute('offset', '0%');
        startStopElement.setAttribute('stop-color', startColor);
        startStopElement.setAttribute('stop-opacity', '1');
        var endStopElement = document.createElementNS(svgNamespaceUri, 'stop');
        endStopElement.setAttribute('offset', '100%');
        endStopElement.setAttribute('stop-color', endColor);
        endStopElement.setAttribute('stop-opacity', '1');
        linearGradientElement.appendChild(startStopElement);
        linearGradientElement.appendChild(endStopElement);
        defsElement.appendChild(linearGradientElement);
        return gradientId;
    };
    /**
     * To destroy the series.
     *
     * @returns {void}
     * @private
     */
    SankeySeries.prototype.destroy = function () {
        /**
         * Destroy method performed here.
         */
    };
    /**
     * Get module name.
     *
     * @returns {string} - Returns the module name.
     */
    SankeySeries.prototype.getModuleName = function () {
        return 'SankeySeries';
    };
    /**
     * Animate the clip rect for Sankey reveal.
     *
     * @param {HTMLElement} clipElement - The clip rectangle element used to reveal Sankey elements.
     * @param {Rect} rect - The clipping rectangle bounds used to compute the reveal transform.
     * @param {Sankey} chart - The Sankey chart instance used to resolve animation settings and orientation.
     * @returns {void}
     */
    SankeySeries.prototype.animateClipRect = function (clipElement, rect, chart) {
        var animationEffect = getAnimationFunction('Linear');
        var duration = (chart.animation).duration;
        clipElement.style.visibility = 'hidden';
        new Animation({}).animate(clipElement, {
            duration: duration,
            delay: 0,
            progress: function (args) {
                clipElement.style.visibility = 'visible';
                if (chart.orientation === 'Vertical') {
                    var animatedValue = animationEffect(args.timeStamp, 0, rect.height, args.duration);
                    var xAnchor = rect.x + rect.width / 2;
                    var yAnchor = rect.y + rect.height; // anchor at bottom
                    clipElement.setAttribute('transform', 'translate(' + xAnchor + ' ' + yAnchor + ') scale(1,' + (animatedValue / rect.height) + ') translate(' + (-xAnchor) + ' ' + (-yAnchor) + ')');
                }
                else {
                    var animatedValue = animationEffect(args.timeStamp, 0, rect.width, args.duration);
                    // For RTL, anchor at right edge so reveal runs right->left
                    var isRtl = chart && chart.enableRtl;
                    var xAnchor = isRtl ? (rect.x + rect.width) : rect.x;
                    var yAnchor = rect.y + rect.height / 2;
                    var scaleX = (animatedValue / rect.width);
                    // when anchoring at right we still scale from 0->1; transform sequence centers on anchor
                    clipElement.setAttribute('transform', 'translate(' + xAnchor + ' ' + yAnchor + ') scale(' + (scaleX) + ',1) translate(' + (-xAnchor) + ' ' + (-yAnchor) + ')');
                }
            },
            end: function () {
                clipElement.setAttribute('transform', 'translate(0,0)');
                if ((chart).trigger) {
                    chart.trigger('animationComplete', {});
                }
            }
        });
    };
    return SankeySeries;
}());
export { SankeySeries };

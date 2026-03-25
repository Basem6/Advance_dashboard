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
import { ChildProperty, Complex, Property } from '@syncfusion/ej2-base';
import { Border, Font, Location, Margin } from '../../common/model/base';
/**
 * Configures label settings for Sankey nodes to customize their appearance and text styling.
 */
var SankeyDataLabel = /** @class */ (function (_super) {
    __extends(SankeyDataLabel, _super);
    function SankeyDataLabel() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate([
        Property(null)
    ], SankeyDataLabel.prototype, "text", void 0);
    __decorate([
        Property(null)
    ], SankeyDataLabel.prototype, "padding", void 0);
    return SankeyDataLabel;
}(ChildProperty));
export { SankeyDataLabel };
/**
 * Configures label settings for Sankey nodes to customize their appearance and text styling.
 */
var SankeyLabelSettings = /** @class */ (function (_super) {
    __extends(SankeyLabelSettings, _super);
    function SankeyLabelSettings() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate([
        Property(true)
    ], SankeyLabelSettings.prototype, "visible", void 0);
    __decorate([
        Property('12px')
    ], SankeyLabelSettings.prototype, "fontSize", void 0);
    __decorate([
        Property('')
    ], SankeyLabelSettings.prototype, "color", void 0);
    __decorate([
        Property(null)
    ], SankeyLabelSettings.prototype, "fontFamily", void 0);
    __decorate([
        Property('400')
    ], SankeyLabelSettings.prototype, "fontWeight", void 0);
    __decorate([
        Property(10)
    ], SankeyLabelSettings.prototype, "padding", void 0);
    __decorate([
        Property('normal')
    ], SankeyLabelSettings.prototype, "fontStyle", void 0);
    return SankeyLabelSettings;
}(ChildProperty));
export { SankeyLabelSettings };
/**
 * Defines a Sankey node item.
 */
var SankeyNode = /** @class */ (function (_super) {
    __extends(SankeyNode, _super);
    function SankeyNode() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate([
        Property(null)
    ], SankeyNode.prototype, "color", void 0);
    __decorate([
        Property(null)
    ], SankeyNode.prototype, "id", void 0);
    __decorate([
        Complex({}, SankeyDataLabel)
    ], SankeyNode.prototype, "label", void 0);
    __decorate([
        Property(0)
    ], SankeyNode.prototype, "offset", void 0);
    return SankeyNode;
}(ChildProperty));
export { SankeyNode };
/**
 * Represents a single link (edge) in a Sankey diagram. A link connects a source node to a target node and carries a quantitative flow between them.
 */
var SankeyLink = /** @class */ (function (_super) {
    __extends(SankeyLink, _super);
    function SankeyLink() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate([
        Property(null)
    ], SankeyLink.prototype, "sourceId", void 0);
    __decorate([
        Property(null)
    ], SankeyLink.prototype, "targetId", void 0);
    __decorate([
        Property(null)
    ], SankeyLink.prototype, "value", void 0);
    return SankeyLink;
}(ChildProperty));
export { SankeyLink };
/**
 * Configures link style settings for Sankey diagram links to customize their appearance and behavior.
 */
var SankeyLinkSettings = /** @class */ (function (_super) {
    __extends(SankeyLinkSettings, _super);
    function SankeyLinkSettings() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate([
        Property(0.35)
    ], SankeyLinkSettings.prototype, "opacity", void 0);
    __decorate([
        Property(1)
    ], SankeyLinkSettings.prototype, "highlightOpacity", void 0);
    __decorate([
        Property(0.3)
    ], SankeyLinkSettings.prototype, "inactiveOpacity", void 0);
    __decorate([
        Property(0.55)
    ], SankeyLinkSettings.prototype, "curvature", void 0);
    __decorate([
        Property('Blend')
    ], SankeyLinkSettings.prototype, "colorType", void 0);
    return SankeyLinkSettings;
}(ChildProperty));
export { SankeyLinkSettings };
/**
 * Configures node style settings for Sankey nodes to customize their appearance and styling.
 */
var SankeyNodeSettings = /** @class */ (function (_super) {
    __extends(SankeyNodeSettings, _super);
    function SankeyNodeSettings() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate([
        Property('')
    ], SankeyNodeSettings.prototype, "stroke", void 0);
    __decorate([
        Property(null)
    ], SankeyNodeSettings.prototype, "fill", void 0);
    __decorate([
        Property(1)
    ], SankeyNodeSettings.prototype, "strokeWidth", void 0);
    __decorate([
        Property(10)
    ], SankeyNodeSettings.prototype, "padding", void 0);
    __decorate([
        Property(20)
    ], SankeyNodeSettings.prototype, "width", void 0);
    __decorate([
        Property(1)
    ], SankeyNodeSettings.prototype, "opacity", void 0);
    __decorate([
        Property(1)
    ], SankeyNodeSettings.prototype, "highlightOpacity", void 0);
    __decorate([
        Property(0.3)
    ], SankeyNodeSettings.prototype, "inactiveOpacity", void 0);
    return SankeyNodeSettings;
}(ChildProperty));
export { SankeyNodeSettings };
/**
 * Represents the text style settings used for rendering the title of a Sankey diagram.
 */
var SankeyTitleStyle = /** @class */ (function (_super) {
    __extends(SankeyTitleStyle, _super);
    function SankeyTitleStyle() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate([
        Property(null)
    ], SankeyTitleStyle.prototype, "size", void 0);
    __decorate([
        Property(null)
    ], SankeyTitleStyle.prototype, "fontWeight", void 0);
    __decorate([
        Property(null)
    ], SankeyTitleStyle.prototype, "fontFamily", void 0);
    __decorate([
        Property(null)
    ], SankeyTitleStyle.prototype, "color", void 0);
    __decorate([
        Property('normal')
    ], SankeyTitleStyle.prototype, "fontStyle", void 0);
    __decorate([
        Property(1)
    ], SankeyTitleStyle.prototype, "opacity", void 0);
    __decorate([
        Property('Center')
    ], SankeyTitleStyle.prototype, "textAlignment", void 0);
    return SankeyTitleStyle;
}(ChildProperty));
export { SankeyTitleStyle };
/**
 * Configures the tooltip behavior and appearance for the Sankey diagram.
 */
var SankeyTooltipSettings = /** @class */ (function (_super) {
    __extends(SankeyTooltipSettings, _super);
    function SankeyTooltipSettings() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate([
        Property(true)
    ], SankeyTooltipSettings.prototype, "enable", void 0);
    __decorate([
        Property(null)
    ], SankeyTooltipSettings.prototype, "fill", void 0);
    __decorate([
        Property(1)
    ], SankeyTooltipSettings.prototype, "opacity", void 0);
    __decorate([
        Property(null)
    ], SankeyTooltipSettings.prototype, "textStyle", void 0);
    __decorate([
        Property('$name : $value')
    ], SankeyTooltipSettings.prototype, "nodeFormat", void 0);
    __decorate([
        Property('$start.name $start.value → $target.name $target.value')
    ], SankeyTooltipSettings.prototype, "linkFormat", void 0);
    __decorate([
        Property(null)
    ], SankeyTooltipSettings.prototype, "nodeTemplate", void 0);
    __decorate([
        Property(null)
    ], SankeyTooltipSettings.prototype, "linkTemplate", void 0);
    __decorate([
        Property(true)
    ], SankeyTooltipSettings.prototype, "enableAnimation", void 0);
    __decorate([
        Property(300)
    ], SankeyTooltipSettings.prototype, "duration", void 0);
    __decorate([
        Property(1000)
    ], SankeyTooltipSettings.prototype, "fadeOutDuration", void 0);
    __decorate([
        Property('Move')
    ], SankeyTooltipSettings.prototype, "fadeOutMode", void 0);
    return SankeyTooltipSettings;
}(ChildProperty));
export { SankeyTooltipSettings };
/**
 * Configures the legend behavior and appearance for the Sankey diagram
 */
var SankeyLegendSettings = /** @class */ (function (_super) {
    __extends(SankeyLegendSettings, _super);
    function SankeyLegendSettings() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate([
        Property(true)
    ], SankeyLegendSettings.prototype, "visible", void 0);
    __decorate([
        Property(null)
    ], SankeyLegendSettings.prototype, "width", void 0);
    __decorate([
        Property(null)
    ], SankeyLegendSettings.prototype, "height", void 0);
    __decorate([
        Property('Auto')
    ], SankeyLegendSettings.prototype, "position", void 0);
    __decorate([
        Property(8)
    ], SankeyLegendSettings.prototype, "padding", void 0);
    __decorate([
        Property(null)
    ], SankeyLegendSettings.prototype, "itemPadding", void 0);
    __decorate([
        Complex({ fontFamily: null, size: null, fontStyle: null, fontWeight: null, color: null }, Font)
    ], SankeyLegendSettings.prototype, "textStyle", void 0);
    __decorate([
        Property(10)
    ], SankeyLegendSettings.prototype, "shapeWidth", void 0);
    __decorate([
        Property(10)
    ], SankeyLegendSettings.prototype, "shapeHeight", void 0);
    __decorate([
        Complex({}, Border)
    ], SankeyLegendSettings.prototype, "border", void 0);
    __decorate([
        Complex({ bottom: 10, left: 10, right: 10, top: 10 }, Margin)
    ], SankeyLegendSettings.prototype, "margin", void 0);
    __decorate([
        Property(8)
    ], SankeyLegendSettings.prototype, "shapePadding", void 0);
    __decorate([
        Property('transparent')
    ], SankeyLegendSettings.prototype, "background", void 0);
    __decorate([
        Property(1)
    ], SankeyLegendSettings.prototype, "opacity", void 0);
    __decorate([
        Property(true)
    ], SankeyLegendSettings.prototype, "enableHighlight", void 0);
    __decorate([
        Property(null)
    ], SankeyLegendSettings.prototype, "title", void 0);
    __decorate([
        Complex({ fontFamily: null, size: null, fontStyle: null, fontWeight: null, color: null }, Font)
    ], SankeyLegendSettings.prototype, "titleStyle", void 0);
    __decorate([
        Property(false)
    ], SankeyLegendSettings.prototype, "isInversed", void 0);
    __decorate([
        Property(false)
    ], SankeyLegendSettings.prototype, "reverse", void 0);
    __decorate([
        Complex({ x: 0, y: 0 }, Location)
    ], SankeyLegendSettings.prototype, "location", void 0);
    return SankeyLegendSettings;
}(ChildProperty));
export { SankeyLegendSettings };

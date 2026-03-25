import { Sankey } from '../sankey';
import { SankeyTheme } from './sankey-enum';
import { ISankeyThemeStyle } from './sankey-interface';
/**
 * Gets an array of node colors for Sankey chart visualization.
 *
 * @param {SankeyTheme} theme - The theme for which to retrieve the node colors.
 * @returns {string[]} - An array of node colors.
 * @private
 */
export declare function getNodeColor(theme: SankeyTheme): string[];
/**
 * Gets a theme color for Sankey chart.
 *
 * @param {SankeyTheme} theme - The theme for which to retrieve the series colors.
 * @param {Sankey} [_chart] - The chart instance (optional).
 * @returns {ISankeyThemeStyle} - Returns theme style.
 * @private
 */
export declare function getSankeyThemeColor(theme: SankeyTheme, _chart?: Sankey): ISankeyThemeStyle;

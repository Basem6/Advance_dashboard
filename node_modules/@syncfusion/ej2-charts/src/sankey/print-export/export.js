import { ExportUtils } from '../../common/utils/export';
import { beforeExport } from '../../common/model/constants';
/**
 * The `SankeyExportModule` module is used to print and export the rendered chart.
 */
var SankeyExport = /** @class */ (function () {
    /**
     * Constructor for export module.
     *
     * @private
     */
    function SankeyExport(chart) {
        this.chart = chart;
    }
    /**
     * Export the chart on the page to PNG, JPEG, or SVG format.
     *
     * @param {number} type - The format in which the chart will be exported.
     * @param {string} fileName - The name of the exported file.
     * @returns {void}
     *
     * @private
     */
    SankeyExport.prototype.export = function (type, fileName) {
        var exportChart = new ExportUtils(this.chart);
        var exportEventArgs = {
            cancel: false, width: null, height: null
        };
        this.chart.trigger(beforeExport, exportEventArgs);
        if (!exportEventArgs.cancel) {
            exportChart.export(type, fileName, undefined, [this.chart]);
            this.chart.trigger('afterExport', exportEventArgs);
        }
    };
    /**
     * Export the chart on the page to a PDF document.
     *
     * @param {string} fileName - The name of the exported file.
     * @param {PdfPageOrientation} orientation - Page orientation (portrait or landscape).
     * @param {Sankey[]} controls - Array of controls to be exported.
     * @param {number} width - The width of the exported chart.
     * @param {number} height - The height of the exported chart.
     * @param {boolean} isVertical - Export the chart vertically or horizontally.
     * @param {string} header - Text to appear at the top of the exported PDF document.
     * @param {string} footer - Text to appear at the bottom of the exported PDF document.
     * @param {boolean} exportToMultiplePages - Export the chart to multiple PDF pages.
     * @returns {void}
     *
     * @private
     */
    SankeyExport.prototype.pdfExport = function (fileName, orientation, controls, width, height, isVertical, header, footer, exportToMultiplePages) {
        var exportChart = new ExportUtils(this.chart);
        controls = controls ? controls : [this.chart];
        var exportEventArgs = {
            cancel: false, width: width, height: height
        };
        this.chart.trigger(beforeExport, exportEventArgs);
        if (!exportEventArgs.cancel) {
            exportChart.export('PDF', fileName, orientation, controls, width = exportEventArgs.width, height = exportEventArgs.height, isVertical, header, footer, exportToMultiplePages);
            this.chart.trigger('afterExport', exportEventArgs);
        }
    };
    /**
     * Gets a data URL for the rendered sankey chart as an HTML canvas element, including data URL and blob URL if available.
     *
     * @param {Sankey} chart - The sankey chart for which the data URL is requested.
     * @returns {{ element: HTMLCanvasElement, dataUrl?: string, blobUrl?: string }} An object containing the HTML canvas element, data URL, and blob URL.
     *
     * @private
     */
    SankeyExport.prototype.getDataUrl = function (chart) {
        var exportUtil = new ExportUtils(chart);
        return exportUtil.getDataUrl(chart);
    };
    /**
     * Triggers the beforePrint event before the chart is printed.
     *
     * @param {Element} htmlContent - The HTML content to be printed.
     * @returns {void}
     *
     * @private
     */
    SankeyExport.prototype.triggerBeforePrint = function (htmlContent) {
        var exportEventArgs = {
            cancel: false, htmlContent: htmlContent
        };
        this.chart.trigger('beforePrint', exportEventArgs);
    };
    /**
     * Gets the module name for the current component.
     *
     * @returns {string} The module name.
     */
    SankeyExport.prototype.getModuleName = function () {
        // Returns the module name
        return 'SankeyExport';
    };
    /**
     * To destroy the export modules.
     *
     * @returns {void}
     * @private
     */
    SankeyExport.prototype.destroy = function () {
        // Destroy method performed here
    };
    return SankeyExport;
}());
export { SankeyExport };

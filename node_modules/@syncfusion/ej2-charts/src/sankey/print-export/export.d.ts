import { PdfPageOrientation } from '@syncfusion/ej2-pdf-export';
import { ExportType } from '../../common/utils/enum';
import { IPDFArgs } from '../../common/model/interface';
import { Sankey } from '../sankey';
/**
 * The `SankeyExportModule` module is used to print and export the rendered chart.
 */
export declare class SankeyExport {
    private chart;
    /**
     * Constructor for export module.
     *
     * @private
     */
    constructor(chart: Sankey);
    /**
     * Export the chart on the page to PNG, JPEG, or SVG format.
     *
     * @param {number} type - The format in which the chart will be exported.
     * @param {string} fileName - The name of the exported file.
     * @returns {void}
     *
     * @private
     */
    export(type: ExportType, fileName: string): void;
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
    pdfExport(fileName: string, orientation?: PdfPageOrientation, controls?: (Sankey)[], width?: number, height?: number, isVertical?: boolean, header?: IPDFArgs, footer?: IPDFArgs, exportToMultiplePages?: boolean): void;
    /**
     * Gets a data URL for the rendered sankey chart as an HTML canvas element, including data URL and blob URL if available.
     *
     * @param {Sankey} chart - The sankey chart for which the data URL is requested.
     * @returns {{ element: HTMLCanvasElement, dataUrl?: string, blobUrl?: string }} An object containing the HTML canvas element, data URL, and blob URL.
     *
     * @private
     */
    getDataUrl(chart: Sankey): {
        element: HTMLCanvasElement;
        dataUrl?: string;
        blobUrl?: string;
    };
    /**
     * Triggers the beforePrint event before the chart is printed.
     *
     * @param {Element} htmlContent - The HTML content to be printed.
     * @returns {void}
     *
     * @private
     */
    triggerBeforePrint(htmlContent: Element): void;
    /**
     * Gets the module name for the current component.
     *
     * @returns {string} The module name.
     */
    protected getModuleName(): string;
    /**
     * To destroy the export modules.
     *
     * @returns {void}
     * @private
     */
    destroy(): void;
}

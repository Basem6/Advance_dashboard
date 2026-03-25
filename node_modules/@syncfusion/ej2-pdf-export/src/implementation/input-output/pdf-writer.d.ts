/**
 * PdfWriter.ts class for EJ2-PDF
 */
import { StreamWriter } from '@syncfusion/ej2-file-utils';
import { PdfDocumentBase } from './../document/pdf-document-base';
import { IPdfWriter } from './../../interfaces/i-pdf-writer';
/**
 * Helper class for chunk buffer.
 * @private
 */
export declare class _PdfChunkBuffer {
    /**
     * Specifies the `chunks`.
     * @private
     */
    private chunks;
    /**
     * Specifies the `current`.
     * @private
     */
    private current;
    /**
     * Specifies the `offset`.
     * @private
     */
    private offset;
    /**
     * Specifies the `committed`.
     * @private
     */
    private committed;
    /**
     * Specifies the `chunkSize`.
     * @private
     */
    private readonly chunkSize;
    /**
     * Initialize an instance of `_PdfChunkBuffer` class.
     * @private
     */
    constructor(chunkSize?: number);
    /**
     * Gets the `length`.
     * @private
     */
    readonly length: number;
    /**
     * Grows the buffer by allocating a new chunk.
     * @private
     */
    private grow;
    /**
     * Writes ASCII string as bytes (each charCodeAt masked to 0..255).
     * @private
     */
    writeAscii(str: string): void;
    /**
     * Converts to `Uint8Array`.
     * @private
     */
    toUint8Array(): Uint8Array;
    /**
     * Destroys the array buffer.
     * @private
     */
    destroy(): void;
}
/**
 * Used to `write a string` into output file.
 * @private
 */
export declare class PdfWriter implements IPdfWriter {
    /**
     * Specifies the `byteCountForStreamWriter`.
     * @private
     */
    private byteCountForStreamWriter;
    /**
     * Specifies the parent `document`.
     * @private
     */
    private pdfDocument;
    /**
     * Specifies the `stream`.
     * @private
     */
    private streamWriter;
    /**
     * Initialize an instance of `PdfWriter` class.
     * @private
     */
    constructor(stream: StreamWriter);
    /**
     * Initialize an instance of `PdfWriter` class.
     * @private
     */
    constructor(stream: PdfWriterHelper);
    /**
     * Gets and Sets the `document`.
     * @private
     */
    document: PdfDocumentBase;
    /**
     * Gets the `position`.
     * @private
     */
    readonly position: number;
    /**
     * Gets  the `length` of the stream'.
     * @private
     */
    readonly length: number;
    /**
     * Gets the `stream`.
     * @private
     */
    readonly stream: StreamWriter | PdfWriterHelper;
    /**
     * `Writes the specified data`.
     * @private
     */
    write(data: string | number): void;
}
/**
 * Helper class for PDF writer.
 * @private
 */
export declare class PdfWriterHelper {
    /**
     * Specifies the `buffer`.
     * @private
     */
    buffer: PdfArrayBuffer;
    /**
     * Initialize an instance of `PdfWriterHelper` class.
     * @private
     */
    constructor(chunkSize?: number);
    /**
     * Writes the specified data.
     * @private
     */
    write(data: string): void;
    /**
     * Destroy the array buffer.
     * @private
     */
    destroy(): void;
}
/**
 * Helper class for PDF writer.
 * @private
 */
export declare class PdfArrayBuffer {
    /**
     * Specifies the `buffer`.
     * @private
     */
    private buf;
    /**
     * Initialize an instance of `PdfArrayBuffer` class.
     * @private
     */
    constructor(chunkSize?: number);
    /**
     * Gets the `size`.
     * @private
     */
    readonly size: number;
    /**
     * Writes the specified data.
     * @private
     */
    write(value: string): void;
    /**
     * Converts to `Uint8Array`.
     * @private
     */
    toUint8Array(): Uint8Array;
    /**
     * Destroys the buffer.
     * @private
     */
    destroy(): void;
}

import { Encoding } from './encoding';
/**
 * StreamWriter class contains the implementation for writing characters to a file in a particular encoding
 * ```typescript
 * let writer = new StreamWriter();
 * writer.write('Hello World');
 * writer.save('Sample.txt');
 * writer.dispose();
 * ```
 */
export declare class StreamWriter {
    private bufferBlob;
    private bufferText;
    private enc;
    /**
     * Gets the content written to the StreamWriter as a Blob.
     * @returns {Blob} The Blob containing the written content.
     */
    readonly buffer: Blob;
    /**
     * Gets the encoding.
     * @returns {Encoding} The current encoding instance.
     */
    readonly encoding: Encoding;
    /**
     * Initializes a new instance of the StreamWriter class by using the specified encoding.
     * @param {Encoding} [encoding] - The character encoding to use.
     */
    constructor(encoding?: Encoding);
    private init;
    /**
     * Sets the Byte Order Mark (BOM) value based on the EncodingType.
     * @returns {void} Nothing is returned.
     * @private
     */
    private setBomByte;
    /**
     * Saves the file with specified name and sends the file to client browser
     * @param  {string} fileName - The file name to save
     * @returns {void}
     */
    save(fileName: string): void;
    /**
     * Writes the specified string.
     * @param  {string} value - The string to write. If value is null or undefined, nothing is written.
     * @returns {void}
     */
    write(value: string): void;
    private flush;
    /**
     * Writes the specified string followed by a line terminator
     * @param  {string} value - The string to write. If value is null or undefined, nothing is written
     * @returns {void}
     */
    writeLine(value: string): void;
    /**
     * Releases the resources used by the StreamWriter
     * @returns {void}
     */
    destroy(): void;
}

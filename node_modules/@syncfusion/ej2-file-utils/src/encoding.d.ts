/**
 * Encoding class: Contains the details about encoding type, whether to write a Unicode byte order mark (BOM).
 * ```typescript
 * let encoding : Encoding = new Encoding();
 * encoding.type = 'Utf8';
 * encoding.getBytes('Encoding', 0, 5);
 * ```
 */
export declare class Encoding {
    private emitBOM;
    private encodingType;
    /**
     * Gets a value indicating whether to write a Unicode byte order mark.
     * @returns {boolean} True to specify that a Unicode byte order mark is written; otherwise, false.
     */
    readonly includeBom: boolean;
    /**
     * Gets the encoding type.
     * @returns {EncodingType} The current encoding type.
     */
    /**
    * Sets the encoding type.
    * @param {EncodingType} value - The encoding type to set.
    */
    type: EncodingType;
    /**
     * Initializes a new instance of the Encoding class. A parameter specifies whether to write a Unicode byte order mark.
     * @param {boolean} [includeBom] - True to specify that a Unicode byte order mark is written; otherwise, false.
     */
    constructor(includeBom?: boolean);
    /**
     * Initialize the includeBom to emit BOM or not.
     * @param {boolean} includeBom - Indicates whether to emit a BOM.
     * @returns {void} Nothing is returned.
     */
    private initBOM;
    /**
     * Calculates the number of bytes produced by encoding the characters in the specified string
     * @param  {string} chars - The string containing the set of characters to encode
     * @returns {number} - The number of bytes produced by encoding the specified characters
     */
    getByteCount(chars: string): number;
    /**
     * Returns the number of bytes required to represent a character in UTF-8.
     * @param {number} codePoint - The Unicode code point of the character.
     * @returns {number} The number of bytes needed for the given code point.
     */
    private utf8Len;
    /**
     * Determines if the given code unit is a high surrogate.
     * For 4-byte characters, returns true; otherwise, false.
     * @param {number} codeUnit - The Unicode code unit to check.
     * @returns {boolean} True if the code unit is a high surrogate; otherwise, false.
     */
    private isHighSurrogate;
    /**
     * Generates the code point from a surrogate pair for a 4-byte character.
     * @param {number} highCodeUnit - The high surrogate code unit.
     * @param {number} lowCodeUnit - The low surrogate code unit.
     * @returns {number} The combined Unicode code point.
     */
    private toCodepoint;
    /**
     * Gets the byte count for a specific range of characters.
     * @param {string} chars - The string containing characters.
     * @param {number} charIndex - The starting index of the character range.
     * @param {number} charCount - The number of characters to process.
     * @returns {number} The total byte count for the specified characters.
     */
    private getByteCountInternal;
    /**
     * Encodes a set of characters from the specified string into the ArrayBuffer.
     * @param {string} s - The string containing the set of characters to encode.
     * @param {number} charIndex - The index of the first character to encode.
     * @param {number} charCount - The number of characters to encode.
     * @returns {ArrayBuffer} The ArrayBuffer that contains the resulting sequence of bytes.
     */
    getBytes(s: string, charIndex: number, charCount: number): ArrayBuffer;
    /**
     * Decodes a sequence of bytes from the specified ArrayBuffer into a string.
     * @param {ArrayBuffer} bytes - The ArrayBuffer containing the sequence of bytes to decode.
     * @param {number} index - The index of the first byte to decode.
     * @param {number} count - The number of bytes to decode.
     * @returns {string} The string that contains the resulting set of characters.
     */
    getString(bytes: ArrayBuffer, index: number, count: number): string;
    private getBytesOfAnsiEncoding;
    private getBytesOfUtf8Encoding;
    private getBytesOfUnicodeEncoding;
    private getStringOfUtf8Encoding;
    private getStringofUnicodeEncoding;
    /**
     * Clears the encoding instance.
     * @returns {void} Nothing is returned.
     */
    destroy(): void;
}
/**
 * EncodingType : Specifies the encoding type
 */
export declare type EncodingType = 
/**
 * Specifies the Ansi encoding
 */
'Ansi' | 
/**
 * Specifies the utf8 encoding
 */
'Utf8' | 
/**
 * Specifies the Unicode encoding
 */
'Unicode';
/**
 * Checks if the object is null or undefined and throws an error if it is.
 * @param {Object} value - The object to check.
 * @param {string} message - The name or description of the argument for error reporting.
 * @returns {void} Nothing is returned; an error is thrown if validation fails.
 * @throws {Error} If the value is null or undefined.
 * @private
 */
export declare function validateNullOrUndefined(value: Object, message: string): void;

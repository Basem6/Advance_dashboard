/**
 * Save class provide method to save file
 * ```typescript
 * let blob : Blob = new Blob([''], { type: 'text/plain' });
 * Save.save('fileName.txt',blob);
 */
export declare class Save {
    static isMicrosoftBrowser: boolean;
    /**
     * Initialize new instance of {save}
     */
    constructor();
    /**
     * Saves the file with the specified name and sends it to the client browser.
     * @param {string} fileName - The file name to save.
     * @param {Blob} buffer - The content to write in the file.
     * @param {boolean} isMicrosoftBrowser - Specifies whether the browser is Microsoft.
     * @returns {void} Nothing is returned.
     */
    static save(fileName: string, buffer: Blob): void;
    private static saveInternal;
    /**
     * Gets the MIME type for the specified file extension.
     * @param {string} extension - The file extension to check.
     * @returns {string} The MIME type corresponding to the given extension.
     * @private
     */
    static getMimeType(extension: string): string;
}

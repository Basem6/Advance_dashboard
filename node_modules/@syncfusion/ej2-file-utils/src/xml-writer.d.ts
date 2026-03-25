/**
 * specifies current write state of XmlWriter
 */
export declare type XmlWriteState = 'Initial' | 'StartDocument' | 'EndDocument' | 'StartElement' | 'EndElement' | 'ElementContent';
/**
 * specifies namespace kind
 */
export declare type NamespaceKind = 'Written' | 'NeedToWrite' | 'Implied' | 'Special';
/**
 * XmlWriter class provide method to create XML data
 */
export declare class XmlWriter {
    private bufferText;
    private bufferBlob;
    private currentState;
    private namespaceStack;
    private elementStack;
    private contentPos;
    private attributeStack;
    /**
     * Gets the content written to the XmlWriter as a Blob.
     * @returns {Blob} The Blob containing the written content.
     */
    readonly buffer: Blob;
    /**
     * Initialize new instance of {XmlWriter}
     */
    constructor();
    /**
     * Writes a processing instruction with a space between the name and text.
     * @param {string} name - The name of the processing instruction.
     * @param {string} text - The text to write in the processing instruction.
     * @returns {void} Nothing is returned.
     * @throws {ArgumentException} If the name is invalid.
     * @throws {InvalidArgumentException} If the text is invalid.
     * @throws {InvalidOperationException} If the operation cannot be performed.
     */
    writeProcessingInstruction(name: string, text: string): void;
    /**
     * Writes the XML declaration with version and standalone attribute.
     * @param {boolean} standalone - If true, writes `standalone="yes"`, otherwise `standalone="no"`.
     * @returns {void} Nothing is returned.
     * @throws {InvalidOperation} If the XML declaration cannot be written in the current state.
     */
    writeStartDocument(standalone?: boolean): void;
    /**
     * Closes any open tag or attribute and writes the state back to start.
     *
     * @returns {void} This function does not return a value.
     */
    writeEndDocument(): void;
    /**
     * Writes the specified start tag and associates it with the given namespace and prefix.
     * @param {string} prefix - The namespace prefix of the element.
     * @param {string} localName - The local name of the element.
     * @param {string} namespace - The namespace URI associated with the element.
     * @returns {void} Nothing is returned.
     * @throws {ArgumentException} If any argument is invalid.
     * @throws {InvalidOperationException} If the operation cannot be performed in the current state.
     */
    writeStartElement(prefix: string, localName: string, namespace: string): void;
    /**
     * Closes one element and pops the corresponding namespace scope.
     * @returns {void} Nothing is returned.
     */
    writeEndElement(): void;
    /**
     * Writes an element with the specified prefix, local name, namespace URI, and value.
     * @param {string} prefix - The namespace prefix of the element.
     * @param {string} localName - The local name of the element.
     * @param {string} namespace - The namespace URI associated with the element.
     * @param {string} value - The value of the element.
     * @returns {void} Nothing is returned.
     */
    writeElementString(prefix: string, localName: string, namespace: string, value: string): void;
    /**
     * Writes out the attribute with the specified prefix, local name, namespace URI, and value.
     * @param {string} prefix - Namespace prefix of element.
     * @param {string} localName - Local name of element.
     * @param {string} namespace - Namespace URI associated with element.
     * @param {string} value - Value of element.
     * @returns {void} This function does not return a value.
     */
    writeAttributeString(prefix: string, localName: string, namespace: string, value: string): void;
    /**
     * Writes the given text content.
     * @param {string} text - Text to write.
     * @throws {InvalidOperationException} If the operation is invalid.
     * @returns {void} This function does not return a value.
     */
    writeString(text: string): void;
    /**
     * Write given text as raw data.
     * @param {string} text - Text to write.
     * @throws {InvalidOperationException} If the operation is invalid.
     * @returns {void} This function does not return a value.
     */
    writeRaw(text: string): void;
    private writeInternal;
    /**
     * Saves the file with the specified name and sends the file to the client browser.
     * @param {string} fileName - File name.
     * @returns {void} This function does not return a value.
     */
    save(fileName: string): void;
    /**
     * Releases the resources used by XmlWriter.
     * @returns {void} This function does not return a value.
     */
    destroy(): void;
    private flush;
    private writeProcessingInstructionInternal;
    private writeStartAttribute;
    private writeStartAttributePrefixAndNameSpace;
    private writeStartAttributeSpecialAttribute;
    private writeEndAttribute;
    private writeStartElementInternal;
    private writeEndElementInternal;
    private writeStartAttributeInternal;
    private writeNamespaceDeclaration;
    private writeStartNamespaceDeclaration;
    private writeStringInternal;
    private startElementContent;
    private rawText;
    private addNamespace;
    private lookupPrefix;
    private lookupNamespace;
    private lookupNamespaceIndex;
    private pushNamespaceImplicit;
    private pushNamespaceExplicit;
    private addAttribute;
    private skipPushAndWrite;
    private checkName;
}
/**
 * class for managing namespace collection
 */
export declare class Namespace {
    /**
     * specifies namespace's prefix
     */
    prefix: string;
    /**
     * specifies namespace URI
     */
    namespaceUri: string;
    /**
     * specifies namespace kind
     */
    kind: NamespaceKind;
    /**
     * Sets value for the current namespace instance.
     * @param {string} prefix - Namespace prefix.
     * @param {string} namespaceUri - Namespace URI.
     * @param {string} kind - Namespace kind.
     * @returns {void} This function does not return a value.
     */
    set(prefix: string, namespaceUri: string, kind: NamespaceKind): void;
    /**
     * Releases the resources used by Namespace.
     * @returns {void} This function does not return a value.
     */
    destroy(): void;
}
/**
 * class for managing element collection
 */
export declare class XmlElement {
    /**
     * specifies previous namespace top
     */
    previousTop: number;
    /**
     * specifies element prefix
     */
    prefix: string;
    /**
     * specifies element localName
     */
    localName: string;
    /**
     * specified namespace URI
     */
    namespaceUri: string;
    /**
     * Sets the value of the current element.
     * @param {string} prefix - Element prefix.
     * @param {string} localName - Element local name.
     * @param {string} namespaceUri - Namespace URI.
     * @param {string} previousTop - Previous namespace top.
     * @returns {void} This function does not return a value.
     */
    set(prefix: string, localName: string, namespaceUri: string, previousTop: number): void;
    /**
     * Releases the resources used by XmlElement.
     * @returns {void} This function does not return a value.
     */
    destroy(): void;
}
/**
 * class for managing attribute collection
 */
export declare class XmlAttribute {
    /**
     * specifies namespace's prefix
     */
    prefix: string;
    /**
     * specifies namespace URI
     */
    namespaceUri: string;
    /**
     * specifies attribute local name
     */
    localName: string;
    /**
     * Sets the value of the current attribute.
     * @param {string} prefix - Namespace prefix.
     * @param {string} localName - Attribute local name.
     * @param {string} namespaceUri - Namespace URI.
     * @returns {void} This function does not return a value.
     */
    set(prefix: string, localName: string, namespaceUri: string): void;
    /**
     * Gets whether the attribute is duplicate or not.
     * @param {string} prefix - Namespace prefix.
     * @param {string} localName - Attribute local name.
     * @param {string} namespaceUri - Namespace URI.
     * @returns {boolean} True if the attribute is duplicate; otherwise, false.
     */
    isDuplicate(prefix: string, localName: string, namespaceUri: string): boolean;
    /**
     * Releases the resources used by XmlAttribute
     * @returns {void}
     */
    destroy(): void;
}

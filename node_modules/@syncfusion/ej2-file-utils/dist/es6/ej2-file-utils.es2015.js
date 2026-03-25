/**
 * Save class provide method to save file
 * ```typescript
 * let blob : Blob = new Blob([''], { type: 'text/plain' });
 * Save.save('fileName.txt',blob);
 */
class Save {
    /**
     * Initialize new instance of {save}
     */
    constructor() {
        // tslint:disable
    }
    /**
     * Saves the file with the specified name and sends it to the client browser.
     * @param {string} fileName - The file name to save.
     * @param {Blob} buffer - The content to write in the file.
     * @param {boolean} isMicrosoftBrowser - Specifies whether the browser is Microsoft.
     * @returns {void} Nothing is returned.
     */
    static save(fileName, buffer) {
        if (fileName === null || fileName === undefined || fileName === '') {
            throw new Error('ArgumentException: fileName cannot be undefined, null or empty');
        }
        const extension = fileName.substring(fileName.lastIndexOf('.') + 1, fileName.length);
        const mimeType = this.getMimeType(extension);
        if (mimeType !== '') {
            buffer = new Blob([buffer], { type: mimeType });
        }
        if (this.isMicrosoftBrowser) {
            navigator.msSaveBlob(buffer, fileName);
        }
        else {
            const downloadLink = document.createElementNS('http://www.w3.org/1999/xhtml', 'a');
            this.saveInternal(fileName, extension, buffer, downloadLink, 'download' in downloadLink);
        }
    }
    static saveInternal(fileName, extension, buffer, downloadLink, hasDownloadAttribute) {
        if (hasDownloadAttribute) {
            downloadLink.download = fileName;
            let dataUrl = window.URL.createObjectURL(buffer);
            downloadLink.href = dataUrl;
            const event = document.createEvent('MouseEvent');
            event.initEvent('click', true, true);
            downloadLink.dispatchEvent(event);
            setTimeout(() => {
                window.URL.revokeObjectURL(dataUrl);
                dataUrl = undefined;
            });
        }
        else {
            if (extension !== 'docx' && extension !== 'xlsx') {
                const url = window.URL.createObjectURL(buffer);
                const isPopupBlocked = window.open(url, '_blank');
                if (!isPopupBlocked) {
                    window.location.href = url;
                }
            }
            else {
                const reader = new FileReader();
                reader.onloadend = () => {
                    const isPopupBlocked = window.open(reader.result, '_blank');
                    if (!isPopupBlocked) {
                        window.location.href = reader.result;
                    }
                };
                reader.readAsDataURL(buffer);
            }
        }
    }
    /**
     * Gets the MIME type for the specified file extension.
     * @param {string} extension - The file extension to check.
     * @returns {string} The MIME type corresponding to the given extension.
     * @private
     */
    static getMimeType(extension) {
        let mimeType = '';
        switch (extension) {
            case 'html':
                mimeType = 'text/html';
                break;
            case 'pdf':
                mimeType = 'application/pdf';
                break;
            case 'docx':
                mimeType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
                break;
            case 'xlsx':
                mimeType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
                break;
            case 'txt':
                mimeType = 'text/plain';
                break;
        }
        return mimeType;
    }
}

/**
 * XmlWriter class provide method to create XML data
 */
class XmlWriter {
    /**
     * Initialize new instance of {XmlWriter}
     */
    constructor() {
        this.contentPos = 0;
        this.bufferText = '';
        this.bufferBlob = new Blob([''], { type: 'text/plain' });
        this.currentState = 'Initial';
        this.namespaceStack = [];
        this.namespaceStack.push(new Namespace());
        this.namespaceStack[0].set('xmlns', 'http://www.w3.org/2000/xmlns/', 'Special');
        this.namespaceStack.push(new Namespace());
        this.namespaceStack[1].set('xml', 'http://www.w3.org/XML/1998/namespace', 'Special');
        this.namespaceStack.push(new Namespace());
        this.namespaceStack[2].set('', '', 'Implied');
        this.elementStack = [];
        this.elementStack.push(new XmlElement());
        this.elementStack[0].set('', '', '', this.namespaceStack.length - 1);
        this.attributeStack = [];
        Save.isMicrosoftBrowser = !(!navigator.msSaveBlob);
    }
    /**
     * Gets the content written to the XmlWriter as a Blob.
     * @returns {Blob} The Blob containing the written content.
     */
    get buffer() {
        this.flush();
        return this.bufferBlob;
    }
    /**
     * Writes a processing instruction with a space between the name and text.
     * @param {string} name - The name of the processing instruction.
     * @param {string} text - The text to write in the processing instruction.
     * @returns {void} Nothing is returned.
     * @throws {ArgumentException} If the name is invalid.
     * @throws {InvalidArgumentException} If the text is invalid.
     * @throws {InvalidOperationException} If the operation cannot be performed.
     */
    writeProcessingInstruction(name, text) {
        if (name === undefined || name === null || name.length === 0) {
            throw new Error('ArgumentException: name should not be undefined, null or empty');
        }
        this.checkName(name);
        if (text === undefined || text === null) {
            text = '';
        }
        if (name.length === 3 && name === 'xml') {
            if (this.currentState !== 'Initial') {
                // tslint:disable-next-line:max-line-length
                throw new Error('InvalidArgumentException: Cannot write XML declaration.WriteStartDocument method has already written it');
            }
        }
        if (this.currentState !== 'Initial' || this.bufferBlob === undefined) {
            throw new Error('InvalidOperationException: Wrong Token');
        }
        else {
            this.writeStartDocument();
            this.writeProcessingInstructionInternal(name, text);
        }
    }
    /**
     * Writes the XML declaration with version and standalone attribute.
     * @param {boolean} standalone - If true, writes `standalone="yes"`, otherwise `standalone="no"`.
     * @returns {void} Nothing is returned.
     * @throws {InvalidOperation} If the XML declaration cannot be written in the current state.
     */
    writeStartDocument(standalone) {
        if (this.currentState !== 'Initial' || this.bufferBlob === undefined) {
            throw new Error('InvalidOperationException: Wrong Token');
        }
        this.currentState = 'StartDocument';
        this.rawText('<?xml version="1.0" encoding="utf-8');
        if (standalone !== null && standalone !== undefined) {
            this.rawText('" standalone="');
            this.rawText(standalone ? 'yes' : 'no');
        }
        this.rawText('"?>');
    }
    /**
     * Closes any open tag or attribute and writes the state back to start.
     *
     * @returns {void} This function does not return a value.
     */
    writeEndDocument() {
        while (this.elementStack.length - 1 > 0) {
            this.writeEndElement();
        }
        this.currentState = 'EndDocument';
        this.flush();
    }
    /**
     * Writes the specified start tag and associates it with the given namespace and prefix.
     * @param {string} prefix - The namespace prefix of the element.
     * @param {string} localName - The local name of the element.
     * @param {string} namespace - The namespace URI associated with the element.
     * @returns {void} Nothing is returned.
     * @throws {ArgumentException} If any argument is invalid.
     * @throws {InvalidOperationException} If the operation cannot be performed in the current state.
     */
    writeStartElement(prefix, localName, namespace) {
        if (this.bufferBlob === undefined) {
            throw new Error('InvalidOperationException: Wrong Token');
        }
        if (localName === undefined || localName === null || localName.length === 0) {
            throw new Error('ArgumentException: localName cannot be undefined, null or empty');
        }
        this.checkName(localName);
        if (this.currentState === 'Initial') {
            this.writeStartDocument();
        }
        if (this.currentState === 'StartElement') {
            this.startElementContent();
        }
        this.currentState = 'StartElement';
        if (prefix === undefined || prefix === null) {
            if (namespace !== undefined && namespace !== null) {
                prefix = this.lookupPrefix(namespace);
            }
            if (prefix === undefined || prefix === null) {
                prefix = '';
            }
        }
        else if (prefix.length > 0) {
            if (namespace === undefined || namespace === null) {
                namespace = this.lookupNamespace(prefix);
            }
            if (namespace === undefined || namespace === null || (namespace !== undefined && namespace.length === 0)) {
                throw new Error('ArgumentException: Cannot use a prefix with an empty namespace');
            }
        }
        if (namespace === undefined || namespace === null) {
            namespace = this.lookupNamespace(prefix);
        }
        this.writeStartElementInternal(prefix, localName, namespace);
    }
    /**
     * Closes one element and pops the corresponding namespace scope.
     * @returns {void} Nothing is returned.
     */
    writeEndElement() {
        if (this.currentState === 'StartElement') {
            this.startElementContent();
            this.currentState = 'ElementContent';
        }
        else if (this.currentState === 'ElementContent') {
            this.currentState = 'ElementContent';
        }
        this.currentState = 'EndElement';
        const top = this.elementStack.length - 1;
        this.writeEndElementInternal(this.elementStack[top].prefix, this.elementStack[top].localName); // eslint-disable-line security/detect-object-injection
        this.namespaceStack.splice(this.elementStack[top].previousTop + 1); // eslint-disable-line security/detect-object-injection
        this.elementStack.splice(top);
        if (this.bufferText.length > 10240) {
            this.flush();
        }
    }
    /**
     * Writes an element with the specified prefix, local name, namespace URI, and value.
     * @param {string} prefix - The namespace prefix of the element.
     * @param {string} localName - The local name of the element.
     * @param {string} namespace - The namespace URI associated with the element.
     * @param {string} value - The value of the element.
     * @returns {void} Nothing is returned.
     */
    writeElementString(prefix, localName, namespace, value) {
        this.writeStartElement(prefix, localName, namespace);
        if (value !== undefined && value !== null && value.length !== 0) {
            this.writeString(value);
        }
        this.writeEndElement();
    }
    /**
     * Writes out the attribute with the specified prefix, local name, namespace URI, and value.
     * @param {string} prefix - Namespace prefix of element.
     * @param {string} localName - Local name of element.
     * @param {string} namespace - Namespace URI associated with element.
     * @param {string} value - Value of element.
     * @returns {void} This function does not return a value.
     */
    writeAttributeString(prefix, localName, namespace, value) {
        this.writeStartAttribute(prefix, localName, namespace, value);
        this.writeStringInternal(value, true);
        this.writeEndAttribute();
    }
    /**
     * Writes the given text content.
     * @param {string} text - Text to write.
     * @throws {InvalidOperationException} If the operation is invalid.
     * @returns {void} This function does not return a value.
     */
    writeString(text) {
        this.writeInternal(text, false);
    }
    /**
     * Write given text as raw data.
     * @param {string} text - Text to write.
     * @throws {InvalidOperationException} If the operation is invalid.
     * @returns {void} This function does not return a value.
     */
    writeRaw(text) {
        this.writeInternal(text, true);
    }
    writeInternal(text, isRawString) {
        if (text === undefined || text === null) {
            return;
        }
        else {
            if (this.currentState !== 'StartElement' && this.currentState !== 'ElementContent') {
                throw new Error('InvalidOperationException: Wrong Token');
            }
            if (this.currentState === 'StartElement') {
                this.startElementContent();
            }
            this.currentState = 'ElementContent';
            if (isRawString) {
                this.rawText(text);
            }
            else {
                this.writeStringInternal(text, false);
            }
        }
    }
    /**
     * Saves the file with the specified name and sends the file to the client browser.
     * @param {string} fileName - File name.
     * @returns {void} This function does not return a value.
     */
    save(fileName) {
        while (this.elementStack.length - 1 > 0) {
            this.writeEndElement();
        }
        if (this.bufferText !== '') {
            this.flush();
        }
        Save.save(fileName, this.buffer);
    }
    /**
     * Releases the resources used by XmlWriter.
     * @returns {void} This function does not return a value.
     */
    destroy() {
        this.bufferBlob = undefined;
        for (const ns of this.namespaceStack) {
            ns.destroy();
        }
        this.namespaceStack = [];
        for (const el of this.elementStack) {
            el.destroy();
        }
        this.elementStack = [];
        this.bufferText = '';
        this.contentPos = 0;
    }
    flush() {
        if (this.bufferBlob === undefined) {
            return;
        }
        this.bufferBlob = new Blob([this.bufferBlob, this.bufferText], { type: 'text/plain' });
        this.bufferText = '';
    }
    writeProcessingInstructionInternal(name, text) {
        this.bufferText += '<?';
        this.rawText(name);
        if (text.length > 0) {
            this.bufferText += ' ';
            text = text.replace(/\?\>/g, '? >'); // eslint-disable-line no-useless-escape
            this.bufferText += text;
        }
        this.bufferText += '?';
        this.bufferText += '>';
    }
    writeStartAttribute(prefix, localName, namespace, value) {
        if (localName === undefined || localName === null || localName.length === 0) {
            if (prefix === 'xmlns') {
                localName = 'xmlns';
                prefix = '';
            }
            else {
                throw new Error('ArgumentException: localName cannot be undefined, null or empty');
            }
        }
        if (this.currentState !== 'StartElement') {
            throw new Error('InvalidOperationException: Wrong Token');
        }
        this.checkName(localName);
        this.writeStartAttributePrefixAndNameSpace(prefix, localName, namespace, value);
    }
    writeStartAttributePrefixAndNameSpace(prefix, localName, namespace, value) {
        if (prefix === undefined || prefix === null) {
            if (namespace !== undefined && namespace !== null) {
                if (!(localName === 'xmlns' && namespace === 'http://www.w3.org/2000/xmlns/')) {
                    prefix = this.lookupPrefix(namespace);
                }
            }
            if (prefix === undefined || prefix === null) {
                prefix = '';
            }
        }
        if (namespace === undefined || namespace === null) {
            if (prefix !== undefined && prefix !== null && prefix.length > 0) {
                namespace = this.lookupNamespace(prefix);
            }
            if (namespace === undefined || namespace === null) {
                namespace = '';
            }
        }
        this.writeStartAttributeSpecialAttribute(prefix, localName, namespace, value);
    }
    writeStartAttributeSpecialAttribute(prefix, localName, namespace, value) {
        if (prefix.length === 0) {
            if (localName[0] === 'x' && localName === 'xmlns') {
                this.skipPushAndWrite(prefix, localName, namespace);
                this.pushNamespaceExplicit('', value);
                return;
            }
            else if (namespace.length > 0) {
                prefix = this.lookupPrefix(namespace);
            }
        }
        else {
            if (prefix[0] === 'x') {
                if (prefix === 'xmlns') {
                    this.skipPushAndWrite(prefix, localName, namespace);
                    this.pushNamespaceExplicit(localName, value);
                    return;
                }
                else if (prefix === 'xml') {
                    if (localName === 'space' || localName === 'lang') {
                        this.skipPushAndWrite(prefix, localName, namespace);
                        return;
                    }
                }
            }
            if (namespace.length === 0) {
                prefix = '';
            }
        }
        if (prefix !== undefined && prefix !== null && prefix.length !== 0) {
            this.pushNamespaceImplicit(prefix, namespace);
        }
        this.skipPushAndWrite(prefix, localName, namespace);
    }
    writeEndAttribute() {
        this.currentState = 'StartElement';
        this.bufferText += '"';
    }
    writeStartElementInternal(prefix, localName, namespace) {
        this.bufferText += '<';
        if (prefix.length > 0) {
            this.rawText(prefix);
            this.bufferText += ':';
        }
        this.rawText(localName);
        const top = this.elementStack.length;
        this.elementStack.push(new XmlElement());
        this.elementStack[top].set(prefix, localName, namespace, this.namespaceStack.length - 1); // eslint-disable-line security/detect-object-injection
        this.pushNamespaceImplicit(prefix, namespace);
        for (const attr of this.attributeStack) {
            attr.destroy();
        }
        this.attributeStack = [];
    }
    writeEndElementInternal(prefix, localName) {
        if (this.contentPos !== this.bufferText.length + 1) {
            this.bufferText += '</';
            if (prefix !== undefined && prefix !== null && prefix.length !== 0) {
                this.rawText(prefix);
                this.bufferText += ':';
            }
            this.rawText(localName);
            this.bufferText += '>';
        }
        else {
            this.bufferText = this.bufferText.substring(0, this.bufferText.length - 1);
            this.bufferText += ' />';
        }
    }
    writeStartAttributeInternal(prefix, localName, namespaceName) {
        this.bufferText += ' ';
        if (prefix !== undefined && prefix !== null && prefix.length > 0) {
            this.rawText(prefix);
            this.bufferText += ':';
        }
        this.rawText(localName);
        this.bufferText += '=';
        this.bufferText += '"';
    }
    writeNamespaceDeclaration(prefix, namespaceUri) {
        this.writeStartNamespaceDeclaration(prefix);
        this.writeStringInternal(namespaceUri, true);
        this.bufferText += '"';
    }
    writeStartNamespaceDeclaration(prefix) {
        if (prefix === undefined || prefix === null || prefix.length === 0) {
            this.rawText(' xmlns=\"'); // eslint-disable-line no-useless-escape
        }
        else {
            this.rawText(' xmlns:');
            this.rawText(prefix);
            this.bufferText += '=';
            this.bufferText += '"';
        }
    }
    writeStringInternal(text, inAttributeValue) {
        if (text === null || text === undefined) {
            text = '';
        }
        text = text.replace(/\&/g, '&amp;'); // eslint-disable-line no-useless-escape
        text = text.replace(/\</g, '&lt;'); // eslint-disable-line no-useless-escape
        text = text.replace(/\>/g, '&gt;'); // eslint-disable-line no-useless-escape
        if (inAttributeValue) {
            text = text.replace(/\"/g, '&quot;'); // eslint-disable-line no-useless-escape
        }
        this.bufferText += text;
        if (!inAttributeValue) {
            this.contentPos = 0;
        }
    }
    startElementContent() {
        const start = this.elementStack[this.elementStack.length - 1].previousTop;
        for (let i = this.namespaceStack.length - 1; i > start; i--) {
            if (this.namespaceStack[i].kind === 'NeedToWrite') { // eslint-disable-line security/detect-object-injection
                this.writeNamespaceDeclaration(this.namespaceStack[i].prefix, this.namespaceStack[i].namespaceUri); // eslint-disable-line security/detect-object-injection
            }
        }
        this.bufferText += '>';
        this.contentPos = this.bufferText.length + 1;
    }
    rawText(text) {
        this.bufferText += text;
    }
    addNamespace(prefix, ns, kind) {
        const top = this.namespaceStack.length;
        this.namespaceStack.push(new Namespace());
        this.namespaceStack[top].set(prefix, ns, kind); // eslint-disable-line security/detect-object-injection
    }
    lookupPrefix(namespace) {
        for (let i = this.namespaceStack.length - 1; i >= 0; i--) {
            if (this.namespaceStack[i].namespaceUri === namespace) { // eslint-disable-line security/detect-object-injection
                return this.namespaceStack[i].prefix; // eslint-disable-line security/detect-object-injection
            }
        }
        return undefined;
    }
    lookupNamespace(prefix) {
        for (let i = this.namespaceStack.length - 1; i >= 0; i--) {
            if (this.namespaceStack[i].prefix === prefix) { // eslint-disable-line security/detect-object-injection
                return this.namespaceStack[i].namespaceUri; // eslint-disable-line security/detect-object-injection
            }
        }
        return undefined;
    }
    lookupNamespaceIndex(prefix) {
        for (let i = this.namespaceStack.length - 1; i >= 0; i--) {
            if (this.namespaceStack[i].prefix === prefix) { // eslint-disable-line security/detect-object-injection
                return i;
            }
        }
        return -1;
    }
    pushNamespaceImplicit(prefix, ns) {
        let kind;
        const existingNsIndex = this.lookupNamespaceIndex(prefix);
        if (existingNsIndex !== -1) {
            if (existingNsIndex > this.elementStack[this.elementStack.length - 1].previousTop) {
                if (this.namespaceStack[existingNsIndex].namespaceUri !== ns) { // eslint-disable-line security/detect-object-injection
                    throw new Error('XmlException namespace Uri needs to be the same as the one that is already declared');
                }
                return;
            }
            else {
                if (this.namespaceStack[existingNsIndex].kind === 'Special') { // eslint-disable-line security/detect-object-injection
                    if (prefix === 'xml') {
                        if (ns !== this.namespaceStack[existingNsIndex].namespaceUri) { // eslint-disable-line security/detect-object-injection
                            throw new Error('InvalidArgumentException: Xml String');
                        }
                        else {
                            kind = 'Implied';
                        }
                    }
                    else {
                        throw new Error('InvalidArgumentException: Prefix "xmlns" is reserved for use by XML.');
                    }
                }
                else {
                    kind = (this.namespaceStack[existingNsIndex].namespaceUri === ns) ? 'Implied' : 'NeedToWrite'; // eslint-disable-line security/detect-object-injection
                }
            }
        }
        else {
            if ((ns === 'http://www.w3.org/XML/1998/namespace' && prefix !== 'xml') ||
                (ns === 'http://www.w3.org/2000/xmlns/' && prefix !== 'xmlns')) {
                throw new Error('InvalidArgumentException');
            }
            kind = 'NeedToWrite';
        }
        this.addNamespace(prefix, ns, kind);
    }
    pushNamespaceExplicit(prefix, ns) {
        const existingNsIndex = this.lookupNamespaceIndex(prefix);
        if (existingNsIndex !== -1) {
            if (existingNsIndex > this.elementStack[this.elementStack.length - 1].previousTop) {
                this.namespaceStack[existingNsIndex].kind = 'Written'; // eslint-disable-line security/detect-object-injection
                return;
            }
        }
        this.addNamespace(prefix, ns, 'Written');
        return;
    }
    addAttribute(prefix, localName, namespaceName) {
        const top = this.attributeStack.length;
        this.attributeStack.push(new XmlAttribute());
        this.attributeStack[top].set(prefix, localName, namespaceName); // eslint-disable-line security/detect-object-injection
        for (let i = 0; i < top; i++) {
            if (this.attributeStack[i].isDuplicate(prefix, localName, namespaceName)) { // eslint-disable-line security/detect-object-injection
                throw new Error('XmlException: duplicate attribute name');
            }
        }
    }
    skipPushAndWrite(prefix, localName, namespace) {
        this.addAttribute(prefix, localName, namespace);
        this.writeStartAttributeInternal(prefix, localName, namespace);
    }
    checkName(text) {
        const format = /[ !@#$%^&*()+\=\[\]{};':"\\|,<>\/?]/; // eslint-disable-line no-useless-escape
        if (format.test(text)) {
            throw new Error('InvalidArgumentException: invalid name character');
        }
    }
}
/**
 * class for managing namespace collection
 */
class Namespace {
    /**
     * Sets value for the current namespace instance.
     * @param {string} prefix - Namespace prefix.
     * @param {string} namespaceUri - Namespace URI.
     * @param {string} kind - Namespace kind.
     * @returns {void} This function does not return a value.
     */
    set(prefix, namespaceUri, kind) {
        this.prefix = prefix;
        this.namespaceUri = namespaceUri;
        this.kind = kind;
    }
    /**
     * Releases the resources used by Namespace.
     * @returns {void} This function does not return a value.
     */
    destroy() {
        this.prefix = undefined;
        this.namespaceUri = undefined;
        this.kind = undefined;
    }
}
/**
 * class for managing element collection
 */
class XmlElement {
    /**
     * Sets the value of the current element.
     * @param {string} prefix - Element prefix.
     * @param {string} localName - Element local name.
     * @param {string} namespaceUri - Namespace URI.
     * @param {string} previousTop - Previous namespace top.
     * @returns {void} This function does not return a value.
     */
    set(prefix, localName, namespaceUri, previousTop) {
        this.previousTop = previousTop;
        this.prefix = prefix;
        this.namespaceUri = namespaceUri;
        this.localName = localName;
    }
    /**
     * Releases the resources used by XmlElement.
     * @returns {void} This function does not return a value.
     */
    destroy() {
        this.previousTop = undefined;
        this.prefix = undefined;
        this.localName = undefined;
        this.namespaceUri = undefined;
    }
}
/**
 * class for managing attribute collection
 */
class XmlAttribute {
    /**
     * Sets the value of the current attribute.
     * @param {string} prefix - Namespace prefix.
     * @param {string} localName - Attribute local name.
     * @param {string} namespaceUri - Namespace URI.
     * @returns {void} This function does not return a value.
     */
    set(prefix, localName, namespaceUri) {
        this.prefix = prefix;
        this.namespaceUri = namespaceUri;
        this.localName = localName;
    }
    /**
     * Gets whether the attribute is duplicate or not.
     * @param {string} prefix - Namespace prefix.
     * @param {string} localName - Attribute local name.
     * @param {string} namespaceUri - Namespace URI.
     * @returns {boolean} True if the attribute is duplicate; otherwise, false.
     */
    isDuplicate(prefix, localName, namespaceUri) {
        return ((this.localName === localName) && ((this.prefix === prefix) || (this.namespaceUri === namespaceUri)));
    }
    /**
     * Releases the resources used by XmlAttribute
     * @returns {void}
     */
    destroy() {
        this.prefix = undefined;
        this.namespaceUri = undefined;
        this.localName = undefined;
    }
}

/**
 * Encoding class: Contains the details about encoding type, whether to write a Unicode byte order mark (BOM).
 * ```typescript
 * let encoding : Encoding = new Encoding();
 * encoding.type = 'Utf8';
 * encoding.getBytes('Encoding', 0, 5);
 * ```
 */
class Encoding {
    /**
     * Initializes a new instance of the Encoding class. A parameter specifies whether to write a Unicode byte order mark.
     * @param {boolean} [includeBom] - True to specify that a Unicode byte order mark is written; otherwise, false.
     */
    constructor(includeBom) {
        this.emitBOM = true;
        this.encodingType = 'Ansi';
        this.initBOM(includeBom);
    }
    /**
     * Gets a value indicating whether to write a Unicode byte order mark.
     * @returns {boolean} True to specify that a Unicode byte order mark is written; otherwise, false.
     */
    get includeBom() {
        return this.emitBOM;
    }
    /**
     * Gets the encoding type.
     * @returns {EncodingType} The current encoding type.
     */
    get type() {
        return this.encodingType;
    }
    /**
     * Sets the encoding type.
     * @param {EncodingType} value - The encoding type to set.
     */
    set type(value) {
        this.encodingType = value;
    }
    /**
     * Initialize the includeBom to emit BOM or not.
     * @param {boolean} includeBom - Indicates whether to emit a BOM.
     * @returns {void} Nothing is returned.
     */
    initBOM(includeBom) {
        if (includeBom === undefined || includeBom === null) {
            this.emitBOM = true;
        }
        else {
            this.emitBOM = includeBom;
        }
    }
    /**
     * Calculates the number of bytes produced by encoding the characters in the specified string
     * @param  {string} chars - The string containing the set of characters to encode
     * @returns {number} - The number of bytes produced by encoding the specified characters
     */
    getByteCount(chars) {
        validateNullOrUndefined(chars, 'string');
        if (chars === '') {
            const byte = this.utf8Len(chars.charCodeAt(0));
            return byte;
        }
        if (this.type === null || this.type === undefined) {
            this.type = 'Ansi';
        }
        return this.getByteCountInternal(chars, 0, chars.length);
    }
    /**
     * Returns the number of bytes required to represent a character in UTF-8.
     * @param {number} codePoint - The Unicode code point of the character.
     * @returns {number} The number of bytes needed for the given code point.
     */
    utf8Len(codePoint) {
        const bytes = codePoint <= 0x7F ? 1 :
            codePoint <= 0x7FF ? 2 :
                codePoint <= 0xFFFF ? 3 :
                    codePoint <= 0x1FFFFF ? 4 : 0;
        return bytes;
    }
    /**
     * Determines if the given code unit is a high surrogate.
     * For 4-byte characters, returns true; otherwise, false.
     * @param {number} codeUnit - The Unicode code unit to check.
     * @returns {boolean} True if the code unit is a high surrogate; otherwise, false.
     */
    isHighSurrogate(codeUnit) {
        return codeUnit >= 0xD800 && codeUnit <= 0xDBFF;
    }
    /**
     * Generates the code point from a surrogate pair for a 4-byte character.
     * @param {number} highCodeUnit - The high surrogate code unit.
     * @param {number} lowCodeUnit - The low surrogate code unit.
     * @returns {number} The combined Unicode code point.
     */
    toCodepoint(highCodeUnit, lowCodeUnit) {
        highCodeUnit = (0x3FF & highCodeUnit) << 10;
        const u = highCodeUnit | (0x3FF & lowCodeUnit);
        return u + 0x10000;
    }
    /**
     * Gets the byte count for a specific range of characters.
     * @param {string} chars - The string containing characters.
     * @param {number} charIndex - The starting index of the character range.
     * @param {number} charCount - The number of characters to process.
     * @returns {number} The total byte count for the specified characters.
     */
    getByteCountInternal(chars, charIndex, charCount) {
        let byteCount = 0;
        if (this.encodingType === 'Utf8' || this.encodingType === 'Unicode') {
            const isUtf8 = this.encodingType === 'Utf8';
            for (let i = 0; i < charCount; i++) {
                const charCode = chars.charCodeAt(isUtf8 ? charIndex : charIndex++);
                if (this.isHighSurrogate(charCode)) {
                    if (isUtf8) {
                        const high = charCode;
                        const low = chars.charCodeAt(++charIndex);
                        byteCount += this.utf8Len(this.toCodepoint(high, low));
                    }
                    else {
                        byteCount += 4;
                        ++i;
                    }
                }
                else {
                    if (isUtf8) {
                        byteCount += this.utf8Len(charCode);
                    }
                    else {
                        byteCount += 2;
                    }
                }
                if (isUtf8) {
                    charIndex++;
                }
            }
            return byteCount;
        }
        else {
            byteCount = charCount;
            return byteCount;
        }
    }
    /**
     * Encodes a set of characters from the specified string into the ArrayBuffer.
     * @param {string} s - The string containing the set of characters to encode.
     * @param {number} charIndex - The index of the first character to encode.
     * @param {number} charCount - The number of characters to encode.
     * @returns {ArrayBuffer} The ArrayBuffer that contains the resulting sequence of bytes.
     */
    getBytes(s, charIndex, charCount) {
        validateNullOrUndefined(s, 'string');
        validateNullOrUndefined(charIndex, 'charIndex');
        validateNullOrUndefined(charCount, 'charCount');
        if (charIndex < 0 || charCount < 0) {
            throw new RangeError('Argument Out Of Range Exception: charIndex or charCount is less than zero');
        }
        if (s.length - charIndex < charCount) {
            throw new RangeError('Argument Out Of Range Exception: charIndex and charCount do not denote a valid range in string');
        }
        let bytes;
        if (s === '') {
            bytes = new ArrayBuffer(0);
            return bytes;
        }
        if (this.type === null || this.type === undefined) {
            this.type = 'Ansi';
        }
        const byteCount = this.getByteCountInternal(s, charIndex, charCount);
        switch (this.type) {
            case 'Utf8':
                bytes = this.getBytesOfUtf8Encoding(byteCount, s, charIndex, charCount);
                return bytes;
            case 'Unicode':
                bytes = this.getBytesOfUnicodeEncoding(byteCount, s, charIndex, charCount);
                return bytes;
            default:
                bytes = this.getBytesOfAnsiEncoding(byteCount, s, charIndex, charCount);
                return bytes;
        }
    }
    /**
     * Decodes a sequence of bytes from the specified ArrayBuffer into a string.
     * @param {ArrayBuffer} bytes - The ArrayBuffer containing the sequence of bytes to decode.
     * @param {number} index - The index of the first byte to decode.
     * @param {number} count - The number of bytes to decode.
     * @returns {string} The string that contains the resulting set of characters.
     */
    getString(bytes, index, count) {
        validateNullOrUndefined(bytes, 'bytes');
        validateNullOrUndefined(index, 'index');
        validateNullOrUndefined(count, 'count');
        if (index < 0 || count < 0) {
            throw new RangeError('Argument Out Of Range Exception: index or count is less than zero');
        }
        if (bytes.byteLength - index < count) {
            throw new RangeError('Argument Out Of Range Exception: index and count do not denote a valid range in bytes');
        }
        if (bytes.byteLength === 0 || count === 0) {
            return '';
        }
        if (this.type === null || this.type === undefined) {
            this.type = 'Ansi';
        }
        let out = '';
        const byteCal = new Uint8Array(bytes);
        switch (this.type) {
            case 'Utf8': {
                const s = this.getStringOfUtf8Encoding(byteCal, index, count);
                return s;
            }
            case 'Unicode': {
                const byteUnicode = new Uint16Array(bytes);
                out = this.getStringofUnicodeEncoding(byteUnicode, index, count);
                return out;
            }
            default: {
                let j = index;
                // tslint:disable-next-line:typedef
                const arr = byteCal;
                for (let i = 0; i < count; i++) {
                    const c = arr[j]; // eslint-disable-line security/detect-object-injection
                    out += String.fromCharCode(c);
                    j++;
                }
                return out;
            }
        }
    }
    getBytesOfAnsiEncoding(byteCount, s, charIndex, charCount) {
        const bytes = new ArrayBuffer(byteCount);
        const bufview = new Uint8Array(bytes);
        let k = 0;
        for (let i = 0; i < charCount; i++) {
            const charcode = s.charCodeAt(charIndex++);
            if (charcode < 0x800) {
                bufview[k] = charcode; // eslint-disable-line security/detect-object-injection
            }
            else {
                bufview[k] = 63; // eslint-disable-line security/detect-object-injection
            }
            k++;
        }
        return bytes;
    }
    getBytesOfUtf8Encoding(byteCount, s, charIndex, charCount) {
        const bytes = new ArrayBuffer(byteCount);
        const uint = new Uint8Array(bytes);
        let index = charIndex;
        let j = 0;
        for (let i = 0; i < charCount; i++) {
            const charcode = s.charCodeAt(index);
            if (charcode <= 0x7F) { // 1 byte character 2^7
                uint[j] = charcode; // eslint-disable-line security/detect-object-injection
            }
            else if (charcode < 0x800) { // 2 byte character 2^11
                uint[j] = 0xc0 | (charcode >> 6); // eslint-disable-line security/detect-object-injection
                uint[++j] = 0x80 | (charcode & 0x3f);
            }
            else if ((charcode < 0xd800 || charcode >= 0xe000)) { // 3 byte character 2^16
                uint[j] = 0xe0 | (charcode >> 12); // eslint-disable-line security/detect-object-injection
                uint[++j] = 0x80 | ((charcode >> 6) & 0x3f);
                uint[++j] = 0x80 | (charcode & 0x3f);
            }
            else {
                uint[j] = 0xef; // eslint-disable-line security/detect-object-injection
                uint[++j] = 0xbf;
                uint[++j] = 0xbd; // U+FFFE "replacement character"
            }
            ++j;
            ++index;
        }
        return bytes;
    }
    getBytesOfUnicodeEncoding(byteCount, s, charIndex, charCount) {
        const bytes = new ArrayBuffer(byteCount);
        const uint16 = new Uint16Array(bytes);
        for (let i = 0; i < charCount; i++) {
            const charcode = s.charCodeAt(i);
            uint16[i] = charcode; // eslint-disable-line security/detect-object-injection
        }
        return bytes;
    }
    getStringOfUtf8Encoding(byteCal, index, count) {
        let j = 0;
        let i = index;
        let s = '';
        for (j; j < count; j++) {
            let c = byteCal[i++];
            while (i > byteCal.length) {
                return s;
            }
            if (c > 127) {
                if (c > 191 && c < 224 && i < count) {
                    c = (c & 31) << 6 | byteCal[i] & 63; // eslint-disable-line security/detect-object-injection
                }
                else if (c > 223 && c < 240 && i < byteCal.byteLength) {
                    c = (c & 15) << 12 | (byteCal[i] & 63) << 6 | byteCal[++i] & 63; // eslint-disable-line security/detect-object-injection
                }
                else if (c > 239 && c < 248 && i < byteCal.byteLength) {
                    c = (c & 7) << 18 | (byteCal[i] & 63) << 12 | (byteCal[++i] & 63) << 6 | byteCal[++i] & 63; // eslint-disable-line security/detect-object-injection
                }
                ++i;
            }
            s += String.fromCharCode(c); // 1 byte(ASCII) character
        }
        return s;
    }
    getStringofUnicodeEncoding(byteUni, index, count) {
        if (count > byteUni.length) {
            throw new RangeError('ArgumentOutOfRange_Count');
        }
        const byte16 = new Uint16Array(count);
        let out = '';
        for (let i = 0; i < count && i < byteUni.length; i++) {
            byte16[i] = byteUni[index++]; // eslint-disable-line security/detect-object-injection
        }
        out = String.fromCharCode.apply(null, byte16);
        return out;
    }
    /**
     * Clears the encoding instance.
     * @returns {void} Nothing is returned.
     */
    destroy() {
        this.emitBOM = undefined;
        this.encodingType = undefined;
    }
}
/**
 * Checks if the object is null or undefined and throws an error if it is.
 * @param {Object} value - The object to check.
 * @param {string} message - The name or description of the argument for error reporting.
 * @returns {void} Nothing is returned; an error is thrown if validation fails.
 * @throws {Error} If the value is null or undefined.
 * @private
 */
function validateNullOrUndefined(value, message) {
    if (value === null || value === undefined) {
        throw new Error('ArgumentException: ' + message + ' cannot be null or undefined');
    }
}

/**
 * StreamWriter class contains the implementation for writing characters to a file in a particular encoding
 * ```typescript
 * let writer = new StreamWriter();
 * writer.write('Hello World');
 * writer.save('Sample.txt');
 * writer.dispose();
 * ```
 */
class StreamWriter {
    /**
     * Gets the content written to the StreamWriter as a Blob.
     * @returns {Blob} The Blob containing the written content.
     */
    get buffer() {
        this.flush();
        return this.bufferBlob;
    }
    /**
     * Gets the encoding.
     * @returns {Encoding} The current encoding instance.
     */
    get encoding() {
        return this.enc;
    }
    /**
     * Initializes a new instance of the StreamWriter class by using the specified encoding.
     * @param {Encoding} [encoding] - The character encoding to use.
     */
    constructor(encoding) {
        this.bufferBlob = new Blob(['']);
        this.bufferText = '';
        this.init(encoding);
        Save.isMicrosoftBrowser = !(!navigator.msSaveBlob);
    }
    init(encoding) {
        if (encoding === null || encoding === undefined) {
            this.enc = new Encoding(false);
            this.enc.type = 'Utf8';
        }
        else {
            this.enc = encoding;
            this.setBomByte();
        }
    }
    /**
     * Sets the Byte Order Mark (BOM) value based on the EncodingType.
     * @returns {void} Nothing is returned.
     * @private
     */
    setBomByte() {
        if (this.encoding.includeBom) {
            switch (this.encoding.type) {
                case 'Unicode': {
                    const arrayUnicode = new ArrayBuffer(2);
                    const uint8 = new Uint8Array(arrayUnicode);
                    uint8[0] = 255;
                    uint8[1] = 254;
                    this.bufferBlob = new Blob([arrayUnicode]);
                    break;
                }
                case 'Utf8': {
                    const arrayUtf8 = new ArrayBuffer(3);
                    const utf8 = new Uint8Array(arrayUtf8);
                    utf8[0] = 239;
                    utf8[1] = 187;
                    utf8[2] = 191;
                    this.bufferBlob = new Blob([arrayUtf8]);
                    break;
                }
                default: {
                    this.bufferBlob = new Blob(['']);
                    break;
                }
            }
        }
    }
    /**
     * Saves the file with specified name and sends the file to client browser
     * @param  {string} fileName - The file name to save
     * @returns {void}
     */
    save(fileName) {
        if (this.bufferText !== '') {
            this.flush();
        }
        Save.save(fileName, this.buffer);
    }
    /**
     * Writes the specified string.
     * @param  {string} value - The string to write. If value is null or undefined, nothing is written.
     * @returns {void}
     */
    write(value) {
        if (this.encoding === undefined) {
            throw new Error('Object Disposed Exception: current writer is disposed');
        }
        validateNullOrUndefined(value, 'string');
        this.bufferText += value;
        if (this.bufferText.length >= 10240) {
            this.flush();
        }
    }
    flush() {
        if (this.bufferText === undefined || this.bufferText === null || this.bufferText.length === 0) {
            return;
        }
        const bufferArray = this.encoding.getBytes(this.bufferText, 0, this.bufferText.length);
        this.bufferText = '';
        this.bufferBlob = new Blob([this.bufferBlob, bufferArray]);
    }
    /**
     * Writes the specified string followed by a line terminator
     * @param  {string} value - The string to write. If value is null or undefined, nothing is written
     * @returns {void}
     */
    writeLine(value) {
        if (this.encoding === undefined) {
            throw new Error('Object Disposed Exception: current writer is disposed');
        }
        validateNullOrUndefined(value, 'string');
        this.bufferText = this.bufferText + value + '\r\n';
        if (this.bufferText.length >= 10240) {
            this.flush();
        }
    }
    /**
     * Releases the resources used by the StreamWriter
     * @returns {void}
     */
    destroy() {
        this.bufferBlob = undefined;
        this.bufferText = undefined;
        if (this.enc instanceof Encoding) {
            this.enc.destroy();
        }
        this.enc = undefined;
    }
}

export { Encoding, Namespace, Save, StreamWriter, XmlAttribute, XmlElement, XmlWriter, validateNullOrUndefined };
//# sourceMappingURL=ej2-file-utils.es2015.js.map

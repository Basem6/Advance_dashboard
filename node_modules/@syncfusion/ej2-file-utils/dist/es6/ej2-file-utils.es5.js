/**
 * Save class provide method to save file
 * ```typescript
 * let blob : Blob = new Blob([''], { type: 'text/plain' });
 * Save.save('fileName.txt',blob);
 */
var Save = /** @__PURE__ @class */ (function () {
    /**
     * Initialize new instance of {save}
     */
    function Save() {
        // tslint:disable
    }
    /**
     * Saves the file with the specified name and sends it to the client browser.
     * @param {string} fileName - The file name to save.
     * @param {Blob} buffer - The content to write in the file.
     * @param {boolean} isMicrosoftBrowser - Specifies whether the browser is Microsoft.
     * @returns {void} Nothing is returned.
     */
    Save.save = function (fileName, buffer) {
        if (fileName === null || fileName === undefined || fileName === '') {
            throw new Error('ArgumentException: fileName cannot be undefined, null or empty');
        }
        var extension = fileName.substring(fileName.lastIndexOf('.') + 1, fileName.length);
        var mimeType = this.getMimeType(extension);
        if (mimeType !== '') {
            buffer = new Blob([buffer], { type: mimeType });
        }
        if (this.isMicrosoftBrowser) {
            navigator.msSaveBlob(buffer, fileName);
        }
        else {
            var downloadLink = document.createElementNS('http://www.w3.org/1999/xhtml', 'a');
            this.saveInternal(fileName, extension, buffer, downloadLink, 'download' in downloadLink);
        }
    };
    Save.saveInternal = function (fileName, extension, buffer, downloadLink, hasDownloadAttribute) {
        if (hasDownloadAttribute) {
            downloadLink.download = fileName;
            var dataUrl_1 = window.URL.createObjectURL(buffer);
            downloadLink.href = dataUrl_1;
            var event_1 = document.createEvent('MouseEvent');
            event_1.initEvent('click', true, true);
            downloadLink.dispatchEvent(event_1);
            setTimeout(function () {
                window.URL.revokeObjectURL(dataUrl_1);
                dataUrl_1 = undefined;
            });
        }
        else {
            if (extension !== 'docx' && extension !== 'xlsx') {
                var url = window.URL.createObjectURL(buffer);
                var isPopupBlocked = window.open(url, '_blank');
                if (!isPopupBlocked) {
                    window.location.href = url;
                }
            }
            else {
                var reader_1 = new FileReader();
                reader_1.onloadend = function () {
                    var isPopupBlocked = window.open(reader_1.result, '_blank');
                    if (!isPopupBlocked) {
                        window.location.href = reader_1.result;
                    }
                };
                reader_1.readAsDataURL(buffer);
            }
        }
    };
    /**
     * Gets the MIME type for the specified file extension.
     * @param {string} extension - The file extension to check.
     * @returns {string} The MIME type corresponding to the given extension.
     * @private
     */
    Save.getMimeType = function (extension) {
        var mimeType = '';
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
    };
    return Save;
}());

/**
 * XmlWriter class provide method to create XML data
 */
var XmlWriter = /** @__PURE__ @class */ (function () {
    /**
     * Initialize new instance of {XmlWriter}
     */
    function XmlWriter() {
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
    Object.defineProperty(XmlWriter.prototype, "buffer", {
        /**
         * Gets the content written to the XmlWriter as a Blob.
         * @returns {Blob} The Blob containing the written content.
         */
        get: function () {
            this.flush();
            return this.bufferBlob;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Writes a processing instruction with a space between the name and text.
     * @param {string} name - The name of the processing instruction.
     * @param {string} text - The text to write in the processing instruction.
     * @returns {void} Nothing is returned.
     * @throws {ArgumentException} If the name is invalid.
     * @throws {InvalidArgumentException} If the text is invalid.
     * @throws {InvalidOperationException} If the operation cannot be performed.
     */
    XmlWriter.prototype.writeProcessingInstruction = function (name, text) {
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
    };
    /**
     * Writes the XML declaration with version and standalone attribute.
     * @param {boolean} standalone - If true, writes `standalone="yes"`, otherwise `standalone="no"`.
     * @returns {void} Nothing is returned.
     * @throws {InvalidOperation} If the XML declaration cannot be written in the current state.
     */
    XmlWriter.prototype.writeStartDocument = function (standalone) {
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
    };
    /**
     * Closes any open tag or attribute and writes the state back to start.
     *
     * @returns {void} This function does not return a value.
     */
    XmlWriter.prototype.writeEndDocument = function () {
        while (this.elementStack.length - 1 > 0) {
            this.writeEndElement();
        }
        this.currentState = 'EndDocument';
        this.flush();
    };
    /**
     * Writes the specified start tag and associates it with the given namespace and prefix.
     * @param {string} prefix - The namespace prefix of the element.
     * @param {string} localName - The local name of the element.
     * @param {string} namespace - The namespace URI associated with the element.
     * @returns {void} Nothing is returned.
     * @throws {ArgumentException} If any argument is invalid.
     * @throws {InvalidOperationException} If the operation cannot be performed in the current state.
     */
    XmlWriter.prototype.writeStartElement = function (prefix, localName, namespace) {
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
    };
    /**
     * Closes one element and pops the corresponding namespace scope.
     * @returns {void} Nothing is returned.
     */
    XmlWriter.prototype.writeEndElement = function () {
        if (this.currentState === 'StartElement') {
            this.startElementContent();
            this.currentState = 'ElementContent';
        }
        else if (this.currentState === 'ElementContent') {
            this.currentState = 'ElementContent';
        }
        this.currentState = 'EndElement';
        var top = this.elementStack.length - 1;
        this.writeEndElementInternal(this.elementStack[top].prefix, this.elementStack[top].localName); // eslint-disable-line security/detect-object-injection
        this.namespaceStack.splice(this.elementStack[top].previousTop + 1); // eslint-disable-line security/detect-object-injection
        this.elementStack.splice(top);
        if (this.bufferText.length > 10240) {
            this.flush();
        }
    };
    /**
     * Writes an element with the specified prefix, local name, namespace URI, and value.
     * @param {string} prefix - The namespace prefix of the element.
     * @param {string} localName - The local name of the element.
     * @param {string} namespace - The namespace URI associated with the element.
     * @param {string} value - The value of the element.
     * @returns {void} Nothing is returned.
     */
    XmlWriter.prototype.writeElementString = function (prefix, localName, namespace, value) {
        this.writeStartElement(prefix, localName, namespace);
        if (value !== undefined && value !== null && value.length !== 0) {
            this.writeString(value);
        }
        this.writeEndElement();
    };
    /**
     * Writes out the attribute with the specified prefix, local name, namespace URI, and value.
     * @param {string} prefix - Namespace prefix of element.
     * @param {string} localName - Local name of element.
     * @param {string} namespace - Namespace URI associated with element.
     * @param {string} value - Value of element.
     * @returns {void} This function does not return a value.
     */
    XmlWriter.prototype.writeAttributeString = function (prefix, localName, namespace, value) {
        this.writeStartAttribute(prefix, localName, namespace, value);
        this.writeStringInternal(value, true);
        this.writeEndAttribute();
    };
    /**
     * Writes the given text content.
     * @param {string} text - Text to write.
     * @throws {InvalidOperationException} If the operation is invalid.
     * @returns {void} This function does not return a value.
     */
    XmlWriter.prototype.writeString = function (text) {
        this.writeInternal(text, false);
    };
    /**
     * Write given text as raw data.
     * @param {string} text - Text to write.
     * @throws {InvalidOperationException} If the operation is invalid.
     * @returns {void} This function does not return a value.
     */
    XmlWriter.prototype.writeRaw = function (text) {
        this.writeInternal(text, true);
    };
    XmlWriter.prototype.writeInternal = function (text, isRawString) {
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
    };
    /**
     * Saves the file with the specified name and sends the file to the client browser.
     * @param {string} fileName - File name.
     * @returns {void} This function does not return a value.
     */
    XmlWriter.prototype.save = function (fileName) {
        while (this.elementStack.length - 1 > 0) {
            this.writeEndElement();
        }
        if (this.bufferText !== '') {
            this.flush();
        }
        Save.save(fileName, this.buffer);
    };
    /**
     * Releases the resources used by XmlWriter.
     * @returns {void} This function does not return a value.
     */
    XmlWriter.prototype.destroy = function () {
        this.bufferBlob = undefined;
        for (var _i = 0, _a = this.namespaceStack; _i < _a.length; _i++) {
            var ns = _a[_i];
            ns.destroy();
        }
        this.namespaceStack = [];
        for (var _b = 0, _c = this.elementStack; _b < _c.length; _b++) {
            var el = _c[_b];
            el.destroy();
        }
        this.elementStack = [];
        this.bufferText = '';
        this.contentPos = 0;
    };
    XmlWriter.prototype.flush = function () {
        if (this.bufferBlob === undefined) {
            return;
        }
        this.bufferBlob = new Blob([this.bufferBlob, this.bufferText], { type: 'text/plain' });
        this.bufferText = '';
    };
    XmlWriter.prototype.writeProcessingInstructionInternal = function (name, text) {
        this.bufferText += '<?';
        this.rawText(name);
        if (text.length > 0) {
            this.bufferText += ' ';
            text = text.replace(/\?\>/g, '? >'); // eslint-disable-line no-useless-escape
            this.bufferText += text;
        }
        this.bufferText += '?';
        this.bufferText += '>';
    };
    XmlWriter.prototype.writeStartAttribute = function (prefix, localName, namespace, value) {
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
    };
    XmlWriter.prototype.writeStartAttributePrefixAndNameSpace = function (prefix, localName, namespace, value) {
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
    };
    XmlWriter.prototype.writeStartAttributeSpecialAttribute = function (prefix, localName, namespace, value) {
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
    };
    XmlWriter.prototype.writeEndAttribute = function () {
        this.currentState = 'StartElement';
        this.bufferText += '"';
    };
    XmlWriter.prototype.writeStartElementInternal = function (prefix, localName, namespace) {
        this.bufferText += '<';
        if (prefix.length > 0) {
            this.rawText(prefix);
            this.bufferText += ':';
        }
        this.rawText(localName);
        var top = this.elementStack.length;
        this.elementStack.push(new XmlElement());
        this.elementStack[top].set(prefix, localName, namespace, this.namespaceStack.length - 1); // eslint-disable-line security/detect-object-injection
        this.pushNamespaceImplicit(prefix, namespace);
        for (var _i = 0, _a = this.attributeStack; _i < _a.length; _i++) {
            var attr = _a[_i];
            attr.destroy();
        }
        this.attributeStack = [];
    };
    XmlWriter.prototype.writeEndElementInternal = function (prefix, localName) {
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
    };
    XmlWriter.prototype.writeStartAttributeInternal = function (prefix, localName, namespaceName) {
        this.bufferText += ' ';
        if (prefix !== undefined && prefix !== null && prefix.length > 0) {
            this.rawText(prefix);
            this.bufferText += ':';
        }
        this.rawText(localName);
        this.bufferText += '=';
        this.bufferText += '"';
    };
    XmlWriter.prototype.writeNamespaceDeclaration = function (prefix, namespaceUri) {
        this.writeStartNamespaceDeclaration(prefix);
        this.writeStringInternal(namespaceUri, true);
        this.bufferText += '"';
    };
    XmlWriter.prototype.writeStartNamespaceDeclaration = function (prefix) {
        if (prefix === undefined || prefix === null || prefix.length === 0) {
            this.rawText(' xmlns=\"'); // eslint-disable-line no-useless-escape
        }
        else {
            this.rawText(' xmlns:');
            this.rawText(prefix);
            this.bufferText += '=';
            this.bufferText += '"';
        }
    };
    XmlWriter.prototype.writeStringInternal = function (text, inAttributeValue) {
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
    };
    XmlWriter.prototype.startElementContent = function () {
        var start = this.elementStack[this.elementStack.length - 1].previousTop;
        for (var i = this.namespaceStack.length - 1; i > start; i--) {
            if (this.namespaceStack[i].kind === 'NeedToWrite') { // eslint-disable-line security/detect-object-injection
                this.writeNamespaceDeclaration(this.namespaceStack[i].prefix, this.namespaceStack[i].namespaceUri); // eslint-disable-line security/detect-object-injection
            }
        }
        this.bufferText += '>';
        this.contentPos = this.bufferText.length + 1;
    };
    XmlWriter.prototype.rawText = function (text) {
        this.bufferText += text;
    };
    XmlWriter.prototype.addNamespace = function (prefix, ns, kind) {
        var top = this.namespaceStack.length;
        this.namespaceStack.push(new Namespace());
        this.namespaceStack[top].set(prefix, ns, kind); // eslint-disable-line security/detect-object-injection
    };
    XmlWriter.prototype.lookupPrefix = function (namespace) {
        for (var i = this.namespaceStack.length - 1; i >= 0; i--) {
            if (this.namespaceStack[i].namespaceUri === namespace) { // eslint-disable-line security/detect-object-injection
                return this.namespaceStack[i].prefix; // eslint-disable-line security/detect-object-injection
            }
        }
        return undefined;
    };
    XmlWriter.prototype.lookupNamespace = function (prefix) {
        for (var i = this.namespaceStack.length - 1; i >= 0; i--) {
            if (this.namespaceStack[i].prefix === prefix) { // eslint-disable-line security/detect-object-injection
                return this.namespaceStack[i].namespaceUri; // eslint-disable-line security/detect-object-injection
            }
        }
        return undefined;
    };
    XmlWriter.prototype.lookupNamespaceIndex = function (prefix) {
        for (var i = this.namespaceStack.length - 1; i >= 0; i--) {
            if (this.namespaceStack[i].prefix === prefix) { // eslint-disable-line security/detect-object-injection
                return i;
            }
        }
        return -1;
    };
    XmlWriter.prototype.pushNamespaceImplicit = function (prefix, ns) {
        var kind;
        var existingNsIndex = this.lookupNamespaceIndex(prefix);
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
    };
    XmlWriter.prototype.pushNamespaceExplicit = function (prefix, ns) {
        var existingNsIndex = this.lookupNamespaceIndex(prefix);
        if (existingNsIndex !== -1) {
            if (existingNsIndex > this.elementStack[this.elementStack.length - 1].previousTop) {
                this.namespaceStack[existingNsIndex].kind = 'Written'; // eslint-disable-line security/detect-object-injection
                return;
            }
        }
        this.addNamespace(prefix, ns, 'Written');
        return;
    };
    XmlWriter.prototype.addAttribute = function (prefix, localName, namespaceName) {
        var top = this.attributeStack.length;
        this.attributeStack.push(new XmlAttribute());
        this.attributeStack[top].set(prefix, localName, namespaceName); // eslint-disable-line security/detect-object-injection
        for (var i = 0; i < top; i++) {
            if (this.attributeStack[i].isDuplicate(prefix, localName, namespaceName)) { // eslint-disable-line security/detect-object-injection
                throw new Error('XmlException: duplicate attribute name');
            }
        }
    };
    XmlWriter.prototype.skipPushAndWrite = function (prefix, localName, namespace) {
        this.addAttribute(prefix, localName, namespace);
        this.writeStartAttributeInternal(prefix, localName, namespace);
    };
    XmlWriter.prototype.checkName = function (text) {
        var format = /[ !@#$%^&*()+\=\[\]{};':"\\|,<>\/?]/; // eslint-disable-line no-useless-escape
        if (format.test(text)) {
            throw new Error('InvalidArgumentException: invalid name character');
        }
    };
    return XmlWriter;
}());
/**
 * class for managing namespace collection
 */
var Namespace = /** @__PURE__ @class */ (function () {
    function Namespace() {
    }
    /**
     * Sets value for the current namespace instance.
     * @param {string} prefix - Namespace prefix.
     * @param {string} namespaceUri - Namespace URI.
     * @param {string} kind - Namespace kind.
     * @returns {void} This function does not return a value.
     */
    Namespace.prototype.set = function (prefix, namespaceUri, kind) {
        this.prefix = prefix;
        this.namespaceUri = namespaceUri;
        this.kind = kind;
    };
    /**
     * Releases the resources used by Namespace.
     * @returns {void} This function does not return a value.
     */
    Namespace.prototype.destroy = function () {
        this.prefix = undefined;
        this.namespaceUri = undefined;
        this.kind = undefined;
    };
    return Namespace;
}());
/**
 * class for managing element collection
 */
var XmlElement = /** @__PURE__ @class */ (function () {
    function XmlElement() {
    }
    /**
     * Sets the value of the current element.
     * @param {string} prefix - Element prefix.
     * @param {string} localName - Element local name.
     * @param {string} namespaceUri - Namespace URI.
     * @param {string} previousTop - Previous namespace top.
     * @returns {void} This function does not return a value.
     */
    XmlElement.prototype.set = function (prefix, localName, namespaceUri, previousTop) {
        this.previousTop = previousTop;
        this.prefix = prefix;
        this.namespaceUri = namespaceUri;
        this.localName = localName;
    };
    /**
     * Releases the resources used by XmlElement.
     * @returns {void} This function does not return a value.
     */
    XmlElement.prototype.destroy = function () {
        this.previousTop = undefined;
        this.prefix = undefined;
        this.localName = undefined;
        this.namespaceUri = undefined;
    };
    return XmlElement;
}());
/**
 * class for managing attribute collection
 */
var XmlAttribute = /** @__PURE__ @class */ (function () {
    function XmlAttribute() {
    }
    /**
     * Sets the value of the current attribute.
     * @param {string} prefix - Namespace prefix.
     * @param {string} localName - Attribute local name.
     * @param {string} namespaceUri - Namespace URI.
     * @returns {void} This function does not return a value.
     */
    XmlAttribute.prototype.set = function (prefix, localName, namespaceUri) {
        this.prefix = prefix;
        this.namespaceUri = namespaceUri;
        this.localName = localName;
    };
    /**
     * Gets whether the attribute is duplicate or not.
     * @param {string} prefix - Namespace prefix.
     * @param {string} localName - Attribute local name.
     * @param {string} namespaceUri - Namespace URI.
     * @returns {boolean} True if the attribute is duplicate; otherwise, false.
     */
    XmlAttribute.prototype.isDuplicate = function (prefix, localName, namespaceUri) {
        return ((this.localName === localName) && ((this.prefix === prefix) || (this.namespaceUri === namespaceUri)));
    };
    /**
     * Releases the resources used by XmlAttribute
     * @returns {void}
     */
    XmlAttribute.prototype.destroy = function () {
        this.prefix = undefined;
        this.namespaceUri = undefined;
        this.localName = undefined;
    };
    return XmlAttribute;
}());

/**
 * Encoding class: Contains the details about encoding type, whether to write a Unicode byte order mark (BOM).
 * ```typescript
 * let encoding : Encoding = new Encoding();
 * encoding.type = 'Utf8';
 * encoding.getBytes('Encoding', 0, 5);
 * ```
 */
var Encoding = /** @__PURE__ @class */ (function () {
    /**
     * Initializes a new instance of the Encoding class. A parameter specifies whether to write a Unicode byte order mark.
     * @param {boolean} [includeBom] - True to specify that a Unicode byte order mark is written; otherwise, false.
     */
    function Encoding(includeBom) {
        this.emitBOM = true;
        this.encodingType = 'Ansi';
        this.initBOM(includeBom);
    }
    Object.defineProperty(Encoding.prototype, "includeBom", {
        /**
         * Gets a value indicating whether to write a Unicode byte order mark.
         * @returns {boolean} True to specify that a Unicode byte order mark is written; otherwise, false.
         */
        get: function () {
            return this.emitBOM;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Encoding.prototype, "type", {
        /**
         * Gets the encoding type.
         * @returns {EncodingType} The current encoding type.
         */
        get: function () {
            return this.encodingType;
        },
        /**
         * Sets the encoding type.
         * @param {EncodingType} value - The encoding type to set.
         */
        set: function (value) {
            this.encodingType = value;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Initialize the includeBom to emit BOM or not.
     * @param {boolean} includeBom - Indicates whether to emit a BOM.
     * @returns {void} Nothing is returned.
     */
    Encoding.prototype.initBOM = function (includeBom) {
        if (includeBom === undefined || includeBom === null) {
            this.emitBOM = true;
        }
        else {
            this.emitBOM = includeBom;
        }
    };
    /**
     * Calculates the number of bytes produced by encoding the characters in the specified string
     * @param  {string} chars - The string containing the set of characters to encode
     * @returns {number} - The number of bytes produced by encoding the specified characters
     */
    Encoding.prototype.getByteCount = function (chars) {
        validateNullOrUndefined(chars, 'string');
        if (chars === '') {
            var byte = this.utf8Len(chars.charCodeAt(0));
            return byte;
        }
        if (this.type === null || this.type === undefined) {
            this.type = 'Ansi';
        }
        return this.getByteCountInternal(chars, 0, chars.length);
    };
    /**
     * Returns the number of bytes required to represent a character in UTF-8.
     * @param {number} codePoint - The Unicode code point of the character.
     * @returns {number} The number of bytes needed for the given code point.
     */
    Encoding.prototype.utf8Len = function (codePoint) {
        var bytes = codePoint <= 0x7F ? 1 :
            codePoint <= 0x7FF ? 2 :
                codePoint <= 0xFFFF ? 3 :
                    codePoint <= 0x1FFFFF ? 4 : 0;
        return bytes;
    };
    /**
     * Determines if the given code unit is a high surrogate.
     * For 4-byte characters, returns true; otherwise, false.
     * @param {number} codeUnit - The Unicode code unit to check.
     * @returns {boolean} True if the code unit is a high surrogate; otherwise, false.
     */
    Encoding.prototype.isHighSurrogate = function (codeUnit) {
        return codeUnit >= 0xD800 && codeUnit <= 0xDBFF;
    };
    /**
     * Generates the code point from a surrogate pair for a 4-byte character.
     * @param {number} highCodeUnit - The high surrogate code unit.
     * @param {number} lowCodeUnit - The low surrogate code unit.
     * @returns {number} The combined Unicode code point.
     */
    Encoding.prototype.toCodepoint = function (highCodeUnit, lowCodeUnit) {
        highCodeUnit = (0x3FF & highCodeUnit) << 10;
        var u = highCodeUnit | (0x3FF & lowCodeUnit);
        return u + 0x10000;
    };
    /**
     * Gets the byte count for a specific range of characters.
     * @param {string} chars - The string containing characters.
     * @param {number} charIndex - The starting index of the character range.
     * @param {number} charCount - The number of characters to process.
     * @returns {number} The total byte count for the specified characters.
     */
    Encoding.prototype.getByteCountInternal = function (chars, charIndex, charCount) {
        var byteCount = 0;
        if (this.encodingType === 'Utf8' || this.encodingType === 'Unicode') {
            var isUtf8 = this.encodingType === 'Utf8';
            for (var i = 0; i < charCount; i++) {
                var charCode = chars.charCodeAt(isUtf8 ? charIndex : charIndex++);
                if (this.isHighSurrogate(charCode)) {
                    if (isUtf8) {
                        var high = charCode;
                        var low = chars.charCodeAt(++charIndex);
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
    };
    /**
     * Encodes a set of characters from the specified string into the ArrayBuffer.
     * @param {string} s - The string containing the set of characters to encode.
     * @param {number} charIndex - The index of the first character to encode.
     * @param {number} charCount - The number of characters to encode.
     * @returns {ArrayBuffer} The ArrayBuffer that contains the resulting sequence of bytes.
     */
    Encoding.prototype.getBytes = function (s, charIndex, charCount) {
        validateNullOrUndefined(s, 'string');
        validateNullOrUndefined(charIndex, 'charIndex');
        validateNullOrUndefined(charCount, 'charCount');
        if (charIndex < 0 || charCount < 0) {
            throw new RangeError('Argument Out Of Range Exception: charIndex or charCount is less than zero');
        }
        if (s.length - charIndex < charCount) {
            throw new RangeError('Argument Out Of Range Exception: charIndex and charCount do not denote a valid range in string');
        }
        var bytes;
        if (s === '') {
            bytes = new ArrayBuffer(0);
            return bytes;
        }
        if (this.type === null || this.type === undefined) {
            this.type = 'Ansi';
        }
        var byteCount = this.getByteCountInternal(s, charIndex, charCount);
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
    };
    /**
     * Decodes a sequence of bytes from the specified ArrayBuffer into a string.
     * @param {ArrayBuffer} bytes - The ArrayBuffer containing the sequence of bytes to decode.
     * @param {number} index - The index of the first byte to decode.
     * @param {number} count - The number of bytes to decode.
     * @returns {string} The string that contains the resulting set of characters.
     */
    Encoding.prototype.getString = function (bytes, index, count) {
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
        var out = '';
        var byteCal = new Uint8Array(bytes);
        switch (this.type) {
            case 'Utf8': {
                var s = this.getStringOfUtf8Encoding(byteCal, index, count);
                return s;
            }
            case 'Unicode': {
                var byteUnicode = new Uint16Array(bytes);
                out = this.getStringofUnicodeEncoding(byteUnicode, index, count);
                return out;
            }
            default: {
                var j = index;
                // tslint:disable-next-line:typedef
                var arr = byteCal;
                for (var i = 0; i < count; i++) {
                    var c = arr[j]; // eslint-disable-line security/detect-object-injection
                    out += String.fromCharCode(c);
                    j++;
                }
                return out;
            }
        }
    };
    Encoding.prototype.getBytesOfAnsiEncoding = function (byteCount, s, charIndex, charCount) {
        var bytes = new ArrayBuffer(byteCount);
        var bufview = new Uint8Array(bytes);
        var k = 0;
        for (var i = 0; i < charCount; i++) {
            var charcode = s.charCodeAt(charIndex++);
            if (charcode < 0x800) {
                bufview[k] = charcode; // eslint-disable-line security/detect-object-injection
            }
            else {
                bufview[k] = 63; // eslint-disable-line security/detect-object-injection
            }
            k++;
        }
        return bytes;
    };
    Encoding.prototype.getBytesOfUtf8Encoding = function (byteCount, s, charIndex, charCount) {
        var bytes = new ArrayBuffer(byteCount);
        var uint = new Uint8Array(bytes);
        var index = charIndex;
        var j = 0;
        for (var i = 0; i < charCount; i++) {
            var charcode = s.charCodeAt(index);
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
    };
    Encoding.prototype.getBytesOfUnicodeEncoding = function (byteCount, s, charIndex, charCount) {
        var bytes = new ArrayBuffer(byteCount);
        var uint16 = new Uint16Array(bytes);
        for (var i = 0; i < charCount; i++) {
            var charcode = s.charCodeAt(i);
            uint16[i] = charcode; // eslint-disable-line security/detect-object-injection
        }
        return bytes;
    };
    Encoding.prototype.getStringOfUtf8Encoding = function (byteCal, index, count) {
        var j = 0;
        var i = index;
        var s = '';
        for (j; j < count; j++) {
            var c = byteCal[i++];
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
    };
    Encoding.prototype.getStringofUnicodeEncoding = function (byteUni, index, count) {
        if (count > byteUni.length) {
            throw new RangeError('ArgumentOutOfRange_Count');
        }
        var byte16 = new Uint16Array(count);
        var out = '';
        for (var i = 0; i < count && i < byteUni.length; i++) {
            byte16[i] = byteUni[index++]; // eslint-disable-line security/detect-object-injection
        }
        out = String.fromCharCode.apply(null, byte16);
        return out;
    };
    /**
     * Clears the encoding instance.
     * @returns {void} Nothing is returned.
     */
    Encoding.prototype.destroy = function () {
        this.emitBOM = undefined;
        this.encodingType = undefined;
    };
    return Encoding;
}());
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
var StreamWriter = /** @__PURE__ @class */ (function () {
    /**
     * Initializes a new instance of the StreamWriter class by using the specified encoding.
     * @param {Encoding} [encoding] - The character encoding to use.
     */
    function StreamWriter(encoding) {
        this.bufferBlob = new Blob(['']);
        this.bufferText = '';
        this.init(encoding);
        Save.isMicrosoftBrowser = !(!navigator.msSaveBlob);
    }
    Object.defineProperty(StreamWriter.prototype, "buffer", {
        /**
         * Gets the content written to the StreamWriter as a Blob.
         * @returns {Blob} The Blob containing the written content.
         */
        get: function () {
            this.flush();
            return this.bufferBlob;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(StreamWriter.prototype, "encoding", {
        /**
         * Gets the encoding.
         * @returns {Encoding} The current encoding instance.
         */
        get: function () {
            return this.enc;
        },
        enumerable: true,
        configurable: true
    });
    StreamWriter.prototype.init = function (encoding) {
        if (encoding === null || encoding === undefined) {
            this.enc = new Encoding(false);
            this.enc.type = 'Utf8';
        }
        else {
            this.enc = encoding;
            this.setBomByte();
        }
    };
    /**
     * Sets the Byte Order Mark (BOM) value based on the EncodingType.
     * @returns {void} Nothing is returned.
     * @private
     */
    StreamWriter.prototype.setBomByte = function () {
        if (this.encoding.includeBom) {
            switch (this.encoding.type) {
                case 'Unicode': {
                    var arrayUnicode = new ArrayBuffer(2);
                    var uint8 = new Uint8Array(arrayUnicode);
                    uint8[0] = 255;
                    uint8[1] = 254;
                    this.bufferBlob = new Blob([arrayUnicode]);
                    break;
                }
                case 'Utf8': {
                    var arrayUtf8 = new ArrayBuffer(3);
                    var utf8 = new Uint8Array(arrayUtf8);
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
    };
    /**
     * Saves the file with specified name and sends the file to client browser
     * @param  {string} fileName - The file name to save
     * @returns {void}
     */
    StreamWriter.prototype.save = function (fileName) {
        if (this.bufferText !== '') {
            this.flush();
        }
        Save.save(fileName, this.buffer);
    };
    /**
     * Writes the specified string.
     * @param  {string} value - The string to write. If value is null or undefined, nothing is written.
     * @returns {void}
     */
    StreamWriter.prototype.write = function (value) {
        if (this.encoding === undefined) {
            throw new Error('Object Disposed Exception: current writer is disposed');
        }
        validateNullOrUndefined(value, 'string');
        this.bufferText += value;
        if (this.bufferText.length >= 10240) {
            this.flush();
        }
    };
    StreamWriter.prototype.flush = function () {
        if (this.bufferText === undefined || this.bufferText === null || this.bufferText.length === 0) {
            return;
        }
        var bufferArray = this.encoding.getBytes(this.bufferText, 0, this.bufferText.length);
        this.bufferText = '';
        this.bufferBlob = new Blob([this.bufferBlob, bufferArray]);
    };
    /**
     * Writes the specified string followed by a line terminator
     * @param  {string} value - The string to write. If value is null or undefined, nothing is written
     * @returns {void}
     */
    StreamWriter.prototype.writeLine = function (value) {
        if (this.encoding === undefined) {
            throw new Error('Object Disposed Exception: current writer is disposed');
        }
        validateNullOrUndefined(value, 'string');
        this.bufferText = this.bufferText + value + '\r\n';
        if (this.bufferText.length >= 10240) {
            this.flush();
        }
    };
    /**
     * Releases the resources used by the StreamWriter
     * @returns {void}
     */
    StreamWriter.prototype.destroy = function () {
        this.bufferBlob = undefined;
        this.bufferText = undefined;
        if (this.enc instanceof Encoding) {
            this.enc.destroy();
        }
        this.enc = undefined;
    };
    return StreamWriter;
}());

export { Encoding, Namespace, Save, StreamWriter, XmlAttribute, XmlElement, XmlWriter, validateNullOrUndefined };
//# sourceMappingURL=ej2-file-utils.es5.js.map

import { Save } from './save';
/**
 * XmlWriter class provide method to create XML data
 */
var XmlWriter = /** @class */ (function () {
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
        var tempText = '';
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
export { XmlWriter };
/**
 * class for managing namespace collection
 */
var Namespace = /** @class */ (function () {
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
export { Namespace };
/**
 * class for managing element collection
 */
var XmlElement = /** @class */ (function () {
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
export { XmlElement };
/**
 * class for managing attribute collection
 */
var XmlAttribute = /** @class */ (function () {
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
export { XmlAttribute };

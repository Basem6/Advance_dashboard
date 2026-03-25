/**
 * Helper class for chunk buffer.
 * @private
 */
var _PdfChunkBuffer = /** @class */ (function () {
    /**
     * Initialize an instance of `_PdfChunkBuffer` class.
     * @private
     */
    function _PdfChunkBuffer(chunkSize) {
        if (chunkSize === void 0) { chunkSize = 1048576; }
        /**
         * Specifies the `chunks`.
         * @private
         */
        this.chunks = [];
        /**
         * Specifies the `offset`.
         * @private
         */
        this.offset = 0;
        /**
         * Specifies the `committed`.
         * @private
         */
        this.committed = 0;
        this.chunkSize = chunkSize;
        this.current = new Uint8Array(this.chunkSize);
        this.chunks.push(this.current);
    }
    Object.defineProperty(_PdfChunkBuffer.prototype, "length", {
        /**
         * Gets the `length`.
         * @private
         */
        get: function () {
            return this.committed + this.offset;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Grows the buffer by allocating a new chunk.
     * @private
     */
    _PdfChunkBuffer.prototype.grow = function () {
        this.committed += this.offset;
        this.current = new Uint8Array(this.chunkSize);
        this.chunks.push(this.current);
        this.offset = 0;
    };
    /**
     * Writes ASCII string as bytes (each charCodeAt masked to 0..255).
     * @private
     */
    _PdfChunkBuffer.prototype.writeAscii = function (str) {
        var idx = 0;
        while (idx < str.length) {
            if (this.offset >= this.current.byteLength) {
                this.grow();
            }
            var space = this.current.byteLength - this.offset;
            var toWrite = Math.min(space, str.length - idx);
            for (var i = 0; i < toWrite; i++) {
                this.current[this.offset + i] = str.charCodeAt(idx + i) & 0xFF;
            }
            this.offset += toWrite;
            idx += toWrite;
        }
    };
    /**
     * Converts to `Uint8Array`.
     * @private
     */
    _PdfChunkBuffer.prototype.toUint8Array = function () {
        var total = this.length;
        var out = new Uint8Array(total);
        var pos = 0;
        var lastIdx = this.chunks.length - 1;
        for (var i = 0; i <= lastIdx; i++) {
            var chunk = this.chunks[i];
            if (i === lastIdx) {
                out.set(chunk.subarray(0, this.offset), pos);
                pos += this.offset;
            }
            else {
                out.set(chunk, pos);
                pos += chunk.byteLength;
            }
        }
        return out;
    };
    /**
     * Destroys the array buffer.
     * @private
     */
    _PdfChunkBuffer.prototype.destroy = function () {
        this.chunks = [];
        this.current = undefined;
        this.offset = 0;
        this.committed = 0;
    };
    return _PdfChunkBuffer;
}());
export { _PdfChunkBuffer };
/**
 * Used to `write a string` into output file.
 * @private
 */
var PdfWriter = /** @class */ (function () {
    function PdfWriter(stream) {
        /**
         * Specifies the `byteCountForStreamWriter`.
         * @private
         */
        this.byteCountForStreamWriter = 0;
        this.streamWriter = stream;
    }
    Object.defineProperty(PdfWriter.prototype, "document", {
        /**
         * Gets and Sets the `document`.
         * @private
         */
        get: function () {
            return this.pdfDocument;
        },
        set: function (value) {
            this.pdfDocument = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PdfWriter.prototype, "position", {
        /**
         * Gets the `position`.
         * @private
         */
        get: function () {
            if (this.streamWriter instanceof PdfWriterHelper) {
                return this.streamWriter.buffer.size;
            }
            // For StreamWriter, we keep an internal count based on written characters
            return this.byteCountForStreamWriter;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PdfWriter.prototype, "length", {
        /**
         * Gets  the `length` of the stream'.
         * @private
         */
        get: function () {
            return this.position;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PdfWriter.prototype, "stream", {
        /**
         * Gets the `stream`.
         * @private
         */
        get: function () {
            return this.streamWriter;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * `Writes the specified data`.
     * @private
     */
    PdfWriter.prototype.write = function (data) {
        if (typeof data === 'number') {
            data = String.fromCharCode(data);
        }
        if (this.streamWriter instanceof PdfWriterHelper) {
            this.streamWriter.write(data);
        }
        else {
            this.streamWriter.write(data);
            this.byteCountForStreamWriter += data.length;
        }
    };
    return PdfWriter;
}());
export { PdfWriter };
/**
 * Helper class for PDF writer.
 * @private
 */
var PdfWriterHelper = /** @class */ (function () {
    /**
     * Initialize an instance of `PdfWriterHelper` class.
     * @private
     */
    function PdfWriterHelper(chunkSize) {
        if (chunkSize === void 0) { chunkSize = 1048576; }
        this.buffer = new PdfArrayBuffer(chunkSize);
    }
    /**
     * Writes the specified data.
     * @private
     */
    PdfWriterHelper.prototype.write = function (data) {
        this.buffer.write(data);
    };
    /**
     * Destroy the array buffer.
     * @private
     */
    PdfWriterHelper.prototype.destroy = function () {
        if (this.buffer) {
            this.buffer.destroy();
            this.buffer = undefined;
        }
    };
    return PdfWriterHelper;
}());
export { PdfWriterHelper };
/**
 * Helper class for PDF writer.
 * @private
 */
var PdfArrayBuffer = /** @class */ (function () {
    /**
     * Initialize an instance of `PdfArrayBuffer` class.
     * @private
     */
    function PdfArrayBuffer(chunkSize) {
        if (chunkSize === void 0) { chunkSize = 1048576; }
        this.buf = new _PdfChunkBuffer(chunkSize);
    }
    Object.defineProperty(PdfArrayBuffer.prototype, "size", {
        /**
         * Gets the `size`.
         * @private
         */
        get: function () {
            return this.buf.length;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Writes the specified data.
     * @private
     */
    PdfArrayBuffer.prototype.write = function (value) {
        this.buf.writeAscii(value);
    };
    /**
     * Converts to `Uint8Array`.
     * @private
     */
    PdfArrayBuffer.prototype.toUint8Array = function () {
        return this.buf.toUint8Array();
    };
    /**
     * Destroys the buffer.
     * @private
     */
    PdfArrayBuffer.prototype.destroy = function () {
        if (this.buf) {
            this.buf.destroy();
            this.buf = undefined;
        }
    };
    return PdfArrayBuffer;
}());
export { PdfArrayBuffer };

/**
 * @license crypto-ts
 * MIT license
 */

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
class Hex {
    /**
     * Converts a word array to a hex string.
     *
     * \@example
     *
     *     let hexString = Hex.stringify(wordArray);
     * @param {?} wordArray The word array.
     *
     * @return {?} The hex string.
     *
     */
    static stringify(wordArray) {
        // Convert
        const /** @type {?} */ hexChars = [];
        for (let /** @type {?} */ i = 0; i < wordArray.sigBytes; i++) {
            const /** @type {?} */ bite = (wordArray.words[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff;
            hexChars.push((bite >>> 4).toString(16));
            hexChars.push((bite & 0x0f).toString(16));
        }
        return hexChars.join('');
    }
    /**
     * Converts a hex string to a word array.
     *
     * \@example
     *
     *     let wordArray = Hex.parse(hexString);
     * @param {?} hexStr The hex string.
     *
     * @return {?} The word array.
     *
     */
    static parse(hexStr) {
        // Shortcut
        const /** @type {?} */ hexStrLength = hexStr.length;
        // Convert
        const /** @type {?} */ words = [];
        for (let /** @type {?} */ i = 0; i < hexStrLength; i += 2) {
            words[i >>> 3] |= parseInt(hexStr.substr(i, 2), 16) << (24 - (i % 8) * 4);
        }
        return new WordArray(words, hexStrLength / 2);
    }
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
class WordArray {
    /**
     * Creates a word array filled with random bytes.
     *
     * \@example
     *
     *     let wordArray = WordArray.random(16);
     * @param {?} nBytes The number of random bytes to generate.
     *
     * @return {?} The random word array.
     *
     */
    static random(nBytes) {
        const /** @type {?} */ words = [];
        const /** @type {?} */ r = (function (m_w) {
            let /** @type {?} */ m_z = 0x3ade68b1;
            const /** @type {?} */ mask = 0xffffffff;
            return function () {
                m_z = (0x9069 * (m_z & 0xFFFF) + (m_z >> 0x10)) & mask;
                m_w = (0x4650 * (m_w & 0xFFFF) + (m_w >> 0x10)) & mask;
                let /** @type {?} */ result = ((m_z << 0x10) + m_w) & mask;
                result /= 0x100000000;
                result += 0.5;
                return result * (Math.random() > .5 ? 1 : -1);
            };
        });
        for (let /** @type {?} */ i = 0, /** @type {?} */ rcache; i < nBytes; i += 4) {
            const /** @type {?} */ _r = r((rcache || Math.random()) * 0x100000000);
            rcache = _r() * 0x3ade67b7;
            words.push((_r() * 0x100000000) | 0);
        }
        return new WordArray(words, nBytes);
    }
    /**
     * Initializes a newly created word array.
     *
     * \@example
     *
     *     let wordArray = new WordArray();
     *     let wordArray = new WordArray([0x00010203, 0x04050607]);
     *     let wordArray = new WordArray([0x00010203, 0x04050607], 6);
     * @param {?=} words (Optional) An array of 32-bit words.
     * @param {?=} sigBytes (Optional) The number of significant bytes in the words.
     *
     */
    constructor(words, sigBytes) {
        this.words = words || [];
        if (sigBytes !== undefined) {
            this.sigBytes = sigBytes;
        }
        else {
            this.sigBytes = this.words.length * 4;
        }
    }
    /**
     * Converts this word array to a string.
     *
     * \@example
     *
     *     let string = wordArray + '';
     *     let string = wordArray.toString();
     *     let string = wordArray.toString(CryptoJS.enc.Utf8);
     * @param {?=} encoder (Optional) The encoding strategy to use. Default: CryptoJS.enc.Hex
     *
     * @return {?} The stringified word array.
     *
     */
    toString(encoder) {
        return (encoder || Hex).stringify(this);
    }
    /**
     * Concatenates a word array to this word array.
     *
     * \@example
     *
     *     wordArray1.concat(wordArray2);
     * @param {?} wordArray The word array to append.
     *
     * @return {?} This word array.
     *
     */
    concat(wordArray) {
        // Clamp excess bits
        this.clamp();
        // Concat
        if (this.sigBytes % 4) {
            // Copy one byte at a time
            for (let /** @type {?} */ i = 0; i < wordArray.sigBytes; i++) {
                const /** @type {?} */ thatByte = (wordArray.words[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff;
                this.words[(this.sigBytes + i) >>> 2] |= thatByte << (24 - ((this.sigBytes + i) % 4) * 8);
            }
        }
        else {
            // Copy one word at a time
            for (let /** @type {?} */ i = 0; i < wordArray.sigBytes; i += 4) {
                this.words[(this.sigBytes + i) >>> 2] = wordArray.words[i >>> 2];
            }
        }
        this.sigBytes += wordArray.sigBytes;
        // Chainable
        return this;
    }
    /**
     * Removes insignificant bits.
     *
     * \@example
     *
     *     wordArray.clamp();
     * @return {?}
     */
    clamp() {
        // Clamp
        this.words[this.sigBytes >>> 2] &= 0xffffffff << (32 - (this.sigBytes % 4) * 8);
        this.words.length = Math.ceil(this.sigBytes / 4);
    }
    /**
     * Creates a copy of this word array.
     *
     * \@example
     *
     *     let clone = wordArray.clone();
     * @return {?} The clone.
     *
     */
    clone() {
        return new WordArray(this.words.slice(0), this.sigBytes);
    }

    slice(start, end){
        // console.log("slice:", start, end, this.words.length);
        this.words = this.words.slice(start, end);
        this.sigBytes = this.words.length * 4;
    }
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
class Latin1 {
    /**
     * Converts a word array to a Latin1 string.
     *
     * \@example
     *
     *     let latin1String = Latin1.stringify(wordArray);
     * @param {?} wordArray The word array.
     *
     * @return {?} The Latin1 string.
     *
     */
    static stringify(wordArray) {
        // Convert
        const /** @type {?} */ latin1Chars = [];
        for (let /** @type {?} */ i = 0; i < wordArray.sigBytes; i++) {
            const /** @type {?} */ bite = (wordArray.words[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff;
            latin1Chars.push(String.fromCharCode(bite));
        }
        return latin1Chars.join('');
    }
    /**
     * Converts a Latin1 string to a word array.
     *
     * \@example
     *
     *     let wordArray = Latin1.parse(latin1String);
     * @param {?} latin1Str The Latin1 string.
     *
     * @return {?} The word array.
     *
     */
    static parse(latin1Str) {
        // Shortcut
        const /** @type {?} */ latin1StrLength = latin1Str.length;
        // Convert
        const /** @type {?} */ words = [];
        for (let /** @type {?} */ i = 0; i < latin1StrLength; i++) {
            words[i >>> 2] |= (latin1Str.charCodeAt(i) & 0xff) << (24 - (i % 4) * 8);
        }
        return new WordArray(words, latin1StrLength);
    }
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
class Utf8 {
    /**
     * Converts a word array to a UTF-8 string.
     *
     * \@example
     *
     *     let utf8String = Utf8.stringify(wordArray);
     * @param {?} wordArray The word array.
     *
     * @return {?} The UTF-8 string.
     *
     */
    static stringify(wordArray) {
        try {
            return decodeURIComponent(escape(Latin1.stringify(wordArray)));
        }
        catch (/** @type {?} */ e) {
            throw new Error('Malformed UTF-8 data');
        }
    }
    /**
     * Converts a UTF-8 string to a word array.
     *
     * \@example
     *
     *     let wordArray = Utf8.parse(utf8String);
     * @param {?} utf8Str The UTF-8 string.
     *
     * @return {?} The word array.
     *
     */
    static parse(utf8Str) {
        return Latin1.parse(unescape(encodeURIComponent(utf8Str)));
    }
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/**
 * @abstract
 */
class BufferedBlockAlgorithm {
    /**
     * @param {?=} cfg
     */
    constructor(cfg) {
        this._minBufferSize = 0;
        this.cfg = Object.assign({
            blockSize: 1
        }, cfg);
        // Initial values
        this._data = new WordArray();
        this._nDataBytes = 0;
    }
    /**
     * Resets this block algorithm's data buffer to its initial state.
     *
     * \@example
     *
     *     bufferedBlockAlgorithm.reset();
     * @return {?}
     */
    reset() {
        // Initial values
        this._data = new WordArray();
        this._nDataBytes = 0;
    }
    /**
     * Adds new data to this block algorithm's buffer.
     *
     * \@example
     *
     *     bufferedBlockAlgorithm._append('data');
     *     bufferedBlockAlgorithm._append(wordArray);
     * @param {?} data The data to append. Strings are converted to a WordArray using UTF-8.
     *
     * @return {?}
     */
    _append(data) {
        // Convert string to WordArray, else assume WordArray already
        if (typeof data === 'string') {
            data = Utf8.parse(data);
        }
        // Append
        this._data.concat(data);
        this._nDataBytes += data.sigBytes;
    }
    /**
     * Processes available data blocks.
     *
     * This method invokes _doProcessBlock(offset), which must be implemented by a concrete subtype.
     *
     * \@example
     *
     *     let processedData = bufferedBlockAlgorithm._process();
     *     let processedData = bufferedBlockAlgorithm._process(!!'flush');
     * @param {?=} doFlush Whether all blocks and partial blocks should be processed.
     *
     * @return {?} The processed data.
     *
     */
    _process(doFlush) {
        if (!this.cfg.blockSize) {
            throw new Error('missing blockSize in config');
        }
        // Shortcuts
        const /** @type {?} */ blockSizeBytes = this.cfg.blockSize * 4;
        // Count blocks ready
        let /** @type {?} */ nBlocksReady = this._data.sigBytes / blockSizeBytes;
        if (doFlush) {
            // Round up to include partial blocks
            nBlocksReady = Math.ceil(nBlocksReady);
        }
        else {
            // Round down to include only full blocks,
            // less the number of blocks that must remain in the buffer
            nBlocksReady = Math.max((nBlocksReady | 0) - this._minBufferSize, 0);
        }
        // Count words ready
        const /** @type {?} */ nWordsReady = nBlocksReady * this.cfg.blockSize;
        // Count bytes ready
        const /** @type {?} */ nBytesReady = Math.min(nWordsReady * 4, this._data.sigBytes);
        // Process blocks
        let /** @type {?} */ processedWords;
        if (nWordsReady) {
            for (let /** @type {?} */ offset = 0; offset < nWordsReady; offset += this.cfg.blockSize) {
                // Perform concrete-algorithm logic
                this._doProcessBlock(this._data.words, offset);
            }
            // Remove processed words
            processedWords = this._data.words.splice(0, nWordsReady);
            this._data.sigBytes -= nBytesReady;
        }
        // Return processed words
        return new WordArray(processedWords, nBytesReady);
    }
    /**
     * Creates a copy of this object.
     *
     * \@example
     *
     *     let clone = bufferedBlockAlgorithm.clone();
     * @return {?} The clone.
     *
     */
    clone() {
        const /** @type {?} */ clone = this.constructor();
        for (const /** @type {?} */ attr in this) {
            if (this.hasOwnProperty(attr)) {
                clone[attr] = this[attr];
            }
        }
        clone._data = this._data.clone();
        return clone;
    }
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
class Base {
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
class CipherParams extends Base {
    /**
     * Initializes a newly created cipher params object.
     *
     * \@example
     *
     *     let cipherParams = CipherParams.create({
     *         ciphertext: ciphertextWordArray,
     *         key: keyWordArray,
     *         iv: ivWordArray,
     *         salt: saltWordArray,
     *         algorithm: AESAlgorithm,
     *         mode: CBC,
     *         padding: PKCS7,
     *         blockSize: 4,
     *         formatter: OpenSSLFormatter
     *     });
     * @param {?} cipherParams An object with any of the possible cipher parameters.
     *
     */
    constructor(cipherParams) {
        super();
        this.ciphertext = cipherParams.ciphertext;
        this.key = cipherParams.key;
        this.iv = cipherParams.iv;
        this.salt = cipherParams.salt;
        this.algorithm = cipherParams.algorithm;
        this.mode = cipherParams.mode;
        this.padding = cipherParams.padding;
        this.blockSize = cipherParams.blockSize;
        this.formatter = cipherParams.formatter;
    }
    /**
     * @param {?} additionalParams
     * @return {?}
     */
    extend(additionalParams) {
        if (additionalParams.ciphertext !== undefined) {
            this.ciphertext = additionalParams.ciphertext;
        }
        if (additionalParams.key !== undefined) {
            this.key = additionalParams.key;
        }
        if (additionalParams.iv !== undefined) {
            this.iv = additionalParams.iv;
        }
        if (additionalParams.salt !== undefined) {
            this.salt = additionalParams.salt;
        }
        if (additionalParams.algorithm !== undefined) {
            this.algorithm = additionalParams.algorithm;
        }
        if (additionalParams.mode !== undefined) {
            this.mode = additionalParams.mode;
        }
        if (additionalParams.padding !== undefined) {
            this.padding = additionalParams.padding;
        }
        if (additionalParams.blockSize !== undefined) {
            this.blockSize = additionalParams.blockSize;
        }
        if (additionalParams.formatter !== undefined) {
            this.formatter = additionalParams.formatter;
        }
        return this;
    }
    /**
     * Converts this cipher params object to a string.
     *
     * @throws Error If neither the formatter nor the default formatter is set.
     *
     * \@example
     *
     *     let string = cipherParams + '';
     *     let string = cipherParams.toString();
     *     let string = cipherParams.toString(CryptoJS.format.OpenSSL);
     * @param {?=} formatter (Optional) The formatting strategy to use.
     *
     * @return {?} The stringified cipher params.
     *
     */
    toString(formatter) {
        if (formatter) {
            return formatter.stringify(this);
        }
        else if (this.formatter) {
            return this.formatter.stringify(this);
        }
        else {
            throw new Error('cipher needs a formatter to be able to convert the result into a string');
        }
    }
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
class Base64 {
    /**
     * Converts a word array to a Base64 string.
     *
     * \@example
     *
     *     let base64String = Base64.stringify(wordArray);
     * @param {?} wordArray The word array.
     *
     * @return {?} The Base64 string.
     *
     */
    static stringify(wordArray) {
        // Clamp excess bits
        wordArray.clamp();
        // Convert
        const /** @type {?} */ base64Chars = [];
        for (let /** @type {?} */ i = 0; i < wordArray.sigBytes; i += 3) {
            const /** @type {?} */ byte1 = (wordArray.words[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff;
            const /** @type {?} */ byte2 = (wordArray.words[(i + 1) >>> 2] >>> (24 - ((i + 1) % 4) * 8)) & 0xff;
            const /** @type {?} */ byte3 = (wordArray.words[(i + 2) >>> 2] >>> (24 - ((i + 2) % 4) * 8)) & 0xff;
            const /** @type {?} */ triplet = (byte1 << 16) | (byte2 << 8) | byte3;
            for (let /** @type {?} */ j = 0; (j < 4) && (i + j * 0.75 < wordArray.sigBytes); j++) {
                base64Chars.push(this._map.charAt((triplet >>> (6 * (3 - j))) & 0x3f));
            }
        }
        // Add padding
        const /** @type {?} */ paddingChar = this._map.charAt(64);
        if (paddingChar) {
            while (base64Chars.length % 4) {
                base64Chars.push(paddingChar);
            }
        }
        return base64Chars.join('');
    }
    /**
     * Converts a Base64 string to a word array.
     *
     * \@example
     *
     *     let wordArray = Base64.parse(base64String);
     * @param {?} base64Str The Base64 string.
     *
     * @return {?} The word array.
     *
     */
    static parse(base64Str) {
        // Shortcuts
        let /** @type {?} */ base64StrLength = base64Str.length;
        if (this._reverseMap === undefined) {
            this._reverseMap = [];
            for (let /** @type {?} */ j = 0; j < this._map.length; j++) {
                this._reverseMap[this._map.charCodeAt(j)] = j;
            }
        }
        // Ignore padding
        const /** @type {?} */ paddingChar = this._map.charAt(64);
        if (paddingChar) {
            const /** @type {?} */ paddingIndex = base64Str.indexOf(paddingChar);
            if (paddingIndex !== -1) {
                base64StrLength = paddingIndex;
            }
        }
        // Convert
        return this.parseLoop(base64Str, base64StrLength, this._reverseMap);
    }
    /**
     * @param {?} base64Str
     * @param {?} base64StrLength
     * @param {?} reverseMap
     * @return {?}
     */
    static parseLoop(base64Str, base64StrLength, reverseMap) {
        const /** @type {?} */ words = [];
        let /** @type {?} */ nBytes = 0;
        for (let /** @type {?} */ i = 0; i < base64StrLength; i++) {
            if (i % 4) {
                const /** @type {?} */ bits1 = reverseMap[base64Str.charCodeAt(i - 1)] << ((i % 4) * 2);
                const /** @type {?} */ bits2 = reverseMap[base64Str.charCodeAt(i)] >>> (6 - (i % 4) * 2);
                words[nBytes >>> 2] |= (bits1 | bits2) << (24 - (nBytes % 4) * 8);
                nBytes++;
            }
        }
        return new WordArray(words, nBytes);
    }
}
Base64._map = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
Base64._reverseMap = undefined;

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
class OpenSSL {
    /**
     * Converts a cipher params object to an OpenSSL-compatible string.
     *
     * \@example
     *
     *     let openSSLString = OpenSSLFormatter.stringify(cipherParams);
     * @param {?} cipherParams The cipher params object.
     *
     * @return {?} The OpenSSL-compatible string.
     *
     */
    static stringify(cipherParams) {
        if (!cipherParams.ciphertext) {
            throw new Error('missing ciphertext in params');
        }
        // Shortcuts
        const /** @type {?} */ ciphertext = cipherParams.ciphertext;
        const /** @type {?} */ salt = cipherParams.salt;
        // Format
        let /** @type {?} */ wordArray;
        if (salt) {
            if (typeof salt === 'string') {
                throw new Error('salt is expected to be a WordArray');
            }
            wordArray = (new WordArray([0x53616c74, 0x65645f5f])).concat(salt).concat(ciphertext);
        }
        else {
            wordArray = ciphertext;
        }
        return wordArray.toString(Base64);
    }
    /**
     * Converts an OpenSSL-compatible string to a cipher params object.
     *
     * \@example
     *
     *     let cipherParams = OpenSSLFormatter.parse(openSSLString);
     * @param {?} openSSLStr The OpenSSL-compatible string.
     *
     * @return {?} The cipher params object.
     *
     */
    static parse(openSSLStr) {
        // Parse base64
        const /** @type {?} */ ciphertext = Base64.parse(openSSLStr);
        // Test for salt
        let /** @type {?} */ salt;
        if (ciphertext.words[0] === 0x53616c74 && ciphertext.words[1] === 0x65645f5f) {
            // Extract salt
            salt = new WordArray(ciphertext.words.slice(2, 4));
            // Remove salt from ciphertext
            ciphertext.words.splice(0, 4);
            ciphertext.sigBytes -= 16;
        }
        return new CipherParams({ ciphertext: ciphertext, salt: salt });
    }
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
class SerializableCipher {
    /**
     * Encrypts a message.
     *
     * \@example
     *
     *     let ciphertextParams = SerializableCipher.encrypt(CryptoJS.algo.AES, message, key);
     *     let ciphertextParams = SerializableCipher.encrypt(CryptoJS.algo.AES, message, key, { iv: iv });
     *     let ciphertextParams = SerializableCipher.encrypt(CryptoJS.algo.AES, message, key, {
     *       iv: iv,
     *       format: CryptoJS.format.OpenSSL
     *     });
     * @param {?} cipher The cipher algorithm to use.
     * @param {?} message The message to encrypt.
     * @param {?} key The key.
     * @param {?=} cfg (Optional) The configuration options to use for this operation.
     *
     * @return {?} A cipher params object.
     *
     */
    static encrypt(cipher, message, key, cfg) {
        // Apply config defaults
        const /** @type {?} */ config = Object.assign({}, this.cfg, cfg);
        // Encrypt
        const /** @type {?} */ encryptor = cipher.createEncryptor(key, config);
        const /** @type {?} */ ciphertext = encryptor.finalize(message);
        // Create and return serializable cipher params
        return new CipherParams({
            ciphertext: ciphertext,
            key: key,
            iv: encryptor.cfg.iv,
            algorithm: cipher,
            mode: (/** @type {?} */ (encryptor.cfg)).mode,
            padding: (/** @type {?} */ (encryptor.cfg)).padding,
            blockSize: encryptor.cfg.blockSize,
            formatter: config.format
        });
    }
    /**
     * Decrypts serialized ciphertext.
     *
     * \@example
     *
     *     let plaintext = SerializableCipher.decrypt(
     *         AESAlgorithm,
     *         formattedCiphertext,
     *         key, {
     *             iv: iv,
     *             format: CryptoJS.format.OpenSSL
     *         }
     *     );
     *
     *     let plaintext = SerializableCipher.decrypt(
     *         AESAlgorithm,
     *         ciphertextParams,
     *         key, {
     *             iv: iv,
     *             format: CryptoJS.format.OpenSSL
     *         }
     *     );
     * @param {?} cipher The cipher algorithm to use.
     * @param {?} ciphertext The ciphertext to decrypt.
     * @param {?} key The key.
     * @param {?=} optionalCfg
     * @return {?} The plaintext.
     *
     */
    static decrypt(cipher, ciphertext, key, optionalCfg) {
        // Apply config defaults
        const /** @type {?} */ cfg = Object.assign({}, this.cfg, optionalCfg);
        if (!cfg.format) {
            throw new Error('could not determine format');
        }
        // Convert string to CipherParams
        ciphertext = this._parse(ciphertext, cfg.format);
        if (!ciphertext.ciphertext) {
            throw new Error('could not determine ciphertext');
        }
        // Decrypt
        const /** @type {?} */ plaintext = cipher.createDecryptor(key, cfg).finalize(ciphertext.ciphertext);
        return plaintext;
    }
    /**
     * Converts serialized ciphertext to CipherParams,
     * else assumed CipherParams already and returns ciphertext unchanged.
     *
     * \@example
     *
     *     var ciphertextParams = CryptoJS.lib.SerializableCipher._parse(ciphertextStringOrParams, format);
     * @param {?} ciphertext The ciphertext.
     * @param {?} format The formatting strategy to use to parse serialized ciphertext.
     *
     * @return {?} The unserialized ciphertext.
     *
     */
    static _parse(ciphertext, format) {
        if (typeof ciphertext === 'string') {
            return format.parse(ciphertext);
        }
        else {
            return ciphertext;
        }
    }
}
SerializableCipher.cfg = {
    blockSize: 4,
    iv: new WordArray([]),
    format: OpenSSL
};

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/**
 * @abstract
 */
class Hasher extends BufferedBlockAlgorithm {
    /**
     * Creates a shortcut function to a hasher's object interface.
     *
     * \@example
     *
     *     let SHA256 = Hasher._createHelper(SHA256);
     * @param {?} hasher The hasher to create a helper for.
     *
     * @return {?} The shortcut function.
     *
     */
    static _createHelper(hasher) {
        /**
         * @param {?} message
         * @param {?=} cfg
         * @return {?}
         */
        function helper(message, cfg) {
            const /** @type {?} */ hasherClass = hasher;
            const /** @type {?} */ hasherInstance = new hasherClass(cfg);
            return hasherInstance.finalize(message);
        }
        return helper;
    }
    /**
     * Initializes a newly created hasher.
     *
     * \@example
     *
     *     let hasher = CryptoJS.algo.SHA256.create();
     * @param {?=} cfg (Optional) The configuration options to use for this hash computation.
     *
     */
    constructor(cfg) {
        // Apply config defaults
        super(Object.assign({
            blockSize: 512 / 32
        }, cfg));
        // Set initial values
        this.reset();
    }
    /**
     * Updates this hasher with a message.
     *
     * \@example
     *
     *     hasher.update('message');
     *     hasher.update(wordArray);
     * @param {?} messageUpdate The message to append.
     *
     * @return {?} This hasher.
     *
     */
    update(messageUpdate) {
        // Append
        this._append(messageUpdate);
        // Update the hash
        this._process();
        // Chainable
        return this;
    }
    /**
     * Finalizes the hash computation.
     * Note that the finalize operation is effectively a destructive, read-once operation.
     *
     * \@example
     *
     *     let hash = hasher.finalize();
     *     let hash = hasher.finalize('message');
     *     let hash = hasher.finalize(wordArray);
     * @param {?} messageUpdate (Optional) A final message update.
     *
     * @return {?} The hash.
     *
     */
    finalize(messageUpdate) {
        // Final message update
        if (messageUpdate) {
            this._append(messageUpdate);
        }
        // Perform concrete-hasher logic
        const /** @type {?} */ hash = this._doFinalize();
        return hash;
    }
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
// Constants table
const /** @type {?} */ T = [];
// Compute constants
for (let /** @type {?} */ i = 0; i < 64; i++) {
    T[i] = (Math.abs(Math.sin(i + 1)) * 0x100000000) | 0;
}
class MD5 extends Hasher {
    /**
     * @param {?} a
     * @param {?} b
     * @param {?} c
     * @param {?} d
     * @param {?} x
     * @param {?} s
     * @param {?} t
     * @return {?}
     */
    static FF(a, b, c, d, x, s, t) {
        const /** @type {?} */ n = a + ((b & c) | (~b & d)) + x + t;
        return ((n << s) | (n >>> (32 - s))) + b;
    }
    /**
     * @param {?} a
     * @param {?} b
     * @param {?} c
     * @param {?} d
     * @param {?} x
     * @param {?} s
     * @param {?} t
     * @return {?}
     */
    static GG(a, b, c, d, x, s, t) {
        const /** @type {?} */ n = a + ((b & d) | (c & ~d)) + x + t;
        return ((n << s) | (n >>> (32 - s))) + b;
    }
    /**
     * @param {?} a
     * @param {?} b
     * @param {?} c
     * @param {?} d
     * @param {?} x
     * @param {?} s
     * @param {?} t
     * @return {?}
     */
    static HH(a, b, c, d, x, s, t) {
        const /** @type {?} */ n = a + (b ^ c ^ d) + x + t;
        return ((n << s) | (n >>> (32 - s))) + b;
    }
    /**
     * @param {?} a
     * @param {?} b
     * @param {?} c
     * @param {?} d
     * @param {?} x
     * @param {?} s
     * @param {?} t
     * @return {?}
     */
    static II(a, b, c, d, x, s, t) {
        const /** @type {?} */ n = a + (c ^ (b | ~d)) + x + t;
        return ((n << s) | (n >>> (32 - s))) + b;
    }
    /**
     * @return {?}
     */
    reset() {
        // reset core values
        super.reset();
        this._hash = new WordArray([
            0x67452301, 0xefcdab89,
            0x98badcfe, 0x10325476
        ]);
    }
    /**
     * @param {?} M
     * @param {?} offset
     * @return {?}
     */
    _doProcessBlock(M, offset) {
        // Swap endian
        for (let /** @type {?} */ i = 0; i < 16; i++) {
            // Shortcuts
            const /** @type {?} */ offset_i = offset + i;
            const /** @type {?} */ M_offset_i = M[offset_i];
            M[offset_i] = ((((M_offset_i << 8) | (M_offset_i >>> 24)) & 0x00ff00ff) |
                (((M_offset_i << 24) | (M_offset_i >>> 8)) & 0xff00ff00));
        }
        // Shortcuts
        const /** @type {?} */ H = this._hash.words;
        const /** @type {?} */ M_offset_0 = M[offset + 0];
        const /** @type {?} */ M_offset_1 = M[offset + 1];
        const /** @type {?} */ M_offset_2 = M[offset + 2];
        const /** @type {?} */ M_offset_3 = M[offset + 3];
        const /** @type {?} */ M_offset_4 = M[offset + 4];
        const /** @type {?} */ M_offset_5 = M[offset + 5];
        const /** @type {?} */ M_offset_6 = M[offset + 6];
        const /** @type {?} */ M_offset_7 = M[offset + 7];
        const /** @type {?} */ M_offset_8 = M[offset + 8];
        const /** @type {?} */ M_offset_9 = M[offset + 9];
        const /** @type {?} */ M_offset_10 = M[offset + 10];
        const /** @type {?} */ M_offset_11 = M[offset + 11];
        const /** @type {?} */ M_offset_12 = M[offset + 12];
        const /** @type {?} */ M_offset_13 = M[offset + 13];
        const /** @type {?} */ M_offset_14 = M[offset + 14];
        const /** @type {?} */ M_offset_15 = M[offset + 15];
        // Working variables
        let /** @type {?} */ a = H[0];
        let /** @type {?} */ b = H[1];
        let /** @type {?} */ c = H[2];
        let /** @type {?} */ d = H[3];
        // Computation
        a = MD5.FF(a, b, c, d, M_offset_0, 7, T[0]);
        d = MD5.FF(d, a, b, c, M_offset_1, 12, T[1]);
        c = MD5.FF(c, d, a, b, M_offset_2, 17, T[2]);
        b = MD5.FF(b, c, d, a, M_offset_3, 22, T[3]);
        a = MD5.FF(a, b, c, d, M_offset_4, 7, T[4]);
        d = MD5.FF(d, a, b, c, M_offset_5, 12, T[5]);
        c = MD5.FF(c, d, a, b, M_offset_6, 17, T[6]);
        b = MD5.FF(b, c, d, a, M_offset_7, 22, T[7]);
        a = MD5.FF(a, b, c, d, M_offset_8, 7, T[8]);
        d = MD5.FF(d, a, b, c, M_offset_9, 12, T[9]);
        c = MD5.FF(c, d, a, b, M_offset_10, 17, T[10]);
        b = MD5.FF(b, c, d, a, M_offset_11, 22, T[11]);
        a = MD5.FF(a, b, c, d, M_offset_12, 7, T[12]);
        d = MD5.FF(d, a, b, c, M_offset_13, 12, T[13]);
        c = MD5.FF(c, d, a, b, M_offset_14, 17, T[14]);
        b = MD5.FF(b, c, d, a, M_offset_15, 22, T[15]);
        a = MD5.GG(a, b, c, d, M_offset_1, 5, T[16]);
        d = MD5.GG(d, a, b, c, M_offset_6, 9, T[17]);
        c = MD5.GG(c, d, a, b, M_offset_11, 14, T[18]);
        b = MD5.GG(b, c, d, a, M_offset_0, 20, T[19]);
        a = MD5.GG(a, b, c, d, M_offset_5, 5, T[20]);
        d = MD5.GG(d, a, b, c, M_offset_10, 9, T[21]);
        c = MD5.GG(c, d, a, b, M_offset_15, 14, T[22]);
        b = MD5.GG(b, c, d, a, M_offset_4, 20, T[23]);
        a = MD5.GG(a, b, c, d, M_offset_9, 5, T[24]);
        d = MD5.GG(d, a, b, c, M_offset_14, 9, T[25]);
        c = MD5.GG(c, d, a, b, M_offset_3, 14, T[26]);
        b = MD5.GG(b, c, d, a, M_offset_8, 20, T[27]);
        a = MD5.GG(a, b, c, d, M_offset_13, 5, T[28]);
        d = MD5.GG(d, a, b, c, M_offset_2, 9, T[29]);
        c = MD5.GG(c, d, a, b, M_offset_7, 14, T[30]);
        b = MD5.GG(b, c, d, a, M_offset_12, 20, T[31]);
        a = MD5.HH(a, b, c, d, M_offset_5, 4, T[32]);
        d = MD5.HH(d, a, b, c, M_offset_8, 11, T[33]);
        c = MD5.HH(c, d, a, b, M_offset_11, 16, T[34]);
        b = MD5.HH(b, c, d, a, M_offset_14, 23, T[35]);
        a = MD5.HH(a, b, c, d, M_offset_1, 4, T[36]);
        d = MD5.HH(d, a, b, c, M_offset_4, 11, T[37]);
        c = MD5.HH(c, d, a, b, M_offset_7, 16, T[38]);
        b = MD5.HH(b, c, d, a, M_offset_10, 23, T[39]);
        a = MD5.HH(a, b, c, d, M_offset_13, 4, T[40]);
        d = MD5.HH(d, a, b, c, M_offset_0, 11, T[41]);
        c = MD5.HH(c, d, a, b, M_offset_3, 16, T[42]);
        b = MD5.HH(b, c, d, a, M_offset_6, 23, T[43]);
        a = MD5.HH(a, b, c, d, M_offset_9, 4, T[44]);
        d = MD5.HH(d, a, b, c, M_offset_12, 11, T[45]);
        c = MD5.HH(c, d, a, b, M_offset_15, 16, T[46]);
        b = MD5.HH(b, c, d, a, M_offset_2, 23, T[47]);
        a = MD5.II(a, b, c, d, M_offset_0, 6, T[48]);
        d = MD5.II(d, a, b, c, M_offset_7, 10, T[49]);
        c = MD5.II(c, d, a, b, M_offset_14, 15, T[50]);
        b = MD5.II(b, c, d, a, M_offset_5, 21, T[51]);
        a = MD5.II(a, b, c, d, M_offset_12, 6, T[52]);
        d = MD5.II(d, a, b, c, M_offset_3, 10, T[53]);
        c = MD5.II(c, d, a, b, M_offset_10, 15, T[54]);
        b = MD5.II(b, c, d, a, M_offset_1, 21, T[55]);
        a = MD5.II(a, b, c, d, M_offset_8, 6, T[56]);
        d = MD5.II(d, a, b, c, M_offset_15, 10, T[57]);
        c = MD5.II(c, d, a, b, M_offset_6, 15, T[58]);
        b = MD5.II(b, c, d, a, M_offset_13, 21, T[59]);
        a = MD5.II(a, b, c, d, M_offset_4, 6, T[60]);
        d = MD5.II(d, a, b, c, M_offset_11, 10, T[61]);
        c = MD5.II(c, d, a, b, M_offset_2, 15, T[62]);
        b = MD5.II(b, c, d, a, M_offset_9, 21, T[63]);
        // Intermediate hash value
        H[0] = (H[0] + a) | 0;
        H[1] = (H[1] + b) | 0;
        H[2] = (H[2] + c) | 0;
        H[3] = (H[3] + d) | 0;
    }
    /**
     * @return {?}
     */
    _doFinalize() {
        // Shortcuts
        const /** @type {?} */ data = this._data;
        const /** @type {?} */ dataWords = data.words;
        const /** @type {?} */ nBitsTotal = this._nDataBytes * 8;
        const /** @type {?} */ nBitsLeft = data.sigBytes * 8;
        // Add padding
        dataWords[nBitsLeft >>> 5] |= 0x80 << (24 - nBitsLeft % 32);
        const /** @type {?} */ nBitsTotalH = Math.floor(nBitsTotal / 0x100000000);
        const /** @type {?} */ nBitsTotalL = nBitsTotal;
        dataWords[(((nBitsLeft + 64) >>> 9) << 4) + 15] = ((((nBitsTotalH << 8) | (nBitsTotalH >>> 24)) & 0x00ff00ff) |
            (((nBitsTotalH << 24) | (nBitsTotalH >>> 8)) & 0xff00ff00));
        dataWords[(((nBitsLeft + 64) >>> 9) << 4) + 14] = ((((nBitsTotalL << 8) | (nBitsTotalL >>> 24)) & 0x00ff00ff) |
            (((nBitsTotalL << 24) | (nBitsTotalL >>> 8)) & 0xff00ff00));
        data.sigBytes = (dataWords.length + 1) * 4;
        // Hash final blocks
        this._process();
        // Shortcuts
        const /** @type {?} */ hash = this._hash;
        const /** @type {?} */ H = hash.words;
        // Swap endian
        for (let /** @type {?} */ i = 0; i < 4; i++) {
            // Shortcut
            const /** @type {?} */ H_i = H[i];
            H[i] = (((H_i << 8) | (H_i >>> 24)) & 0x00ff00ff) |
                (((H_i << 24) | (H_i >>> 8)) & 0xff00ff00);
        }
        // Return final computed hash
        return hash;
    }
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
class EvpKDF {
    /**
     * Initializes a newly created key derivation function.
     *
     * \@example
     *
     *     let kdf = EvpKDF.create();
     *     let kdf = EvpKDF.create({ keySize: 8 });
     *     let kdf = EvpKDF.create({ keySize: 8, iterations: 1000 });
     * @param {?=} cfg (Optional) The configuration options to use for the derivation.
     *
     */
    constructor(cfg) {
        this.cfg = Object.assign({
            keySize: 128 / 32,
            hasher: MD5,
            iterations: 1
        }, cfg);
    }
    /**
     * Derives a key from a password.
     *
     * \@example
     *
     *     let key = kdf.compute(password, salt);
     * @param {?} password The password.
     * @param {?} salt A salt.
     *
     * @return {?} The derived key.
     *
     */
    compute(password, salt) {
        // Init hasher
        const /** @type {?} */ hasher = new (/** @type {?} */ (this.cfg.hasher))();
        // Initial values
        const /** @type {?} */ derivedKey = new WordArray();
        // Generate key
        let /** @type {?} */ block;
        while (derivedKey.words.length < this.cfg.keySize) {
            if (block) {
                hasher.update(block);
            }
            block = hasher.update(password).finalize(salt);
            hasher.reset();
            // Iterations
            for (let /** @type {?} */ i = 1; i < this.cfg.iterations; i++) {
                block = hasher.finalize(block);
                hasher.reset();
            }
            derivedKey.concat(block);
        }
        derivedKey.sigBytes = this.cfg.keySize * 4;
        return derivedKey;
    }
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
class OpenSSLKdf {
    /**
     * Derives a key and IV from a password.
     *
     * \@example
     *
     *     let derivedParams = OpenSSL.execute('Password', 256/32, 128/32);
     *     let derivedParams = OpenSSL.execute('Password', 256/32, 128/32, 'saltsalt');
     * @param {?} password The password to derive from.
     * @param {?} keySize The size in words of the key to generate.
     * @param {?} ivSize The size in words of the IV to generate.
     * @param {?=} salt (Optional) A 64-bit salt to use. If omitted, a salt will be generated randomly.
     *
     * @return {?} A cipher params object with the key, IV, and salt.
     *
     */
    static execute(password, keySize, ivSize, salt) {
        // Generate random salt
        if (!salt) {
            salt = WordArray.random(64 / 8);
        }
        // Derive key and IV
        const /** @type {?} */ key = (new EvpKDF({ keySize: keySize + ivSize })).compute(password, salt);
        // Separate key and IV
        const /** @type {?} */ iv = new WordArray(key.words.slice(keySize), ivSize * 4);
        key.sigBytes = keySize * 4;
        // Return params
        return new CipherParams({ key: key, iv: iv, salt: salt });
    }
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
class PasswordBasedCipher {
    /**
     * Encrypts a message using a password.
     *
     * \@example
     *
     *     var ciphertextParams = CryptoJS.lib.PasswordBasedCipher.encrypt(AES, message, 'password');
     *     var ciphertextParams = CryptoJS.lib.PasswordBasedCipher.encrypt(AES, message, 'password', { format: OpenSSL });
     * @param {?} cipher The cipher algorithm to use.
     * @param {?} message The message to encrypt.
     * @param {?} password The password.
     * @param {?=} cfg (Optional) The configuration options to use for this operation.
     *
     * @return {?} A cipher params object.
     *
     */
    static encrypt(cipher, message, password, cfg) {
        // Apply config defaults
        const /** @type {?} */ config = Object.assign({}, this.cfg, cfg);
        // Check if we have a kdf
        if (config.kdf === undefined) {
            throw new Error('missing kdf in config');
        }
        // Derive key and other params
        const /** @type {?} */ derivedParams = config.kdf.execute(password, cipher.keySize, cipher.ivSize);
        // Check if we have an IV
        if (derivedParams.iv !== undefined) {
            // Add IV to config
            config.iv = derivedParams.iv;
        }
        // Encrypt
        const /** @type {?} */ ciphertext = SerializableCipher.encrypt.call(this, cipher, message, derivedParams.key, config);
        // Mix in derived params
        return ciphertext.extend(derivedParams);
    }
    /**
     * Decrypts serialized ciphertext using a password.
     *
     * \@example
     *
     *     var plaintext = PasswordBasedCipher.decrypt(AES, formattedCiphertext, 'password', { format: OpenSSL });
     *     var plaintext = PasswordBasedCipher.decrypt(AES, ciphertextParams, 'password', { format: OpenSSL });
     * @param {?} cipher The cipher algorithm to use.
     * @param {?} ciphertext The ciphertext to decrypt.
     * @param {?} password The password.
     * @param {?=} cfg (Optional) The configuration options to use for this operation.
     *
     * @return {?} The plaintext.
     *
     */
    static decrypt(cipher, ciphertext, password, cfg) {
        // Apply config defaults
        const /** @type {?} */ config = Object.assign({}, this.cfg, cfg);
        // Check if we have a kdf
        if (config.format === undefined) {
            throw new Error('missing format in config');
        }
        // Convert string to CipherParams
        ciphertext = this._parse(ciphertext, config.format);
        // Check if we have a kdf
        if (config.kdf === undefined) {
            throw new Error('the key derivation function must be set');
        }
        // Derive key and other params
        const /** @type {?} */ derivedParams = config.kdf.execute(password, cipher.keySize, cipher.ivSize, ciphertext.salt);
        // Check if we have an IV
        if (derivedParams.iv !== undefined) {
            // Add IV to config
            config.iv = derivedParams.iv;
        }
        // Decrypt
        const /** @type {?} */ plaintext = SerializableCipher.decrypt.call(this, cipher, ciphertext, derivedParams.key, config);
        return plaintext;
    }
    /**
     * Converts serialized ciphertext to CipherParams,
     * else assumed CipherParams already and returns ciphertext unchanged.
     *
     * \@example
     *
     *     var ciphertextParams = CryptoJS.lib.SerializableCipher._parse(ciphertextStringOrParams, format);
     * @param {?} ciphertext The ciphertext.
     * @param {?} format The formatting strategy to use to parse serialized ciphertext.
     *
     * @return {?} The unserialized ciphertext.
     *
     */
    static _parse(ciphertext, format) {
        if (typeof ciphertext === 'string') {
            return format.parse(ciphertext);
        }
        else {
            return ciphertext;
        }
    }
}
PasswordBasedCipher.cfg = {
    blockSize: 4,
    iv: new WordArray([]),
    format: OpenSSL,
    kdf: OpenSSLKdf
};

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/**
 * @abstract
 */
class Cipher extends BufferedBlockAlgorithm {
    /**
     * Initializes a newly created cipher.
     *
     * \@example
     *
     *     let cipher = AES.create(AES._ENC_XFORM_MODE, keyWordArray, { iv: ivWordArray });
     * @param {?} xformMode Either the encryption or decryption transormation mode constant.
     * @param {?} key The key.
     * @param {?=} cfg (Optional) The configuration options to use for this operation.
     *
     */
    constructor(xformMode, key, cfg) {
        // Apply config defaults
        super(Object.assign({
            blockSize: 1
        }, cfg));
        // Store transform mode and key
        this._xformMode = xformMode;
        this._key = key;
        // Set initial values
        this.reset();
    }
    /**
     * Creates this cipher in encryption mode.
     *
     * \@example
     *
     *     let cipher = AES.createEncryptor(keyWordArray, { iv: ivWordArray });
     * @param {?} key The key.
     * @param {?=} cfg (Optional) The configuration options to use for this operation.
     *
     * @return {?} A cipher instance.
     *
     */
    static createEncryptor(key, cfg) {
        // workaround for typescript not being able to create a abstract creator function directly
        const /** @type {?} */ thisClass = this;
        return new thisClass(this._ENC_XFORM_MODE, key, cfg);
    }
    /**
     * Creates this cipher in decryption mode.
     *
     * \@example
     *
     *     let cipher = AES.createDecryptor(keyWordArray, { iv: ivWordArray });
     * @param {?} key The key.
     * @param {?=} cfg (Optional) The configuration options to use for this operation.
     *
     * @return {?} A cipher instance.
     *
     */
    static createDecryptor(key, cfg) {
        // workaround for typescript not being able to create a abstract creator function directly
        const /** @type {?} */ thisClass = this;
        return new thisClass(this._DEC_XFORM_MODE, key, cfg);
    }
    /**
     * Creates shortcut functions to a cipher's object interface.
     *
     * \@example
     *
     *     let AES = Cipher._createHelper(AESAlgorithm);
     * @param {?} cipher The cipher to create a helper for.
     *
     * @return {?} An object with encrypt and decrypt shortcut functions.
     *
     */
    static _createHelper(cipher) {
        /**
         * @param {?} message
         * @param {?} key
         * @param {?=} cfg
         * @return {?}
         */
        function encrypt(message, key, cfg) {
            if (typeof key === 'string') {
                return PasswordBasedCipher.encrypt(cipher, message, key, cfg);
            }
            else {
                return SerializableCipher.encrypt(cipher, message, key, cfg);
            }
        }
        /**
         * @param {?} ciphertext
         * @param {?} key
         * @param {?=} cfg
         * @return {?}
         */
        function decrypt(ciphertext, key, cfg) {
            if (typeof key === 'string') {
                return PasswordBasedCipher.decrypt(cipher, ciphertext, key, cfg);
            }
            else {
                return SerializableCipher.decrypt(cipher, ciphertext, key, cfg);
            }
        }
        return {
            encrypt: encrypt,
            decrypt: decrypt
        };
    }
    /**
     * Adds data to be encrypted or decrypted.
     *
     * \@example
     *
     *     let encrypted = cipher.process('data');
     *     let encrypted = cipher.process(wordArray);
     * @param {?} dataUpdate The data to encrypt or decrypt.
     *
     * @return {?} The data after processing.
     *
     */
    process(dataUpdate) {
        // Append
        this._append(dataUpdate);
        // Process available blocks
        return this._process();
    }
    /**
     * Finalizes the encryption or decryption process.
     * Note that the finalize operation is effectively a destructive, read-once operation.
     *
     * \@example
     *
     *     var encrypted = cipher.finalize();
     *     var encrypted = cipher.finalize('data');
     *     var encrypted = cipher.finalize(wordArray);
     * @param {?=} dataUpdate The final data to encrypt or decrypt.
     *
     * @return {?} The data after final processing.
     *
     */
    finalize(dataUpdate) {
        // Final data update
        if (dataUpdate) {
            this._append(dataUpdate);
        }
        // Perform concrete-cipher logic
        const /** @type {?} */ finalProcessedData = this._doFinalize();
        return finalProcessedData;
    }
}
/**
 * A constant representing encryption mode.
 */
Cipher._ENC_XFORM_MODE = 1;
/**
 * A constant representing decryption mode.
 */
Cipher._DEC_XFORM_MODE = 2;
/**
 * This cipher's key size. Default: 4 (128 bits / 32 Bits)
 */
Cipher.keySize = 4;
/**
 * This cipher's IV size. Default: 4 (128 bits / 32 Bits)
 */
Cipher.ivSize = 4;

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/**
 * @abstract
 */
class BlockCipherModeAlgorithm {
    /**
     * @param {?} cipher
     * @param {?} iv
     */
    constructor(cipher, iv) {
        this.init(cipher, iv);
    }
    /**
     * Initializes a newly created mode.
     *
     * \@example
     *
     *     var mode = CBC.Encryptor.create(cipher, iv.words);
     * @param {?} cipher A block cipher instance.
     * @param {?=} iv The IV words.
     *
     * @return {?}
     */
    init(cipher, iv) {
        this._cipher = cipher;
        this._iv = iv;
    }
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/**
 * @abstract
 */
class BlockCipherMode {
    /**
     * Creates this mode for encryption.
     *
     * \@example
     *
     *     var mode = CBC.createEncryptor(cipher, iv.words);
     * @param {?} cipher A block cipher instance.
     * @param {?} iv The IV words.
     *
     * @return {?}
     */
    static createEncryptor(cipher, iv) {
        // workaround for typescript not being able to create a abstract creator function directly
        const /** @type {?} */ encryptorClass = this.Encryptor;
        return new encryptorClass(cipher, iv);
    }
    /**
     * Creates this mode for decryption.
     *
     * \@example
     *
     *     var mode = CBC.createDecryptor(cipher, iv.words);
     * @param {?} cipher A block cipher instance.
     * @param {?} iv The IV words.
     *
     * @return {?}
     */
    static createDecryptor(cipher, iv) {
        // workaround for typescript not being able to create a abstract creator function directly
        const /** @type {?} */ decryptorClass = this.Decryptor;
        return new decryptorClass(cipher, iv);
    }
}
BlockCipherMode.Encryptor = BlockCipherModeAlgorithm;
BlockCipherMode.Decryptor = BlockCipherModeAlgorithm;

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
class CBCEncryptor extends BlockCipherModeAlgorithm {
    /**
     * Processes the data block at offset.
     *
     * \@example
     *
     *     mode.processBlock(data.words, offset);
     * @param {?} words The data words to operate on.
     * @param {?} offset The offset where the block starts.
     *
     * @return {?}
     */
    processBlock(words, offset) {
        // Check if we have a blockSize
        if (this._cipher.cfg.blockSize === undefined) {
            throw new Error('missing blockSize in cipher config');
        }
        // XOR and encrypt
        this.xorBlock(words, offset, this._cipher.cfg.blockSize);
        this._cipher.encryptBlock(words, offset);
        // Remember this block to use with next block
        this._prevBlock = words.slice(offset, offset + this._cipher.cfg.blockSize);
    }
    /**
     * @param {?} words
     * @param {?} offset
     * @param {?} blockSize
     * @return {?}
     */
    xorBlock(words, offset, blockSize) {
        // Choose mixing block
        let /** @type {?} */ block;
        if (this._iv) {
            block = this._iv;
            // Remove IV for subsequent blocks
            this._iv = undefined;
        }
        else {
            block = this._prevBlock;
        }
        // block should never be undefined but we want to make typescript happy
        if (block !== undefined) {
            // XOR blocks
            for (let /** @type {?} */ i = 0; i < blockSize; i++) {
                words[offset + i] ^= block[i];
            }
        }
    }
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
class CBCDecryptor extends BlockCipherModeAlgorithm {
    /**
     * Processes the data block at offset.
     *
     * \@example
     *
     *     mode.processBlock(data.words, offset);
     * @param {?} words The data words to operate on.
     * @param {?} offset The offset where the block starts.
     *
     * @return {?}
     */
    processBlock(words, offset) {
        // Check if we have a blockSize
        if (this._cipher.cfg.blockSize === undefined) {
            throw new Error('missing blockSize in cipher config');
        }
        // Remember this block to use with next block
        const /** @type {?} */ thisBlock = words.slice(offset, offset + this._cipher.cfg.blockSize);
        // Decrypt and XOR
        this._cipher.decryptBlock(words, offset);
        this.xorBlock(words, offset, this._cipher.cfg.blockSize);
        // This block becomes the previous block
        this._prevBlock = thisBlock;
    }
    /**
     * @param {?} words
     * @param {?} offset
     * @param {?} blockSize
     * @return {?}
     */
    xorBlock(words, offset, blockSize) {
        // Choose mixing block
        let /** @type {?} */ block;
        if (this._iv) {
            block = this._iv;
            // Remove IV for subsequent blocks
            this._iv = undefined;
        }
        else {
            block = this._prevBlock;
        }
        // block should never be undefined but we want to make typescript happy
        if (block !== undefined) {
            // XOR blocks
            for (let /** @type {?} */ i = 0; i < blockSize; i++) {
                words[offset + i] ^= block[i];
            }
        }
    }
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/**
 * Cipher Block Chaining mode.
 * @abstract
 */
class CBC extends BlockCipherMode {
}
CBC.Encryptor = CBCEncryptor;
CBC.Decryptor = CBCDecryptor;

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
class PKCS7 {
    /**
     * Pads data using the algorithm defined in PKCS #5/7.
     *
     * \@example
     *
     *     PKCS7.pad(wordArray, 4);
     * @param {?} data The data to pad.
     * @param {?} blockSize The multiple that the data should be padded to.
     *
     * @return {?}
     */
    static pad(data, blockSize) {
        // Shortcut
        const /** @type {?} */ blockSizeBytes = blockSize * 4;
        // Count padding bytes
        const /** @type {?} */ nPaddingBytes = blockSizeBytes - data.sigBytes % blockSizeBytes;
        // Create padding word
        const /** @type {?} */ paddingWord = (nPaddingBytes << 24) | (nPaddingBytes << 16) | (nPaddingBytes << 8) | nPaddingBytes;
        // Create padding
        const /** @type {?} */ paddingWords = [];
        for (let /** @type {?} */ i = 0; i < nPaddingBytes; i += 4) {
            paddingWords.push(paddingWord);
        }
        const /** @type {?} */ padding = new WordArray(paddingWords, nPaddingBytes);
        // Add padding
        data.concat(padding);
    }
    /**
     * Unpads data that had been padded using the algorithm defined in PKCS #5/7.
     *
     * \@example
     *
     *     PKCS7.unpad(wordArray);
     * @param {?} data The data to unpad.
     *
     * @return {?}
     */
    static unpad(data) {
        // Get number of padding bytes from last byte
        const /** @type {?} */ nPaddingBytes = data.words[(data.sigBytes - 1) >>> 2] & 0xff;
        // Remove padding
        data.sigBytes -= nPaddingBytes;
    }
}



/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
class ZeroPadding {
   
    static pad(data, blockSize) {
        // Shortcut
        const /** @type {?} */ blockSizeBytes = blockSize * 4;
        // Count padding bytes
        const /** @type {?} */ nPaddingBytes = blockSizeBytes - data.sigBytes % blockSizeBytes;
        // Create padding
        const /** @type {?} */ paddingWords = [];
        for (let /** @type {?} */ i = 0; i < nPaddingBytes; i += 4) {
            paddingWords.push(0);
        }
        const /** @type {?} */ padding = new WordArray(paddingWords, nPaddingBytes);
        // Add padding
        data.concat(padding);
    }
    

    static unpad(data) {
        
        // console.log("unpad 1:", data.clone());
        for (let i = data.words.length - 1; i>=0; i--) {
            if(data.words[i] != 0){
                data.slice(0, i+1);
                // console.log("unpad 2:", data);
                return
            }
        }
        
    }
}


/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/**
 * @abstract
 */
class BlockCipher extends Cipher {
    /**
     * @param {?} xformMode
     * @param {?} key
     * @param {?=} cfg
     */
    constructor(xformMode, key, cfg) {
        super(xformMode, key, Object.assign({
            // default: 128 / 32
            blockSize: 4,
            mode: CBC,
            padding: PKCS7
        }, cfg));
    }
    /**
     * @return {?}
     */
    reset() {
        // Reset cipher
        super.reset();
        // Check if we have a blockSize
        if (this.cfg.mode === undefined) {
            throw new Error('missing mode in config');
        }
        // Reset block mode
        let /** @type {?} */ modeCreator;
        if (this._xformMode === (/** @type {?} */ (this.constructor))._ENC_XFORM_MODE) {
            modeCreator = this.cfg.mode.createEncryptor;
        }
        else /* if (this._xformMode == this._DEC_XFORM_MODE) */ {
            modeCreator = this.cfg.mode.createDecryptor;
            // Keep at least one block in the buffer for unpadding
            this._minBufferSize = 1;
        }
        if (this._mode && this._mode.__creator === modeCreator) {
            this._mode.init(this, this.cfg.iv && this.cfg.iv.words);
        }
        else {
            this._mode = modeCreator.call(this.cfg.mode, this, this.cfg.iv && this.cfg.iv.words);
            this._mode.__creator = modeCreator;
        }
    }
    /**
     * @param {?} words
     * @param {?} offset
     * @return {?}
     */
    _doProcessBlock(words, offset) {
        this._mode.processBlock(words, offset);
    }
    /**
     * @return {?}
     */
    _doFinalize() {
        // Check if we have a padding strategy
        if (this.cfg.padding === undefined) {
            throw new Error('missing padding in config');
        }
        // Finalize
        let /** @type {?} */ finalProcessedBlocks;
        if (this._xformMode === (/** @type {?} */ (this.constructor))._ENC_XFORM_MODE) {
            // Check if we have a blockSize
            if (this.cfg.blockSize === undefined) {
                throw new Error('missing blockSize in config');
            }
            // Pad data
            this.cfg.padding.pad(this._data, this.cfg.blockSize);
            // Process final blocks
            finalProcessedBlocks = this._process(!!'flush');
        }
        else /* if (this._xformMode == this._DEC_XFORM_MODE) */ {
            // Process final blocks
            finalProcessedBlocks = this._process(!!'flush');
            // Unpad data
            this.cfg.padding.unpad(finalProcessedBlocks);
        }
        return finalProcessedBlocks;
    }
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
// Define lookup tables
const /** @type {?} */ SBOX = [];
const /** @type {?} */ INV_SBOX = [];
const /** @type {?} */ SUB_MIX_0 = [];
const /** @type {?} */ SUB_MIX_1 = [];
const /** @type {?} */ SUB_MIX_2 = [];
const /** @type {?} */ SUB_MIX_3 = [];
const /** @type {?} */ INV_SUB_MIX_0 = [];
const /** @type {?} */ INV_SUB_MIX_1 = [];
const /** @type {?} */ INV_SUB_MIX_2 = [];
const /** @type {?} */ INV_SUB_MIX_3 = [];
// Compute lookup tables
(function () {
    // Compute double table
    const /** @type {?} */ d = [];
    for (let /** @type {?} */ i = 0; i < 256; i++) {
        if (i < 128) {
            d[i] = i << 1;
        }
        else {
            d[i] = (i << 1) ^ 0x11b;
        }
    }
    // Walk GF(2^8)
    let /** @type {?} */ x = 0;
    let /** @type {?} */ xi = 0;
    for (let /** @type {?} */ i = 0; i < 256; i++) {
        // Compute sbox
        let /** @type {?} */ sx = xi ^ (xi << 1) ^ (xi << 2) ^ (xi << 3) ^ (xi << 4);
        sx = (sx >>> 8) ^ (sx & 0xff) ^ 0x63;
        SBOX[x] = sx;
        INV_SBOX[sx] = x;
        // Compute multiplication
        const /** @type {?} */ x2 = d[x];
        const /** @type {?} */ x4 = d[x2];
        const /** @type {?} */ x8 = d[x4];
        // Compute sub bytes, mix columns tables
        let /** @type {?} */ t = (d[sx] * 0x101) ^ (sx * 0x1010100);
        SUB_MIX_0[x] = (t << 24) | (t >>> 8);
        SUB_MIX_1[x] = (t << 16) | (t >>> 16);
        SUB_MIX_2[x] = (t << 8) | (t >>> 24);
        SUB_MIX_3[x] = t;
        // Compute inv sub bytes, inv mix columns tables
        t = (x8 * 0x1010101) ^ (x4 * 0x10001) ^ (x2 * 0x101) ^ (x * 0x1010100);
        INV_SUB_MIX_0[sx] = (t << 24) | (t >>> 8);
        INV_SUB_MIX_1[sx] = (t << 16) | (t >>> 16);
        INV_SUB_MIX_2[sx] = (t << 8) | (t >>> 24);
        INV_SUB_MIX_3[sx] = t;
        // Compute next counter
        if (!x) {
            x = xi = 1;
        }
        else {
            x = x2 ^ d[d[d[x8 ^ x2]]];
            xi ^= d[d[xi]];
        }
    }
}());
// Precomputed Rcon lookup
const /** @type {?} */ RCON = [0x00, 0x01, 0x02, 0x04, 0x08, 0x10, 0x20, 0x40, 0x80, 0x1b, 0x36];
class AES extends BlockCipher {
    /**
     * @param {?} xformMode
     * @param {?} key
     * @param {?=} cfg
     */
    constructor(xformMode, key, cfg) {
        super(xformMode, key, cfg);
    }
    /**
     * @return {?}
     */
    reset() {
        // reset core values
        super.reset();
        // Skip reset of nRounds has been set before and key did not change
        if (this._nRounds && this._keyPriorReset === this._key) {
            return;
        }
        // Shortcuts
        const /** @type {?} */ key = this._keyPriorReset = this._key;
        const /** @type {?} */ keyWords = key.words;
        const /** @type {?} */ keySize = key.sigBytes / 4;
        // Compute number of rounds
        const /** @type {?} */ nRounds = this._nRounds = keySize + 6;
        // Compute number of key schedule rows
        const /** @type {?} */ ksRows = (nRounds + 1) * 4;
        // Compute key schedule
        const /** @type {?} */ keySchedule = this._keySchedule = [];
        for (let /** @type {?} */ ksRow = 0; ksRow < ksRows; ksRow++) {
            if (ksRow < keySize) {
                keySchedule[ksRow] = keyWords[ksRow];
            }
            else {
                let /** @type {?} */ t = keySchedule[ksRow - 1];
                if (!(ksRow % keySize)) {
                    // Rot word
                    t = (t << 8) | (t >>> 24);
                    // Sub word
                    t = (SBOX[t >>> 24] << 24) | (SBOX[(t >>> 16) & 0xff] << 16) | (SBOX[(t >>> 8) & 0xff] << 8) | SBOX[t & 0xff];
                    // Mix Rcon
                    t ^= RCON[(ksRow / keySize) | 0] << 24;
                }
                else if (keySize > 6 && ksRow % keySize === 4) {
                    // Sub word
                    t = (SBOX[t >>> 24] << 24) | (SBOX[(t >>> 16) & 0xff] << 16) | (SBOX[(t >>> 8) & 0xff] << 8) | SBOX[t & 0xff];
                }
                keySchedule[ksRow] = keySchedule[ksRow - keySize] ^ t;
            }
        }
        // Compute inv key schedule
        const /** @type {?} */ invKeySchedule = this._invKeySchedule = [];
        for (let /** @type {?} */ invKsRow = 0; invKsRow < ksRows; invKsRow++) {
            const /** @type {?} */ ksRow = ksRows - invKsRow;
            let /** @type {?} */ t;
            if (invKsRow % 4) {
                t = keySchedule[ksRow];
            }
            else {
                t = keySchedule[ksRow - 4];
            }
            if (invKsRow < 4 || ksRow <= 4) {
                invKeySchedule[invKsRow] = t;
            }
            else {
                invKeySchedule[invKsRow] = INV_SUB_MIX_0[SBOX[t >>> 24]] ^ INV_SUB_MIX_1[SBOX[(t >>> 16) & 0xff]] ^
                    INV_SUB_MIX_2[SBOX[(t >>> 8) & 0xff]] ^ INV_SUB_MIX_3[SBOX[t & 0xff]];
            }
        }
    }
    /**
     * @param {?} M
     * @param {?} offset
     * @return {?}
     */
    encryptBlock(M, offset) {
        this._doCryptBlock(M, offset, this._keySchedule, SUB_MIX_0, SUB_MIX_1, SUB_MIX_2, SUB_MIX_3, SBOX);
    }
    /**
     * @param {?} M
     * @param {?} offset
     * @return {?}
     */
    decryptBlock(M, offset) {
        // Swap 2nd and 4th rows
        let /** @type {?} */ t = M[offset + 1];
        M[offset + 1] = M[offset + 3];
        M[offset + 3] = t;
        this._doCryptBlock(M, offset, this._invKeySchedule, INV_SUB_MIX_0, INV_SUB_MIX_1, INV_SUB_MIX_2, INV_SUB_MIX_3, INV_SBOX);
        // Inv swap 2nd and 4th rows
        t = M[offset + 1];
        M[offset + 1] = M[offset + 3];
        M[offset + 3] = t;
    }
    /**
     * @param {?} M
     * @param {?} offset
     * @param {?} keySchedule
     * @param {?} sub_mix_0
     * @param {?} sub_mix_1
     * @param {?} sub_mix_2
     * @param {?} sub_mix_3
     * @param {?} sbox
     * @return {?}
     */
    _doCryptBlock(M, offset, keySchedule, sub_mix_0, sub_mix_1, sub_mix_2, sub_mix_3, sbox) {
        // Get input, add round key
        let /** @type {?} */ s0 = M[offset] ^ keySchedule[0];
        let /** @type {?} */ s1 = M[offset + 1] ^ keySchedule[1];
        let /** @type {?} */ s2 = M[offset + 2] ^ keySchedule[2];
        let /** @type {?} */ s3 = M[offset + 3] ^ keySchedule[3];
        // Key schedule row counter
        let /** @type {?} */ ksRow = 4;
        // Rounds
        for (let /** @type {?} */ round = 1; round < this._nRounds; round++) {
            // Shift rows, sub bytes, mix columns, add round key
            const /** @type {?} */ t0 = sub_mix_0[s0 >>> 24] ^ sub_mix_1[(s1 >>> 16) & 0xff] ^ sub_mix_2[(s2 >>> 8) & 0xff] ^ sub_mix_3[s3 & 0xff] ^
                keySchedule[ksRow++];
            const /** @type {?} */ t1 = sub_mix_0[s1 >>> 24] ^ sub_mix_1[(s2 >>> 16) & 0xff] ^ sub_mix_2[(s3 >>> 8) & 0xff] ^ sub_mix_3[s0 & 0xff] ^
                keySchedule[ksRow++];
            const /** @type {?} */ t2 = sub_mix_0[s2 >>> 24] ^ sub_mix_1[(s3 >>> 16) & 0xff] ^ sub_mix_2[(s0 >>> 8) & 0xff] ^ sub_mix_3[s1 & 0xff] ^
                keySchedule[ksRow++];
            const /** @type {?} */ t3 = sub_mix_0[s3 >>> 24] ^ sub_mix_1[(s0 >>> 16) & 0xff] ^ sub_mix_2[(s1 >>> 8) & 0xff] ^ sub_mix_3[s2 & 0xff] ^
                keySchedule[ksRow++];
            // Update state
            s0 = t0;
            s1 = t1;
            s2 = t2;
            s3 = t3;
        }
        // Shift rows, sub bytes, add round key
        const /** @type {?} */ t0g = ((sbox[s0 >>> 24] << 24) | (sbox[(s1 >>> 16) & 0xff] << 16) | (sbox[(s2 >>> 8) & 0xff] << 8) | sbox[s3 & 0xff]) ^
            keySchedule[ksRow++];
        const /** @type {?} */ t1g = ((sbox[s1 >>> 24] << 24) | (sbox[(s2 >>> 16) & 0xff] << 16) | (sbox[(s3 >>> 8) & 0xff] << 8) | sbox[s0 & 0xff]) ^
            keySchedule[ksRow++];
        const /** @type {?} */ t2g = ((sbox[s2 >>> 24] << 24) | (sbox[(s3 >>> 16) & 0xff] << 16) | (sbox[(s0 >>> 8) & 0xff] << 8) | sbox[s1 & 0xff]) ^
            keySchedule[ksRow++];
        const /** @type {?} */ t3g = ((sbox[s3 >>> 24] << 24) | (sbox[(s0 >>> 16) & 0xff] << 16) | (sbox[(s1 >>> 8) & 0xff] << 8) | sbox[s2 & 0xff]) ^
            keySchedule[ksRow++];
        // Set output
        M[offset] = t0g;
        M[offset + 1] = t1g;
        M[offset + 2] = t2g;
        M[offset + 3] = t3g;
    }
}
AES.keySize = 8;

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
// Initialization and round constants tables
const /** @type {?} */ H = [];
const /** @type {?} */ K = [];
// Reusable object
const /** @type {?} */ W = [];
class SHA256 extends Hasher {
    /**
     * @return {?}
     */
    reset() {
        // reset core values
        super.reset();
        this._hash = new WordArray(H.slice(0));
    }
    /**
     * @param {?} M
     * @param {?} offset
     * @return {?}
     */
    _doProcessBlock(M, offset) {
        // Shortcut
        const /** @type {?} */ Hl = this._hash.words;
        // Working variables
        let /** @type {?} */ a = Hl[0];
        let /** @type {?} */ b = Hl[1];
        let /** @type {?} */ c = Hl[2];
        let /** @type {?} */ d = Hl[3];
        let /** @type {?} */ e = Hl[4];
        let /** @type {?} */ f = Hl[5];
        let /** @type {?} */ g = Hl[6];
        let /** @type {?} */ h = Hl[7];
        // Computation
        for (let /** @type {?} */ i = 0; i < 64; i++) {
            if (i < 16) {
                W[i] = M[offset + i] | 0;
            }
            else {
                const /** @type {?} */ gamma0x = W[i - 15];
                const /** @type {?} */ gamma0 = ((gamma0x << 25) | (gamma0x >>> 7)) ^
                    ((gamma0x << 14) | (gamma0x >>> 18)) ^
                    (gamma0x >>> 3);
                const /** @type {?} */ gamma1x = W[i - 2];
                const /** @type {?} */ gamma1 = ((gamma1x << 15) | (gamma1x >>> 17)) ^
                    ((gamma1x << 13) | (gamma1x >>> 19)) ^
                    (gamma1x >>> 10);
                W[i] = gamma0 + W[i - 7] + gamma1 + W[i - 16];
            }
            const /** @type {?} */ ch = (e & f) ^ (~e & g);
            const /** @type {?} */ maj = (a & b) ^ (a & c) ^ (b & c);
            const /** @type {?} */ sigma0 = ((a << 30) | (a >>> 2)) ^ ((a << 19) | (a >>> 13)) ^ ((a << 10) | (a >>> 22));
            const /** @type {?} */ sigma1 = ((e << 26) | (e >>> 6)) ^ ((e << 21) | (e >>> 11)) ^ ((e << 7) | (e >>> 25));
            const /** @type {?} */ t1 = h + sigma1 + ch + K[i] + W[i];
            const /** @type {?} */ t2 = sigma0 + maj;
            h = g;
            g = f;
            f = e;
            e = (d + t1) | 0;
            d = c;
            c = b;
            b = a;
            a = (t1 + t2) | 0;
        }
        // Intermediate hash value
        Hl[0] = (Hl[0] + a) | 0;
        Hl[1] = (Hl[1] + b) | 0;
        Hl[2] = (Hl[2] + c) | 0;
        Hl[3] = (Hl[3] + d) | 0;
        Hl[4] = (Hl[4] + e) | 0;
        Hl[5] = (Hl[5] + f) | 0;
        Hl[6] = (Hl[6] + g) | 0;
        Hl[7] = (Hl[7] + h) | 0;
    }
    /**
     * @return {?}
     */
    _doFinalize() {
        const /** @type {?} */ nBitsTotal = this._nDataBytes * 8;
        const /** @type {?} */ nBitsLeft = this._data.sigBytes * 8;
        // Add padding
        this._data.words[nBitsLeft >>> 5] |= 0x80 << (24 - nBitsLeft % 32);
        this._data.words[(((nBitsLeft + 64) >>> 9) << 4) + 14] = Math.floor(nBitsTotal / 0x100000000);
        this._data.words[(((nBitsLeft + 64) >>> 9) << 4) + 15] = nBitsTotal;
        this._data.sigBytes = this._data.words.length * 4;
        // Hash final blocks
        this._process();
        // Return final computed hash
        return this._hash;
    }
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
class NoPadding {
    /**
     * Doesn't pad the data provided.
     *
     * \@example
     *
     *     NoPadding.pad(wordArray, 4);
     * @param {?} data The data to pad.
     * @param {?} blockSize The multiple that the data should be padded to.
     *
     * @return {?}
     */
    static pad(data, blockSize) {
    }
    /**
     * Doesn't unpad the data provided.
     *
     * \@example
     *
     *     NoPadding.unpad(wordArray);
     * @param {?} data The data to unpad.
     *
     * @return {?}
     */
    static unpad(data) {
    }
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
class ECBEncryptor extends BlockCipherModeAlgorithm {
    /**
     * Processes the data block at offset.
     *
     * \@example
     *
     *     mode.processBlock(data.words, offset);
     * @param {?} words The data words to operate on.
     * @param {?} offset The offset where the block starts.
     *
     * @return {?}
     */
    processBlock(words, offset) {
        this._cipher.encryptBlock(words, offset);
    }
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
class ECBDecryptor extends BlockCipherModeAlgorithm {
    /**
     * Processes the data block at offset.
     *
     * \@example
     *
     *     mode.processBlock(data.words, offset);
     * @param {?} words The data words to operate on.
     * @param {?} offset The offset where the block starts.
     *
     * @return {?}
     */
    processBlock(words, offset) {
        this._cipher.decryptBlock(words, offset);
    }
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/**
 * Cipher Block Chaining mode.
 * @abstract
 */
class ECB extends BlockCipherMode {
}
ECB.Encryptor = ECBEncryptor;
ECB.Decryptor = ECBDecryptor;

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
const /** @type {?} */ lib = {
    BlockCipher: BlockCipher,
    WordArray: WordArray,
    CipherParams: CipherParams,
    Hasher: Hasher,
    SerializableCipher: SerializableCipher,
    PasswordBasedCipher: PasswordBasedCipher
};
const /** @type {?} */ algo = {
    AES: AES,
    SHA256: SHA256
};
const /** @type {?} */ enc = {
    Utf8: Utf8,
    Hex: Hex
};
const /** @type {?} */ pad = {
    NoPadding: NoPadding,
    PKCS7: PKCS7,
    ZeroPadding: ZeroPadding,
};
const /** @type {?} */ mode = {
    CBC: CBC,
    ECB: ECB
};
// HELPERS /////////////////////////////////////////////////////////////////////////////////////////
const /** @type {?} */ AES$1 = lib.BlockCipher._createHelper(algo.AES);
const /** @type {?} */ SHA256$1 = lib.Hasher._createHelper(algo.SHA256);

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */

export {Base64, lib, algo, enc, pad, mode, AES$1 as AES, SHA256$1 as SHA256, AES as ɵl, SHA256 as ɵm, Hex as ɵp, Latin1 as ɵo, Utf8 as ɵn, Base as ɵg, BlockCipher as ɵa, BufferedBlockAlgorithm as ɵc, Cipher as ɵb, CipherParams as ɵf, Hasher as ɵi, PasswordBasedCipher as ɵk, SerializableCipher as ɵj, WordArray as ɵe, BlockCipherMode as ɵt, CBC as ɵs, ECB as ɵu, NoPadding as ɵq, PKCS7 as ɵr };
//# sourceMappingURL=crypto-ts.js.map

const crypto = require('crypto');

class JwtCreator {
    constructor(defaultValues = {}) {
        this.defaultAlgorithm = defaultValues.defaultAlgorithm || 'sha512';
        this.defaultSecret = defaultValues.defaultSecret || 'dev-secret';
        this.defaultOutputType = defaultValues.defaultOutputType || 'base64';
    }

    /**
     * User supplied header and algorithm create jwt
     * @param header
     * @param payload
     * @param secret
     * @returns {string|null}
     */
    jwtCreate(header, payload, secret = this.defaultSecret) {
        try {
            if ((!!header) && (!!payload) && (!!secret)) {
                let headerPlusPayloadUrlSafe = this.headerPayloadUrlSafeStringCreate(header, payload);
                let signature = this.createHmacString(headerPlusPayloadUrlSafe, secret, header.alg || this.defaultAlgorithm);
                let signatureUrlSafe = this.makeStringUrlSafe(signature);
                return headerPlusPayloadUrlSafe + '.' + signatureUrlSafe;
            } else {
                return null;
            }
        } catch (err) {
            throw err;
        }
    }

    /**
     * Creates SHA512 JWT which is url safe
     * @param header
     * @param payload
     * @param secret
     * @returns {string|null}
     */
    jwtCreateSHA512(header = {}, payload, secret = this.defaultSecret) {
        try {
            if ((!!header) && (!!payload) && (!!secret)) {
                let headerPlusPayloadUrlSafe = this.headerPayloadUrlSafeStringCreate({
                    ...header,
                    "alg": "sha512",
                    "typ": "JWT"
                }, payload);
                let signatureUrlSafe = this.makeStringUrlSafe(this.createHmacString(headerPlusPayloadUrlSafe, secret, 'sha512'));
                return headerPlusPayloadUrlSafe + '.' + signatureUrlSafe;
            } else {
                return null;
            }
        } catch (err) {
            throw err;
        }
    }

    /**
     * Returns base64 url safe header '.' payload string
     * @param header
     * @param payload
     * @returns {string|null}
     */
    headerPayloadUrlSafeStringCreate(header, payload) {
        try {
            if ((!!header) && (!!payload)) {
                let headerString = JSON.stringify(header);
                let base64Header = this.asciiToBase64(headerString);
                let payloadString = JSON.stringify(payload);
                let base64Payload = this.asciiToBase64(payloadString);
                return this.makeStringUrlSafe((base64Header + '.' + base64Payload));
            } else {
                return null;
            }
        } catch (err) {
            throw err;
        }
    }

    /**
     * Creates the base64 hash of given string
     * HMAC does not encrypt the message.
     * Every time same string with same key should give the same hash
     * outputs base64 string
     */
    createHmacString(string = '',
                     secretKey = this.defaultSecret,
                     algorithm = this.defaultAlgorithm,
                     outputType = this.defaultOutputType) {
        return crypto.createHmac(algorithm, secretKey)
            .update(string)
            .digest(outputType);
    };

    /**
     * Removes /, + and = from the string
     * @returns {string}
     */
    makeStringUrlSafe(urlUnsafeString = '') {
        return urlUnsafeString
            .replaceAll('+', '-')
            .replaceAll('/', '_')
            .replaceAll('=', '');
    };

    /**
     * Encode string to base64 string
     * @param unCodedString
     * @returns {string}
     */
    asciiToBase64(unCodedString) {
        return Buffer.from(unCodedString).toString('base64');
    }

}

module.exports = JwtCreator;
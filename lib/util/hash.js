const crypto = require('crypto');
const commonUtil = require('./commonUtil');

class Hash {
    constructor(defaultValues = {}) {
        this.defaultAlgorithm = defaultValues.defaultAlgorithm || 'sha512';
        this.defaultSecret = defaultValues.defaultSecret || 'dev-secret';
        this.defaultOutputType = defaultValues.defaultOutputType || 'base64';
    }

    /**
     * Create random salt
     * Uses time as input to produce random string
     * @returns {string}
     */
    createRandomSalt(string = new Date().valueOf().toString(),
                     secretKey = this.defaultSecret,
                     algorithm = this.defaultAlgorithm,
                     outputType = this.defaultOutputType) {
        return commonUtil.makeStringUrlSafe(this.createHmacString(string, secretKey, algorithm, outputType));
    };

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

    /** Creates password hash
     * $algorithm.hash.salt
     * @param password
     * @param salt
     * @param secretKey
     * @param algorithm
     * @param outputType
     */
    createPasswordHashStoreString(password = '',
                                  salt = '',
                                  secretKey = this.defaultSecret,
                                  algorithm = this.defaultAlgorithm,
                                  outputType = this.defaultOutputType) {
        let hashString = '$' + algorithm;
        let passwordWithSalt = password + salt;
        hashString += '.' + this.createHmacString(passwordWithSalt, secretKey, algorithm, outputType);
        return commonUtil.makeStringUrlSafe((hashString + '.' + salt));
    }

    /** Verifies hash of the given password
     * true or false
     * @param password
     * @param passwordHashStored
     * @param secretKey
     */
    verifyPasswordHash(password,
                       passwordHashStored,
                       secretKey = this.defaultSecret) {
        const {algorithm, hash, salt} = commonUtil.decomposePasswordHashStoreString(passwordHashStored);
        const passwordHashCalculated = this.createPasswordHashStoreString(password, salt, secretKey, algorithm);
        return (passwordHashStored === passwordHashCalculated);
    }
}

module.exports = Hash;
const assert = require('assert').strict;
const index = require('../../index');


describe('JwtReader test', function () {
    const auth = new index.JwtReader();

    describe('jwtIsExpired', function () {
        it('create and verify jwt', function (done) {
            const header = {
                "alg": "sha512",
                "typ": "JWT"
            };
            const payload = {
                "id": "1234567890",
                "time": Date.now()
            };
            const payloadOld = {
                "id": "1234567890",
                "time": (Date.now() - 60005)
            };
            const secretKey = "my-secret-key";
            const jwtFresh = auth.jwtCreate(header, payload, secretKey);
            const jwtOld = auth.jwtCreate(header, payloadOld, secretKey);
            const validNew = auth.jwtIsExpired(jwtFresh, 60);
            const validOld = auth.jwtIsExpired(jwtOld, 60);
            assert.equal(validNew, true, 'jwt verified');
            assert.equal(validOld, false, 'jwt not verified');
            done();
        });
    });

    describe('jwtIsSignatureValid', function () {
        it('create and verify jwt', function (done) {
            const header = {
                "alg": "sha512",
                "typ": "JWT"
            };
            const payload = {
                "id": "1234567890",
                "time": Date.now()
            };
            const secretKey = "my-secret-key";
            const jwt = auth.jwtCreateSHA512(header, payload, secretKey);
            const verified = auth.jwtIsSignatureValid(jwt, secretKey);
            const unVerified = auth.jwtIsSignatureValid((jwt + 'she'), secretKey);
            assert.equal(verified, true, 'jwt verified');
            assert.equal(unVerified, false, 'jwt not verified');
            done();
        });
    });

    describe('jwtRead', function () {
        it('read jwt into an object', function (done) {
            const header = {
                "alg": "sha512",
                "typ": "JWT"
            };
            const payload = {
                "id": "1234567890",
                "time": Date.now()
            };
            const secretKey = "my-secret-key";
            const jwt = auth.jwtCreate(header, payload, secretKey);
            const jwtObject = auth.jwtRead(jwt);
            assert.equal(JSON.stringify(jwtObject.header),
                JSON.stringify(header), 'jwt not equal');
            done();
        });
    });
});
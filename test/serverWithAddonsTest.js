var expect = require('expect.js'),
    request = require('request'),
    Server = require('./fixtures/serverWithAddonsTest/server');

describe('a server with addons', function() {
    var server;

    before(function (done) {
        server = Server('test/fixtures/serverWithAddonsTest', done);
    });

    after(function (done) {
        server.close(done);
    });

    it('should be able to add a middleware higher order function', function (done) {
        request.get('http://localhost:3000/addition', function (err, res, body) {
            var json = JSON.parse(body);

            expect(res.statusCode).to.be(200);
            expect(json).to.be(6);

            done();
        });
    });

    it('should be able to inject a dependency into a controller', function (done) {
        request.get('http://localhost:3000/multiply', function (err, res, body) {
            var json = JSON.parse(body);

            expect(res.statusCode).to.be(200);
            expect(json).to.be(250);

            done();
        });
    });

    it('should be able to inject the express app object', function (done) {
        request.get('http://localhost:3000/expressApp', function (err, res, body) {
            var json = JSON.parse(body);

            expect(res.statusCode).to.be(200);
            expect(json).to.be('3xpr355');

            done();
        });
    });

    it('should be able to add a directory of middleware and services', function (done) {
        request.get('http://localhost:3000/expression', function (err, res, body) {
            var json = JSON.parse(body);

            expect(res.statusCode).to.be(200);
            expect(json.smile).to.be('VERY BIG smile');
            expect(json.wink).to.be('SMALL wink');

            done();
        });
    });

    it('should be able to resolve a function', function (done) {
        request.get('http://localhost:3000/customResolved', function (err, res, body) {
            var json = JSON.parse(body);

            expect(res.statusCode).to.be(200);
            expect(json.smileSize).to.be('VERY BIG');
            expect(json.winkSize).to.be('SMALL');

            done();
        });
    });

    it('should be able to resolve a directory - firstJob', function (done) {
        request.get('http://localhost:3000/doFirstJob', function (err, res, body) {
            var json = JSON.parse(body);

            expect(res.statusCode).to.be(200);
            expect(json).to.be('firstJobResult');

            done();
        });
    });

    it('should be able to resolve a directory - secondJob', function (done) {
        request.get('http://localhost:3000/doSecondJob', function (err, res, body) {
            var json = JSON.parse(body);

            expect(res.statusCode).to.be(200);
            expect(json).to.be('secondJobResult');

            done();
        });
    });

    it('should be able to respond with a custom middleware', function (done) {
        request.get('http://localhost:3000/arbMiddleware', function (err, res, body) {
            var json = JSON.parse(body);

            expect(res.statusCode).to.be(200);
            expect(json).to.be('arb string');

            done();
        });
    });
});

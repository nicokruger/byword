var expect = require('expect.js'),
    request = require('request'),
    Server = require('./fixtures/server');

describe('a controllers with basePath set', function() {
    var server;

    before(function(done) {
        server = Server('test/fixtures/basePathTest', done);
    });

    after(function(done) {
        server.close(done);
    });

    it('should be accessible from concatenated path without a leading slash /admin', function(done) {
        request.get('http://localhost:3000/admin', function(err, res) {
            expect(res.statusCode).to.be(200);
            done();
        });
    });

    it('should be accessible from concatenated path without a leading slash /admin/manage', function(done) {
        request.get('http://localhost:3000/admin/manage', function(err, res) {
            expect(res.statusCode).to.be(200);
            done();
        });
    });

    it('should be accessible from concatenated path with a leading slash /products', function(done) {
        request.get('http://localhost:3000/products', function(err, res) {
            expect(res.statusCode).to.be(200);
            done();
        });
    });

    it('should be accessible from concatenated path with a leading slash /products/apple', function(done) {
        request.get('http://localhost:3000/products/apple', function(err, res) {
            expect(res.statusCode).to.be(200);
            done();
        });
    });
});

var expect = require('expect.js'),
    request = require('request'),
    Server = require('./fixtures/server');

describe('a server and controller with all request methods', function() {
    var server;

    before(function(done) {
        server = Server('test/fixtures/requestMethodsTest', done);
    });

    after(function(done) {
        server.close(done);
    });

    it('should be accessible with a get request method', function(done) {
        request.get('http://localhost:3000', function(err, res) {
            expect(res.statusCode).to.be(200);
            done();
        });
    });

    it('should be accessible with a post request method', function(done) {
        request.post('http://localhost:3000', function(err, res) {
            expect(res.statusCode).to.be(200);
            done();
        });
    });

    it('should be accessible with a put request method', function(done) {
        request.put('http://localhost:3000', function(err, res) {
            expect(res.statusCode).to.be(200);
            done();
        });
    });

    it('should be accessible with a delete request method', function(done) {
        request.del('http://localhost:3000', function(err, res) {
            expect(res.statusCode).to.be(200);
            done();
        });
    });
});

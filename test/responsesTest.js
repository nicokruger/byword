var expect = require('expect.js'),
    request = require('request'),
    Server = require('./fixtures/server');

describe('a simple controller', function() {
    var server;

    before(function(done) {
        server = Server('test/fixtures/responsesTest', done);
    });

    after(function(done) {
        server.close(done);
    });

    it('should be able to respond', function(done) {
        request.get('http://127.0.0.1:3000/respond', function(err, res) {
            expect(res.statusCode).to.be(200);
            done();
        });
    });

    it('should be able to redirect', function(done) {
        request.get('http://localhost:3000/redirect', function(err, res) {
            expect(res.statusCode).to.be(200);
            expect(res.req.path).to.be('/somewhere-over-the-rainbow');
            done();
        });
    });

    it('should be able to render a view', function(done) {
        request.get('http://localhost:3000/render', function(err, res) {
            expect(res.statusCode).to.be(200);
            expect(res.body).to.be('<p>welcome</p>');
            done();
        });
    });

    it('should be able to respond with json', function(done) {
        request.get('http://localhost:3000/json', function(err, res, body) {
            var json = JSON.parse(body);
            expect(res.statusCode).to.be(200);
            expect(json).to.eql({
                key1: 'val1',
                key2: 'val2',
                key3: 'val3'
            });
            done();
        });
    });
});

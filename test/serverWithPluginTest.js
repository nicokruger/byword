var expect = require('expect.js'),
    request = require('request'),
    Server = require('./fixtures/serverWithPluginTest/server');

describe('a server with a mongo plugin', function() {
    var server;

    before(function (done) {
        server = Server('test/fixtures/serverWithPluginTest', done);
    });

    after(function (done) {
        server.close(done);
    });

    it('should be able to find all users', function (done) {
        request.get('http://localhost:3000/users', function (err, res, body) {
            var json = JSON.parse(body);

            expect(res.statusCode).to.be(200);
            expect(json.length).to.be(2);
            expect(json[1]).to.be('user2');

            done();
        });
    });

    it('should be able to find a user by id', function (done) {
        request.get('http://localhost:3000/users/1', function (err, res, body) {
            var json = JSON.parse(body);

            expect(res.statusCode).to.be(200);
            expect(json).to.be('user1');

            done();
        });
    });
});

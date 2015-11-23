require("should");
var model = require("../service/model");

describe('model', function () {
    it('should return cached token', function (done) {
        var token = "1626c7115914de88590c15a2cb3ba657079b5ba9";
        model.getAccessToken(token, function(err, result){
            (err === null).should.be.true;
            if (result){
                model.getAccessToken(token, function(err, result){
                    result.cached.should.be.true;
                    done();
                });
            }
        });
    });
});
var proxyquire = require('proxyquire');
var assert = require('assert');
var _ = require('underscore');


module.exports = {
  "setUp": function(done){
    done();
  },
  "tearDown": function(done){
    done();
  },
  "It Should Get A Single Theme": function(done){
    var mocks = {
      '../../mbaasRequest/mbaasRequest.js': {
        app: function(params, cb){
          assert.equal(params.resourcePath, "/appforms/themes");
          assert.equal(params.method, "GET");
          assert.equal(params.domain, "somedomain");
          assert.ok(_.isEqual(params.data, {}), "Expected Objects To Be Equal");

          return cb(undefined, {
            _id: "somethemeid",
            name: "Some Theme Name"
          });
        }
      }
    };

    var themeRequest = proxyquire('../../../lib/app/appforms/themes.js', mocks);

    themeRequest.get({
      environment: "someenv",
      domain: "somedomain"
    }, function(err, result){
      assert.ok(!err, "Expected No Error");

      assert.equal(result.name, "Some Theme Name");
      done();
    });
  }
};
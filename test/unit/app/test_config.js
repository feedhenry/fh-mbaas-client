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
  "It Should Get Forms Config": function(done){
    var mocks = {
      '../../mbaasRequest/mbaasRequest.js': {
        app: function(params, cb){
          assert.equal(params.resourcePath, "/appforms/config");
          assert.equal(params.method, "GET");
          assert.equal(params.domain, "somedomain");
          assert.ok(_.isEqual(params.data, {}), "Expected Objects To Be Equal");

          return cb(undefined, {
            photoHeight: 100
          });
        }
      }
    };

    var configRequest = proxyquire('../../../lib/app/appforms/config.js', mocks);

    configRequest.get({
      projectId: "someprojectid",
      appId: "someappid",
      environment: "someenv",
      domain: "somedomain"
    }, function(err, result){
      assert.ok(!err, "Expected No Error");

      assert.equal(result.photoHeight, 100);
      done();
    });
  }
};
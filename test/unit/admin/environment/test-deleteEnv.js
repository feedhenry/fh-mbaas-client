var proxyquire = require('proxyquire');
var assert = require('assert');
var constants = require('../../../../lib/config/constants');

module.exports = {
  "test_delete_environment" : function(done){
    var mocks = {
      '../../mbaasRequest/mbaasRequest.js': {
        admin: function(params, cb) {
          assert.equal(params.resourcePath, "/somedomain/someenv");
          assert.equal(params.method, "DELETE");
          return cb(undefined, {});
        }
      }
    };

    var deleteEnv = proxyquire('../../../../lib/admin/environment/deleteEnv.js', mocks);
    var params = {
      environment: "someenv",
      domain: "somedomain"
    };

    params[constants.MBAAS_CONF_KEY] = {__mbaasUrl: "http://test.com"};

    deleteEnv(params, function(err) {
      assert.ok(!err, "Expected No Error");
      done();
    });
  }
};

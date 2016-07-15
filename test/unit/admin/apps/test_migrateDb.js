var proxyquire = require('proxyquire');
var assert = require('assert');
var _ = require('underscore');
var constants = require('../../../../lib/config/constants');

module.exports = {
  "Test Migrate Db": function(done) {
    var mockMigrateData = {
      cacheKey: "somecachekey",
      appGuid: "appguid",
      apiKey: "someapikey",
      coreHost: "hostname"
    };

    var mockMigrateResult = { cacheKey: 'somecachekey',
      domain: 'somedomain',
      env: 'someenv',
      appName: 'somedomain-appguid-someenv',
      appGuid: 'appguid',
      status: 'submitted' };

    var mocks = {
      '../../mbaasRequest/mbaasRequest.js': {
        admin: function(params, cb) {
          assert.equal(params.resourcePath, "/apps/somedomain/someenv/somedomain-appguid-someenv/migratedb");
          assert.equal(params.method, "POST");
          assert.ok(_.isEqual(params.data, mockMigrateData), "Expected Objects To Be Equal");

          return cb(undefined, mockMigrateResult);
        }
      }
    };

    var migrateRequest = proxyquire('../../../../lib/admin/apps/migrateDb.js', mocks);

    var params = {
      environment: "someenv",
      domain: "somedomain",
      appname: "somedomain-appguid-someenv",
      data: mockMigrateData
    };

    params[constants.MBAAS_CONF_KEY] = {__mbaasUrl: "http://test.com"};

    migrateRequest(params, function(err, result) {
      assert.ok(!err, "Expected No Error");

      assert.equal(result, mockMigrateResult);
      done();
    });
  }
};
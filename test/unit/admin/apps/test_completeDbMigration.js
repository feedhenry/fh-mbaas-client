var proxyquire = require('proxyquire');
var assert = require('assert');
var _ = require('underscore');


module.exports = {
  "Test Migrate Db": function(done){
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
      status: 'complete' };

    var mocks = {
      '../../mbaasRequest/mbaasRequest.js': {
        admin: function(params, cb){
          assert.equal(params.resourcePath, "/apps/somedomain/someenv/somedomain-appguid-someenv/migrateComplete");
          assert.equal(params.method, "POST");
          assert.ok(_.isEqual(params.data, mockMigrateData), "Expected Objects To Be Equal");

          return cb(undefined, mockMigrateResult);
        }
      }
    };

    var migrateCompleteRequest = proxyquire('../../../../lib/admin/apps/completeDbMigration.js', mocks);

    migrateCompleteRequest({
      environment: "someenv",
      domain: "somedomain",
      appname: "somedomain-appguid-someenv",
      data: mockMigrateData
    }, function(err, result){
      assert.ok(!err, "Expected No Error");

      assert.equal(result, mockMigrateResult);
      done();
    });
  }
};
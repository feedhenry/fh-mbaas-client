var proxyquire = require('proxyquire');
var assert = require('assert');
var _ = require('underscore');

var testService = {
  guid: "someserviceguid",
  dataSources: ["somedatasourceid"]
};

module.exports = {
  "It Should List Services": function(done) {
    var mocks = {
      '../../mbaasRequest/mbaasRequest.js': {
        admin: function(params, cb) {
          assert.equal(params.resourcePath, "/somedomain/services");
          assert.equal(params.method, "GET");
          assert.equal(params.domain, "somedomain");
          assert.ok(_.isEqual(params.data, {}), "Expected Objects To Be Equal");

          return cb(undefined, [testService]);
        }
      }
    };

    var servicesRequest = proxyquire('../../../lib/admin/services/services.js', mocks);

    servicesRequest.list({
      domain: "somedomain",
      guid: "someserviceguid"
    }, function(err, result) {
      assert.ok(!err, "Expected No Error");

      assert.equal(result[0].guid, "someserviceguid");

      done();
    });
  },
  "It Should Get A Single Service": function(done) {
    var mocks = {
      '../../mbaasRequest/mbaasRequest.js': {
        admin: function(params, cb) {
          assert.equal(params.resourcePath, "/somedomain/services/someserviceguid");
          assert.equal(params.method, "GET");
          assert.equal(params.domain, "somedomain");
          assert.equal(params.guid, "someserviceguid");
          assert.ok(_.isEqual(params.data, {}), "Expected Objects To Be Equal");

          return cb(undefined, testService);
        }
      }
    };

    var servicesRequest = proxyquire('../../../lib/admin/services/services.js', mocks);

    servicesRequest.get({
      domain: "somedomain",
      guid: "someserviceguid"
    }, function(err, result) {
      assert.ok(!err, "Expected No Error");

      assert.equal(result.guid, "someserviceguid");
      done();
    });
  },
  "It Should Deploy A Single Service": function(done) {
    var mocks = {
      '../../mbaasRequest/mbaasRequest.js': {
        admin: function(params, cb) {
          assert.equal(params.resourcePath, "/somedomain/services/someserviceguid/deploy");
          assert.equal(params.method, "POST");
          assert.equal(params.domain, "somedomain");
          assert.equal(params.guid, "someserviceguid");
          assert.ok(_.isEqual(params.data, testService), "Expected Objects To Be Equal");

          return cb(undefined, testService);
        }
      }
    };

    var servicesRequest = proxyquire('../../../lib/admin/services/services.js', mocks);

    servicesRequest.deploy({
      domain: "somedomain",
      guid: "someserviceguid",
      service: testService
    }, function(err, result) {
      assert.ok(!err, "Expected No Error");

      assert.equal(result.guid, "someserviceguid");
      done();
    });
  }
};
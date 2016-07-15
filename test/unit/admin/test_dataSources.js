var proxyquire = require('proxyquire');
var assert = require('assert');
var _ = require('underscore');
var stubs = require('../../fixtures/stubs');
var sinon = require('sinon');

module.exports = {
  "Test Get Data Source": function(done) {
    var mocks = {
      '../../mbaasRequest/mbaasRequest.js': {
        admin: function(params, cb) {
          assert.equal(params.resourcePath, "/somedomain/someenv/appforms/data_sources/somedatasourceid");
          assert.equal(params.method, "GET");
          assert.equal(params.domain, "somedomain");
          assert.ok(_.isEqual(params.data, {}), "Expected Objects To Be Equal");

          return cb(undefined, {
            _id: "somedatasourceid"
          });
        }
      }
    };

    var dataSourcesRequest = proxyquire('../../../lib/admin/appforms/dataSources.js', mocks);

    dataSourcesRequest.get({
      environment: "someenv",
      domain: "somedomain",
      id: "somedatasourceid"
    }, function(err, result) {
      assert.ok(!err, "Expected No Error");

      assert.equal(result._id, "somedatasourceid");
      done();
    });
  },
  "Test List Data Sources": function(done) {
    var mocks = {
      '../../mbaasRequest/mbaasRequest.js': {
        admin: function(params, cb) {
          assert.equal(params.resourcePath, "/somedomain/someenv/appforms/data_sources");
          assert.equal(params.method, "GET");
          assert.equal(params.domain, "somedomain");
          assert.ok(_.isEqual(params.data, {}), "Expected Objects To Be Equal");

          return cb(undefined, [{
            _id: "somedatasourceid"
          }]);
        }
      }
    };

    var formsRequest = proxyquire('../../../lib/admin/appforms/dataSources.js', mocks);

    formsRequest.list({
      environment: "someenv",
      domain: "somedomain"
    }, function(err, result) {
      assert.ok(!err, "Expected No Error");

      assert.equal(result[0]._id, "somedatasourceid");
      done();
    });
  },
  "Test Deploy Data Source": function(done) {
    var testDataSource = {
      _id: "somedatasourceid",
      name: "Some Data Source Name"
    };

    var mocks = {
      '../../mbaasRequest/mbaasRequest.js': {
        admin: function(params, cb) {
          assert.equal(params.resourcePath, "/somedomain/someenv/appforms/data_sources/somedatasourceid/deploy");
          assert.equal(params.method, "POST");
          assert.equal(params.domain, "somedomain");
          assert.equal(params.data, testDataSource);

          return cb(undefined, {
            _id: "somedatasourceid"
          });
        }
      }
    };

    var dataSourceRequest = proxyquire('../../../lib/admin/appforms/dataSources.js', mocks);

    dataSourceRequest.deploy({
      environment: "someenv",
      domain: "somedomain",
      id: "somedatasourceid",
      dataSource: testDataSource
    }, function(err, result) {
      assert.ok(!err, "Expected No Error");

      assert.equal(result._id, "somedatasourceid");
      done();
    });
  },
  "Test Remove Data Source": function(done) {
    var mocks = {
      '../../mbaasRequest/mbaasRequest.js': {
        admin: function(params, cb) {
          assert.equal(params.resourcePath, "/somedomain/someenv/appforms/data_sources/somedatasourceid");
          assert.equal(params.method, "DELETE");
          assert.equal(params.domain, "somedomain");
          assert.ok(_.isEqual(params.data, {}), "Expected Objects To Be Equal");

          return cb(undefined, {});
        }
      }
    };

    var dataSourceRequest = proxyquire('../../../lib/admin/appforms/dataSources.js', mocks);

    dataSourceRequest.remove({
      environment: "someenv",
      domain: "somedomain",
      id: "somedatasourceid"
    }, function(err, result) {
      assert.ok(!err, "Expected No Error");
      assert.ok(result, "Expected A Result");

      done();
    });
  },
  "Test Validate Data Source": function(done) {
    var testDataSource = {
      name: "Some Data Source Name"
    };

    var mocks = {
      '../../mbaasRequest/mbaasRequest.js': {
        admin: function(params, cb) {
          assert.equal(params.resourcePath, "/somedomain/someenv/appforms/data_sources/validate");
          assert.equal(params.method, "POST");
          assert.equal(params.domain, "somedomain");
          assert.ok(_.isEqual(params.data, testDataSource), "Expected Objects To Be Equal");

          return cb(undefined, testDataSource);
        }
      }
    };

    var dataSourceRequest = proxyquire('../../../lib/admin/appforms/dataSources.js', mocks);

    dataSourceRequest.validate({
      environment: "someenv",
      domain: "somedomain",
      dataSource: testDataSource
    }, function(err, result) {
      assert.ok(!err, "Expected No Error");
      assert.ok(result, "Expected A Result");

      done();
    });
  },
  "Test Refresh Data Source": function(done) {
    var mocks = {
      '../../mbaasRequest/mbaasRequest.js': {
        admin: function(params, cb) {
          assert.equal(params.resourcePath, "/somedomain/someenv/appforms/data_sources/somedatasourceid/refresh");
          assert.equal(params.method, "POST");
          assert.equal(params.domain, "somedomain");
          assert.ok(_.isEqual(params.data, {}), "Expected Objects To Be Equal");

          return cb(undefined, {
            _id: "somedatasourceid"
          });
        }
      }
    };

    var dataSourceRequest = proxyquire('../../../lib/admin/appforms/dataSources.js', mocks);

    dataSourceRequest.refresh({
      environment: "someenv",
      domain: "somedomain",
      id: "somedatasourceid"
    }, function(err, result) {
      assert.ok(!err, "Expected No Error");
      assert.ok(result, "Expected A Result");

      done();
    });
  },
  "Test Get Data Source With Audit Logs": function(done) {
    var expectedParams = {
      resourcePath: "/somedomain/someenv/appforms/data_sources/somedatasourceid/audit_logs",
      method: "GET",
      id: "somedatasourceid",
      domain: "somedomain",
      environment: "someenv"
    };

    var mbaasRequestStub = stubs.mbaasRequest(expectedParams, {
      _id: "somedatasourceid",
      name: "Some Data Source",
      serviceGuid: "someserviceid",
      auditLogs: [{
        updateTimestamp: new Date(),
        data: [{
          key: "op1",
          value: "Option 1",
          selected: true
        }]
      }]
    });

    var mocks = {
      '../../mbaasRequest/mbaasRequest.js': {
        admin: mbaasRequestStub
      }
    };

    var dataSourceRequest = proxyquire('../../../lib/admin/appforms/dataSources.js', mocks);

    dataSourceRequest.getAuditLogs({
      environment: "someenv",
      domain: "somedomain",
      id: "somedatasourceid"
    }, function(err, result) {
      assert.ok(!err, "Expected No Error");
      assert.ok(result, "Expected A Result");

      assert.ok(_.isArray(result.auditLogs));
      sinon.assert.calledOnce(mbaasRequestStub);

      done();
    });
  },
  "Test Get Single Audit Log Entry": function(done) {
    var expectedParams = {
      resourcePath: "/somedomain/someenv/appforms/data_sources/audit_logs/someauditlogid",
      method: "GET",
      id: "someauditlogid",
      domain: "somedomain",
      environment: "someenv"
    };

    var mbaasRequestStub = stubs.mbaasRequest(expectedParams, {
      _id: "someauditlogid",
      updateTimestamp: new Date(),
      data: [{
        key: "op1",
        value: "Option 1",
        selected: true
      }]
    });

    var mocks = {
      '../../mbaasRequest/mbaasRequest.js': {
        admin: mbaasRequestStub
      }
    };

    var dataSourceRequest = proxyquire('../../../lib/admin/appforms/dataSources.js', mocks);

    dataSourceRequest.getAuditLogEntry({
      environment: "someenv",
      domain: "somedomain",
      id: "someauditlogid"
    }, function(err, result) {
      assert.ok(!err, "Expected No Error");
      assert.ok(result, "Expected A Result");

      assert.equal(result._id, "someauditlogid");
      sinon.assert.calledOnce(mbaasRequestStub);

      done();
    });
  }
};

var proxyquire = require('proxyquire');
var assert = require('assert');
var _ = require('underscore');

module.exports = {
  "setUp": function(done) {
    done();
  },
  "tearDown": function(done) {
    done();
  },
  "Test Get Form": function(done) {
    var mocks = {
      '../../mbaasRequest/mbaasRequest.js': {
        admin: function(params, cb) {
          assert.equal(params.resourcePath, "/somedomain/someenv/appforms/forms/someformid");
          assert.equal(params.method, "GET");
          assert.equal(params.domain, "somedomain");
          assert.ok(_.isEqual(params.data, {}), "Expected Objects To Be Equal");

          return cb(undefined, {
            _id: "someformid"
          });
        }
      }
    };

    var formsRequest = proxyquire('../../../lib/admin/appforms/forms.js', mocks);

    formsRequest.get({
      environment: "someenv",
      domain: "somedomain",
      id: "someformid"
    }, function(err, result) {
      assert.ok(!err, "Expected No Error");

      assert.equal(result._id, "someformid");
      done();
    });
  },
  "Test List Forms": function(done) {
    var mocks = {
      '../../mbaasRequest/mbaasRequest.js': {
        admin: function(params, cb) {
          assert.equal(params.resourcePath, "/somedomain/someenv/appforms/forms");
          assert.equal(params.method, "GET");
          assert.equal(params.domain, "somedomain");
          assert.ok(_.isEqual(params.data, {}), "Expected Objects To Be Equal");

          return cb(undefined, [{
            _id: "someformid"
          }]);
        }
      }
    };

    var formsRequest = proxyquire('../../../lib/admin/appforms/forms.js', mocks);

    formsRequest.list({
      environment: "someenv",
      domain: "somedomain"
    }, function(err, result) {
      assert.ok(!err, "Expected No Error");

      assert.equal(result[0]._id, "someformid");
      done();
    });
  },
  "Test Deploy Form": function(done) {
    var testForm = {
      _id: "someformid",
      name: "Some Form Name"
    };

    var mocks = {
      '../../mbaasRequest/mbaasRequest.js': {
        admin: function(params, cb) {
          assert.equal(params.resourcePath, "/somedomain/someenv/appforms/forms/someformid/deploy");
          assert.equal(params.method, "POST");
          assert.equal(params.domain, "somedomain");
          assert.equal(params.data, testForm);

          return cb(undefined, {
            _id: "someformid"
          });
        }
      }
    };

    var formsRequest = proxyquire('../../../lib/admin/appforms/forms.js', mocks);

    formsRequest.deploy({
      environment: "someenv",
      domain: "somedomain",
      id: "someformid",
      form: testForm
    }, function(err, result) {
      assert.ok(!err, "Expected No Error");

      assert.equal(result._id, "someformid");
      done();
    });
  },
  "Test Remove Form": function(done) {
    var mocks = {
      '../../mbaasRequest/mbaasRequest.js': {
        admin: function(params, cb) {
          assert.equal(params.resourcePath, "/somedomain/someenv/appforms/forms/someformid");
          assert.equal(params.method, "DELETE");
          assert.equal(params.domain, "somedomain");
          assert.ok(_.isEqual(params.data, {}), "Expected Objects To Be Equal");

          return cb(undefined, {});
        }
      }
    };

    var formsRequest = proxyquire('../../../lib/admin/appforms/forms.js', mocks);

    formsRequest.remove({
      environment: "someenv",
      domain: "somedomain",
      id: "someformid"
    }, function(err, result) {
      assert.ok(!err, "Expected No Error");
      assert.ok(result, "Expected A Result");

      done();
    });
  },
  "Test Undeploy Form": function(done) {
    var mocks = {
      '../../mbaasRequest/mbaasRequest.js': {
        admin: function(params, cb) {
          assert.equal(params.resourcePath, "/somedomain/someenv/appforms/forms/someformid/undeploy");
          assert.equal(params.method, "POST");
          assert.equal(params.domain, "somedomain");
          assert.ok(_.isEqual(params.data, {}), "Expected Objects To Be Equal");

          return cb(undefined, {});
        }
      }
    };

    var formsRequest = proxyquire('../../../lib/admin/appforms/forms.js', mocks);

    formsRequest.undeploy({
      environment: "someenv",
      domain: "somedomain",
      id: "someformid"
    }, function(err, result) {
      assert.ok(!err, "Expected No Error");
      assert.ok(result, "Expected A Result");

      done();
    });
  },
  "Test Get Form Submissions": function(done) {
    var mocks = {
      '../../mbaasRequest/mbaasRequest.js': {
        admin: function(params, cb) {
          assert.equal(params.resourcePath, "/somedomain/someenv/appforms/forms/someformid/submissions");
          assert.equal(params.method, "GET");
          assert.equal(params.domain, "somedomain");
          assert.ok(_.isEqual(params.data, {}), "Expected Objects To Be Equal");

          return cb(undefined, {});
        }
      }
    };

    var formsRequest = proxyquire('../../../lib/admin/appforms/forms.js', mocks);

    formsRequest.submissions({
      environment: "someenv",
      domain: "somedomain",
      id: "someformid"
    }, function(err, result) {
      assert.ok(!err, "Expected No Error");
      assert.ok(result, "Expected A Result");

      done();
    });
  }
};
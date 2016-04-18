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
  "It Should List Forms": function(done) {
    var mocks = {
      '../../mbaasRequest/mbaasRequest.js': {
        app: function(params, cb) {
          assert.equal(params.resourcePath, "/appforms/forms");
          assert.equal(params.method, "GET");
          assert.ok(_.isEqual(params.data, {}), "Expected Objects To Be Equal");

          return cb(undefined, [
            {
              _id: "someformid",
              name: "Some Form Name"
            }
          ]);
        }
      }
    };

    var formsRequest = proxyquire('../../../lib/app/appforms/forms.js', mocks);

    formsRequest.list({
      environment: "someenv",
      domain: "somedomain"
    }, function(err, result) {
      assert.ok(!err, "Expected No Error");

      assert.equal(result[0]._id, "someformid");
      done();
    });
  },
  "It Should Get A Single Form": function(done) {
    var mocks = {
      '../../mbaasRequest/mbaasRequest.js': {
        app: function(params, cb) {
          assert.equal(params.resourcePath, "/appforms/forms/someformid");
          assert.equal(params.method, "GET");
          assert.equal(params.domain, "somedomain");
          assert.ok(_.isEqual(params.data, {}), "Expected Objects To Be Equal");

          return cb(undefined, {
            _id: "someformid",
            name: "Some Form Name"
          });
        }
      }
    };

    var formsRequest = proxyquire('../../../lib/app/appforms/forms.js', mocks);

    formsRequest.get({
      id: "someformid",
      environment: "someenv",
      domain: "somedomain"
    }, function(err, result) {
      assert.ok(!err, "Expected No Error");

      assert.equal(result._id, "someformid");
      done();
    });
  },
  "It Should Submit Data For Single Form": function(done) {
    var testSubmission = {
      formId: "someformid",
      formFields: [
        {
          fieldId: "somefieldid",
          fieldValues: ["Some Field Value"]
        }
      ]
    };

    var mocks = {
      '../../mbaasRequest/mbaasRequest.js': {
        app: function(params, cb) {
          assert.equal(params.resourcePath, "/appforms/forms/someformid/submitFormData");
          assert.equal(params.method, "POST");
          assert.equal(params.domain, "somedomain");
          assert.equal(params.data, testSubmission);

          return cb(undefined, {
            _id: "someformid"
          });
        }
      }
    };

    var formsRequest = proxyquire('../../../lib/app/appforms/forms.js', mocks);

    formsRequest.submitFormData({
      id: "someformid",
      submission: testSubmission,
      environment: "someenv",
      domain: "somedomain"
    }, function(err, result) {
      assert.ok(!err, "Expected No Error");

      assert.equal(result._id, "someformid");
      done();
    });
  }
};
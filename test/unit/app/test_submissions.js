var proxyquire = require('proxyquire');
var assert = require('assert');
var _ = require('underscore');
var MockReadStream = require('../../fixtures/mock_readStream.js');
var MockWriteStream = require('../../fixtures/mock_writeStream.js');


module.exports = {
  "setUp": function(done) {
    done();
  },
  "tearDown": function(done) {
    done();
  },
  "It Should Get List Submissions": function(done) {
    var mocks = {
      '../../mbaasRequest/mbaasRequest.js': {
        app: function(params, cb) {
          assert.equal(params.resourcePath, "/appforms/submissions");
          assert.equal(params.method, "GET");
          assert.equal(params.domain, "somedomain");
          assert.ok(_.isEqual(params.data, {}), "Expected Objects To Be Equal");

          return cb(undefined, [
            {
              _id: "somesubmissionid",
              formId: "someformid"
            }
          ]);
        }
      }
    };

    var submissionsRequest = proxyquire('../../../lib/app/appforms/submissions.js', mocks);

    submissionsRequest.list({
      environment: "someenv",
      domain: "somedomain"
    }, function(err, result) {
      assert.ok(!err, "Expected No Error");

      assert.equal(result[0]._id, "somesubmissionid");
      done();
    });
  },
  "It Should Get A Single Submissions": function(done) {
    var mocks = {
      '../../mbaasRequest/mbaasRequest.js': {
        app: function(params, cb) {
          assert.equal(params.resourcePath, "/appforms/submissions/somesubmissionid");
          assert.equal(params.method, "GET");
          assert.equal(params.domain, "somedomain");
          assert.ok(_.isEqual(params.data, {}), "Expected Objects To Be Equal");

          return cb(undefined,  {
            _id: "somesubmissionid",
            formId: "someformid"
          });
        }
      }
    };

    var submissionsRequest = proxyquire('../../../lib/app/appforms/submissions.js', mocks);

    submissionsRequest.get({
      id: "somesubmissionid",
      environment: "someenv",
      domain: "somedomain"
    }, function(err, result) {
      assert.ok(!err, "Expected No Error");

      assert.equal(result._id, "somesubmissionid");
      done();
    });
  },
  "It Should Upload A Single File For A Submission": function(done) {

    var mockReadStream = new MockReadStream();

    var fileDetails = {
      stream: mockReadStream,
      type: "application/pdf",
      size: 1245,
      name: "fileName.pdf"
    };

    var mocks = {
      '../../mbaasRequest/mbaasRequest.js': {
        app: function(params, cb) {
          assert.equal(params.resourcePath, "/appforms/submissions/somesubmissionid/fields/somefieldid/files/filePlaceholder1234");
          assert.equal(params.method, "POST");
          assert.equal(params.domain, "somedomain");
          assert.equal(params.data, fileDetails);
          assert.equal(params.fileRequest, true);
          assert.equal(params.fileUploadRequest, true);

          var mockWriteStream = new MockWriteStream();

          mockWriteStream.on('finish', function() {
            return cb(undefined,  {});
          });

          mockWriteStream.on('error', function(err) {
            return cb(err);
          });


          params.data.stream.pipe(mockWriteStream);
        }
      }
    };

    var submissionsRequest = proxyquire('../../../lib/app/appforms/submissions.js', mocks);

    submissionsRequest.uploadFile({
      id: "somesubmissionid",
      fieldId: "somefieldid",
      fileId: "filePlaceholder1234",
      fileDetails: fileDetails,
      environment: "someenv",
      domain: "somedomain"
    }, function(err, result) {
      assert.ok(!err, "Expected No Error");

      assert.ok(result);
      done();
    });
  },
  "It Should Get Upload Status For A Submission": function(done) {
    var mocks = {
      '../../mbaasRequest/mbaasRequest.js': {
        app: function(params, cb) {
          assert.equal(params.resourcePath, "/appforms/submissions/somesubmissionid/status");
          assert.equal(params.method, "GET");
          assert.equal(params.domain, "somedomain");
          assert.ok(_.isEqual(params.data, {}), "Expected Objects To Be Equal");

          return cb(undefined,  {
            _id: "somesubmissionid",
            status: "pending/complete/error",
            pendingFiles: ["filePlaceholder1241"]
          });
        }
      }
    };

    var submissionsRequest = proxyquire('../../../lib/app/appforms/submissions.js', mocks);

    submissionsRequest.status({
      id: "somesubmissionid",
      environment: "someenv",
      domain: "somedomain"
    }, function(err, result) {
      assert.ok(!err, "Expected No Error");

      assert.equal(result.status, "pending/complete/error");
      done();
    });
  },
  "It Should Complete A Submission": function(done) {
    var mocks = {
      '../../mbaasRequest/mbaasRequest.js': {
        app: function(params, cb) {
          assert.equal(params.resourcePath, "/appforms/submissions/somesubmissionid/complete");
          assert.equal(params.method, "POST");
          assert.equal(params.domain, "somedomain");
          assert.ok(_.isEqual(params.data, {}), "Expected Objects To Be Equal");

          return cb(undefined,  {
            _id: "somesubmissionid",
            formId: "someformid"
          });
        }
      }
    };

    var submissionsRequest = proxyquire('../../../lib/app/appforms/submissions.js', mocks);

    submissionsRequest.complete({
      id: "somesubmissionid",
      environment: "someenv",
      domain: "somedomain"
    }, function(err, result) {
      assert.ok(!err, "Expected No Error");

      assert.equal(result._id, "somesubmissionid");
      done();
    });
  }
};
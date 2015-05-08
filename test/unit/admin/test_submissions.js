var proxyquire = require('proxyquire');
var assert = require('assert');
var _ = require('underscore');
var MockReadStream = require('../../fixtures/mock_readStream.js');
var MockWriteStream = require('../../fixtures/mock_writeStream.js');


module.exports = {
  "setUp": function (done) {
    done();
  },
  "tearDown": function (done) {
    done();
  },
  "Test Get Submission": function (done) {
    var mocks = {
      '../../mbaasRequest/mbaasRequest.js': {
        admin: function (params, cb) {
          assert.equal(params.resourcePath, "/somedomain/someenv/appforms/submissions/somesubmissionid");
          assert.equal(params.method, "GET");
          assert.equal(params.domain, "somedomain");
          assert.ok(_.isEqual(params.data, {}), "Expected Objects To Be Equal");

          return cb(undefined, {
            _id: "somesubmissionid",
            formId: "someformid"
          });
        }
      }
    };

    var submissionsRequest = proxyquire('../../../lib/admin/appforms/submissions.js', mocks);

    submissionsRequest.get({
      environment: "someenv",
      domain: "somedomain",
      id: "somesubmissionid"
    }, function (err, result) {
      assert.ok(!err, "Expected No Error");

      assert.equal(result._id, "somesubmissionid");
      done();
    });
  },
  "Test List Submission": function (done) {
    var mocks = {
      '../../mbaasRequest/mbaasRequest.js': {
        admin: function (params, cb) {
          assert.equal(params.resourcePath, "/somedomain/someenv/appforms/submissions");
          assert.equal(params.method, "GET");
          assert.equal(params.domain, "somedomain");
          assert.ok(_.isEqual(params.data, {}), "Expected Objects To Be Equal");

          return cb(undefined, [{
            _id: "somesubmissionid",
            formId: "someformid"
          }]);
        }
      }
    };

    var submissionsRequest = proxyquire('../../../lib/admin/appforms/submissions.js', mocks);

    submissionsRequest.list({
      environment: "someenv",
      domain: "somedomain"
    }, function (err, result) {
      assert.ok(!err, "Expected No Error");

      assert.equal(result[0]._id, "somesubmissionid");
      done();
    });
  },
  "Test Remove Submission": function (done) {
    var mocks = {
      '../../mbaasRequest/mbaasRequest.js': {
        admin: function (params, cb) {
          assert.equal(params.resourcePath, "/somedomain/someenv/appforms/submissions/somesubmissionid");
          assert.equal(params.method, "DELETE");
          assert.equal(params.domain, "somedomain");
          assert.ok(_.isEqual(params.data, {}), "Expected Objects To Be Equal");

          return cb(undefined, {});
        }
      }
    };

    var submissionsRequest = proxyquire('../../../lib/admin/appforms/submissions.js', mocks);

    submissionsRequest.remove({
      environment: "someenv",
      domain: "somedomain",
      id: "somesubmissionid"
    }, function (err, result) {
      assert.ok(!err, "Expected No Error");
      assert.ok(result, "Expected A Result");

      done();
    });
  },
  "Test Update Submission": function (done) {
    var testSub = {
      _id: "somesubmissionid",
      formId: "someformid"
    };

    var mocks = {
      '../../mbaasRequest/mbaasRequest.js': {
        admin: function (params, cb) {
          assert.equal(params.resourcePath, "/somedomain/someenv/appforms/submissions/somesubmissionid");
          assert.equal(params.method, "PUT");
          assert.equal(params.domain, "somedomain");
          assert.equal(params.data, testSub);

          testSub.testVal = true;

          return cb(undefined, testSub);
        }
      }
    };

    var submissionsRequest = proxyquire('../../../lib/admin/appforms/submissions.js', mocks);

    submissionsRequest.update({
      environment: "someenv",
      domain: "somedomain",
      id: "somesubmissionid",
      submission: testSub
    }, function (err, result) {
      assert.ok(!err, "Expected No Error");

      assert.equal(result.testVal, true);

      done();
    });
  },
  "Test Update Submission File": function (done) {

    var mockReadStream = new MockReadStream();

    var fileDetails = {
      stream: mockReadStream,
      type: "application/pdf",
      size: 1245,
      name: "fileName.pdf"
    };

    var mocks = {
      '../../mbaasRequest/mbaasRequest.js': {
        admin: function (params, cb) {
          assert.equal(params.resourcePath, "/somedomain/someenv/appforms/submissions/somesubmissionid/fields/somefieldid/files/somefileid");
          assert.equal(params.method, "PUT");
          assert.equal(params.domain, "somedomain");
          assert.equal(params.data, fileDetails);
          assert.equal(params.fileRequest, true);
          assert.equal(params.fileUploadRequest, true);


          return cb(undefined, {});
        }
      }
    };

    var submissionsRequest = proxyquire('../../../lib/admin/appforms/submissions.js', mocks);

    submissionsRequest.updateFile({
      environment: "someenv",
      domain: "somedomain",
      id: "somesubmissionid",
      fieldId: "somefieldid",
      fileId: "somefileid",
      fileDetails: fileDetails
    }, function (err) {
      assert.ok(!err, "Expected No Error");
      done();
    });
  },
  "Test Export Submissions": function (done) {
    var testSubSearch = {
      "formId": "someformid",
      "clauseOperator": "and",
      "queryFields": {"clauses": [{"fieldId": "somefieldid", "restriction": "is", "value": "sometextval"}]}
    };

    var mocks = {
      '../../mbaasRequest/mbaasRequest.js': {
        admin: function (params, cb) {
          assert.equal(params.resourcePath, "/somedomain/someenv/appforms/submissions/export");
          assert.equal(params.method, "POST");
          assert.equal(params.domain, "somedomain");
          assert.equal(params.data, testSubSearch);
          assert.equal(params.fileRequest, true);
          assert.ok(!params.fileUploadRequest, "Expected No File Upload Request");


          return cb(undefined, new MockReadStream());
        }
      }
    };

    var submissionsRequest = proxyquire('../../../lib/admin/appforms/submissions.js', mocks);

    submissionsRequest.export({
      environment: "someenv",
      domain: "somedomain",
      id: "somesubmissionid",
      queryParams: testSubSearch
    }, function (err, readableStream) {
      assert.ok(!err, "Expected No Error");

      var pipeCalled = false;
      //The response from an export is a zip file containing the exported submissions
      var mockWriteStream = new MockWriteStream();

      mockWriteStream.on('pipe', function(){
        pipeCalled = true;
      });

      readableStream.on('end', function(){
        assert.ok(pipeCalled, "Expected The Pipe Event To Be Triggered");
        done();
      });

      readableStream.pipe(mockWriteStream);
    });
  },
  "Test Search Submissions": function (done) {
    var testSubSearch = {
      "formId": "someformid",
      "clauseOperator": "and",
      "queryFields": {"clauses": [{"fieldId": "somefieldid", "restriction": "is", "value": "sometextval"}]}
    };

    var mocks = {
      '../../mbaasRequest/mbaasRequest.js': {
        admin: function (params, cb) {
          assert.equal(params.resourcePath, "/somedomain/someenv/appforms/submissions/search");
          assert.equal(params.method, "POST");
          assert.equal(params.domain, "somedomain");
          assert.equal(params.data, testSubSearch);


          return cb(undefined, [{
            _id: "somesubmissionid",
            formId: "someformid"
          }]);
        }
      }
    };

    var submissionsRequest = proxyquire('../../../lib/admin/appforms/submissions.js', mocks);

    submissionsRequest.search({
      environment: "someenv",
      domain: "somedomain",
      id: "somesubmissionid",
      queryParams: testSubSearch
    }, function (err, result) {
      assert.ok(!err, "Expected No Error");

      assert.equal(result[0]._id, "somesubmissionid");

      done();
    });
  }
};
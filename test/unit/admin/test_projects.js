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
  "Test Create Form Project": function(done){

    var mockProjectDetails = {
      _id: "someformprojectid",
      appId: "someprojectguid",
      forms: []
    };
    var mocks = {
      '../../mbaasRequest/mbaasRequest.js': {
        admin: function(params, cb){
          assert.equal(params.resourcePath, "/somedomain/someenv/appforms/apps");
          assert.equal(params.method, "POST");
          assert.equal(params.domain, "somedomain");
          assert.ok(_.isEqual(params.data, mockProjectDetails), "Expected Objects To Be Equal");

          return cb(undefined, {
            _id: "someformprojectid"
          });
        }
      }
    };

    var formsRequest = proxyquire('../../../lib/admin/appforms/projects.js', mocks);

    formsRequest.create({
      environment: "someenv",
      domain: "somedomain",
      projectDetails: mockProjectDetails
    }, function(err, result){
      assert.ok(!err, "Expected No Error");

      assert.equal(result._id, "someformprojectid");
      done();
    });
  },
  "Test Update Form Project": function(done){

    var mockProjectDetails = {
      _id: "someformprojectid",
      appId: "someprojectguid",
      forms: []
    };

    var mocks = {
      '../../mbaasRequest/mbaasRequest.js': {
        admin: function(params, cb){
          assert.equal(params.resourcePath, "/somedomain/someenv/appforms/apps/someformprojectid");
          assert.equal(params.method, "PUT");
          assert.equal(params.domain, "somedomain");
          assert.ok(_.isEqual(params.data, mockProjectDetails), "Expected Objects To Be Equal");

          return cb(undefined, {
            _id: "someformprojectid"
          });
        }
      }
    };

    var formsRequest = proxyquire('../../../lib/admin/appforms/projects.js', mocks);

    formsRequest.update({
      environment: "someenv",
      domain: "somedomain",
      id: "someformprojectid",
      projectDetails: mockProjectDetails
    }, function(err, result){
      assert.ok(!err, "Expected No Error");

      assert.equal(result._id, "someformprojectid");
      done();
    });
  },
  "Test Update Form Project Config": function(done){

    var mockConfig = {
      _id: "someformprojectid",
      appId: "someprojectguid",
      config: {
        someKey: "someVal"
      }
    };

    var mocks = {
      '../../mbaasRequest/mbaasRequest.js': {
        admin: function(params, cb){
          assert.equal(params.resourcePath, "/somedomain/someenv/appforms/apps/someformprojectid/config");
          assert.equal(params.method, "PUT");
          assert.equal(params.domain, "somedomain");
          assert.ok(_.isEqual(params.data, mockConfig), "Expected Objects To Be Equal");

          return cb(undefined, {
            _id: "someformprojectid"
          });
        }
      }
    };

    var formsRequest = proxyquire('../../../lib/admin/appforms/projects.js', mocks);

    formsRequest.updateConfig({
      environment: "someenv",
      domain: "somedomain",
      id: "someformprojectid",
      projectConfig: mockConfig
    }, function(err, result){
      assert.ok(!err, "Expected No Error");

      assert.equal(result._id, "someformprojectid");
      done();
    });
  },
  "Test Remove Form Project": function(done){


    var mocks = {
      '../../mbaasRequest/mbaasRequest.js': {
        admin: function(params, cb){
          assert.equal(params.resourcePath, "/somedomain/someenv/appforms/apps/someformprojectid");
          assert.equal(params.method, "DELETE");
          assert.equal(params.domain, "somedomain");
          assert.ok(_.isEqual(params.data, {}), "Expected Objects To Be Equal");

          return cb(undefined, {
            _id: "someformprojectid"
          });
        }
      }
    };

    var formsRequest = proxyquire('../../../lib/admin/appforms/projects.js', mocks);

    formsRequest.remove({
      environment: "someenv",
      domain: "somedomain",
      id: "someformprojectid"
    }, function(err, result){
      assert.ok(!err, "Expected No Error");

      assert.equal(result._id, "someformprojectid");
      done();
    });
  }
};
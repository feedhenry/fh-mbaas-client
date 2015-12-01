var proxyquire = require('proxyquire');
var assert = require('assert');

module.exports = {
  "test_list_alerts":function (done){
    var mocks = {
      '../../mbaasRequest/mbaasRequest.js': {
        admin: function(params, cb){
          
          assert.ok(params.resourcePath === "/somedomain/someenv/apps/test/alerts");
          assert.ok(params.method === "GET");
          assert.ok(params.guid === "test");
          return cb(undefined, {
          });
        }
      }
    };

    var alertReq = proxyquire('../../../../lib/admin/alerts/alerts', mocks);
    alertReq.list(
      {environment: "someenv",
        domain: "somedomain",
        "guid":"test"},
      function (err,ok){
        assert.ok(!err);
        done();
      });
  },
  "test_create_alert": function (done){
    var mocks = {
      '../../mbaasRequest/mbaasRequest.js': {
        admin: function(params, cb){
          assert.ok(params.resourcePath === "/somedomain/someenv/apps/test/alerts");
          assert.ok(params.method === "POST");
          assert.ok(params.guid === "test");
          return cb(undefined, {
            _id: "someformid"
          });
        }
      }
    };

    var alertReq = proxyquire('../../../../lib/admin/alerts/alerts', mocks);
    alertReq.create(
      {environment: "someenv",
        "domain": "somedomain", 
        "guid":"test",
        "body":{}},
      function (err,ok){
        assert.ok(!err);
        done();
      });
  },
  "test_update_alert": function (done){
    var mocks = {
      '../../mbaasRequest/mbaasRequest.js': {
        admin: function(params, cb){
          assert.ok(params.resourcePath === "/somedomain/someenv/apps/test/alerts/alertid");
          assert.ok(params.method === "PUT");
          assert.ok(params.guid === "test");
          return cb(undefined, {
          });
        }
      }
    };

    var alertReq = proxyquire('../../../../lib/admin/alerts/alerts', mocks);
    alertReq.update(
      {environment: "someenv",
        "domain": "somedomain",
        "guid":"test",
        "id":"alertid",
        "body":{}},
      function (err,ok){
        assert.ok(!err);
        done();
      });
  },
  
  "test_delete_alert":function (done){
    var mocks = {
      '../../mbaasRequest/mbaasRequest.js': {
        admin: function(params, cb){
        
          assert.ok(params.resourcePath === "/somedomain/someenv/apps/test/alerts/alertid");
          assert.ok(params.method === "DELETE");
          assert.ok(params.guid === "test");
          assert.ok(params.id === "alertid");
          return cb(undefined, {
          });
        }
      }
    };

    var alertReq = proxyquire('../../../../lib/admin/alerts/alerts', mocks);
    alertReq["delete"](
      {environment: "someenv",
        "domain": "somedomain",
        "guid":"test",
        "id":"alertid",
        "body":{}},
      function (err,ok){
        assert.ok(!err);
        done();
      });
  }
}

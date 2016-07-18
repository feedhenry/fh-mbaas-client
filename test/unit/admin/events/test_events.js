var proxyquire = require('proxyquire');
var assert = require('assert');

module.exports = {
  "test_list_events":function(done) {
    var mocks = {
      '../../mbaasRequest/mbaasRequest.js': {
        admin: function(params, cb) {
          assert.ok(params.resourcePath === "/somedomain/someenv/apps/test/events");
          assert.ok(params.method === "GET");
          assert.ok(params.guid === "test");
          return cb(undefined, {
            _id: "someformid"
          });
        }
      }
    };

    var eventsReq = proxyquire('../../../../lib/admin/events/events', mocks);
    eventsReq.list(
      {environment: "someenv",
      domain: "somedomain",
      "guid":"test"},
      function() {
        done();
      });
  },
  "test_create_event": function(done) {
    var mocks = {
      '../../mbaasRequest/mbaasRequest.js': {
        admin: function(params, cb) {
          assert.ok(params.resourcePath === "/somedomain/someenv/apps/test/events");
          assert.ok(params.method === "POST");
          assert.ok(params.guid === "test");
          return cb(undefined, {
            _id: "someformid"
          });
        }
      }
    };

    var eventsReq = proxyquire('../../../../lib/admin/events/events', mocks);
    eventsReq.create(
      {environment: "someenv",
        domain: "somedomain",
        "guid":"test"},
      function() {
        done();
      });
  }
};

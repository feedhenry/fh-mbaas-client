var proxyquire = require('proxyquire');
var assert = require('assert');

module.exports = {
  "test_list_notifications":function (done){
    var mocks = {
      '../../mbaasRequest/mbaasRequest.js': {
        admin: function(params, cb){
          assert.ok(params.resourcePath === "/somedomain/someenv/apps/test/notifications");
          assert.ok(params.method === "GET");
          assert.ok(params.guid === "test");
          return cb(undefined, {
            _id: "someformid"
          });
        }
      }
    };

    var eventsReq = proxyquire('../../../../lib/admin/alerts/notifications', mocks);
    eventsReq.list(
      {environment: "someenv",
        domain: "somedomain",
        "guid":"test"},
      function (err,ok){
        done();
      });
  }
}

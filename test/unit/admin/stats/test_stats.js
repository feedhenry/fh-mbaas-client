var proxyquire = require('proxyquire');
var assert = require('assert');
var util = require('util');

module.exports = {
  "test_post_stats": function (done){
    var mocks = {
      '../../mbaasRequest/mbaasRequest.js': {
        admin: function(params, cb){
          assert.ok(params.resourcePath === "/somedomain/someenv/apps/test/stats/history");
          assert.ok(params.method === "POST");
          assert.ok(params.guid === "test");
          return cb(undefined, {
            _id: "someformid"
          });
        }
      }
    };

    var statsReq = proxyquire('../../../../lib/admin/stats/stats', mocks);
    statsReq.history(
      {environment: "someenv",
        domain: "somedomain",
        "guid":"test"},
      function (err,ok){
        done();
      });
  }
};

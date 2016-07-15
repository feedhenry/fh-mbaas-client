var proxyquire = require('proxyquire');
var assert = require('assert');
var util = require('util');

module.exports = {
  "test_post_stats": function (done){
    var mocks = {
      '../../mbaasRequest/mbaasRequest.js': {
        admin: function(params, cb){
          assert.ok(params.resourcePath === "/stats/history");
          assert.ok(params.method === "POST");
          return cb(undefined, {
            _id: "someformid"
          });
        }
      }
    };

    var statsReq = proxyquire('../../../../lib/admin/stats/stats', mocks);
    statsReq.history({},
      function (err,ok){
        done();
      });
  }
};

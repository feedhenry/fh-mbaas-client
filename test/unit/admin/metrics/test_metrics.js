var proxyquire = require('proxyquire');
var assert = require('assert');
var util = require('util');

module.exports = {
  "test_get_metrics":function(done) {
    var mocks = {
      '../../mbaasRequest/mbaasRequest.js': {
        admin: function(params, cb) {
          assert.ok(params.resourcePath === "/metrics");
          assert.ok(params.method === "GET");
          return cb(undefined, {});
        }
      }
    };

    var metricsReq = proxyquire('../../../../lib/admin/metrics/metrics', mocks);
    metricsReq.getMetrics({},
      function(err) {
        assert.ok(! err, "did not expect an error " + util.inspect(err));
        done();
      });
  }
};

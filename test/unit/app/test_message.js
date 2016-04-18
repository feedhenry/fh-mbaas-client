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
  "Post batch of messages": function(done) {
    var mocks = {
      '../mbaasRequest/mbaasRequest.js': {
        app: function(params, cb) {
          assert.equal(params.resourcePath, "/message/fhact");
          assert.equal(params.method, "POST");
          assert.equal(params.domain, "somedomain");
          assert.ok(_.isEqual(params.data, [{}]), "Expected Objects To Be Equal");

          return cb(undefined, {
            _id: "someid",
            name: "Some Name"
          });
        }
      }
    };

    var messageRequest = proxyquire('../../../lib/app/message.js', mocks);

    messageRequest.sendbatch({
      environment: "someenv",
      domain: "somedomain",
      "project":"project",
      "app":"app",
      "topic":"fhact",
      "data":[{}]
    }, function(err, result) {
      assert.ok(! err, 'did not Expect an Error');
      assert.ok(result, "expected a result ");
      assert.ok(result._id, "someid");
      done();
    });
  }
};

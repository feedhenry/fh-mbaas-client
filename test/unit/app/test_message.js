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
  "Post batch of messages": function(done){
    var mocks = {
      '../../mbaasRequest/mbaasRequest.js': {
        app: function(params, cb){
          assert.equal(params.resourcePath, "/somedomain/someenv/message/sometopic");
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
      domain: "somedomain"
    }, function(err, result){
      assert.ok(err, 'Expected Empty Error');
      done();
    });
  }
};
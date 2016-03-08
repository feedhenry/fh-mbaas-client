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
  "GET database connection string": function(done){
    var mocks = {
      '../mbaasRequest/mbaasRequest.js': {
        app: function(params, cb){
          assert.equal(params.resourcePath, "/dbconnection");
          assert.equal(params.method, "GET");
          assert.equal(params.domain, "somedomain");
          return cb(undefined, {
            "url":"mongodb://test:test@sdsdsd.com"
          });
        }
      }
    };

    var databaseConnection = proxyquire('../../../lib/app/databaseConnectionString.js', mocks);

    databaseConnection({
      environment: "someenv",
      domain: "somedomain",
      "project":"project",
      "app":"app"
    }, function(err, result){
      assert.ok(! err, 'Expected no Error');
      assert.ok(result,"expected a result");
      assert.ok(result.url === "mongodb://test:test@sdsdsd.com" , "expected the url to be correct");
      done();
    });
  }
};

var proxyquire = require('proxyquire');
var assert = require('assert');
var _ = require('underscore');
var MockReadStream = require('../../fixtures/mock_readStream.js');
var MockWriteStream = require('../../fixtures/mock_writeStream.js');


module.exports = {
  "It Should Perform App MbaaS Request": function(done){
    var mocks = {
      'request': function(params, cb){
        assert.equal(params.url, "https://mbaas.someplace.com/api/app/somedomain/someenv/someprojectid/someappid/some/path/to/resource");

        assert.equal(params.headers['x-fh-env-access-key'], "somekeytoaccessmbaasenv");
        assert.equal(params.headers['x-fh-auth-app'], "someappapikey");
        assert.equal(params.method, "GET");

        assert.ok(_.isEqual(params.body, {}));
        assert.equal(params.json, true);

        return cb(undefined, {statusCode: 200}, {
          _id: "someformid"
        });

      },
      '../config/config.js': {
        getEnvironmentConfig: function(environment){
          assert.equal(environment, "someenv");
          return {
            project: "someprojectid",
            app: "someappid",
            accessKey: "somekeytoaccessmbaasenv",
            appApiKey: "someappapikey",
            url: "https://mbaas.someplace.com"
          }
        }
      }
    };

    var params = {
      environment: "someenv",
      domain: "somedomain",
      resourcePath: "/some/path/to/resource",
      data: {},
      method: "GET"
    };

    var mbaasRequest = proxyquire('../../../lib/mbaasRequest/mbaasRequest.js', mocks);

    mbaasRequest.app(params, function(err, result){
      assert.ok(!err, "Expected No Error: " + JSON.stringify(err));
      assert.equal(result._id, "someformid");

      done();
    });
  },
  "It Should Perform A File Download Request": function(done){
    var mocks = {
      'request': function(params, cb){
        assert.ok(!cb, "Expected No Callback");
        assert.equal(params.url, "https://mbaas.someplace.com/api/app/somedomain/someenv/someprojectid/someappid/some/path/to/resource");

        assert.equal(params.headers['x-fh-env-access-key'], "somekeytoaccessmbaasenv");
        assert.equal(params.headers['x-fh-auth-app'], "someappapikey");
        assert.equal(params.method, "GET");

        assert.equal(params.json, true);

        //Return a readable strem

        var mockReadStream = new MockReadStream();
        return mockReadStream;

      },
      '../config/config.js': {
        getEnvironmentConfig: function(environment){
          assert.equal(environment, "someenv");
          return {
            project: "someprojectid",
            app: "someappid",
            accessKey: "somekeytoaccessmbaasenv",
            appApiKey: "someappapikey",
            url: "https://mbaas.someplace.com"
          }
        }
      }
    };

    var params = {
      environment: "someenv",
      domain: "somedomain",
      resourcePath: "/some/path/to/resource",
      data: {},
      method: "GET",
      fileRequest: true
    };

    var mbaasRequest = proxyquire('../../../lib/mbaasRequest/mbaasRequest.js', mocks);

    mbaasRequest.app(params, function(err, resultReadableStream){
      assert.ok(!err, "Expected No Error: " + JSON.stringify(err));

      var mockWritableStream = new MockWriteStream();

      resultReadableStream.on('end', function(){
        done();
      });

      resultReadableStream.on('data', function(data){
        assert.equal(data, "Something");
      });

      resultReadableStream.on('error', function(err){
        assert.ok(!err, "Unexpected Streaming Error " + err);
        done();
      });

      resultReadableStream.pipe(mockWritableStream);
    });
  },
  "It Should Perform A File Upload Request": function(done){
    var mockReadStream = new MockReadStream();
    var mocks = {
      'request': function(params, cb) {
          assert.equal(params.url, "https://mbaas.someplace.com/api/app/somedomain/someenv/someprojectid/someappid/some/path/to/upload/file");
          assert.equal(params.method, "POST");
          assert.equal(params.headers['x-fh-env-access-key'], "somekeytoaccessmbaasenv");
          assert.equal(params.headers['x-fh-auth-app'], "someappapikey");

          //File Headers
          assert.equal(params.formData["somefile.pdf"].value, mockReadStream);

          cb(undefined, {statusCode: 200}, {status: "ok"});
      },
      '../config/config.js': {
        getEnvironmentConfig: function(environment){
          assert.equal(environment, "someenv");
          return {
            project: "someprojectid",
            app: "someappid",
            accessKey: "somekeytoaccessmbaasenv",
            appApiKey: "someappapikey",
            url: "https://mbaas.someplace.com"
          }
        }
      }
    };

    var params = {
      environment: "someenv",
      domain: "somedomain",
      resourcePath: "/some/path/to/upload/file",
      fileId: "somefileid",
      data: {
        stream: mockReadStream,
        name: "somefile.pdf",
        type: "application/pdf",
        size: 123456
      },
      method: "POST",
      fileRequest: true,
      fileUploadRequest: true
    };

    var mbaasRequest = proxyquire('../../../lib/mbaasRequest/mbaasRequest.js', mocks);

    mbaasRequest.app(params, function(err, result){
      assert.ok(!err, "Expected No Error: " + JSON.stringify(err));

      assert.equal(result.status, "ok");

      done();
    });
  },
  "It Should Perform An Admin API Request": function(done){
    var mocks = {
      'request': function(params, cb){
        assert.equal(params.url, "https://mbaas.someplace.com/api/mbaas/some/path/to/resource");

        assert.equal(params.headers.host, "mbaas.someplace.com");
        assert.equal(params.auth.user, "someusername");
        assert.equal(params.auth.pass, "somepassword");
        assert.equal(params.method, "GET");

        assert.ok(_.isEqual(params.body, {}));
        assert.equal(params.json, true);

        return cb(undefined, {statusCode: 200}, {
          _id: "someadminformid"
        });

      },
      '../config/config.js': {
        getEnvironmentConfig: function(environment){
          assert.equal(environment, "someenv");
          return {
            username: "someusername",
            password: "somepassword",
            url: "https://api.someplace.com",
            __mbaasUrl: 'https://mbaas.someplace.com'
          }
        }
      }
    };

    var params = {
      environment: "someenv",
      domain: "somedomain",
      resourcePath: "/some/path/to/resource",
      data: {},
      method: "GET"
    };

    var mbaasRequest = proxyquire('../../../lib/mbaasRequest/mbaasRequest.js', mocks);

    mbaasRequest.admin(params, function(err, result){
      assert.ok(!err, "Expected No Error: " + JSON.stringify(err));

      assert.equal(result._id, "someadminformid");

      done();
    });
  },
  "It Should Return An Error When Invalid Params Are Passed": function(done){
    var mocks = {
      'request': function(){
        assert.ok(false, "Should Not Get Here");
      },
      '../config/config.js': {
        getEnvironmentConfig: function(environment){
          assert.equal(environment, "someenv");
          return {
            username: "someusername",
            password: "somepassword",
            url: "https://api.someplace.com",
            __mbaasUrl: 'https://mbaas.someplace.com'
          }
        }
      }
    };

    //Creating Params Minus The Required "domain" param
    var params = {
      environment: "someenv",
      resourcePath: "/some/path/to/resource",
      data: {},
      method: "GET"
    };

    var mbaasRequest = proxyquire('../../../lib/mbaasRequest/mbaasRequest.js', mocks);

    mbaasRequest.admin(params, function(err, result){
      assert.ok(err, "Expected An Error");
      assert.ok(!result, "Expected No Result");

      //Checking the error message
      assert.ok(err.message.indexOf("domain") > -1, "Expected The domain param key to be specified in the error");

      done();
    });
  },
  "It Should Return An Error When Invalid Config Exists": function(done){
    var mocks = {
      'request': function(){
          assert.ok(false, "Should Not Get Here With Invalid Params");
      },
      '../config/config.js': {
        getEnvironmentConfig: function(environment){
          assert.equal(environment, "someenv");
          return {
            password: "somepassword",
            url: "https://mbaas.someplace.com"
          }
        }
      }
    };

    //Creating Params Minus The Required "domain" param
    var params = {
      environment: "someenv",
      domain: "somedomain",
      resourcePath: "/some/path/to/resource",
      data: {},
      method: "GET"
    };

    var mbaasRequest = proxyquire('../../../lib/mbaasRequest/mbaasRequest.js', mocks);

    mbaasRequest.admin(params, function(err, result){
      assert.ok(err, "Expected An Error");
      assert.ok(!result, "Expected No Result");

      //Checking the error message
      assert.ok(err.message.indexOf("username")  > -1, "Expected The username param key to be specified in the error");
      assert.ok(err.message.toLowerCase().indexOf("config") > -1, "Expected The error message to reference config");

      done();
    });
  }
};
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
  "Test Create Theme": function(done) {

    var mockTheme = {
      _id: "somethemeid",
      name: "Some Theme",
      css: "somecssvals"
    };

    var mocks = {
      '../../mbaasRequest/mbaasRequest.js': {
        admin: function(params, cb) {
          assert.equal(params.resourcePath, "/somedomain/someenv/appforms/themes");
          assert.equal(params.method, "POST");
          assert.equal(params.domain, "somedomain");
          assert.ok(_.isEqual(params.data, mockTheme), "Expected Objects To Be Equal");

          return cb(undefined, {
            _id: "somethemeid"
          });
        }
      }
    };

    var formsRequest = proxyquire('../../../lib/admin/appforms/themes.js', mocks);

    formsRequest.create({
      environment: "someenv",
      domain: "somedomain",
      theme: mockTheme
    }, function(err, result) {
      assert.ok(!err, "Expected No Error");

      assert.equal(result._id, "somethemeid");
      done();
    });
  },
  "Test Deploy Theme": function(done) {

    var mockTheme = {
      _id: "somethemeid",
      name: "Some Theme",
      css: "somecssvals"
    };

    var mocks = {
      '../../mbaasRequest/mbaasRequest.js': {
        admin: function(params, cb) {
          assert.equal(params.resourcePath, "/somedomain/someenv/appforms/themes/somethemeid/deploy");
          assert.equal(params.method, "POST");
          assert.equal(params.domain, "somedomain");
          assert.ok(_.isEqual(params.data, mockTheme), "Expected Objects To Be Equal");

          return cb(undefined, {
            _id: "somethemeid"
          });
        }
      }
    };

    var formsRequest = proxyquire('../../../lib/admin/appforms/themes.js', mocks);

    formsRequest.deploy({
      environment: "someenv",
      domain: "somedomain",
      theme: mockTheme,
      id: "somethemeid"
    }, function(err, result) {
      assert.ok(!err, "Expected No Error");

      assert.equal(result._id, "somethemeid");
      done();
    });
  },
  "Test Update Theme": function(done) {

    var mockTheme = {
      _id: "somethemeid",
      name: "Some Theme",
      css: "somecssvals"
    };

    var mocks = {
      '../../mbaasRequest/mbaasRequest.js': {
        admin: function(params, cb) {
          assert.equal(params.resourcePath, "/somedomain/someenv/appforms/themes/somethemeid");
          assert.equal(params.method, "PUT");
          assert.equal(params.domain, "somedomain");
          assert.ok(_.isEqual(params.data, mockTheme), "Expected Objects To Be Equal");

          return cb(undefined, {
            _id: "somethemeid"
          });
        }
      }
    };

    var formsRequest = proxyquire('../../../lib/admin/appforms/themes.js', mocks);

    formsRequest.update({
      environment: "someenv",
      domain: "somedomain",
      theme: mockTheme,
      id: "somethemeid"
    }, function(err, result) {
      assert.ok(!err, "Expected No Error");

      assert.equal(result._id, "somethemeid");
      done();
    });
  },
  "Test Remove Theme": function(done) {

    var mocks = {
      '../../mbaasRequest/mbaasRequest.js': {
        admin: function(params, cb) {
          assert.equal(params.resourcePath, "/somedomain/someenv/appforms/themes/somethemeid");
          assert.equal(params.method, "DELETE");
          assert.equal(params.domain, "somedomain");

          return cb(undefined, {
            _id: "somethemeid"
          });
        }
      }
    };

    var formsRequest = proxyquire('../../../lib/admin/appforms/themes.js', mocks);

    formsRequest.remove({
      environment: "someenv",
      domain: "somedomain",
      id: "somethemeid"
    }, function(err, result) {
      assert.ok(!err, "Expected No Error");

      assert.equal(result._id, "somethemeid");
      done();
    });
  },
  "Test Import Themes": function(done) {

    var mockTheme = {
      _id: "somethemeid",
      name: "Some Theme",
      css: "somecssvals"
    };

    var mockThemes = [mockTheme];

    var mocks = {
      '../../mbaasRequest/mbaasRequest.js': {
        admin: function(params, cb) {
          assert.equal(params.resourcePath, "/somedomain/someenv/appforms/themes/import");
          assert.equal(params.method, "POST");
          assert.equal(params.domain, "somedomain");
          assert.ok(_.isEqual(params.data, mockThemes), "Expected Theme Objects To Be Equal");

          return cb(undefined, mockThemes);
        }
      }
    };

    var themesRequest = proxyquire('../../../lib/admin/appforms/themes.js', mocks);

    themesRequest.importThemes({
      environment: "someenv",
      domain: "somedomain",
      themes: mockThemes
    }, function(err, result) {
      assert.ok(!err, "Expected No Error");

      assert.equal(result[0]._id, "somethemeid");
      done();
    });
  }
};
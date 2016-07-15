var assert = require('assert');
var configModule = require('../../../lib/config/config.js');

var testUrl = "/some/:var1/thing/:var2";

module.exports = {
  "It Should Map Params To Request URLs": function(done) {
    var params = {
      var1: "test1",
      var2: "test2"
    };

    var result = configModule.addURIParams(testUrl, params);

    assert.equal(result, "/some/test1/thing/test2");
    done();
  },
  "It Should Return A Missing Url If Param Not Available": function(done) {
    var params = {
      var1: "test1"
    };

    var result = configModule.addURIParams(testUrl, params);

    //Expecting An Error Object If A Property Is Missing
    assert.equal(result.key, "var2");
    assert.equal(result.error, "PROPERTY-NOT-SET");
    done();
  }
};

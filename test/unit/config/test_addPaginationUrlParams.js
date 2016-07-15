var assert = require('assert');
var addPaginationUrlParams = require('../../../lib/config/addPaginationUrlParams');

describe('Adding Pagination Params', function() {
  var baseUrl = "http://someurl.com/";

  it('Page and Limit', function(done) {
    var expectedUrl = baseUrl + "?page=1&limit=20";

    var generatedUrl = addPaginationUrlParams(baseUrl, {
      paginate: {
        page: 1,
        limit:20
      }
    });

    assert.equal(expectedUrl, generatedUrl);
    done();
  });

  it("Page only", function(done) {
    var expectedUrl = baseUrl + "?page=1";

    var generatedUrl = addPaginationUrlParams(baseUrl, {
      paginate: {
        page: 1
      }
    });

    assert.equal(expectedUrl, generatedUrl);
    done();
  });

  it("Limit Only", function(done) {
    var expectedUrl = baseUrl + "?limit=20";

    var generatedUrl = addPaginationUrlParams(baseUrl, {
      paginate: {
        limit:20
      }
    });

    assert.equal(expectedUrl, generatedUrl);
    done();
  });

  it("Filter Only", function(done) {
    var testFilterVal = 'testFilterVal';
    var expectedUrl = baseUrl + "?filter=" + testFilterVal;

    var generatedUrl = addPaginationUrlParams(baseUrl, {
      paginate: {
        filter: testFilterVal
      }
    });

    assert.equal(expectedUrl, generatedUrl);
    done();
  });

  it("None", function(done) {
    var expectedUrl = baseUrl;

    var generatedUrl = addPaginationUrlParams(baseUrl);

    assert.equal(expectedUrl, generatedUrl);
    done();
  });

});

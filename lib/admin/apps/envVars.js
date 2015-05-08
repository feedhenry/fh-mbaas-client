var mbaasRequest = require('../../mbaasRequest/mbaasRequest.js');
var config = require('../../config/config.js');
var constants = require('../../config/constants.js');

/**
 * Getting Environment Variables For An App From An MbaaS
 */
function get(params, cb){
  params.resourcePath = config.addURIParams(constants.APPS_BASE_PATH + "/env");
  params.method = "GET";
  params.data = {};

  mbaasRequest(params, cb);
}


module.exports = {
  get: get
};
var mbaasRequest = require('../../mbaasRequest/mbaasRequest.js');
var config = require('../../config/config.js');
var constants = require('../../config/constants.js');

/**
 * Checking the status of a DB Migrate in the MBaaS
 * @param params
 * @param cb
 */
module.exports = function deleteEnv(params, cb) {
  params.resourcePath = config.addURIParams(constants.ENVIROMEMTS_BASE_PATH, params);
  params.method = "DELETE";
  params.data = params.data || {};

  mbaasRequest.admin(params, cb);
};


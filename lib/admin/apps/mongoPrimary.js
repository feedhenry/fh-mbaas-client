var mbaasRequest = require('../../mbaasRequest/mbaasRequest.js');
var config = require('../../config/config.js');
var constants = require('../../config/constants.js');

/**
 * Get the primary node of the mbaas mongo replica set.
 * @param params
 * @param cb
 */
module.exports = function(params, cb) {
  params.resourcePath = config.addURIParams(constants.APPS_BASE_PATH + '/mongo/primary', params);
  params.method = 'GET';
  params.data = params.data || {};
  params.data.mbaasUrl = params[constants.MBAAS_CONF_KEY].__mbaasUrl;

  mbaasRequest.admin(params, cb);
};

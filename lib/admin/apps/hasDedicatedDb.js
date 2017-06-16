var mbaasRequest = require('../../mbaasRequest/mbaasRequest.js');
var config = require('../../config/config.js');
var constants = require('../../config/constants.js');

/**
 * Check whether an app has a dedicated database for an environment.
 * @param params
 * @param cb
 */
module.exports = function(params, cb) {
  params.resourcePath = config.addURIParams(constants.APPS_BASE_PATH + '/dedicated/db', params);
  params.method = 'GET';
  params.data = params.data || {};
  params.data.mbaasUrl = params[constants.MBAAS_CONF_KEY].__mbaasUrl;

  mbaasRequest.admin(params, cb);
};

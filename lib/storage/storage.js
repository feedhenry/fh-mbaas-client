var mbaasRequest = require('../mbaasRequest/mbaasRequest.js');
var config = require('../config/config.js');
var constants = require('../config/constants.js');


/**
 * Retrieves the primary node in the mongo replica given a mongo node.
 *
 * @param {object} params
 * @param {string} params.host
 * @param {string|number} params.port
 * @param cb
 */
function mongoPrimaryNode(params, cb) {
  params.resourcePath = config.addURIParams(constants.STORAGE_BASE_PATH + "/mongo/primary", params);
  params.method = 'GET';
  params.data = params.data || {};
  mbaasRequest.storage(params, cb);
}

module.exports = {
  mongoPrimaryNode: mongoPrimaryNode
};

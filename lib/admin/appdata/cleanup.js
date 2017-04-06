"use strict";

var mbaasRequest = require('../../mbaasRequest/mbaasRequest')
  , constants = require('../../config/constants')
  , config = require('../../config/config');

/**
 * Start a new tmp data cleanup job
 * @param {Number} params.numNode - The number of nodes this cluster has
 */
function startJob(params, cb) {
  var resourcePath = config.addURIParams(constants.CLEANUP_BASE_PATH, params);
  var method = "POST";

  params.resourcePath = resourcePath;
  params.method = method;
  params.data = {
    numNodes: params.numNodes
  };

  mbaasRequest.admin(params, cb);
}

module.exports = {
  startJob: startJob
};
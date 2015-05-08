var config = require('../../config/config.js');
var mbaasRequest = require('../../mbaasRequest/mbaasRequest.js');
var constants = require('../../config/constants.js');

/**
 * Get A Single Form From An MbaaS
 * @param params
 * @param cb
 */
function get(params, cb) {
  var resourcePath = config.addURIParams(constants.FORMS_BASE_PATH + "/forms/:id", params);
  var method = "GET";
  var data = {};

  params.resourcePath = resourcePath;
  params.method = method;
  params.data = data;

  mbaasRequest.admin(params, cb);
}

/**
 * List All Forms Deployed To An Environment
 * @param params
 * @param cb
 */
function list(params, cb) {
  var resourcePath = config.addURIParams(constants.FORMS_BASE_PATH + "/forms", params);
  var method = "GET";
  var data = {};

  params.resourcePath = resourcePath;
  params.method = method;
  params.data = data;

  mbaasRequest.admin(params, cb);
}

/**
 * Deploy A Form To An Environment
 * @param params
 * @param cb
 */
function deploy(params, cb) {
  var resourcePath = config.addURIParams(constants.FORMS_BASE_PATH + "/forms/:id/deploy", params);
  var method = "POST";
  var data = params.form;

  params.resourcePath = resourcePath;
  params.method = method;
  params.data = data;

  mbaasRequest.admin(params, cb);
}

/**
 * Remove A Form From An Environment
 * @param params
 * @param cb
 */
function remove(params, cb) {
  var resourcePath = config.addURIParams(constants.FORMS_BASE_PATH + "/forms/:id", params);
  var method = "DELETE";
  var data = {};

  params.resourcePath = resourcePath;
  params.method = method;
  params.data = data;

  mbaasRequest.admin(params, cb);
}


module.exports = {
  get: get,
  list: list,
  deploy: deploy,
  remove: remove
};
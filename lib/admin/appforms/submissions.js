var config = require('../../config/config.js');
var mbaasRequest = require('../../mbaasRequest/mbaasRequest.js');
var constants = require('../../config/constants.js');

/**
 * List Submissions For An Environment
 * @param params
 * @param cb
 */
function list(params, cb){
  var resourcePath = config.addURIParams(constants.FORMS_BASE_PATH + "/submissions", params);
  var method = "GET";
  var data = {};

  params.resourcePath = resourcePath;
  params.method = method;
  params.data = data;

  mbaasRequest.admin(params, cb);
}

/**
 * Get A Single Submission From An Environment
 * @param params
 * @param cb
 */
function get(params, cb){
  var resourcePath = config.addURIParams(constants.FORMS_BASE_PATH + "/submissions/:id", params);
  var method = "GET";
  var data = {};

  params.resourcePath = resourcePath;
  params.method = method;
  params.data = data;

  mbaasRequest.admin(params, cb);
}


/**
 * Update A Submission In An Environment
 * @param params
 * @param cb
 */
function update(params, cb){
  var resourcePath = config.addURIParams(constants.FORMS_BASE_PATH + "/submissions/:id", params);
  var method = "PUT";
  var data = params.submission;

  params.resourcePath = resourcePath;
  params.method = method;
  params.data = data;

  mbaasRequest.admin(params, cb);
}

/**
 * Update A File For A Submission
 * @param params
 * @param cb
 */
function updateFile(params, cb){
  var resourcePath = config.addURIParams(constants.FORMS_BASE_PATH + "/submissions/:id/fields/:fieldId/files/:fileId", params);
  var method = "PUT";
  var data = params.fileDetails;

  params.resourcePath = resourcePath;
  params.method = method;
  params.data = data;

  params.fileRequest = true;
  params.fileUploadRequest = true;

  mbaasRequest.admin(params, cb);
}

/**
 * Remove A Submission From An Environment
 * @param params
 * @param cb
 */
function remove(params, cb){
  var resourcePath = config.addURIParams(constants.FORMS_BASE_PATH + "/submissions/:id", params);
  var method = "DELETE";
  var data = {};

  params.resourcePath = resourcePath;
  params.method = method;
  params.data = data;

  mbaasRequest.admin(params, cb);
}

/**
 * Search For Submission In An Environment
 * @param params
 * @param cb
 */
function search(params, cb){
  var resourcePath = config.addURIParams(constants.FORMS_BASE_PATH + "/submissions/search", params);
  var method = "POST";
  var data = params.queryParams;

  params.resourcePath = resourcePath;
  params.method = method;
  params.data = data;

  mbaasRequest.admin(params, cb);
}

/**
 * Export Submissions As A Zip File Containing CSVs.
 * @param params
 * @param cb
 */
function exportSubmissions(params, cb){
  var resourcePath = config.addURIParams(constants.FORMS_BASE_PATH + "/submissions/export", params);
  var method = "POST";
  var data = params.queryParams;

  params.resourcePath = resourcePath;
  params.method = method;
  params.data = data;

  //Export is a zip file response..
  params.fileRequest = true;

  mbaasRequest.admin(params, cb);
}

/**
 * Get A File Contained In A Submission For An Environment
 * @param params
 * @param cb
 */
function getSubmissionFile(params, cb){
  var resourcePath = config.addURIParams(constants.FORMS_BASE_PATH + "/submissions/:id/files/:fileId", params);
  var method = "GET";
  var data = {};

  params.resourcePath = resourcePath;
  params.method = method;
  params.data = data;

  params.fileRequest = true;

  mbaasRequest.admin(params, cb);
}

/**
 * Getting A PDF Of A Submission
 * @param params
 * @param cb
 */
function getSubmissionPDF(params, cb){
  var resourcePath = config.addURIParams(constants.FORMS_BASE_PATH + "/submissions/:id.pdf", params);
  var method = "GET";
  var data = {};

  params.resourcePath = resourcePath;
  params.method = method;
  params.data = data;

  params.fileRequest = true;

  mbaasRequest.admin(params, cb);
}

module.exports = {
  list: list,
  get: get,
  update: update,
  updateFile: updateFile,
  remove: remove,
  search: search,
  export: exportSubmissions,
  getSubmissionFile: getSubmissionFile,
  getSubmissionPDF: getSubmissionPDF
};
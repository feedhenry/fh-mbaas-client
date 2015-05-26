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
 * Creating A New Submission.
 * @param params
 * @param cb
 */
function create(params, cb){
  params.resourcePath = config.addURIParams(constants.FORMS_BASE_PATH + "/submissions", params);
  params.method = "POST";
  params.data = params.submission;

  mbaasRequest.admin(params, cb);
}

/**
 * Marking A Pending Submission As Complete.
 * @param params
 * @param cb
 */
function complete(params, cb){
  params.resourcePath = config.addURIParams(constants.FORMS_BASE_PATH + "/submissions/:id/complete", params);
  params.method = "POST";
  params.data = {};

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
 * Adding A File To A Submission
 * @param params
 * @param cb
 */
function addFile(params, cb){
  params.resourcePath = config.addURIParams(constants.FORMS_BASE_PATH + "/submissions/:id/fields/:fieldId/files/:fileId", params);
  params.method = "POST";
  params.data = params.fileDetails;
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
 * Filtering Submissions From An Environment Mbaas.
 *
 * Forms Can Be Filtered By form ID or Project ID
 *
 * @param params
 * @param cb
 */
function filterSubmissions(params, cb){
  params.resourcePath = config.addURIParams(constants.FORMS_BASE_PATH + "/submissions/filter", params);
  params.method = "POST";
  params.data = params.filterParams;

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
  var resourcePath = config.addURIParams(constants.FORMS_BASE_PATH + "/submissions/:id/exportpdf", params);
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
  create: create,
  complete: complete,
  updateFile: updateFile,
  addFile: addFile,
  remove: remove,
  search: search,
  filterSubmissions: filterSubmissions,
  export: exportSubmissions,
  getSubmissionFile: getSubmissionFile,
  getSubmissionPDF: getSubmissionPDF
};
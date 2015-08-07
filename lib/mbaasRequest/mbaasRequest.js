var request = require('request');
var config = require('../config/config.js');
var url = require('url');
var constants = require('../config/constants.js');
var _ = require('underscore');
var logger = require('../logger/logger.js').getLogger();

/**
 * Validating Params Have Expected Key Values
 * @param expectedKeys
 * @param params
 * @private
 */
function validateParamsPresent(expectedKeys, params){
  params = params || {};
  var paramKeys = _.keys(params);
  return _.first(_.difference(expectedKeys, _.intersection(paramKeys, expectedKeys)));
}


/**
 * Validating Common Params Between Admin and App MbaaS Requests
 * @param params
 * @private
 */
function validateCommonParams(params){
  logger.debug("FH-MBAAS-CLIENT: validateCommonParams", {params: params});
  var expectedParams = ["method", "data", "resourcePath", "environment", "domain"];

  var missingParam = validateParamsPresent(expectedParams, params);

  if(missingParam){
    return missingParam;
  }

  //The resource Path Is Invalid If It Is An Object
  logger.debug('ResourcePath :: ', params.resourcePath);
  if(_.isObject(params.resourcePath)){
    logger.debug('Resource Path Is Object, returning path key !!! ', params.resourcePath);
    return params.resourcePath.key;
    
  }

  //If it is a file request, the data entry must contain file params.
  if(params.fileRequest && params.fileUploadRequest){
    missingParam = validateParamsPresent(["name", "type", "size", "stream"], params.data);
  }

  return missingParam;
}

/**
 * App API Requests To An MbaaS Require
 * @param params
 * @returns {*}
 * @private
 */
function validateAppParams(params){
  params = params || {};

  var expectedAppParams = ["project", "app", "accessKey", "appApiKey", "url"];

  var missingParam = validateCommonParams(params);

  if(missingParam){
    return new Error("Missing Param " + missingParam);
  }

  missingParam = validateParamsPresent(expectedAppParams, params);

  if(missingParam){
    return new Error("Missing MbaaS Config Param " + missingParam);
  }

  return undefined;
}

/**
 * Administration API Requests To An MbaaS Require The Username And Password Of The MbaaS.
 * @param params
 * @returns {*}
 * @private
 */
function validateAdminParams(params){
  logger.debug("FH-MBAAS-CLIENT: validateAdminParams", {params: params});
  var missingParam = validateCommonParams(params);

  var expectedAdminMbaasConfig = ["url", "username", "password"];

  if(missingParam){
    return new Error("Missing Param " + missingParam);
  }

  missingParam = validateParamsPresent(expectedAdminMbaasConfig, params);

  if(missingParam){
    return new Error("Missing MbaaS Config Param " + missingParam);
  }

   return undefined;
}

/**
 * Building Request Params For A Call To Administration APIs In An MbaaS
 * @param params
 * @returns {{url: *, json: boolean, method: (method|*|string), auth: {user: *, pass: *}, headers: {host: string}, body: *}}
 * @private
 */
function _buildAdminMbaasParams(params){
  logger.debug("FH-MBAAS-CLIENT: _buildAdminMbaasParams", {params: params});
  var basePath;
  basePath = config.addURIParams(constants.ADMIN_API_PATH, params);

  params = params || {};

  var method, resourcePath;

  method = params.method;
  resourcePath = params.resourcePath;

  var mbaasUrl = config.getEnvironmentConfig(params.environment).__mbaasUrl;
  var parsedMbaasUrl = url.parse(mbaasUrl);
  parsedMbaasUrl.pathname = basePath + resourcePath;

  var adminRequestParams =  {
    url: parsedMbaasUrl.format(),
    method: method,
    auth: {
      user: params.username,
      pass: params.password
    },
    headers: {
      host: parsedMbaasUrl.host,
      'x-fh-service-key': params.servicekey
    },
    fileRequest: params.fileRequest,
    fileUploadRequest: params.fileUploadRequest,
    data: params.data
  };

  logger.debug("FH-MBAAS-CLIENT: _buildAdminMbaasParams", {adminRequestParams: adminRequestParams});
  return adminRequestParams;
}


/**
 * Perform A Request To An MbaaS
 * @private
 */
function doFHMbaaSRequest(params, cb){
  logger.debug("FH-MBAAS-CLIENT: doFHMbaaSRequest", {params: params});
  //Preventing multiple callbacks.
  params = params || {};
  var fileData = params.data;

  //If it is a file upload request, the file data is assigned differently
  if(params.fileRequest && params.fileUploadRequest){
    params.json = false;
  } else {
    //Normal JSON Request
    params.json = true;
    //Dont set a body if it is a get request
    if(params.method !== "GET"){
      params.body = params.data;
    }
  }

  //The data field is no longer needed
  params = _.omit(params, 'data');

  //If Mbaas Request Expects To Send/Recieve Files, then return the request value
  if(params.fileRequest && params.fileUploadRequest){
    logger.debug("FH-MBAAS-CLIENT: doFHMbaaSRequest File Upload Request");
    var formData = {};
    formData[fileData.name] = {
      value: fileData.stream,
      options: {
        filename: fileData.name,
        contentType: fileData.type
      }
    };

    return request({
      method: params.method,
      url: params.url,
      auth: params.auth,
      headers: params.headers,
      formData: formData
    }, function(err, httpResponse, body){
      body = body || "{}";

      //The response should be JSON
      try{
        body = JSON.parse(body);
      } catch(e){
        logger.error("FH-MBAAS-CLIENT: Invalid Response Body ", {body: body});
      }

      logger.debug("FH-MBAAS-CLIENT: doFHMbaaSRequest File Upload Request Finish ", {err: err, httpResponse: httpResponse.statusCode, body: body});

      if(err || (httpResponse.statusCode !== 200 && httpResponse.statusCode !== 204)){
        cb(err || body || "Unexpected Status Code " + httpResponse.statusCode);
      } else {
        cb(undefined, body);
      }
    });
  } else if(params.fileRequest){
    logger.debug("FH-MBAAS-CLIENT: doFHMbaaSRequest File Download Request");
    //File Download Request. Return the readable request stream.
    return cb(undefined, request(params));
  } else {
    //Normal call.
    logger.debug("FH-MBAAS-CLIENT: doFHMbaaSRequest Normal Request");
    request(params, function(err, httpResponse, responseBody){
      if(err || (httpResponse.statusCode !== 200 && httpResponse.statusCode !== 204)){
        return cb(err || responseBody || "Unexpected Status Code " + httpResponse.statusCode);
      }

      return cb(undefined, responseBody);
    });
  }
}


/**
 * Building Request Params For An App Request To An Mbaas
 * @param params
 * @returns {{url: string, body: *, method: (method|*|string), json: boolean, headers: {fh-app-env-access-key: *}}}
 * @private
 */
function _buildAppRequestParams(params){
  params = params || {};

  var basePath = config.addURIParams(constants.APP_API_PATH, params);

  var fullPath = basePath + params.resourcePath;

  var mbaasUrl = url.parse(params.url);

  mbaasUrl.pathname = fullPath;

  var headers = {
    'x-fh-env-access-key': params.accessKey,
    'x-fh-auth-app': params.appApiKey
  };

  return {
    url: mbaasUrl.format(mbaasUrl),
    method: params.method,
    headers: headers,
    fileRequest: params.fileRequest,
    fileUploadRequest: params.fileUploadRequest,
    data: params.data
  };
}


/**
 * Performing A Request Against The Admin MBaaS API
 * @param params
 * @param cb
 */
function adminRequest(params, cb){
  params = params || {};
  logger.debug("FH-MBAAS-CLIENT: adminRequest ", {params: params});
  var fullParams = _.extend(_.clone(params), config.getEnvironmentConfig(params.environment));

  var invalidParamError = validateAdminParams(fullParams);

  if(invalidParamError){
    return cb(invalidParamError);
  }

  fullParams = _buildAdminMbaasParams(fullParams);

  logger.debug("FH-MBAAS-CLIENT: adminRequest ", {fullParams: fullParams});

  return doFHMbaaSRequest(fullParams, cb);
}


/**
 * Performing A Request Against The App MBaaS API
 * @param params
 * @param cb
 */
function appRequest(params, cb){
  params = params || {};

  //Adding Mbaas Config Params
  var fullParams = _.extend(_.clone(params), config.getEnvironmentConfig(params.environment));

  var invalidParamError = validateAppParams(fullParams);

  if(invalidParamError){
    return cb(invalidParamError);
  }

  fullParams = _buildAppRequestParams(fullParams);

  return doFHMbaaSRequest(fullParams, cb);
}


module.exports = {
  admin: adminRequest,
  app: appRequest
};

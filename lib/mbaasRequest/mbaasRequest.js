var request = require('request');
var config = require('../config/config.js');
var url = require('url');
var constants = require('../config/constants.js');
var _ = require('underscore');

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
  var expectedParams = ["method", "data", "resourcePath", "environment", "domain"];

  var missingParam = validateParamsPresent(expectedParams, params);

  if(missingParam){
    return missingParam;
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
  var basePath;
  basePath = config.addURIParams(constants.ADMIN_API_PATH, params);

  params = params || {};

  //The resource Path Is Invalid If It Is An Object
  if(_.isObject(params.resourcePath)){
    return cb(new Error("Invalid Path. Expected A " + params.resourcePath.key + " To Be Specified"));
  }

  var method, resourcePath;

  method = params.method;
  resourcePath = params.resourcePath;

  var mbaasUrl = url.parse(params.url);
  mbaasUrl.host = mbaasUrl.host.replace('api.', 'mbaas.');

  mbaasUrl.pathname = basePath + resourcePath;

  var returnJSON = {
    url: url.format(mbaasUrl),
    json: (!params.fileRequest),
    method: method,
    auth: {
      user: params.username,
      pass: params.password
    },
    headers: {
      host: mbaasUrl.host
    },
    fileRequest: params.fileRequest,
    fileUploadRequest: params.fileUploadRequest
  };

  //If It's Not A File Request, Then Set The Body Parameter
  if(!params.fileRequest){
    returnJSON.body = params.data;
  } else {
    returnJSON.data = params.data;
  }

  return returnJSON;
}


/**
 * Perform A Request To An MbaaS
 * @private
 */
function doFHMbaaSRequest(params, cb){
  //Preventing multiple callbacks.
  params = params || {};
  var fileData = params.data;

  params = _.omit(params, 'data');

  //If Mbaas Request Expects To Send/Recieve Files, then return the request value
  if(params.fileRequest && params.fileUploadRequest){
    var formData = {};
    formData[fileData.name] = {
      value: fileData.stream,
      options: {
        filename: fileData.name,
        contentType: fileData.type
      }
    };

    return request.post({
      url: params.url,
      headers: params.headers,
      formData: formData
    }, function(err, httpResponse, body){

      if(err || (httpResponse.statusCode !== 200 && httpResponse.statusCode !== 204)){
        cb(err || body);
      } else {
        cb(undefined, body);
      }
    });
  } else if(params.fileRequest){
    //File Download Request. Return the readable request stream.
    return cb(undefined, request(params));
  } else {
    //Normal call.
    request(params, function(err, httpResponse, responseBody){
      if(err || (httpResponse.statusCode !== 200 && httpResponse.statusCode !== 204)){
        return cb(err || responseBody);
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

  var returnJSON = {
    url: mbaasUrl.format(mbaasUrl),
    method: params.method,
    json: (!params.fileRequest),
    headers: headers,
    fileRequest: params.fileRequest,
    fileUploadRequest: params.fileUploadRequest
  };

  //If Its Not A File Request, then set the body
  if(!params.fileRequest){
    returnJSON.body = params.data;
  } else {
    returnJSON.data = params.data;
  }

  return returnJSON;
}


/**
 * Performing A Request Against The Admin MBaaS API
 * @param params
 * @param cb
 */
function adminRequest(params, cb){
  params = params || {};
  var fullParams = _.extend(_.clone(params), config.getEnvironmentConfig(params.environment));

  var invalidParamError = validateAdminParams(fullParams);

  if(invalidParamError){
    return cb(invalidParamError);
  }

  fullParams = _buildAdminMbaasParams(fullParams);

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
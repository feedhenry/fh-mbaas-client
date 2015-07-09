var _ = require('underscore');
var constants = require('./constants.js');
var url = require('url');

//There can be many environment configuration

var environmentConfig = {

};

/**
 * Maps Parameters To Url Parameters.
 * @param uri
 * @param params
 * @returns {*}
 */
function addURIParams(uri, params){
  uri = uri || "";
  params = params || {};

  params = _.clone(params);

  var keys = _.keys(params);

  var separatedPath = uri.split("/");

  separatedPath = _.compact(separatedPath);

  //Replacing Any Path Elements
  separatedPath = _.map(separatedPath, function(pathEntry){
    if(pathEntry.indexOf(":") !== 0){
      return pathEntry;
    }

    var key = _.find(keys, function(key){
      return (":" + key) === pathEntry;
    });

    if(key){
      return params[key];
    } else {
      return {
        key: pathEntry.substring(1, pathEntry.length),
        error: constants.PROPERTY_NOT_SET
      };
    }
  });

  //If the path contains an invalid parameter, return the error object
  var invalidParameter = _.findWhere(separatedPath, {error: constants.PROPERTY_NOT_SET});

  if(invalidParameter){
    return invalidParameter;
  }

  var fullPath = "";

  _.each(separatedPath, function(pathElem){
    return fullPath += "/" + pathElem;
  });

  return fullPath;
}

function setMbaasUrl(mbaasConfig) {
  if (mbaasConfig.fhMbaasHost) {
    // explicity told what the url is, no /api/mbaas/ replace needed
    mbaasConfig.__mbaasUrl = mbaasConfig.fhMbaasHost;
  } else {
    var parsedMbaasUrl = url.parse(mbaasConfig.url);
    parsedMbaasUrl.host = parsedMbaasUrl.host.replace("api.", "mbaas.");
    mbaasConfig.__mbaasUrl = parsedMbaasUrl.format();
  }
}


module.exports = {
  initEnvironment: function(environment, mbaasConfig){
    setMbaasUrl(mbaasConfig);
    environmentConfig[environment] = mbaasConfig;
  },
  getEnvironmentConfig: function(environment){
    return environmentConfig[environment];
  },
  addURIParams: addURIParams
};
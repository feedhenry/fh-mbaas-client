

//Path prefix for app calls to an mbaas
var APP_API_PATH = "/api/app/:domain/:environment/:project/:app";

//Path prefix for admin calls to an mbaas
var ADMIN_API_PATH = "/api/mbaas/:domain/:environment";

var PROPERTY_NOT_SET = "PROPERTY-NOT-SET";

module.exports = {
  APP_API_PATH: APP_API_PATH,
  ADMIN_API_PATH: ADMIN_API_PATH,
  PROPERTY_NOT_SET: PROPERTY_NOT_SET
};
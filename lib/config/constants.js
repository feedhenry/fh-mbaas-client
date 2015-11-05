

//Path prefix for app calls to an mbaas
var APP_API_PATH = "/api/app/:domain/:environment/:project/:app";

//Path prefix for admin calls to an mbaas
var ADMIN_API_PATH = "/api/mbaas";

var FORMS_BASE_PATH = "/:domain/:environment/appforms";

var APPS_BASE_PATH = "/apps/:domain/:environment/:appname";

var PROPERTY_NOT_SET = "PROPERTY-NOT-SET";

var ALERTS_BASE_PATH = "/:domain/:environment/apps/:guid/alerts";

var EVENTS_BASE_PATH = "/:domain/:environment/apps/:guid/events";

var NOTIFICATIONS_BASE_PATH = "/:domain/:environment/apps/:guid/notifications";

var METRICS_BASE_PATH = "/api/metrics";

module.exports = {
  APP_API_PATH: APP_API_PATH,
  ADMIN_API_PATH: ADMIN_API_PATH,
  PROPERTY_NOT_SET: PROPERTY_NOT_SET,
  FORMS_BASE_PATH: FORMS_BASE_PATH,
  APPS_BASE_PATH: APPS_BASE_PATH,
  ALERTS_BASE_PATH: ALERTS_BASE_PATH,
  NOTIFICATIONS_BASE_PATH: NOTIFICATIONS_BASE_PATH,
  EVENTS_BASE_PATH: EVENTS_BASE_PATH,
  METRICS_BASE_PATH : METRICS_BASE_PATH
};
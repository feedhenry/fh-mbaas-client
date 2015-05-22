var config = require('./lib/config/config.js');

//Administrative Endpoints Form An mBaaS
var admin = require('./lib/admin/admin.js');

var logger = require('./lib/logger/logger.js');

//Functions Available To Cloud Apps
var app = require('./lib/app/app.js');

module.exports = {
  setLogger: logger.setLogger,
  initEnvironment: config.initEnvironment,
  app: app,
  admin: admin
};
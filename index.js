var config = require('./lib/config/config.js');

//Administrative Endpoints Form An mBaaS
var admin = require('./lib/admin/admin.js');

//Functions Available To Cloud Apps
var app = require('./lib/app/app.js');

module.exports = {
  initEnvironment: config.initEnvironment,
  app: app,
  admin: admin
};
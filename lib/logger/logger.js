var bunyan = require('bunyan');

var log = {};

module.exports = {
  setLogger: function(newLogger) {
    log.logger = newLogger;
  },
  getLogger: function() {
    if (!log.logger) {
      log.logger = bunyan.createLogger({
        name: 'basic-logger',
        level: 'error',
        src: true
      });
    }

    return log;
  }
};
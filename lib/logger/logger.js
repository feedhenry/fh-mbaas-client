var bunyan = require('bunyan');

var logger;

module.exports = {
  setLogger: function(newLogger) {
    logger = newLogger;
  },
  getLogger: function() {
    if (logger) {
      return logger;
    }

    logger = bunyan.createLogger({
      name: 'basic-logger',
      level: 'error',
      src: true
    });
    return logger;
  }
};
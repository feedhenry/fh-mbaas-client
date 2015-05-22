var bunyan = require('bunyan');

var logger;

module.exports = {
  setLogger: function(newLogger){
    logger = newLogger;
  },
  getLogger: function(){
    if (logger) {
      return logger;
    }

    logger = bunyan.createLogger({
      name: 'basic-logger',
      level: 'trace',
      src: true
    });
    return logger;
  }
};
module.exports = {
  deploy: require('./deployApp.js'),
  migrateDB: require('./migrateDb.js'),
  completeDBMigration: require('./completeDbMigration.js'),
  remove: require('./remove.js'),
  envVars: require('./envVars.js')
};
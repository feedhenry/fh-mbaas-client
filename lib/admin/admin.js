//File To Perform Administrative Actions On An MbaaS

module.exports = {
  forms: require('./appforms/forms.js'),
  submissions: require('./appforms/submissions.js'),
  themes: require('./appforms/themes.js'),
  formProjects: require('./appforms/projects.js'),
  apps: require('./apps/apps.js'),
  dataSources: require('./appforms/dataSources.js'),
  services: require('./services/services.js')
};
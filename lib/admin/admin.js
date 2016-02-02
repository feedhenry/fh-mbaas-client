//File To Perform Administrative Actions On An MbaaS

module.exports = {
  forms: require('./appforms/forms.js'),
  submissions: require('./appforms/submissions.js'),
  themes: require('./appforms/themes.js'),
  formProjects: require('./appforms/projects.js'),
  apps: require('./apps/apps.js'),
  alerts: require('./alerts/alerts.js'),
  notifications: require('./alerts/notifications.js'),
  events: require('./events/events.js'),
  metrics: require('./metrics/metrics')
};
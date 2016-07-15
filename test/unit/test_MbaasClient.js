var proxyquire = require('proxyquire');
var sinon = require('sinon');
var assert = require('assert');
var constants = require('../../lib/config/constants');

module.exports = {
  "It should still support existing functions": function(done) {
    var MbaasClient = require('../../lib/MbaasClient');
    var mbaasConf = {
      project: "someprojectid",
      app: "someappid",
      accessKey: "somekeytoaccessmbaasenv",
      appApiKey: "someappapikey",
      url: "https://mbaas.someplace.com"
    };
    var client = new MbaasClient("test", mbaasConf);

    assert.equal(typeof client.app.forms.list, 'function');
    assert.equal(typeof client.app.forms.get, 'function');
    assert.equal(typeof client.app.forms.search, 'function');
    assert.equal(typeof client.app.forms.submitFormData, 'function');

    assert.equal(typeof client.app.submissions.list, 'function');
    assert.equal(typeof client.app.submissions.get, 'function');
    assert.equal(typeof client.app.submissions.search, 'function');
    assert.equal(typeof client.app.submissions.getFile, 'function');
    assert.equal(typeof client.app.submissions.uploadFile, 'function');
    assert.equal(typeof client.app.submissions.uploadFileBase64, 'function');
    assert.equal(typeof client.app.submissions.status, 'function');
    assert.equal(typeof client.app.submissions.complete, 'function');

    assert.equal(typeof client.app.themes.get, 'function');

    assert.equal(typeof client.app.events.create, 'function');

    assert.equal(typeof client.app.message.sendbatch, 'function');

    assert.equal(typeof client.app.formsConfig.get, 'function');

    assert.equal(typeof client.app.databaseConnectionString, 'function');

    assert.equal(typeof client.admin.forms.get, 'function');
    assert.equal(typeof client.admin.forms.list, 'function');
    assert.equal(typeof client.admin.forms.deploy, 'function');
    assert.equal(typeof client.admin.forms.undeploy, 'function');
    assert.equal(typeof client.admin.forms.remove, 'function');
    assert.equal(typeof client.admin.forms.submissions, 'function');


    assert.equal(typeof client.admin.submissions.list, 'function');
    assert.equal(typeof client.admin.submissions.get, 'function');
    assert.equal(typeof client.admin.submissions.update, 'function');
    assert.equal(typeof client.admin.submissions.create, 'function');
    assert.equal(typeof client.admin.submissions.complete, 'function');
    assert.equal(typeof client.admin.submissions.updateFile, 'function');
    assert.equal(typeof client.admin.submissions.addFile, 'function');
    assert.equal(typeof client.admin.submissions.remove, 'function');
    assert.equal(typeof client.admin.submissions.search, 'function');
    assert.equal(typeof client.admin.submissions.filterSubmissions, 'function');
    assert.equal(typeof client.admin.submissions.export, 'function');
    assert.equal(typeof client.admin.submissions.getSubmissionFile, 'function');
    assert.equal(typeof client.admin.submissions.getSubmissionPDF, 'function');

    assert.equal(typeof client.admin.themes.importThemes, 'function');
    assert.equal(typeof client.admin.themes.create, 'function');
    assert.equal(typeof client.admin.themes.update, 'function');
    assert.equal(typeof client.admin.themes.remove, 'function');
    assert.equal(typeof client.admin.themes.deploy, 'function');

    assert.equal(typeof client.admin.formProjects.importProjects, 'function');
    assert.equal(typeof client.admin.formProjects.importProjectConfig, 'function');
    assert.equal(typeof client.admin.formProjects.create, 'function');
    assert.equal(typeof client.admin.formProjects.update, 'function');
    assert.equal(typeof client.admin.formProjects.updateConfig, 'function');
    assert.equal(typeof client.admin.formProjects.remove, 'function');

    assert.equal(typeof client.admin.apps.deploy, 'function');
    assert.equal(typeof client.admin.apps.migrateDB, 'function');
    assert.equal(typeof client.admin.apps.checkMigrateDB, 'function');
    assert.equal(typeof client.admin.apps.completeDBMigration, 'function');
    assert.equal(typeof client.admin.apps.remove, 'function');
    assert.equal(typeof client.admin.apps.envVars.get, 'function');

    assert.equal(typeof client.admin.dataSources.list, 'function');
    assert.equal(typeof client.admin.dataSources.get, 'function');
    assert.equal(typeof client.admin.dataSources.deploy, 'function');
    assert.equal(typeof client.admin.dataSources.validate, 'function');
    assert.equal(typeof client.admin.dataSources.refresh, 'function');
    assert.equal(typeof client.admin.dataSources.remove, 'function');
    assert.equal(typeof client.admin.dataSources.getAuditLogs, 'function');
    assert.equal(typeof client.admin.dataSources.getAuditLogEntry, 'function');

    assert.equal(typeof client.admin.services.deploy, 'function');
    assert.equal(typeof client.admin.services.list, 'function');
    assert.equal(typeof client.admin.services.get, 'function');
    assert.equal(typeof client.admin.services.remove, 'function');

    assert.equal(typeof client.admin.alerts.create, 'function');
    assert.equal(typeof client.admin.alerts.update, 'function');
    assert.equal(typeof client.admin.alerts.delete, 'function');
    assert.equal(typeof client.admin.alerts.list, 'function');
    assert.equal(typeof client.admin.alerts.testEmails, 'function');

    assert.equal(typeof client.admin.notifications.list, 'function');

    assert.equal(typeof client.admin.events.create, 'function');
    assert.equal(typeof client.admin.events.list, 'function');

    assert.equal(typeof client.admin.metrics.getMetrics, 'function');
    done();
  },

  "It should attach the mbaas conf to the first parameter": function(done) {
    var app = {
      forms: {
        list: sinon.stub()
      }
    };

    var MbaasClient = proxyquire('../../lib/MbaasClient', {
      './app/app.js': app
    });

    var mbaasConf1 = {
      project: "someprojectid",
      app: "someappid",
      accessKey: "somekeytoaccessmbaasenv",
      appApiKey: "someappapikey",
      url: "https://api.someplace.com"
    };

    var mbaasConf2 = {
      project: "someprojectid",
      app: "someappid",
      accessKey: "somekeytoaccessmbaasenv",
      appApiKey: "someappapikey",
      url: "https://api.someplace2.com"
    };

    var client1 = new MbaasClient("test", mbaasConf1);
    var client2 = new MbaasClient("test", mbaasConf2);
    app.forms.list.yieldsAsync();

    var params = {
      'test':'test'
    };
    client1.app.forms.list(params, function(err) {
      assert.ok(!err);

      var calledArg = app.forms.list.args[0];
      var calledParams = calledArg[0];

      assert.equal(typeof calledParams[constants.MBAAS_CONF_KEY], 'object');
      assert.ok(calledParams[constants.MBAAS_CONF_KEY].__mbaasUrl.indexOf('https://mbaas.someplace.com') > -1);

      client2.app.forms.list(params, function(err) {
        assert.ok(!err);

        calledArg = app.forms.list.args[1];
        calledParams = calledArg[0];

        assert.equal(typeof calledParams[constants.MBAAS_CONF_KEY], 'object');
        assert.ok(calledParams[constants.MBAAS_CONF_KEY].__mbaasUrl.indexOf("https://mbaas.someplace2.com") > -1);

        done();
      });
    });
  }
};
var sinon = require('sinon');

/**
 * Stub Generator For Mbaas Request
 * @param expectedParams
 * @param response: Response JSON To Return
 */
module.exports = function(expectedParams, response){
  var stub = sinon.stub();

  stub.withArgs(sinon.match(expectedParams), sinon.match.func).callsArgWith(1, undefined, response);

  stub.throws("Invalid Params");

  return stub;
};
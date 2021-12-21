cordova.define("com.mysoft.core.MicCore", function(require, exports, module) {
var exec = require("cordova/exec");

module.exports = {
  connect: function (success, error) {
    exec(success, error, "MicCore", "connect", []);
  },
  close: function (success, error) {
    exec(success, error, "MicCore", "close", []);
  },
  closeSplashScreen: function (success, error) {
    exec(success, error, "MicCore", "closeSplashScreen", []);
  },
  keepScreenOn: function (screenOn, success, error) {
    exec(success, error, "MicCore", "keepScreenOn", [!!screenOn]);
  },
  sentryLogSwitch: function (isOff, success, error, options) {
    exec(success, error, "MicCore", "sentryLogSwitch", [!!isOff, options]);
  },
  saveBusiness: function (businessID, success, error) {
    exec(success, error, "MicCore", "saveBusiness", [businessID]);
  },
  stopSplashMonitor: function (stop, success, error) {
    exec(success, error, "MicCore", "stopSplashMonitor", [!!stop]);
  },
  setTextZoom: function (textZoom, success, error) {
    exec(success, error, "MicCore", "setTextZoom", [textZoom]);
  },
  getSdkConfig: function (callback) {
    exec(callback, null, "MicCore", "getSdkConfig", []);
  },
  exitSdk: function (success, error) {
    exec(success, error, "MicCore", "exitSdk", []);
  },
  getWebPath: function (callback) {
    exec(callback, null, "MicCore", "getWebPath", []);
  },
};
});

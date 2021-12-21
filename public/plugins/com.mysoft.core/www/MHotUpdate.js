cordova.define("com.mysoft.core.MHotUpdate", function(require, exports, module) {
var exec = require('cordova/exec');

function MHotUpdate() {
    // progress 1
    // success 2
    this.callback = null;
    var self = this;
    this.success = function(result) {
        var code = result[0];
        switch (code) {
            case 1:
                {
                    if (self.callback != null &&
                        self.callback.progress != undefined &&
                        self.callback.progress != null) {
                        var customData = result[1];
                        self.callback.progress(customData);
                    }
                }
                break;
            case 2:
                {
                    if (self.callback != null &&
                        self.callback.success != undefined &&
                        self.callback.success != null) {
                        self.callback.success();
                    }
                }
                break;
            default:
                break;
        }
    };
}
// 下载离线web包
MHotUpdate.prototype.downloadWebContent = function(zipUrl, success, fail, progress) {
    var mycallback = {};
    mycallback.success = success;
    if (typeof(progress) === 'function') {
        mycallback.progress = progress;
    }
    this.callback = mycallback;
    exec(this.success, fail, "MHotUpdate", "downloadWebContent", [zipUrl]);
};

var me = new MHotUpdate();
module.exports = me;
});

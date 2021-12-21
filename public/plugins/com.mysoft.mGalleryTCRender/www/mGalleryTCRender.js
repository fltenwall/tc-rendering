cordova.define("com.mysoft.mGalleryTCRender.mGalleryTCRender", function(require, exports, module) {
var exec = require('cordova/exec');

module.exports = {
    create: function (options, callback) {
        exec(
            function (result) {
                var code = result[0];
                switch (code) {
                    case 1:
                        if (callback.onSuccess) {
                            callback.onSuccess();
                        }
                        break;
                    case 2:
                        if (callback.onEvent) {
                            callback.onEvent(result[1]);
                        }
                        break;
                }
            },
            function (error) {
                if (callback.onError) {
                    callback.onError(error);
                }
            },
            'mGalleryTCRender', 'create', [options]
        );
    },
    display: function (bool, cid) {
        exec(null, null, 'mGalleryTCRender', 'display', [bool, cid]);
    },
    destroy: function (cid) {
        exec(null, null, 'mGalleryTCRender', 'destroy', [cid]);
    },
    replaceImageUrl: function (newImageUrl, index) {
        exec(null, null, 'mGalleryTCRender', 'replaceImageUrl', [newImageUrl, index]);
    },

    /******* Android专用接口 start ********/
    setWebElementRegions: function (regions) {
        exec(null, null, 'mGalleryTCRender', 'setWebElementRegions', [regions]);
    },
    setNativeViewRegion: function (region) {
        exec(null, null, 'mGalleryTCRender', 'setNativeViewRegion', [region]);
    },
    /******* Android专用接口 end ********/
    
}
});

cordova.define("com.mysoft.mGaoDeMapTCRender.mGaoDeMapTCRender", function(require, exports, module) {
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
                'mGaoDeMapTCRender', 'create', [options]
            );
        },
        getZoom: function (callback) {
            exec(callback, null, 'mGaoDeMapTCRender', 'getZoom', []);
        },
        setZoom: function (zoom) {
            exec(null, null, 'mGaoDeMapTCRender', 'setZoom', [zoom]);
        },
        setCenter: function (lonLat) {
            exec(null, null, 'mGaoDeMapTCRender', 'setCenter', [lonLat]);
        },
        geolocationCurrent: function (show) {
            exec(null, null, 'mGaoDeMapTCRender', 'geolocationCurrent', [show]);
        },
        renderMarkers: function (markers) {
            exec(null, null, 'mGaoDeMapTCRender', 'renderMarkers', [markers]);
        },
        getCity: function (callback) {
            exec(callback, null, 'mGaoDeMapTCRender', 'getCity', []);
        },
        panBy: function (dx, dy) {
            exec(null, null, 'mGaoDeMapTCRender', 'panBy', [dx, dy]);
        },
        setFitView: function () {
            exec(null, null, 'mGaoDeMapTCRender', 'setFitView', []);
        },
    
        // iOS???????????? start
        // true???????????????false????????????
        display: function (bool, cid) {
            exec(null, null, 'mGaoDeMapTCRender', 'display', [bool, cid]);
        },
        destroy: function (cid) {
            exec(null, null, 'mGaoDeMapTCRender', 'destroy', [cid]);
        },
        // iOS???????????? end
    
        // Android???????????? start
        setWebElementRegions: function (regions) {
            exec(null, null, 'mGaoDeMapTCRender', 'setWebElementRegions', [regions]);
        },
        setNativeViewRegion: function (region) {
            exec(null, null, 'mGaoDeMapTCRender', 'setNativeViewRegion', [region]);
        },
        setZoomCenter: function (zoom, lonLat) {
            exec(null, null, 'mGaoDeMapTCRender', 'setZoomCenter', [zoom, lonLat]);
        },
        /******* Android???????????? end ********/

        // ????????????
        setMapType: function (type) {
            exec(null, null, 'mGaoDeMapTCRender', 'setMapType', [type]);
        },
        // ?????????????????????
        renderBuildings: function (overlays) {
            exec(null, null, 'mGaoDeMapTCRender', 'renderBuildings', [overlays]);
        },
    }
});

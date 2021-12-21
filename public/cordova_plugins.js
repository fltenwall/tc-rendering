cordova.define('cordova/plugin_list', function(require, exports, module) {
  module.exports = [
    {
      "id": "com.mysoft.core.MicCore",
      "file": "plugins/com.mysoft.core/www/MicCore.js",
      "pluginId": "com.mysoft.core",
      "clobbers": [
        "MicCore"
      ]
    },
    {
      "id": "com.mysoft.core.MHotUpdate",
      "file": "plugins/com.mysoft.core/www/MHotUpdate.js",
      "pluginId": "com.mysoft.core",
      "clobbers": [
        "MHotUpdate"
      ]
    },
    {
      "id": "com.mysoft.core.Keyboard",
      "file": "plugins/com.mysoft.core/www/android/keyboard.js",
      "pluginId": "com.mysoft.core",
      "clobbers": [
        "cordova.plugins.Keyboard"
      ]
    },
    {
      "id": "com.mysoft.mGaoDeMapTCRender.mGaoDeMapTCRender",
      "file": "plugins/com.mysoft.mGaoDeMapTCRender/www/mGaoDeMapTCRender.js",
      "pluginId": "com.mysoft.mGaoDeMapTCRender",
      "clobbers": [
        "mGaoDeMapTCRender"
      ]
    },
    {
      "id": "com.mysoft.wkwebview.ios-wkwebview-exec",
      "file": "plugins/com.mysoft.wkwebview/src/www/ios/ios-wkwebview-exec.js",
      "pluginId": "com.mysoft.wkwebview",
      "clobbers": [
        "cordova.exec"
      ]
    },
    {
      "id": "com.mysoft.mGalleryTCRender.mGalleryTCRender",
      "file": "plugins/com.mysoft.mGalleryTCRender/www/mGalleryTCRender.js",
      "pluginId": "com.mysoft.mGalleryTCRender",
      "clobbers": [
        "mGalleryTCRender"
      ]
    }
  ];
  module.exports.metadata = {
    "com.mysoft.core": "3.3.8",
    "com.mysoft.wkwebview": "1.3.7",
    "com.mysoft.mGaoDeMapTCRender": "0.0.1",
    "com.mysoft.mGalleryTCRender": "1.0.0"
  };
});
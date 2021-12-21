import Map, { pointType } from "./map";

class YMap extends Map {
  platform;
  constructor(control, iconToImgMap) {
    super();
    this.id = control.id
    this.platform = control.platform;
    this.iconToImgMap = iconToImgMap;
    this.inited = false
    this.control = control
  }
  updatePoints(data) {
    this.currentPoints = data;
    this.control.callNativeMethod(
      "renderMarkers",
      data.map((item) => {
        if ([pointType.ICON, pointType.ICONTEXT].includes(item.type)) {
          return {
            ...item,
            icon: this.iconToImgMap[item.icon],
            selectIcon: this.iconToImgMap[item.selectIcon]
          };
        }
        return item;
      })
    );
  }
  getCity(callback) {
    return new Promise((resolve) => {
      this.control.callNativeMethod("getCity", (info) => {
        resolve(info);
        callback && callback(info);
      });
    });
  }
  getZoom(callback) {
    return new Promise((resolve) => {
      this.control.callNativeMethod("getZoom", (zoom) => {
        resolve(zoom);
        callback && callback(zoom);
      });
    });
  }
  setCenter(postion) {
    this.control.callNativeMethod("setCenter", postion);
  }
  setZoom(zoom) {
    this.control.callNativeMethod("setZoom", zoom);
  }
  setZoomCenter(zoom, lonLat) {
    if (this.platform === "android") {
      this.control.callNativeMethod("setZoomCenter", zoom, lonLat);
      return;
    }
    this.setCenter(lonLat);
    this.setZoom(zoom);
  }
  panBy(x, y) {
    this.control.callNativeMethod("panBy", x, y);
  }
  geolocationCurrent() {
    this.control.callNativeMethod("geolocationCurrent");
  }
  setFitView() {
    this.control.callNativeMethod('setFitView')
  }
  // 切换图层
  setMapType(type) {
    this.control.callNativeMethod('setMapType', type)
  }
  // 绘制建筑物图层
  renderBuildings(overlays) {
    this.control.callNativeMethod('renderBuildings', overlays)
  }
}

export default {
  Map: YMap,
};

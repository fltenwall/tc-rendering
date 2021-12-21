export default class Control {
  id;
  type;
  data;
  platform;
  constructor(prop, eventCallback, initSuccess, initError) {
    const { id, type, data, platform } = prop;
    this.id = id;
    this.type = type;
    this.data = data;
    this.platform = platform;
    console.log(type);
    this.init(eventCallback, initSuccess, initError);
  }
  init(eventCallback, initSuccess, initError) {
    let params = {
      ...this.data,
    };
    if (this.platform === "ios") {
      params.cid = this.id;
    }
    this.callNativeMethod("create", params, {
      onEvent: (e) => {
        eventCallback && eventCallback(e);
      },
      onError: (e) => {
        console.log("init map error", e);
        initError && initError(e);
      },
      onSuccess: (e) => {
        initSuccess && initSuccess(e);
      },
    });
  }
  setWebElementRegions(hotRegion) {
    this.setRegion(hotRegion, "webElement");
  }
  setNativeViewRegion(hotRegion) {
    this.setRegion([hotRegion], "nativeView");
  }
  setRegion(hotRegion, type) {
    if (!Array.isArray(hotRegion)) {
      console.warn("Regions expect be a Array");
      return;
    }
    let hotRegionData = hotRegion
      .map((item) => {
        if (typeof item === "string") {
          return this.getRectArea(item);
        }
        return item;
      })
      .filter((i) => i);
    if (type === "nativeView") {
      this.callNativeMethod("setNativeViewRegion", hotRegionData[0]);
    } else if (type === "webElement") {
      this.callNativeMethod("setWebElementRegions", hotRegionData);
    }
  }
  getRectArea(className) {
    const dom = document.querySelector(`.${className}`);
    if (!dom) return null;
    const rect = dom.getBoundingClientRect();
    return {
      x: rect.left,
      y: rect.top,
      height: rect.height,
      width: rect.width,
    };
  }
  callNativeMethod(action, ...arg) {
    const name = `m${this.type}TCRender`;
    if (!window[name]) {
      console.error("componentType 不合法，或未安装对应的插件，请检查！");
      return;
    }
    window[name][action] && window[name][action].apply(null, arg);
  }
  hideNativeView() {
    if (this.platform !== "android") return null;
    this.callNativeMethod("hideNativeView");
  }
  showNativeView() {
    if (this.platform !== "android") return null;
    this.callNativeMethod("showNativeView");
  }
  androidDeactivated() {
    const body = document.querySelector("body");
    if (body) {
      body.style.backgroundColor = this.defaultBackgroundColor;
    }
  }
  componentDestroyed() {
    this.callNativeMethod("destroy", this.id);
  }
  androidActivated() {
    const body = document.querySelector("body");
    this.defaultBackgroundColor = body.style.backgroundColor;
    body.style.backgroundColor = "transparent";
    this.callNativeMethod("display", true, this.id);
  }
  componentActivated(webElementRegion, nativeViewRegion) {
    this.isDeactivated = false;
    this.setWebElementRegions(webElementRegion);
    this.setNativeViewRegion(nativeViewRegion);
    if (this.platform === "android") {
      this.androidActivated();
      return;
    }
    this.callNativeMethod("display", true, this.id);
  }
  componentDeactivated() {
    this.isDeactivated = true;
    this.setWebElementRegions([
      {
        x: 0,
        y: 0,
        width: window.innerWidth,
        height: window.innerHeight,
      },
    ]);
    if (this.platform === "android") {
      this.androidDeactivated();
    }
    this.callNativeMethod("display", false, this.id);
  }
}

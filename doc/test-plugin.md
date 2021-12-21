# 高德地图文档 - 同层渲染

## 准备工作

使用前先到[高德地图开放平台](https://lbs.amap.com/dev/key/app)申请相关`AppKey`。相关步骤如下:

1. Android申请需要`package`和`sha1`，使用平台默认的签名文件时打包可使用以下`sha1`内容：

        生产环境：69:92:6F:98:03:ED:FF:56:C2:BD:6D:23:97:1A:AC:B5:4B:FB:63:3C
        其他环境：B0:24:17:1A:F3:90:2E:22:8D:96:BC:D6:45:B5:89:5B:46:5D:66:81

2. iOS申请需要应用`Bundle Id`。

因苹果审核机制，对位置使用权限需要进行授权，以下字段需要根据APP具体的使用权限级别，在隐私权限hook中添加详细的使用说明。

权限字段 | 类型 | 作用
--- | --- | ---
NSLocationUsageDescription | String  | 访问位置
NSLocationWhenInUseUsageDescription | String | 在使用期间访问位置
NSLocationAlwaysUsageDescription| String | 始终允许访问位置
NSLocationAlwaysAndWhenInUseUsageDescription | String |始终允许访问位置，iOS11新增，`NSLocationAlwaysUsageDescription`在功能上被降级为为“应用使用期间”
NSLocationTemporaryUsageDescriptionDictionary | Map | 申请精度定位，iOS14新增，必须要设置。当用户已授权过定位权限，且为模糊定位权限时，需要发起精度定位权限申请。若用户拒绝，会返回模糊位置。

hook示例
```js
// 获取info.plist配置文件对象：plistObj
......
plistObj.NSLocationUsageDescription = '如果不允许，将无法进行后续的业务操作';
plistObj. NSLocationWhenInUseUsageDescription = '如果不允许，可能导致应用功能无法正常使用';
plistObj. NSLocationAlwaysUsageDescription = '如果不允许，可能导致应用功能无法正常使用';
plistObj. NSLocationAlwaysAndWhenInUseUsageDescription = '如果不允许，可能导致应用功能无法正常使用';
plistObj. NSLocationTemporaryUsageDescriptionDictionary = {
    "FullAccuracyUsageDescription":'如果不允许，可能导致应用获取不到精确的位置信息';
};
```

3. 注册成功后，将获取到的`AppKey`在平台中添加插件时填到`GAODEMAP_KEY_IOS`和`GAODEMAP_KEY_ANDRIOD`中。

## API

### 目录

1. [创建地图](#创建地图)
2. [设置地图缩放级别](#设置地图缩放级别)
3. [获取地图缩放级别](#获取地图缩放级别)
4. [设置地图的中心点](#设置地图的中心点)
5. [定位到当前位置](#定位到当前位置)
6. [获取当前地图视图中的城市信息](#获取当前地图视图中的城市信息)
7. [绘制覆盖物](#绘制覆盖物)

### Android专用接口

1. [显示原生View](#显示原生View)
2. [隐藏原生View](#隐藏原生View)
3. [设置Web元素的位置](#设置Web元素的位置)
4. [设置原生View的位置](#设置原生View的位置)
5. [同时设置地图缩放级别和中心点](#同时设置地图缩放级别和中心点)
6. [移动地图](#移动地图)

#### <a name="创建地图"></a>创建地图

    mGaoDeMapTCRender.createMap(options, callback)

参数|类型|必填|说明
---|---|---|---
options|json|是|创建地图的参数，详情请参照下方[options](#createMap-options)结构说明
callback|object|是|创建地图的回调，详情请参照下方[callback](#createMap-callback)结构说明

<a name="createMap-options">options</a>结构说明

参数|类型|必填|说明
---|---|---|---
position|array|否|创建地图时中心点经纬度，数组固定长度为2，`array[0]`为经度，`array[1]`为纬度
zoom|float|否|创建地图时的缩放级别

<a name="createMap-callback">callback</a>结构说明

参数|类型|必填|说明
---|---|---|---
onSuccess|function|是|地图创建成功回调
onError(error)|function|是|地图创建失败回调
onEvent(event)|function|是|地图相关事件回调，[event](createMap-callback-event)参照表

<a name="createMap-callback-event">event</a>参照表

event|说明
---|---
zoomChange|地图缩放事件，格式为`{"event": "zoomChange", "zoom": 3.0}`，其中zoom为缩放的级别
moveEnd|地图拖动事件，格式为`{"event": "moveEnd"}`
layerClick|覆盖物点击事件，格式为`{"event": "layerClick", "data": {}}`，其中data为渲染覆盖物时传入的参数
mapClick|地图点击事件，格式为`{"event": "moveEnd"}`

```js
// 示例
mGaoDeMapTCRender.createMap({
  position: [103.53846432465264, 36.31571895071775],
  zoom: 3.0
}, {
  onSuccess: function () {
    console.log('onSuccess');
  },
  onError: function (error) {
    console.log('onError', error);
  },
  onEvent: function (event) {
    console.log('onEvent', event);
  }
});
```

#### <a name="设置地图缩放级别"></a>设置地图缩放级别

    mGaoDeMapTCRender.setZoom(zoom)

参数|类型|必填|说明
---|---|---|---
zoom|float|是|地图缩放级别

```js
// 示例
mGaoDeMapTCRender.setZoom(3.0);
```

#### <a name="获取地图缩放级别"></a>获取地图缩放级别

    mGaoDeMapTCRender.getZoom(callback)

参数|类型|必填|说明
---|---|---|---
callback(zoom)|function|是|`zoom`为地图缩放级别

```js
// 示例
mGaoDeMapTCRender.getZoom(
  function (zoom) {
    console.log('getZoom', zoom);
  }
);
```

#### <a name="设置地图的中心点"></a>设置地图的中心点

    mGaoDeMapTCRender.setCenter(lonLat)

参数|类型|必填|说明
---|---|---|---
lonLat|array|是|lonLat数组固定长度为2，`array[0]`为经度，`array[1]`为纬度

```js
// 示例
mGaoDeMapTCRender.setCenter([121.501654, 31.238068]);
```

#### <a name="定位到当前位置"></a>定位到当前位置

    mGaoDeMapTCRender.geolocationCurrent(show)

参数|类型|必填|说明
---|---|---|---
show|boolean|是|为`true`时定位到当前位置，为`false`时取消定位到当前位置，默认为`true`

```js
// 示例
mGaoDeMapTCRender.geolocationCurrent(true);
```

#### <a name="获取当前地图视图中的城市信息"></a>获取当前地图视图中的城市信息

    mGaoDeMapTCRender.getCity(callback)

参数|类型|必填|说明
---|---|---|---
callback(city)|function|是|`city`为获取到的城市信息，详情请参照下方[city](#getCity-city)结构说明

<a name="getCity-city">city</a>结构说明

参数|类型|说明
---|---|---
province|string|省
city|string|市
district|string|区

```js
// 示例
mGaoDeMapTCRender.getCity(
  function (city) {
    console.log('getCity', city);
  }
);
```

#### <a name="绘制覆盖物"></a>绘制覆盖物

    mGaoDeMapTCRender.renderMarkers(markers, moveToCenter)

参数|类型|必填|说明
---|---|---|---
markers|array|是|需要绘制的覆盖物内容，单个覆盖物详情请参照下方[marker](#renderMarkers-marker)结构说明
moveToCenter|boolean|否|是否根据覆盖物的位置改变地图状态，默认为`true`

<a name="renderMarkers-marker">marker</a>结构说明

```js
// 示例
mGaoDeMapTCRender.renderMarkers([
  {
    "id": "1",
    "type": "icon", // 图标类型
    "position": [113.93808453072029, 22.527625825601213],
    "icon": "https://resources-public.myfuwu.com.cn/rental/image/1618543539086/6XAEA4HJ.png",
    "selectIcon": "https://resources-public.myfuwu.com.cn/rental/image/1618543626396/JWc2Gsnr.png",
  },
  {
    "id": "2",
    "type": "iconText", // 图标文本类型
    "position": [113.95380898080109, 22.534244422535767],
    "icon": "https://resources-public.myfuwu.com.cn/rental/image/1618543539086/6XAEA4HJ.png",
    "selectIcon": "https://resources-public.myfuwu.com.cn/rental/image/1618543626396/JWc2Gsnr.png",
    "text": "丽雅查尔顿酒店"
  },
  {
    "id": "3",
    "type": "polyline", // 线类型
    "strokeOpacity": 1.0,
    "strokeColor": "#0D86FF",
    "selectStrokeColor": "#EB3B3B",
    "strokeWeight": 4.0,
    "path": [
      [113.94667966936146, 22.53063229103582],
      [113.93727852692508, 22.52368523762034]
    ]
  },
  {
    "id": "4",
    "type": "polygon", // 面类型
    "fillOpacity": 0.35,
    "fillColor": "#0D86FF",
    "selectFillColor": "#EB3B3B",
    "strokeOpacity": 1.0,
    "strokeColor": "#0D86FF",
    "selectStrokeColor": "#EB3B3B",
    "strokeWeight": 4.0,
    "path": [
      [113.9370357870134, 22.54519791844932],
      [113.9430157719098, 22.545289575836016],
      [113.93965630517611, 22.541078227653045]
    ]
  },
  {
    "id": "5",
    "type": "circle", // 圆类型
    "position": [113.9335140466371, 22.530198729807303],
    "title": "深圳大学",
    "content": "深圳大学学生楼"
  },
  {
    "id": "6",
    "type": "bubble", // 气泡类型
    "position": [113.9462531981354, 22.527126599830584],
    "title": "科苑",
    "count": 5,
    "opacity": 0.9,
    "selectColor": "#EB3B3B"
  }
]);
```

### Android专用接口说明

***Android端实现同层渲染的方案与iOS不同，需要以下几个接口做为实现方案的补充。以下几个接口均需要在 createMap 执行成功后调用***

#### <a name="显示原生View"></a>显示原生View

    mGaoDeMapTCRender.showNativeView()

说明：将WebView的背景设为透明，同时将原生view显示出来

#### <a name="隐藏原生View"></a>隐藏原生View

    mGaoDeMapTCRender.hideNativeView()

说明：将WebView的背景设为不透明，同时将原生view隐藏

#### <a name="设置Web元素的位置"></a>设置Web元素的位置

    mGaoDeMapTCRender.setWebElementRegions(regions)

说明：用来解决webView和nativeView的事件分发问题。

```js
// 示例
mGaoDeMapTCRender.setWebElementRegions([
  {
    "x": 0, // 元素起始点x坐标
    "y": 0, // 元素起始点y坐标
    "height": 55, // 元素宽
    "width": 360 // 元素高
  }, {
    "x": 20,
    "y": 625,
    "height": 50,
    "width": 324
  }, {
    "x": 0,
    "y": 705,
    "height": 50,
    "width": 360
  }
]);
```

#### <a name="设置原生View的位置"></a>设置原生View的位置

    mGaoDeMapTCRender.setNativeViewRegion(region)

```js
// 示例
mGaoDeMapTCRender.setNativeViewRegion({
  "x": 0, // view起始点x坐标
  "y": 55, // view起始点y坐标
  "height": 650, // view宽
  "width": 360 // view高
});
```

说明：用来解决webView和nativeView的事件分发问题。

#### <a name="同时设置地图缩放级别和中心点"></a>同时设置地图缩放级别和中心点

    mGaoDeMapTCRender.setZoomCenter(zoom, lonLat)

参数|类型|必填|说明
---|---|---|---
zoom|float|是|设置地图缩放级别
lonLat|array|是|lonLat数组固定长度为2，`array[0]`为经度，`array[1]`为纬度

```js
// 示例
mGaoDeMapTCRender.setZoomCenter(3.0, [121.501654, 31.238068])
```

#### <a name="移动地图"></a>移动地图

    mGaoDeMapTCRender.panBy(dx, dy)

参数|类型|必填|说明
---|---|---|---
dx|float|是|垂直方向移动距离
dy|float|是|水平方向移动距离

```js
// 示例
mGaoDeMapTCRender.panBy(100, 100])
```

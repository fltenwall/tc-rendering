# App-component 使用文档

App-component提供开箱即用的app同层渲染组件。

## 开发指南

### 安装

#### npm安装

```cmd
npm i app-component -S
```

### 快速上手

#### 引入App-component

在main.js中写入以下内容:

```js
import Vue from 'vue';
import AppComponent from 'app-component';
import App from './App.vue';

Vue.use(AppComponent);

new Vue({
  el: '#app',
  render: h => h(App)
});
```

## 组件

### map组件

一个跨平台的同屏渲染地图组件，支持web、android、ios三端。

目前地图样式是固定的，目前提供以下功能：
- 设置
- 点标记
- 被动移动地图事件响应功能

#### 准备工作

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

3. web端key直接申请即可

4. 注册成功后，将获取到的`AppKey`在平台中添加插件时填到`GAODEMAP_KEY_IOS`和`GAODEMAP_KEY_ANDRIOD`中，web端的key在使用组件时通过参数传入即可。

#### Map Attributes

参数|类型|平台|必填|说明|默认值
---|---|---|---|---|---
map-config|object|android、ios、web|是|创建地图的参数，详情请参照下方[options](#map-config)结构说明|—
custom-init|function|android、ios、web|否|创建地图成功后的回调，返回地图对象map，可以调用地图提供的方法，map的详情请参照下方[options](#map)结构说明|—
icon-to-img-map|object|android、ios|否|原生端不支持字体图标，通过这个对象将字体图标转换为图片|<div style="width: 100pt">`{iconicn_point:"https://resources-public.myfuwu.com.cn/rental/image/1618543539086/6XAEA4HJ.png",iconicn_subway:"https://resources-public.myfuwu.com.cn/rental/image/1618543626396/JWc2Gsnr.png",}`</div>|
map-version|string|web|否|web端加载高德地图的版本|1.4.15

<a name="map-config">map-config</a>结构说明

参数|类型|平台|必填|说明|默认值
---|---|---|---|---|---
zoom|number|android、ios、web|否|初始缩放值|3
position|array|android、ios、web|否|创建地图时初始中心点经纬度[longitude, latitude]|-
webElementRegion|string[]|android|是|屏幕中web元素的唯一的class,用来解决webView和nativeView的事件分发问题|-
nativeViewRegion|string|android|是|地图组件的唯一class,用来解决webView和nativeView的事件分发问题|-
mapKey|string|web|是|web地图加载时用到的高德地图key|-
pointsData|object[]|android、ios、web|是|绘制地图覆盖物的数据源，详情请参照下方[options](#pointsData)结构说明|-


<a name="map-config">pointsData</a>结构说明

```js
// 示例
[
  {
    "id": "1", // 唯一id
    "type": "icon", // 图标类型
    "position": [113.93808453072029, 22.527625825601213], // 位置[longitude, latitude]
    "icon": "iconicn_point", // 普通状态下的icon
    "selectIcon": "iconicn_point_active", // 选中状态下的icon
  },
  {
    "id": "2",
    "type": "iconText", // 图标文本类型
    "position": [113.95380898080109, 22.534244422535767],
    "icon": "iconicn_subway", // 普通状态下的icon
    "selectIcon": "iconicn_subway_active", // 选中状态下的icon
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
]
```

#### <a name="map">map</a>方法

下面的所有方法都支持callback与promise回调
##### <a name="获取当前地图视图中的城市信息"></a>获取当前地图视图中的城市信息

    map.getCity(callback)

参数|类型|必填|说明
---|---|---|---
callback(city)|function|否|`city`为获取到的城市信息，详情请参照下方[city](#getCity-city)结构说明

<a name="getCity-city">city</a>结构说明

参数|类型|说明
---|---|---
province|string|省
city|string|市
district|string|区

```js
// 示例
map.getCity(
  function (city) {
    console.log('getCity', city);
  }
);
```

##### <a name="定位到当前位置"></a>定位到当前位置

    map.geolocationCurrent(show)

参数|类型|必填|说明
---|---|---|---
show|boolean|是|为`true`时定位到当前位置，为`false`时取消定位到当前位置，默认为`true`

```js
// 示例
map.geolocationCurrent(true);
```

##### <a name="设置地图的中心点"></a>设置地图的中心点

    map.setCenter(lonLat)

参数|类型|必填|说明
---|---|---|---
lonLat|array|否|经纬度[longitude, latitude]

```js
// 示例
map.setCenter([121.501654, 31.238068]);
```

##### <a name="获取地图缩放级别"></a>获取地图缩放级别

    map.getZoom(callback)

参数|类型|必填|说明
---|---|---|---
callback(zoom)|function|否|`zoom`为地图缩放级别

```js
// 示例
map.getZoom(
  function (zoom) {
    console.log('getZoom', zoom);
  }
);
```

#### <a name="设置地图缩放级别"></a>设置地图缩放级别

    map.setZoom(zoom)

参数|类型|必填|说明
---|---|---|---
zoom|number|是|地图缩放级别

```js
// 示例
map.setZoom(3);
```

#### <a name="移动地图"></a>移动地图

    map.panBy(dx, dy)

参数|类型|必填|说明
---|---|---|---
dx|number|是|垂直方向移动距离
dy|number|是|水平方向移动距离

```js
// 示例
map.panBy(100, 100])
```

#### <a name="同时设置地图缩放级别和中心点"></a>同时设置地图缩放级别和中心点

    map.setZoomCenter(zoom, lonLat)

当需要同时修改地图缩放等级与地图中心点时请使用该方法，分开调用setCenter与setZoom在android会有定位不准的问题！

参数|类型|必填|说明
---|---|---|---
zoom|float|是|设置地图缩放级别
lonLat|array|是|lonLat数组固定长度为2，`array[0]`为经度，`array[1]`为纬度

```js
// 示例
map.setZoomCenter(3.0, [121.501654, 31.238068])
```

#### Map Event

event|说明
---|---
zoomChange|地图缩放事件，格式为`{"event": "zoomChange", "zoom": 3.0}`，其中zoom为缩放的级别
moveEnd|地图拖动事件，格式为`{"event": "moveEnd"}`
layerClick|覆盖物点击事件，格式为`{"event": "layerClick", "data": {}}`，其中data为渲染覆盖物时传入的参数
mapClick|地图点击事件，格式为`{"event": "mapClick"}`


#### 特别说明

1. 由于android实现方案的问题，当前页面元素变化时需要同时更新webElementRegion的值。
2. 需要重新刷新地图上的覆盖物时，更新pointsData的值即可
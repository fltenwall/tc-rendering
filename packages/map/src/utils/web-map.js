/* eslint-disable */

import Map, { pointType } from "./map";

export default class WebMap extends Map {
  showOverlayList = [];
  constructor(map, eventCallback) {
    super();
    this._map = map;
    this.eventCallback = eventCallback;
    window.AMap.event.addListener(this._map, "click", (e = {}) => {
      const bubble = this.getCurrentPointByTypes([pointType.BUBBLE]);
      const customCovering = this.getCurrentPointByTypes([
        pointType.ICON,
        pointType.ICONTEXT,
        pointType.POLYGON,
        pointType.POLYLINE,
      ]);
      resetProjectMarkers(bubble);
      resetAllOverlay(customCovering);
      this.eventCallback({ ...e, event: 'mapClick' })
    });
  }
  getZoom(callback) {
    return new Promise((resolve) => {
      const zoom = this._map.getZoom();
      resolve(zoom);
      callback(zoom);
    });
  }
  setCenter(postion) {
    this._map.setCenter(postion);
  }
  setZoom(zoom) {
    this._map.setZoom(zoom);
  }
  setZoomCenter(zoom, lonLat) {
    this.setCenter(lonLat);
    this.setZoom(zoom);
  }
  getCity(callback) {
    return new Promise((resolve) => {
      this._map.getCity((info) => {
        const currentCenter = this._map.getCenter()
        const data = {
          ...info,
          latitude: currentCenter.lat,
          longitude: currentCenter.lng
        }
        resolve(data);
        callback && callback(data);
      });
    });
  }
  panBy(x, y) {
    this._map.panBy(x, y);
  }
  getCurrentPointByTypes(types) {
    return this.showOverlayList.filter((item) => {
      const data = item.getExtData();
      return types.includes(data.type);
    });
  }
  $clickCallback(e, layer) {
    if (![pointType.CIRCLE].includes(e.type)) {
      const bubble = this.getCurrentPointByTypes([pointType.BUBBLE]);
      const customCovering = this.getCurrentPointByTypes([
        pointType.ICON,
        pointType.ICONTEXT,
        pointType.POLYGON,
        pointType.POLYLINE,
      ]);
      if (e.type === pointType.BUBBLE) {
        resetAllOverlay(customCovering);
        resetProjectMarkers(bubble, e);
      } else {
        resetProjectMarkers(bubble);
        updateClickOverlayStatus(layer, customCovering);
      }
    }
    this.eventCallback({
      ...e,
      event: "layerClick",
    });
  }
  updatePoints(newPoints) {
    this.currentPoints = newPoints;
    const marker = generateMarker(this._map, newPoints, (e, layer) => {
      this.$clickCallback(e, layer);
    });
    const { addList, removeList, showList } = diffPointsData(
      marker,
      this.showOverlayList
    );
    removeList.length && this._map.remove(removeList);
    if (addList.length) {
      this._map.add(addList);
    }
    this.showOverlayList = showList;
  }
  setFitView() {
    this._map.setFitView()
  }
  // 设置图层
  setLayer(type) {
    switch (type) {
      case 'satellite': // 卫星图
        this._map.setLayers([new AMap.TileLayer.Satellite()])
      break;

      case 'satelliteAndRoad': // 卫星和路网
        this._map.setLayers([
          new AMap.TileLayer.Satellite(),
          new AMap.TileLayer.RoadNet()
        ])
      break;

      case 'traffic':
        this._map.setLayers([
          new AMap.TileLayer.Traffic({
            zIndex: 10,
            zooms: [7, 22],
          })
        ])
      break;

      case 'buildings':
        this._map.center= [116.397428, 39.90923],
        this._map.pitch= 60,
        this._map.rotation= -35,
        // 隐藏默认楼块
        this._map.mapStyle= 'amap://styles/light',
        this._map.viewMode = '3D';
        console.log(this._map.viewMode);
        this._map.setLayers([
          new AMap.TileLayer(),
          new AMap.Buildings({
            zooms: [16, 18],
            zIndex: 10,
            heightFactor: 2 //2倍于默认高度，3D下有效
          })
        ])
      break;


      default: // 默认标准图层
        this._map.setLayers([AMap.createDefaultLayer()])
      
    }
  } 
}

function diffPointsData(newPoints, oldPoints) {
  const addList = newPoints.reduce((pre, cur) => {
    const shouldAdd =
      oldPoints.findIndex(
        (point) => cur.getExtData().id === point.getExtData().id
      ) === -1;
    if (shouldAdd) {
      pre.push(cur);
    }
    return pre;
  }, []);

  const removeList = oldPoints.reduce((pre, cur) => {
    const shouldAdd =
      newPoints.findIndex(
        (point) => cur.getExtData().id === point.getExtData().id
      ) === -1;
    if (shouldAdd) {
      pre.push(cur);
    }
    return pre;
  }, []);

  const showList = oldPoints.concat(addList).filter((item) => {
    return (
      removeList.findIndex(
        (remove) => remove.getExtData().id === item.getExtData().id
      ) === -1
    );
  });

  return {
    addList,
    removeList,
    showList,
  };
}

function generateMarker(map, newPoints, clickCallback) {
  return [
    ...renderCityOverlay(
      map,
      newPoints.filter((i) => [pointType.CIRCLE].includes(i.type)),
      clickCallback
    ),
    ...renderProjectOverlay(
      map,
      newPoints.filter((i) => i.type === pointType.BUBBLE),
      clickCallback
    ),
    ...renderCustomCovering(
      map,
      newPoints.filter((i) =>
        [
          pointType.ICON,
          pointType.ICONTEXT,
          pointType.POLYGON,
          pointType.POLYLINE,
        ].includes(i.type)
      ),
      clickCallback
    ),
  ];
}

function getCityContent(city) {
  return `<div class="overlay">
    <div class="overlay-wrap">
      <div class="overlay-item">${city.title}</div>
      <div class="overlay-item">${city.content}</div>
    </div>
  </div>`;
}

function getProjectContent(project, isActive = false) {
  return `<div class="overlay-project ${isActive ? "active" : ""}"">
    <div class="overlay-project-item">
      ${project.name}
      <span class="overlay-project-item-num ${
        project.count > 0 ? "show" : "hide"
      }">${project.count}</span>
    </div>
  </div>`;
}

function getDistrictContent(district) {
  return `<div class="overlay">
    <div class="overlay-wrap">
      <div class="overlay-item">${district.title}</div>
      <div class="overlay-item">${district.content}</div>
    </div>
  </div>`;
}

function getMarkerPointContent(marker, isActive) {
  return `
    <div class="marker-icon-wrap">
      <i class="iconfont ${marker.icon} ${
    isActive ? "active-click" : "active"
  }"></i>
      <div class="marker-icon-text">${marker.text}</div>
    </div>
  `;
}

function getPointProjectContent(marker, isActive) {
  return `
    <div class="marker-asset-icon">
      <i class="iconfont iconicn_point ${isActive ? "active" : ""}"></i>
    </div>
  `;
}

/**
 * @description: 创建项目覆盖物
 * @param {object} map 地图实例
 * @param {array} projectList 项目数组[{ position: [lng, lat], city_name: '', project_num: '' }]
 * @param {function} callback 项目覆盖物点击后的回调
 * @return: projectMarkers
 */
export const renderProjectOverlay = (map, projectList, callback) => {
  const projectMarkers = [];

  projectList.forEach((project) => {
    const offset = Array.isArray(project.offset) ? project.offset : [-60, 0];
    projectMarkers.push(
      new window.AMap.Marker({
        // map,
        position: project.position,
        offset: new window.AMap.Pixel(offset[0], offset[1]),
        extData: {
          id: project.id,
          project,
          type: project.type,
          count: project.count,
          name: project.name,
          active: false,
        },
        content: getProjectContent(project),
      })
    );
  });
  // 为每一个覆盖物绑定事件
  projectMarkers.forEach((marker) => {
    // 项目marker绑定click事件
    marker.on("click", () => {
      resetProjectMarkers(projectMarkers);
      // 设置当前点击的项目覆盖物为选中状态
      const extData = marker.getExtData();
      extData.active = true;

      marker.setContent(getProjectContent(extData.project, true));
      callback && callback(extData.project, marker);
    });
  });

  return projectMarkers;
};

/**
 * @description: 创建区域覆盖物
 * @param {object} map 地图实例
 * @param {array} cityList 区域数组[{ position: [lng, lat], city_name: '', project_num: '' }]
 * @param {function} callback 区域覆盖物点击后的回调
 * @return: districtMarkers
 */
export const renderDistrictOverlay = (map, districtList, callback) => {
  // 初始化地图标记，市覆盖物 添加覆盖物群组new AMap.OverlayGroup()
  const districtMarkers = [];

  districtList.forEach((district) => {
    const offset = Array.isArray(district.offset)
      ? district.offset
      : [-60, -40];
    districtMarkers.push(
      new window.AMap.Marker({
        position: district.position,
        offset: new window.AMap.Pixel(offset[0], offset[1]),
        extData: {
          id: district.id,
          district,
          name: district.district_name,
          project_num: district.total_project_nums,
        },
        content: getDistrictContent(district),
      })
    );
  });

  districtMarkers.forEach((marker) => {
    // 绑定城市click事件
    marker.on("click", () => {
      const extData = marker.getExtData();
      callback(extData.district, marker); // 跳转到城市下面的区域
    });
  });

  // return new window.AMap.OverlayGroup(districtMarkers);
  return districtMarkers;
};

/**
 * @description: 创建城市覆盖物
 * @param {object} map 地图实例
 * @param {array} cityList 城市数组[{ position: [lng, lat], city_name: '', project_num: '' }]
 * @param {function} callback 城市覆盖物点击后的回调
 * @return: cityMarkers
 */
export const renderCityOverlay = (map, cityList, callback) => {
  // 初始化地图标记，市覆盖物 添加覆盖物群组new AMap.OverlayGroup()
  const cityMarkers = [];

  cityList.forEach((city) => {
    const offset = Array.isArray(city.offset) ? city.offset : [-60, -40];
    cityMarkers.push(
      new window.AMap.Marker({
        position: city.position,
        offset: new window.AMap.Pixel(offset[0], offset[1]),
        extData: {
          id: city.id,
          city,
          name: city.city_name,
          project_num: city.total_project_nums,
        },
        content: getCityContent(city),
      })
    );
  });

  cityMarkers.forEach((marker) => {
    // 绑定城市click事件
    marker.on("click", () => {
      const extData = marker.getExtData();
      callback(extData.city, marker); // 跳转到城市下面的区域
    });
  });

  return cityMarkers;
};

// 清除项目覆盖物以及信息窗口
/**
 * @description: 清除项目覆盖物的选中背景颜色
 * @param {array} projectMarkers 项目覆盖物列表
 * @return: void
 */
export function resetProjectMarkers(projectMarkers, currentProject) {
  // 清空其它点击选中的project覆盖物
  projectMarkers.forEach((marker) => {
    const extData = marker.getExtData();
    marker.setzIndex(100);
    if (currentProject && extData.id === currentProject.id) {
      marker.setzIndex(999);
    }
    marker.setContent(
      getProjectContent(
        extData.project,
        currentProject && extData.id === currentProject.id
      )
    );
  });
}

export function resetAllOverlay(allOverlay) {
  if (!allOverlay) return;

  allOverlay.forEach((overlay) => {
    const data = overlay.getExtData();
    const { type } = data;

    if (type === pointType.ICONTEXT) {
      overlay.setContent(getMarkerPointContent(data));
    }

    if ([pointType.POLYGON, pointType.POLYLINE].includes(type)) {
      overlay.setOptions({
        strokeColor: data.strokeColor,
        fillColor: data.fillColor,
      });
    }

    if (type === pointType.ICON) {
      overlay.setContent(getPointProjectContent(data));
    }
  });
}

// 更新当前选中的标记点、项目线、项目面、资产点样式，并将之前选中的进行还原
export function updateClickOverlayStatus(clickOverlay, allOverlay) {
  resetAllOverlay(allOverlay);

  if (!clickOverlay) return;

  const data = clickOverlay.getExtData();
  const { type } = data;

  if (type === pointType.ICONTEXT) {
    clickOverlay.setContent(getMarkerPointContent(data, true));
  }

  if ([pointType.POLYGON, pointType.POLYLINE].includes(type)) {
    clickOverlay.setOptions({
      strokeColor: "#F04A57",
      fillColor: "#F04A57",
    });
  }

  if (type === pointType.ICON) {
    clickOverlay.setContent(getPointProjectContent(data, true));
  }
}

export function renderCustomCovering(map, list, callback) {
  return list.map((item) => transformLayer(item, callback));
}

export function transformLayer(overlay, callback) {
  let layer; // 高德覆盖物

  const offset = Array.isArray(overlay.offset) ? overlay.offset : [-53, -10];
  if (overlay.type === pointType.ICONTEXT) {
    layer = new window.AMap.Marker({
      position: overlay.position,
      content: getMarkerPointContent(overlay),
      offset: new window.AMap.Pixel(offset[0], offset[1]),
      extData: {
        ...overlay,
      },
    });
  }

  if (overlay.type === pointType.POLYLINE) {
    layer = new window.AMap.Polyline({
      ...overlay,
      extData: {
        ...overlay,
      },
    });
  }

  if (overlay.type === pointType.POLYGON) {
    layer = new window.AMap.Polygon({
      ...overlay,
      extData: {
        ...overlay,
      },
    });
  }

  if (overlay.type === pointType.ICON) {
    layer = new window.AMap.Marker({
      ...overlay,
      content: getPointProjectContent(overlay),
      extData: {
        ...overlay,
      },
    });
  }

  layer.on("click", () => {
    const extData = layer.getExtData();
    callback(extData, layer);
  });

  return layer;
}

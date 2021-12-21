<template>
  <div id="map-container" class="map"></div>
</template>

<script>
import remoteLoad from "../../utils/remoteLoad";
import WebMap from "./utils/web-map";

export default {
  name: "webMap",
  props: {
    mapVersion: {
      type: String,
      default: "1.4.15",
    },
    customInit: {
      type: Function,
      require: true,
    },
    plugin: {
      type: Array,
      default: () => {
        return [];
      },
    },
    mapConfig: {
      type: Object,
    },
    eventCallback: {
      type: Function,
    },
  },
  watch: {
    "mapConfig.pointsData": {
      deep: true,
      handler(val) {
        this.webMap.updatePoints(val, this.mapConfig.setFitView);
      },
    },
  },
  methods: {
    initMap() {
      const {
        position,
        zoom,
        minZoomLevel = 3,
        maxZoomLevel = 19,
      } = this.mapConfig;
      const map = new window.AMap.Map("map-container", {
        center: position,
        position: position,
        zoom: zoom,
        zooms: [minZoomLevel, maxZoomLevel],
        mapStyle: "amap://styles/c3dccecc6771e85f778bb19b1ea282b0",
      });
      // window.AMap.plugin("AMap.ToolBar", () => {
      //   // 在图面添加工具条控件，工具条控件集成了缩放、平移、定位等功能按钮在内的组合控件
      //   const toolBarPlugin = new window.AMap.ToolBar({
      //     position: "RT",
      //     liteStyle: true,
      //     locate: true,
      //   });
      //   map.addControl(toolBarPlugin);
      // });
      this.webMap = new WebMap(map, this.eventCallback);
      this.customInit(this.webMap);
      map.on(
        "zoomchange",
        (e) => {
          this.eventCallback({
            ...e,
            event: "zoomChange",
          });
        },
        this
      );
      map.on(
        "touchend",
        (e) => {
          this.eventCallback({
            ...e,
            event: "moveEnd",
          });
        },
        this
      ); // 移动端手势
      this.gaodeMap = map;
    },
    
  },

  async created() {
    if (window.AMap) {
      this.$nextTick(() => {
        this.initMap();
      });
    } else {
      let pluginStr = this.plugin.length
        ? `&plugin=${this.plugin.join(",")}`
        : "";
      await remoteLoad(
        `http://webapi.amap.com/maps?v=${this.mapVersion}&key=${this.mapConfig.mapKey}${pluginStr}`
      );
      this.initMap();
    }
  }
};
</script>

<style lang="less">
@map-red: #f73e4d;
@color-primary: #0d86ff;
.map {
  // 城市、区域覆盖物样式
  .overlay {
    width: 80px;
    height: 80px;
    font-size: 12px;
    font-weight: 500;
    color: #fff;
    border-radius: 50%;
    box-shadow: 0px 1px 3px 0px rgba(148, 151, 153, 0.7);
    text-align: center;
    background: rgba(36, 139, 242, 0.9);
    .overlay-wrap {
      position: relative;
      top: 50%;
      transform: translateY(-50%);
    }
    .overlay-item {
      line-height: 1.5;
    }
  }
  // 项目覆盖物样式
  .overlay-project {
    position: relative;
    padding: 6px 12px;
    font-size: 12px;
    color: #fff;
    font-weight: 500;
    box-shadow: 0px 1px 3px 0px rgba(148, 151, 153, 0.7);
    text-align: center;
    word-break: keep-all;
    white-space: nowrap;
    border-radius: 2px;
    background: @color-primary;
    &::after {
      content: "";
      position: absolute;
      right: calc(50% - 6px);
      bottom: -10px;
      border-width: 6px;
      border-style: solid;
      border-color: @color-primary transparent transparent transparent;
    }
    &-item-num {
      display: inline-block;
      width: 16px;
      height: 16px;
      margin-left: 6px;
      line-height: 16px;
      color: @color-primary;
      border-radius: 50%;
      background: #fff;
      &.show {
        display: inline-block;
      }
      &.hide {
        display: none;
      }
    }
    // 项目覆盖物处于选中状态
    &.active {
      background: @map-red;
      &::after {
        border-color: @map-red transparent transparent transparent;
      }
      .overlay-project-item-num {
        color: @map-red;
      }
    }
  }
  // 项目线、面、标记点、资产点覆盖物样式
  // 标记点icon样式
  #markericon() {
    .iconfont {
      display: inline-block;
      width: 20px;
      line-height: 20px;
      text-align: center;
      font-size: 17px;
      color: #fff;
      border-radius: 50%;
      background: #bec3c7;
      &.active {
        background: #0d86ff;
      }
      &.active-click {
        background: #f04a57;
      }
    }
    .text {
      font-size: 12px;
      color: #3b3d40;
    }
  }
  // 高德地图标记点
  .marker-icon-wrap {
    width: 106px;
    text-align: center;
    .iconfont {
      #markericon.iconfont();
    }
    .marker-icon-text {
      #markericon.text();
      word-break: break-all;
    }
  }
  // 资产点
  .marker-asset-icon {
    .iconfont {
      font-size: 20px;
      color: #0d86ff;
      &.active {
        color: #f04a57;
      }
    }
  }
  // 修复高德marker覆盖物，换行发生位移问题
  .amap-marker-content {
    white-space: normal !important;
  }
}
</style>

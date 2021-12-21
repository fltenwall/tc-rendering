<template>
  <tc-base
    :platform="platform"
    :initConfig="mapConfig"
    componentType="GaoDeMap"
    :webElementRegion="mapConfig.webElementRegion"
    :eventCallback="controlEventCallback"
    :initSuccess="initMap"
  />
</template>

<script>
import AMap from "./utils/native-map";
import tcBase from "../../tc-base/src/index";

export default {
  name: "nativeMap",
  components: {
    tcBase,
  },
  props: {
    eventCallback: {
      type: Function,
    },
    customInit: {
      type: Function,
    },
    platform: {
      type: String,
      require: true,
    },
    mapConfig: {
      type: Object,
      require: true,
    },
    iconToImgMap: {
      type: Object,
      default() {
        return {
          iconicn_point:
            "https://resources-public.myfuwu.com.cn/rental/image/1618543539086/6XAEA4HJ.png",
          iconicn_point_active:
            "https://resources-public.oss-cn-hangzhou.aliyuncs.com/rental/image/1618885007549/YHik4Y2Z.png",
          iconicn_subway:
            "https://resources-public.myfuwu.com.cn/rental/image/1618543626396/JWc2Gsnr.png",
          iconicn_subway_active:
            "https://resources-public.oss-cn-hangzhou.aliyuncs.com/rental/image/1618885111105/wx82ByZm.png",
        };
      },
    },
  },
  watch: {
    "mapConfig.pointsData": {
      deep: true,
      handler(val, oldVal) {
        if (this.isDeactivated) return;
        if (JSON.stringify(val) === JSON.stringify(oldVal)) return;
        this.map.updatePoints(val);
      },
    },
  },
  methods: {
    initMap(control) {
      this.map = new AMap.Map(control, this.iconToImgMap);
      this.customInit && this.customInit(this.map);
      this.map.geolocationCurrent(true)
      // 测试
      this.map.setMapType(2)
      this.map.renderBuildings([
        {
            "sideColor": "#E6B0E2FF", // 设置建筑物侧面颜色值
            "topColor": "#E65EB9FF", // 设置建筑物顶部颜色值
            "path": [ // 设置建筑物围栏坐标列表
                [
                    113.95420058331057,
                    22.540868895523726
                ],
                [
                    113.95418985447468,
                    22.54258813461517
                ],
                [
                    113.95774109914964,
                    22.542944861657737
                ],
                [
                    113.95750506476037,
                    22.540911009705425
                ]
            ]
        },
        {
            "sideColor": "#E6FFF0A3", // 设置建筑物侧面颜色值
            "topColor": "#E6FFD752", // 设置建筑物顶部颜色值
            "path": [ // 设置建筑物围栏坐标列表
                [
                    113.957941,
                    22.542938
                ],
                [
                    113.958821,
                    22.543076
                ],
                [
                    113.958778,
                    22.542284
                ],
                [
                    113.957963,
                    22.541848
                ]
            ],
        }
    ]
)
    },
    controlEventCallback(e) {
      if (!this.map) {
        console.warn("地图还未初始化完成，阻止触发事件");
        return;
      }
      const data = e.data || {}
      this.eventCallback({ ...e, ...data });
    },
  },
};
</script>

<style lang="less" scoped>
.ios-map {
  overflow: scroll;
  -webkit-overflow-scrolling: touch;
  .ios_child {
    height: 101%;
  }
}
</style>

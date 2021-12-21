<template>
  <div class="map">
    <map-header
      :data-list="orgData"
      :selectProject.sync="selectProject"
      :activeId.sync="activeId"
      :project-list="projectList"
      @clearAll="clearAll"
      @confirm="changeMapCondition"
      @toggleDropdown="toggleDropdown"
    />
    <tc-map
      :map-config="mapConfig"
      :custom-init="mapInit"
      :platform="platform"
      class="my-map"
      v-show="show"
      @layerClick="layerClick"
      @zoomChange="zoomchange"
      @mapClick="mapClick"
    />
    <div v-show="showBox" class="button-warpper" @click="clickBtn('click box')">
      <button @click="clickBtn('click btn')">测试按钮</button>
    </div>
    <div class="map-message">
      <div class="map-message-item" @click="clickMessage">
        <span class="map-message-item__num">8</span>
        <span class="map-message-item__desc">项目总数</span>
      </div>
      <div class="map-message-item" @click="clickDesc">
        <span class="map-message-item__num">26</span>
        <span class="map-message-item__desc">资产总数</span>
      </div>
      <div class="map-message-item" @click="clickAsset">
        <span class="map-message-item__num">1.59万</span>
        <span class="map-message-item__desc">资产面积(m)</span>
      </div>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
import MapHeader from "./map-header.vue";
import { cityData, customCovering } from "./utils/data";
import { getAllList } from "./utils/helper";
import { pointType } from "../../../packages/map/src/utils/map";

const projectList = [
  {
    name: "不限",
    key: "all",
  },
  {
    name: "办公",
    key: "work",
  },
  {
    name: "展会",
    key: "sdfs",
  },
  {
    name: "停车场",
    key: "park",
  },
  {
    name: "车辆",
    key: "car",
  },
  {
    name: "安置房",
    key: "house",
  },
];

export default {
  components: {
    MapHeader,
  },
  data() {
    return {
      mapProp: {
        mapKey: "40ed3d10162f06f1b4f37b5fbe7c354b",
      },
      show: true,

      platform: process.env.VUE_APP_PLATFORM,
      mapConfig: {
        zoom: 5,
        pointsData: [],
        center: [103.790728, 35.913137],
        position: [103.790728, 35.913137],
        webElementRegion: ["map-header", "map-message", "tab-bar"],
        nativeViewRegion: "my-map",
        mapKey: "40ed3d10162f06f1b4f37b5fbe7c354b",
      },
      showBox: false,
      activeId: "北京市",
      selectProject: ["all"],
      projectList,
      assetInfo: {
        total_project_nums: 0,
        total_asset_nums: 0,
        total_asset_area: 0,
      },
      pointsList: {
        cityList: [],
        districtList: [],
        projectList: [],
      },
      orgData: [],
      customCoveringData: {},
    };
  },
  computed: {},
  methods: {
    mapInit(map) {
      this.map = map;
      this.map.setZoomCenter(8, ['118.093781', '35.464176'])
      this.getMapData();
    },
    clickDesc() {
      // this.map.geolocationCurrent()
      if (this.showBox) {
        this.showBox = false
        this.mapConfig.webElementRegion = ["map-header", "map-message", "tab-bar"]
      } else {
        this.showBox = true
        this.mapConfig.webElementRegion = ["map-header", "map-message", "tab-bar", "button-warpper"]
      }
    },
    clickBtn(msg) {
      console.log(msg)
    },
    clickAsset() {
      this.map.setFitView()
    },
    disply() {
      this.show = !this.show
    },
    getMapData() {
      this.mapData = cityData.data;
      this.statisticInfo = {
        total_project_nums: this.mapData.total_project_nums,
        total_asset_nums: this.mapData.total_asset_nums,
        total_asset_area: this.mapData.total_asset_area,
      };
      this.setMapConfig();
    },
    clickMessage() {
      const panByY = window.screen.height
        ? -(Math.floor(window.screen.height / 2) - 100)
        : -220;
      this.map.panBy(0, panByY);
    },
    mapClick(e) {
      console.log(e, "-----mapClick----");
    },
    setMapConfig() {
      const { cityList, districtList, projectList } = getAllList(this.mapData);
      this.orgData = cityList;
      this.pointsList = {
        cityList: cityList.map((city) => {
          return {
            ...city,
            id: `${city.province_name}-${city.city_name}`,
            offset: [-60, 0],
            children: null,
            title: city.city_name,
            content: `${city.total_project_nums}个项目`,
            type: pointType.CIRCLE,
          };
        }),
        districtList: districtList.map((district) => {
          return {
            ...district,
            isDistrict: true,
            title: district.district_name,
            content: `${district.total_project_nums}个项目`,
            id: district.city_name_district_name,
            offset: [-60, -40],
            children: null,
            type: pointType.CIRCLE,
          };
        }),
        projectList: projectList.map((project) => {
          return {
            id: project.id,
            type: pointType.BUBBLE,
            name: project.name,
            title: project.name,
            offset: [-60, -40],
            city_name: project.city_name,
            district_name: project.district_name,
            province_name: project.province_name,
            city_name_district_name: project.city_name_district_name,
            position: project.position,
            count: project.children ? project.children.length : 0,
          };
        }),
      };

      this.zoomchange()
    },
    toggleDropdown(bool) {
      if (bool) {
        this.mapConfig.webElementRegion = [
          {
            x: 0,
            y: 0,
            width: window.innerWidth,
            height: window.innerHeight,
          },
        ];
      } else {
        this.mapConfig.webElementRegion = [
          "map-header",
          "map-message",
          "tab-bar",
        ];
      }
    },
    clearAll() {
      this.activeId = "0-n";
      this.selectProject = ["all"];
    },
    changeMapCondition(type) {
      console.log(type);
      // if (type === "area") {
      //   let areaArr = this.activeId.split("-");
      //   let id = "";
      //   if (areaArr[0] === "0") {
      //     id = "0";
      //   } else {
      //     if (areaArr[1] === "n") {
      //       id = areaArr[0];
      //     } else {
      //       id = this.activeId;
      //     }
      //   }
      //   console.log({ id }, "-----------", "changeMapCenter");
      //   this.map?.changeMapCenter({
      //     id,
      //   });
      // } else if (type === "project") {
      //   if (
      //     this.selectProject.length === 0 ||
      //     this.selectProject.includes("all")
      //   ) {
      //     this.mapConfig.pointsData = this.dataList
      //     return;
      //   }
      //   let data = JSON.parse(JSON.stringify(this.dataList));
      //   data.children = data.children.filter((item) => {
      //     item.children = item.children.filter((city) => {
      //       city.locations = city.locations.filter((l) =>
      //         this.selectProject.includes(l.type)
      //       );
      //       return city.locations.length > 0;
      //     });
      //     return item.children.length > 0;
      //   });
      //   this.mapConfig.pointsData = data
      // }
    },
    layerClick(e) {
      console.log(e, "------layerClick-----");
      if (e.type === pointType.CIRCLE) {
        this.map.setZoomCenter(e.isDistrict ? 16 : 8, e.position);
      }
    },
    async getCustomData(zoom) {
      // const city = await this.map.getCity();
      // const key = `${city["province"]}-${city["city"]}-${city["district"]}`;
      // this.currentCity = key;
      if (this.customCoveringData[zoom]) {
        return this.customCoveringData[zoom];
      }
      const url = `https://merchants-test.myfuwu.com.cn/assetCenter/app/asset-map/overlay-list?_t_=1619504592179&cid=deviceToken&version=&platform=Android&token=b13e8c0c21a1690f43b5d5fe5826b570&tenant_code=jqs&_smp=&level=${zoom}`;
      // return fetch(url, {
      //   headers: {
      //     "content-type": "application/json",
      //   },
      // })
      //   .then((res) => res.json())
      return Promise.resolve({})
        .then((res) => {
          if (zoom < 16) return []
          const customListData = customCovering.data.map((item) => {
            if (item.layer_name === "资产点") {
              return {
                ...item,
                type: pointType.ICON,
                icon: "iconicn_point",
                selectIcon: "iconicn_point_active",
                position: item.coordinate_info[0],
              };
            } else if (item.layer_name === "项目面") {
              const PolygonOptions = {
                strokeOpacity: 1,
                strokeWeight: 4,
                strokeStyle: "solid",
                fillOpacity: 0.35,
              };
              return {
                ...item,
                ...PolygonOptions,
                strokeColor: item.color,
                fillColor: item.color,
                path: item.coordinate_info,
                type: pointType.POLYGON,
              };
            } else if (item.layer_name === "项目线") {
              const PolylineOptions = {
                strokeOpacity: 1,
                strokeWeight: 4,
                strokeStyle: "solid",
              };
              return {
                ...PolylineOptions,
                type: pointType.POLYLINE,
                strokeColor: item.color,
                path: item.coordinate_info,
              };
            } else if (item.layer_name === "标记点") {
              return {
                ...item,
                type: pointType.ICONTEXT,
                text: item.title,
                icon: item.icon,
                selectIcon: `${item.icon}_active`,
                position: item.coordinate_info[0],
                offset: [-53, 10],
              };
            }
          });
          this.customCoveringData[zoom] = customListData;
          return customListData;
        });
    },
    async zoomchange() {
      const zoom = await this.map.getZoom();
      const customCoveringData = await this.getCustomData(zoom);
      let data = [];
      if (zoom <= 7) {
        data = JSON.parse(JSON.stringify(this.pointsList.cityList));
      } else if (zoom > 7 && zoom < 16) {
        data = JSON.parse(JSON.stringify(this.pointsList.districtList));
      } else if (zoom >= 16 && zoom < 20) {
        data = JSON.parse(JSON.stringify(this.pointsList.projectList));
      }
      this.mapConfig.pointsData = [...data, ...customCoveringData];
    },
  },
};
</script>

<style lang="less" scoped>
.map {
  width: 100%;
  height: 100%;
  position: relative;
  box-sizing: border-box;
  padding: 0 0 50px;
  display: flex;
  flex-direction: column;
  .my-map {
    flex: 1;
  }
  .button-warpper {
    position: absolute;
    top: 100px;
    left: 20px;
    height: 100px;
    width: 100px;
    background: red;
  }
  .map-message {
    position: absolute;
    bottom: 80px;
    left: 20px;
    display: flex;
    background-color: #fff;
    height: 50px;
    width: 90%;
    border-radius: 10px;
    align-items: center;
    box-sizing: border-box;
    padding: 10px 0;
    justify-content: space-around;
    &-item {
      display: flex;
      width: 30%;
      align-items: center;
      flex-direction: column;
      border-left: 1px solid #ccc;
      &__num {
        font-size: 16px;
        font-weight: 500;
      }
      &__desc {
        font-size: 12px;
        color: #ccc;
      }
      &:first-child {
        border-left: none;
      }
    }
  }
}
</style>

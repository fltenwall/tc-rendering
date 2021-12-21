import tcMap from "./src/index.vue";

tcMap.install = function(Vue) {
  Vue.component(tcMap.name, tcMap);
};

export default tcMap

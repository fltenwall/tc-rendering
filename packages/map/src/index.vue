<template>
  <web-map v-if="platform === 'web'" v-bind="$props" :eventCallback="eventCallback" />
  <native-map
    v-else-if="platform === 'ios' || platform === 'android'"
    v-bind="$props"
    :platform="platform"
    :eventCallback="eventCallback"
    :cid="id"
  />
</template>

<script>
import commonMixin from "../../mixin/common-mixin";
import nativeMap from "./native-map.vue";
import webMap from "./web-map";

export default {
  name: "tcMap",
  components: {
    webMap,
    nativeMap,
  },
  mixins: [commonMixin],
  props: {
    customInit: {
      type: Function,
    },
    mapConfig: {
      type: Object,
      require: true,
    },
    iconToImgMap: {
      type: Object,
    },
    mapVersion: {
      type: String,
      default: "1.4.15",
    },
  },
  data() {
    return {};
  },
  methods: {
    eventCallback(e) {
      this.$emit(e.event, e);
    },
  },
};
</script>

<style lang="less" scoped>
.my-map {
  height: 100%;
  width: 100%;
}
</style>

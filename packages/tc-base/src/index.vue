<template>
  <div :class="className">
    <div v-if="platform === 'ios'" class="ios_child" />
  </div>
</template>

<script>
import { v4 as uuidv4 } from "uuid";
import Control from "../../utils/control";

export default {
  name: "tcBase",
  props: {
    platform: {
      type: String,
      require: true,
    },
    componentType: {
      type: String,
      require: true,
    },
    webElementRegion: {
      type: Array,
      default() {
        return [];
      },
    },
    initConfig: {
      type: Object,
      default() {
        return {};
      },
    },
    eventCallback: {
      type: Function,
    },
    initSuccess: {
      type: Function,
    },
    initError: {
      type: Function,
    },
  },
  computed: {
    className() {
      return `${this.id} ${this.platform === "ios" ? "ios-map" : ""}`;
    },
  },
  watch: {
    // web元素出现变化时通知原生端
    webElementRegion(val) {
        if (this.control.isDeactivated) return;
        this.control.setWebElementRegions(val);
    },
  },
  data() {
    return {
      id: "cid_" + uuidv4(),
    };
  },
  created() {
    this.initComponent();
  },
  methods: {
    initComponent() {
      this.$nextTick(() => {
        const config = {
          data: this.initConfig,
          id: this.id,
          type: this.componentType,
          platform: this.platform,
        };
        const control = new Control(
          config,
          this.eventCallback,
          (e) => {
            control.componentActivated(this.webElementRegion, this.id)
            this.initSuccess && this.initSuccess(control, e);
          },
          this.initError
        );
        this.control = control
      });
    },
  },
  destroyed() {
    this.control && this.control.componentDestroyed()
  },
  activated() {
    this.control && this.control.componentActivated(this.webElementRegion, this.id)
  },
  deactivated() {
    this.control && this.control.componentDeactivated()
  }
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
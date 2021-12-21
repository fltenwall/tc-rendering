<template>
  <div class="box">
    <tc-base
      class="gallery"
      :platform="platform"
      :initConfig="config"
      componentType="Gallery"
      :webElementRegion="webElementRegion"
      :eventCallback="eventCallback"
      :initSuccess="initSuccess"
    />
    <button class="btn" @click="replaceImg">切换</button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      platform: process.env.VUE_APP_PLATFORM,
      config: {
        imageUrls: Array(20)
          .fill(0)
          .map((item, index) => "http://10.9.68.107:8080/" + index + ".jpg"),
        topMargin: 0,
        bottomMargin: 0,
        selectedIndex: 0, // 默认选中的图片，0 =< selectedIndex < imageUrls.length
      },
      index: 0,
      webElementRegion: ['btn']
    };
  },
  methods: {
    eventCallback(e) {
      console.log(e, "--------------");
    },
    replaceImg() {
      this.index = this.index === 20 ? 0 : this.index + 1
      this.control.callNativeMethod('replaceImageUrl', 'http://10.9.68.107:8080/big-1.jpg', this.index)
    },
    initSuccess(control) {
      this.control = control
    }
  },
};
</script>

<style lang="less" scoped>
.box {
  height: calc(100% - 50px);
  width: 100%;
}
.gallery {
  height: 100%;
  width: 100%;
}
.btn {
  position: absolute;
  top: 0;
  left: 0;
  width: 200px;
  height: 50px;
}
</style>

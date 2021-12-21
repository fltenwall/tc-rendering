<template>
  <div id="app">
    <keep-alive>
      <router-view />
    </keep-alive>
    <van-tabbar v-model="active" safe-area-inset-top route class="tab-bar">
      <van-tabbar-item replace to="/" icon="todo-list-o"
        >待办提醒</van-tabbar-item
      >
      <van-tabbar-item replace to="/map" icon="location-o"
        >移动地图</van-tabbar-item
      >
      <van-tabbar-item name="friends" icon="after-sale"
        >账单催款</van-tabbar-item
      >
      <van-tabbar-item name="setting" icon="contact">我的工作</van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script>
export default {
  name: "App",
  data() {
    return {
      active: "map",
    };
  },
};
</script>

<style lang="less">
html {
  height: 100%;
  width: 100%;
  padding: 0;
  margin: 0;
}
body {
  height: 100%;
  width: 100%;
  padding: 0;
  margin: 0;
}
#app {
  height: 100%;
  width: 100%;
  .tab-bar {
    z-index: 200;
  }
}
</style>

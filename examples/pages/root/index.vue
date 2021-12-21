<template>
  <div class="root">
    <router-link :to="{ name: 'map' }">map</router-link>
  </div>
</template>

<script>
export default {
  data() {
    return {
      
    }
  }
};
</script>

<style lang="less" scoped>
.root {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
}
</style>

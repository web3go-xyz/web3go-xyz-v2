<template>
  <BaseHeader />
  <div class="container-content">
    <div class="content">
      <BaseSide />
      <router-view></router-view>
    </div>
    <BaseFooter />
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  methods: {
    jumpUrl(url) {
      if (!url) {
        return;
      }
      window.open(url);
    },
  },
};
</script>
<style lang="less" scoped>
.container-content {
  .content {
    display: flex;
    min-height: calc(100vh - 332px);
  }
}
</style>


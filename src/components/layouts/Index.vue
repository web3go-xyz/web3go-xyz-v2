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
import BaseHeader from "./BaseHeader.vue";
import BaseSide from "./BaseSide.vue";
import BaseFooter from "./BaseFooter.vue";
export default {
  components: {
    BaseHeader,
    BaseSide,
    BaseFooter,
  },
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


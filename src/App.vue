<template>
  <el-config-provider namespace="ep">
    <Layout></Layout>
  </el-config-provider>
</template>
<script>
import Layout from "@/components/layouts/Index.vue";
export default {
  components: {
    Layout,
  },
};
</script>
<style>
#app {
  color: var(--ep-text-color-primary);
}
</style>

<template>
  <el-config-provider>
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
  color: var(--el-text-color-primary);
}
</style>

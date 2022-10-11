<template>
  <div class="address-icon">
    <template v-if="isPolkadot">
      <Identicon :size="iconSize" :theme="'polkadot'" :value="address" />
    </template>
    <img
      v-else
      class="eth-icon"
      v-bind:style="{ width: iconSize + 'px' }"
      :src="makeIcon4Ethereum(address)"
      alt=""
    />
  </div>
</template>

<script>
import Identicon from "vue3-polkadot-vue-identicon";
import makeBlockie from "ethereum-blockies-base64";
export default {
  components: { Identicon },
  props: {
    isPolkadot: {
      type: Boolean,
      default: false,
    },
    iconSize: {
      type: Number,
      default: 24,
    },
    address: {
      type: String,
    },
  },
  data() {
    return {};
  },
  methods: {
    makeIcon4Ethereum(address) {
      return makeBlockie(address);
    },
  },
};
</script>

<style lang="less" scoped>
</style>

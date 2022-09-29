

<template>
  <div class="head-wrap">
    <div class="h-left">
      <img
        v-if="isDark.value"
        class="logo"
        src="@/assets/layout/logo.png"
        alt=""
      />
      <img v-else class="logo" src="@/assets/layout/logo-white.png" alt="" />
      <el-menu class="el-menu-demo" mode="horizontal">
        <el-sub-menu index="1">
          <template #title>Go Analytics</template>
          <el-menu-item index="1-1">item one</el-menu-item>
          <el-menu-item index="1-2">item two</el-menu-item>
          <el-menu-item index="1-3">item three</el-menu-item>
        </el-sub-menu>
        <el-menu-item index="2">Go Push</el-menu-item>
        <el-menu-item index="3">Community</el-menu-item>
        <el-menu-item index="4">Learn</el-menu-item>
      </el-menu>
    </div>
    <div class="h-right">
      <div class="circle">
        <svg
          class="icon"
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M7.5 13C10.5376 13 13 10.5376 13 7.5C13 4.46243 10.5376 2 7.5 2C4.46243 2 2 4.46243 2 7.5C2 10.5376 4.46243 13 7.5 13Z"
            stroke="#F8F8F8"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M13.5 13.5L12 12"
            stroke="#F8F8F8"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </div>
      <div class="circle" @click="toggleDark()">
        <svg
          class="icon"
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M3.01665 8.04391C3.01633 8.04438 3.01598 8.04483 3.0156 8.04525C3.0135 8.04762 3.01 8.04961 3.00574 8.04878L3.01665 8.04391ZM3.01665 8.04391C3.66749 8.72997 4.58572 9.1594 5.60781 9.1594C7.59806 9.1594 9.21094 7.54653 9.21094 5.55627C9.21094 4.52467 8.7754 3.60349 8.08111 2.95091C8.08128 2.95058 8.08144 2.95024 8.08157 2.94987C8.08345 2.94479 8.08015 2.941 8.07896 2.93981L8.07897 2.93981L8.07875 2.93961C7.97089 2.83945 7.90312 2.69774 7.90312 2.53752C7.90312 2.24516 8.13223 2.01258 8.42178 1.9938C11.4191 2.26091 13.7719 4.77619 13.7719 7.84534C13.7719 11.091 11.1426 13.7203 7.89687 13.7203C4.82772 13.7203 2.31087 11.3659 2.04689 8.36708C2.06257 8.08074 2.29508 7.85315 2.58437 7.85315C2.75065 7.85315 2.89993 7.92698 2.99848 8.04385L3.01665 8.04391Z"
            fill="#F8F8F8"
            stroke="#F8F8F8"
            stroke-width="0.015625"
          />
        </svg>
      </div>
      <el-button type="primary">Create</el-button>
      <el-button plain @click="goSignIn">Sign In</el-button>
    </div>
    <SignInOrUp
      ref="signInOrUp"
      @goForgetPsd="goForgetPsd"
      @connectMetaMask="connectMetaMask"
    ></SignInOrUp>
    <ForgetPsd
      ref="forgetPsd"
      @goSignIn="goSignIn"
      @goResetPsd="goResetPsd"
    ></ForgetPsd>
    <ResetPsd ref="resetPsd"></ResetPsd>
    <ConnectWallet ref="connectWallet"></ConnectWallet>
  </div>
</template>

<script>
import { toggleDark } from "~/composables";
import SignInOrUp from "./SignInOrUp.vue";
import ForgetPsd from "./ForgetPsd.vue";
import ResetPsd from "./ResetPsd.vue";
import ConnectWallet from "./ConnectWallet.vue";
export default {
  components: {
    SignInOrUp,
    ForgetPsd,
    ResetPsd,
    ConnectWallet,
  },
  data() {
    return {
      toggleDark,
    };
  },
  methods: {
    connectMetaMask() {
      debugger
      this.$refs.connectWallet.connectMetaMask();
    },
    goForgetPsd() {
      this.$refs.forgetPsd.init();
    },
    goSignIn() {
      this.$refs.signInOrUp.init(true);
    },
    goResetPsd() {
      this.$refs.resetPsd.init();
    },
  },
};
</script>

<style lang="less" scoped>
&.dark .head-wrap {
  background: #232324;
}
.head-wrap {
  position: sticky;
  z-index: 2;
  top: 0;
  padding: 0 80px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 80px;
  background: white;
  .h-left {
    display: flex;
    align-items: center;
    .logo {
      margin-right: 25px;
      height: 34px;
    }
    .el-menu-demo {
      width: 500px;
      border-bottom: 0;
    }
  }
  .h-right {
    display: flex;
    align-items: center;
    .circle {
      margin-right: 12px;
      border: 1px solid #343435;
      border-radius: 34px;
      width: 32px;
      height: 32px;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
}
</style>
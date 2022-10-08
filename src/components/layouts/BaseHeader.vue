

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
      <div class="search-wrap">
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
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M13.5 13.5L12 12"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
        <el-autocomplete
          v-model="keyword"
          :fetch-suggestions="querySearch"
          clearable
          class="inline-input w-50"
          placeholder="Search"
          @select="handleSelect"
        />
      </div>
    </div>
    <div class="h-right">
      <div class="link">Community</div>
      <div class="link">Learn</div>
      <div class="circle" @click="toggleDark()">
        <svg
          v-if="isDark.value"
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
        <img v-else class="light" src="@/assets/layout/light.png" alt="" />
      </div>
      <el-button class="btn" type="primary">Create</el-button>
      <el-button class="btn2" plain @click="goSignIn">Sign In</el-button>
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
      keyword: "",
      toggleDark,
    };
  },
  methods: {
    querySearch(queryString, cb) {
      cb([]);
    },
    handleSelect() {},
    connectMetaMask() {
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
.dark .head-wrap {
  background: #232324;
  border-color: #232324 !important;
  .search-wrap {
    background: #313132 !important;
    .icon {
      path {
        stroke: #c9cdd4 !important;
      }
    }
  }
  .h-right {
    .circle {
      border: 1px solid #343435 !important;
    }
  }
}
.head-wrap {
  border-bottom: 1px solid #e5e6e8;
  position: sticky;
  z-index: 2;
  top: 0;
  padding: 0 80px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 79px;
  background: white;
  .h-left {
    display: flex;
    align-items: center;
    .logo {
      margin-right: 25px;
      height: 34px;
    }
    .search-wrap {
      display: flex;
      align-items: center;
      width: 214px;
      height: 38px;
      background: #f2f3f5;
      border-radius: 34px;
      box-sizing: border-box;
      padding: 0 12px;
      .icon {
        flex: none;
        path {
          stroke: #4e5969;
        }
      }
      ::v-deep(.el-autocomplete) {
        .el-input__wrapper {
          background: transparent;
          box-shadow: none;
        }
      }
    }
  }
  .h-right {
    display: flex;
    align-items: center;
    .link {
      font-weight: 600;
      font-size: 16px;
      line-height: 24px;
      margin-right: 32px;
      cursor: pointer;
      &:hover {
        color: var(--el-color-primary);
      }
    }
    .circle {
      cursor: pointer;
      margin-right: 32px;
      border: 1px solid #f8f8f8;
      border-radius: 34px;
      width: 32px;
      height: 32px;
      display: flex;
      justify-content: center;
      align-items: center;
      &:hover {
        border-color: var(--el-color-primary) !important;
      }
    }
    .light {
      width: 16px;
    }
    .btn {
      width: 97px;
      height: 44px;
    }
    .btn2 {
      width: 93px;
      height: 44px;
    }
  }
}
</style>
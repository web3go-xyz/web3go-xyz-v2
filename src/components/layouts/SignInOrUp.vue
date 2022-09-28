<template>
  <el-dialog
    v-model="visible"
    :title="isSignIn ? 'Sign In' : 'Sign Up'"
    width="520px"
  >
    <div class="dialot-content">
      <div class="subtitle">
        Enter your email and password to
        {{ isSignIn ? "sign in" : "sign up" }}!
      </div>
      <el-form
        ref="form"
        label-position="top"
        require-asterisk-position="right"
        :model="form"
        :rules="rules"
        class="form"
      >
        <el-form-item v-if="!isSignIn" label="Have a nick name" prop="nickname">
          <el-input v-model="form.nickname" placeholder="Enter a nick name" />
        </el-form-item>
        <el-form-item label="Email address" prop="email">
          <el-input v-model="form.email" placeholder="helloworld@gmail.com" />
        </el-form-item>
        <el-form-item label="Password" prop="passowrd">
          <el-input
            type="password"
            v-model="form.passowrd"
            placeholder="please enter your password..."
          />
        </el-form-item>
      </el-form>
      <div v-if="isSignIn" class="link-wrap">
        <div class="left">
          <span>Not registered yet? </span>
          <span class="link hover-item" @click="init(false)"
            >Create an Account</span
          >
        </div>
        <div class="right hover-item" @click="$emit('goForgetPsd')">
          Forget password?
        </div>
      </div>
      <div v-else class="link-wrap center">
        <div class="left">
          <span>Already have an account? </span>
          <span class="link hover-item" @click="init(true)">Sign in</span>
        </div>
      </div>
      <div class="btn-wrap">
        <el-button class="btn" type="primary" @click="sure">{{
          isSignIn ? "Sign In" : "Sign Up"
        }}</el-button>
      </div>
      <div class="split-wrap">
        <div class="split"></div>
        <span>or connect wallet</span>
        <div class="split"></div>
      </div>
      <div class="wallet-wrap">
        <div class="item hover-item">
          <img src="@/assets/layout/metamaskicon.png" alt="" />
        </div>
        <div class="item hover-item">
          <img src="@/assets/layout/polkadoticon.png" alt="" />
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<script>
export default {
  data() {
    return {
      visible: false,
      isSignIn: true,
      form: {
        nickname: "",
        email: "",
        passowrd: "",
      },
      rules: {
        email: [
          {
            required: true,
            message: "Email address cannot be empty",
            trigger: "blur",
          },
        ],
        passowrd: [
          {
            required: true,
            message: "Password cannot be empty",
            trigger: "blur",
          },
        ],
      },
    };
  },
  methods: {
    clearForm() {
      this.form = {
        nickname: "",
        email: "",
        passowrd: "",
      };
      this.$nextTick(() => {
        this.$refs.form.clearValidate();
      });
    },
    init(isSignIn) {
      this.visible = true;
      this.clearForm();
      this.isSignIn = isSignIn;
    },
    sure() {},
  },
};
</script>

<style lang="less" scoped>
.dark {
}
.dialot-content {
  padding-bottom: 40px;
  .subtitle {
    font-weight: 400;
    font-size: 14px;
    line-height: 22px;
    color: var(--77Color);
    margin-bottom: 32px;
  }
  .link-wrap {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-weight: 400;
    font-size: 14px;
    line-height: 22px;
    &.center {
      justify-content: center;
    }
    .left {
      color: var(--77Color);
      .link {
        color: var(--ep-color-primary);
      }
    }
    .right {
      color: var(--F8Color);
    }
  }
  .btn-wrap {
    margin-top: 32px;
    .btn {
      width: 100%;
      height: 48px;
    }
  }
  .split-wrap {
    margin-top: 32px;
    display: flex;
    align-items: center;
    .split {
      flex: 1;
      height: 1px;
      background: #373739;
    }
    span {
      margin: 0 15px;
      flex: none;
      font-weight: 400;
      font-size: 14px;
      line-height: 22px;
      color: var(--77Color);
    }
  }
  .wallet-wrap {
    margin-top: 32px;
    display: flex;
    justify-content: center;
    .item {
      margin: 0 6px;
      width: 84px;
      height: 56px;
      display: flex;
      align-items: center;
      background: #343435;
      border-radius: 12px;
      justify-content: center;
      img {
        height: 24px;
      }
    }
  }
}
</style>
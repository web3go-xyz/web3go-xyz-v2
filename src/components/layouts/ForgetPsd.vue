<template>
  <el-dialog v-model="visible" title="Forgot Password" width="520px">
    <div class="dialot-content">
      <div class="subtitle">
        No problem. Just let us know the email you use for Web3go account and
        we'll email you a security code and you can input at next step.
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
        <el-form-item label="Security code" prop="code">
          <el-input
            type="password"
            v-model="form.code"
            placeholder="please enter your security code..."
          />
        </el-form-item>
      </el-form>
      <div class="btn-wrap">
        <el-button class="btn" type="primary" @click="sure"
          >Next Step</el-button
        >
      </div>
      <div class="link-wrap">
        <div class="left">
          <span class="hover-item">Back to previous page </span>
        </div>
        <div class="hover-item link">Resend password reset email</div>
      </div>
    </div>
  </el-dialog>
</template>

<script>
export default {
  data() {
    return {
      visible: true,
      isSignIn: true,
      form: {
        email: "",
        code: "",
      },
      rules: {
        email: [
          {
            required: true,
            message: "Email address cannot be empty",
            trigger: "blur",
          },
        ],
        code: [
          {
            required: true,
            message: "Security code cannot be empty",
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
      this.clearForm();
      this.visible = true;
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
    word-break: initial;
    font-weight: 400;
    font-size: 14px;
    line-height: 22px;
    color: var(--77Color);
    margin-bottom: 32px;
  }
  .link-wrap {
    margin-top: 24px;
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
    }
    .link {
      color: var(--ep-color-primary);
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
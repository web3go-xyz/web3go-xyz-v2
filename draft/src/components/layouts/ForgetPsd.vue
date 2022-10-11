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
        <el-form-item class="email-row" label="Email address" prop="email">
          <el-input v-model="form.email" placeholder="helloworld@gmail.com" />
          <div v-if="alreadySend" class="btn disabled">Send Email</div>
          <div v-else class="btn hover-item" @click="sendEmail">Send Email</div>
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
          <span class="hover-item" @click="goSignIn"
            >Back to previous page
          </span>
        </div>
        <div class="hover-item link" @click="resend">
          Resend password reset email
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<script>
export default {
  data() {
    return {
      alreadySend: false,
      visible: false,
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
    resendEmail() {},
    sendEmail() {
      this.alreadySend = true;
      this.$message.success(
        "Email has been sent. Please check the security code in the email."
      );
      // this.$message({
      //   message: "Warning, this is a warning message.",
      //   type: "success",
      //   duration: 0,
      // });
    },
    goSignIn() {
      this.visible = false;
      this.$emit("goSignIn");
    },
    clearForm() {
      this.form = {
        email: "",
        code: "",
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
    sure() {
      this.visible = false;
      this.$emit("goResetPsd");
    },
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
  .email-row {
    ::v-deep(.el-form-item__content) {
      display: flex;
      .el-input {
        flex: 1;
      }
      .btn {
        font-weight: 600;
        font-size: 14px;
        line-height: 22px;
        flex: none;
        margin-left: 12px;
        color: var(--el-color-primary);
        &.disabled {
          color: var(--77Color);
        }
      }
    }
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
      color: var(--el-color-primary);
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
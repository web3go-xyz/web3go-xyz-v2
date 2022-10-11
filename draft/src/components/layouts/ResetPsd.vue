<template>
  <el-dialog v-model="visible" title="Reset Password" width="520px">
    <div class="dialot-content">
      <el-form
        ref="form"
        label-position="top"
        require-asterisk-position="right"
        :model="form"
        :rules="rules"
        class="form"
      >
        <el-form-item label="Enter your new password" prop="password">
          <el-input
            type="password"
            v-model="form.password"
            placeholder="Please enter your new password"
          />
        </el-form-item>
      </el-form>
      <div class="btn-wrap">
        <el-button class="btn" type="primary" @click="sure">Save</el-button>
      </div>
      <div class="link-wrap">
        <div class="left"> 
          <span class="hover-item" @click="goHome">Back to home page </span>
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
        password: "",
      },
      rules: {
        password: [
          {
            required: true,
            message: "new password cannot be empty",
            trigger: "blur",
          },
        ],
      },
    };
  },
  methods: {
    goHome() {},

    clearForm() {
      this.form = {
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
    sure() {
      this.visible = false;
    },
  },
};
</script>

<style lang="less" scoped>
.dark {
}
.dialot-content {
  padding-bottom: 40px;
  padding-top: 20px;
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
    justify-content: center;
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
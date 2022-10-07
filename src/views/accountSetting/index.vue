<template>
  <div class="page">
    <div class="common-bread">
      <div class="item">User</div>
      <div class="split">/</div>
      <div class="item active">Account Setting</div>
    </div>
    <div class="page-main">
      <div class="nav">
        <div class="n-title">My Space</div>
        <div class="nav-list">
          <div class="item">Account Setting</div>
        </div>
      </div>
      <div class="pm-right">
        <div class="banner">
          <div class="avatar">
            <img src="@/assets/account/Avatar.png" alt="" />
          </div>
          <div class="text">
            Everyone can <br />
            play with blockchain data
          </div>
        </div>
        <el-form
          ref="form"
          label-position="top"
          require-asterisk-position="right"
          :model="form"
          :rules="rules"
          class="form"
        >
          <div class="name">Arthur</div>
          <div class="id">Web3Go ID : 234156567</div>
          <el-form-item class="nickname-row" label="Nickname" prop="nickname">
            <el-input
              style="width: 504px"
              v-model="form.nickname"
              placeholder="Arthur"
            />
            <img class="hover-item" src="@/assets/account/edit.png" alt="" />
          </el-form-item>

          <div class="form-item">
            <div class="label">Avatar</div>
            <div class="value">
              <img src="@/assets/account/Avatar.png" alt="" />
              <el-button plain @click="changeAvatar">Change</el-button>
              <span class="tip">JPG or PNG. Max size is 1MB</span>
            </div>
          </div>
          <div class="split"></div>
          <div class="form-item">
            <div class="label">Email</div>
            <el-button class="add-email" type="primary">
              <img src="@/assets/account/add.png" alt="" />
              <span> Link Email </span>
            </el-button>
            <!-- <div class="email-list">

            </div> -->
          </div>
          <div class="split"></div>
          <div class="form-item">
            <div class="label">Wallet</div>

            <div class="wallet-list">
              <div class="item">
                <img src="" alt="">
              </div>
            </div>
          </div>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      form: {
        nickName: "",
      },
      rules: {
        nickname: [
          {
            required: true,
            message: "nickName cannot be empty",
            trigger: "blur",
          },
        ],
      },
    };
  },
  methods: {
    changeAvatar() {},
  },
};
</script>

<style lang="scss" scoped>
.page {
  width: 100%;
  padding: 20px 120px;
  .page-main {
    padding-top: 19px;
    display: flex;

    .nav {
      flex: none;
      .n-title {
        font-weight: 400;
        font-size: 14px;
        line-height: 22px;
        width: 183px;
        height: 44px;
        display: flex;
        align-items: center;
        padding: 0 24px;
      }
      .nav-list {
        .item {
          width: 183px;
          height: 44px;
          display: flex;
          align-items: center;
          padding: 0 24px;
          background: #2a2a2c;
          border-radius: 12px;
          font-weight: 600;
          font-size: 14px;
          line-height: 22px;
        }
      }
    }
    .pm-right {
      margin-left: 71px;
      flex: 1;
      .banner {
        position: relative;
        background-image: url(@/assets/account/banner.png);
        background-repeat: no-repeat;
        background-size: cover;
        background-position: center;
        height: 100px;
        display: flex;
        align-items: center;
        justify-content: flex-end;
        padding: 0 48px;
        .avatar {
          position: absolute;
          left: 16px;
          bottom: -80px;
          img {
            width: 116px;
            height: 116px;
          }
        }
        .text {
          font-weight: 600;
          font-size: 20px;
          line-height: 28px;
          width: 246px;
        }
      }
      .form {
        // width: 540px;
        padding-left: 155px;
        padding-top: 14px;
        ::v-deep(.el-form-item__content) {
          width: 540px;
        }
        .name {
          font-weight: 600;
          font-size: 24px;
          line-height: 32px;
        }
        .id {
          font-weight: 400;
          font-size: 14px;
          line-height: 22px;
          margin-bottom: 32px;
        }
        .nickname-row {
          ::v-deep(.el-form-item__content) {
            display: flex;
            .el-input {
              flex: 1;
            }
            img {
              width: 24px;
              margin-left: 12px;
            }
          }
        }
        .form-item {
          .label {
            font-weight: 400;
            font-size: 14px;
            line-height: 22px;
            margin-bottom: 12px;
          }
          .value {
            display: flex;
            align-items: center;
            img {
              width: 48px;
              height: 48px;
              border-radius: 50%;
              margin-right: 20px;
            }
            ::v-deep(.el-button) {
              width: 100px;
              height: 44px;
              margin-right: 8px;
            }
            .tip {
              font-weight: 400;
              font-size: 12px;
              line-height: 20px;
            }
          }
          .add-email {
            width: 119px;
            height: 48px;
            img {
              width: 16px;
              margin-right: 4px;
            }
          }
        }
        .split {
          width: 100%;
          height: 1px;
          background: #272e3b;
          margin: 24px 0;
        }
      }
    }
  }
}
</style>
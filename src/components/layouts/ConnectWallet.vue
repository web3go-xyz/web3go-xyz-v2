<template>
  <el-dialog v-model="visible" title="Connect Wallet" width="520px">
    <div class="dialot-content">
      <div class="section">
        <div class="section-title">Choose Wallet</div>
        <div class="list">
          <div
            class="item hover-item"
            :class="{ active: walletType == 'metamask' }"
            @click="connectMetaMask"
          >
            <div class="center">
              <div class="img-wrap">
                <img src="@/assets/layout/metamaskicon.png" alt="" />
              </div>
              <div class="text">Metamask</div>
            </div>
          </div>
          <div
            class="item hover-item"
            :class="{ active: walletType == 'polkadot' }"
            @click="connectPolkadot"
          >
            <div class="center">
              <div class="img-wrap">
                <img src="@/assets/layout/polkadoticon.png" alt="" />
              </div>
              <div class="text">Polkadot.js</div>
            </div>
          </div>
        </div>
      </div>
      <div class="section" v-if="walletType == 'polkadot'">
        <div class="section-title">Choose Account</div>
        <div class="list">
          <div
            v-for="(v, i) in accounts"
            :key="i"
            class="item hover-item"
            @click="selectMetaBaseAccount"
          >
            <div class="center flex">
              <IdentityIcon
                isPolkadot
                address="67GdmSznJLbqAX84JUY4GwYFXuEsAFQegEZCXFv1btzGbDbq"
              ></IdentityIcon>
              <div class="right">
                <div class="name">Account-01</div>
                <div class="address">
                  {{
                    $utils.shorterAddress(
                      "67GdmSznJLbqAX84JUY4GwYFXuEsAFQegEZCXFv1btzGbDbq"
                    )
                  }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="btn-wrap">
        <el-button class="btn" type="primary" @click="connect"
          >Connect wallet</el-button
        >
      </div>
    </div>
  </el-dialog>
</template>

<script>
import IdentityIcon from "@/components/IdentityIcon.vue";
import Web3 from "web3";
export default {
  components: {
    IdentityIcon,
  },
  data() {
    return {
      walletType: "",
      linkLoading: false,
      web3: null,
      visible: false,
      polkadotAccountList: [{}, {}],
    };
  },
  methods: {
    async connectMetaMask() {
      // 引入web3
      this.linkLoading = true;
      this.web3 = new Web3(ethereum);
      try {
        await ethereum.send("eth_requestAccounts");
      } catch (error) {
        console.error("User denied account access");
        this.linkLoading = false;
        return;
      }

      this.web3.eth.getAccounts((err, accs) => {
        console.log("web3 accounts:", accs);
        this.ethAccountList = accs;
        if (accs.length === 0) {
          console.error(
            "cannot get account, please check if Metamask has been configured？"
          );
          return;
        }
        if (err != null) {
          console.error(
            "cannot get account, please check if the MetaMask has been installed."
          );
          return;
        }
        this.solveAccounts(accs[0]);
      });
      ethereum.on("accountsChanged", (accs) => {
        this.solveAccounts(accs[0]);
      });
    },
    selectMetaBaseAccount(acc) {},
    solveAccounts(acc) {
      // 查询token余额
      this.web3.eth.getBalance(acc).then((d) => {
        debugger;
        // this.linkAccount.freeBalance = this.formatWithDecimals(d).toString();
        // this.linkAccount.address = acc[0];
        const walletData = {
          walletType: "metamask",
          address: acc,
          name: acc,
          balance: {
            free: 0,
            reserved: 0,
            total: 0,
          },
        };
        localStorage.setItem("alreadyLinkMetaMask", true);
        this.linkLoading = false;
      });
    },
    async connectPolkadot() {
      await web3Enable("Web3Go");
      this.polkadotAccountList = await web3Accounts({
        // ss58Format: ss58Format,
        accountType: ["ed25519", "sr25519", "ecdsa"],
      });
    },
    init() {
      this.visible = true;
    },
    connect() {
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
    ::v-deep(.ep-form-item__content) {
      display: flex;
      .ep-input {
        flex: 1;
      }
      .btn {
        font-weight: 600;
        font-size: 14px;
        line-height: 22px;
        flex: none;
        margin-left: 12px;
        color: var(--ep-color-primary);
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
  .section {
    & + .section {
      margin-top: 24px;
    }
    .section-title {
      font-weight: 400;
      font-size: 14px;
      line-height: 22px;
      color: var(--F8Color);
    }
    .list {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      grid-gap: 12px;
      margin-top: 12px;
      .item {
        width: 139px;
        height: 80px;
        box-sizing: border-box;
        display: flex;
        justify-content: center;
        align-items: center;
        text-align: center;
        background: #343435;
        border-radius: 12px;
        border: 2px solid transparent;
        &.active {
          border: 2px solid var(--ep-color-primary);
        }
        .img-wrap {
          img {
            height: 24px;
          }
        }
        .text {
          font-weight: 600;
          font-size: 14px;
          line-height: 22px;
          color: var(--F8Color);
        }
        .flex {
          display: flex;
          .right {
            margin-left: 5px;
            .name {
              font-weight: 600;
              font-size: 14px;
              line-height: 22px;
              color: var(--F8Color);
              max-width: 100px;
              overflow: hidden;
              white-space: nowrap;
              text-overflow: ellipsis;
            }
            .address {
              font-weight: 400;
              font-size: 12px;
              line-height: 20px;
            }
          }
        }
      }
    }
  }
}
</style>
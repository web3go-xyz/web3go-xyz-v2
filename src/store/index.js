import { createStore } from 'vuex'

let defaultParaChainParams = {
    // Turing Staging, Turing, OAK
    name: "Turing Staging",
    // STUR,TUR,TUR
    symbol: 'STUR',
    decimals: 10,
    // polkadot.js talisman
    walletSupport: "polkadot.js",
    ss58Format: 51, // polkadot.js
    // ['wss://rpc.turing-staging.oak.tech']
    // ['wss://rpc.turing.oak.tech']
    // ['wss://rpc.turing.oak.tech']
    rpcUrls: [],
};


// Create a new store instance.
export default createStore({
    state() {
        return {
            walletData: {
                walletType: '',
                address: '',
                name: '',
                balance: {
                    free: 0,
                    reserved: 0,
                    total: 0
                }
            },
            paraChainParams: defaultParaChainParams
        }
    },
    mutations: {
        setWalletData(state, value) {
            state.walletData.walletType = value.walletType;
            state.walletData.address = value.address;
            state.walletData.name = value.name;
            state.walletData.balance.free = Number(value.balance.free);
            state.walletData.balance.reserved = Number(value.balance.reserved);
            state.walletData.balance.miscFrozen = Number(value.balance.miscFrozen);
            state.walletData.balance.total = Number(state.walletData.balance.free) + Number(state.walletData.balance.reserved);
            state.walletData.balance.transferable = Number(state.walletData.balance.free) - Number(state.walletData.balance.miscFrozen);

        },
        setParaChainParams(state, value) {
            localStorage.setItem('paraChainParams', JSON.stringify(value));
            state.paraChainParams = value;
        }
    }
})
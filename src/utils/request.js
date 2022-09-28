import axios from 'axios'
import store from '../store';


const service = axios.create({
    baseURL: '', // url = base url + request url 
    timeout: 60000, // request timeout
})

// request interceptor
service.interceptors.request.use(
    config => {
        let baseUrl = window.BASE_API;
        const paraChainParams = store.state.paraChainParams;
        const name = paraChainParams.name;
        if (name == 'Turing Staging') {
            if (window.TURING_STAGING_API_PREFIX) {
                baseUrl += '/' + window.TURING_STAGING_API_PREFIX;
            }
        } else if (name == 'Turing') {
            if (window.TURING_KUSAMA_API_PREFIX) {
                baseUrl += '/' + window.TURING_KUSAMA_API_PREFIX;
            }
        } else {
            if (window.TURING_POLKADOT_API_PREFIX) {
                baseUrl += '/' + window.TURING_POLKADOT_API_PREFIX;
            }
        }
        config.url = baseUrl + config.url;
        return config
    },
    error => {
        console.log('error:', error) // for debug 
        return Promise.reject(error)
    }
)

// response interceptor
service.interceptors.response.use(

    response => {
        const res = response.data
        return res;

    },
    error => {
        console.log('error:', error) // for debug 
        return Promise.reject(error)
    }
)

export default service
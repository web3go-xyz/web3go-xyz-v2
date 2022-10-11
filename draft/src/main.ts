import { createApp } from "vue";
import App from "./App.vue";
import * as utils from '@/utils';
import { isDark } from '@/composables/dark';
import store from './store/index';
import router from './router/index';
import { ElMessage } from 'element-plus'

import ElementPlus from "element-plus";
// import all element css, uncommented next line
import "element-plus/dist/index.css";
import 'element-plus/theme-chalk/dark/css-vars.css'

// or use cdn, uncomment cdn link in `index.html`

import "~/styles/index.scss";
// import 'uno.css'

const app = createApp(App);
app.config.globalProperties.$message = ElMessage;
app.config.globalProperties.isDark = isDark;
app.config.globalProperties.$utils = utils;

app.use(ElementPlus);
app.use(store);
app.use(router);
app.mount("#app");

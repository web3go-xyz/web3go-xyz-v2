import { createApp } from "vue";
import App from "./App.vue";
import * as utils from '@/utils';
import { isDark } from '@/composables/dark';
import store from './store/index';
import router from './router/index';
 
// import "~/styles/element/index.scss";

// import ElementPlus from "element-plus";
// import all element css, uncommented next line
// import "element-plus/dist/index.css";

// or use cdn, uncomment cdn link in `index.html`

import "~/styles/index.scss";
// import 'uno.css'

// If you want to use ElMessage, import it.
import "element-plus/theme-chalk/src/message.scss"

const app = createApp(App);
app.config.globalProperties.isDark = isDark;
app.config.globalProperties.$utils = utils;

// app.use(ElementPlus);
app.use(store);
app.use(router);
app.mount("#app");

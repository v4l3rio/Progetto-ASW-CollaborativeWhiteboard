import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import 'bootstrap';
import store from "core-js/internals/shared-store";
import VueCookies from 'vue-cookies'

const app = createApp(App);
app.config.globalProperties.$socket = {};

app.use(store).use(router).use(VueCookies, { expires: '7d'}).mount('#app');




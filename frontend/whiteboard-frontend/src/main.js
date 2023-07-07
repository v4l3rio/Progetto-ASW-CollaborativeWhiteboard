import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import 'bootstrap';
import store from "core-js/internals/shared-store";

const app = createApp(App);
app.config.globalProperties.$socket = {};

app.use(store).use(router).mount('#app');




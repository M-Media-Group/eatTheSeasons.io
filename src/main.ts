import { createApp } from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import router from "./router";
import store from "./store";

import "./styles/main.scss";

// axios.defaults.baseURL = process.env.VUE_APP_BASE_API_URL;

createApp(App).use(store).use(router).mount("#app");

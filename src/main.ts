import { createApp } from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import router from "./router";
import store from "./store";

import "./styles/main.scss";

// Event bus listeners
import "./eventBus/listeners/index";

// axios.defaults.baseURL = process.env.VITE_API_URL;

createApp(App).use(store).use(router).mount("#app");

import { createStore } from "vuex";
import auth from "./auth";
import foodItems from "./foodItems";

export default createStore({
  state: {},
  getters: {},
  mutations: {},
  actions: {},
  modules: {
    auth,
    foodItems,
  },
});

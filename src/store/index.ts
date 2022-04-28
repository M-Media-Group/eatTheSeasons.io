import { createStore } from "vuex";
import auth from "./auth";
import foodItems from "./foodItems";
import app from "./app";
import consumedItems from "./consumedItems";

export default createStore({
  state: {},
  getters: {},
  mutations: {},
  actions: {},
  modules: {
    auth,
    foodItems,
    app,
    consumedItems,
  },
});

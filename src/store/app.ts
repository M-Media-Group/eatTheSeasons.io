import { Commit, Dispatch } from "vuex";
import router from "@/router";

export default {
  namespaced: true,
  state: {
    isInBeta: false, // Currently not used
    supportsIndexedDB: process.env.VUE_APP_USE_INDEXED_DB === "true",
  },
  getters: {
    isInBeta(): boolean {
      return router.currentRoute.value.query.beta === "true";
    },
    supportsIndexedDB(state: { supportsIndexedDB: boolean }): boolean {
      return state.supportsIndexedDB;
    },
  },
  mutations: {
    SET_IN_BETA(state: { isInBeta: boolean }, value: boolean): void {
      state.isInBeta = value;
    },
  },
  actions: {
    setInBeta({ commit }: { commit: Commit }, value: boolean): void {
      commit("SET_IN_BETA", value);
    },
  },
};

import { Commit, Dispatch } from "vuex";

export default {
  namespaced: true,
  state: {
    isSignedUp: localStorage.getItem("isSignedUp") === "true" ? true : false,
  },
  getters: {
    isSignedUp(state: { isSignedUp: boolean }): boolean {
      return state.isSignedUp;
    },
  },
  mutations: {
    SET_SIGNED_UP(state: { isSignedUp: boolean }, value: boolean): void {
      state.isSignedUp = value;
      localStorage.setItem("isSignedUp", value.toString());
      gtag("event", "signup_form_complete");
    },
  },
  actions: {
    signUp({ commit }: { commit: Commit }, value: boolean): void {
      commit("SET_SIGNED_UP", value);
    },
  },
};

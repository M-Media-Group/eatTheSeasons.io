import { FoodItem as FoodItemTs } from "@/types/foodItem";
import { Commit, Dispatch } from "vuex";
import axios from "axios";

export default {
  namespaced: true,
  state: {
    foodItems: [] as FoodItemTs[],
  },
  getters: {
    foodItems(state: { foodItems: FoodItemTs[] }): FoodItemTs[] {
      return state.foodItems;
    },
  },
  mutations: {
    SET_FOOD_ITEMS(state: { foodItems: boolean }, value: boolean): void {
      state.foodItems = value;
    },
  },
  actions: {
    setFoodItems({ commit }: { commit: Commit }, value: boolean): void {
      commit("SET_FOOD_ITEMS", value);
    },
    fetchFoodItems({ commit }: { commit: Commit }): void {
      axios
        .get("api/in-season")
        .then((response) => {
          commit("SET_FOOD_ITEMS", response.data as FoodItemTs[]);
        })
        .catch((error) => {
          console.error(error);
        });
    },
  },
};

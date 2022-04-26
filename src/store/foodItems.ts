import { FoodItem as FoodItemTs } from "@/types/foodItem";
import { Commit, Dispatch } from "vuex";
import axios from "axios";
import {
  addToIndexedDB,
  deleteFromIndexedDB,
  getFromIndexedDB,
} from "@/helpers";

export default {
  namespaced: true,
  state: {
    foodItems: [] as FoodItemTs[],
    eatenFoodItems: [] as {
      eaten_id: number;
      food_id: number;
      grams: number;
      date: Date;
    }[],
  },
  getters: {
    allFoodItems(state: { foodItems: FoodItemTs[] }): FoodItemTs[] {
      return state.foodItems;
    },
    foodItems(state: { foodItems: FoodItemTs[] }): FoodItemTs[] {
      return state.foodItems.filter(
        (foodItem) => foodItem.food_regions !== null
      );
    },
    foodItemsWithoutSeasons(state: { foodItems: FoodItemTs[] }): FoodItemTs[] {
      return state.foodItems.filter(
        (foodItem) => foodItem?.food_regions == null
      );
    },
    // Get the eatenFoodItems from foodItems with an extra property "grams"
    eatenFoodItems(state: {
      foodItems: FoodItemTs[];
      eatenFoodItems: {
        eaten_id: number;
        food_id: number;
        grams: number;
        date: Date;
      }[];
    }): { eaten_id: number; food_id: number; grams: number; date: Date }[] {
      // Create a new array of eatenFoodItems, allowing duplicates
      const eatenFoodItems: {
        eaten_id: number;
        food_id: number;
        grams: number;
        date: Date;
      }[] = [];
      // Loop through the foodItems
      for (const foodItem of state.foodItems) {
        // Loop through the eatenFoodItems
        for (const eatenFoodItem of state.eatenFoodItems) {
          // If the foodItem id matches the eatenFoodItem id
          if (foodItem.id === eatenFoodItem.food_id) {
            // Add the eatenFoodItem to the new array
            eatenFoodItems.push({
              ...foodItem,
              ...eatenFoodItem,
            });
          }
        }
      }
      // Return the new array
      return eatenFoodItems;
    },
    eatenFoodItemsToday(state: any, getters: { eatenFoodItems: any }): any {
      return getters.eatenFoodItems.filter(
        (eatenFoodItem: {
          eaten_id: number;
          food_id: number;
          grams: number;
          date: Date;
        }) =>
          // If the day, month and year of the eatenFoodItem date matches today
          eatenFoodItem.date.getDate() === new Date().getDate() &&
          eatenFoodItem.date.getMonth() === new Date().getMonth() &&
          eatenFoodItem.date.getFullYear() === new Date().getFullYear()
      );
    },
    // Get the proteing from the getter eatenFoodItems
    proteinEaten(state: any, getters: { eatenFoodItems: any[] }): number {
      return getters.eatenFoodItems.reduce(
        (acc: any, foodItem) => acc + (foodItem.protein / 100) * foodItem.grams,
        0
      );
    },
    carbEaten(state: any, getters: { eatenFoodItems: any[] }): number {
      return getters.eatenFoodItems.reduce(
        (acc: any, foodItem) =>
          acc + (foodItem.carbohydrate / 100) * foodItem.grams,
        0
      );
    },
    fatEaten(state: any, getters: { eatenFoodItems: any[] }): number {
      return getters.eatenFoodItems.reduce(
        (acc: any, foodItem) => acc + (foodItem.fat / 100) * foodItem.grams,
        0
      );
    },
    caloriesEaten(state: any, getters: { eatenFoodItems: any[] }): number {
      return getters.eatenFoodItems.reduce(
        (acc: any, foodItem) => acc + (foodItem.kcal / 100) * foodItem.grams,
        0
      );
    },
    foodItemsMatchingSearchTerm:
      (state: { foodItems: FoodItemTs[] }) =>
      (searchTerm: string): FoodItemTs[] => {
        if (searchTerm === "") {
          return state.foodItems;
        }
        return state.foodItems.filter((foodItem) =>
          foodItem.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
      },
  },
  mutations: {
    SET_FOOD_ITEMS(state: { foodItems: boolean }, value: boolean): void {
      state.foodItems = value;
    },
    ADD_FOOD_ITEM(state: { foodItems: FoodItemTs[] }, value: FoodItemTs): void {
      // Add the food item if the food item with the ID does not exist
      if (!state.foodItems.find((foodItem) => foodItem.id === value.id)) {
        state.foodItems.push(value);
      }
    },
    ADD_EATEN_FOOD_ITEM(
      state: {
        foodItems: FoodItemTs[];
        eatenFoodItems: { eaten_id: number; food_id: number; grams: number }[];
      },
      {
        value,
        shouldSave = false,
      }: {
        value: { eaten_id: number; food_id: number; grams: number; date: Date };
        shouldSave?: boolean;
      }
    ): void {
      // Add the current date to the value
      if (!value.date) {
        value.date = new Date();
      }
      // If there is no eaten_id, create a new one
      if (!value.eaten_id) {
        value.eaten_id = state.eatenFoodItems.length + 1;
      }
      // Else if the eaten_id already exists, skip
      else if (
        state.eatenFoodItems.find(
          (eatenFoodItem) => eatenFoodItem.eaten_id === value.eaten_id
        )
      ) {
        return;
      }
      state.eatenFoodItems.push(value);
      if (process.env.VUE_APP_USE_INDEXED_DB == "true" && shouldSave) {
        addToIndexedDB(value);
      }
    },
    DELETE_EATEN_FOOD_ITEM(
      state: {
        eatenFoodItems: { eaten_id: number; food_id: number; grams: number }[];
      },
      id: number
    ): void {
      const index = state.eatenFoodItems.findIndex(
        (eatenFoodItem) => eatenFoodItem.eaten_id === id
      );
      state.eatenFoodItems.splice(index, 1);
      if (process.env.VUE_APP_USE_INDEXED_DB == "true") {
        deleteFromIndexedDB(id);
      }
    },
  },
  actions: {
    setFoodItems({ commit }: { commit: Commit }, value: boolean): void {
      commit("SET_FOOD_ITEMS", value);
    },
    fetchFoodItems({ state, dispatch, commit }: any): void {
      axios
        .get("api/in-season")
        .then((response) => {
          (response.data as FoodItemTs[]).forEach((element) => {
            commit("ADD_FOOD_ITEM", element);
          });
        })
        .catch((error) => {
          console.error(error);
        });
      axios
        .get(
          "api/foods?page=1&per_page=500&scopes[]=notHavingSeasonality&scopes[]=withAllMacronutrients&scopes[]=notFrozen"
        )
        .then((response) => {
          (response.data.data as FoodItemTs[]).forEach((element) => {
            commit("ADD_FOOD_ITEM", element);
          });
          dispatch("fetchEatenFoodItems");
        })
        .catch((error) => {
          console.error(error);
        });
    },
    fetchEatenFoodItems({ state, dispatch, commit }: any): void {
      // Get the eaten food items from the indexedDB
      if (process.env.VUE_APP_USE_INDEXED_DB == "true") {
        getFromIndexedDB("eatenFoodItems").then((data) => {
          for (const eatenFoodItem of data) {
            // Convert the date string to JS Date object
            eatenFoodItem.date = new Date(eatenFoodItem.date);
            commit("ADD_EATEN_FOOD_ITEM", {
              value: eatenFoodItem,
              shouldSave: false,
            });
            // If the food item with the ID does not exist, add it
            if (
              !state.foodItems.find(
                (foodItem: FoodItemTs) => foodItem.id === eatenFoodItem.food_id
              )
            ) {
              // Call the search food item action
              dispatch("searchFoodItems", {
                searchTerm: eatenFoodItem.food_id.toString(),
                searchField: "id",
              });
            }
          }
        });
      }
    },

    addFoodItem({ commit }: { commit: Commit }, value: FoodItemTs): void {
      commit("ADD_FOOD_ITEM", value);
    },
    searchFoodItems(
      { commit }: { commit: Commit },
      {
        searchTerm,
        searchField = "name",
      }: { searchTerm: string; searchField?: string }
    ): void {
      axios
        .get(
          `/api/foods?per_page=500&search[term]=${searchTerm}&search[fields][]=${searchField}&scopes[]=withAllMacronutrients`
        )
        .then((response) => {
          // For each item, add it addFoodItem
          response.data.data.forEach((foodItem: FoodItemTs) => {
            commit("ADD_FOOD_ITEM", foodItem);
          });
        });
    },
    addEatenFoodItem(
      { commit }: { commit: Commit },
      value: { food_id: number; grams: number }
    ): void {
      commit("ADD_EATEN_FOOD_ITEM", { value: value, shouldSave: true });
    },
    deleteEatenFoodItem({ commit }: { commit: Commit }, id: number): void {
      commit("DELETE_EATEN_FOOD_ITEM", id);
    },
  },
};

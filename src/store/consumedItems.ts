import { FoodItem as FoodItemTs } from "@/types/foodItem";
import { Commit, Dispatch } from "vuex";
import axios from "axios";
import { toRaw } from "vue";

import {
  addToIndexedDB,
  deleteFromIndexedDB,
  getFromIndexedDB,
} from "@/helpers";
import { consumedItem } from "@/types/consumedItem";

export default {
  namespaced: true,

  state: {
    consumedItems: [] as consumedItem[],
  },

  getters: {
    allConsumedItems(state: { consumedItems: consumedItem[] }): consumedItem[] {
      return state.consumedItems;
    },

    allConsumedItemsToday(state: {
      consumedItems: consumedItem[];
    }): consumedItem[] {
      return state.consumedItems.filter(
        (consumedItem) =>
          new Date(consumedItem.created_at ?? "").getDate() ===
            new Date().getDate() &&
          new Date(consumedItem.created_at ?? "").getMonth() ===
            new Date().getMonth() &&
          new Date(consumedItem.created_at ?? "").getFullYear() ===
            new Date().getFullYear()
      );
    },

    // Get allConsumedItems with the foodItems property from the foodItems module
    allConsumedItemsWithFoodItems(
      state: { consumedItems: consumedItem[] },
      getters: {
        allConsumedItems: consumedItem[];
      },
      rootState: any,
      rootGetters: any
    ): consumedItem[] {
      return getters.allConsumedItems.map((consumedItem) => {
        const foodItem = rootGetters["foodItems/allFoodItems"].find(
          (foodItem: FoodItemTs) => foodItem.id === consumedItem.food_id
        );
        return {
          ...consumedItem,
          foodItem: foodItem,
        };
      });
    },

    kcalConsumedToday(
      state: { consumedItems: consumedItem[] },
      getters: {
        allConsumedItemsToday: consumedItem[];
      }
    ): number {
      return getters.allConsumedItemsToday.reduce((acc, consumedItem) => {
        return acc + (consumedItem.kcal ?? 0);
      }, 0);
    },

    proteinConsumedToday(
      state: { consumedItems: consumedItem[] },
      getters: {
        allConsumedItemsToday: consumedItem[];
      }
    ): number {
      return getters.allConsumedItemsToday.reduce((acc, consumedItem) => {
        return acc + (consumedItem.protein ?? 0);
      }, 0);
    },

    carbsConsumedToday(
      state: { consumedItems: consumedItem[] },
      getters: {
        allConsumedItemsToday: consumedItem[];
      }
    ): number {
      return getters.allConsumedItemsToday.reduce((acc, consumedItem) => {
        return acc + (consumedItem.carbohydrate ?? 0);
      }, 0);
    },

    fatConsumedToday(
      state: { consumedItems: consumedItem[] },
      getters: {
        allConsumedItemsToday: consumedItem[];
      }
    ): number {
      return getters.allConsumedItemsToday.reduce((acc, consumedItem) => {
        return acc + (consumedItem.fat ?? 0);
      }, 0);
    },

    kcalConsumedThisWeek(
      state: { consumedItems: consumedItem[] },
      getters: {
        allConsumedItems: consumedItem[];
      }
    ): number {
      return getters.allConsumedItems.reduce((acc, consumedItem) => {
        return acc + (consumedItem.kcal ?? 0);
      }, 0);
    },

    proteinConsumedThisWeek(
      state: { consumedItems: consumedItem[] },
      getters: {
        allConsumedItems: consumedItem[];
      }
    ): number {
      return getters.allConsumedItems.reduce((acc, consumedItem) => {
        return acc + (consumedItem.protein ?? 0);
      }, 0);
    },

    carbsConsumedThisWeek(
      state: { consumedItems: consumedItem[] },
      getters: {
        allConsumedItems: consumedItem[];
      }
    ): number {
      return getters.allConsumedItems.reduce((acc, consumedItem) => {
        return acc + (consumedItem.carbohydrate ?? 0);
      }, 0);
    },
  },

  mutations: {
    ADD_CONSUMED_ITEM(
      state: { consumedItems: consumedItem[] },
      consumedItem: consumedItem
    ): void {
      state.consumedItems.push(consumedItem);
    },
    DELETE_CONSUMED_ITEM(
      state: { consumedItems: consumedItem[] },
      consumedItem: consumedItem
    ): void {
      state.consumedItems = state.consumedItems.filter(
        (item) => item.id !== consumedItem.id
      );
    },
    DELETE_CONSUMED_ITEM_BY_ID(
      state: { consumedItems: consumedItem[] },
      id: number
    ): void {
      state.consumedItems = state.consumedItems.filter(
        (item) => item.id !== id
      );
    },
    SET_CONSUMED_ITEMS(
      state: { consumedItems: consumedItem[] },
      consumedItems: consumedItem[]
    ): void {
      state.consumedItems = consumedItems;
    },
  },

  actions: {
    // Get the food items from the IndexedDB, if IndexedDB is supported by rootGetters app/supportsIndexedDB
    async fetchConsumedItems({
      commit,
      rootGetters,
    }: {
      commit: Commit;
      rootGetters: any;
    }): Promise<void> {
      if (rootGetters["app/supportsIndexedDB"]) {
        const consumedItems = await getFromIndexedDB();
        commit("SET_CONSUMED_ITEMS", consumedItems);
      }
    },

    async addConsumedItem(
      {
        state,
        dispatch,
        commit,
        rootGetters,
      }: { state: any; dispatch: any; commit: Commit; rootGetters: any },
      consumedItem: consumedItem
    ): Promise<void> {
      // consumedItem = toRaw(consumedItem);
      if (!consumedItem.created_at) {
        consumedItem.created_at = new Date().toString();
      }
      if (!consumedItem.updated_at) {
        consumedItem.updated_at = new Date().toString();
      }
      if (!consumedItem.id) {
        // Get the highest .id in the consumedItems
        const highestId =
          state.consumedItems.reduce(
            (acc: any, item: consumedItem) =>
              (item.id as any) > acc ? item.id : acc,
            0
          ) ?? 0;
        consumedItem.id = highestId + 1;
      }
      if (consumedItem.food_id) {
        await dispatch(
          "foodItems/searchFoodItems",
          {
            searchTerm: consumedItem.food_id.toString(),
            searchField: "id",
          },
          { root: true }
        );
        const foodItem = rootGetters["foodItems/allFoodItems"].find(
          (foodItem: FoodItemTs) => foodItem.id === consumedItem.food_id
        );
        if (foodItem) {
          if (!consumedItem.kcal) {
            consumedItem.kcal = (foodItem.kcal / 100) * consumedItem.grams;
          }
          if (!consumedItem.protein) {
            consumedItem.protein =
              (foodItem.protein / 100) * consumedItem.grams;
          }
          if (!consumedItem.fat) {
            consumedItem.fat = (foodItem.fat / 100) * consumedItem.grams;
          }
          if (!consumedItem.carbohydrate) {
            consumedItem.carbohydrate =
              (foodItem.carbohydrate / 100) * consumedItem.grams;
          }
          if (!consumedItem.fiber) {
            consumedItem.fiber = (foodItem.fiber / 100) * consumedItem.grams;
          }
          if (!consumedItem.alcohol) {
            consumedItem.alcohol =
              (foodItem.alcohol / 100) * consumedItem.grams;
          }
          if (!consumedItem.water) {
            consumedItem.water = (foodItem.water / 100) * consumedItem.grams;
          }
          if (!consumedItem.name) {
            consumedItem.name = foodItem.name;
          }
          if (!consumedItem.description) {
            consumedItem.description = foodItem.description;
          }
        }
      }
      if (rootGetters["app/supportsIndexedDB"]) {
        addToIndexedDB(toRaw(consumedItem));
      }
      commit("ADD_CONSUMED_ITEM", consumedItem);
      gtag("event", "consumed_food_item_add");
    },

    deleteConsumedItem(
      { commit, rootGetters }: { commit: Commit; rootGetters: any },
      consumedItemId: number
    ): void {
      if (rootGetters["app/supportsIndexedDB"]) {
        deleteFromIndexedDB(consumedItemId);
      }
      commit("DELETE_CONSUMED_ITEM_BY_ID", consumedItemId);
      gtag("event", "consumed_food_item_remove");
    },
  },
};

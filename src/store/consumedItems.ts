import { FoodItem as FoodItemTs } from "@/types/foodItem";
import { Commit, Dispatch } from "vuex";
import { toRaw } from "vue";

import {
  addToIndexedDB,
  deleteFromIndexedDB,
  getFromIndexedDB,
} from "@/helpers";
import { consumedItem } from "@/types/consumedItem";
import $bus, { eventTypes } from "@/eventBus/events";

export default {
  namespaced: true,

  state: {
    consumedItems: [] as consumedItem[],
    dislikedFoodItemIds: [],
    setDate: new Date(),
    endDate: new Date(new Date().setHours(23, 59, 59)),
  },

  getters: {
    allConsumedItems(state: { consumedItems: consumedItem[] }): consumedItem[] {
      return state.consumedItems;
    },

    allConsumedItemsToday(state: {
      consumedItems: consumedItem[];
      setDate: Date;
    }): consumedItem[] {
      return state.consumedItems.filter(
        (consumedItem) =>
          new Date(consumedItem.created_at ?? "").getDate() ===
            state.setDate.getDate() &&
          new Date(consumedItem.created_at ?? "").getMonth() ===
            state.setDate.getMonth() &&
          new Date(consumedItem.created_at ?? "").getFullYear() ===
            state.setDate.getFullYear()
      );
    },

    allConsumedItemsInTimeframe(state: {
      consumedItems: consumedItem[];
      setDate: Date;
      endDate: Date;
    }): consumedItem[] {
      return state.consumedItems.filter(
        (consumedItem) =>
          new Date(consumedItem.created_at ?? "") >= state.setDate &&
          new Date(consumedItem.created_at ?? "") <= state.endDate
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

    activeDate(state: { setDate: Date }) {
      return state.setDate;
    },

    dislikedFoodItemIds(state: { dislikedFoodItemIds: number[] }) {
      return state.dislikedFoodItemIds;
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

    SET_DATE(state: { setDate: Date }, date: Date): void {
      state.setDate = date;
    },
    SET_END_DATE(state: { endDate: Date }, date: Date): void {
      state.endDate = date;
    },

    ADD_DISLIKED_ITEM_BY_ID(
      state: { dislikedFoodItemIds: number[] },
      dislikedItemId: number
    ): void {
      state.dislikedFoodItemIds.push(dislikedItemId);
    },
    DELETE_DISLIKED_ITEM_BY_ID(
      state: { dislikedFoodItemIds: number[] },
      dislikedItemId: number
    ): void {
      state.dislikedFoodItemIds = state.dislikedFoodItemIds.filter(
        (id) => id !== dislikedItemId
      );
    },
    SET_DISLIKED_ITEM_IDS(
      state: { dislikedFoodItemIds: number[] },
      dislikedItemIds: number[]
    ): void {
      state.dislikedFoodItemIds = dislikedItemIds;
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
      if (!consumedItem.updated_at || !consumedItem.created_at) {
        const currentDateAndTime =
          rootGetters["consumedItems/activeDate"] ?? new Date();
        // If there is no time in the currentDateAndTime, set the time to now
        // if (!currentDateAndTime.getHours()) {
        currentDateAndTime.setHours(new Date().getHours());
        // }
        // if (!currentDateAndTime.getMinutes()) {
        currentDateAndTime.setMinutes(new Date().getMinutes());
        // }
        // if (!currentDateAndTime.getSeconds()) {
        currentDateAndTime.setSeconds(new Date().getSeconds());
        // }
        if (!consumedItem.created_at) {
          consumedItem.created_at = currentDateAndTime.toString();
        }
        if (!consumedItem.updated_at) {
          consumedItem.updated_at = currentDateAndTime.toString();
        }
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
        let foodItem = rootGetters["foodItems/allFoodItems"].find(
          (foodItem: FoodItemTs) => foodItem.id === consumedItem.food_id
        );
        if (!foodItem) {
          await dispatch(
            "foodItems/searchFoodItems",
            {
              searchTerm: consumedItem.food_id.toString(),
              searchField: "id",
            },
            { root: true }
          );
          foodItem = rootGetters["foodItems/allFoodItems"].find(
            (foodItem: FoodItemTs) => foodItem.id === consumedItem.food_id
          );
        }
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

      // If the item has no calories, compute it from the carbs, fat and protein
      if (consumedItem.kcal === null) {
        consumedItem.kcal =
          (consumedItem.carbohydrate ?? 0) * 4 +
          (consumedItem.fat ?? 0) * 9 +
          (consumedItem.protein ?? 0) * 4;
        if (consumedItem.kcal === 0) {
          consumedItem.kcal = null;
        }
      }

      commit("ADD_CONSUMED_ITEM", consumedItem);
      $bus.$emit(eventTypes.consumed_food_item_add, consumedItem);
    },

    deleteConsumedItem(
      { commit, rootGetters }: { commit: Commit; rootGetters: any },
      consumedItemId: number
    ): void {
      if (rootGetters["app/supportsIndexedDB"]) {
        deleteFromIndexedDB(consumedItemId);
      }
      commit("DELETE_CONSUMED_ITEM_BY_ID", consumedItemId);
      $bus.$emit(eventTypes.consumed_food_item_remove, consumedItemId);
    },

    setDate(
      { commit, dispatch }: { commit: Commit; dispatch: any },
      date: Date | string | null
    ): void {
      if (!date) {
        date = new Date();
      }
      // If the date is not a Date object, try to parse it
      else if (!(date instanceof Date)) {
        date = new Date(date);
      }
      commit("SET_DATE", date);
    },

    setEndDate(
      { commit, dispatch }: { commit: Commit; dispatch: any },
      date: Date | string | null
    ): void {
      if (!date) {
        date = new Date();
      }
      // If the date is not a Date object, try to parse it
      else if (!(date instanceof Date)) {
        date = new Date(date);
      }
      commit("SET_END_DATE", date);
    },

    async fetchDislikedItemIds({
      commit,
      rootGetters,
    }: {
      commit: Commit;
      rootGetters: any;
    }): Promise<void> {
      if (rootGetters["app/supportsIndexedDB"]) {
        const dislikedItemIds = await getFromIndexedDB("dislikedFoodItems");
        commit(
          "SET_DISLIKED_ITEM_IDS",
          dislikedItemIds.map((item: any) => item.id)
        );
      }
    },

    async addDislikedItemId(
      { commit, rootGetters }: { commit: Commit; rootGetters: any },
      dislikedItemId: number
    ): Promise<void> {
      if (rootGetters["app/supportsIndexedDB"]) {
        await addToIndexedDB({ id: dislikedItemId }, "dislikedFoodItems");
      }
      commit("ADD_DISLIKED_ITEM_BY_ID", dislikedItemId);
      $bus.$emit(eventTypes.disliked_food_item_add, dislikedItemId);
    },

    async deleteDislikedItemId(
      { commit, rootGetters }: { commit: Commit; rootGetters: any },
      dislikedItemId: number
    ): Promise<void> {
      if (rootGetters["app/supportsIndexedDB"]) {
        await deleteFromIndexedDB(dislikedItemId, "dislikedFoodItems");
      }
      commit("DELETE_DISLIKED_ITEM_BY_ID", dislikedItemId);
      $bus.$emit(eventTypes.disliked_food_item_remove, dislikedItemId);
    },
  },
};

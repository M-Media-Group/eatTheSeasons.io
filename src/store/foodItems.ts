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
      food_id: number | null;
      grams: number;
      date: Date;
    }[],
  },

  getters: {
    allFoodItems(state: { foodItems: FoodItemTs[] }): FoodItemTs[] {
      return state.foodItems;
    },

    foodItems(
      state: { foodItems: FoodItemTs[] },
      getters: any,
      rootState: any,
      rootGetters: any
    ): FoodItemTs[] {
      const filters = rootGetters["auth/filters"] as unknown as Record<
        string,
        boolean
      >;
      return state.foodItems.filter((foodItem) =>
        foodItem.food_regions !== null && filters.showOnlyWithCaloricInfo
          ? foodItem.kcal && foodItem.kcal > 0
          : true
      );
    },

    foodItemsWithoutSeasons(state: { foodItems: FoodItemTs[] }): FoodItemTs[] {
      return state.foodItems.filter(
        (foodItem) => foodItem?.food_regions == null
      );
    },

    foodItemsThatHelpReachGoals(
      state: any,
      getters: any,
      rootState: any,
      rootGetters: any
    ) {
      const nutrientInfo = rootGetters["auth/nutrientRatio"] as any;
      const goals = rootGetters["auth/goals"] as unknown as Record<
        string,
        number
      >;
      const filters = rootGetters["auth/filters"] as unknown as Record<
        string,
        boolean
      >;
      let foodItems = state.foodItems as FoodItemTs[];
      foodItems = foodItems.filter((food) =>
        filters.showOnlyWithCaloricInfo ? food.kcal && food.kcal > 0 : true
      );
      const foodItemsWithRatios = Object.keys(foodItems).map((key) => {
        const foodItem = foodItems[key as any] as any;
        // Compute percentages between each consumed nutrient and the sum of all consumed nutrients
        const consumedPercentage = {
          carbsRatio:
            (foodItem.carbohydrate /
              (foodItem.carbohydrate + foodItem.fat + foodItem.protein)) *
            100,
          fatRatio:
            (foodItem.fat /
              (foodItem.carbohydrate + foodItem.fat + foodItem.protein)) *
            100,
          proteinRatio:
            (foodItem.protein /
              (foodItem.carbohydrate + foodItem.fat + foodItem.protein)) *
            100,
        };
        // Subtract the difference of each goal from the consumed percentage
        const difference = {
          carbsRatio: consumedPercentage.carbsRatio - goals.carbsPercent,
          fatRatio: consumedPercentage.fatRatio - goals.fatPercent,
          proteinRatio: consumedPercentage.proteinRatio - goals.proteinPercent,
        };
        // Filter foodItems with similar ratios as in nutrientRatio
        // Normalize the difference to a number between -1 and 1 (inclusive)
        const normalizedDifference = {
          carbsRatio: difference.carbsRatio / 100,
          fatRatio: difference.fatRatio / 100,
          proteinRatio: difference.proteinRatio / 100,
        };
        return {
          ...foodItem,
          ...normalizedDifference,
        };
      });
      const foodItemsWithSimilarRatios = foodItemsWithRatios.filter(
        (item) =>
          // If the signs of the ratios in the item and the nutrients carbsMissingRatio, are the same, the ratios are similar
          ((item.carbsRatio > 0 && nutrientInfo.carbs > 0) ||
            (item.carbsRatio < 0 && nutrientInfo.carbs < 0)) &&
          ((item.fatRatio > 0 && nutrientInfo.fat > 0) ||
            (item.fatRatio < 0 && nutrientInfo.fat < 0)) &&
          ((item.proteinRatio > 0 && nutrientInfo.protein > 0) ||
            (item.proteinRatio < 0 && nutrientInfo.protein < 0))
      );
      // Sort the foodItems by fiber, from highest to lowest
      const foodItemsWithSimilarRatiosSorted = foodItemsWithSimilarRatios.sort(
        (a, b) => b.fiber - a.fiber
      );
      // Filter to only those that are in season
      // const foodItemsInSeason = foodItemsWithSimilarRatiosSorted.filter(
      //   (item) => item.food_regions?.length > 0
      // );
      return foodItemsWithSimilarRatiosSorted;
    },

    // // Get the eatenFoodItems from foodItems with an extra property "grams"
    // eatenFoodItems(state: {
    //   foodItems: FoodItemTs[];
    //   eatenFoodItems: {
    //     eaten_id: number;
    //     food_id: number;
    //     grams: number;
    //     date: Date;
    //   }[];
    // }): { eaten_id: number; food_id: number; grams: number; date: Date }[] {
    //   // Create a new array of eatenFoodItems, allowing duplicates
    //   const eatenFoodItems: {
    //     eaten_id: number;
    //     food_id: number;
    //     grams: number;
    //     date: Date;
    //   }[] = [];
    //   // Loop through the foodItems
    //   for (const foodItem of state.foodItems) {
    //     // Loop through the eatenFoodItems
    //     for (const eatenFoodItem of state.eatenFoodItems) {
    //       // If the foodItem id matches the eatenFoodItem id
    //       if (foodItem.id === eatenFoodItem.food_id) {
    //         // Add the eatenFoodItem to the new array
    //         eatenFoodItems.push({
    //           ...foodItem,
    //           ...eatenFoodItem,
    //         });
    //       }
    //     }
    //   }
    //   // Return the new array
    //   return eatenFoodItems;
    // },

    // eatenFoodItemsToday(state: any, getters: { eatenFoodItems: any }): any {
    //   return getters.eatenFoodItems.filter(
    //     (eatenFoodItem: {
    //       eaten_id: number;
    //       food_id: number;
    //       grams: number;
    //       date: Date;
    //     }) =>
    //       // If the day, month and year of the eatenFoodItem date matches today
    //       eatenFoodItem.date.getDate() === new Date().getDate() &&
    //       eatenFoodItem.date.getMonth() === new Date().getMonth() &&
    //       eatenFoodItem.date.getFullYear() === new Date().getFullYear()
    //   );
    // },

    // // Get the proteing from the getter eatenFoodItems
    // proteinEaten(state: any, getters: { eatenFoodItems: any[] }): number {
    //   return getters.eatenFoodItems.reduce(
    //     (acc: any, foodItem) => acc + (foodItem.protein / 100) * foodItem.grams,
    //     0
    //   );
    // },

    // carbEaten(state: any, getters: { eatenFoodItems: any[] }): number {
    //   return getters.eatenFoodItems.reduce(
    //     (acc: any, foodItem) =>
    //       acc + (foodItem.carbohydrate / 100) * foodItem.grams,
    //     0
    //   );
    // },

    // fatEaten(state: any, getters: { eatenFoodItems: any[] }): number {
    //   return getters.eatenFoodItems.reduce(
    //     (acc: any, foodItem) => acc + (foodItem.fat / 100) * foodItem.grams,
    //     0
    //   );
    // },

    // caloriesEaten(state: any, getters: { eatenFoodItems: any[] }): number {
    //   return getters.eatenFoodItems.reduce(
    //     (acc: any, foodItem) => acc + (foodItem.kcal / 100) * foodItem.grams,
    //     0
    //   );
    // },

    foodItemsMatchingSearchTerm:
      (state: { foodItems: FoodItemTs[] }) =>
      (searchTerm: string): FoodItemTs[] => {
        if (searchTerm === "") {
          return state.foodItems;
        }
        return state.foodItems.filter(
          (foodItem) =>
            foodItem.name.toLowerCase().includes(searchTerm.toLowerCase())
          // If the foodItem contains categories, loop through them
          // || (foodItem.categories &&
          //   foodItem.categories.some((category) =>
          //     category.name.toLowerCase().includes(searchTerm.toLowerCase())
          //   ))
        );
      },
  },

  mutations: {
    SET_FOOD_ITEMS(state: { foodItems: boolean }, value: boolean): void {
      state.foodItems = value;
    },

    ADD_FOOD_ITEM(state: { foodItems: FoodItemTs[] }, value: FoodItemTs): void {
      // Add the food item if the food item with the ID does not exist
      state.foodItems.findIndex((item) => item.id === value.id) === -1 &&
        state.foodItems.push(value);
    },

    // ADD_EATEN_FOOD_ITEM(
    //   state: {
    //     foodItems: FoodItemTs[];
    //     eatenFoodItems: { eaten_id: number; food_id: number; grams: number }[];
    //   },
    //   value: { eaten_id: number; food_id: number; grams: number; date: Date }
    // ): void {
    //   if (
    //     state.eatenFoodItems.find(
    //       (eatenFoodItem) => eatenFoodItem.eaten_id === value.eaten_id
    //     )
    //   ) {
    //     return;
    //   }
    //   state.eatenFoodItems.push(value);
    // },

    // DELETE_EATEN_FOOD_ITEM(
    //   state: {
    //     eatenFoodItems: { eaten_id: number; food_id: number; grams: number }[];
    //   },
    //   id: number
    // ): void {
    //   const index = state.eatenFoodItems.findIndex(
    //     (eatenFoodItem) => eatenFoodItem.eaten_id === id
    //   );
    //   state.eatenFoodItems.splice(index, 1);
    // },
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
          // dispatch("fetchEatenFoodItems");
        })
        .catch((error) => {
          console.error(error);
        });
    },

    // fetchEatenFoodItems({ state, dispatch, commit, rootGetters }: any): void {
    //   // Get the eaten food items from the indexedDB
    //   if (rootGetters["app/supportsIndexedDB"]) {
    //     getFromIndexedDB("eatenFoodItems").then((data) => {
    //       for (const eatenFoodItem of data) {
    //         // Convert the date string to JS Date object
    //         eatenFoodItem.date = new Date(eatenFoodItem.date);
    //         commit("ADD_EATEN_FOOD_ITEM", eatenFoodItem);
    //         // If the food item with the ID does not exist, add it
    //         if (
    //           !state.foodItems.find(
    //             (foodItem: FoodItemTs) => foodItem.id === eatenFoodItem.food_id
    //           )
    //         ) {
    //           // Call the search food item action
    //           dispatch("searchFoodItems", {
    //             searchTerm: eatenFoodItem.food_id.toString(),
    //             searchField: "id",
    //           });
    //         }
    //       }
    //     });
    //   }
    // },

    addFoodItem({ commit }: { commit: Commit }, value: FoodItemTs): void {
      commit("ADD_FOOD_ITEM", value);
    },

    async searchFoodItems(
      { commit }: { commit: Commit },
      {
        searchTerm,
        searchField = "name",
      }: { searchTerm: string; searchField?: string }
    ): Promise<void> {
      const request = await axios.get(
        `/api/foods?per_page=500&search[term]=${searchTerm}&search[fields][]=${searchField}&scopes[]=withAllMacronutrients&with[]=categories`
      );
      const foodItems = request.data.data as FoodItemTs[];
      foodItems.forEach((foodItem) => {
        // if (!idsAlreadyExisting.includes(foodItem.id)) {
        commit("ADD_FOOD_ITEM", foodItem);
        // }
      });
      console.log("GOT ADS");
      // Resolve the promise
      return Promise.resolve();
      // .then((response) => {
      //   // For each item, add it addFoodItem
      //   response.data.data.forEach((foodItem: FoodItemTs) => {
      //     commit("ADD_FOOD_ITEM", foodItem);
      //   });
      // });
    },

    // addEatenFoodItem(
    //   {
    //     commit,
    //     getters,
    //     rootGetters,
    //   }: { commit: Commit; getters: any; rootGetters: any },
    //   value: { eaten_id: number; food_id: number; grams: number; date: Date }
    // ): void {
    //   // Add the current date to the value
    //   if (!value.date) {
    //     value.date = new Date();
    //   }
    //   // If there is no eaten_id, create a new one
    //   if (!value.eaten_id) {
    //     value.eaten_id = getters.eatenFoodItems.length + 1;
    //   }
    //   commit("ADD_EATEN_FOOD_ITEM", value);
    //   if (rootGetters["app/supportsIndexedDB"]) {
    //     addToIndexedDB(value);
    //   }
    // },

    // deleteEatenFoodItem(
    //   { commit, rootGetters }: { commit: Commit; rootGetters: any },
    //   id: number
    // ): void {
    //   commit("DELETE_EATEN_FOOD_ITEM", id);
    //   if (rootGetters["app/supportsIndexedDB"]) {
    //     deleteFromIndexedDB(id);
    //   }
    // },
  },
};

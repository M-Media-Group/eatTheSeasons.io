import { FoodItem as FoodItemTs } from "@/types/foodItem";
import { Commit } from "vuex";

export default {
  namespaced: true,

  state: {
    foodItems: [] as FoodItemTs[],
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

    requiredNutrients(
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
      // Determine the required nutrient % distribution required to reach goals based on already consumed nutrientInfo and goals
      const requiredNutrients = {
        carbsRatio:
          nutrientInfo.carbsRatio < goals.carbsPercent
            ? goals.carbsPercent - nutrientInfo.carbsRatio
            : 0,
        fatRatio:
          nutrientInfo.fatRatio < goals.fatPercent
            ? goals.fatPercent - nutrientInfo.fatRatio
            : 0,

        proteinRatio:
          nutrientInfo.proteinRatio < goals.proteinPercent
            ? goals.proteinPercent - nutrientInfo.proteinRatio
            : 0,
      };

      return requiredNutrients;
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
      // Filter food without caloric info
      foodItems = foodItems.filter((food) =>
        filters.showOnlyWithCaloricInfo ? food.kcal && food.kcal > 0 : true
      );
      // Filter food that is disliked
      foodItems = foodItems.filter((food) => {
        if (filters.hideDisliked) {
          return !rootState.consumedItems.dislikedFoodItemIds.includes(food.id);
        }
        return true;
      });
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

    foodItemsMatchingSearchTerm:
      (state: { foodItems: FoodItemTs[] }) =>
      (searchTerm: string | null): FoodItemTs[] => {
        if (!searchTerm || searchTerm === "" || searchTerm.length < 4) {
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
      // If the food item has no calories, compute it
      if (value.kcal === null) {
        value.kcal =
          (value.carbohydrate ?? 0) * 4 +
          (value.fat ?? 0) * 9 +
          (value.protein ?? 0) * 4;

        // Set the kcal back to null if it is 0
        if (value.kcal === 0) {
          value.kcal = null;
        }
      }

      // Add the food item if the food item with the ID does not exist
      state.foodItems.findIndex((item) => item.id === value.id) === -1 &&
        state.foodItems.push(value);
    },
  },

  actions: {
    setFoodItems({ commit }: { commit: Commit }, value: boolean): void {
      commit("SET_FOOD_ITEMS", value);
    },

    async fetchFoodItems({ state, dispatch, commit }: any): Promise<void> {
      const inSeasonRequest = await fetch(
        `${process.env.VUE_APP_BASE_API_URL}/api/in-season`
      );
      if (inSeasonRequest.status === 200) {
        const response = await inSeasonRequest.json();
        (response as FoodItemTs[]).forEach((element) => {
          commit("ADD_FOOD_ITEM", element);
        });
      }

      const otherRequest = await fetch(
        `${process.env.VUE_APP_BASE_API_URL}/api/foods?page=1&per_page=500&scopes[]=notHavingSeasonality&scopes[]=withAllMacronutrients&scopes[]=notFrozen`
      );
      if (otherRequest.status === 200) {
        const otherResponse = await otherRequest.json();
        (otherResponse.data as FoodItemTs[]).forEach((element) => {
          commit("ADD_FOOD_ITEM", element);
        });
      }
    },

    addFoodItem({ commit }: { commit: Commit }, value: FoodItemTs): void {
      commit("ADD_FOOD_ITEM", value);
    },

    async searchFoodItems(
      { commit }: { commit: Commit },
      {
        searchTerm,
        searchField = "name",
      }: { searchTerm: string | null; searchField?: string }
    ): Promise<void> {
      if (!searchTerm || searchTerm === "" || searchTerm.length < 4) {
        return Promise.resolve();
      }
      const request = await fetch(
        `${process.env.VUE_APP_BASE_API_URL}/api/foods?per_page=500&search[term]=${searchTerm}&search[fields][]=${searchField}&scopes[]=withAllMacronutrients&with[]=categories&with[]=foodRegions.seasons&with[]=foodRegions.region.country`
      );
      const response = await request.json();

      const foodItems = response.data as FoodItemTs[];
      foodItems.forEach((foodItem) => {
        // if (!idsAlreadyExisting.includes(foodItem.id)) {
        commit("ADD_FOOD_ITEM", foodItem);
        // }
      });
      // Resolve the promise
      return Promise.resolve();
      // .then((response) => {
      //   // For each item, add it addFoodItem
      //   response.data.data.forEach((foodItem: FoodItemTs) => {
      //     commit("ADD_FOOD_ITEM", foodItem);
      //   });
      // });
    },
  },
};

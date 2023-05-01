import { computed } from "vue";
import {
  CategoryName,
  CountryCode,
  FoodItem as FoodItemTs,
  MonthName,
} from "@/types/foodItem";
import store from "@/store";
import { consumedItem } from "@/types/consumedItem";

export function useFood() {
  const isNativeToCountry = (
    food: FoodItemTs,
    countryCode: CountryCode
  ): boolean | null =>
    food.food_regions?.find(
      (foodRegion) =>
        foodRegion.region.country_code.toLowerCase() ===
        countryCode.toLowerCase()
    )?.grows_in_region ?? null;

  const getFoodCategoriesForFoodItem = (food: FoodItemTs): CategoryName[] => {
    if (!food.categories) {
      return [];
    }
    return food.categories.map((foodCategory) => {
      return foodCategory.name;
    });
  };

  const getLastMonthInARowFromFoodItem = (
    food: FoodItemTs,
    countryCode: CountryCode
  ): MonthName | undefined => {
    const months = food.food_regions
      ?.find((foodRegion) => {
        return (
          foodRegion.region.country_code.toLowerCase() ===
          countryCode.toLowerCase()
        );
      })
      ?.seasons.map((season) => {
        return season.month_name;
      });
    if (!months) {
      return;
    }
    return months[months.length - 1];
  };

  const getLocalName = (food: FoodItemTs, countryCode: CountryCode): string => {
    return (
      food.food_regions?.find((foodRegion) => {
        return (
          foodRegion.region.country_code.toLowerCase() ===
          countryCode.toLowerCase()
        );
      })?.local_name ?? ""
    );
  };

  const foodItemsThatHelpReachGoals = computed(
    () => store.getters["foodItems/foodItemsThatHelpReachGoals"]
  );

  const helpsReachGoals = (id: number) => {
    return (
      foodItemsThatHelpReachGoals.value.findIndex(
        (foodItem: FoodItemTs) => foodItem.id === id
      ) !== -1
    );
  };

  const consumedItemsToday = computed(
    () => store.getters["consumedItems/allConsumedItemsToday"]
  );

  const timesConsumedToday = (id: number) => {
    // Count amount of times this foodId appears in consumedItemsToday
    return (
      consumedItemsToday.value.filter(
        (foodItem: consumedItem) => foodItem.food_id === id
      ).length ?? 0
    );
  };

  const dislikedFoodItemIds = computed(
    () => store.getters["consumedItems/dislikedFoodItemIds"]
  );

  const isDisliked = (id: number) => dislikedFoodItemIds.value.includes(id);

  const isInSeasonForRegion = (
    food: FoodItemTs,
    countryCode: string,
    regionName: string,
    month: string
  ) =>
    food.food_regions &&
    food.food_regions.findIndex(
      (foodRegion) =>
        foodRegion.region.country_code.toLowerCase() ===
          countryCode.toLowerCase() &&
        foodRegion.region.name.toLowerCase() === regionName.toLowerCase() &&
        foodRegion.seasons.findIndex(
          (season) => season.month_name.toLowerCase() === month.toLowerCase()
        ) !== -1
    ) !== -1;

  const hasSeasonalInfoForRegion = (
    food: FoodItemTs,
    countryCode: string,
    regionName: string
  ) =>
    food.food_regions &&
    food.food_regions.findIndex(
      (foodRegion) =>
        foodRegion.region.country_code.toLowerCase() ===
          countryCode.toLowerCase() &&
        foodRegion.region.name.toLowerCase() === regionName.toLowerCase()
    ) !== -1;

  const getFilteredFood = (
    foods: FoodItemTs[],
    filters: Record<string, any>
  ): FoodItemTs[] => {
    return foods.filter(
      (food) =>
        (filters.hideDisliked ? !isDisliked(food.id) : true) &&
        (filters.hideUnhelpful ? helpsReachGoals(food.id) : true) &&
        (filters.showOnlyWithCaloricInfo ? food.kcal && food.kcal > 0 : true) &&
        (filters.showOnlyWithCountry && filters.country
          ? isNativeToCountry(food, filters.country)
          : true) &&
        (filters.showOnlyInSeason
          ? isInSeasonForRegion(
              food,
              filters.country ?? "",
              filters.region ?? "",
              filters.month ?? ""
            )
          : true)
    );
  };

  const getSortedFood = (
    foods: FoodItemTs[],
    sort:
      | {
          by: keyof FoodItemTs;
          direction: "asc" | "desc";
        }
      | false
  ): FoodItemTs[] => {
    return foods.sort((a: FoodItemTs, b: FoodItemTs) => {
      if (!sort) {
        return 0;
      }

      const aValue = a[sort.by];
      const bValue = b[sort.by];

      // If the values don't exist, put them at the end of the list
      if (aValue === undefined || bValue === undefined) {
        return sort.direction === "asc" ? 1 : -1;
      }

      if (aValue === null || bValue === null) {
        return sort.direction === "asc" ? 1 : -1;
      }
      if (aValue > bValue) {
        return sort.direction === "asc" ? 1 : -1;
      }
      if (aValue < bValue) {
        return sort.direction === "asc" ? -1 : 1;
      }
      return 0;
    });
  };

  const getFinalFood = (
    foods: FoodItemTs[],
    filters: Record<string, any>,
    sort:
      | {
          by: keyof FoodItemTs;
          direction: "asc" | "desc";
        }
      | false
  ): FoodItemTs[] => {
    return getSortedFood(getFilteredFood(foods, filters), sort);
  };

  return {
    getFinalFood,
    getFoodCategoriesForFoodItem,
    getLastMonthInARowFromFoodItem,
    getLocalName,
    timesConsumedToday,
    isNativeToCountry,
    helpsReachGoals,
    isDisliked,
    hasSeasonalInfoForRegion,
    isInSeasonForRegion,
  };
}

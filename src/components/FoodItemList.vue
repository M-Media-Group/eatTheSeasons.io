<template>
  <div class="grid big-gap">
    <FoodItem
      v-for="food in foods"
      :id="food.id"
      :src="food.image_url"
      :name="food.name"
      :categories="getFoodCategoriesForFoodItem(food)"
      :lastMonth="getLastMonthInARowFromFoodItem(food)"
      :localName="getLocalName(food)"
      :isNative="checkIsFoodNativeToCountry(food)"
      :calories="food.kcal"
      :carb="food.carbohydrate"
      :fat="food.fat"
      :protein="food.protein"
      :water="food.water"
      :key="food.id"
      :showAddForm="showAddForm"
      :servingSize="food.serving_size"
      :titleLevel="titleLevel"
      :showImage="showImage"
      :helpsReachGoals="isSignedUp ? helpsReachGoals(food.id) : false"
      :isSignedUp="isSignedUp"
      :supportsIndexedDB="supportsIndexedDB"
      :timesConsumedToday="timesConsumedToday(food.id)"
      ><slot :food="food"></slot
    ></FoodItem>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from "vue";
import {
  CategoryName,
  FoodItem as FoodItemTs,
  MonthName,
} from "@/types/foodItem";
import type { PropType } from "vue";
import FoodItem from "@/components/FoodItem.vue"; // @ is an alias to /src
import store from "@/store";
import { consumedItem } from "@/types/consumedItem";

export default defineComponent({
  name: "FoodItemList",
  components: {
    FoodItem,
  },

  props: {
    foods: {
      type: Array as PropType<FoodItemTs[]>,
      default: () => [],
    },
    filters: {
      type: Object as PropType<Record<string, any>>,
      default: () => ({}),
    },
    showAddForm: {
      type: Boolean,
      default: false,
    },
    titleLevel: {
      type: Number,
      default: 2,
    },
    showImage: {
      type: Boolean,
      default: true,
    },
  },

  emits: ["addedConsumedFoodItem"],

  setup(props, { emit }) {
    const checkIsFoodNativeToCountry = (food: FoodItemTs): boolean | null => {
      return (
        food.food_regions?.find((foodRegion) => {
          return (
            foodRegion.region.country_code.toLowerCase() ===
            props.filters.country?.toLowerCase()
          );
        })?.grows_in_region ?? null
      );
    };

    const getFoodCategoriesForFoodItem = (food: FoodItemTs): CategoryName[] => {
      if (!food.categories) {
        return [];
      }
      return food.categories.map((foodCategory) => {
        return foodCategory.name;
      });
    };

    const getLastMonthInARowFromFoodItem = (
      food: FoodItemTs
    ): MonthName | undefined => {
      const months = food.food_regions
        ?.find((foodRegion) => {
          return (
            foodRegion.region.country_code.toLowerCase() ===
            props.filters.country?.toLowerCase()
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

    const getLocalName = (food: FoodItemTs): string => {
      return (
        food.food_regions?.find((foodRegion) => {
          return (
            foodRegion.region.country_code.toLowerCase() ===
            props.filters.country?.toLowerCase()
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

    const isSignedUp = computed(() => store.getters["auth/isSignedUp"]);
    const supportsIndexedDB = store.getters["app/supportsIndexedDB"];

    return {
      checkIsFoodNativeToCountry,
      getFoodCategoriesForFoodItem,
      getLastMonthInARowFromFoodItem,
      getLocalName,
      helpsReachGoals,
      timesConsumedToday,
      isSignedUp,
      supportsIndexedDB,
    };
  },
});
</script>

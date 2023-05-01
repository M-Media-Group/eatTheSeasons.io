<template>
  <TransitionGroup name="list" tag="div" class="grid big-gap">
    <template v-if="showableFoods.length > 0">
      <FoodItem
        v-for="food in showableFoods"
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
        :isDisliked="isDisliked(food.id)"
        ><slot :food="food"></slot
      ></FoodItem>
    </template>
    <slot
      name="empty"
      v-else-if="showableFoods.length === 0"
      key="not-found-foods"
    >
      <div>
        <p>No foods matching the criteria was found</p>
      </div>
    </slot>
  </TransitionGroup>
</template>

<script lang="ts" setup>
import { computed, defineProps, defineExpose, toRaw } from "vue";
import {
  CategoryName,
  FoodItem as FoodItemTs,
  MonthName,
} from "@/types/foodItem";
import type { PropType } from "vue";
import FoodItem from "@/components/FoodItem.vue"; // @ is an alias to /src
import store from "@/store";
import { consumedItem } from "@/types/consumedItem";

const props = defineProps({
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
  sort: {
    default: () => ({
      by: "name",
      direction: "asc",
    }),
    type: [Object, Boolean] as PropType<
      | false
      | {
          by: keyof FoodItemTs;
          direction: "asc" | "desc";
        }
    >,
    required: false,
  },
});

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

const dislikedFoodItemIds = computed(
  () => store.getters["consumedItems/dislikedFoodItemIds"]
);

const isDisliked = (id: number) => {
  return dislikedFoodItemIds.value.includes(id);
};

const hasSeasonalInfo = (food: FoodItemTs) => {
  return food.food_regions?.some((foodRegion) => {
    return (
      foodRegion.region.country_code.toLowerCase() ===
      props.filters.country?.toLowerCase()
    );
  });
};

const foodIsInCountry = (food: FoodItemTs, countryCode: string) => {
  return (
    food.food_regions?.some((foodRegion) => {
      return (
        foodRegion.region.country_code.toLowerCase() ===
        countryCode.toLowerCase()
      );
    }) ?? false
  );
};

const foodIsInRegion = (food: FoodItemTs, regionName: string) => {
  return (
    food.food_regions?.some((foodRegion) => {
      return foodRegion.region.name.toLowerCase() === regionName.toLowerCase();
    }) ?? false
  );
};

const isInSeasonForRegion = (
  food: FoodItemTs,
  countryCode: string,
  regionName: string,
  month: string
) =>
  food.food_regions?.findIndex(
    (foodRegion) =>
      foodRegion.region.name.toLowerCase() === regionName.toLowerCase() &&
      foodRegion.region.country_code.toLowerCase() ===
        countryCode.toLowerCase() &&
      foodRegion.seasons.findIndex(
        (season) => season.month_name.toLowerCase() === month.toLowerCase()
      ) !== -1
  ) !== -1;

// Determine if the food item is in season based on the month in filters.month
const isInSeason = (food: FoodItemTs) => {
  if (!hasSeasonalInfo(food)) {
    return false;
  }

  if (!props.filters.country) {
    return false;
  }

  if (!foodIsInCountry(food, props.filters.country)) {
    return false;
  }

  if (!props.filters.region) {
    return false;
  }

  if (!foodIsInRegion(food, props.filters.region)) {
    return false;
  }

  if (!props.filters.month) {
    return false;
  }

  if (
    !isInSeasonForRegion(
      food,
      props.filters.country,
      props.filters.region,
      props.filters.month
    )
  ) {
    return false;
  }

  return true;
};

const showableFoods = computed(() =>
  props.foods
    .filter((food) => {
      return (
        (props.filters.hideDisliked ? !isDisliked(food.id) : true) &&
        (props.filters.hideHelpsReachGoals
          ? !helpsReachGoals(food.id)
          : true) &&
        (props.filters.showOnlyWithCaloricInfo
          ? food.kcal && food.kcal > 0
          : true) &&
        (props.filters.showOnlyWithCountry && checkIsFoodNativeToCountry(food)
          ? checkIsFoodNativeToCountry(food)
          : true) &&
        (props.filters.showOnlyInSeason ? isInSeason(food) : true)
      );
    })
    .sort((a: FoodItemTs, b: FoodItemTs) => {
      if (!props.sort) {
        return 0;
      }

      const aValue = a[props.sort.by];
      const bValue = b[props.sort.by];

      // If the values don't exist, put them at the end of the list
      if (aValue === undefined || bValue === undefined) {
        return props.sort.direction === "asc" ? 1 : -1;
      }

      if (aValue === null || bValue === null) {
        return props.sort.direction === "asc" ? 1 : -1;
      }
      if (aValue > bValue) {
        return props.sort.direction === "asc" ? 1 : -1;
      }
      if (aValue < bValue) {
        return props.sort.direction === "asc" ? -1 : 1;
      }
      return 0;
    })
);

const countOfShowableFoods = computed(() => toRaw(showableFoods).value.length);

defineExpose({
  countOfShowableFoods,
});
</script>

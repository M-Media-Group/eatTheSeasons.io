<template>
  <TransitionGroup name="list" tag="div" class="grid big-gap">
    <template v-if="showableFoods.length > 0">
      <FoodItem
        v-for="food in showableFoods"
        :id="food.id"
        :src="food.image_url"
        :name="food.name"
        :categories="getFoodCategoriesForFoodItem(food)"
        :lastMonth="getLastMonthInARowFromFoodItem(food, filters.country ?? '')"
        :localName="getLocalName(food, filters.country ?? '')"
        :isNative="isNativeToCountry(food, filters.country ?? '')"
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
      :countOfShowableFoods="showableFoods.length"
      :filteredResultsCount="filteredResultsCount"
    >
      <div>
        <p>No foods matching the criteria was found</p>
      </div>
    </slot>
  </TransitionGroup>
</template>

<script lang="ts" setup>
import { computed, defineProps } from "vue";
import { FoodItem as FoodItemTs } from "@/types/foodItem";
import type { PropType } from "vue";
import FoodItem from "@/components/FoodItem.vue"; // @ is an alias to /src
import store from "@/store";
import { useFood } from "@/composables/useFood";

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

const {
  getFinalFood,
  getFoodCategoriesForFoodItem,
  getLastMonthInARowFromFoodItem,
  getLocalName,
  isNativeToCountry,
  helpsReachGoals,
  timesConsumedToday,
  isDisliked,
} = useFood();

const showableFoods = computed(() =>
  !props.sort && !props.filters
    ? props.foods
    : getFinalFood(props.foods, props.filters, props.sort)
);

const isSignedUp = computed(() => store.getters["auth/isSignedUp"]);
const supportsIndexedDB = store.getters["app/supportsIndexedDB"];

const filteredResultsCount = computed(
  () => props.foods.length - showableFoods.value.length
);
</script>

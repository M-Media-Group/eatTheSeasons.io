<template>
  <main class="grid big-gap">
    <FoodItemList
      v-if="food"
      :foods="[food]"
      :show-add-form="true"
      :titleLevel="1"
    />
    <h2>Related</h2>
    <FoodItemList
      v-if="related"
      :foods="related"
      :sort="false"
      :filters="filters"
    />
  </main>
</template>

<script lang="ts" setup>
import FoodItemList from "@/components/FoodItemList.vue";
import { FoodItem } from "@/types/foodItem";
import {
  calculatePercentages,
  sortIndexesBySimilarity,
} from "@/utils/algorithms";
import { computed } from "vue";
import { useRoute } from "vue-router";
import { useStore } from "vuex";

// Get the food item id from the URL
const route = useRoute();
const store = useStore();

const allFoodItems = computed(() => store.state.foodItems.foodItems);
const filters = computed(() => store.getters["auth/filters"]);

const food = computed(() =>
  allFoodItems.value?.find(
    (food: FoodItem) => food.id === Number(route.params.id)
  )
);

const related = computed(() => {
  if (!food.value) return [];
  const indexes = sortIndexesBySimilarity(
    calculatePercentages([
      food.value.protein ?? 0,
      food.value.carbohydrate ?? 0,
      food.value.fat ?? 0,
    ]),

    allFoodItems.value?.map((food: FoodItem) =>
      calculatePercentages([
        food.protein ?? 0,
        food.carbohydrate ?? 0,
        food.fat ?? 0,
      ])
    )
  ).slice(1, 25);
  return indexes.map((index: number) => allFoodItems.value[index]);
});
</script>

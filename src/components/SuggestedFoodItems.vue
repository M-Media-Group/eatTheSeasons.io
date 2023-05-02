<template>
  <div v-if="findFoodItems.length > 0">
    <FoodItemList
      :foods="findFoodItems.slice(0, resultsLimit)"
      :filters="filters"
      :showAddForm="true"
    />
    <template v-if="findFoodItems.length - resultsLimit > 0">
      <p>
        ... and {{ findFoodItems.length - resultsLimit }} more. Use
        <router-link to="/search">Search</router-link> to find more foods.
      </p>
    </template>
  </div>
  <div v-else style="margin-bottom: 5rem">
    There's no suggested foods to show at this time. Find and add any food you
    ate in
    <router-link to="/search">Search</router-link> to get more results.
  </div>
</template>

<script lang="ts" setup>
import { computed } from "vue";
import { useStore } from "vuex";
import FoodItemList from "./FoodItemList.vue";

const store = useStore();

const findFoodItems = computed(
  () => store.getters["foodItems/foodItemsThatHelpReachGoals"]
);

const resultsLimit = computed(() => store.getters["app/resultsLimit"]);

const filters = computed(() => store.getters["auth/filters"]);
</script>

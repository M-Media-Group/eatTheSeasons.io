<template>
  <div v-if="findFoodItems.length > 0">
    <FoodItemList
      :foods="findFoodItems.slice(0, resultsLimit)"
      :filters="{}"
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

<script lang="ts">
import { defineComponent } from "vue";
import { mapGetters } from "vuex";
import FoodItemList from "./FoodItemList.vue";

export default defineComponent({
  name: "SuggestedFoodItems",
  components: {
    FoodItemList,
  },

  computed: {
    ...mapGetters({
      findFoodItems: "foodItems/foodItemsThatHelpReachGoals",
      resultsLimit: "app/resultsLimit",
    }),
  },
});
</script>

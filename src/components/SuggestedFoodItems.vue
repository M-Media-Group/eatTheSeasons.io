<template>
  <div v-if="findFoodItems.length > 0">
    <FoodItem
      v-for="food in findFoodItems.slice(0, 200)"
      :key="food.id"
      :id="food.id"
      :src="food.image_url"
      :name="food.name"
      :isNative="null"
      :calories="food.kcal"
      :carb="food.carbohydrate"
      :fat="food.fat"
      :protein="food.protein"
      :water="food.water"
      :showAddForm="true"
    />
  </div>
  <div v-else>
    There's no suggested foods to show now. Track more of your food in
    <router-link to="/search">Search</router-link> to get more results
  </div>
</template>

<script lang="ts">
import { defineComponent, defineAsyncComponent } from "vue";
import { mapGetters, mapActions } from "vuex";
import FoodItem from "./FoodItem.vue";

export default defineComponent({
  name: "HealthTracker",
  components: {
    FoodItem: defineAsyncComponent({
      // the loader function
      loader: () => import("./FoodItem.vue"),

      // A component to use while the async component is loading
      // loadingComponent: LoadingComponent,

      // Delay before showing the loading component. Default: 200ms.
      delay: 200,

      // A component to use if the load fails
      // errorComponent: ErrorComponent,
      // The error component will be displayed if a timeout is
      // provided and exceeded. Default: Infinity.

      timeout: 3000,
    }),
  },

  computed: {
    ...mapGetters({
      findFoodItems: "foodItems/foodItemsThatHelpReachGoals",
    }),
  },
});
</script>

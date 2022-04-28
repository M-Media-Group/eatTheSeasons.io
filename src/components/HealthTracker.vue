<template>
  <div>
    <h1 v-if="hasExceededCalories">Stop eating for today!</h1>
    <h1 v-else-if="caloriesEaten > goals.calories">
      You've exceeded your caloric goal by
      {{ Math.round(caloriesEaten - goals.calories) }} kilocalories
    </h1>
    <h1 v-else-if="caloriesEaten === 0">
      Find your first food of the day in
      <router-link to="/search">Search</router-link>
    </h1>
    <h1 v-else>You ate {{ Math.round(caloriesEaten) }} kilocalories today</h1>
    <template v-if="caloriesEaten !== 0">
      Here's your daily macronutrient distribution; goals compared to actual:
      <NutrientInformation
        :protein="goals.proteinPercent"
        :carb="goals.carbsPercent"
        :fat="goals.fatPercent"
        :showText="false"
        style="opacity: 0.5"
      />
      <NutrientInformation
        v-if="isSignedUp && carbEaten !== 0 && fatEaten !== 0"
        :protein="proteinEaten"
        :carb="carbEaten"
        :fat="fatEaten"
      />
    </template>
    <div style="margin-top: 5rem; display: grid; gap: 5rem">
      <ConsumedFoodItemTable :consumedItems="getConsumedItems" />
      <div>
        <h2>Meal times</h2>
        <MealTimes />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import NutrientInformation from "./NutrientInformation.vue";
import { mapGetters, mapActions } from "vuex";
import MealTimes from "./MealTimes.vue";
import ConsumedFoodItemTable from "./ConsumedFoodItemTable.vue";

export default defineComponent({
  name: "HealthTracker",
  components: {
    NutrientInformation,
    MealTimes,
    ConsumedFoodItemTable,
  },
  props: {},

  computed: {
    ...mapGetters({
      isSignedUp: "auth/isSignedUp",
      caloriesEaten: "consumedItems/kcalConsumedToday",
      carbEaten: "consumedItems/carbsConsumedToday",
      fatEaten: "consumedItems/fatConsumedToday",
      proteinEaten: "consumedItems/proteinConsumedToday",
      getConsumedItems: "consumedItems/allConsumedItemsToday",
      foodItems: "foodItems/allFoodItems",
      goals: "auth/goals",
      meals: "auth/meals",
      nutrientRatio: "auth/nutrientRatio",
      findFoodItems: "foodItems/foodItemsThatHelpReachGoals",
    }),
    // Find foodItems with similar ratios as in currentVsGoals

    hasExceededCalories() {
      return (this as any).caloriesEaten.toFixed(2) - this.goals.calories > 500;
    },
  },
  methods: {
    ...mapActions({
      addConsumedFoodItem: "consumedItems/addConsumedItem",
      deleteConsumedItem: "consumedItems/deleteConsumedItem",
    }),
  },
});
</script>

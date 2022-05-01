<template>
  <div class="grid big-gap">
    <div class="grid">
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

      <div v-if="caloriesEaten !== 0" class="grid small-gap">
        <p>
          Here's your daily macronutrient distribution; goals compared to
          actual:
        </p>
        <div class="grid small-gap">
          <NutrientInformation
            :protein="goals.proteinPercent"
            :carb="goals.carbsPercent"
            :fat="goals.fatPercent"
            :showText="false"
            style="margin-bottom: 0; opacity: 0.5"
          />
          <NutrientInformation
            v-if="isSignedUp && carbEaten !== 0 && fatEaten !== 0"
            :protein="proteinEaten"
            :carb="carbEaten"
            :fat="fatEaten"
          />
        </div>
      </div>
      <div v-else class="grid small-gap">
        <p>Your daily macronutrient goals:</p>
        <div class="grid small-gap">
          <NutrientInformation
            :protein="goals.proteinPercent"
            :carb="goals.carbsPercent"
            :fat="goals.fatPercent"
          />
        </div>
      </div>
    </div>
    <div class="grid">
      <h2>Meal times</h2>
      <MealTimes />
    </div>
    <div class="grid">
      <h2>Food you ate</h2>
      <ConsumedFoodItemTable
        :consumedItems="getConsumedItems"
        :expand="showExpandedTable"
      />
      <a href.prevent="#" @click="showExpandedTable = !showExpandedTable">
        {{ showExpandedTable ? "Hide" : "Show" }} expanded data
      </a>
    </div>
    <details>
      <summary>Change current date</summary>
      <input
        type="date"
        v-model="date"
        :max="new Date().toISOString().split('T')[0]"
        style="width: auto"
      />
    </details>
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

  data() {
    return {
      showExpandedTable: false,
    };
  },

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

    // Set a get and set for Date
    date: {
      get() {
        return (this.$store.getters["consumedItems/activeDate"] ?? new Date())
          .toISOString()
          .substring(0, 10);
      },
      set(newDate: Date | string) {
        this.changeToDate(newDate);
      },
    },
  },
  methods: {
    ...mapActions({
      addConsumedFoodItem: "consumedItems/addConsumedItem",
      deleteConsumedItem: "consumedItems/deleteConsumedItem",
      changeToDate: "consumedItems/setDate",
    }),
  },
});
</script>

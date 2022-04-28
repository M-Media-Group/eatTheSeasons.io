<template>
  <div class="grid">
    <div
      v-for="(meal, key, index) in meals"
      :key="meal"
      :style="{
        opacity: meal.date < new Date() ? 0.5 : 1,
      }"
    >
      <h3>
        {{ meal.date.toLocaleTimeString() }} -
        {{
          key
            .replace(/([A-Z])/g, " $1")
            // uppercase the first character
            .replace(/^./, function (str) {
              return str.toUpperCase();
            })
        }}
      </h3>
      <p v-if="meal.date >= new Date()">
        Calories actually allowed:
        {{ (mealTotalCaloriesPerMeal[index] - caloriesEaten).toFixed(0) }}kcal
        <br />
        <small>
          (Expected total calories after meal:
          {{ mealTotalCaloriesPerMeal[index] }}kcal,
          {{ (meal.caloricPercentage / 100) * goals.calories }}kcal normally
          allocated for this meal)
          <span v-if="meal.date < new Date()"> - Done</span>
        </small>
      </p>
      <p v-else>
        Calories eaten by mealtime:
        {{ Math.round(caloriesConsumedByGivenTime(meal.date)) }} /
        {{ mealTotalCaloriesPerMeal[index] }} kcal
        <br />
        <small>
          (Expected total calories after meal:
          {{ mealTotalCaloriesPerMeal[index] }}kcal,
          {{ (meal.caloricPercentage / 100) * goals.calories }}kcal normally
          allocated for this meal)
        </small>
      </p>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { mapGetters, mapActions } from "vuex";
import { consumedItem } from "@/types/consumedItem";

export default defineComponent({
  name: "MealTimes",
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
    }),

    mealTotalCaloriesPerMeal(): Array<number> {
      const meals = this.meals as unknown as Record<string, any>;
      const mealTotalCalories = Object.keys(meals).map((key) => {
        return meals[key].caloricPercentage;
      });
      // For each array element, add the previous element to it
      const mealTotalCaloriesPerMeal = mealTotalCalories.reduce(
        (acc, curr, index) => {
          if (index === 0) {
            return [curr];
          }
          return [...acc, acc[index - 1] + curr];
        },
        []
      );
      // For each array element, devide the element by the total amount of calories
      return mealTotalCaloriesPerMeal.map(
        (calories: number) => (this.goals.calories / 100) * calories
      );
    },

    hasExceededCalories() {
      return (
        (this as any).caloriesEaten.toFixed(2) - (this as any).goals.calories >
        500
      );
    },
  },
  methods: {
    ...mapActions({
      addConsumedFoodItem: "consumedItems/addConsumedItem",
      deleteConsumedItem: "consumedItems/deleteConsumedItem",
    }),
    caloriesConsumedByGivenTime(time: Date) {
      const consumedItems = this.getConsumedItems as consumedItem[];
      const mealtimeWithDuration = new Date(
        time.getTime() + this.goals.mealTimeSeparationInMinutes * 60000
      );
      const consumedItemsByTime = consumedItems.filter(
        (item) => new Date(item.created_at ?? "") <= mealtimeWithDuration
      );
      return consumedItemsByTime.reduce(
        (acc, curr) => acc + (curr?.kcal ?? 0),
        0
      );
    },
  },
});
</script>

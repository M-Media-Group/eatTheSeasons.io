<template>
  <div class="grid">
    <div class="page-header">
      <h1>Stats</h1>
      <input type="date" v-model="startDate" />
      <input type="date" v-model="endDate" />
    </div>
    <h2>
      You averaged
      {{ averageCalories }} kilocalories per day over
      {{ daysActive.length }} days
    </h2>
  </div>
  <p>You ate a total of {{ totals.items }} items.</p>
  <p>
    Your most caloric day was {{ mostCaloricDay.days[0] }}, with
    {{ Math.round(mostCaloricDay.max) }} kcal.
  </p>
  <h2>Favorites</h2>
  <template v-for="item in favoriteFoodItems" :key="item">
    <FoodItem
      v-if="item?.name"
      :name="item.name"
      :id="item.id"
      :src="item.image_url"
    >
      <p>You ate {{ item.grams }} grams {{ item.count }} times</p>
    </FoodItem>
  </template>
  <div class="grid">
    <h2>History</h2>
    <template v-for="(item, index) in dataPerDay" :key="index">
      <label style="grid-auto-columns: 1fr; margin: 0 auto"
        ><time>{{ daysActive.reverse()[index].split("T")[0] }}</time>
        <!-- {{ Math.round(item) }} kcal -->
        <meter
          :max="mostCaloricDay.max"
          :low="goals.calories - goals.calorieGoalTolerance"
          :high="goals.calories + goals.calorieGoalTolerance"
          :optimum="goals.calories"
          :value="Math.round(item?.calories ?? 0)"
      /></label>
    </template>
  </div>
</template>

<script lang="ts">
import FoodItem from "@/components/FoodItem.vue";
import { consumedItem } from "@/types/consumedItem";
import {
  computed,
  ComputedRef,
  defineComponent,
  ref,
  WritableComputedRef,
} from "vue";
import { useStore } from "vuex";

export default defineComponent({
  components: { FoodItem },
  name: "HomeView",

  setup() {
    const store = useStore();

    const goals = computed(() => {
      return store.getters["auth/goals"];
    });

    const allConsumedItemsInTimeframe: ComputedRef<consumedItem[]> = computed(
      () => {
        return store.getters["consumedItems/allConsumedItemsInTimeframe"];
      }
    );

    const endDate: WritableComputedRef<string> = computed({
      get() {
        return store.state.consumedItems.endDate.toISOString().split("T")[0];
      },
      set(value) {
        store.dispatch("consumedItems/setEndDate", value);
      },
    });

    const startDate: WritableComputedRef<string> = computed({
      get() {
        return store.state.consumedItems.setDate.toISOString().split("T")[0];
      },
      set(value) {
        store.dispatch("consumedItems/setDate", value);
      },
    });

    const daysActive = computed(() => {
      const start = new Date(startDate.value);
      const end = new Date(endDate.value);
      const diff = end.getTime() - start.getTime();
      // For each day between start and end, get the date (day, month, and year)
      // and add it to the array
      const days = [];
      for (let i = 0; i <= Math.floor(diff / (1000 * 60 * 60 * 24)); i++) {
        days.push(
          new Date(start.getTime() + i * (1000 * 60 * 60 * 24)).toISOString()
        );
      }
      return days;
    });

    const averageCalories = computed(() => {
      // Count of days with value greater than 0
      const daysWithValue = caloriesPerEachDay.value.filter(
        (day, index) => caloriesPerEachDay.value[index] > 0
      );
      return Math.round(totals.value.calories / daysWithValue.length);
    });

    const caloriesPerEachDay = computed(() => {
      const days = new Array(daysActive.value.length).fill(0);
      allConsumedItemsInTimeframe.value.forEach((item) => {
        const date = new Date(item.created_at ?? "").toISOString();
        const activeDayIndex = daysActive.value.findIndex(
          (day) => day.split("T")[0] === date.split("T")[0]
        );
        console.log(date, activeDayIndex);
        days[activeDayIndex] += item.kcal;
      });
      return days.reverse();
    });

    // For each day, return an array of objects where each object contains the total grams consumed, calories, fiber, and protein
    const dataPerDay = computed(() => {
      const days = new Array(daysActive.value.length).fill(null);

      allConsumedItemsInTimeframe.value.forEach((item) => {
        const date = new Date(item.created_at ?? "").toISOString();
        const activeDayIndex = daysActive.value.findIndex(
          (day) => day.split("T")[0] === date.split("T")[0]
        );
        if (!days[activeDayIndex]) {
          days[activeDayIndex] = {
            calories: 0,
            grams: 0,
            fiber: 0,
            protein: 0,
            fat: 0,
            water: 0,
            alcohol: 0,
            items: 0,
            mostCommonFoodItem: {
              name: "",
              grams: 0,
              count: 0,
            },
          };
        }
        days[activeDayIndex].calories += item.kcal;
        days[activeDayIndex].grams += item.grams;
        days[activeDayIndex].fiber += item.fiber;
        days[activeDayIndex].protein += item.protein;
        days[activeDayIndex].fat += item.fat;
        days[activeDayIndex].water += item.water;
        days[activeDayIndex].alcohol += item.alcohol;
        days[activeDayIndex].items++;
        // mostCommonFoodItem and count each occurence of item
        // If the food item already exists, increment the count and add to grams
        // If the food item does not exist, add it to the array
        if (days[activeDayIndex].mostCommonFoodItem.name === item.name) {
          days[activeDayIndex].mostCommonFoodItem.grams += item.grams;
          days[activeDayIndex].mostCommonFoodItem.count++;
        } else {
          days[activeDayIndex].mostCommonFoodItem = {
            name: item.name,
            grams: item.grams,
            count: 1,
          };
        }
      });
      return days.reverse();
    });

    const totals = computed(() => {
      const data = dataPerDay.value.filter((day) => day);
      const totals = {
        calories: 0,
        grams: 0,
        fiber: 0,
        protein: 0,
        fat: 0,
        water: 0,
        alcohol: 0,
        items: 0,
      };
      data.forEach((day) => {
        totals.calories += day.calories;
        totals.grams += day.grams;
        totals.fiber += day.fiber;
        totals.protein += day.protein;
        totals.fat += day.fat;
        totals.water += day.water;
        totals.alcohol += day.alcohol;
        totals.items += day.items;
      });
      return totals;
    });

    const mostCaloricDay = computed(() => {
      const items = allConsumedItemsInTimeframe.value;
      const itemsByDay = items.reduce((acc: any, item) => {
        if (!item || !item.created_at) {
          return acc;
        }
        const date = new Date(item.created_at).toISOString().split("T")[0];
        if (!acc[date]) {
          acc[date] = 0;
        }
        acc[date] += item.kcal;
        return acc;
      }, {}) as { [key: string]: number };
      const max = Math.max(...Object.values(itemsByDay));
      const maxDays = Object.keys(itemsByDay).filter(
        (date) => itemsByDay[date] === max
      );
      return {
        max,
        days: maxDays,
      };
    });

    const favoriteFoodItems = computed(() => {
      const items = dataPerDay.value.filter((day) => day);
      // If the food item already exists, increment the count and add to grams
      // If the food item does not exist, add it to the array
      const itemsByName = items.reduce((acc: any, day) => {
        if (!day.mostCommonFoodItem) {
          return acc;
        }
        if (!acc[day.mostCommonFoodItem.name]) {
          acc[day.mostCommonFoodItem.name] = {
            name: day.mostCommonFoodItem.name,
            grams: day.mostCommonFoodItem.grams,
            count: day.mostCommonFoodItem.count,
          };
        } else {
          acc[day.mostCommonFoodItem.name].grams +=
            day.mostCommonFoodItem.grams;
          acc[day.mostCommonFoodItem.name].count +=
            day.mostCommonFoodItem.count;
        }
        return acc;
      }, {}) as { [key: string]: any };
      return Object.values(itemsByName).sort((a, b) => b.count - a.count);
    });
    return {
      startDate,
      endDate,
      daysActive,
      averageCalories,
      allConsumedItemsInTimeframe,
      mostCaloricDay,
      caloriesPerEachDay,
      goals,
      dataPerDay,
      totals,
      favoriteFoodItems,
    };
  },
});
</script>

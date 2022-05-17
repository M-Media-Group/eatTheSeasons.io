<template>
  <div class="grid">
    <div class="page-header">
      <h1>Stats</h1>
      <input type="date" v-model="startDate" />
      <input type="date" v-model="endDate" />
    </div>
    <h2>
      Eaten {{ allConsumedItemsInTimeframe.length }} items, averaging
      {{ averageCalories }} kilocalories per day over
      {{ daysActive.length }} days
    </h2>
  </div>
  Your worst day was {{ mostCaloricDay.days[0] }}, with
  {{ mostCaloricDay.max }} kcal
  <div class="grid">
    <template v-for="(item, index) in caloriesPerEachDay" :key="index">
      <label style="grid-auto-columns: 1fr; margin: 0 auto"
        ><time>{{ daysActive.reverse()[index].split("T")[0] }}</time>
        {{ Math.round(item) }} kcal
        <meter
          :max="mostCaloricDay.max"
          :low="goals.calories - goals.calorieGoalTolerance"
          :high="goals.calories + goals.calorieGoalTolerance"
          :optimum="goals.calories"
          :value="Math.round(item)"
      /></label>
    </template>
  </div>
</template>

<script lang="ts">
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

    const totalCalories = computed(() => {
      return Math.round(
        allConsumedItemsInTimeframe.value.reduce(
          (acc, item) => acc + (item && item.kcal ? item.kcal : 0),
          0
        )
      );
    });

    const averageCalories = computed(() => {
      return Math.round(totalCalories.value / daysActive.value.length);
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

    return {
      startDate,
      endDate,
      daysActive,
      totalCalories,
      averageCalories,
      allConsumedItemsInTimeframe,
      mostCaloricDay,
      caloriesPerEachDay,
      goals,
    };
  },
});
</script>

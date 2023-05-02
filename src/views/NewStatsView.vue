<template>
  <main class="grid default-padding big-gap">
    <header class="default">
      <h1>Look back {{ timeframe.slice(0, -1) }} {{ usingTimeframe }}s</h1>
      <div class="grid" style="grid-auto-flow: column">
        <input type="text" v-model="timeframe" />
      </div>
    </header>
    <template v-if="allConsumedItems.length > 0">
      <section>
        <h2>Results</h2>
        <label>Group by</label>
        <select
          class="input small"
          v-model="timebreakdown"
          style="width: max-content; margin: 0 auto"
        >
          <option :value="false">unique day</option>
          <option value="h">hour</option>
          <option value="d">day of week</option>
          <option value="w">day of month</option>
          <option value="M">month</option>
          <option value="y">year</option>
        </select>
        <LineChart :chartData="chartData" />
      </section>
      <section>
        <h2>Favorite foods</h2>
        <DoughnutChart :chartData="doughnutChartData" />
      </section>
      <section>
        <h2>General stats</h2>
        <p>
          You've tracked {{ allConsumedItems.length }} consumed items on the app
        </p>
      </section>
    </template>
    <template v-else>
      <h2>There's no data to show yet.</h2>
      <p>Track your food intake throughout the week to see the results here.</p>
    </template>
  </main>
</template>

<script lang="ts" setup>
import FoodItemList from "@/components/FoodItemList.vue";
import { computed } from "vue";
import { Chart, ChartData, registerables } from "chart.js";
import { LineChart, DoughnutChart } from "vue-chart-3";
import { useConsumedFood } from "@/composables/useConsumedFood";
const {
  timeframe,
  timebreakdown,
  operationMode,
  allConsumedItems,
  foodsByCount,
  usingDatePrecision,
  usingTimeframe,
  computedItemsWithOperation,
  computedItems,
  computeItemsWithOperation,
} = useConsumedFood();

Chart.register(...registerables);

const chartData = computed<ChartData<"line">>(() => {
  return {
    labels: Object.keys(computedItemsWithOperation.value),
    datasets: [
      {
        label: "kcal",
        data: Object.values(
          computeItemsWithOperation(
            computedItems.value,
            "kcal",
            operationMode.value
          )
        ),
        fill: false,
        borderColor: "rgb(75, 192, 192)",
        tension: 0.1,
      },
      {
        label: "protein",
        data: Object.values(
          computeItemsWithOperation(
            computedItems.value,
            "protein",
            operationMode.value
          )
        ),
        fill: false,
        borderColor: "rgb(139, 137, 255)",
        tension: 0.1,
        hidden: true,
      },
      {
        label: "carbohydrate",
        data: Object.values(
          computeItemsWithOperation(
            computedItems.value,
            "carbohydrate",
            operationMode.value
          )
        ),
        fill: false,
        borderColor: "#22862d",
        tension: 0.1,
        hidden: true,
      },
      {
        label: "fat",
        data: Object.values(
          computeItemsWithOperation(
            computedItems.value,
            "fat",
            operationMode.value
          )
        ),
        fill: false,
        borderColor: "brown",
        tension: 0.1,
        hidden: true,
      },
    ],
  };
});

const doughnutChartData = computed<ChartData<"doughnut">>(() => {
  return {
    labels: Object.values(foodsByCount.value).map((item) => item.name),
    datasets: [
      {
        label: "Foods by count",
        data: Object.values(foodsByCount.value).map((item) => item.count),
        backgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
        ],
        hoverOffset: 4,
      },
    ],
  };
});
</script>

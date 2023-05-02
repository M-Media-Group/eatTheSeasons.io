<template>
  <main class="grid default-padding">
    <header class="default">
      <h1>
        Looking back {{ timeframe.slice(0, -1) }} {{ usingTimeframe }} broken
        down by {{ usingDatePrecision }}
      </h1>

      <div class="grid" style="grid-auto-flow: column">
        <input type="text" v-model="timeframe" />
        <select class="input" v-model="timebreakdown">
          <option :value="false">none</option>
          <option value="m">minute</option>
          <option value="h">hour</option>
          <option value="d">day of week</option>
          <option value="w">day of month</option>
          <option value="M">month</option>
          <option value="y">year</option>
        </select>
      </div>
      <hr />
      <div class="grid" style="grid-auto-flow: column">
        <label>
          <input type="radio" v-model="operation" value="grams" />
          <span>gram</span>
        </label>
        <label>
          <input type="radio" v-model="operation" value="kcal" />
          <span>kcal</span>
        </label>
        <label>
          <input type="radio" v-model="operation" value="protein" />
          <span>protein</span>
        </label>
        <label>
          <input type="radio" v-model="operation" value="carbohydrate" />
          <span>carbohydrate</span>
        </label>
      </div>
      <hr />
      <div class="grid" style="grid-auto-flow: column">
        <label>
          <input type="radio" v-model="operationMode" value="avg" />
          <span>avg</span>
        </label>
        <label>
          <input type="radio" v-model="operationMode" value="sum" />
          <span>sum</span>
        </label>
      </div>
    </header>
    <template v-if="allConsumedItems.length > 0">
      <section>
        <h2>Results</h2>
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
  operation,
  operationMode,
  allConsumedItems,
  foodsByCount,
  usingDatePrecision,
  usingTimeframe,
  computedItemsWithOperation,
} = useConsumedFood();

Chart.register(...registerables);

const chartData = computed<ChartData<"line">>(() => {
  return {
    labels: Object.keys(computedItemsWithOperation.value),
    datasets: [
      {
        label: `${operation.value} over ${usingDatePrecision.value}, ${operationMode.value} of last ${timeframe.value}`,
        data: Object.values(computedItemsWithOperation.value),
        fill: false,
        borderColor: "rgb(75, 192, 192)",
        tension: 0.1,
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

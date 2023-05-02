<template>
  <main class="grid default-padding">
    <h1>
      Looking back {{ timeframe.slice(0, -1) }} {{ usingTimeframe }} broken down
      by {{ usingDatePrecision }}
    </h1>
    <div class="grid">
      <div class="grid" style="grid-auto-flow: column">
        <input type="text" v-model="timeframe" />
        <select class="input" v-model="timebreakdown">
          <option :value="null">none</option>
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
    </div>
    <h2>Results</h2>
    <LineChart :chartData="chartData" />
    <h2>Favorite foods</h2>
    <DoughnutChart :chartData="doughnutChartData" />
  </main>
</template>

<script lang="ts" setup>
import FoodItemList from "@/components/FoodItemList.vue";
import {
  filterToTimerange,
  getDatePrecision,
  neoGroupByTimeRangeAndDate,
} from "@/utils/analyticsBreakdown";
import { computed, ref } from "vue";
import { useStore } from "vuex";
import { Chart, ChartData, registerables } from "chart.js";
import { LineChart, DoughnutChart } from "vue-chart-3";

Chart.register(...registerables);

const store = useStore();
const timeframe = ref("1w");
const timebreakdown = ref("d");
const operation = ref("kcal");
const operationMode = ref("sum");

const allConsumedItems = computed(() => {
  return store.getters["consumedItems/allConsumedItems"];
});

const filteredWithTimerangeItems = computed(() => {
  return filterToTimerange(allConsumedItems.value, Date.now(), timeframe.value);
});

const computedItems = computed(() => {
  if (timebreakdown.value === null) return [filteredWithTimerangeItems.value];

  return neoGroupByTimeRangeAndDate(
    filteredWithTimerangeItems.value,
    timebreakdown.value
  );
});

const foodsByCount = computed(() => {
  return (
    filteredWithTimerangeItems.value
      .map((item) => ({
        id: item.food_id,
        name: item.name,
      }))
      // Reduce to get the names and counts unique by id
      .reduce((acc, item) => {
        if (acc[item.id]) {
          acc[item.id].count++;
        } else {
          acc[item.id] = {
            name: item.name,
            count: 1,
          };
        }
        return acc;
      }, {})
  );
});

const usingDatePrecision = computed(() => {
  return getDatePrecision(timebreakdown.value);
});

const usingTimeframe = computed(() => {
  return getDatePrecision(timeframe.value);
});

const computedItemsWithOperation = computed(() => {
  return Object.keys(computedItems.value).reduce((acc, key) => {
    acc[key] = computedItems.value[key].reduce((acc, item) => {
      return acc + item[operation.value];
    }, 0);
    // If the operationMode is "avg", divide by the number of items
    if (operationMode.value === "avg") {
      acc[key] = acc[key] / computedItems.value[key].length;
    }
    return acc;
  }, {});
});

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

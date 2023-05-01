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
          <option value="h">hour</option>
          <option value="d">day</option>
          <option value="w">week</option>
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
    <div v-for="(computedItem, key) in computedItemsWithOperation" :key="key">
      <h3>
        {{ usingDatePrecision }} {{ key }}: {{ Math.round(computedItem) }}
        {{ operation }}
      </h3>
    </div>
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

const store = useStore();
const timeframe = ref("1w");
const timebreakdown = ref("d");
const operation = ref("kcal");
const operationMode = ref("avg");

const allConsumedItems = computed(() => {
  return store.getters["consumedItems/allConsumedItems"];
});

const computedItems = computed(() => {
  const filteredItems = filterToTimerange(
    allConsumedItems.value,
    Date.now(),
    timeframe.value
  );

  if (!timebreakdown.value) return filteredItems;

  return neoGroupByTimeRangeAndDate(filteredItems, timebreakdown.value);
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
</script>

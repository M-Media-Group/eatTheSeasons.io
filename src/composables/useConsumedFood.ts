import { consumedItem } from "@/types/consumedItem";
import {
  filterToTimerange,
  getDatePrecision,
  neoGroupByTimeRangeAndDate,
} from "@/utils/analyticsBreakdown";
import { computed, ref } from "vue";
import { useStore } from "vuex";

export function useConsumedFood() {
  const store = useStore();
  const timeframe = ref("1w");
  const timebreakdown = ref("d");
  const operation = ref("kcal" as keyof consumedItem);
  const operationMode = ref("sum");

  const allConsumedItems = computed(() => {
    return store.getters["consumedItems/allConsumedItems"] as consumedItem[];
  });

  const filteredWithTimerangeItems = computed(() => {
    return filterToTimerange(
      allConsumedItems.value,
      Date.now(),
      timeframe.value
    );
  });

  const computedItems = computed(() => {
    if (timebreakdown.value === null)
      return { "0": filteredWithTimerangeItems.value };

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
        .reduce(
          (acc: Record<string, { name: string; count: number }>, item) => {
            if (!item.id) return acc;
            if (acc[item.id]) {
              acc[item.id].count++;
            } else {
              acc[item.id] = {
                name: item.name,
                count: 1,
              };
            }
            return acc;
          },
          {}
        ) as Record<string, { name: string; count: number }>
    );
  });

  const usingDatePrecision = computed(() => {
    return getDatePrecision(timebreakdown.value);
  });

  const usingTimeframe = computed(() => {
    return getDatePrecision(timeframe.value);
  });

  const computedItemsWithOperation = computed(() => {
    return Object.keys(computedItems.value).reduce(
      (acc: Record<string, number>, key) => {
        acc[key] = computedItems.value[key].reduce((acc, item) => {
          const value = item[operation.value];
          if (typeof value !== "number") return acc;
          return acc + value;
        }, 0);
        // If the operationMode is "avg", divide by the number of items
        if (operationMode.value === "avg") {
          acc[key] = acc[key] / computedItems.value[key].length;
        }
        return acc;
      },
      {}
    ) as Record<string, number>;
  });

  return {
    timeframe,
    timebreakdown,
    operation,
    operationMode,
    allConsumedItems,
    filteredWithTimerangeItems,
    computedItems,
    foodsByCount,
    usingDatePrecision,
    usingTimeframe,
    computedItemsWithOperation,
  };
}

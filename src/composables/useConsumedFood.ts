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
  const timeframe = ref("5d");
  const timebreakdown = ref("h" as string | false);
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
    if (!timebreakdown.value || timebreakdown.value === "false") {
      return (
        filteredWithTimerangeItems.value
          //   Each day is a key, and the value is an array of items consumed on that day. The result is an object with keys of the day and values of the items consumed on that day.
          .reduce((acc: Record<string, consumedItem[]>, item) => {
            if (!item.created_at) return acc;
            const key = new Date(item.created_at).toLocaleDateString();
            if (!key) return acc;
            if (!acc[key]) {
              acc[key] = [];
            }
            acc[key].push(item);
            return acc;
          }, {})
      );
    }
    return neoGroupByTimeRangeAndDate(
      filteredWithTimerangeItems.value,
      timebreakdown.value
    );
  });

  const getCountOfKeys = (
    key: keyof consumedItem,
    id: keyof consumedItem,
    items: consumedItem[]
  ) => {
    // Return the key-name and counts, unique by id
    return (
      items
        .map((item) => ({
          id: item[id],
          name: item[key],
        }))
        // Reduce to get the names and counts unique by id
        .reduce(
          (acc: Record<string, { name: string; count: number }>, item) => {
            const id = item.id;
            const name = `${item.name}`;
            if (!id) return acc;
            if (typeof id !== "number" && typeof id !== "string") return acc;
            if (acc[id]) {
              acc[id].count++;
            } else {
              acc[id] = {
                name: name,
                count: 1,
              };
            }
            return acc;
          },
          {}
        ) as Record<string, { name: string; count: number }>
    );
  };

  const foodsByCount = computed(() => {
    return getCountOfKeys("name", "food_id", allConsumedItems.value);
  });

  const usingDatePrecision = computed(() => {
    if (!timebreakdown.value) return false;
    return getDatePrecision(timebreakdown.value);
  });

  const usingTimeframe = computed(() => {
    return getDatePrecision(timeframe.value);
  });

  const computeItemsWithOperation = (
    items: Record<string, consumedItem[]>,
    operation: keyof consumedItem,
    operationMode: string
  ): Record<string, number> => {
    return Object.keys(items).reduce((acc: Record<string, number>, key) => {
      acc[key] = items[key].reduce((acc, item) => {
        const value = item[operation];
        if (typeof value !== "number") return acc;
        return acc + value;
      }, 0);
      // If the operationMode is "avg", divide by the number of items
      if (operationMode === "avg") {
        acc[key] /= items[key].length;
      }
      return acc;
    }, {});
  };

  const computedItemsWithOperation = computed(() => {
    return computeItemsWithOperation(
      computedItems.value,
      operation.value,
      operationMode.value
    );
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
    computeItemsWithOperation,
  };
}

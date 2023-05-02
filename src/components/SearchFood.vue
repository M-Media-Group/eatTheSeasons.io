<template>
  <div class="grid" v-if="isSignedUp">
    <slot name="header" :search="search">
      <template v-if="hLevel === 1">
        <header class="page-header default">
          <h1>Find food</h1>
        </header>
        <input
          autofocus
          type="search"
          lang="en"
          spellcheck="true"
          v-model.trim="search"
          incremental
          placeholder="any food"
          required
          minlength="3"
          name="search"
          list="options-list"
          :aria-busy="isLoading"
        />
        <div v-if="!search" class="grid small-gap horizontal scrollable">
          <template v-for="searchTerm in recentSearches" :key="searchTerm">
            <button
              class="recent-search"
              @click="search = searchTerm"
              type="button"
            >
              {{ searchTerm }}
            </button>
          </template>
        </div>
      </template>
      <component v-else :is="'h' + hLevel">
        Find
        <input
          autofocus
          type="search"
          lang="en"
          spellcheck="true"
          v-model.trim="search"
          incremental
          placeholder="any food"
          required
          minlength="3"
          name="search"
          list="options-list"
        />
      </component>
    </slot>
    <datalist id="options-list">
      <option
        :value="food.name"
        v-for="food in allFoodItems"
        :key="'f-' + (food.id ?? food.name)"
      ></option>
    </datalist>
    <div v-if="search.length < 3" style="margin-bottom: 3rem">
      Type at least 3 characters to search
    </div>

    <div class="search-results" v-else>
      <FoodItemList
        :foods="results.slice(0, resultsLimit)"
        v-bind="$attrs"
        :filters="filters"
        :showAddForm="true"
        :sort="false"
        ref="resultsList"
      />
    </div>
    <div class="main-banner" v-if="!isSignedUp">
      <SignUp />
    </div>
  </div>
  <div v-else>
    <SignUp />
  </div>
</template>

<script lang="ts" setup>
import {
  defineAsyncComponent,
  defineProps,
  computed,
  ref,
  onMounted,
  watch,
  ComputedRef,
  Ref,
} from "vue";

import {
  FoodItem as FoodItemTs,
  OpenFoodFactsFoodItem,
} from "@/types/foodItem";
import { debounce } from "@/helpers";
import { useVueFuse } from "vue-fuse";
import { useStore } from "vuex";
import $bus, { eventTypes } from "@/eventBus/events";
import FoodItemList from "./FoodItemList.vue";
import { useRouter } from "vue-router";
import { convertOpenFoodFactsFoodItemToFoodItem } from "@/utils/dataTransformers";
import { useConsumedFood } from "@/composables/useConsumedFood";

const resultsList = ref();

const store = useStore();
const route = new URLSearchParams(window.location.search);

const SignUp = defineAsyncComponent(() => import("@/components/SignUp.vue"));

defineProps({
  hLevel: {
    type: Number,
    default: 1,
  },
});

const isLoading = ref(false);
const isSignedUp = computed(() => store.getters["auth/isSignedUp"]);
const resultsLimit = computed(() => store.getters["app/resultsLimit"]);
const filters = computed(() => store.getters["auth/filters"]);

const router = useRouter();

const allFoodItems = computed(() => store.state.foodItems.foodItems);

const { timeframe, timebreakdown, computedItems } = useConsumedFood();

timeframe.value = "7d";
timebreakdown.value = "h";
const currentHour = new Date().getHours();

const recentSearches = computed(() => {
  if (!computedItems.value || Array.isArray(computedItems.value)) {
    return [];
  }

  if (!computedItems.value[currentHour]) {
    return [];
  }
  const returnItems = computedItems.value[currentHour];

  if (computedItems.value[currentHour - 1]) {
    returnItems.push(...computedItems.value[currentHour - 1]);
  }

  if (computedItems.value[currentHour + 1]) {
    returnItems.push(...computedItems.value[currentHour + 1]);
  }

  // count duplicates, sort by count, and return only unique items
  return Object.values(
    returnItems.reduce(
      (acc: { [key: string]: { count: number; name: string } }, item) => {
        if (!acc[item.name]) {
          acc[item.name] = {
            ...item,
            count: 0,
          };
        }
        acc[item.name].count++;
        return acc;
      },
      {}
    )
  )
    .sort((a, b) => b.count - a.count)
    .map((item) => item.name)
    .slice(0, 15);
});

const { search, results, noResults, loadItems } = useVueFuse(
  allFoodItems.value,
  {
    keys: ["name", "categories.name", "description"],
    minMatchCharLength: 3,
    findAllMatches: true,
    location: 0,
    threshold: 0.4,
  }
) as {
  search: Ref<string>;
  results: ComputedRef<FoodItemTs[]>;
  noResults: ComputedRef<boolean>;
  loadItems: (items: FoodItemTs[]) => void;
};

onMounted(() => {
  search.value = route.get("searchTerm") ?? "";
});

watch(search, (searchTerm, oldTerm) => {
  if (searchTerm === oldTerm) {
    return;
  }
  if (searchTerm.length >= 3) {
    // Update URL with search term
    router.push({
      query: {
        searchTerm,
      },
    });
    searchForFood(searchTerm);
  }
});

// Weird VueFuse bug where it doesn't update the results when the items change
// @todo investigate later
watch(allFoodItems.value, () => {
  loadItems(allFoodItems.value);
});

const searchForFood = debounce((searchTerm) => {
  $bus.$emit(eventTypes.search, searchTerm);

  if (results.value.length > resultsLimit.value) {
    return;
  }
  isLoading.value = true;
  searchForFoodViaAPI();
}, 250);

const searchForFoodViaAPI = async () => {
  const request = await fetch(
    `${process.env.VUE_APP_BASE_API_URL}/api/foods?per_page=500&search[term]=${search.value}&scopes[]=withAllMacronutrients&with[]=categories&with[]=foodRegions.seasons&with[]=foodRegions.region.country`
  );
  const response = await request.json();
  if (response.data.length === 0) {
    return searchForFoodViaOpenFoodFactsAPI();
  }
  response.data.forEach((foodItem: FoodItemTs) => {
    store.dispatch("foodItems/addFoodItem", {
      ...foodItem,
      source: "api",
    });
  });
  isLoading.value = false;
};

const searchForFoodViaOpenFoodFactsAPI = async () => {
  const request = await fetch(
    `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${search.value}&search_simple=1&action=process&json=1`
  );
  const response = await request.json();
  response.products.forEach((foodItem: OpenFoodFactsFoodItem) => {
    // Discard food items without kcal
    if (!foodItem.nutriments["energy-kcal_100g"]) {
      return;
    }
    store.dispatch(
      "foodItems/addFoodItem",
      convertOpenFoodFactsFoodItemToFoodItem(foodItem)
    );
  });
  isLoading.value = false;
};
</script>

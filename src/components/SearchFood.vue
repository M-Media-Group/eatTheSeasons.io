<template>
  <div class="grid" v-if="isSignedUp">
    <!-- {{ foodItemsMatchingSearchTerm(filters.searchTerm).length }} -->
    <slot name="header" :search="search">
      <template v-if="hLevel === 1">
        <div class="page-header default">
          <h1>Find food</h1>
        </div>
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
        v-for="food in foodItems"
        :key="food.id"
      ></option>
    </datalist>

    <div v-if="search.length < 3" style="margin-bottom: 3rem">
      Type at least 3 characters to search
    </div>
    <div v-else-if="results.length === 0" :aria-busy="isLoading">
      <div v-if="!isLoading">
        No foods found for <strong>{{ search }}</strong
        >.
      </div>
    </div>
    <div class="grid big-gap search-results" v-else>
      <FoodItem
        v-for="food in results.slice(0, resultsLimit)"
        :id="food.id"
        :src="food.image_url"
        :name="food.name"
        :categories="getFoodCategoriesForFoodItem(food)"
        :isNative="checkIsFoodNativeToCountry(food)"
        :calories="food.kcal"
        :carb="food.carbohydrate"
        :fat="food.fat"
        :protein="food.protein"
        :water="food.water"
        :key="food.id"
        :showAddForm="true"
        :servingSize="food.serving_size"
        v-bind="$attrs"
        ><slot :food="food"></slot
      ></FoodItem>
    </div>
    <div class="main-banner" v-if="!isSignedUp">
      <SignUp />
    </div>
  </div>
  <div v-else>
    <SignUp />
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  defineAsyncComponent,
  reactive,
  computed,
  ref,
  onMounted,
  watch,
  ComputedRef,
  Ref,
} from "vue";
import { mapGetters } from "vuex";

import {
  CategoryName,
  FoodItem as FoodItemTs,
  OpenFoodFactsFoodItem,
} from "@/types/foodItem";
import { debounce, getBestImageUrl } from "@/helpers";
import { useVueFuse } from "vue-fuse";
import { useStore } from "vuex";
import $bus, { eventTypes } from "@/eventBus/events";

export default defineComponent({
  name: "SearchView",

  components: {
    FoodItem: defineAsyncComponent(() => import("@/components/FoodItem.vue")),
    SignUp: defineAsyncComponent(() => import("@/components/SignUp.vue")),
  },

  props: {
    hLevel: {
      type: Number,
      default: 1,
    },
  },

  computed: {
    ...mapGetters({
      isSignedUp: "auth/isSignedUp",
      foodItems: "foodItems/foodItems",
      resultsLimit: "app/resultsLimit",
    }),
  },

  watch: {
    search: {
      handler(searchTerm, oldTerm) {
        if (searchTerm === oldTerm) {
          return;
        }
        if (searchTerm.length > 0) {
          // Update URL with search term
          this.$router.push({
            query: {
              searchTerm,
            },
          });
          $bus.$emit(eventTypes.search, searchTerm);
          if (this.results.length > this.resultsLimit) {
            return;
          }
          this.searchForFood();
        }
      },
    },
  },

  methods: {
    getFoodCategoriesForFoodItem(food: FoodItemTs): CategoryName[] {
      if (!food.categories) {
        return [];
      }
      return food.categories.map((foodCategory) => {
        return foodCategory.name;
      });
    },

    async vueGetBestImageUrl(name: string) {
      return await getBestImageUrl(name);
    },
  },

  setup() {
    const store = useStore();
    const route = new URLSearchParams(window.location.search);

    const isLoading = ref(false);

    // const foodItemsMatchingSearchTerm = computed(
    //   (term) => store.getters["foodItems/foodItemsMatchingSearchTerm"]
    // );

    const filters = computed(() => store.getters["auth/filters"]) as any;

    const sort = reactive({
      order: "asc",
      by: "carbohydrate" as keyof FoodItemTs,
      options: {
        kcal: "kcal",
        name: "name",
        fat: "fat",
        carbohydrate: "carbohydrate",
      },
    });

    const allFoodItems = computed(
      () => store.getters["foodItems/allFoodItems"]
    );

    const items = ref(null) as any;

    const { search, results, noResults } = useVueFuse(items, {
      keys: ["name", "categories.name", "description"],
      minMatchCharLength: 3,
      findAllMatches: true,
      location: 0,
      threshold: 0.4,
    }) as {
      search: Ref<string>;
      results: ComputedRef<FoodItemTs[]>;
      noResults: ComputedRef<boolean>;
    };

    const checkIsFoodNativeToCountry = (food: FoodItemTs) =>
      food.food_regions?.find((foodRegion) => {
        return (
          foodRegion.region.country_code.toLowerCase() ===
          filters.value.country.toLowerCase()
        );
      })?.grows_in_region ?? null;

    onMounted(() => {
      search.value = route.get("searchTerm") ?? "";
    });

    watch(
      allFoodItems.value,
      (newValue) => {
        items.value = Object.values(newValue).filter((food: FoodItemTs) => {
          return (
            (filters.value.showOnlyNative
              ? checkIsFoodNativeToCountry(food)
              : true) &&
            (filters.value.showOnlyWithCaloricInfo
              ? food.kcal && food.kcal > 0
              : true)
          );
        });
      },
      {
        immediate: true,
      }
    );

    const searchForFood = debounce(() => {
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

    const convertOpenFoodFactsFoodItemToFoodItem = (
      foodItem: OpenFoodFactsFoodItem
    ) => {
      // It seems the API sometimes returns a string and sometimes a number, so we need to check it here.
      // @todo confirm that the API does return different types
      const kcal =
        typeof foodItem.nutriments["energy-kcal_100g"] === "string"
          ? parseFloat(foodItem.nutriments["energy-kcal_100g"])
          : foodItem.nutriments["energy-kcal_100g"];
      const carbohydrate =
        typeof foodItem.nutriments.carbohydrates_100g === "string"
          ? parseFloat(foodItem.nutriments.carbohydrates_100g)
          : foodItem.nutriments.carbohydrates_100g;

      return {
        id: parseInt(foodItem.id),
        name: foodItem.product_name,
        description: foodItem.generic_name,
        is_raw: false,
        image_url: foodItem.image_url,
        kcal: kcal,
        water: null,
        protein: parseFloat(foodItem.nutriments.proteins_100g),
        fat: parseFloat(foodItem.nutriments.fat_100g),
        carbohydrate: carbohydrate,
        fiber: parseFloat(foodItem.nutriments.fiber_100g),
        alcohol: null,
        created_at: new Date().toDateString(),
        updated_at: new Date().toDateString(),
        categories: [],
        // categories: foodItem.categories_tags.map((category) => {
        //   return {
        //     id: null,
        //     name: category,
        //     created_at: new Date(),
        //     updated_at: new Date(),
        //   };
        // }),
        food_regions: [],
        serving_size: parseFloat(foodItem.serving_size),
        source: "openfoodfacts",
      } as FoodItemTs;
    };

    return {
      items,
      filters,
      search,
      results,
      noResults,
      sort,
      isLoading,
      searchForFood,
      checkIsFoodNativeToCountry,
    };
  },
});
</script>

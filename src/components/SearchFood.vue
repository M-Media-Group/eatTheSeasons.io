<template>
  <div class="grid" v-if="isSignedUp">
    <!-- {{ foodItemsMatchingSearchTerm(filters.searchTerm).length }} -->
    <slot name="header" :search="search">
      <component :is="'h' + hLevel">
        Find
        <input
          autofocus
          type="text"
          lang="en"
          spellcheck="true"
          v-model.trim="search"
          placeholder="any food"
          required
          minlength="3"
        />
      </component>
    </slot>
    <div v-if="search.length < 3" style="margin-bottom: 3rem">
      Type at least 3 characters to search
    </div>
    <div v-else-if="results.length === 0">
      <div>
        No foods found for <strong>{{ search }}</strong
        >.
      </div>
      This website was created just this week so please bear with us as we add
      more food, months, and regions!
    </div>
    <div class="grid big-gap" v-else>
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
        v-bind="$attrs"
        ><slot :food="food"></slot
      ></FoodItem>
    </div>
    <div
      class="main-banner"
      v-if="
        !isSignedUp &&
        (isOnMobile || filteredAndOrderedFoodItemsInSeasonAndRegion.length > 3)
      "
    >
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
} from "vue";
import { mapGetters, mapActions } from "vuex";

import { CountryCode, FoodItem as FoodItemTs } from "@/types/foodItem";
import { getBestImageUrl } from "@/helpers";
import SignUp from "@/components/SignUp.vue"; // @ is an alias to /src
import axios from "axios";
import { useVueFuse } from "vue-fuse";
import { useStore } from "vuex";

export default defineComponent({
  name: "SearchView",

  components: {
    FoodItem: defineAsyncComponent(() => import("@/components/FoodItem.vue")),
    SignUp,
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
          // eslint-disable-next-line no-undef
          gtag("event", "search", {
            search_term: searchTerm,
          });
          if (this.results.length > 50) {
            return;
          }
          this.searchForFood();
        }
      },
    },
  },

  methods: {
    ...mapActions({
      addFoodItem: "foodItems/addFoodItem",
    }),

    searchForFood() {
      axios
        .get(
          `/api/foods?per_page=500&search[term]=${this.search}&scopes[]=withAllMacronutrients&with[]=categories`
        )
        .then((response) => {
          // For each item, add it addFoodItem
          response.data.data.forEach((foodItem: FoodItemTs) => {
            this.addFoodItem(foodItem);
          });
        });
    },

    checkIsFoodNativeToCountry(food: FoodItemTs): boolean | null {
      return (
        food.food_regions?.find((foodRegion) => {
          return (
            foodRegion.region.country_code.toLowerCase() ===
            this.filters.country.toLowerCase()
          );
        })?.grows_in_region ?? null
      );
    },

    getFoodCategoriesForFoodItem(food: FoodItemTs): string[] {
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

    // const foodItemsMatchingSearchTerm = computed(
    //   (term) => store.getters["foodItems/foodItemsMatchingSearchTerm"]
    // );

    const filters = reactive({
      country: CountryCode.Fr,
      region: "All",
      month: new Date().toLocaleString("en-us", { month: "long" }),
      showOnlyNative: false,
    });

    const sort = reactive({
      order: "asc",
      by: "kcal" as keyof FoodItemTs,
      options: {
        kcal: "kcal",
        name: "name",
        fat: "fat",
        carbohydrate: "carbohydrate",
      },
    });

    const foodItemsMatchingSearchTerm = computed(
      () => store.getters["foodItems/allFoodItems"]
    );

    const items = ref(null) as any;

    const { search, results, noResults } = useVueFuse(items, {
      keys: ["name", "categories.name", "description"],
      minMatchCharLength: 3,
      findAllMatches: true,
      location: 0,
      threshold: 0.3,
    });

    onMounted(() => {
      search.value = route.get("searchTerm") ?? "";
    });

    watch(
      foodItemsMatchingSearchTerm.value,
      (newValue) => {
        items.value = Object.values(newValue);
      },
      {
        immediate: true,
      }
    );

    return {
      items,
      filters,
      search,
      results,
      noResults,
      foodItemsMatchingSearchTerm,
      sort,
    };
  },
});
</script>

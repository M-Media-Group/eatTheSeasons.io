<template>
  <div class="grid" v-if="isSignedUp">
    <h1>
      Find
      <input
        autofocus
        type="text"
        lang="en"
        spellcheck="true"
        v-model="filters.searchTerm"
        placeholder="any food"
      />
    </h1>
    <div v-if="filters.searchTerm.length < 3" style="margin-bottom: 3rem">
      Type at least 3 characters to search
    </div>
    <div
      v-else-if="foodItemsMatchingSearchTerm(filters.searchTerm).length === 0"
    >
      <div>
        No foods found for <strong>{{ filters.searchTerm }}</strong
        >.
      </div>
      This website was created just this week so please bear with us as we add
      more food, months, and regions!
    </div>
    <div class="grid big-gap" v-else>
      <FoodItem
        v-for="food in foodItemsMatchingSearchTerm(filters.searchTerm).slice(
          0,
          resultsLimit
        )"
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
      />
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
import { defineComponent, defineAsyncComponent } from "vue";
import { mapGetters, mapActions } from "vuex";

import { CountryCode, FoodItem as FoodItemTs } from "@/types/foodItem";
import { getBestImageUrl } from "@/helpers";
import SignUp from "@/components/SignUp.vue"; // @ is an alias to /src
import axios from "axios";

export default defineComponent({
  name: "SearchView",

  components: {
    FoodItem: defineAsyncComponent(() => import("@/components/FoodItem.vue")),
    SignUp,
  },

  data() {
    return {
      foundFoodItems: [],
      filters: {
        country: CountryCode.Fr,
        region: "All",
        month: new Date().toLocaleString("en-us", { month: "long" }),
        searchTerm: "",
        showOnlyNative: false,
      },
      sort: {
        order: "asc",
        by: "kcal" as keyof FoodItemTs,
        options: {
          kcal: "kcal",
          name: "name",
          fat: "fat",
          carbohydrate: "carbohydrate",
        },
      },
    };
  },

  mounted() {
    // Set the searchTerm = to the searchTerm from the url
    this.filters.searchTerm = this.$route.query.searchTerm?.toString() || "";
  },

  computed: {
    ...mapGetters({
      isSignedUp: "auth/isSignedUp",
      foodItems: "foodItems/foodItems",
      foodItemsMatchingSearchTerm: "foodItems/foodItemsMatchingSearchTerm",
      resultsLimit: "app/resultsLimit",
    }),
  },

  watch: {
    "filters.searchTerm": {
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
          if (this.foodItemsMatchingSearchTerm(searchTerm).length > 10) {
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
          `/api/foods?per_page=500&search[term]=${this.filters.searchTerm}&scopes[]=withAllMacronutrients`
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
});
</script>

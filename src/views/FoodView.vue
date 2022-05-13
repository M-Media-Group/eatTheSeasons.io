<template>
  <div class="grid">
    <div class="page-header default">
      <h1>
        Eat <MonthSelector v-model="filters.month" /> in
        <CountrySelector v-model="filters.country" />
        ({{ filters.region === "All" ? "all regions" : filters.region }})
      </h1>
      <p v-if="!isSignedUp">
        <router-link to="/sign-up">Sign up</router-link> to see more information
        about each food and seasonality.
      </p>
    </div>
    <div class="main-banner" v-if="!isSignedUp && !isOnMobile">
      <SignUp />
    </div>
    <MlCam
      v-if="isInBeta"
      :seasonalFoodNames="foodItemNamesInSeasonAndRegion"
    />

    <div class="grid big-gap">
      <FoodItem
        v-for="food in filteredAndOrderedFoodItemsInSeasonAndRegion"
        :id="food.id"
        :src="food.image_url"
        :name="food.name"
        :categories="getFoodCategoriesForFoodItem(food)"
        :lastMonth="getLastMonthInARowFromFoodItem(food)"
        :localName="getLocalName(food)"
        :isNative="checkIsFoodNativeToCountry(food)"
        :calories="food.kcal"
        :carb="food.carbohydrate"
        :fat="food.fat"
        :protein="food.protein"
        :water="food.water"
        :key="food.id"
      />
    </div>
    <div v-if="isInBeta">
      <h2>Can you help us with these foods?</h2>
      <p>If you know when these foods are in season, please let us know!</p>
      <FoodItem
        v-for="food in foodItemsWithoutSeasons"
        :id="food.id"
        :src="food.image_url"
        :name="food.name"
        :categories="getFoodCategoriesForFoodItem(food)"
        :isNative="null"
        :calories="food.kcal"
        :carb="food.carbohydrate"
        :fat="food.fat"
        :protein="food.protein"
        :water="food.water"
        :key="food.id"
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
</template>

<script lang="ts">
import { defineComponent, defineAsyncComponent } from "vue";
import FoodItem from "@/components/FoodItem.vue"; // @ is an alias to /src
import MonthSelector from "@/components/MonthSelector.vue";
import CountrySelector from "@/components/CountrySelector.vue";
import { mapGetters, mapActions } from "vuex";

import {
  CountryCode,
  MonthName,
  Category,
  CategoryName,
  FoodItem as FoodItemTs,
} from "@/types/foodItem";
import { QueryParams as QueryParamsType } from "@/types/queryParams";
import { getBestImageUrl } from "@/helpers";
import SignUp from "@/components/SignUp.vue"; // @ is an alias to /src

export default defineComponent({
  name: "FoodView",

  components: {
    FoodItem,
    MonthSelector,
    CountrySelector,
    MlCam: defineAsyncComponent(() => import("@/components/MlCam.vue")),
    SignUp,
  },

  data() {
    return {
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

  computed: {
    ...mapGetters({
      isSignedUp: "auth/isSignedUp",
      foodItems: "foodItems/foodItems",
      foodItemsWithoutSeasons: "foodItems/foodItemsWithoutSeasons",
      eatenFoodItems: "foodItems/eatenFoodItems",
      proteinEaten: "foodItems/proteinEaten",
      fatEaten: "foodItems/fatEaten",
      carbEaten: "foodItems/carbEaten",
      caloriesEaten: "foodItems/caloriesEaten",
      foodItemsMatchingSearchTerm: "foodItems/foodItemsMatchingSearchTerm",
      isInBeta: "app/isInBeta",
      filters: "auth/filters",
    }),

    isOnMobile() {
      return window.innerWidth < 768;
    },

    availableCategories(): CategoryName[] {
      return (
        (this.foodItems as FoodItemTs[])
          .reduce(
            (acc: any, food) =>
              acc.concat(food.categories.map((c: Category) => c.name)),
            []
          )
          // remove duplicates
          .filter(
            (value: any, index: any, self: string | any[]) =>
              self.indexOf(value) === index
          )
      );
    },

    availableRegions(): string[] {
      return this.getAvailableRegionsForCountry(this.filters.country);
    },

    foodItemsInCountry(): FoodItemTs[] {
      return this.getFoodItemsInCountry(this.filters.country);
    },

    foodItemsInRegion(): FoodItemTs[] {
      return this.foodItemsInCountry.filter((foodItem) =>
        foodItem.food_regions?.find(
          (foodRegion) => foodRegion.region.name === this.filters.region
        )
      );
    },

    foodItemsInSeasonAndRegion(): FoodItemTs[] {
      return this.foodItemsInRegion.filter((foodItem) =>
        foodItem.food_regions?.find(
          (foodRegion) =>
            foodRegion.region.name === this.filters.region &&
            foodRegion.seasons.find(
              (season) =>
                season.month_name.toLowerCase() ===
                this.filters.month.toLowerCase()
            )
        )
      );
    },

    orderedFoodItemsInSeasonAndRegion(): FoodItemTs[] {
      const foodItems = this.foodItemsInSeasonAndRegion;
      return foodItems.sort((a, b) =>
        a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1
      );
    },

    foodItemNamesInSeasonAndRegion(): string[] {
      const foodItems = this.orderedFoodItemsInSeasonAndRegion;
      return foodItems.map((food) => food.name);
    },

    filteredAndOrderedFoodItemsInSeasonAndRegion(): FoodItemTs[] {
      const foodItems = this.foodItemsInSeasonAndRegion;
      const filteredFoodItems = foodItems.filter((foodItem) => true); // No filtering here just yet
      // Sort by this.sort.by
      return filteredFoodItems.sort((a, b) => {
        const aValue = a[this.sort.by];
        const bValue = b[this.sort.by];
        if (aValue === null || bValue === null) {
          return this.sort.order === "asc" ? 1 : -1;
        }
        if (aValue > bValue) {
          return this.sort.order === "asc" ? 1 : -1;
        }
        if (aValue < bValue) {
          return this.sort.order === "asc" ? -1 : 1;
        }
        return 0;
      });
    },
  },

  watch: {
    // Watch foodItems immediate
    foodItems: {
      immediate: true,
      handler() {
        this.setDefaultRegion();
      },
    },

    "filters.country": {
      handler(newValue: string, oldValue: string) {
        if (oldValue && newValue.toLowerCase() === oldValue.toLowerCase()) {
          return;
        }
        // Wait for the next tick to get available regions so that availableRegions has been updated
        this.$nextTick(() => {
          this.filters.region = this.availableRegions.includes("All")
            ? "All"
            : this.availableRegions[0];
          this.updateUrlQueryParams();
        });
      },
    },
    "filters.month": {
      handler(newValue: string, oldValue: string) {
        if (newValue.toLowerCase() === oldValue.toLowerCase()) {
          return;
        }
        this.updateUrlQueryParams();
      },
    },
    "$route.query.country": {
      immediate: true,
      handler(country: CountryCode) {
        if (!country || country.toLowerCase() === this.filters.country) {
          return;
        }
        this.filters.country = country.toLowerCase() as CountryCode;
      },
    },
    "$route.query.month": {
      immediate: true,
      handler(month: MonthName) {
        if (!month) {
          return;
        }
        this.filters.month =
          month[0].toUpperCase() + month.slice(1).toLowerCase();
      },
    },
  },

  methods: {
    setDefaultRegion() {
      this.filters.region = this.availableRegions.includes("All")
        ? "All"
        : this.availableRegions[0];
    },

    updateUrlQueryParams() {
      let queryParams = {
        country: this.filters.country,
        month: this.filters.month,
      } as QueryParamsType;

      if (this.isInBeta) {
        queryParams.beta = true;
      }

      this.$router.push({
        query: queryParams as Record<string, any>,
      });
    },

    getLocalName(food: FoodItemTs): string {
      return (
        food.food_regions?.find((foodRegion) => {
          return (
            foodRegion.region.country_code.toLowerCase() ===
            this.filters.country.toLowerCase()
          );
        })?.local_name ?? ""
      );
    },

    getFoodItemsInCountry(country: CountryCode): FoodItemTs[] {
      return (this.foodItems as FoodItemTs[]).filter((food) => {
        return food.food_regions?.find((foodRegion) => {
          return (
            foodRegion.region.country_code.toLowerCase() ===
            country.toLowerCase()
          );
        });
      });
    },

    getAvailableRegionsForCountry(country: CountryCode): string[] {
      return (this.foodItems as FoodItemTs[])
        .filter((food) => {
          return food.food_regions?.find((foodRegion) => {
            return (
              foodRegion.region.country_code.toLowerCase() ===
              country.toLowerCase()
            );
          });
        })
        .map((food) => {
          return (
            food.food_regions?.find((foodRegion) => {
              return (
                foodRegion.region.country_code.toLowerCase() ===
                country.toLowerCase()
              );
            })?.region.name ?? ""
          );
        })
        .filter((region, index, array) => array.indexOf(region) === index);
    },

    getLastMonthInARowFromFoodItem(food: FoodItemTs): MonthName | "" {
      const months = food.food_regions
        .find((foodRegion) => {
          return (
            foodRegion.region.country_code.toLowerCase() ===
            this.filters.country.toLowerCase()
          );
        })
        ?.seasons.map((season) => {
          return season.month_name;
        });
      if (!months) {
        return "";
      }
      return months[months.length - 1];
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

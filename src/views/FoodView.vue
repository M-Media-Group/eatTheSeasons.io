<template>
  <main class="grid">
    <header class="default">
      <h1>
        Eat <MonthSelector v-model="filters.month" /> in
        <CountrySelector v-model="filters.country" />
        ({{
          filters.region
            ? filters.region === "All"
              ? "all regions"
              : filters.region
            : "all regions"
        }})
      </h1>
      <p v-if="!isSignedUp">
        <router-link to="/sign-up">Sign up</router-link> to see more information
        about each food and seasonality.
      </p>
    </header>
    <div class="main-banner" v-if="!isSignedUp && !isOnMobile">
      <SignUp />
    </div>
    <MlCam
      v-if="isInBeta"
      :seasonalFoodNames="foodItemNamesInSeasonAndRegion"
    />

    <FoodItemList
      v-if="allFoodItems.length > 0"
      :foods="allFoodItems"
      :filters="{
        ...filters,
        showOnlyInSeason: true,
      }"
      :sort="{ direction: 'asc', by: 'kcal' }"
    >
      <template #empty>
        <p>
          There's no foods in season in
          <CountrySelector v-model="filters.country" />
          ({{ filters.region === "All" ? "all regions" : filters.region }}) in
          <MonthSelector v-model="filters.month" />.
          <br />
          You can <router-link to="/search">Search</router-link> for any food
          instead.
        </p>
      </template>
    </FoodItemList>
    <div v-else>
      <p>
        There's no foods in season in
        <CountrySelector v-model="filters.country" />
        ({{ filters.region === "All" ? "all regions" : filters.region }}) in
        <MonthSelector v-model="filters.month" />.
      </p>
      <p>
        <router-link to="/search">Search</router-link> for any food you ate to
        get more results.
      </p>
    </div>

    <div v-if="isInBeta">
      <h2>Can you help us with these foods?</h2>
      <p>If you know when these foods are in season, please let us know!</p>
      <FoodItemList :foods="foodItemsWithoutSeasons" :filters="filters" />
    </div>
    <div
      class="main-banner"
      v-if="!isSignedUp && (isOnMobile || allFoodItems.length > 3)"
    >
      <SignUp />
    </div>
  </main>
</template>

<script lang="ts">
import { defineComponent, defineAsyncComponent } from "vue";
import MonthSelector from "@/components/MonthSelector.vue";
import CountrySelector from "@/components/CountrySelector.vue";
import { mapGetters } from "vuex";

import {
  CountryCode,
  MonthName,
  FoodItem as FoodItemTs,
} from "@/types/foodItem";
import { QueryParams as QueryParamsType } from "@/types/queryParams";
import SignUp from "@/components/SignUp.vue"; // @ is an alias to /src
import FoodItemList from "@/components/FoodItemList.vue";

export default defineComponent({
  name: "FoodView",

  components: {
    MonthSelector,
    CountrySelector,
    MlCam: defineAsyncComponent(() => import("@/components/MlCam.vue")),
    SignUp,
    FoodItemList,
  },

  computed: {
    ...mapGetters({
      isSignedUp: "auth/isSignedUp",
      allFoodItems: "foodItems/allFoodItems",
      foodItemsWithoutSeasons: "foodItems/foodItemsWithoutSeasons",
      isInBeta: "app/isInBeta",
      filters: "auth/filters",
    }),

    isOnMobile() {
      return window.innerWidth < 768;
    },

    availableRegions(): string[] {
      return this.getAvailableRegionsForCountry(this.filters.country);
    },

    foodItemsInCountry(): FoodItemTs[] {
      return this.getFoodItemsInCountry(this.filters.country);
    },

    foodItemsInRegion(): FoodItemTs[] {
      return this.foodItemsInCountry.filter(
        (foodItem) =>
          foodItem.food_regions?.findIndex(
            (foodRegion) => foodRegion.region.name === this.filters.region
          ) !== -1
      );
    },

    foodItemsInSeasonAndRegion(): FoodItemTs[] {
      return this.foodItemsInRegion.filter(
        (foodItem) =>
          foodItem.food_regions?.findIndex(
            (foodRegion) =>
              foodRegion.region.name === this.filters.region &&
              foodRegion.seasons.findIndex(
                (season) =>
                  season.month_name.toLowerCase() ===
                  this.filters.month.toLowerCase()
              ) !== -1
          ) !== -1
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
  },

  watch: {
    // Watch foodItems immediate
    allFoodItems: {
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

    getFoodItemsInCountry(country: CountryCode): FoodItemTs[] {
      return (this.allFoodItems as FoodItemTs[]).filter((food) => {
        return food.food_regions?.find((foodRegion) => {
          return (
            foodRegion.region.country_code.toLowerCase() ===
            country.toLowerCase()
          );
        });
      });
    },

    getAvailableRegionsForCountry(country: CountryCode): string[] {
      return (this.allFoodItems as FoodItemTs[])
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
  },
});
</script>

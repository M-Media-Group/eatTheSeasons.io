<template>
  <div class="home">
    <h1>
      Eat
      <span v-if="isInBeta"
        ><input
          type="text"
          placeholder="Anything"
          v-model="filters.searchTerm"
        />
        in
      </span>
      <MonthSelector v-model="filters.month" /> in
      <CountrySelector v-model="filters.country" />
      ({{ filters.region === "All" ? "all regions" : filters.region }})
    </h1>
    <FoodItem
      v-for="food in filteredAndOrderedFoodItemsInSeasonAndRegion"
      :src="food.image_url"
      :name="food.name"
      :categories="getFoodCategoriesForFoodItem(food)"
      :lastMonth="getLastMonthInARowFromFoodItem(food)"
      :localName="getLocalName(food)"
      :isNative="checkIsFoodNativeToCountry(food)"
      :key="food.id"
    />
    <div v-if="filteredAndOrderedFoodItemsInSeasonAndRegion.length === 0">
      <div v-if="filters.searchTerm">
        No foods found for <strong>{{ filters.searchTerm }}</strong
        >.
      </div>
      This website was created just this week so please bear with us as we add
      more food, months, and regions!
    </div>
    <MlCam
      v-if="isInBeta"
      :seasonalFoodNames="foodItemNamesInSeasonAndRegion"
    />
    <small
      >Made with ❤️ by <a href="https://mmediagroup.fr">M Media</a>. Images from
      <a href="https://www.pngplay.com/" target="_blank">PNGPlay</a></small
    >
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import FoodItem from "@/components/FoodItem.vue"; // @ is an alias to /src
import FoodData from "@/data/foodItems.json";
import MonthSelector from "@/components/MonthSelector.vue";
import CountrySelector from "@/components/CountrySelector.vue";
import MlCam from "@/components/MlCam.vue";

import {
  CountryCode,
  MonthName,
  Category,
  CategoryName,
  FoodItem as FoodItemTs,
} from "@/types/foodItem";
import { QueryParams as QueryParamsType } from "@/types/queryParams";
import { getBestImageUrl } from "@/helpers";

export default defineComponent({
  name: "FoodView",

  components: {
    FoodItem,
    MonthSelector,
    CountrySelector,
    MlCam,
  },

  data() {
    return {
      foodItems: FoodData as FoodItemTs[],
      filters: {
        country: CountryCode.Fr,
        region: "All",
        month: new Date().toLocaleString("en-us", { month: "long" }),
        searchTerm: "",
        showOnlyNative: false,
      },
    };
  },

  created() {
    this.filters.region = this.availableRegions.includes("All")
      ? "All"
      : this.availableRegions[0];
  },

  computed: {
    isInBeta() {
      return this.$route.query.beta === "true";
    },

    availableCategories(): CategoryName[] {
      return (
        this.foodItems
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
        foodItem.food_regions.find(
          (foodRegion) => foodRegion.region.name === this.filters.region
        )
      );
    },

    foodItemsInSeasonAndRegion(): FoodItemTs[] {
      return this.foodItemsInRegion.filter((foodItem) =>
        foodItem.food_regions.find(
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
      return foodItems
        .filter((food) => {
          return food.name
            .toLowerCase()
            .includes(this.filters.searchTerm.toLowerCase());
        })
        .sort((a, b) => (a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1));
    },
  },

  watch: {
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
        food.food_regions.find((foodRegion) => {
          return (
            foodRegion.region.country_code.toLowerCase() ===
            this.filters.country.toLowerCase()
          );
        })?.local_name ?? ""
      );
    },

    getFoodItemsInCountry(country: CountryCode): FoodItemTs[] {
      return this.foodItems.filter((food) => {
        return food.food_regions.find((foodRegion) => {
          return (
            foodRegion.region.country_code.toLowerCase() ===
            country.toLowerCase()
          );
        });
      });
    },

    getAvailableRegionsForCountry(country: CountryCode): string[] {
      return this.foodItems
        .filter((food) => {
          return food.food_regions.find((foodRegion) => {
            return (
              foodRegion.region.country_code.toLowerCase() ===
              country.toLowerCase()
            );
          });
        })
        .map((food) => {
          return (
            food.food_regions.find((foodRegion) => {
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

    checkIsFoodNativeToCountry(food: FoodItemTs): boolean {
      return (
        food.food_regions?.find((foodRegion) => {
          return (
            foodRegion.region.country_code.toLowerCase() ===
            this.filters.country.toLowerCase()
          );
        })?.grows_in_region ?? false
      );
    },

    getFoodCategoriesForFoodItem(food: FoodItemTs): string[] {
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
<style lang="scss" scoped>
// Removed the sticky here, realistically users will not be switching months and areas very often so there is no reason to stick this info to the top of the page
// h1 {
//   position: sticky;
//   top: 0px;
//   background: white;
//   padding-top: 8px;
// }
input {
  -webkit-font-smoothing: antialiased;
  color: rgb(44, 62, 80);
  cursor: pointer;
  display: inline-block;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  font-size: 32px;
  font-weight: 700;
  height: 44px;
  position: relative;
  text-align: center;
}
</style>

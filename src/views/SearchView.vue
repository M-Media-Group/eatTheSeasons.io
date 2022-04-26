<template>
  <div class="home" v-if="isSignedUp">
    <h1>
      Find
      <input type="text" v-model="filters.searchTerm" placeholder="any food" />
    </h1>
    <div v-if="foodItemsMatchingSearchTerm(filters.searchTerm).length === 0">
      <div>
        No foods found for <strong>{{ filters.searchTerm }}</strong
        >.
      </div>
      This website was created just this week so please bear with us as we add
      more food, months, and regions!
    </div>
    <template v-else>
      <FoodItem
        v-for="food in foodItemsMatchingSearchTerm(filters.searchTerm).slice(
          0,
          50
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
      />
    </template>
    <div
      class="main-banner"
      v-if="
        !isSignedUp &&
        (isOnMobile || filteredAndOrderedFoodItemsInSeasonAndRegion.length > 3)
      "
    >
      <SignUp />
    </div>
    <small
      >Made with ❤️ by <a href="https://mmediagroup.fr">M Media</a>. Images from
      <a href="https://www.pngplay.com/" target="_blank">PNGPlay</a></small
    >
  </div>
  <div v-else>
    <SignUp />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import FoodItem from "@/components/FoodItem.vue"; // @ is an alias to /src
import { mapGetters, mapActions } from "vuex";

import {
  CountryCode,
  MonthName,
  FoodItem as FoodItemTs,
} from "@/types/foodItem";
import { getBestImageUrl } from "@/helpers";
import SignUp from "@/components/SignUp.vue"; // @ is an alias to /src
import axios from "axios";

export default defineComponent({
  name: "FoodView",

  components: {
    FoodItem,
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
    }),
  },

  watch: {
    filters: {
      handler(newFilters) {
        if (newFilters.searchTerm.length > 0) {
          if (
            this.foodItemsMatchingSearchTerm(newFilters.searchTerm).length > 10
          ) {
            return;
          }
          this.searchForFood();
        }
      },
      deep: true,
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

h2 {
  margin-top: 15rem;
  margin-bottom: 10rem;
}

.main-banner {
  background: #d9ffdc;
  /* color: white; */
  padding-top: 4rem;
  padding-bottom: 3rem;
}
</style>

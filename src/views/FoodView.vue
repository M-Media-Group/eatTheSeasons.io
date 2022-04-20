<template>
  <div class="home">
    <h1>
      Eat
      <span v-if="isInBeta"
        ><input type="text" placeholder="Anything" v-model="searchTerm" />
        in </span
      >
      <MonthSelector v-model="selectedMonth" /> in
      <CountrySelector v-model="selectedCountry" />
      ({{ selectedRegion === "All" ? "all regions" : selectedRegion }})
    </h1>
    <FoodItem
      v-for="food in filteredAndOrderedFoodItemsInSeasonAndRegion"
      :src="food.imgUrl"
      :name="food.name"
      :categories="food.categories"
      :localName="getLocalName(food)"
      :lastMonth="getLastMonthInARowFromFoodItem(food)"
      :key="food.name"
    />
    <div v-if="filteredAndOrderedFoodItemsInSeasonAndRegion.length === 0">
      <div v-if="searchTerm">
        No foods found for <strong>{{ searchTerm }}</strong
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
  Country,
  Month,
  Category,
  FoodItem as FoodItemTs,
} from "@/types/foodItem";
import { QueryParams as QueryParamsType } from "@/types/queryParams";

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
      selectedCountry: Country.Fr,
      selectedRegion: "All",
      selectedMonth: new Date().toLocaleString("en-us", { month: "long" }),
      foodItems: FoodData as FoodItemTs[],
      searchTerm: "",
    };
  },

  computed: {
    isInBeta() {
      return this.$route.query.beta === "true";
    },

    availableCategories(): Category[] {
      return this.foodItems
        .map((food) => food.categories)
        .reduce((acc, cur) => acc.concat(cur), [])
        .filter((category, index, array) => array.indexOf(category) === index);
    },

    availableCountries(): Country[] {
      return this.foodItems.reduce((acc: any, foodItem) => {
        const countries = foodItem.availability.map(
          (availability) => availability.country
        );
        return [...new Set([...acc, ...countries])];
      }, []);
    },

    availableRegions(): string[] {
      return this.getAvailableRegionsForCountry(this.selectedCountry);
    },

    foodItemsInCountry(): FoodItemTs[] {
      return this.foodItems.filter((food) => {
        return food.availability.find((availability) => {
          return availability.country === this.selectedCountry;
        });
      });
    },

    foodItemsInRegion(): FoodItemTs[] {
      return this.foodItems.filter((food) => {
        return food.availability
          .find((availability) => {
            return availability.country === this.selectedCountry;
          })
          ?.regions.find((region) => {
            return region.name === this.selectedRegion;
          });
      });
    },

    foodItemsInSeasonAndRegion(): FoodItemTs[] {
      return this.foodItems.filter((food) => {
        return food.availability
          .find((availability) => {
            return availability.country === this.selectedCountry;
          })
          ?.regions.find((region) => {
            return region.name === this.selectedRegion;
          })
          ?.months.find((month) => {
            return month === this.selectedMonth;
          });
      });
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
            .includes(this.searchTerm.toLowerCase());
        })
        .sort((a, b) => (a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1));
    },
  },

  watch: {
    selectedCountry: {
      immediate: true,

      handler(newValue: string, oldValue: string) {
        if (oldValue && newValue.toLowerCase() === oldValue.toLowerCase()) {
          return;
        }

        // Wait for the next tick to get available regions so that availableRegions has been updated
        this.$nextTick(() => {
          this.selectedRegion = this.availableRegions.includes("All")
            ? "All"
            : this.availableRegions[0];
          this.updateUrlQueryParams();
        });
      },
    },

    selectedMonth(newValue: string, oldValue: string) {
      if (newValue.toLowerCase() === oldValue.toLowerCase()) {
        return;
      }
      this.updateUrlQueryParams();
    },

    "$route.query.country": {
      immediate: true,
      deep: true,
      handler(country: Country) {
        if (!country || country.toLowerCase() === this.selectedCountry) {
          return;
        }
        this.selectedCountry = country.toLowerCase() as Country;
      },
    },

    "$route.query.month": {
      immediate: true,
      deep: true,
      handler(month: Month) {
        if (!month) {
          return;
        }
        this.selectedMonth =
          month[0].toUpperCase() + month.slice(1).toLowerCase();
      },
    },
  },

  methods: {
    updateUrlQueryParams() {
      let queryParams = {
        country: this.selectedCountry,
        month: this.selectedMonth,
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
        food.availability.find((availability) => {
          return (
            availability.country.toLowerCase() ===
            this.selectedCountry.toLowerCase()
          );
        })?.localFoodItemName ?? ""
      );
    },

    getAvailableRegionsForCountry(country: Country): string[] {
      return (
        this.foodItems
          ?.filter((food) => {
            return food.availability.find((availability) => {
              return availability.country === country;
            });
          })
          ?.map((food) => {
            return food.availability
              .find((availability) => {
                return availability.country === country;
              })
              ?.regions.map((region) => {
                return region.name;
              });
          })
          ?.reduce((acc: any, cur) => acc.concat(cur), [])
          ?.filter(
            (region: string, index: number, array: string[]) =>
              array.indexOf(region) === index
          ) ?? ["All"]
      );
    },

    getLastMonthInARowFromFoodItem(food: FoodItemTs): Month | "" {
      const months = food.availability
        .find((availability) => {
          return (
            availability.country.toLowerCase() ===
            this.selectedCountry.toLowerCase()
          );
        })
        ?.regions.find((region) => {
          return (
            region.name.toLowerCase() === this.selectedRegion.toLowerCase()
          );
        })?.months;
      if (!months) {
        return "";
      }
      return months[months.length - 1];
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

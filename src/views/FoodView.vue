<template>
  <div class="home">
    <h1>
      Eat <MonthSelector v-model="selectedMonth" /> in
      <CountrySelector v-model="selectedCountry" />
      ({{ selectedRegion === "All" ? "all regions" : selectedRegion }})
    </h1>
    <FoodItem
      v-for="food in orderedFoodItemsInSeasonAndRegion"
      :src="food.imgUrl"
      :msg="food.name"
      :categories="food.categories"
      :localName="getLocalName(food)"
      :lastMonth="getLastMonthInARowFromFoodItem(food)"
      :key="food.name"
    />
    <div v-if="orderedFoodItemsInSeasonAndRegion.length === 0">
      This website was created just this week so please bear with us as we add
      more food, months, and regions!
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import FoodItem from "@/components/FoodItem.vue"; // @ is an alias to /src
import FoodData from "@/data/foodItems.json";
import MonthSelector from "@/components/MonthSelector.vue";
import CountrySelector from "@/components/CountrySelector.vue";
import {
  Country,
  Month,
  Category,
  FoodItem as FoodItemTs,
} from "@/types/foodItem";

export default defineComponent({
  name: "FoodView",

  components: {
    FoodItem,
    MonthSelector,
    CountrySelector,
  },

  data() {
    return {
      selectedCountry: Country.Fr,
      selectedRegion: "All",
      selectedMonth: new Date().toLocaleString("en-us", { month: "long" }),
      foodItems: FoodData as FoodItemTs[],
    };
  },

  computed: {
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

    foodItemsInRegion(): FoodItemTs[] {
      return this.foodItems.filter((food) => {
        return (
          food.availability.find((availability) => {
            return availability.country === this.selectedCountry;
          }) &&
          food.availability
            .find((availability) => {
              return availability.country === this.selectedCountry;
            })
            ?.regions.find((region) => {
              return region.name === this.selectedRegion;
            })
        );
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
  },

  watch: {
    selectedCountry(newValue: string, oldValue: string) {
      if (newValue.toLowerCase() === oldValue.toLowerCase()) {
        return;
      }
      this.selectedRegion = "All";
      this.updateUrlQueryParams();
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
      this.$router.push({
        query: {
          country: this.selectedCountry,
          month: this.selectedMonth,
        },
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

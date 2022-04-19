<template>
  <div class="home">
    <h1>
      Eat <MonthSelector v-model="selectedMonth" /> in
      <CountrySelector
        v-model="selectedCountry"
        :availableCountries="availableCountries"
      />
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
      This website was just created today so please bear with us as we add more
      food, months, and regions!
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import FoodItem from "@/components/FoodItem.vue"; // @ is an alias to /src
import FoodData from "@/data/foodItems.json";
import MonthSelector from "@/components/MonthSelector.vue";
import CountrySelector from "@/components/CountrySelector.vue";

export default defineComponent({
  name: "FoodView",

  components: {
    FoodItem,
    MonthSelector,
    CountrySelector,
  },

  data() {
    return {
      selectedCountry: "fr",
      selectedRegion: "All",
      selectedMonth: new Date().toLocaleString("en-us", { month: "long" }),
      foodItems: FoodData,
    };
  },

  computed: {
    availableCategories(): string[] {
      return this.foodItems
        .map((food) => food.categories)
        .reduce((acc, cur) => acc.concat(cur), [])
        .filter((category, index, array) => array.indexOf(category) === index);
    },

    availableCountries(): string[] {
      return this.foodItems.reduce(
        (acc: any, foodItem: { availability: any[] }) => {
          const countries = foodItem.availability.map(
            (availability: { country: any }) => availability.country
          );
          return [...new Set([...acc, ...countries])];
        },
        []
      );
    },

    foodItemsInRegion(): Record<string, any>[] {
      return this.foodItems.filter((food: { availability: any[] }) => {
        return (
          food.availability.find((availability: { country: string }) => {
            return availability.country === this.selectedCountry;
          }) &&
          food.availability
            .find((availability: { country: string }) => {
              return availability.country === this.selectedCountry;
            })
            ?.regions.find((region: { name: string }) => {
              return region.name === this.selectedRegion;
            })
        );
      });
    },

    foodItemsInSeasonAndRegion(): Record<string, any>[] {
      return this.foodItems.filter((food: { availability: any[] }) => {
        return food.availability
          .find((availability: { country: string }) => {
            return availability.country === this.selectedCountry;
          })
          ?.regions.find((region: { name: string }) => {
            return region.name === this.selectedRegion;
          })
          .months.find((month: string) => {
            return month === this.selectedMonth;
          });
      });
    },

    orderedFoodItemsInSeasonAndRegion(): Record<string, any>[] {
      const foodItems = this.foodItemsInSeasonAndRegion;
      return foodItems.sort((a, b) =>
        a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1
      );
    },
  },

  methods: {
    changeCountry(country: string) {
      this.selectedCountry = country;
    },

    changeRegion(region: string) {
      this.selectedRegion = region;
    },

    changeMonth(month: string) {
      this.selectedMonth = month;
    },

    getLocalName(food: { availability: any[] }) {
      return food.availability.find((availability: { country: string }) => {
        return (
          availability.country.toLowerCase() ===
          this.selectedCountry.toLowerCase()
        );
      }).localFoodItemName;
    },

    getLastMonthInARowFromFoodItem(food: { availability: any[] }) {
      const months = food.availability
        .find((availability: { country: string }) => {
          return (
            availability.country.toLowerCase() ===
            this.selectedCountry.toLowerCase()
          );
        })
        .regions.find((region: { name: string }) => {
          return (
            region.name.toLowerCase() === this.selectedRegion.toLowerCase()
          );
        }).months;
      return months[months.length - 1];
    },
  },
});
</script>

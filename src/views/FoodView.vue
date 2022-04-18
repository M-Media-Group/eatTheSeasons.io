<template>
  <div class="home">
    <h1>
      Eat {{ selectedMonth }} in {{ selectedCountry.toUpperCase() }} ({{
        selectedRegion === "All" ? "all regions" : selectedRegion
      }})
    </h1>
    <FoodItem
      v-for="food in foodItemsInSeasonAndRegion"
      :src="food.imgUrl"
      :msg="food.name"
      :categories="food.categories"
      :localName="getLocalName(food)"
      :key="food.name"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import FoodItem from "@/components/FoodItem.vue"; // @ is an alias to /src
import FoodData from "@/data/foodItems.json";

export default defineComponent({
  name: "FoodView",

  components: {
    FoodItem,
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
            .regions.find((region: { name: string }) => {
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
          .regions.find((region: { name: string }) => {
            return region.name === this.selectedRegion;
          })
          .months.find((month: string) => {
            return month === this.selectedMonth;
          });
      });
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
  },
});
</script>

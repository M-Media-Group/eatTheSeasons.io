<template>
  <div>
    Goal 1000/kcal:
    <NutrientInformation :protein="40" :carb="40" :fat="20" />
    <div style="margin-top: 3rem"></div>
    Your progress {{ caloriesEaten }}/1000 kcal:
    <NutrientInformation
      v-if="
        isSignedUp && carbEaten !== 0 && fatEaten !== 0 && proteinEaten !== 0
      "
      :protein="proteinEaten"
      :carb="carbEaten"
      :fat="fatEaten"
    />
    <div style="margin-top: 3rem">
      You ate {{ eatenFoodItems.length }} food items today
      <div v-for="food in eatenFoodItems" :key="food.id">
        <div @click="deleteEatenFoodItem(food.eaten_id)">
          Eaten {{ food.grams }}g of {{ food.name }} on {{ food.date }}
        </div>
      </div>
    </div>
    <hr style="margin-top: 3rem" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { Category, MonthName } from "@/types/foodItem";
import type { PropType } from "vue";
import NutrientInformation from "./NutrientInformation.vue";
import { mapGetters, mapActions } from "vuex";

export default defineComponent({
  name: "HealthTracker",
  components: {
    NutrientInformation,
  },
  props: {
    id: Number,
    name: String,
    src: String,
    calories: Number,
    carb: Number,
    fat: Number,
    protein: Number,
    water: Number,
    categories: {
      type: Array as PropType<Category[]>,
      default: () => [],
    },
    localName: String,
    isNative: Boolean || null,
    lastMonth: {
      type: String as PropType<MonthName>,
      default: "",
      required: false,
    },
  },
  data() {
    return {
      amount: 0,
    };
  },
  computed: {
    ...mapGetters({
      isSignedUp: "auth/isSignedUp",
      allFoodItems: "foodItems/allFoodItems",
      eatenFoodItems: "foodItems/eatenFoodItemsToday",
      caloriesEaten: "foodItems/caloriesEaten",
      carbEaten: "foodItems/carbEaten",
      fatEaten: "foodItems/fatEaten",
      proteinEaten: "foodItems/proteinEaten",
    }),
  },
  methods: {
    ...mapActions({
      addFoodItem: "foodItems/addEatenFoodItem",
      deleteEatenFoodItem: "foodItems/deleteEatenFoodItem",
    }),
  },
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
img {
  height: 55vh;
  object-fit: scale-down;
  max-width: 100%;
}
.food-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-bottom: 15vh;
}
h2 {
  margin-bottom: 0;
  > span {
    font-weight: 400;
  }
}
p {
  margin-top: 0;
  margin-bottom: 8px;
}
.badge {
  padding: 4px 8px;
  border-radius: 8px;
  background: rgb(70, 70, 70);
  color: white;
}
</style>

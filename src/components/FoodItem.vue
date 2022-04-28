<template>
  <div class="food-item grid" :id="name.replace(' ', '-')">
    <img v-if="src" :src="src" :alt="'A picture of a ' + name" />
    <div>
      <h2>
        {{ name }}
        <span v-if="localName"> ({{ localName }}) </span>
      </h2>
      <p v-if="calories || lastMonth">
        <span v-if="calories">{{ calories }} kcal/100g · </span>
        <span v-if="lastMonth">Available to end of </span>
        {{ lastMonth }}
      </p>
    </div>
    <div
      class="badges"
      v-if="
        timesConsumedToday ||
        (isNative !== null && !isNative) ||
        helpsReachGoals
      "
    >
      <router-link
        v-if="timesConsumedToday"
        to="/progress"
        custom
        v-slot="{ navigate }"
      >
        <div
          class="badge"
          style="background: rgb(77 71 245); cursor: pointer"
          @click="navigate"
        >
          Eaten {{ timesConsumedToday }} times today
        </div>
      </router-link>
      <div class="badge" v-if="isNative !== null && !isNative">Not native</div>
      <div class="badge" v-if="helpsReachGoals" style="background: #1e8429">
        Good for your nutritional needs today
      </div>
    </div>
    <NutrientInformation
      v-if="
        isSignedUp &&
        carb !== null &&
        fat !== null &&
        protein !== null &&
        water !== null
      "
      :protein="protein"
      :carb="carb"
      :fat="fat"
      :water="water"
    />
    <form
      v-if="isSignedUp && id && supportsIndexedDB && showAddForm"
      @submit.prevent
    >
      <label>
        <input
          type="number"
          min="0"
          v-model.number="amount"
          placeholder="Amount"
        />
        <span>g</span>
      </label>
      <button
        type="submit"
        class="submit-button"
        @click="
          addFoodItem({ food_id: id, grams: amount });
          amount = 0;
          $emit('addedConsumedFoodItem', { food_id: id, grams: amount });
        "
      >
        Add to eaten foods
      </button>
      <template v-if="amount > 0">
        <hr />
        Protein eaten: {{ (protein / 100) * amount }}g
        <br />
        Carbohydrates eaten: {{ (carb / 100) * amount }}g
        <br />
        Fat eaten: {{ (fat / 100) * amount }}g
        <br />
        Calories eaten: {{ ((calories / 100) * amount).toFixed(2) }}kcal
      </template>
    </form>
    <!-- <p v-if="categories">
      {{ categories.join(", ") }}
    </p> -->
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { Category, FoodItem, MonthName } from "@/types/foodItem";
import type { PropType } from "vue";
import NutrientInformation from "./NutrientInformation.vue";
import { mapGetters, mapActions } from "vuex";
import { consumedItem } from "@/types/consumedItem";

export default defineComponent({
  name: "FoodItem",
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
    showAddForm: Boolean,
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
      supportsIndexedDB: "app/supportsIndexedDB",
      foodItemsThatHelpReachGoals: "foodItems/foodItemsThatHelpReachGoals",
      consumedItemsToday: "consumedItems/allConsumedItemsToday",
    }),
    helpsReachGoals() {
      if (
        !this.isSignedUp ||
        !this.supportsIndexedDB ||
        !this.id ||
        !this.foodItemsThatHelpReachGoals
      ) {
        return false;
      }
      return (
        this.foodItemsThatHelpReachGoals.findIndex(
          (foodItem: FoodItem) => foodItem.id === this.id
        ) !== -1
      );
    },
    timesConsumedToday() {
      if (
        !this.isSignedUp ||
        !this.supportsIndexedDB ||
        !this.id ||
        !this.consumedItemsToday
      ) {
        return null;
      }
      // Count amount of times this foodId appears in consumedItemsToday
      return (
        this.consumedItemsToday.filter(
          (foodItem: consumedItem) => foodItem.food_id === this.id
        ).length ?? 0
      );
    },
  },
  methods: {
    ...mapActions({
      addFoodItem: "consumedItems/addConsumedItem",
    }),
  },
});
</script>

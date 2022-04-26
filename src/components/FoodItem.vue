<template>
  <div class="food-item" :id="name.replace(' ', '-')">
    <img v-if="src" :src="src" :alt="'A picture of a ' + name" />
    <h2>
      {{ name }}
      <span v-if="localName"> ({{ localName }}) </span>
    </h2>
    <p>
      <span v-if="calories">{{ calories }} kcal/100g · </span>
      <span v-if="lastMonth">Available to end of </span>
      {{ lastMonth }}
    </p>
    <div class="badge" v-if="isNative !== null && !isNative">Not native</div>
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
      v-if="isSignedUp && id && supportsIndexedDB"
      @submit.prevent
      style="margin-top: 3rem"
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
        @click="addFoodItem({ food_id: id, grams: amount })"
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
        Calories eaten: {{ (calories / 100) * amount }}kcal
      </template>
    </form>
    <!-- <p v-if="categories">
      {{ categories.join(", ") }}
    </p> -->
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { Category, MonthName } from "@/types/foodItem";
import type { PropType } from "vue";
import NutrientInformation from "./NutrientInformation.vue";
import { mapGetters, mapActions } from "vuex";

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
    }),
    supportsIndexedDB() {
      return process.env.VUE_APP_USE_INDEXED_DB == "true";
    },
  },
  methods: {
    ...mapActions({
      addFoodItem: "foodItems/addEatenFoodItem",
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
form {
  display: grid;
  grid-auto-flow: column;
  gap: 8px;
}
</style>

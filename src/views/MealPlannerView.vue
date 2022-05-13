<template>
  <div class="grid big-gap">
    <h1>Meal Planner</h1>

    <SignUp v-if="!isSignedUp" />
    <template v-else>
      <div class="grid columns">
        <div style="min-width: 50vw">
          <div class="grid">
            <h2>{{ Math.round(caloriesEaten) }} kilocalories planned</h2>

            <div class="grid small-gap">
              <p>
                The macronutrient distribution; goals compared to planned meal:
              </p>
              <div class="grid small-gap">
                <NutrientInformation
                  :protein="goals.proteinPercent"
                  :carb="goals.carbsPercent"
                  :fat="goals.fatPercent"
                  :showText="false"
                  style="margin-bottom: 0; opacity: 0.5"
                />
                <NutrientInformation
                  v-if="
                    isSignedUp &&
                    (carbEaten !== 0 || fatEaten !== 0 || proteinEaten !== 0)
                  "
                  :protein="proteinEaten"
                  :carb="carbEaten"
                  :fat="fatEaten"
                />
              </div>
            </div>
          </div>
          <ConsumedFoodItemTable
            :consumedItems="items"
            :expand="false"
            :showAddToIosShortcut="false"
            :useConsumedItemsInVuex="false"
            @deleteConsumedItem="deleteConsumedItem($event)"
          />
          <button v-if="items.length > 0" @click="addItemsToConsumedFoods()">
            Move to consumed foods
          </button>
        </div>

        <SearchFood :showAddForm="false" :showImage="false" :hLevel="2">
          <template v-slot:default="{ food }">
            <form @submit.prevent="addItem(food, grams)">
              <label
                ><input
                  type="number"
                  inputmode="numeric"
                  pattern="[0-9]*"
                  min="1"
                  v-model.number="grams"
                  placeholder="Amount in grams"
                  required
                /><span>g</span></label
              ><button type="submit" class="submit-button">
                Add to meal planner
              </button>
            </form>
          </template>
        </SearchFood>
      </div>
    </template>
  </div>
</template>

<script lang="ts">
import { defineComponent, defineAsyncComponent } from "vue";
import ConsumedFoodItemTable from "@/components/ConsumedFoodItemTable.vue";
import { mapGetters } from "vuex";
import { consumedItem } from "@/types/consumedItem";
import NutrientInformation from "@/components/NutrientInformation.vue";
import SearchFood from "@/components/SearchFood.vue";
import { FoodItem } from "@/types/foodItem";

export default defineComponent({
  name: "ProgressView",
  components: {
    ConsumedFoodItemTable,
    NutrientInformation,
    SearchFood,
    SignUp: defineAsyncComponent({
      loader: () => import("@/components/SignUp.vue"),
    }),
  },
  data() {
    return {
      items: [] as consumedItem[],
      grams: 0,
    };
  },
  computed: {
    ...mapGetters({
      isSignedUp: "auth/isSignedUp",
      goals: "auth/goals",
    }),
    proteinEaten(): number {
      return this.items.reduce((acc, item) => acc + (item.protein ?? 0), 0);
    },
    carbEaten(): number {
      return this.items.reduce(
        (acc, item) => acc + (item.carbohydrate ?? 0),
        0
      );
    },
    fatEaten(): number {
      return this.items.reduce((acc, item) => acc + (item.fat ?? 0), 0);
    },
    caloriesEaten(): number {
      return this.items.reduce((acc, item) => acc + (item.kcal ?? 0), 0);
    },
  },
  methods: {
    addItem(item: FoodItem, amount = 100) {
      const newItem = {
        ...item,
        grams: amount,
        food_id: item.id,
      } as consumedItem;

      newItem.kcal = ((item.kcal ?? 0) / 100) * amount;
      newItem.protein = ((item.protein ?? 0) / 100) * amount;
      newItem.carbohydrate = ((item.carbohydrate ?? 0) / 100) * amount;
      newItem.fat = ((item.fat ?? 0) / 100) * amount;
      newItem.fiber = ((item.fiber ?? 0) / 100) * amount;
      newItem.alcohol = ((item.alcohol ?? 0) / 100) * amount;

      // Assign a new ID to the item
      newItem.id = this.items.length;

      newItem.created_at = new Date().toISOString();

      this.items.push(newItem);

      this.grams = 0;
    },
    deleteConsumedItem(item: number) {
      console.log(item);
      this.items = this.items.filter((i) => i.id !== item);
    },
    addItemsToConsumedFoods() {
      this.items.forEach((item) => {
        this.$store.dispatch("consumedItems/addConsumedItem", item);
      });
      this.items = [];
    },
  },
});
</script>

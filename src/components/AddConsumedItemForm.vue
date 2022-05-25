<template>
  <form
    @submit.prevent="addConsumedFoodItem(form)"
    style="grid-auto-columns: 1fr"
  >
    <label>
      <input type="text" v-model="form.name" placeholder="Name" />
    </label>
    <label>
      <input type="text" v-model="form.description" placeholder="Description" />
    </label>
    <label>
      <input
        type="number"
        inputmode="numeric"
        pattern="[0-9]*"
        min="0"
        v-model.number="form.kcal"
        placeholder="kcal"
      />
    </label>
    <label>
      <input
        type="number"
        inputmode="numeric"
        pattern="[0-9]*"
        min="0"
        v-model.number="form.protein"
        placeholder="protein"
      />
    </label>
    <label>
      <input
        type="number"
        inputmode="numeric"
        pattern="[0-9]*"
        min="0"
        v-model.number="form.carbohydrate"
        placeholder="carb"
      />
    </label>
    <label>
      <input
        type="number"
        inputmode="numeric"
        pattern="[0-9]*"
        min="0"
        v-model.number="form.fat"
        placeholder="fat"
      />
    </label>
    <label>
      <input
        type="number"
        inputmode="numeric"
        pattern="[0-9]*"
        min="0"
        v-model.number="form.water"
        placeholder="water"
      />
    </label>
    <label>
      <input
        type="number"
        inputmode="numeric"
        pattern="[0-9]*"
        min="0"
        v-model.number="form.alcohol"
        placeholder="alcohol"
      />
    </label>

    <label>
      <input
        type="number"
        inputmode="numeric"
        pattern="[0-9]*"
        min="0"
        v-model.number="form.grams"
        placeholder="Grams"
      />
      <span>g</span>
    </label>
    <button type="submit">Add</button>
  </form>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { mapGetters, mapActions } from "vuex";
import { consumedItem } from "@/types/consumedItem";

export default defineComponent({
  name: "AddConsumedItemForm",
  components: {},
  // props: {},
  data() {
    return {
      form: {
        name: "",
        description: "",
        food_id: null,
        kcal: null,
        protein: null,
        carbohydrate: null,
        fat: null,
        water: null,
        alcohol: null,
        fiber: null,
        grams: 0,
      } as consumedItem,
    };
  },
  computed: {
    ...mapGetters({
      getConsumedItems: "consumedItems/allConsumedItemsToday",
      foodItems: "foodItems/allFoodItems",
    }),
  },
  methods: {
    ...mapActions({
      addConsumedFoodItem: "consumedItems/addConsumedItem",
      deleteConsumedItem: "consumedItems/deleteConsumedItem",
    }),
    resetForm() {
      Object.keys(this.form).forEach((key) => {
        (this as any).form[key] = null;
      });
    },
    copyToFormFromFoodItemId(foodItemId: string) {
      const foodItem = this.getConsumedItems.find(
        (item: { id: string }) => item.id === foodItemId
      );
      if (foodItem) {
        if (foodItem.food_id) {
          // Set each key to null in th form
          this.resetForm();
          this.form.name = "";
          this.form.description = "";
          this.form.food_id = foodItem.food_id;
          this.form.grams = foodItem.grams;
          console.log(this.form);
        } else {
          this.form = foodItem;
        }
      }
    },
  },
});
</script>

<template>
  <div>
    <table>
      <thead>
        <tr>
          <th>Time</th>
          <th>Food</th>
          <th>Amount</th>
          <template v-if="expand">
            <th>Protein</th>
            <th>Carbohydrates</th>
            <th>Fat</th>
          </template>
          <th>Calories</th>

          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in consumedItems" :key="item.id">
          <td>
            {{ new Date(item.created_at).toLocaleTimeString().slice(0, -3) }}
          </td>
          <td>
            <router-link
              v-if="item.food_id"
              :to="`/search?searchTerm=${item.name}#${item.name}`"
            >
              {{ item.name }}
            </router-link>
            <template v-else>
              {{ item.name }}
            </template>
          </td>
          <td>{{ item.grams }}g</td>
          <template v-if="expand">
            <td v-if="expand">{{ item.protein?.toFixed(2) }}g</td>
            <td v-if="expand">{{ item.carbohydrate?.toFixed(2) }}g</td>
            <td v-if="expand">{{ item.fat?.toFixed(2) }}g</td>
          </template>
          <td>{{ item.kcal?.toFixed(expand ? 2 : 0) }}kcal</td>
          <td>
            <button @click="deleteConsumedItem(item.id)">Remove</button>
            <!-- <button @click="copyToFormFromFoodItemId(item.id)">Copy</button> -->
          </td>
        </tr>
        <!-- And a total row -->
        <tr>
          <td>Total</td>
          <td>{{ total.grams }}g</td>
          <template v-if="expand">
            <td v-if="expand">{{ total.protein }}g</td>
            <td v-if="expand">{{ total.carbohydrate }}g</td>
            <td v-if="expand">{{ total.fat }}g</td>
          </template>
          <td>{{ total.kcal }}kcal</td>
          <td></td>
          <td></td>
        </tr>

        <tr>
          <td :colspan="expand ? 9 : 5">
            <details>
              <summary>Add a custom item</summary>
              <AddConsumedItemForm />
            </details>
          </td>
        </tr>

        <!-- <div v-for="item in getConsumedItems" :key="item.id">
            <div>
              Ate {{ item.grams }}g of {{ item.name }} on
              {{ new Date(item.created_at).toLocaleTimeString() }}
              <small @click="deleteEatenFoodItem(item.id)">Remove</small>
            </div>
          </div> -->
      </tbody>
    </table>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { mapActions } from "vuex";
import { consumedItem } from "@/types/consumedItem";
import AddConsumedItemForm from "./AddConsumedItemForm.vue";
import type { PropType } from "vue";

export default defineComponent({
  name: "ConsumedFoodItemTable",
  props: {
    consumedItems: {
      type: Array as PropType<consumedItem[]>,
      required: true,
    },
    expand: {
      type: Boolean,
      default: false,
    },
  },

  components: {
    AddConsumedItemForm,
  },

  computed: {
    total(): Record<string, string> {
      return {
        grams: this.consumedItems
          .reduce((total, item) => total + item.grams, 0)
          .toFixed(2),
        protein: this.consumedItems
          .reduce((total, item) => total + (item.protein ?? 0), 0)
          .toFixed(2),
        carbohydrate: this.consumedItems
          .reduce((total, item) => total + (item.carbohydrate ?? 0), 0)
          .toFixed(2),
        fat: this.consumedItems
          .reduce((total, item) => total + (item.fat ?? 0), 0)
          .toFixed(2),
        kcal: this.consumedItems
          .reduce((total, item) => total + (item.kcal ?? 0), 0)
          .toFixed(2),
      };
    },
  },

  methods: {
    ...mapActions({
      addConsumedFoodItem: "consumedItems/addConsumedItem",
      deleteConsumedItem: "consumedItems/deleteConsumedItem",
    }),
  },
});
</script>

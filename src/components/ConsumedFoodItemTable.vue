<template>
  <div style="width: 100%; overflow-x: scroll">
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
        <tr v-for="item in groupedConsumedItems" :key="item.id">
          <td>
            <time>{{
              new Date(item.created_at).toLocaleTimeString().slice(0, -3)
            }}</time>
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
            <button @click="removeItem(item.id)">Remove</button>
            <!-- <button @click="copyToFormFromFoodItemId(item.id)">Copy</button> -->
          </td>
        </tr>
        <!-- And a total row -->
        <tr>
          <td></td>
          <td>{{ consumedItems.length }} total</td>
          <td>{{ total.grams }}g</td>
          <template v-if="expand">
            <td v-if="expand">{{ total.protein }}g</td>
            <td v-if="expand">{{ total.carbohydrate }}g</td>
            <td v-if="expand">{{ total.fat }}g</td>
          </template>
          <td>{{ total.kcal }}kcal</td>
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

    <small v-if="showAddToIosShortcut && supportsIosShortcut">
      <a
        @click="copyToiOSShortcut()"
        href.prevent="shortcuts://run-shortcut?name=Log Food Intake"
        >Copy to Health with iOS Shortcut</a
      >
    </small>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { mapGetters, mapActions } from "vuex";
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
    showAddToIosShortcut: {
      type: Boolean,
      default: true,
    },
    useConsumedItemsInVuex: {
      type: Boolean,
      default: true,
    },
    showGroupedByFood: {
      type: Boolean,
      default: true,
    },
  },

  components: {
    AddConsumedItemForm,
  },

  computed: {
    ...mapGetters({
      activeDate: "consumedItems/activeDate",
    }),
    groupedConsumedItems(): consumedItem[] {
      if (this.expand) {
        return this.consumedItems;
      }
      const items = this.consumedItems.map((o) => ({ ...o }));
      return items
        .sort((a: consumedItem, b: consumedItem) =>
          (a.id ?? 0) < (b.id ?? 0) ? 1 : -1
        )
        .reduce((acc: consumedItem[], item: consumedItem) => {
          const existingItem = acc.find(
            (i: consumedItem) => i.name === item.name
          ) as consumedItem | undefined;
          if (existingItem) {
            existingItem.grams += item.grams;

            existingItem.protein
              ? (existingItem.protein += item.protein ?? 0)
              : 0;

            existingItem.carbohydrate
              ? (existingItem.carbohydrate += item.carbohydrate ?? 0)
              : 0;

            existingItem.fat ? (existingItem.fat += item.fat ?? 0) : 0;

            existingItem.kcal ? (existingItem.kcal += item.kcal ?? 0) : 0;

            // existingItem.created_at = item.created_at;
          } else {
            acc.push(item);
          }
          return acc;
        }, []);
    },
    total(): Record<string, string> {
      return {
        grams: this.groupedConsumedItems
          .reduce((total, item) => total + item.grams, 0)
          .toFixed(2),
        protein: this.groupedConsumedItems
          .reduce((total, item) => total + (item.protein ?? 0), 0)
          .toFixed(2),
        carbohydrate: this.groupedConsumedItems
          .reduce((total, item) => total + (item.carbohydrate ?? 0), 0)
          .toFixed(2),
        fat: this.groupedConsumedItems
          .reduce((total, item) => total + (item.fat ?? 0), 0)
          .toFixed(2),
        kcal: this.groupedConsumedItems
          .reduce((total, item) => total + (item.kcal ?? 0), 0)
          .toFixed(2),
      };
    },
    supportsIosShortcut(): boolean {
      return (
        !!navigator.clipboard &&
        !!navigator.userAgent.match(/safari/i) &&
        this.consumedItems.length > 0
      );
      // window.navigator.standalone === true ||
      // window.matchMedia("(display-mode: standalone)").matches === true
    },
  },

  methods: {
    ...mapActions({
      deleteConsumedItem: "consumedItems/deleteConsumedItem",
    }),
    copyToiOSShortcut() {
      const textToWrite = {
        ...this.total,
        date: this.activeDate,
      };

      navigator.clipboard.writeText(JSON.stringify(textToWrite)).then(
        function () {
          /* clipboard successfully set */
          // open the URL shortcuts://run-shortcut?name=Log Food Intake
          window.open(
            "shortcuts://run-shortcut?name=Log Food Intake&input=clipboard"
          );
        },
        function () {
          alert("Failed to copy data");
          /* clipboard write failed */
        }
      );
    },
    removeItem(id: string) {
      if (this.useConsumedItemsInVuex) {
        this.deleteConsumedItem(id);
      }
      this.$emit("deleteConsumedItem", id);
    },
  },
});
</script>

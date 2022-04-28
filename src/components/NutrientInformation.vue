<template>
  <div class="bar">
    <small
      v-for="field in fields"
      :key="field"
      :class="field"
      :style="'width: ' + ($props[field] / total) * 100 + '%'"
    >
      <template v-if="showText">
        {{ Math.round(($props[field] / total) * 100) }}% <br />
        {{ field }}s
      </template>
    </small>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "FoodItem",
  props: {
    calories: Number,
    carb: Number,
    fat: Number,
    protein: Number,
    showText: {
      type: Boolean,
      default: true,
    },
    // water: Number,
  },
  data() {
    return {
      fields: ["protein", "carb", "fat"],
    };
  },
  computed: {
    total() {
      return this.fields.reduce((acc: any, field: any) => acc + this[field], 0);
    },
  },
});
</script>

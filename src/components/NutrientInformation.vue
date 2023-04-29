<template>
  <div class="bar">
    <meter
      v-for="field in fields"
      :key="field"
      :class="field"
      :style="'width: ' + ($props[field] / total) * 100 + '%'"
      min="0"
      max="100"
      low="33"
      high="66"
      :value="Math.round(($props[field] / total) * 100)"
    >
      <template v-if="showText">
        {{ Math.round(($props[field] / total) * 100) }}% <br />
        {{ field }}s
      </template>
    </meter>
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

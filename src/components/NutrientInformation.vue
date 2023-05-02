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

<script lang="ts" setup>
import { computed, defineProps } from "vue";
const fields = ["protein", "carb", "fat"] as const;
const props = defineProps({
  calories: Number,
  carb: Number,
  fat: Number,
  protein: Number,
  showText: {
    type: Boolean,
    default: false,
  },
});
const total = computed(() => {
  return fields.reduce((acc, field) => acc + (props[field] || 0), 0);
});
</script>

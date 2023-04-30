<template>
  <div class="dropdown-selector" @click="isOpenDropdown = !isOpenDropdown">
    {{ modelValue }}
    <Transition name="fade">
      <ul v-if="isOpenDropdown">
        <li
          v-for="month in months"
          :key="month"
          @click="$emit('update:modelValue', month)"
        >
          {{ month }}
        </li>
      </ul>
    </Transition>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { MonthName } from "@/types/foodItem";
import type { PropType } from "vue";

export default defineComponent({
  name: "MonthSelector",
  props: {
    modelValue: {
      type: String as PropType<MonthName>,
      required: true,
    },
  },
  data() {
    return {
      isOpenDropdown: false,
      months: MonthName,
    };
  },
});
</script>

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
<script lang="ts" setup>
import { MonthName } from "@/types/foodItem";
import { computed, ref, defineProps, PropType } from "vue";
defineProps({
  modelValue: {
    type: String as PropType<MonthName>,
    required: true,
  },
});

const isOpenDropdown = ref(false);
const months = computed(() => MonthName);
</script>

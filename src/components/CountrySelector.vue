<template>
  <div
    class="dropdown-selector"
    @click="isOpenDropdown = !isOpenDropdown"
    role="button"
  >
    {{ getCountryName(modelValue) }}
    <Transition name="fade">
      <ul v-if="isOpenDropdown">
        <li
          v-for="country in availableCountries"
          :key="country"
          @click="$emit('update:modelValue', country)"
        >
          {{ getCountryName(country) }}
        </li>
      </ul>
    </Transition>
  </div>
</template>

<script lang="ts" setup>
import { defineProps, ref } from "vue";
import { CountryCode } from "@/types/foodItem";
import type { PropType } from "vue";

defineProps({
  modelValue: {
    type: String as PropType<CountryCode>,
    required: true,
  },
});

const isOpenDropdown = ref(false);
const availableCountries = CountryCode;

const getCountryName = (code: CountryCode): string => {
  /* Possibly need polyfill for DisplayNames */
  const countryNames = new (Intl as any).DisplayNames(["en"], {
    type: "region",
  });
  return countryNames.of(code.toUpperCase());
};
</script>

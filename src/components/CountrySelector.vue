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

<script lang="ts">
import { defineComponent } from "vue";
import { CountryCode } from "@/types/foodItem";
import type { PropType } from "vue";

export default defineComponent({
  name: "CountrySelector",
  props: {
    modelValue: {
      type: String as PropType<CountryCode>,
      required: true,
    },
  },
  data() {
    return {
      isOpenDropdown: false,
      availableCountries: CountryCode,
    };
  },
  methods: {
    getCountryName(code: CountryCode): string {
      /* Possibly need polyfill for DisplayNames */
      const countryNames = new (Intl as any).DisplayNames(["en"], {
        type: "region",
      });
      return countryNames.of(code.toUpperCase());
    },
  },
});
</script>

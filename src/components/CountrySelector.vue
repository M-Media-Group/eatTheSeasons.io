<template>
  <div class="dropdown-selector" @click="isOpenDropdown = !isOpenDropdown">
    {{ getCountryName(modelValue) }}
    <ul v-if="isOpenDropdown">
      <li
        v-for="country in availableCountries"
        :key="country"
        @click="$emit('update:modelValue', country)"
      >
        {{ getCountryName(country) }}
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { Country } from "@/types/foodItem";
import type { PropType } from "vue";

export default defineComponent({
  name: "CountrySelector",
  props: {
    modelValue: {
      type: String as PropType<Country>,
      required: true,
    },
  },
  data() {
    return {
      isOpenDropdown: false,
      availableCountries: Country,
    };
  },
  methods: {
    getCountryName(code: Country): string {
      /* Possibly need polyfill for DisplayNames */
      const regionNames = new (Intl as any).DisplayNames(["en"], {
        type: "region",
      });
      return regionNames.of(code.toUpperCase());
    },
  },
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.dropdown-selector {
  display: inline-block;
  text-decoration: underline;
  position: relative;
  cursor: pointer;
  > ul {
    position: absolute;
    background: white;
    border-radius: 16px;
    padding: 16px;
    box-shadow: 0px 8px 8px rgba(0, 0, 0, 0.1);
    list-style: none;
    top: 8px;
    left: -50%;
    > li {
      &:hover {
        cursor: pointer;
        text-decoration: underline;
      }
    }
  }
}
</style>

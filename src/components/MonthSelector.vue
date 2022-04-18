<template>
  <div class="dropdown-selector" @click="isOpenDropdown = !isOpenDropdown">
    {{ modelValue }}
    <ul v-if="isOpenDropdown">
      <li
        v-for="month in months"
        :key="month"
        @click="$emit('update:modelValue', month)"
      >
        {{ month }}
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "MonthSelector",
  props: {
    modelValue: String,
  },
  data() {
    return {
      isOpenDropdown: false,
      months: [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ],
    };
  },
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.dropdown-selector {
  display: inline-block;
  text-decoration: underline;
  position: relative;
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

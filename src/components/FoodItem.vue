<template>
  <div class="food-item" :id="name.replace(' ', '-')">
    <img :src="src" :alt="'A picture of a ' + name" />
    <h2>
      {{ name }}
      <span v-if="localName"> ({{ localName }}) </span>
    </h2>

    <p>
      <span>Available to end of </span>
      {{ lastMonth }}
    </p>
    <!-- <p v-if="categories">
      {{ categories.join(", ") }}
    </p> -->
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { Category, Month } from "@/types/foodItem";
import type { PropType } from "vue";

export default defineComponent({
  name: "FoodItem",
  props: {
    name: String,
    src: String,
    categories: {
      type: Array as PropType<Category[]>,
      default: () => [],
    },
    localName: String,
    lastMonth: {
      type: String as PropType<Month>,
      default: "",
      required: true,
    },
  },
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
img {
  height: 55vh;
  object-fit: scale-down;
  max-width: 100%;
}
.food-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-bottom: 3rem;
}
h2 {
  margin-bottom: 0;
  > span {
    font-weight: 400;
  }
}
p {
  margin-top: 0;
}
</style>

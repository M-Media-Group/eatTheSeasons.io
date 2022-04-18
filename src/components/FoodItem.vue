<template>
  <div class="food-item">
    <img :src="src" />
    <h2>
      {{ msg }}
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

export default defineComponent({
  name: "FoodItem",
  props: {
    msg: String,
    src: String,
    categories: Array,
    localName: String,
    lastMonth: String,
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

<template>
  <div class="food-item">
    <img :src="src" />
    <h2>{{ msg }}</h2>
    <p v-if="localName">
      {{ localName }}
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
  },
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
img {
  height: 70vh;
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
}
p {
  margin-top: 0;
}
</style>

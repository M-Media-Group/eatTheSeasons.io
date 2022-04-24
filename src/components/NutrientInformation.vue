<template>
  <div class="bar">
    <small
      v-for="field in fields"
      :key="field"
      :class="field"
      :style="'width: ' + ($props[field] / total) * 100 + '%'"
    >
      {{ Math.round(($props[field] / total) * 100) }}% <br />
      {{ field }}s
    </small>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "FoodItem",
  props: {
    calories: Number,
    carb: Number,
    fat: Number,
    protein: Number,
    // water: Number,
  },
  data() {
    return {
      fields: ["protein", "carb", "fat"],
    };
  },
  computed: {
    total() {
      return this.fields.reduce((acc: any, field: any) => acc + this[field], 0);
    },
  },
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.bar {
  background: black;
  width: 300px;
  max-width: 100%;
  min-width: 50vw;
  margin: 0 auto;
  height: 8px;
  border-radius: 8px;
  display: flex;
  margin-top: 8px;
}

.bar > small {
  width: 25%;
  height: 100%;
  position: relative;
  padding-top: 8px;
  box-sizing: border-box;
}

.bar > small::after {
  // content: attr(class);
  position: absolute;
  top: 16px;
  text-align: center;
  left: 35%;
}

.protein {
  background: rgb(139, 137, 255);
}

.carb {
  background: green;
}

.water {
  background: rgb(0, 179, 255);
}

.fat {
  background: brown;
}
</style>

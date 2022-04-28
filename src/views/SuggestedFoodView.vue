<template>
  <div class="grid">
    <h1>Suggested food</h1>
    <SuggestedFoodItems />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import SuggestedFoodItems from "@/components/SuggestedFoodItems.vue"; // @ is an alias to /src

export default defineComponent({
  name: "SuggestedFoodView",

  components: {
    SuggestedFoodItems,
  },
});
</script>

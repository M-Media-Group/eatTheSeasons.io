<template>
  <div class="grid">
    <div class="page-header default">
      <h1>Food for you</h1>
      <p>Suggested foods based on your current nutrition goals.</p>
    </div>
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

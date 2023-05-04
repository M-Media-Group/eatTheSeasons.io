<template>
  <main class="grid">
    <header class="default">
      <h1>Food for you</h1>
      <p>Suggested foods based on your current nutrition goals.</p>
    </header>
    <SuggestedFoodItems />
  </main>
</template>

<script lang="ts" setup>
import SuggestedFoodItems from "@/components/SuggestedFoodItems.vue"; // @ is an alias to /src
</script>

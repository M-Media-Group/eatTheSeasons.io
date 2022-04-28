<template>
  <div class="home">
    <HealthTracker />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import HealthTracker from "@/components/HealthTracker.vue"; // @ is an alias to /src

export default defineComponent({
  name: "ProgressView",
  components: {
    HealthTracker,
  },
});
</script>

<template>
  <div>
    <h1>Settings</h1>
    <h2>Your goals</h2>
    <GoalSettings />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import GoalSettings from "@/components/GoalSettings.vue"; // @ is an alias to /src

export default defineComponent({
  name: "SettingsView",
  components: {
    GoalSettings,
  },
});
</script>

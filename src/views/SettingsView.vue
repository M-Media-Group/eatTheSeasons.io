<template>
  <div>
    <div class="page-header default">
      <h1>Settings</h1>
    </div>
    <div class="grid big-gap default-padding">
      <div class="grid">
        <h2>Your goals</h2>
        <GoalSettings />
      </div>
      <div class="grid">
        <h2>Install the app</h2>
        <InstallApp />
      </div>
      <div class="grid">
        <h2>iOS Shortcut</h2>
        <p>
          The iOS Shortcut allows you to copy your nutritional intake from this
          app directly into Health. Install the Shortcut on your iPhone to get
          started.
        </p>
        <a
          href="https://www.icloud.com/shortcuts/a0c928d5389c4fa991da591685e79796"
          target="_blank"
        >
          Get the iOS Shortcut
        </a>
        <p>
          When you've got the Shortcut installed, you can copy the data from the
          <router-link to="/progress">Progress</router-link> page into Health.
        </p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import GoalSettings from "@/components/GoalSettings.vue"; // @ is an alias to /src
import InstallApp from "@/components/InstallApp.vue";

export default defineComponent({
  name: "SettingsView",
  components: {
    GoalSettings,
    InstallApp,
  },
});
</script>

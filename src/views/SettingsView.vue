<template>
  <main class="grid">
    <header class="default">
      <h1>Settings</h1>
    </header>
    <div class="grid big-gap default-padding">
      <div class="grid">
        <h2>Your goals</h2>
        <GoalSettings />
      </div>
      <div class="grid">
        <h2>Tailor the app</h2>
        <FilterSettings />
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
  </main>
</template>

<script lang="ts" setup>
import GoalSettings from "@/components/GoalSettings.vue"; // @ is an alias to /src
import InstallApp from "@/components/InstallApp.vue";
import FilterSettings from "@/components/FilterSettings.vue";
</script>

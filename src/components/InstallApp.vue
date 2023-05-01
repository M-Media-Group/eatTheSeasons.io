<template>
  <div class="grid" v-if="!isRunningInStandalone">
    <p v-if="currentBrowser === 'Safari'">
      Install this app on iOS by tapping the "Share" icon, then choose "Add to
      homescreen".
    </p>
    <p v-else>
      Follow the native prompts provided by your device to install this app
    </p>
    <p>
      Installing this app will make sure that all your personal data is stored
      securely on your device.
    </p>
  </div>
  <div v-else class="grid">
    <p>Looks like you've already installed the app :)!</p>
  </div>
</template>

<script lang="ts" setup>
import { useDevice } from "@/composables/useDevice";

const { isRunningInStandalone, currentBrowser } = useDevice();
</script>

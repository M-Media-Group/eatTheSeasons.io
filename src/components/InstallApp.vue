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

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "InstallApp",
  computed: {
    isRunningInStandalone() {
      return (
        (window.navigator as any).standalone === true ||
        window.matchMedia("(display-mode: standalone)").matches
      );
    },
    currentBrowser() {
      let userAgent = navigator.userAgent;
      let browserName;

      if (userAgent.match(/chrome|chromium|crios/i)) {
        browserName = "Chrome";
      } else if (userAgent.match(/firefox|fxios/i)) {
        browserName = "Firefox";
      } else if (userAgent.match(/safari/i)) {
        browserName = "Safari";
      } else if (userAgent.match(/opr\//i)) {
        browserName = "Opera";
      } else if (userAgent.match(/edg/i)) {
        browserName = "Edge";
      } else {
        browserName = "No browser detection";
      }
      return browserName;
    },
  },
  methods: {
    async openShare() {
      if ((navigator as any).canShare) {
        navigator
          .share()
          .then(() => console.log("Share was successful."))
          .catch((error) => console.log("Sharing failed", error));
      } else {
        console.log(`Your system doesn't support sharing.`);
      }
    },
  },
});
</script>

<template>
  <div class="home">
    <SignUp v-if="!isSignedUp" />
    <HealthTracker v-else />
  </div>
</template>

<script lang="ts">
import { defineComponent, defineAsyncComponent } from "vue";
import HealthTracker from "@/components/HealthTracker.vue"; // @ is an alias to /src
import { mapGetters } from "vuex";

export default defineComponent({
  name: "ProgressView",
  components: {
    HealthTracker,
    SignUp: defineAsyncComponent({
      loader: () => import("@/components/SignUp.vue"),
    }),
  },
  computed: {
    ...mapGetters({
      isSignedUp: "auth/isSignedUp",
    }),
  },
});
</script>

<template>
  <main class="grid">
    <SignUp v-if="!isSignedUp" />
    <HealthTracker v-else />
  </main>
</template>

<script lang="ts" setup>
import { defineAsyncComponent, computed } from "vue";
import HealthTracker from "@/components/HealthTracker.vue"; // @ is an alias to /src
import { useStore } from "vuex";

const SignUp = defineAsyncComponent(() => import("@/components/SignUp.vue"));

const store = useStore();

const isSignedUp = computed(() => store.getters["auth/isSignedUp"]);
</script>

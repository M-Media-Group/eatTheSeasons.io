<template>
  <main class="grid" v-if="isSignedUp">
    <SearchFood />
  </main>
  <div v-else>
    <SignUp />
  </div>
</template>

<script lang="ts" setup>
import { computed } from "vue";
import { useStore } from "vuex";

import SignUp from "@/components/SignUp.vue"; // @ is an alias to /src

import SearchFood from "@/components/SearchFood.vue";

const store = useStore();

const isSignedUp = computed(() => store.getters["auth/isSignedUp"]);
</script>

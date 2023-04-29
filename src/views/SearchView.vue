<template>
  <main class="grid" v-if="isSignedUp">
    <SearchFood />
  </main>
  <div v-else>
    <SignUp />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { mapGetters } from "vuex";

import SignUp from "@/components/SignUp.vue"; // @ is an alias to /src

import SearchFood from "@/components/SearchFood.vue";

export default defineComponent({
  name: "SearchView",

  components: {
    SignUp,
    SearchFood,
  },
  computed: {
    ...mapGetters({
      isSignedUp: "auth/isSignedUp",
    }),
  },
});
</script>

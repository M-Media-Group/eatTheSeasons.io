<template>
  <nav>
    <h1 class="logo-text">
      <router-link to="/"
        >Eat the Seasons <span v-if="isInBeta">(beta)</span></router-link
      >
    </h1>
    <div>
      <template v-if="isSignedUp">
        <router-link to="/search">Search</router-link> ·
        <router-link v-if="supportsIndexedDB" to="/progress"
          >Progress</router-link
        >
        ·
        <router-link v-if="supportsIndexedDB" to="/suggested-food"
          >Suggested</router-link
        >
      </template>
      <router-link v-else to="/sign-up">Sign up</router-link>
    </div>
  </nav>
  <router-view />
  <div style="margin-top: 5rem">
    <small>
      <router-link v-if="supportsIndexedDB" to="/settings"
        >Settings</router-link
      >
      · <router-link to="/about">About</router-link> · Made with ❤️ by
      <a href="https://mmediagroup.fr">M Media</a> · Images from
      <a href="https://www.pngplay.com/" target="_blank">PNGPlay</a></small
    >
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { mapGetters, mapActions } from "vuex";

export default defineComponent({
  computed: {
    ...mapGetters({
      isSignedUp: "auth/isSignedUp",
      isInBeta: "app/isInBeta",
      supportsIndexedDB: "app/supportsIndexedDB",
    }),
  },
  created() {
    // deleteIndexedDB();
    this.fetchFoodItems();
    this.fetchConsumedItems();
  },
  methods: {
    ...mapActions({
      fetchFoodItems: "foodItems/fetchFoodItems",
      fetchConsumedItems: "consumedItems/fetchConsumedItems",
    }),
  },
});
</script>

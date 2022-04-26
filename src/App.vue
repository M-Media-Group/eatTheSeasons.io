<template>
  <nav>
    <h1 class="logo-text"><router-link to="/">Eat the Seasons</router-link></h1>
    <div>
      <template v-if="isSignedUp">
        <router-link to="/about">About</router-link> ·
        <router-link v-if="supportsIndexedDB" to="/progress"
          >Progress</router-link
        >
      </template>
      <router-link v-else to="/sign-up">Sign up</router-link>
    </div>
  </nav>
  <router-view />
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { mapGetters, mapActions } from "vuex";
import { deleteIndexedDB } from "./helpers";

export default defineComponent({
  computed: {
    ...mapGetters({
      isSignedUp: "auth/isSignedUp",
    }),
    supportsIndexedDB() {
      return process.env.VUE_APP_USE_INDEXED_DB == "true";
    },
  },
  created() {
    // deleteIndexedDB();
    this.fetchFoodItems();
  },
  methods: {
    ...mapActions({
      fetchFoodItems: "foodItems/fetchFoodItems",
    }),
  },
});
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
.logo-text {
  font-family: Herculanum;
  margin: 0;
}
nav {
  padding: 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #1e8429;
    }
  }
}
</style>

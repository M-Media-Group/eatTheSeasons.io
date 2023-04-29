<template>
  <nav
    :style="{
      background:
        caloriesEaten > goals.calories + goals.calorieGoalTolerance
          ? '#C3453F'
          : '',
    }"
  >
    <h1 class="logo-text">
      <router-link to="/"
        >Eat.Ninja<span v-if="isInBeta"> (beta)</span></router-link
      >
    </h1>
    <div>
      <template v-if="isSignedUp">
        <burger-menu></burger-menu>
      </template>
      <router-link v-else to="/sign-up">Sign up</router-link>
    </div>
  </nav>
  <router-view v-slot="{ Component }">
    <transition name="fade">
      <component :is="Component" />
    </transition>
  </router-view>
  <footer>
    <small>
      <router-link v-if="supportsIndexedDB" to="/settings"
        >Settings</router-link
      >
      · <router-link to="/about">About</router-link> · Made with ❤️ by
      <a href="https://mmediagroup.fr">M Media</a> · Images from
      <a href="https://www.pngplay.com/" target="_blank">PNGPlay</a></small
    >
  </footer>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { mapGetters, mapActions } from "vuex";
import BurgerMenu from "./components/BurgerMenu.vue";

export default defineComponent({
  components: {
    BurgerMenu,
  },
  computed: {
    ...mapGetters({
      isSignedUp: "auth/isSignedUp",
      isInBeta: "app/isInBeta",
      supportsIndexedDB: "app/supportsIndexedDB",
      caloriesEaten: "consumedItems/kcalConsumedToday",

      goals: "auth/goals",
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

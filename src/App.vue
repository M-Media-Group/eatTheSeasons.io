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
    <transition name="fade" mode="out-in">
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
      <a href="https://www.pngplay.com/" target="_blank">PNGPlay</a> · Open food
      data from
      <a href="https://world.openfoodfacts.org" target="_blank"
        >OpenFoodFacts</a
      ></small
    >
  </footer>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { mapGetters, mapActions } from "vuex";
import BurgerMenu from "./components/BurgerMenu.vue";
import { createIndexedDB } from "./helpers";
import $bus, { eventTypes } from "@/eventBus/events";

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
    createIndexedDB();
    this.fetchFoodItems();
    this.fetchConsumedItems();
    this.fetchDislikedItemIds();

    this.registerVisibilityListener();
    this.registerVisibilityHandler();
  },
  methods: {
    ...mapActions({
      fetchFoodItems: "foodItems/fetchFoodItems",
      fetchConsumedItems: "consumedItems/fetchConsumedItems",
      fetchDislikedItemIds: "consumedItems/fetchDislikedItemIds",
    }),

    // Register a visibility listener to call store.dispatch("consumedItems/setDate"); and the events app_became_visible and app_became_hidden in the event bus
    registerVisibilityListener() {
      const visibilityChange = () => {
        if (document.visibilityState === "visible") {
          this.$store.dispatch("consumedItems/setDate");
          $bus.$emit(eventTypes.app_became_visible);
        } else {
          $bus.$emit(eventTypes.app_became_hidden);
        }
      };
      document.addEventListener("visibilitychange", visibilityChange);
    },

    // Register the handling of the event bus events app_became_visible and app_became_hidden to call store.dispatch("consumedItems/setDate");
    // @todo, consider moving to somewhere else
    registerVisibilityHandler() {
      $bus.$on(eventTypes.app_became_visible, () => {
        this.$store.dispatch("consumedItems/setDate");
      });
    },
  },
});
</script>

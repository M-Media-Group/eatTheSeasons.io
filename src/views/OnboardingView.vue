<template>
  <div class="grid">
    <div v-if="step === 0">
      <h1>Welcome!</h1>
      <img
        src="https://freepngimg.com/thumb/fruit/174250-and-fresh-vegetables-fruits-download-hq.png"
        alt="Fresh Fruits And Vegetables"
      />
      <p>Thanks for signing up to this beta release of the food tracker.</p>
      <b>Press "next" to get set up on the platform.</b>
    </div>
    <template v-else-if="step === 1">
      <div>
        <h1>Set up your goals</h1>
        <p>
          You'll have 5 meals a day: breakfast, a morning snack, lunch, an
          afternoon snack, and dinner.
        </p>
        <p>
          Choose your goals and targets for any given day. You can change these
          later in the settings.
        </p>
      </div>
      <GoalSettings />
    </template>

    <template v-else-if="step === 2">
      <div class="grid">
        <div>
          <h1>You're done! Here's your meal schedule for the day.</h1>
          <p>
            Great job! You're all set and ready to go - add your first food item
            to get started. Below you'll see your meal schedule.
          </p>
        </div>
        <MealTimes />
        <router-link class="submit-button" to="/search"
          ><button class="submit-button">
            Add your first food to the tracker
          </button></router-link
        >
      </div>
    </template>

    <button class="submit-button" v-if="step < 2" @click="step++">Next</button>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import GoalSettings from "@/components/GoalSettings.vue"; // @ is an alias to /src
import MealTimes from "@/components/MealTimes.vue"; // @ is an alias to /src

export default defineComponent({
  name: "SettingsView",
  components: {
    GoalSettings,
    MealTimes,
  },
  data() {
    return {
      step: 0,
    };
  },
});
</script>

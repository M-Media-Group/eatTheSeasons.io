<template>
  <form style="max-width: 600px">
    <label>
      <input type="number" v-model.number="caloricGoal" />
      kcal
    </label>
    <label>
      <input type="number" v-model.number="proteinPercent" />
      % protein
    </label>
    <label>
      <input type="number" v-model.number="carbPercent" />
      % carbohydrates
    </label>
    <label>
      <input type="number" v-model.number="fatPercent" />
      % fat
    </label>
  </form>
  <form style="max-width: 600px; display: block">
    <label style="width: 100%">
      <input type="text" v-model="firstMealTime" />
      first meal time
    </label>
    <label style="width: 100%">
      <input type="number" v-model.number="mealTimeSeparationInMinutes" />
      meal time seperation (in minutes)
    </label>
  </form>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "HealthTracker",
  components: {},
  props: {},

  computed: {
    caloricGoal: {
      get() {
        return this.$store.state.auth.goals.calories;
      },
      set(value: number) {
        const goals = this.$store.state.auth.goals;
        goals.calories = value;
        this.$store.dispatch("auth/setGoals", goals);
      },
    },

    proteinPercent: {
      get() {
        return this.$store.state.auth.goals.proteinPercent;
      },
      set(value: number) {
        // if (value + this.carbPercent + this.fatPercent !== 100) {
        //   return;
        // }
        const goals = this.$store.state.auth.goals;
        goals.proteinPercent = value;
        this.$store.dispatch("auth/setGoals", goals);
      },
    },

    carbPercent: {
      get() {
        return this.$store.state.auth.goals.carbsPercent;
      },
      set(value: number) {
        // If the total is not 100%, return early
        // if (value + this.fatPercent + this.proteinPercent !== 100) {
        //   return;
        // }
        const goals = this.$store.state.auth.goals;
        goals.carbsPercent = value;
        this.$store.dispatch("auth/setGoals", goals);
      },
    },

    fatPercent: {
      get() {
        return this.$store.state.auth.goals.fatPercent;
      },
      set(value: number) {
        // if (value + this.carbPercent + this.proteinPercent !== 100) {
        //   return;
        // }
        const goals = this.$store.state.auth.goals;
        goals.fatPercent = value;
        this.$store.dispatch("auth/setGoals", goals);
      },
    },

    firstMealTime: {
      get() {
        return this.$store.state.auth.goals.firstMealTime;
      },
      set(value: string) {
        const goals = this.$store.state.auth.goals;
        goals.firstMealTime = value;
        this.$store.dispatch("auth/setGoals", goals);
      },
    },

    mealTimeSeparationInMinutes: {
      get() {
        return this.$store.state.auth.goals.mealTimeSeparationInMinutes;
      },
      set(value: number) {
        const goals = this.$store.state.auth.goals;
        goals.mealTimeSeparationInMinutes = value;
        this.$store.dispatch("auth/setGoals", goals);
      },
    },
  },
});
</script>

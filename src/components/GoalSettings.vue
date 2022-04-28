<template>
  <form style="max-width: 600px" class="grid">
    <label>
      <input type="number" v-model.number="caloricGoal" />
      target kilocalories per day
    </label>
    <hr />
    <div
      class="presets grid"
      style="text-justify: left; grid-auto-flow: column"
    >
      <!-- Radio inputs of weight loss, maintain, gain -->

      <label>
        <input type="radio" name="preset" v-model="preset" value="loss" />
        <span>Lose weight</span>
      </label>
      <label>
        <input type="radio" name="preset" v-model="preset" value="maintain" />
        <span>Maintain weight</span>
      </label>

      <label>
        <input type="radio" name="preset" v-model="preset" value="gain" />
        <span>Gain weight</span>
      </label>

      <label>
        <input type="radio" name="preset" v-model="preset" value="custom" />
        <span>Custom</span>
      </label>
    </div>
    <template v-if="preset === 'custom'">
      <label>
        <input type="number" v-model.number="proteinPercent" />
        % proteins
      </label>
      <label>
        <input type="number" v-model.number="carbPercent" />
        % carbohydrates
      </label>
      <label>
        <input type="number" v-model.number="fatPercent" />
        % fats
      </label>
    </template>
    <hr />
    <label style="width: 100%">
      <input type="text" v-model="firstMealTime" />
      first meal time
    </label>
    <label style="width: 100%">
      <input type="number" v-model.number="mealTimeSeparationInMinutes" />
      average time between meals/snacks (in minutes)
    </label>
  </form>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "GoalSettings",
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

    preset: {
      get() {
        if (
          this.$store.state.auth.goals.proteinPercent === 45 &&
          this.$store.state.auth.goals.carbsPercent === 20 &&
          this.$store.state.auth.goals.fatPercent === 35
        ) {
          return "loss";
        } else if (
          this.$store.state.auth.goals.proteinPercent === 30 &&
          this.$store.state.auth.goals.carbsPercent === 50 &&
          this.$store.state.auth.goals.fatPercent === 20
        ) {
          return "gain";
        } else if (
          this.$store.state.auth.goals.proteinPercent === 30 &&
          this.$store.state.auth.goals.carbsPercent === 40 &&
          this.$store.state.auth.goals.fatPercent === 30
        ) {
          return "maintain";
        } else {
          return "custom";
        }
      },
      set(value: string) {
        const goals = this.$store.state.auth.goals;
        if (value === "custom") {
          goals.proteinPercent = 33;
          goals.carbsPercent = 34;
          goals.fatPercent = 33;
        } else if (value === "loss") {
          goals.proteinPercent = 45;
          goals.carbsPercent = 20;
          goals.fatPercent = 35;
        } else if (value === "gain") {
          goals.proteinPercent = 30;
          goals.carbsPercent = 50;
          goals.fatPercent = 20;
        } else if (value === "maintain") {
          goals.proteinPercent = 30;
          goals.carbsPercent = 40;
          goals.fatPercent = 30;
        }
        this.$store.dispatch("auth/setGoals", goals);
      },
    },
  },
});
</script>

<template>
  <form style="max-width: max-content" class="grid">
    <label>
      <input
        type="number"
        inputmode="numeric"
        pattern="[0-9]*"
        v-model.number="caloricGoal"
        list="kcal-list"
      />
      target kilocalories per day
      <datalist id="kcal-list">
        <option value="1000" />
        <option value="1500" />
        <option value="2000" />
      </datalist>
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
        <input
          type="number"
          inputmode="numeric"
          pattern="[0-9]*"
          v-model.number="proteinPercent"
        />
        % proteins
      </label>
      <label>
        <input
          type="number"
          inputmode="numeric"
          pattern="[0-9]*"
          v-model.number="carbPercent"
        />
        % carbohydrates
      </label>
      <label>
        <input
          type="number"
          inputmode="numeric"
          pattern="[0-9]*"
          v-model.number="fatPercent"
        />
        % fats
      </label>
    </template>
    <NutrientInformation
      v-else
      :carb="carbPercent"
      :fat="fatPercent"
      :protein="proteinPercent"
    />
    <hr />
    <label style="width: 100%">
      <input type="time" v-model="firstMealTime" list="time-list" />
      first meal time
      <datalist id="time-list">
        <option value="07:30" />
        <option value="8:00" />
        <option value="8:30" />
        <option value="9:00" />
        <option value="9:30" />
        <option value="10:00" />
        <option value="10:30" />
      </datalist>
    </label>
    <label style="width: 100%">
      <input
        type="number"
        inputmode="numeric"
        pattern="[0-9]*"
        v-model.number="mealTimeSeparationInMinutes"
        list="minutes-list"
      />
      minutes between your 5 meals/snacks (average)
      <datalist id="minutes-list">
        <option value="60" />
        <option value="90" />
        <option value="120" />
        <option value="150" />
        <option value="180" />
        <option value="210" />
      </datalist>
    </label>
  </form>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import NutrientInformation from "./NutrientInformation.vue";

export default defineComponent({
  name: "GoalSettings",
  components: {
    NutrientInformation,
  },
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

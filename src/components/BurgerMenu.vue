<template>
  <transition name="slide-fade">
    <div
      class="open"
      v-if="!isOpen"
      @click="isOpen = true"
      :style="{
        background:
          kcalConsumedToday > goals.calories + goals.calorieGoalTolerance
            ? '#C3453F'
            : '',
      }"
    >
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect y="4" width="24" height="2" fill="#fff" />
        <rect y="11" width="24" height="2" fill="#fff" />
        <rect y="18" width="24" height="2" fill="#fff" />
      </svg>
    </div>
    <aside class="menu" v-else>
      <ul>
        <li>
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            @click="isOpen = false"
          >
            <rect
              x="3"
              y="19.9706"
              width="24"
              height="2"
              transform="rotate(-45 3 19.9706)"
              fill="#2C3E50"
            />
            <rect
              x="4.41422"
              y="3"
              width="24"
              height="2"
              transform="rotate(45 4.41422 3)"
              fill="#2C3E50"
            />
          </svg>
        </li>
        <li>
          <router-link to="/" @click="isOpen = false">In season</router-link>
        </li>
        <li>
          <router-link to="/suggested-food" @click="isOpen = false"
            >For you</router-link
          >
        </li>
        <li>
          <router-link to="/search" @click="isOpen = false">Search</router-link>
        </li>
        <li>
          <router-link to="/meal-planner" @click="isOpen = false"
            >Meal planner</router-link
          >
        </li>
        <li>
          <router-link to="/stats" @click="isOpen = false">Stats</router-link>
        </li>
        <li>
          <router-link to="/settings" @click="isOpen = false"
            >Settings</router-link
          >
        </li>
        <li></li>
        <li v-if="currentDate !== now">
          <a href="#" @click.prevent="setDateToNow()"
            >{{ currentDate }} <small>(Click to reset to today)</small></a
          >
        </li>
        <li>
          <router-link
            to="/progress"
            @click="isOpen = false"
            :style="{
              color:
                kcalConsumedToday > goals.calories + goals.calorieGoalTolerance
                  ? '#C3453F'
                  : '',
            }"
            >Progress: {{ Math.round(kcalConsumedToday) }} /
            {{ nextMeal?.totalAllowedCalories ?? goals.calories }} kcal
          </router-link>
        </li>
        <li>
          <div class="grid small-gap">
            <NutrientInformation
              :protein="goals.proteinPercent"
              :carb="goals.carbsPercent"
              :fat="goals.fatPercent"
              :showText="false"
              style="margin-bottom: 0; opacity: 0.5"
            />
            <NutrientInformation
              v-if="carbEaten !== 0 || fatEaten !== 0 || proteinEaten !== 0"
              :protein="proteinEaten"
              :carb="carbEaten"
              :fat="fatEaten"
            />
          </div>
        </li>
        <!-- <li><router-link to="/settings">your@email.com</router-link></li> -->
      </ul>
    </aside>
  </transition>
</template>
<script lang="ts" setup>
import { computed, ref } from "vue";
import { useStore } from "vuex";
import NutrientInformation from "./NutrientInformation.vue";

const store = useStore();

const goals = computed(() => store.getters["auth/goals"]);

const kcalConsumedToday = computed(
  () => store.getters["consumedItems/kcalConsumedToday"]
);
const carbEaten = computed(
  () => store.getters["consumedItems/carbsConsumedToday"]
);
const fatEaten = computed(
  () => store.getters["consumedItems/fatConsumedToday"]
);
const proteinEaten = computed(
  () => store.getters["consumedItems/proteinConsumedToday"]
);
const nextMeal = computed(() => store.getters["auth/nextMeal"]);

const currentDate = computed(
  () => store.state.consumedItems.setDate.toISOString().split("T")[0]
);

const now = computed(() => new Date().toISOString().split("T")[0]);

const setDateToNow = () => {
  store.dispatch("consumedItems/setDate");
};

const isOpen = ref(false);
</script>
<style lang="scss" scoped>
svg {
  cursor: pointer;
}
</style>

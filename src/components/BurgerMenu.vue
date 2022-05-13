<template>
  <div class="close" v-if="!isOpen" @click="isOpen = true">
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect y="4" width="24" height="2" fill="#2C3E50" />
      <rect y="11" width="24" height="2" fill="#2C3E50" />
      <rect y="18" width="24" height="2" fill="#2C3E50" />
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
      <li><router-link to="/">In season</router-link></li>
      <li><router-link to="/suggested-food">For you</router-link></li>
      <li><router-link to="/search">Search</router-link></li>
      <li><router-link to="/meal-planner">Meal planner</router-link></li>
      <li><router-link to="/settings">Settings</router-link></li>
      <li></li>
      <li>
        <router-link to="/progress"
          >Progress: {{ Math.round(kcalConsumedToday) }} /
          {{ goals.calories }} kcal
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
</template>
<script lang="ts">
import { defineComponent, computed, onMounted } from "vue";
import { mapGetters, mapActions } from "vuex";
import NutrientInformation from "./NutrientInformation.vue";

export default defineComponent({
  components: { NutrientInformation },
  computed: {
    ...mapGetters({
      goals: "auth/goals",
      kcalConsumedToday: "consumedItems/kcalConsumedToday",
      carbEaten: "consumedItems/carbsConsumedToday",
      fatEaten: "consumedItems/fatConsumedToday",
      proteinEaten: "consumedItems/proteinConsumedToday",
    }),
  },
  data() {
    return {
      isOpen: false,
    };
  },
  //   created() {},
  methods: {},
});
</script>
<style lang="scss" scoped>
.close {
  position: fixed;
  top: 0;
  right: 0;
  padding: 16px;
  cursor: pointer;
  background: white;
  border-radius: 8px;
  z-index: 100;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.04);
}
.menu {
  position: fixed;
  right: 0;
  top: 0;
  z-index: 100;

  > ul {
    /* MenuBurger */

    /* Auto layout */

    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-end;
    gap: 16px;
    padding: 16px;

    position: relative;
    max-width: 70vw;

    background: #ffffff;
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
    border-radius: 8px;
    li {
      /* p */

      margin: 0;

      //   font-family: "Roboto";
      font-style: normal;
      font-weight: 400;
      font-size: 16px;
      line-height: 19px;
      /* identical to box height */

      text-align: right;

      color: #2c3e50;

      /* Inside auto layout */

      flex: none;
      order: 1;
      flex-grow: 0;
      a {
        text-decoration: none;
      }
    }
  }
}

svg {
  cursor: pointer;
}
</style>

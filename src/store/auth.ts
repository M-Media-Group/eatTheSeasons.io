import { addMinutes } from "@/helpers";
import { Commit, Dispatch } from "vuex";

export default {
  namespaced: true,
  state: {
    isSignedUp: localStorage.getItem("isSignedUp") === "true" ? true : false,
    goals: {
      calories: 1000,
      proteinPercent: 40,
      fatPercent: 20,
      carbsPercent: 40,
      mealsPerDay: 5,
      firstMealTime: "08:45",
      mealTimeSeparationInMinutes: 150,
      mealTimeDurationInMinutes: 30,
    },
  },
  getters: {
    isSignedUp(state: { isSignedUp: boolean }): boolean {
      return state.isSignedUp;
    },
    goals(state: {
      goals: {
        calories: number;
        proteinPercent: number;
        fatPercent: number;
        carbsPercent: number;
      };
    }): {
      calories: number;
      proteinPercent: number;
      fatPercent: number;
      carbsPercent: number;
    } {
      return state.goals;
    },
    meals(state: {
      goals: {
        firstMealTime: string;
        mealTimeSeparationInMinutes: number;
      };
    }): Record<string, any> {
      const now = new Date();
      const currentYear = now.getFullYear();
      const currentMonth = now.getMonth();
      const currentDay = now.getDate();
      const firstMealDate = new Date(
        currentYear,
        currentMonth,
        currentDay,
        ...(state.goals.firstMealTime.split(":") as unknown as [number, number])
      );
      const morningSnack = new Date(
        firstMealDate.getTime() +
          state.goals.mealTimeSeparationInMinutes * 60000
      );
      const lunch = new Date(
        morningSnack.getTime() + state.goals.mealTimeSeparationInMinutes * 60000
      );
      const afternoonSnack = new Date(
        lunch.getTime() + state.goals.mealTimeSeparationInMinutes * 60000
      );
      const dinner = new Date(
        afternoonSnack.getTime() +
          state.goals.mealTimeSeparationInMinutes * 60000
      );
      return {
        breakfast: { date: firstMealDate, caloricPercentage: 26 },
        morningSnack: {
          date: morningSnack,
          caloricPercentage: 6,
        },
        lunch: {
          date: lunch,
          caloricPercentage: 36,
        },
        afternoonSnack: {
          date: afternoonSnack,
          caloricPercentage: 6,
        },
        dinner: {
          date: dinner,
          caloricPercentage: 26,
        },
      };
    },
    nutrientRatio(
      state: { goals: unknown },
      getters: any,
      rootState: any,
      rootGetters: any
    ) {
      const goals = state.goals as unknown as Record<string, number>;
      const consumed = {
        carbs: rootGetters["consumedItems/carbsConsumedToday"],
        fat: rootGetters["consumedItems/fatConsumedToday"],
        protein: rootGetters["consumedItems/proteinConsumedToday"],
      };
      // Compute percentages between each consumed nutrient and the sum of all consumed nutrients
      const consumedPercentage = {
        carbs:
          (consumed.carbs /
            (consumed.carbs + consumed.fat + consumed.protein)) *
          100,
        fat:
          (consumed.fat / (consumed.carbs + consumed.fat + consumed.protein)) *
          100,
        protein:
          (consumed.protein /
            (consumed.carbs + consumed.fat + consumed.protein)) *
          100,
      };
      // Subtract the difference of each goal from the consumed percentage
      const difference = {
        carbs: goals.carbsPercent - consumedPercentage.carbs,
        fat: goals.fatPercent - consumedPercentage.fat,
        protein: goals.proteinPercent - consumedPercentage.protein,
      };
      // Normalize the difference to a number between -1 and 1 (inclusive)
      const normalizedDifference = {
        carbs: difference.carbs / 100,
        fat: difference.fat / 100,
        protein: difference.protein / 100,
      };
      return normalizedDifference;
    },
  },
  mutations: {
    SET_SIGNED_UP(state: { isSignedUp: boolean }, value: boolean): void {
      state.isSignedUp = value;
      localStorage.setItem("isSignedUp", value.toString());
      gtag("event", "signup_form_complete");
    },
  },
  actions: {
    signUp({ commit }: { commit: Commit }, value: boolean): void {
      commit("SET_SIGNED_UP", value);
    },
  },
};

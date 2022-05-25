import { addMinutes } from "@/helpers";
import { CountryCode } from "@/types/foodItem";
import { Commit, Dispatch } from "vuex";
import $bus, { eventTypes } from "@/events";

export default {
  namespaced: true,
  state: {
    isSignedUp: localStorage.getItem("isSignedUp") === "true" ? true : false,
    goals: {
      calories: parseFloat(localStorage.getItem("goals.calories") ?? "1000"),
      calorieGoalTolerance: 300,
      proteinPercent: parseFloat(
        localStorage.getItem("goals.proteinPercent") ?? "30"
      ),
      fatPercent: parseFloat(localStorage.getItem("goals.fatPercent") ?? "30"),
      carbsPercent: parseFloat(
        localStorage.getItem("goals.carbsPercent") ?? "40"
      ),
      mealsPerDay: parseFloat(localStorage.getItem("goals.mealsPerDay") ?? "5"),
      firstMealTime: localStorage.getItem("goals.firstMealTime") ?? "08:45",
      mealTimeSeparationInMinutes: parseFloat(
        localStorage.getItem("goals.mealTimeSeparationInMinutes") ?? "150"
      ),
      mealTimeDurationInMinutes: 30,
    },
    filters: {
      country: CountryCode.Fr,
      region: "All",
      month: new Date().toLocaleString("en-us", { month: "long" }),
      showOnlyNative:
        localStorage.getItem("filters.showOnlyNative") === "true"
          ? true
          : false,
      showOnlyWithCaloricInfo:
        localStorage.getItem("filters.showOnlyWithCaloricInfo") === "true"
          ? true
          : false,
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
        mealTimeDurationInMinutes: number;
        calories: number;
      };
    }): Record<string, any> {
      const now = new Date();
      const nowPlusMealtime = new Date(
        +now - 60000 * state.goals.mealTimeDurationInMinutes
      ); // +15 minutes
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
      const meals = {
        breakfast: {
          date: firstMealDate,
          dateHasPassed: nowPlusMealtime > firstMealDate,
          caloricPercentage: 26,
        },
        morningSnack: {
          date: morningSnack,
          dateHasPassed: nowPlusMealtime > morningSnack,
          caloricPercentage: 6,
        },
        lunch: {
          date: lunch,
          dateHasPassed: nowPlusMealtime > lunch,
          caloricPercentage: 36,
        },
        afternoonSnack: {
          date: afternoonSnack,
          dateHasPassed: nowPlusMealtime > afternoonSnack,
          caloricPercentage: 6,
        },
        dinner: {
          date: dinner,
          dateHasPassed: nowPlusMealtime > dinner,
          caloricPercentage: 26,
        },
      } as any;
      // For each meal, add a key value pair with the allowed calories
      // and the percentage of the goal that is allowed
      Object.keys(meals).forEach((meal: any) => {
        meals[meal].allowedCalories =
          (state.goals.calories * meals[meal].caloricPercentage) / 100;
        // Compute the total allowed calories for the meal by adding all the previous meals
        meals[meal].totalAllowedCalories = meals[meal].allowedCalories;
        Object.keys(meals).forEach((previousMeal: any) => {
          if (meals[previousMeal].date < meals[meal].date) {
            console.log("prev", meals[previousMeal]);
            meals[meal].totalAllowedCalories +=
              meals[previousMeal].allowedCalories;
          }
        });
      });
      return meals;
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
    filters(state: { filters: object }): object {
      return state.filters;
    },
    nextMeal(state: any, getters: { meals: any[] }): object {
      // Get the first meal from the getters where the date has not passed
      console.log(getters.meals);
      if (!getters.meals) {
        return {};
      }
      const nextMeal = Object.values(getters["meals"]).find(
        (meal: { dateHasPassed: any }) => !meal.dateHasPassed
      );
      console.log(nextMeal);
      return nextMeal;
    },
  },

  mutations: {
    SET_SIGNED_UP(state: { isSignedUp: boolean }, value: boolean): void {
      state.isSignedUp = value;
      localStorage.setItem("isSignedUp", value.toString());
      $bus.$emit(eventTypes.signup_form_complete);
    },
    SET_GOALS(state: { goals: unknown }, value: unknown): void {
      state.goals = value;
    },
    SET_FILTERS(state: { filters: object }, value: object): void {
      state.filters = value;
    },
  },

  actions: {
    signUp({ commit }: { commit: Commit }, value: boolean): void {
      commit("SET_SIGNED_UP", value);
    },
    setGoals({ commit }: { commit: Commit }, value: any[]): void {
      console.log("CALLED COMMIT", value);
      commit("SET_GOALS", value);
      //   For each key in value object, store the value in localStorage
      for (const key in value) {
        localStorage.setItem(`goals.${key}`, value[key].toString());
        $bus.$emit(eventTypes.update_goals, {
          key: key,
          value: value[key],
        });
      }
    },
    setFilters({ commit }: { commit: Commit }, value: any): void {
      commit("SET_FILTERS", value);
      for (const key in value) {
        localStorage.setItem(`filters.${key}`, value[key].toString());
        $bus.$emit(eventTypes.update_filters, {
          key: key,
          value: value[key],
        });
      }
    },
  },
};

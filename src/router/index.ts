import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import HomeView from "@/views/HomeView.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/sign-up",
    name: "sign-up",
    component: HomeView,
  },
  {
    path: "/progress",
    name: "Health tracking",
    component: () =>
      import(/* webpackChunkName: "ProgressView" */ "@/views/ProgressView.vue"),
    children: [
      {
        path: "times",
        name: "Meal times",
        component: () =>
          import(
            /* webpackChunkName: "MealPlanner" */ "@/components/MealTimes.vue"
          ),
      },
    ],
  },
  {
    path: "/meal-planner",
    name: "meal-planner",
    component: () =>
      import(
        /* webpackChunkName: "MealPlanner" */ "@/views/MealPlannerView.vue"
      ),
  },
  {
    path: "/search",
    name: "search",
    component: () =>
      import(/* webpackChunkName: "SearchView" */ "@/views/SearchView.vue"),
  },
  {
    path: "/",
    name: "food",
    component: () =>
      import(/* webpackChunkName: "FoodView" */ "@/views/FoodView.vue"),
  },
  {
    path: "/suggested-food",
    name: "suggested-food",
    component: () =>
      import(
        /* webpackChunkName: "FoodView" */ "@/views/SuggestedFoodView.vue"
      ),
  },
  {
    path: "/about",
    name: "about",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "@/views/AboutView.vue"),
  },
  {
    path: "/settings",
    name: "settings",
    component: () =>
      import(/* webpackChunkName: "SettingsView" */ "@/views/SettingsView.vue"),
  },
  {
    path: "/onboarding",
    name: "onboarding",
    component: () =>
      import(
        /* webpackChunkName: "OnboardingView" */ "@/views/OnboardingView.vue"
      ),
  },
  {
    path: "/stats",
    name: "stats",
    component: () =>
      import(/* webpackChunkName: "OnboardingView" */ "@/views/StatsView.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { top: 0 };
    }
  },
});

export default router;

import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import HomeView from "../views/HomeView.vue";
import FoodView from "../views/FoodView.vue";
// import ProgressView from "../views/ProgressView.vue";
import SearchView from "../views/SearchView.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/sign-up",
    name: "sign-up",
    component: HomeView,
  },
  // {
  //   path: "/progress",
  //   name: "progress",
  //   component: ProgressView,
  // },
  {
    path: "/search",
    name: "search",
    component: SearchView,
  },
  {
    path: "/",
    name: "food",
    component: FoodView,
  },
  {
    path: "/about",
    name: "about",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/AboutView.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;

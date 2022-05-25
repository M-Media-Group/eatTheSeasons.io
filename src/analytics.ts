import { Listeners } from "./events";

const events = {
  consumed_food_item_add: () => gtag("event", "consumed_food_item_add"),

  consumed_food_item_remove: () => gtag("event", "consumed_food_item_remove"),

  search: (event: any) =>
    gtag("event", "search", {
      search_term: event,
    }),

  signup_form_complete: () => gtag("event", "signup_form_complete"),

  update_goals: (event: any) =>
    gtag("event", "update_goals_" + event.key, {
      value: event.value,
    }),

  update_filters: (event: any) =>
    gtag("event", "update_filters_" + event.key, {
      value: event.value,
    }),
};

export default new Listeners(events);

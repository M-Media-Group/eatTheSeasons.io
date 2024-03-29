import { App } from "vue";

export enum eventTypes {
  signUp = "signUp",
  consumed_food_item_add = "consumed_food_item_add",
  consumed_food_item_remove = "consumed_food_item_remove",
  disliked_food_item_add = "disliked_food_item_add",
  search = "search",
  signup_form_complete = "signup_form_complete",
  update_goals = "update_goals",
  update_filters = "update_filters",
  disliked_food_item_remove = "disliked_food_item_remove",

  // Page visibility events
  app_became_visible = "app_became_visible",
  app_became_hidden = "app_became_hidden",
}

type EventsObject = { [P in eventTypes]?: any };

class Events {
  events: EventsObject;

  constructor(events = {}) {
    this.events = events;
  }

  $on(eventName: eventTypes, fn: any) {
    this.events[eventName] = this.events[eventName] || [];
    this.events[eventName].push(fn);
  }

  $off(eventName: eventTypes, fn: any) {
    if (this.events[eventName]) {
      for (let i = 0; i < this.events[eventName].length; i++) {
        if (this.events[eventName][i] === fn) {
          this.events[eventName].splice(i, 1);
          break;
        }
      }
    }
  }

  $emit(eventName: eventTypes, data = null as any) {
    if (this.events[eventName]) {
      this.events[eventName].forEach(function (fn: (arg0: any) => void) {
        fn(data);
      });
    }
  }
}

const eventsInstance = new Events();

export class Listeners {
  constructor(...events: EventsObject[]) {
    events.forEach((event: EventsObject) => {
      Object.keys(event).forEach((eventName: any) => {
        eventsInstance.$on(eventName, event[eventName as eventTypes]);
      });
    });
  }
}

// Currently unused
export const EventsPlugin = {
  install: (app: App<any>) => {
    // inject a globally available $bus
    app.config.globalProperties.$bus = eventsInstance;
  },
};

export default eventsInstance;

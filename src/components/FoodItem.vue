<template>
  <div class="food-item grid" :id="name?.replace(' ', '-')">
    <img
      v-if="showImage && computedImageSrc"
      :src="computedImageSrc"
      :alt="'A picture of a ' + name"
      loading="lazy"
    />
    <div>
      <component :is="'h' + titleLevel">
        {{ name }}
        <span v-if="localName"> ({{ localName }}) </span>
      </component>
      <p v-if="calories || lastMonth">
        <span v-if="calories">{{ calories.toFixed(2) }} kcal/100g · </span>
        <span v-if="lastMonth">Available to end of </span>
        {{ lastMonth }}
      </p>
    </div>
    <div
      class="badges"
      v-if="
        timesConsumedToday ||
        (isNative !== null && !isNative) ||
        helpsReachGoals
      "
    >
      <router-link
        v-if="timesConsumedToday"
        to="/progress"
        custom
        v-slot="{ navigate }"
      >
        <div
          class="badge"
          style="background: rgb(77 71 245); cursor: pointer"
          @click="navigate"
        >
          Eaten {{ timesConsumedToday }} times today
        </div>
      </router-link>
      <div class="badge" v-if="isNative !== null && !isNative">Not native</div>
      <div class="badge" v-if="helpsReachGoals" style="background: #1e8429">
        Good for your nutritional needs today
      </div>
    </div>
    <NutrientInformation
      v-if="isSignedUp && carb !== null && fat !== null && protein !== null"
      :protein="protein"
      :carb="carb"
      :fat="fat"
      :water="water"
    />
    <slot></slot>
    <form
      v-if="isSignedUp && id && supportsIndexedDB && showAddForm"
      @submit.prevent="submitFoodItem({ food_id: id, grams: amount ?? 0 })"
    >
      <input
        v-if="isFoodTrackerInputOpen"
        ref="input"
        type="number"
        inputmode="numeric"
        pattern="[0-9]*"
        min="1"
        v-model.number="amount"
        placeholder="Grams"
        required
      />

      <button
        type="submit"
        class="submit-button"
        @click="handleButtonClick($event)"
      >
        Add to tracker
      </button>
      <template v-if="amount && amount > 0 && isFoodTrackerInputOpen">
        <hr />
        <template v-if="protein">
          Protein eaten: {{ (protein / 100) * amount }}g
          <br />
        </template>
        <template v-if="carb">
          Carbohydrates eaten: {{ (carb / 100) * amount }}g
          <br />
        </template>
        <template v-if="fat">
          Fat eaten: {{ (fat / 100) * amount }}g
          <br />
        </template>
        <template v-if="calories">
          Calories eaten: {{ ((calories / 100) * amount).toFixed(2) }}kcal
        </template>
      </template>
    </form>
    <!-- <p v-if="categories">
      {{ categories.join(", ") }}
    </p> -->
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref, defineEmits, nextTick } from "vue";
import { Category, CategoryName, FoodItem, MonthName } from "@/types/foodItem";
import type { PropType } from "vue";
import NutrientInformation from "./NutrientInformation.vue";
import { useStore } from "vuex";
import { consumedItem } from "@/types/consumedItem";
import { getBestImageUrl } from "@/helpers";

export default defineComponent({
  name: "FoodItem",
  components: {
    NutrientInformation,
  },

  props: {
    id: Number,
    name: String,
    titleLevel: {
      type: Number,
      default: 2,
    },
    src: String,
    calories: {
      type: Number as PropType<number | null>,
      default: null,
      required: false,
    },
    carb: {
      type: Number as PropType<number | null>,
      default: null,
    },
    fat: {
      type: Number as PropType<number | null>,
      default: null,
    },
    protein: {
      type: Number as PropType<number | null>,
      default: null,
    },
    water: {
      type: Number as PropType<number | null>,
      default: null,
    },
    showAddForm: Boolean,
    categories: {
      type: Array as PropType<CategoryName[]>,
      default: () => [],
    },
    localName: String,
    isNative: {
      type: Boolean as PropType<boolean | null>,
      default: null,
    },
    lastMonth: {
      type: String as PropType<MonthName>,
      default: "",
      required: false,
    },
    showImage: {
      type: Boolean,
      default: true,
      required: false,
    },
    servingSize: {
      type: Number as PropType<number | null>,
      default: null,
      required: false,
    },
  },

  emits: ["addedConsumedFoodItem"],

  setup(props, { emit }) {
    const amount = ref((props.servingSize ?? null) as number | null);
    const input = ref(null) as any;
    const computedImage = ref(props.src);

    const store = useStore();

    const isFoodTrackerInputOpen = ref(false);

    const supportsIndexedDB = store.getters["app/supportsIndexedDB"];

    const isSignedUp = computed(() => store.getters["auth/isSignedUp"]);
    const foodItemsThatHelpReachGoals = computed(
      () => store.getters["foodItems/foodItemsThatHelpReachGoals"]
    );

    const bestImageUrl = () => {
      if (!props.name || !props.showImage) {
        return "";
      }

      if (computedImage.value) {
        return computedImage.value;
      }

      getBestImageUrl(props.name).then((imageUrl) => {
        computedImage.value = imageUrl;
      });
    };

    const computedImageSrc = computed(() => {
      if (props.src) {
        return props.src;
      }

      if (!props.name) {
        return;
      }

      bestImageUrl();
      // Get and wait for bestImageUrl to resolve

      return computedImage.value;
    });

    const consumedItemsToday = computed(
      () => store.getters["consumedItems/allConsumedItemsToday"]
    );

    const helpsReachGoals = computed(() => {
      return (
        foodItemsThatHelpReachGoals.value.findIndex(
          (foodItem: FoodItem) => foodItem.id === props.id
        ) !== -1
      );
    });

    const timesConsumedToday = computed(() => {
      // Count amount of times this foodId appears in consumedItemsToday
      return (
        consumedItemsToday.value.filter(
          (foodItem: consumedItem) => foodItem.food_id === props.id
        ).length ?? 0
      );
    });

    const submitFoodItem = (data: {
      food_id: number | undefined;
      grams: number;
    }) => {
      if (props.showAddForm) {
        store.dispatch("consumedItems/addConsumedItem", data);
      }
      isFoodTrackerInputOpen.value = false;
      amount.value = null;
      emit("addedConsumedFoodItem", data);
    };

    const handleButtonClick = (event: Event) => {
      if (!isFoodTrackerInputOpen.value) {
        event.preventDefault();
        isFoodTrackerInputOpen.value = true;
        nextTick(() => {
          if (input.value) {
            input.value.focus();
          }
        });
      } else if (!amount.value) {
        return event.preventDefault();
      }
    };

    return {
      amount,
      isSignedUp,
      helpsReachGoals,
      supportsIndexedDB,
      foodItemsThatHelpReachGoals,
      consumedItemsToday,
      timesConsumedToday,
      handleButtonClick,
      isFoodTrackerInputOpen,
      input,
      submitFoodItem,
      computedImageSrc,
    };
  },
});
</script>

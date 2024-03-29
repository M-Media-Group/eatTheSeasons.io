<template>
  <div
    class="food-item grid"
    :id="name?.replace(' ', '-')"
    :class="{
      native: isNative,
      helpful: helpsReachGoals,
      disliked: isDisliked,
    }"
  >
    <img
      v-if="showImage && computedImageSrc"
      :src="computedImageSrc"
      :alt="'A picture of a ' + name"
      loading="lazy"
    />
    <div>
      <router-link custom v-slot="{ navigate }" :to="'/food/' + id">
        <component
          :is="'h' + titleLevel"
          @click="showLink ? navigate() : null"
          :class="{ clickable: showLink }"
        >
          {{ name }}
          <span v-if="localName"> ({{ localName }}) </span>
        </component>
      </router-link>
      <p v-if="calories || lastMonth">
        <span v-if="calories">{{ calories.toFixed(2) }} kcal/100g · </span>
        <span v-if="lastMonth && isInSeason"
          >Available to end of {{ lastMonth }}</span
        >
        <span v-else-if="isInSeason == false">Not yet in season</span>
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
      v-if="carb !== null && fat !== null && protein !== null"
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
      <transition name="fade" mode="out-in">
        <input
          v-if="isFoodTrackerInputOpen"
          ref="input"
          type="number"
          inputmode="numeric"
          pattern="[0-9]*"
          min="1"
          v-model.number="amount"
          placeholder="Grams"
          :list="'common-servings-' + id"
          required
        />
      </transition>
      <datalist v-if="isFoodTrackerInputOpen" :id="'common-servings-' + id">
        <option v-if="servingSize">
          {{ servingSize }}
        </option>
        <option v-for="serving in commonServings" :key="serving">
          {{ serving }}
        </option>
      </datalist>

      <button
        type="submit"
        class="submit-button"
        @click="handleButtonClick($event)"
      >
        Add to tracker
      </button>

      <template
        v-if="
          amount &&
          amount > 0 &&
          isFoodTrackerInputOpen &&
          visibleIntakeParams !== null
        "
      >
        <hr />
        <template v-for="(unit, param) in visibleIntakeParams" :key="param">
          {{ param.charAt(0).toUpperCase() + param.slice(1) }} eaten:
          {{ Math.round((this[param] / 100) * amount) }}{{ unit }}
          <br />
        </template>
      </template>
    </form>
    <ClickAndHoldButton
      v-if="
        isSignedUp &&
        id &&
        supportsIndexedDB &&
        !isFoodTrackerInputOpen &&
        !isDisliked
      "
      @click="submitDislikedItem(id)"
    >
      Dislike
    </ClickAndHoldButton>
    <button @click="deleteDislikedItemId(id)" v-else-if="isDisliked && id">
      Remove food from disliked list
    </button>
    <!-- <p v-if="categories">
      {{ categories.join(", ") }}
    </p> -->
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref, nextTick } from "vue";
import { CategoryName, MonthName } from "@/types/foodItem";
import type { PropType } from "vue";
import NutrientInformation from "./NutrientInformation.vue";
import { useStore } from "vuex";
import { getBestImageUrl } from "@/helpers";
import ClickAndHoldButton from "./ClickAndHoldButton.vue";
import { useConsumedFood } from "@/composables/useConsumedFood";

export default defineComponent({
  name: "FoodItem",
  components: {
    NutrientInformation,
    ClickAndHoldButton,
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
    visibleIntakeParams: {
      type: Object as PropType<Record<string, string>>,
      default: () => ({
        protein: "g",
        carb: "g",
        fat: "g",
        calories: "kcal",
      }),
      required: false,
    },
    helpsReachGoals: {
      type: Boolean,
      default: false,
      required: false,
    },
    isSignedUp: {
      type: Boolean,
      default: false,
      required: false,
    },
    supportsIndexedDB: {
      type: Boolean,
      default: false,
      required: false,
    },
    timesConsumedToday: {
      type: Number,
      default: 0,
      required: false,
    },
    isDisliked: {
      type: Boolean,
      default: false,
      required: false,
    },
    showLink: {
      type: Boolean,
      default: true,
      required: false,
    },
    isInSeason: {
      type: [Boolean, null] as PropType<boolean | null>,
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

    const consumedFood = useConsumedFood();

    const isFoodTrackerInputOpen = ref(false);

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

    const submitDislikedItem = (id: number) => {
      store.dispatch("consumedItems/addDislikedItemId", id);
    };

    const deleteDislikedItemId = (id: number) => {
      store.dispatch("consumedItems/deleteDislikedItemId", id);
    };

    const commonServings = ref(null as number[] | null);

    const handleButtonClick = (event: Event) => {
      if (!props.id) {
        return;
      }

      if (!isFoodTrackerInputOpen.value) {
        event.preventDefault();
        isFoodTrackerInputOpen.value = true;
        commonServings.value = consumedFood.getModeServingForFood(props.id);
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
      handleButtonClick,
      deleteDislikedItemId,
      isFoodTrackerInputOpen,
      input,
      submitFoodItem,
      submitDislikedItem,
      computedImageSrc,
      commonServings,
    };
  },
});
</script>

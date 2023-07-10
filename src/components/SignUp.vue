<template>
  <div class="grid main-banner">
    <form
      name="signup"
      method="POST"
      netlify-honeypot="bot-field"
      data-netlify="true"
      @submit.prevent="handleSubmit"
      v-if="!isSignedUp"
      class="grid horizontal"
      style="justify-content: center"
    >
      <p style="display: none">
        <label>
          Don't fill this out if you're human: <input name="bot-field" />
        </label>
      </p>
      <input
        v-model="form.email"
        name="email"
        type="email"
        placeholder="Your Email Address"
        pattern="[^@]+@[^@]+\.[^@]+"
        required
      />
      <button type="submit" class="submit-button">Sign up</button>
    </form>
    <div v-else>Thanks for signing up! You'll get an email when we launch.</div>
    <template v-if="$route.query.nai">
      <h1>Food is hard. Let AI help.</h1>
      <p>
        Using advanced machine-learning, we help you find the best food to eat
        based on your goals, preferences, seasonality, and what you've already
        eaten.
      </p>
      <p>
        With so many food types, nutrients, calories, and so on, it's hard to
        know what to eat. Worst of all, by the time you actually start thinking
        about food, you're often hangry, so you don't have the time or energy to
        really think about it.
      </p>
      <p>
        Using Artificial Intelligence algorithms, we find food for you that is
        healthy, helps your goals, and most importantly, that you'll enjoy
        eating.
      </p>
    </template>
    <template v-else>
      <h1>Eat fresh, local, and healthy.</h1>
      <p>
        When you sign up, you'll be able to
        <b
          >see nutritional info for each food, track your food intake, and get
          suggested foods based on macronutrients you're missing</b
        >
        <span v-if="!supportsIndexedDB"> (currently in beta testing)</span>.
      </p>
      <p>
        Find the best food to eat based on your goals, preferences, seasonality,
        and what you've already eaten.
      </p>
      <p>
        With so many food types, nutrients, calories, and so on, it's hard to
        know what to eat. Worst of all, by the time you actually start thinking
        about food, you're often hangry, so you don't have the time or energy to
        really think about it.
      </p>
      <p>
        Using an extensive database of local produce, we help you choose what
        foods to buy and eat. You'll be eating healthier food while also
        supporting the local farmers.
      </p>
    </template>
    <p>Sign up now to get notified when we launch!</p>
  </div>
</template>
<script lang="ts" setup>
import { reactive, computed } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";

const store = useStore();
const router = useRouter();

const form = reactive({
  email: "",
});

const isSignedUp = computed(() => {
  return store.getters["auth/isSignedUp"];
});

const supportsIndexedDB = computed(() => {
  return store.getters["app/supportsIndexedDB"];
});

const signUp = (value: boolean) => store.dispatch("auth/signUp", value);

const encode = (data: {
  [x: string]: string | number | boolean;
  email?: any;
  "form-name": string;
}) => {
  return Object.keys(data)
    .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(data[key])}`)
    .join("&");
};

const handleSubmit = async () => {
  if (import.meta.env.DEV) {
    signUp(true);
    return router.push("/onboarding");
  }
  const request = await fetch("/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: encode({
      "form-name": "signup",
      ...form,
    }),
  });
  if (request.status === 200) {
    signUp(true);
    return router.push("/onboarding");
  } else {
    alert("Error: " + request.status);
  }
};
</script>

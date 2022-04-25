<template>
  <div class="hello">
    <form
      name="signup"
      method="POST"
      netlify-honeypot="bot-field"
      data-netlify="true"
      @submit.prevent="handleSubmit"
      v-if="!isSignedUp"
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
    <ul v-if="1 === 0">
      <li>
        <a
          href="https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-plugin-babel"
          target="_blank"
          rel="noopener"
          >babel</a
        >
      </li>
      <li>
        <a
          href="https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-plugin-pwa"
          target="_blank"
          rel="noopener"
          >pwa</a
        >
      </li>
      <li>
        <a
          href="https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-plugin-router"
          target="_blank"
          rel="noopener"
          >router</a
        >
      </li>
      <li>
        <a
          href="https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-plugin-vuex"
          target="_blank"
          rel="noopener"
          >vuex</a
        >
      </li>
      <li>
        <a
          href="https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-plugin-eslint"
          target="_blank"
          rel="noopener"
          >eslint</a
        >
      </li>
      <li>
        <a
          href="https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-plugin-unit-jest"
          target="_blank"
          rel="noopener"
          >unit-jest</a
        >
      </li>
      <li>
        <a
          href="https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-plugin-e2e-cypress"
          target="_blank"
          rel="noopener"
          >e2e-cypress</a
        >
      </li>
      <li>
        <a
          href="https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-plugin-typescript"
          target="_blank"
          rel="noopener"
          >typescript</a
        >
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import axios from "axios";
import { mapGetters, mapActions } from "vuex";

export default defineComponent({
  name: "SignUp",
  props: {
    msg: String,
  },
  data() {
    return {
      form: {
        email: "",
      },
    };
  },
  computed: {
    ...mapGetters({
      isSignedUp: "auth/isSignedUp",
    }),
  },
  methods: {
    ...mapActions({
      signUp: "auth/signUp",
    }),
    encode(data: {
      [x: string]: string | number | boolean;
      email?: any;
      "form-name": string;
    }) {
      return Object.keys(data)
        .map(
          (key) => `${encodeURIComponent(key)}=${encodeURIComponent(data[key])}`
        )
        .join("&");
    },
    handleSubmit() {
      this.signUp(true);
      const axiosConfig = {
        header: { "Content-Type": "application/x-www-form-urlencoded" },
        // Set the baseURL to the current domain
        baseURL: window.location.origin,
      };
      axios
        .post(
          "/",
          this.encode({
            "form-name": "signup",
            ...this.form,
          }),
          axiosConfig as any
        )
        .then(() => {
          this.signUp(true);
        });
    },
  },
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
$bg: #fff;
$text: #382b22;
$light-pink: #afe2b4;
$pink: #1e8429;
$dark-pink: #11741b;
$pink-border: #16631e;
$pink-shadow: #9ecba3;

h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #1e8429;
}
p {
  margin: 1rem auto;
  max-width: 600px;
}
input {
  -webkit-font-smoothing: antialiased;
  color: rgb(44, 62, 80);
  border: 2px dashed $pink-border;
  cursor: pointer;
  display: inline-block;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  font-size: 32px;
  font-weight: 700;
  height: 44px;
  position: relative;
  text-align: center;
  border-radius: 0.75em;
  padding: 2rem 0;
  width: 100%;
}

@import url("https://fonts.googleapis.com/css?family=Rubik:700&display=swap");

* {
  box-sizing: border-box;
  &::before,
  &::after {
    box-sizing: border-box;
  }
}

button {
  position: relative;
  display: inline-block;
  cursor: pointer;
  outline: none;
  border: 0;
  vertical-align: middle;
  text-decoration: none;
  font-size: inherit;
  font-family: inherit;
  margin-top: -0.5rem;
  &.submit-button {
    font-weight: 600;
    color: $text;
    text-transform: uppercase;
    padding: 0.7em 2em;
    background: $light-pink;
    border: 2px solid $pink-border;
    border-radius: 0.75em;
    transform-style: preserve-3d;
    transition: transform 150ms cubic-bezier(0, 0, 0.58, 1),
      background 150ms cubic-bezier(0, 0, 0.58, 1);
    &::before {
      position: absolute;
      content: "";
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: $dark-pink;
      border-radius: inherit;
      box-shadow: 0 0 0 2px $pink-border, 0 0.625em 0 0 $pink-shadow;
      transform: translate3d(0, 0.75em, -1em);
      transition: transform 150ms cubic-bezier(0, 0, 0.58, 1),
        box-shadow 150ms cubic-bezier(0, 0, 0.58, 1);
    }
    &:hover {
      background: $pink;
      transform: translate(0, 0.25em);
      &::before {
        box-shadow: 0 0 0 2px $pink-border, 0 0.5em 0 0 $pink-shadow;
        transform: translate3d(0, 0.5em, -1em);
      }
    }
    &:active {
      background: $pink;
      transform: translate(0em, 0.75em);
      &::before {
        box-shadow: 0 0 0 2px $pink-border, 0 0 $pink-shadow;
        transform: translate3d(0, 0, -1em);
      }
    }
  }
}

form {
  display: block;
  grid-auto-flow: column;
  align-content: center;
  align-items: center;
  grid-auto-columns: 1fr 180px;
  max-width: 600px;
  width: 100%;
  margin: 0 auto;
  gap: 8px;
}

// Only on larger than mobile, add display grid to form
@media (min-width: 768px) {
  form {
    display: grid;
  }
}
</style>

<template>
  <div class="home">
    <img
      alt="Assorted food"
      src="https://freepngimg.com/thumb/fruit/174250-and-fresh-vegetables-fruits-download-hq.png"
      height="200"
    />
    <SignUp />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import SignUp from "@/components/SignUp.vue"; // @ is an alias to /src

export default defineComponent({
  name: "HomeView",
  components: {
    SignUp,
  },
});
</script>

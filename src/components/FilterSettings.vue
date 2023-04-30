<template>
  <form style="max-width: max-content" class="grid">
    <label>
      <input
        type="checkbox"
        :checked="filters.hideDisliked"
        @change="setFilters({ hideDisliked: !filters.hideDisliked })"
      />
      <span>Hide disliked food</span>
    </label>
  </form>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { mapActions, mapGetters } from "vuex";

export default defineComponent({
  name: "AppFilters",
  computed: {
    ...mapGetters({
      filters: "auth/filters",
    }),
  },
  methods: {
    ...mapActions({
      setFilters: "auth/setFilters",
    }),
  },
});
</script>

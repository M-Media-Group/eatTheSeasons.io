<template>
  <form style="max-width: max-content" class="grid">
    <label>
      <input
        type="checkbox"
        :checked="filters.showOnlyInSeason"
        @change="
          setFilters({
            showOnlyInSeason: !filters.showOnlyInSeason,
          })
        "
      />
      <span>Hide food that is not in season</span>
    </label>
    <label>
      <input
        type="checkbox"
        :checked="filters.showOnlyWithCaloricInfo"
        @change="
          setFilters({
            showOnlyWithCaloricInfo: !filters.showOnlyWithCaloricInfo,
          })
        "
      />
      <span>Hide food without caloric info</span>
    </label>
    <label>
      <input
        type="checkbox"
        :checked="filters.hideUnhelpful"
        @change="setFilters({ hideUnhelpful: !filters.hideUnhelpful })"
      />
      <span>Hide food that doesn't help reach goals</span>
    </label>
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

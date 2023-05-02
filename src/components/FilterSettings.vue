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
      <span>Hide food that doesn't help reach daily goals</span>
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

<script lang="ts" setup>
import { computed } from "vue";
import { useStore } from "vuex";

const store = useStore();
const filters = computed(() => store.getters["auth/filters"]);
const setFilters = (filters: any) => store.dispatch("auth/setFilters", filters);
</script>

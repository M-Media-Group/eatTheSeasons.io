import { ref, computed } from "vue";

// by convention, composable function names start with "use"
export function useMove() {
  // state encapsulated and managed by the composable
  const touchEndY = ref(0);
  const touchStartY = ref(0);

  const touchStartMethod = (event: TouchEvent) => {
    console.log("touch start", event);
    touchStartY.value = event.changedTouches[0].screenY;
  };

  const touchEndMethod = (event: TouchEvent) => {
    touchEndY.value = event.changedTouches[0].screenY;
  };

  const touchDirection = computed(() => {
    if (touchEndY.value > touchStartY.value) {
      return "down";
    } else if (touchEndY.value === touchStartY.value) {
      return "tap";
    } else {
      return "up";
    }
  });

  // expose managed state as return value
  return {
    touchDirection,
    touchStartMethod,
    touchEndMethod,
  };
}

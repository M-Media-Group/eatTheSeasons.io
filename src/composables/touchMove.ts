import { ref, computed } from "vue";

// by convention, composable function names start with "use"
export function useMove() {
  // state encapsulated and managed by the composable
  const touchEndY = ref(0);
  const touchStartY = ref(0);

  const touchStartMethod = (event: TouchEvent | MouseEvent) => {
    // If the event is a type of TouchEvent
    if (event instanceof MouseEvent) {
      // Get the Y position of the mouse
      touchStartY.value = event.screenY;
    } else if (TouchEvent && event instanceof TouchEvent) {
      touchStartY.value = event.changedTouches[0].screenY;
    }
  };

  const touchEndMethod = (event: TouchEvent | MouseEvent) => {
    if (event instanceof MouseEvent) {
      touchEndY.value = event.screenY;
    } else if (TouchEvent && event instanceof TouchEvent) {
      touchEndY.value = event.changedTouches[0].screenY;
    }
  };

  const touchDistance = computed(() => {
    return touchEndY.value - touchStartY.value;
  });

  const touchDirection = computed(() => {
    if (touchDistance.value > 0) {
      return "down";
    } else if (touchDistance.value === 0) {
      return "tap";
    } else {
      return "up";
    }
  });

  // expose managed state as return value
  return {
    touchDistance,
    touchDirection,
    touchStartMethod,
    touchEndMethod,
  };
}

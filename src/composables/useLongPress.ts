import { computed, ref } from "vue";

export default function useLongPress(
  successCallback: any,
  timeMs: number,
  errorCallback?: any
) {
  const timer = ref<number | null>(null);
  const startTime = ref<number | null>(null);
  const endTime = ref<number | null>(null);

  const intervalCompletionCheck = ref<number | null>(null);

  const progress = ref<number>(0);

  const startTimer = () => {
    startTime.value = Date.now();
    timer.value = setTimeout(() => {
      successCallback();
    }, timeMs);

    // Start an interval that will update the progress bar
    intervalCompletionCheck.value = setInterval(() => {
      progress.value = timerPercentage();
    }, 100);
  };

  const stopTimer = () => {
    endTime.value = Date.now();
    if (timer.value !== null) {
      clearTimeout(timer.value);
      timer.value = null;
      errorCallback();
    }
    if (intervalCompletionCheck.value !== null) {
      clearInterval(intervalCompletionCheck.value);
      intervalCompletionCheck.value = null;
    }
  };

  const handleMouseDown = () => {
    startTimer();
  };

  const handleMouseUp = () => {
    stopTimer();
  };

  const timerPercentage = () => {
    if (timer.value === null || startTime.value === null) {
      return 0;
    }
    const now = Date.now();
    const elapsed = now - startTime.value;
    const percentage = (elapsed / timeMs) * 100;
    console.log(percentage);
    return percentage;
  };

  return {
    handleMouseDown,
    handleMouseUp,
    progress,
  };
}

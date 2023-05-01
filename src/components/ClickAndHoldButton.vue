<template>
  <button
    @mousedown="handleMouseDown"
    @mouseup="handleMouseUp"
    :data-percent-complete="Math.round(progress) + '%'"
  >
    <slot></slot>
  </button>
</template>

<script lang="ts" setup>
import useLongPress from "@/composables/useLongPress";
import { defineEmits, defineProps } from "vue";

const emit = defineEmits(["click"]);

const props = defineProps({
  timeout: {
    type: Number,
    default: 2500,
  },
});

const successCallback = () => {
  console.log("long press is triggered");
  emit("click");
};

const errorCallback = () => {
  //   alert("long press to confirm");
};

const { handleMouseDown, handleMouseUp, progress } = useLongPress(
  successCallback,
  props.timeout,
  errorCallback
);
</script>

<template>
  <div>
    <div
      class="modal-overlay"
      @click="closeModal"
      @touchstart="touchStartMethod"
      @touchend="touchEndMethod"
    />
    <div class="modal" :style="draggedStyle">
      <header
        class="modal-header"
        @touchstart="touchStartMethod"
        @touchend="touchEndMethod"
      >
        <div class="swipe-down-element">
          <div class="swipe-down-line" />
        </div>
        <div v-if="title || $slots.headerActions" class="modal-header-headings">
          <component
            :is="titleHtmlElement"
            v-if="title"
            class="modal-header-title"
          >
            {{ title }}
          </component>
          <div v-if="$slots.headerActions" class="modal-header-actions">
            <slot name="headerActions" />
          </div>
        </div>
      </header>
      <div class="modal-body">
        <slot name="body" />
      </div>
      <footer class="modal-footer">
        <slot name="footer" />
      </footer>
    </div>
  </div>
</template>
<script>
import { defineComponent, watch } from "vue";
import { useMove } from "@/composables/touchMove";

export default defineComponent({
  name: "BottomSheet",
  props: {
    title: {
      type: String,
      default: null,
      required: false,
    },
    titleHtmlElement: {
      type: String,
      default: "h2",
      required: false,
    },
  },
  emits: ["closed"],
  data() {
    return {
      swipeDown: false,
      draggedStyle: {},
    };
  },
  mounted: function () {
    document.body.style.overflow = "hidden";
  },
  unmounted: function () {
    this.closeModal();
  },
  methods: {
    closeModal() {
      document.body.style.overflow = null;
      this.$emit("closed");
    },
    // touchEndMethod(event) {
    //   this.touchEndY = event.changedTouches[0].screenY;

    //   if (this.touchEndY > this.touchStartY) {
    //     this.onSwipeDown(event);
    //   }

    //   if (this.touchEndY === this.touchStartY) {
    //     // console.log('Tap')
    //   }
    // },
    onDragDown(event) {
      delete this.swipeDown;
      //console.log('drag down', $event);
      var transform = "translateY(" + event.gesture.deltaY + "px)";
      //console.log('dragged style', transform);
      this.draggedStyle = {
        "-webkit-transform": transform,
        transform: transform,
        "-webktit-backface-visibility": "hidden",
        "backface-visibility": "hidden",
      };
    },
    onRelease() {
      //console.log('released');
      setTimeout(function () {
        if (!this.swipeDown) {
          //console.log('resetting drag style');
          this.draggedStyle = {};
        }
      });
    },
    onSwipeDown() {
      this.swipeDown = true;
      this.closeModal();
    },
  },
  setup(props, { emit }) {
    const { touchDirection, touchStartMethod, touchEndMethod } = useMove();

    // Watch the touchDirection, if its down, close the modal
    watch(
      () => touchDirection.value,
      (newValue) => {
        console.log("got new direction", newValue);
        if (newValue === "down") {
          emit("closed");
        }
      }
    );

    return {
      touchStartMethod,
      touchEndMethod,
    };
  },
});
</script>

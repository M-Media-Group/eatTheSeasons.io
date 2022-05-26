<template>
  <div>
    <div
      class="modal-overlay"
      @click="closeModal"
      @touchstart="touchStartMethod"
      @touchend="touchEndMethod"
      v-if="isOpen"
    />
    <div
      class="modal"
      :style="draggedStyle"
      v-if="isOpen || keepHeaderVisible"
      :class="{ open: isOpen }"
    >
      <header
        class="modal-header"
        @touchstart="touchStartMethod"
        @touchend="touchEndMethod"
        @click="openModal"
      >
        <div class="swipe-down-element">
          <div class="swipe-down-line" />
        </div>
        <slot name="header">
          <div
            v-if="title || $slots.headerActions"
            class="modal-header-headings"
          >
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
        </slot>
      </header>
      <div class="modal-body" v-if="isOpen">
        <slot name="body" />
      </div>
      <footer class="modal-footer" v-if="isOpen">
        <slot name="footer" />
      </footer>
    </div>
  </div>
</template>
<script>
import { defineComponent, ref, watch } from "vue";
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
    keepHeaderVisible: {
      type: Boolean,
      default: true,
      required: false,
    },
  },
  emits: ["closed", "opened"],
  data() {
    return {
      swipeDown: false,
      draggedStyle: {},
    };
  },
  unmounted: function () {
    this.closeModal();
  },
  methods: {
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
    const { touchDistance, touchDirection, touchStartMethod, touchEndMethod } =
      useMove();
    const isOpen = ref(false);

    const openModal = () => {
      document.body.style.overflow = "hidden";
      isOpen.value = true;
      emit("opened");
    };

    const closeModal = () => {
      document.body.style.overflow = null;
      isOpen.value = false;
      emit("closed");
    };

    const toggleModal = () => {
      if (isOpen.value) {
        closeModal();
      } else {
        openModal();
      }
    };

    // Watch the touchDirection, if its down, close the modal
    watch(
      () => touchDirection.value,
      (newValue) => {
        console.log("got new direction", newValue);
        if (newValue === "down") {
          closeModal();
        } else if (newValue === "up") {
          openModal();
        } else if (newValue === "tap") {
          toggleModal();
        }
      }
    );

    return {
      isOpen,
      touchStartMethod,
      touchEndMethod,
      openModal,
      closeModal,
    };
  },
});
</script>

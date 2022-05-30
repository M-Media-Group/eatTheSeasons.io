<template>
  <div>
    <div
      class="modal-overlay"
      @click.stop="closeModal"
      @touchstart="touchStartMethod"
      @touchend="touchEndMethod"
      v-if="isOpen"
    />
    <transition name="slide-from-bottom" mode="in-out">
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
          @mousedown="touchStartMethod"
          @mouseup="touchEndMethod"
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
        <transition name="slide-from-bottom" mode="in-out">
          <div class="modal-body" v-if="isOpen">
            <slot name="body" />
          </div>
        </transition>

        <footer class="modal-footer" v-if="isOpen && hasSlot('footer')">
          <slot name="footer" />
        </footer>
      </div>
    </transition>
  </div>
</template>
<script>
import { defineComponent, nextTick, ref, useSlots, watch } from "vue";
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

    const slots = useSlots();

    const hasSlot = (name) => {
      return !!slots[name];
    };

    const isOpen = ref(false);

    const openModal = () => {
      document.body.style.overflow = "hidden";
      //   document.body.style.position = "absolute";
      //   document.body.style.height = "100vh";
      //   document.body.style.height = "-webkit-fill-available";
      //   document.style.height = "-webkit-fill-available;";
      isOpen.value = true;
      //   Wait for next tick to emit the opened event
      //   so that the modal can be positioned correctly
      //   before the opened event is emitted
      //
      nextTick(() => {
        emit("opened");
      });
    };

    const closeModal = () => {
      document.body.style = null;
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
      hasSlot,
    };
  },
});
</script>

<template>
  <div id="liveView" class="videoView">
    <button id="webcamButton" :disabled="!model" @click="enableCam($event)">
      Enable Webcam
    </button>
    <video id="webcam" ref="webcam" autoplay="" playsinline="true"></video>
  </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import { toRaw } from "vue";
import type { PropType } from "vue";

import "@tensorflow/tfjs-backend-cpu";
import "@tensorflow/tfjs-backend-webgl";

import * as cocoSsd from "@tensorflow-models/coco-ssd";

export default defineComponent({
  name: "MlCam",
  props: {
    seasonalFoodNames: {
      type: Array as PropType<string[]>,
      required: true,
    },
  },
  data() {
    return {
      model: undefined as
        | { detect: (arg0: HTMLElement | null) => Promise<any> }
        | undefined,
      webcam: null,
      video: document.getElementById("webcam"),
      liveView: document.getElementById("liveView"),
      children: [] as any[],
      predictions: [],
    };
  },
  mounted() {
    this.video = document.getElementById("webcam");
    this.liveView = document.getElementById("liveView");
    cocoSsd.load({ base: "lite_mobilenet_v2" }).then((loadedModel: any) => {
      console.log("Model loaded", loadedModel);
      this.model = loadedModel;
    });
  },

  methods: {
    hasGetUserMedia() {
      return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
    },

    enableCam(event: {
      target: { classList: { add: (arg0: string) => void } };
    }) {
      if (!this.model) {
        console.log("Wait! Model not loaded yet.");
        return;
      }

      // Hide the button.
      event.target.classList.add("removed");

      // getUsermedia parameters.
      const constraints = {
        audio: false,
        video: {
          facingMode: "environment",
          width: {
            min: 640,
            ideal: this.video?.offsetWidth ?? 1920,
            max: 1920,
          },
          height: { min: 400, ideal: this.video?.offsetHeight ?? 1080 },
          aspectRatio: {
            ideal:
              (this.video?.offsetWidth ?? 1920) /
              (this.video?.offsetHeight ?? 1080),
          },
        },
      };
      // Activate the webcam stream.
      navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
        if (!this.video) {
          console.log("No video element found.");
          return;
        }
        (this.video as any).srcObject = stream;
        this.video?.addEventListener("loadeddata", this.predictWebcam);
      });
    },

    predictWebcam() {
      if (!this.model) {
        console.log("Wait! Model not loaded yet.");
        return;
      }

      // Vue reactivity gives us a proxy but we need to access the raw object.
      const model = toRaw(this.model);

      // Now let's start classifying the stream.
      model.detect(this.video).then((predictions: string | any[]) => {
        // Remove any highlighting we did previous frame.
        for (let i = 0; i < this.children.length; i++) {
          this.liveView?.removeChild(this.children[i]);
        }
        this.children.splice(0);

        // Now lets loop through predictions and draw them to the live view if
        // they have a high confidence score.
        for (let n = 0; n < predictions.length; n++) {
          // If we are over 66% sure we are sure we classified it right, draw it!
          if (predictions[n].score > 0.66) {
            const p = document.createElement("p");
            // p.innerText =
            //   predictions[n].class +
            //   " - with " +
            //   Math.round(parseFloat(predictions[n].score) * 100) +
            //   "% confidence.";

            const isInSeason =
              this.seasonalFoodNames.findIndex(
                (foodName) =>
                  foodName.toLowerCase() === predictions[n].class.toLowerCase()
              ) !== -1;

            if (isInSeason) {
              p.innerText = "In season: " + predictions[n].class;
            } else {
              continue;
            }
            // Draw in top left of bounding box outline.
            p.setAttribute(
              "style",
              "left: " +
                predictions[n].bbox[0] +
                "px;" +
                "top: " +
                predictions[n].bbox[1] +
                "px;" +
                "width: " +
                (predictions[n].bbox[2] - 10) +
                "px;"
            );

            // Draw the actual bounding box.
            const highlighter = document.createElement("div");
            highlighter.setAttribute("class", "highlighter");
            highlighter.setAttribute(
              "style",
              "left: " +
                predictions[n].bbox[0] +
                "px; top: " +
                predictions[n].bbox[1] +
                "px; width: " +
                predictions[n].bbox[2] +
                "px; height: " +
                predictions[n].bbox[3] +
                "px;"
            );

            this.liveView?.appendChild(highlighter);
            this.liveView?.appendChild(p);

            // Store drawn objects in memory so we can delete them next time around.
            this.children.push(highlighter);
            this.children.push(p);
          }
        }

        // Call this function again to keep predicting when the browser is ready.
        window.requestAnimationFrame(this.predictWebcam);
      });
    },
  },
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */

/******************************************************
 * Stylesheet by Jason Mayes 2020.
 *
 * Got questions? Reach out to me on social:
 * Twitter: @jason_mayes
 * LinkedIn: https://www.linkedin.com/in/creativetech
 *****************************************************/

.videoView {
  position: relative;
  float: left;
  width: 100%;
  padding: 8px;
  box-sizing: border-box;

  video {
    width: 100%;
    height: auto;
  }

  p {
    position: absolute;
    padding: 8px;
    background-color: rgba(255, 111, 0, 0.85);
    color: #fff;
    border: 1px dashed rgba(255, 255, 255, 0.7);
    z-index: 2;
    margin: 0;
  }
}

.highlighter {
  background: rgba(0, 255, 0, 0.25);
  border: 1px dashed #fff;
  z-index: 1;
  position: absolute;
  overflow: hidden;
}
</style>

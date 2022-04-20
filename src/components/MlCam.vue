<template>
  <div id="liveView" class="videoView">
    <button id="webcamButton">Enable Webcam</button>
    <video id="webcam" autoplay=""></video>
  </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";

import "@tensorflow/tfjs-backend-cpu";
import "@tensorflow/tfjs-backend-webgl";

import * as cocoSsd from "@tensorflow-models/coco-ssd";

export default defineComponent({
  name: "MlCam",
  mounted() {
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

    /********************************************************************
     * Demo created by Jason Mayes 2020.
     *
     * Got questions? Reach out to me on social:
     * Twitter: @jason_mayes
     * LinkedIn: https://www.linkedin.com/in/creativetech
     ********************************************************************/

    let model:
      | { detect: (arg0: HTMLElement | null) => Promise<any> }
      | undefined = undefined;

    // Before we can use COCO-SSD class we must wait for it to finish
    // loading. Machine Learning models can be large and take a moment to
    // get everything needed to run.
    cocoSsd.load().then(function (loadedModel: any) {
      model = loadedModel;
    });

    /********************************************************************
// Demo 2: Continuously grab image from webcam stream and classify it.
// Note: You must access the demo on https for this to work:
// https://tensorflow-js-image-classification.glitch.me/
********************************************************************/

    const video = document.getElementById("webcam");
    const liveView = document.getElementById("liveView");

    // Check if webcam access is supported.
    function hasGetUserMedia() {
      return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
    }

    // Keep a reference of all the child elements we create
    // so we can remove them easilly on each render.
    const children: any[] = [];

    // If webcam supported, add event listener to button for when user
    // wants to activate it.
    if (hasGetUserMedia()) {
      const enableWebcamButton = document.getElementById("webcamButton");
      enableWebcamButton?.addEventListener("click", enableCam as any);
    } else {
      console.warn("getUserMedia() is not supported by your browser");
    }

    // Enable the live webcam view and start classification.
    function enableCam(event: {
      target: { classList: { add: (arg0: string) => void } };
    }) {
      if (!model) {
        console.log("Wait! Model not loaded yet.");
        return;
      }

      // Hide the button.
      event.target.classList.add("removed");

      // getUsermedia parameters.
      const constraints = {
        video: true,
      };

      // Activate the webcam stream.
      navigator.mediaDevices.getUserMedia(constraints).then(function (stream) {
        if (!video) {
          console.log("No video element found.");
          return;
        }
        (video as any).srcObject = stream;
        video?.addEventListener("loadeddata", predictWebcam);
      });
    }

    // Prediction loop!
    function predictWebcam() {
      // Now let's start classifying the stream.
      model?.detect(video).then(function (predictions: string | any[]) {
        // Remove any highlighting we did previous frame.
        for (let i = 0; i < children.length; i++) {
          liveView?.removeChild(children[i]);
        }
        children.splice(0);

        // Now lets loop through predictions and draw them to the live view if
        // they have a high confidence score.
        for (let n = 0; n < predictions.length; n++) {
          // If we are over 66% sure we are sure we classified it right, draw it!
          if (predictions[n].score > 0.66) {
            const p = document.createElement("p");
            console.log(
              predictions[n].class +
                " - with " +
                Math.round(parseFloat(predictions[n].score) * 100) +
                "% confidence."
            );
            p.innerText =
              predictions[n].class +
              " - with " +
              Math.round(parseFloat(predictions[n].score) * 100) +
              "% confidence.";
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

            liveView?.appendChild(highlighter);
            liveView?.appendChild(p);

            // Store drawn objects in memory so we can delete them next time around.
            children.push(highlighter);
            children.push(p);
          }
        }

        // Call this function again to keep predicting when the browser is ready.
        window.requestAnimationFrame(predictWebcam);
      });
    }
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
  width: 48%;
  margin: 2% 1%;
  cursor: pointer;
}

.videoView p {
  position: absolute;
  padding: 8px;
  background-color: rgba(255, 111, 0, 0.85);
  color: #fff;
  border: 1px dashed rgba(255, 255, 255, 0.7);
  z-index: 2;
  margin: 0;
}

.highlighter {
  background: rgba(0, 255, 0, 0.25);
  border: 1px dashed #fff;
  z-index: 1;
  position: absolute;
}
</style>

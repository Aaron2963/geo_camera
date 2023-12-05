<template>
  <div class="container">
    <h1>Stream</h1>
    <canvas ref="canvas"></canvas>
    <video ref="video" autoplay @click.stop="snapshot"></video>
    <img ref="img">
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const canvas = ref(null), video = ref(null), img = ref(null)
let ctx = null

if (navigator.mediaDevices === undefined) {
  navigator.mediaDevices = {}
}

if (navigator.mediaDevices.getUserMedia === undefined) {
  navigator.mediaDevices.getUserMedia = function (constraints) {
    const getUserMedia = navigator.webkitGetUserMedia || navigator.mozGetUserMedia
    if (!getUserMedia) {
      return Promise.reject(new Error('getUserMedia is not implemented!'))
    }
    return new Promise(function (resolve, reject) {
      getUserMedia.call(navigator, constraints, resolve, reject)
    })
  }
}

function snapshot() {
  ctx.drawImage(video.value, 0, 0, canvas.value.width, canvas.value.height)
  img.value.src = canvas.value.toDataURL('image/png')
}


onMounted(() => {
  const constraints = {
    video: {
      facingMode: {
        exact: 'environment'
      }
    }
  }
  navigator.mediaDevices.getUserMedia(constraints)
    .then(function (stream) {
      video.value.srcObject = stream
      video.value.play()
    })
    .catch(function (err) {
      console.log(err)
    })
})
</script>

<style scoped>
video {
  width: 100%;
  height: 500px;
  object-fit: cover;
  background-color: #999;
}

canvas {
  width: 100%;
  height: 500px;
  background-color: #999;
}

img {
  width: 100%;
  height: 500px;
  object-fit: contain;
  background-color: #999;
}
</style>
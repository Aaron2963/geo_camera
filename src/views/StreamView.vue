<template>
  <div class="container">
    <h1>Stream</h1>
    <div>Current position: ({{ latitude }}, {{ longitude }})</div>
    <div v-show="captureMode">
      <camera ref="cam" :resolution="{ width: 600, height: 600 }" autoplay />
    </div>
    <img v-show="!captureMode" ref="preview" id="preview" />
    <div class="camera-buttons" v-if="captureMode">
      <button type="button" @click="snapshot">CAPTURE</button>
      <button type="button" @click="changeCamera">CHANGE CAMERA</button>
    </div>
    <form ref="form" v-show="!captureMode" @submit.prevent="submit">
      <input ref="file" type="file" name="file" id="file" style="display:none">
      <input type="hidden" name="latitude" :value="latitude">
      <input type="hidden" name="longitude" :value="longitude">
      <div class="form-field">
        <label for="name">Name</label>
        <input type="text" id="name" name="name" />
      </div>
      <div class="buttons">
        <button type="reset" @click="clear">CLEAR</button>
        <button type="submit">SAVE</button>
      </div>
    </form>
    <div ref="messageBox" id="message">{{ message }}</div>
  </div>
</template>

<script setup>
import { db } from '../db'
import Camera from 'simple-vue-camera'
import { ref, onMounted } from 'vue'

const cam = ref(null), preview = ref(null), file = ref(null), form = ref(null), messageBox = ref(null), message = ref(''), latitude = ref(0), longitude = ref(0)
const captureMode = ref(true)

function setFile(blob) {
  const f = new File([blob], 'photo.jpg', { type: 'image/jpeg', lastModified: new Date().getTime() })
  const container = new DataTransfer()
  container.items.add(f)
  file.value.files = container.files
}

async function snapshot() {
  if (!captureMode.value) return
  const blob = await cam.value?.snapshot()
  setFile(blob)
  preview.value.src = URL.createObjectURL(blob)
  captureMode.value = false
  await cam.value?.stop()
}

async function clear() {
  await cam.value?.start()
  captureMode.value = true
  preview.value.src = ''
}

async function changeCamera() {
  const devices = await cam.value?.devices(["videoinput"]),
    currentDeviceId = cam.value?.currentDeviceID(),
    device = devices.find((d) => d.deviceId !== currentDeviceId)
  cam.value?.changeCamera(device.deviceId)
}

async function submit(ev) {
  ev.preventDefault()
  const fd = new FormData(form.value)
  const data = {
    ...Object.fromEntries(fd),
    createdAt: new Date(),
  }
  await db.table('photos').add(data)
  clear()
  showMessage('Saved!')
}

function showMessage(msg) {
  message.value = msg
  messageBox.value.classList.add('show')
  setTimeout(() => {
    messageBox.value?.classList.remove('show')
  }, 5000)
}

onMounted(async () => {
  if (!navigator.geolocation) {
    showMessage('Geolocation is not supported by your browser')
    return
  }
  navigator.geolocation.getCurrentPosition((position) => {
    latitude.value = position.coords.latitude
    longitude.value = position.coords.longitude
  }, () => {
    showMessage('Unable to retrieve your location')
  })
})
</script>

<style scoped>
.hidden {
  display: none !important;
}

.camera-buttons {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
}

#preview {
  max-width: 100%;
  object-fit: contain;
}


form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 400px;
  max-width: 100%;
  margin-top: 1rem;
}

.form-field {
  display: flex;
  gap: 0.25rem;
}

.form-field input {
  flex: 1;
}

form .buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

#message {
  margin: 2rem auto 0;
  padding: 1rem;
  border: 1px solid #999;
  border-radius: 0.5rem;
  box-shadow: 0 0 0.5rem #999;
  opacity: 0;
  transition: opacity 0.5s ease-in-out;
}

#message.show {
  opacity: 1;
}
</style>
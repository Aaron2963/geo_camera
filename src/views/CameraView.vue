<template>
  <div class="container">
    <h1>CAMERA</h1>
    <div class="preview-wrapper">
      <img ref="preview" id="preview" @click="capture" />
    </div>
    <form ref="form" @submit.prevent="submit">
      <div>Current position: ({{ latitude }}, {{ longitude }})</div>
      <input ref="file" name="file" type="file" accept="image/*" capture @change="loadImage">
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
import { ref, onMounted } from 'vue'

const form = ref(null), file = ref(null), preview = ref(null), messageBox = ref(null), message = ref(''), latitude = ref(0), longitude = ref(0)

function capture() {
  file.value.click()
}

function loadImage(ev) {
  const file = ev.target.files[0]
  const reader = new FileReader()
  if (!file) {
    preview.value.src = ''
    return
  }
  reader.onload = (ev) => {
    preview.value.src = ev.target.result
  }
  reader.readAsDataURL(file)
}

function clear() {
  preview.value.src = ''
  form.value.reset()
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
#preview {
  width: 400px;
  max-width: 100%;
  min-height: 200px;
  background-color: #eee;
  margin: 1rem auto;
  display: block;
  cursor: pointer;
}

input[type="file"] {
  display: none;
}

form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 400px;
  max-width: 100%;
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
<template>
  <div class="container">
    <h1>ALBUM ({{ count }})</h1>
    <button type="button" @click="addSampleRow">ADD SAMPLE</button>
    <div class="cards">
      <div v-for="(row, i) in rows" :key="`row-${i}`" class="card">
        <img :src="getImageSource(row)">
        <div class="card-body">
          <strong>{{ row.name }}</strong>
          <small>{{ row.createdAt.toISOString().substring(0, 16) }}</small>
          <small>@({{ row.latitude ?? 0 }}, {{ row.longitude ?? 0 }})</small>
        </div>
        <button class="remove" type="button" @click="removeRow(row.id)">&times;</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { db } from '../db'
import { ref, onMounted, computed } from 'vue'

const rows = ref([])
const count = computed(() => rows.value.length)

async function addSampleRow() {
  const name = 'S' + (Math.random() * 100000).toFixed(0)
  await db.table('photos').add({
    name: name,
    path: `https://picsum.photos/seed/${name}/200`,
    latitude: (Math.random() * 90 - 45).toFixed(7),
    longitude: (Math.random() * 180 - 90).toFixed(7),
    createdAt: new Date(),
  })
  query()
}

async function query() {
  rows.value = await db.table('photos').toArray()
}

function getImageSource(row) {
  if (row.path) return row.path
  if (row.file) return URL.createObjectURL(row.file)
  return ''
}

async function removeRow(id) {
  await db.table('photos').delete(id)
  query()
}

onMounted(async () => {
  query()
})
</script>

<style scoped>
.cards {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 1rem;
  margin-top: 1rem;
  margin-bottom: 1rem;
}

.card {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  border: 1px solid #999;
  border-radius: 0.5rem;
  box-shadow: 0 0 0.5rem #999;
}

.card img {
  height: 200px;
  width: 200px;
  object-fit: contain;
  border-radius: 0.5rem 0.5rem 0 0;
  background-color: #999;
}

.card-body {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  align-items: center;
  padding: 0.5rem;
}

.card .remove {
  position: absolute;
  top: 0;
  right: 0;
  border: none;
  background-color: #f00;
  color: #fff;
  font-size: 1.5rem;
  line-height: 1;
  padding: 0.25rem 0.5rem;
  border-radius: 0 0 0 0.5rem;
  cursor: pointer;
}
</style>
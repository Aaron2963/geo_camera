import Dexie from 'dexie'

export const db = new Dexie('geo-camera')

db.version(1).stores({
  photos: '++id, name, path, latitude, longitude, createdAt'
})

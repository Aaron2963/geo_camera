import { createRouter, createWebHistory } from 'vue-router'
import AlbumView from '../views/AlbumView.vue'
import CameraView from '../views/CameraView.vue'
import StreamView from '../views/StreamView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'album',
      component: AlbumView
    },
    {
      path: '/camera',
      name: 'camera',
      component: CameraView
    },
    {
      path: '/stream',
      name: 'stream',
      component: StreamView
    }
  ]
})

export default router

import Home from './views/Home.vue'
import Stops from './views/Stops.vue'
import {createRouter, createWebHashHistory} from 'vue-router'

const routes = [
  { path: '/', component: Home },
  { path: '/stops', component: Stops },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router

import Home from './views/Home.vue'
import Stops from './views/Stops.vue'
import {createRouter, createWebHashHistory} from 'vue-router'

export const routes = [
  { path: '/', component: Home, name: "Főoldal", icon: "mdi-home" },
  { path: '/stops', component: Stops, name: "Megállók", icon: "mdi-stop"},
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router

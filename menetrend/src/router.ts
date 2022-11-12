import Routes from './views/Routes.vue'
import Stops from './views/Stops.vue'
import {createRouter, createWebHashHistory} from 'vue-router'

export const routes = [
  { path: '/', component: Routes, name: "Járatok", icon: "mdi-bus" },
  { path: '/stops', component: Stops, name: "Megállók", icon: "mdi-stop"},
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router

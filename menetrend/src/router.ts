import Routes from '@/views/Routes.vue'
import Stops from '@/views/Stops.vue'
import Route from '@/views/Route.vue'
import {createRouter, createWebHashHistory } from 'vue-router'

export const routes = [
  { path: '/', component: Routes, name: "Járatok"},
  { path: '/stops', component: Stops, name: "Megállók"},
  { path: '/route', component: Route, name: "route",  props: (route : any) => ({ route_number: route.query.route_number })},
] 

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router

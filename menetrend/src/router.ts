import Routes from '@/views/Routes.vue'
import Stops from '@/views/Stops.vue'
import Stop from '@/views/Stop.vue'
import Route from '@/views/Route.vue'
import Edit from '@/views/EditRoute.vue'
import {createRouter, createWebHashHistory } from 'vue-router'

export const routes = [
  { path: '/', component: Routes, name: "Járatok"},
  { path: '/stops', component: Stops, name: "Megállók"},
  { path: '/route', component: Route, name: "route",  props: (route : any) => ({ route_number: route.query.route_number })},
  { path: '/stop', component: Stop, name: "stop",  props: (route : any) => ({ stop_name: route.query.stop_name })},
  { path: '/edit', component: Edit, name: "edit",  props: (route : any) => ({ route_number: route.query.route_number })},
] 

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router

<script lang="ts">
import { defineComponent } from 'vue'
import axios from "axios"
import { IVehicleTypeInfo, IRouteNumber } from "../types"

export default defineComponent({
	async setup(props) {
		const vehicle_types: IVehicleTypeInfo[] = (await axios.get(import.meta.env.VITE_API_URL + "/vehicle_types")).data
		console.log(vehicle_types)
		const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
		const route_array: IRouteNumber[] = await Promise.all(
			vehicle_types.map(async (r: IVehicleTypeInfo) => (await axios.get(import.meta.env.VITE_API_URL + "/routes",
				{ params: { type: r.id } })).data))

		const routes = Object.fromEntries(vehicle_types.map((vtype, i) => [vtype.id, route_array[i]]))

		const view_route = (r: string) => {
			console.log(r);
		}

		return {
			vehicle_types,
			routes,
			capitalize,
			view_route
		}
	}
})

</script>

<template>
	<v-card max-width="800">
		<v-list-item v-for="type in vehicle_types" :key="type.id">
			<h3 class="text-overline">{{type.nev}}</h3>
			<v-container class="routes-container flex-wrap">
				<v-chip size="x-large" variant="outlined" v-for="route in routes[type.id]" :key="route" :color="'#'+type.szin" @click="view_route(route)">
					{{route.jaratszam}}
				</v-chip>
			</v-container>
		</v-list-item>
	</v-card>
</template>

<style scoped>
.routes-container {
	display: flex;
	gap: 10px;
}
</style>
<script lang="ts">
import { defineComponent } from 'vue'
import { get } from '@/utils/db-functions'
import { IVehicleTypeInfo, IRouteNumber } from "@/types"
import RouteChip from '@/components/RouteChip.vue';

export default defineComponent({
	components: { RouteChip },
	async setup(props) {

		const vehicle_types: IVehicleTypeInfo[] = await get("vehicle_types");

		const route_array: IRouteNumber[] = await Promise.all(vehicle_types.map(async r => await get("routes", { type: r.id })))

		const routes = Object.fromEntries(vehicle_types.map((vtype, i) => [vtype.id, route_array[i]]))

		return {
			vehicle_types,
			routes,
		}
	}
})

</script>

<template>
	<v-card max-width="1100">
		<v-list-item v-for="type in vehicle_types" :key="type.id">
			<h3 class="text-overline">{{type.nev}}</h3>
			<v-container class="routes-container flex-wrap">
				<route-chip  v-for="route in routes[type.id]" :route_number="route.jaratszam" :key="route"/>
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
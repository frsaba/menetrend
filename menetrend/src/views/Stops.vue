<script lang="ts">
import { defineComponent } from 'vue'
import { get } from '@/utils/db-functions'
import { IVehicleTypeInfo, IRouteNumber, IStopInfo } from "@/types"
import { useRouter } from 'vue-router';
import 'vue-good-table-next/dist/vue-good-table-next.css'
import { VueGoodTable } from 'vue-good-table-next';
// add to component



export default defineComponent({
	components: {
		VueGoodTable,
	},
	async setup(props) {
		const router = useRouter();

		const vehicle_types: IVehicleTypeInfo[] = await get("vehicle_types");

		// const route_array: IRouteNumber[] = await Promise.all(vehicle_types.map(async r => await get("routes", { type: r.id })))

		// const routes = Object.fromEntries(vehicle_types.map((vtype, i) => [vtype.id, route_array[i]]))

		const stops: IStopInfo[] = await get("stops");
		const headers = [
			{
				label: 'Megállónév',
				align: 'start',
				field: 'megallonev',
			},
			{ label: 'Cím', field: 'cim' },
		]

		const view_route = (r: string) => {
			router.push({ path: "/route", params: { routename: r } })
		}

		return {
			vehicle_types,
			stops,
			headers,
			view_route
		}
	}
})

</script>

<template>
	<v-card max-width="800" class="mt-3">
		<vue-good-table
			:columns="headers"
			:rows="stops" 
			:search-options="{enabled: true, placeholder: 'Keresés',}" />

	</v-card>
</template>

<style scoped>
.routes-container {
	display: flex;
	gap: 10px;
}
</style>
<script lang="ts">
import { defineComponent, ref, Ref } from 'vue'
import { get, post } from '@/utils/db-functions'
import { IVehicleTypeInfo, IRouteNumber, IStopInfo } from "@/types"
import { useRouter } from 'vue-router';
import 'vue-good-table-next/dist/vue-good-table-next.css'
import { VueGoodTable } from 'vue-good-table-next';
import RouteChip from '@/components/RouteChip.vue';
import VehicleTypeChip from '@/components/VehicleTypeChip.vue';
// add to component



export default defineComponent({
	components: {
		VueGoodTable,
		RouteChip,
		VehicleTypeChip,
	},
	async setup(props) {
		const router = useRouter();

		const vehicle_types: IVehicleTypeInfo[] = await get("vehicle_types");

		// const route_array: IRouteNumber[] = await Promise.all(vehicle_types.map(async r => await get("routes", { type: r.id })))

		// const routes = Object.fromEntries(vehicle_types.map((vtype, i) => [vtype.id, route_array[i]]))

		const stops: IStopInfo[] = await get("stops");
		const headers = [
			{ label: 'Megállónév', align: 'start', field: 'megallonev' },
			{ label: 'Cím', field: 'cim' },
			{ label: '', field: 'edit' },
			{ label: '', field: 'compatibility' },
			{ label: 'Járatok', field: 'jaratok' },
		]

		const edited_stop: Ref<undefined | IStopInfo> = ref(undefined)
		function edit_stop(stop: IStopInfo) {
			edited_stop.value = stop
			new_stop_address.value = stop.cim;
			new_stop_name.value = stop.megallonev;
		}

		async function submit() {
			// edited_stop.value = stop
			const res = await post("updatestop", {
				old_name: edited_stop.value?.megallonev,
				new_name: new_stop_name.value,
				new_address: new_stop_address.value
			})
			// console.log(res)
			if (res.success) {
				edited_stop.value!.megallonev = new_stop_name.value;
				edited_stop.value!.cim = new_stop_address.value;
				edited_stop.value = undefined;
			}
		}

		const view_stop = (stop: string) => {
			router.push({ name: "stop", query: { stop_name: stop } })
		}

		const new_stop_address = ref("")
		const new_stop_name = ref("")

		return {
			vehicle_types,
			stops, headers,
			view_stop, edit_stop, submit,
			edited_stop, new_stop_address, new_stop_name
		}
	}
})

</script>

<template>
	<div class="mx-auto d-flex wrapper">
		<vue-good-table
			max-width="1300"
			:columns="headers"
			:rows="stops"
			max-height="75%"
			:search-options="{enabled: true, placeholder: 'Keresés',}"
			:pagination-options="{
				enabled: true,
				mode: 'records',
				perPage: 10,
				nextLabel: 'Következő',
				prevLabel: 'Előző',
				ofLabel: ' | összesen',
				rowsPerPageLabel: 'Oldalanként',
				allLabel: 'All', 
			}">
			<template #table-row="props">
				<div class="flex-wrap routes-container" v-if="props.column.field == 'jaratok'">
					<route-chip v-for="route in props.row.jaratok" :route_number="route" :key="route" />
				</div>
				<div class="flex-wrap routes-container" v-if="props.column.field == 'compatibility'">
					<vehicle-type-chip size="x-small" v-for="t in props.row.befogad" :key="props.row.megallonev + t" :type="t" />
				</div>

				<!-- EDIT MODE -->
				<template v-if="edited_stop == props.row">
					<v-btn v-if="props.column.field == 'edit'" icon="mdi-content-save" color="success" @click="submit"></v-btn>
					<v-text-field v-else-if="props.column.field == 'megallonev'" v-model="new_stop_name" />
					<v-textarea v-else-if="props.column.field == 'cim'" v-model="new_stop_address" rows="2" />

				</template>

				<!-- DISPLAY MODE -->
				<template v-else>
					<v-btn v-if="props.column.field == 'edit' && !edited_stop" variant="plain" icon="mdi-pencil" @click="edit_stop(props.row)"></v-btn>
					<v-btn v-else-if="props.column.field == 'megallonev'" variant="plain" @click="view_stop(props.row.megallonev)">{{props.row.megallonev}}</v-btn>
					<span class="text-caption" v-else-if="props.column.field == 'cim'">
						{{props.formattedRow[props.column.field]}}
					</span>
				</template>

			</template>
		</vue-good-table>

	</div>
</template>

<style scoped>
.routes-container {
	display: flex;
	gap: 10px;
	align-content: center;
	min-height: 48px;
}
.wrapper {
	width: 100%;
}
</style>
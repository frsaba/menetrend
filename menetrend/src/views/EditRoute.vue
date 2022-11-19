<script lang="ts">
import { get, get_route_color } from '@/utils/db-functions';
import { computed, defineComponent, onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import _ from 'lodash';
import RouteChip from '@/components/RouteChip.vue';
import 'vue-good-table-next/dist/vue-good-table-next.css'
import { VueGoodTable } from 'vue-good-table-next';

export default defineComponent({
	components: { RouteChip, VueGoodTable },
	props: {
		route_number: String
	},
	async setup(props) {
		if (props.route_number == undefined || props.route_number == "") {
			const router = useRouter();
			router.push("/");
		}

		const departure_times = await get("departures", { route: props.route_number });
		const terminal_stops = [
			(await get("firststop", { route: props.route_number })).megallo,
			(await get("laststop", { route: props.route_number })).megallo
		];

		const color = await get_route_color(props.route_number);
		let path = await get("path", { route: props.route_number });

		const selected_stop = ref(path[0])

		const headers = [
			{
				label: 'Irány',
				align: 'start',
				field: 'irany',
			},
			{ label: 'Időpont', field: 'ora' },
		]


		console.log(terminal_stops)
		return {
			color,
			path,
			departure_times,
			terminal_stops,
			headers
		}
	},
})

</script>
<template>
	<div>
		<v-card class="route-header d-flex align-center ma-1 pa-2 mb-10">
			<h1>Szerkesztés</h1>
			<route-chip :route_number="route_number"></route-chip>
		</v-card>
		<div class="d-flex">

			<vue-good-table
				:columns="headers"
				:rows="departure_times"
				:pagination-options="{
					enabled: true,
					mode: 'records',
					perPage: 10,
					nextLabel: 'Következő',
					prevLabel: 'Előző',
					ofLabel: ' | összesen',
					allLabel: 'All', 
					rowsPerPageLabel: 'Oldalanként'
					}"
				styleClass="vgt-table condensed"
				:sort-options="{enabled: false}">
				>
				<template #table-row="props">
					<span v-if="props.column.field == 'irany'">
						{{terminal_stops[1- props.row.irany]}} > {{terminal_stops[props.row.irany]}}
					</span>
					<v-chip v-else variant="outlined" size="large" color="grey"> {{pad2(props.row.ora)}}:{{pad2(props.row.perc)}}</v-chip>
				</template>
			</vue-good-table>

		</div>
	</div>
</template>

<style scoped>
.minutes-container {
	display: flex;
	gap: 5px;
	align-items: center;
}
.route-header {
	gap: 15px;
}
</style>
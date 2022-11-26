<script lang="ts">
import { get, post, get_route_color } from '@/utils/db-functions';
import { computed, defineComponent, onMounted, Ref, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import _ from 'lodash';
import RouteChip from '@/components/RouteChip.vue';
import PathItem from '@/components/PathItem.vue'
import 'vue-good-table-next/dist/vue-good-table-next.css'
import { VueGoodTable } from 'vue-good-table-next';
import { IArrivalInfo, IDepartureInfo, IStopInfo } from '@/types';

export default defineComponent({
	components: { RouteChip, VueGoodTable, PathItem },
	props: {
		route_number: String
	},
	async setup(props) {
		if (props.route_number == undefined || props.route_number == "") {
			const router = useRouter();
			router.push("/");
		}

		const departure_times: Ref<IDepartureInfo[]> = ref(await get("departures", { route: props.route_number }));


		const color = await get_route_color(props.route_number);
		let path : Ref<IArrivalInfo[]> = ref(await get("path", { route: props.route_number }));

		const stops = await get("compatiblestops", { route: props.route_number });

		const first_stop = computed(() => _.first(path.value))
		const last_stop = computed(() => _.last(path.value))

		const terminal_stops = computed(() => [first_stop.value?.megallo, last_stop.value?.megallo]);


		async function delete_departure(row: IDepartureInfo) {
			console.log(row)
			let res = await post("deletedeparture", { route: props.route_number, hour: row.ora, minute: row.perc, direction: row.irany })
			console.log(res)
			if (row.originalIndex != undefined)
				departure_times.value.splice(row.originalIndex, 1)
		}


		const headers = [
			{ label: 'Irány', align: 'start', field: 'irany', },
			{ label: 'Időpont', field: 'ora' },
			{ label: '', field: 'delete' },
		]

		const new_stop_dialog = ref(false);
		const new_stop_form = ref(false);
		const new_stop_time = ref(last_stop.value?.erkezes);
		const new_stop_stop_name = ref("");

		async function new_stop_submit() {
			if(new_stop_time.value && last_stop.value && new_stop_time.value < last_stop.value.erkezes){
				new_stop_time.value = last_stop.value.erkezes;
			}

			const stop_number = path.value.length;
			let res = await post("addstoptopath", { route: props.route_number, stop: new_stop_stop_name.value, arrival: new_stop_time.value, stop_number})
			console.log(res)
			if(res.success) new_stop_dialog.value = false;
			path.value = await get("path", { route: props.route_number })
		}


		// console.log(terminal_stops)
		return {
			color,
			path,
			departure_times,
			first_stop, last_stop, terminal_stops,
			headers,
			delete_departure,
			new_stop_dialog, new_stop_form, new_stop_submit, new_stop_time, new_stop_stop_name,
			stops
		}
	},
})

</script>
<template>
	<div>
		<v-card class="route-header d-flex align-center ma-1 pa-5 mb-10">
			<h1>Szerkesztés</h1>
			<route-chip :route_number="route_number" size="large"></route-chip>
		</v-card>

		<v-expansion-panels class="panel" variant="inset">
			<v-expansion-panel>
				<v-expansion-panel-title>
					Útvonal
					<v-spacer></v-spacer>

					<v-dialog
						v-model="new_stop_dialog">
						<template v-slot:activator="{ props }">
							<v-btn class="mx-2" color="primary" v-bind="props">
								<v-icon left>mdi-plus</v-icon> Új megálló
							</v-btn>
						</template>

						<v-card class="mx-auto pa-3" min-width="350" max-width="600">
							<v-card-title>
								Megálló hozzáadása
							</v-card-title>
							<v-form v-model="new_stop_form" @submit.prevent="new_stop_submit">
								<v-autocomplete
									label="Megálló"
									v-model="new_stop_stop_name"
									:items="stops"></v-autocomplete>

								<v-text-field class="shrink"
									v-model.number="new_stop_time"
									hide-details
									single-line
									type="number"
									width="50px"
									suffix="perc" 
									:min="last_stop?.erkezes"/>

								<v-btn
									:disabled="!new_stop_form" block color="success" size="large" type="submit" variant="elevated"> Küldés
								</v-btn>
							</v-form>
						</v-card>
					</v-dialog>

				</v-expansion-panel-title>
				<v-expansion-panel-text>
					<path-item v-for="(stop, i) in path" :key="stop.megallo"
						:stop_name="stop.megallo" :arrival_time="stop.erkezes" :stop_number="i"></path-item>
				</v-expansion-panel-text>
			</v-expansion-panel>

			<v-expansion-panel title="Indulások">
				<v-expansion-panel-text>

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
							<v-btn variant="plain" v-else-if="props.column.field == 'delete'" color="error" @click="delete_departure(props.row)" icon="mdi-delete"></v-btn>
							<v-chip v-else variant="outlined" size="large" color="grey"> {{pad2(props.row.ora)}}:{{pad2(props.row.perc)}}</v-chip>
						</template>
					</vue-good-table>
				</v-expansion-panel-text>
			</v-expansion-panel>

		</v-expansion-panels>

	</div>
</template>

<style scoped>
.minutes-container {
	display: flex;
	gap: 5px;
	align-items: center;
}
.route-header {
	min-width: 1000px;
	gap: 25px;
}
.panel {
	min-width: 700px;
}
</style>
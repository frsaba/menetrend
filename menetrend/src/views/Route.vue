<script lang="ts">
import { get, get_route_color } from '@/utils/db-functions';
import { computed, defineComponent, onMounted, ref, watch, Ref } from 'vue'
import { useRouter } from 'vue-router'
import _ from 'lodash';
import RouteChip from '@/components/RouteChip.vue';
import { IStopInfo } from '@/types';

export default defineComponent({
	components: { RouteChip },
	props: {
		route_number: String
	},
	async setup(props) {
		const router = useRouter();
		if (props.route_number == undefined || props.route_number == "") {
			router.push("/");
		}

		const edit_route = () => {
			router.push({ name: "edit", query: { route_number: props.route_number } })
		}

		const color = await get_route_color(props.route_number);
		let path = await get("path", { route: props.route_number });
		// let path_reversed = path.reverse();

		const selected_stop : Ref<any> = ref(undefined)

		let first_stop = ref(path[0]) //I would use computed here, except it doesnt update when path direction is switched
		let last_stop = ref(_.last(path))

		const timetable = ref({});

		const direction = ref(true);

		watch(selected_stop, update_timetable)
		watch(direction, () =>{
			// for some reason selected stop needs to be reassigned for the route path to be reactive. Don't ask
			// let tmp = selected_stop.value;
			
			path.reverse();
			selected_stop.value = path[0];
			update_timetable();
		} )

		async function update_timetable() {
			if(selected_stop.value == undefined) return;
			// console.log(selected_stop)
			first_stop.value = path[0];
			last_stop.value = _.last(path) 
			let times: { ora: number, perc: number }[] =
				await get("timetable", { route: props.route_number, stop: selected_stop.value.megallo, direction: direction.value ? 1 : 0 })
			timetable.value = _.groupBy(times, x => x.ora)
		}


		// console.log(path)
		return {
			color,
			path,
			selected_stop,
			timetable,
			direction,
			first_stop, last_stop,
			edit_route
		}
	},
	onMounted() {
		this.selected_stop = this.path[0]
	}
})

</script>
<template>
	<div>
		<v-card class="route-header d-flex align-center ma-1 pa-2 mb-10">
			<route-chip :route_number="route_number" size="x-large"></route-chip>
			<span class="terminal">{{first_stop?.megallo}}</span>
			<v-btn color="success" size="small" variant="outlined" icon="mdi-arrow-left-right-bold" @click="direction = !direction"></v-btn>
			<span class="terminal">{{last_stop?.megallo}}</span>
			<v-btn color="primary" variant="plain" icon="mdi-pencil" @click="edit_route"></v-btn>
		</v-card>
		<div class="d-flex align-start">
			<div class="path">
				<div class="halo">
				<v-timeline side="end" align="start" truncate-line="both" >
					<v-timeline-item class="item" v-for="(stop, index) in path" :key="stop.megallo + index+direction" :dot-color="color" 
						v-bind:class="{ selected: selected_stop?.megallo == stop.megallo }"
						:size="selected_stop?.megallo == stop.megallo ? 'small' : 'x-small'" @click="selected_stop = stop">
						<template v-slot:opposite>
							<span class="minute">{{ direction ? stop.erkezes : first_stop.erkezes - stop.erkezes}}</span>
						</template>
						<div>
							<div>{{stop.megallo}}</div>
						</div>
					</v-timeline-item>
				</v-timeline>
				</div>
			</div>
			<v-table v-if="Object.keys(timetable).length > 0" density="compact">
				<thead>
					<tr>
						<th class="text-left">
							Óra
						</th>
						<th class="text-left">
							Perc
						</th>
					</tr>
				</thead>
				<tbody>
					<tr
						v-for="(times, hour) in timetable" :key="hour">
						<td> {{hour}} </td>
						<td class="minutes-container">
							<v-chip variant="outlined" size="small" color="grey" v-for="item in times" :key="item.perc">{{(item.perc + "").padStart(2, "0")}}</v-chip>
						</td>
					</tr>
				</tbody>
			</v-table>

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
	gap: 30px;
	min-width: 1000px;
}
.item:hover {
	color: gray;
	cursor: pointer;
}
.terminal{
	min-width: 15em;
	text-align: center;
}
.v-timeline--vertical.v-timeline {
    grid-row-gap: 12px;
    height: 100%;
}
.selected{
	color: gray;
	font-size: 1.1em;
	text-decoration: underline !important;
}
.path{
	width: 500px;
}
.halo{
	width: 400px;
}
</style>
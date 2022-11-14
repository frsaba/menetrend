<script lang="ts">
import { get, get_route_color } from '@/utils/db-functions';
import { computed, defineComponent, onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import _, { update } from 'lodash';
import RouteChip from '@/components/RouteChip.vue';

export default defineComponent({
	components: { RouteChip },
	props: {
		route_number: String
	},
	async setup(props) {
		if (props.route_number == undefined || props.route_number == "") {
			const router = useRouter();
			router.push("/");
		}

		const color = await get_route_color(props.route_number);
		const path = await get("path", { route: props.route_number });

		const selected_stop = ref(path[0])

		const first_stop = computed(() => direction.value ? path[0] : _.last(path))
		const last_stop = computed(() => direction.value ? _.last(path) : path[0])

		const timetable = ref({});

		const direction = ref(true);

		watch(selected_stop, update_timetable)
		watch(direction, update_timetable)
		// watch(direction, () => path = path.reverse())

		async function update_timetable() {
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
			first_stop, last_stop
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
			<route-chip :route_number="route_number"></route-chip>
			{{first_stop.megallo}}
			<v-btn color="success" icon="mdi-arrow-left-right-bold" @click="direction = !direction"></v-btn>
			{{last_stop.megallo}}
		</v-card>
		<div class="d-flex">

			<v-timeline side="end" align="start" truncate-line="both">
				<v-timeline-item v-for="stop in path" :key="stop.megallo" :dot-color="color" :size="selected_stop.megallo == stop.megallo ? 'small' : 'x-small'" @click="selected_stop = stop">
					<template v-slot:opposite>
						{{stop.erkezes}}
					</template>
					<div>
						<div class="text-overline">{{stop.megallo}}</div>
					</div>
				</v-timeline-item>
			</v-timeline>

			<v-table>
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
							<v-chip variant="outlined" color="grey" v-for="item in times" :key="item.perc">{{(item.perc + "").padStart(2, "0")}}</v-chip>
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
	gap: 15px;
}
</style>
<script lang="ts">
import { get, get_route_color } from '@/utils/db-functions';
import { computed, defineComponent, onMounted, ref, watch, watchEffect } from 'vue'
import { useRouter } from 'vue-router'
import _ from 'lodash';
import RouteChip from '@/components/RouteChip.vue';
import ArrivalsTable from '@/components/ArrivalsTable.vue';

export default defineComponent({
	components: { RouteChip, ArrivalsTable },
	props: {
		stop_name: String
	},
	async setup(props) {
		if (props.stop_name == undefined || props.stop_name == "") {
			const router = useRouter();
			router.push("/");
		}


		const hour = ref(9);
		const dir_a_times = ref([]);
		const dir_b_times = ref([]);

		const routes_at_stop: string[] = await get("routesatstop", { stop: props.stop_name })

		const first_stops_array = await Promise.all(routes_at_stop.map(async r => get("firststop", { route: r })));
		const first_stops = Object.fromEntries(routes_at_stop.map((_, i) => [routes_at_stop[i], first_stops_array[i]]))

		const last_stops_array = await Promise.all(routes_at_stop.map(async r => get("laststop", { route: r })));
		const last_stops = Object.fromEntries(routes_at_stop.map((_, i) => [routes_at_stop[i], last_stops_array[i]]))

		watchEffect(async () => {
			hour.value = (24 + hour.value) % 24;
			dir_a_times.value = await get("arrivals", { stop: props.stop_name, hour: hour.value, direction: 0 })
			dir_b_times.value = await get("arrivals", { stop: props.stop_name, hour: hour.value, direction: 1 })
		})


		// console.log(path)
		return {
			hour,
			dir_a_times,
			dir_b_times,
			first_stops,
			last_stops
		}
	}
})

</script>

<template>
	<v-card class="pa-3" min-width="500px">

			<h3 class="ma-3">{{stop_name}}</h3>
		<div class="form ma-3">
			<v-text-field class="shrink"
				v-model.number="hour"
				hide-details
				single-line
				type="number"
				width="50px"
				suffix="óra" />
		</div>
		<div class="d-flex directions">
			<div class="d-flex-row">
				<h3>A irány</h3>
				<arrivals-table :rows="dir_a_times" :last_stops="first_stops" />
			</div>
			<div>
				<h3>B irány</h3>
				<arrivals-table :rows="dir_b_times" :last_stops="last_stops" />
			</div>

		</div>

	</v-card>

</template>

<style scoped>
.directions {
	display: flex;
	gap: 50px;
}
.form{
	max-width: 150px;
}
</style>
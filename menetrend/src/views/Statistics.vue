<script lang=ts>
import { Bar } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js'
import _ from 'lodash';
import { defineComponent, ref, Ref } from 'vue'
import { get, get_vehicle_type_color } from '@/utils/db-functions'
import { IDensityResult, IRouteLengthInfo, ITravelTimeStats } from '@/types';

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

export default defineComponent({
	name: 'BarChart',
	components: { Bar },
	async setup() {
		const avg_travel_times: ITravelTimeStats[] = await get("stats/averagetraveltime");
		// console.log(avg_travel_times.map(async x => await get_vehicle_type_color(x.tipus)));
		const chart1_data = {
			labels: avg_travel_times.map(x => _.capitalize(x.tipus)),
			datasets: [{
				label: "Perc",
				data: avg_travel_times.map(x => x.atlag),
				backgroundColor: await Promise.all(avg_travel_times.map(x => get_vehicle_type_color(x.tipus)))
			}]
		};
		const chart1_options = {
			plugins: {
				title: {
					display: true,
					text: 'Átlagos menetidő járműtípusonként'
				},
			},
			responsive: true,
			maintainAspectRatio: false
		}

		const chart2_options = {
			plugins: {
				title: {
					display: true,
					text: 'Járatsűrűség'
				},
			},
			responsive: true,
			scales: {
				x: {
					stacked: true,
				},
				y: {
					stacked: true
				}
			}
		}

		const density: IDensityResult[] = await get("stats/density")
		const chart2_data = {
			labels: _.range(24),
			datasets: await Promise.all(density.map(
				async r => ({
					label: r[0],
					data: r[1],
					backgroundColor: await get_vehicle_type_color(r[0])
				})))

		}

		const longest_routes: IRouteLengthInfo[] = await get("stats/longestroutes");
		// console.log(avg_travel_times.map(async x => await get_vehicle_type_color(x.tipus)));
		const chart3_data = {
			labels: longest_routes.map(x => x.jaratszam),
			datasets: [{
				label: "Útvonalhossz",
				data: longest_routes.map(r => r.hossz),
				backgroundColor: await Promise.all(longest_routes.map(x => get_vehicle_type_color(x.tipus)))
			}]
		};
		const chart3_options = {
			plugins: {
				title: {
					display: true,
					text: 'Leghosszabb útvonalak'
				},
			},
			responsive: true,
			maintainAspectRatio: false,
			legend:{display: false}
		}


		return {
			chart1_data,
			chart1_options,
			chart2_data,
			chart2_options,
			chart3_data,
			chart3_options
		}
	},
})
</script>

<template>
	<div class="wrapper">

		<div class="chart1">

			<Bar
				:chart-options="chart1_options"
				:chart-data="chart1_data"
				:width="400"
				:height="300" />
		</div>
		<div>
			<Bar
				:chart-options="chart2_options"
				:chart-data="chart2_data"
				:width="800"
				:height="400" />
		</div>
		<div class="chart3">

			<Bar
				:chart-options="chart3_options"
				:chart-data="chart3_data"
				:width="800"
				:height="300" />
		</div>

	</div>
</template>

<style scoped>
.chart1 {
	max-width: 300px;
}
.wrapper{
	display: flex;
	flex-direction: column;
	align-items: center;
}
</style>


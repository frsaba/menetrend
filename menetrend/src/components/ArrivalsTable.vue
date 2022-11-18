<script lang="ts">
import { get_route_color } from '@/utils/db-functions';
import { defineComponent } from 'vue'
import { useRouter } from 'vue-router'
import RouteChip from "@/components/RouteChip.vue";

export default defineComponent({
	props: {
		rows: Array,
		last_stops: Object
	},
	components: { RouteChip },
	async setup(props) {

		const router = useRouter();
		const get_color = async (route: string) => await get_route_color(route)
		const pad2 = (s : string) => (s + "").padStart(2, "0")

		return {
			router,
			get_color,
			pad2
		}
	}
})

</script>
<template>
	<v-table>
		<thead>
			<tr>
				<th class="text-center">
					Járat
				</th>
				<th class="text-center">
					Irány
				</th>
				<th class="text-center">
					Időpont
				</th>
			</tr>
		</thead>
		<tbody>
			<tr
				v-for="item in rows" :key="item.jaratszam +item.ora+ item.perc">
				<td> <route-chip class="ma-2" :route_number="item.jaratszam" />  </td>
				<td> > {{last_stops[item.jaratszam].megallo}} </td>
				<td class="minutes-container">
					<v-chip variant="outlined" color="grey"> {{pad2(item.ora)}}:{{pad2(item.perc)}}</v-chip>
				</td>
			</tr>
		</tbody>
	</v-table>

</template>

<style scoped>
th{
	text-align: center;
}
</style>
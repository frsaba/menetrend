<script lang="ts">
import { get_route_color } from '@/utils/db-functions';
import { defineComponent } from 'vue'

export default defineComponent({
	props: {
		route_number: String
	},
	async setup(props) {

		const color = await get_route_color(props.route_number)

		const view_route = (r: string) => {
			// router.push({ path: "/route", params: { routename: r } })
			console.log(r)
		}

		return {
			color,
			view_route
		}
	}
})

</script>
<template>

	<v-chip size="x-large" variant="outlined" :color="color"  @click="view_route(route)">
		{{route_number}}
	</v-chip>
</template>
<script lang="ts">
import { get_route_color } from '@/utils/db-functions';
import { defineComponent } from 'vue'
import { useRouter } from 'vue-router'

export default defineComponent({
	props: {
		route_number: String
	},
	async setup(props) {

		const router = useRouter();
		const color = await get_route_color(props.route_number)
		const view_route = () => {
			router.push({ name: "route", query: { route_number: props.route_number } })
		}

		return {
			color,
			view_route,
			router
		}
	}
})

</script>
<template>

	<v-chip size="x-large" variant="outlined" :color="color"  @click="view_route">
		{{route_number}}
	</v-chip>
</template>
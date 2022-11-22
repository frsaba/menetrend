<script lang="ts">
import { get_vehicle_type_color } from '@/utils/db-functions';
import { defineComponent } from 'vue'
import { useRouter } from 'vue-router'

export default defineComponent({
	props: {
		type: {
			type: String,
			required: true
		},
		size: String
	},
	async setup(props) {

		const router = useRouter();
		const color = await get_vehicle_type_color(props.type)

		const icons : { [key: string]: string } = {
			'villamos': 'mdi-tram',
			'busz': 'mdi-bus',
			'troli': 'mdi-bus'
		}

		const first_letter = props.type[0].toUpperCase();
		const icon = icons[props.type]

		return {
			color,
			router,
			icon,
			first_letter
		}
	}
})

</script>
<template>

	<v-chip :size="size" variant="elevated" :color="color">
		<v-icon v-if="icon">{{icon}}</v-icon>
		<span v-else> {{first_letter}}</span>
	</v-chip>
</template>
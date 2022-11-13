<script lang="ts">
import { get, get_route_color } from '@/utils/db-functions';
import { defineComponent } from 'vue'
import { useRouter} from 'vue-router'

export default defineComponent({
	props: {
		route_number: String
	},
	async setup(props) {
		if(props.route_number == undefined || props.route_number == ""){
			const router = useRouter();
			router.push("/");
		}

		const color = await get_route_color(props.route_number);
		const path = await get("path", {route: props.route_number});

		console.log(path)
		return {
			color,
			path
		}
	}
})

</script>
<template>
  <v-timeline side="end" align="start">
    <v-timeline-item v-for="stop in path" :key="stop.megallonev" :dot-color="color" size="x-small" >
      <template v-slot:opposite>
        {{stop.erkezes}}
      </template>
      <div>
        <div class="text-overline">{{stop.megallo}}</div>
      </div>
    </v-timeline-item>
  </v-timeline>
	
</template>
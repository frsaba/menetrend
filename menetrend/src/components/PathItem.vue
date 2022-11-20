<script lang="ts">
import { defineComponent } from 'vue'
import { useRouter } from 'vue-router'

export default defineComponent({
	props: {
		stop_name: String,
		arrival_time: Number,
		stop_number: Number
	},
	async setup(props) {

		const router = useRouter();
		const view_stop = () => {
			router.push({ name: "stop", query: { stop_name: props.stop_name } })
		}

		return {
			view_stop,
			router
		}
	}
})

</script>

<template>
	<div class="d-flex path-item-wrapper">
		<div class="set-width-small">{{stop_number}}</div>
		<div class="set-width">
			<v-chip v-if="arrival_time > 0" variant="outlined" color="grey"> {{arrival_time}} perc</v-chip>
		</div>
		<span class="text-overline">{{stop_name}}</span>
		<v-btn icon="mdi-launch" variant="plain" size="small" @click="view_stop"></v-btn>
	</div>
</template>

<style scoped>
.path-item-wrapper{
	display: flex;
	gap:10px;
	align-items: center;
	min-height: 48px;
}
.set-width{
	min-width: 5em;
}
.set-width-small{
	min-width: 2em;
}
</style>
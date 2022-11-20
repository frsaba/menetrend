<script lang="ts">
import { defineComponent, Ref, ref } from 'vue'
import { get, post } from '@/utils/db-functions'
import { IStopInfo } from "@/types"
import RouteChip from '@/components/RouteChip.vue';
import { useRouter } from 'vue-router'
import 'vue-good-table-next/dist/vue-good-table-next.css'
import { VueGoodTable } from 'vue-good-table-next';

export default defineComponent({
	components: { RouteChip, VueGoodTable },
	async setup(props) {
		const router = useRouter();

		const required = (v: string) => !!v || 'Ennek a mezőnek a megadása kötelező!'

		async function submit() {
			if (!new_type_name.value || !new_type_color.value) return;
			// console.log(new_type_name, new_type_color);
			const res = await post("vehicletype", { 
				name: new_type_name.value, color: new_type_color.value, stops : compatible_stops.value });
			// console.log(res);
			if (res.success) router.push("/");
		}

		const form = ref(false);
		const new_type_name = ref("");
		const new_type_color = ref("#000000");

		const stops: IStopInfo[] = await get("stops");
		const headers = [
			{ label: 'Megállónév', align: 'start', field: 'megallonev' },
			{ label: 'Cím', field: 'cim' },
			{ label: 'Befogad', field: 'compatibility' },
		]

		const compatible_stops = ref([]);

		return {
			form, new_type_name, new_type_color,
			required, submit,
			stops,
			headers,
			compatible_stops,
		}
	}
})

</script>
<template>
	<v-card class="mx-auto pa-3" min-width="800" max-width="1300">
		<v-form v-model="form" @submit.prevent="submit" class="pa-2 form">
			<v-card-title class="header">Új Járműtípus</v-card-title>
			<v-text-field v-model="new_type_name" :rules="[required]" clearable label="Járműtípus neve" class="content1"></v-text-field>
			<v-color-picker :modes="['hex', 'rgb', 'hsl']" v-model="new_type_color" class="content2"></v-color-picker>
			<v-btn class="footer"
				:disabled="!form" block color="success" size="large" type="submit" variant="elevated"> Küldés
			</v-btn>
			<vue-good-table
			class="table"
				styleClass="vgt-table condensed table"
				max-width="1300"
				:columns="headers"
				:rows="stops"
				max-height="75%"
				:search-options="{enabled: true, placeholder: 'Keresés',}"
				:pagination-options="{
				enabled: true,
				mode: 'records',
				perPage: 8,
				nextLabel: 'Következő',
				prevLabel: 'Előző',
				ofLabel: ' | összesen',
				rowsPerPageLabel: 'Oldalanként',
				allLabel: 'Összes', 
			}">
				<template #table-row="props">
					<span class="text-overline" v-if="props.column.field == 'megallonev'">{{props.row.megallonev}}</span>
					<span class="text-caption" v-else-if="props.column.field == 'cim'">
						{{props.formattedRow[props.column.field]}}
					</span>
					<v-checkbox hide-details="true" density="compact" v-else-if="props.column.field == 'compatibility'"
						v-model="compatible_stops"
						:value="props.row.megallonev"></v-checkbox>
				</template>

			</vue-good-table>
		</v-form>
	</v-card>
</template>

<style scoped>
.header {
	grid-area: hd;
}
.footer {
	grid-area: ft;
}
.content1 {
	grid-area: main1;
}
.content2 {
	grid-area: main2;
}
.table {
	grid-area: table;
}
.form {
	display: grid;
	gap: 20px;
	grid-template-rows: 3em 4em auto 40px;
	grid-template-areas:
		"hd table"
		"main1 table"
		"main2 table"
		"ft table"
		". table";
}
</style>
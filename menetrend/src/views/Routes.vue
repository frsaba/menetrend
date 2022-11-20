<script lang="ts">
import { defineComponent, Ref, ref } from 'vue'
import { get, post } from '@/utils/db-functions'
import { IVehicleTypeInfo, IRouteNumber } from "@/types"
import RouteChip from '@/components/RouteChip.vue';
import { useRouter } from 'vue-router'

export default defineComponent({
	components: { RouteChip },
	async setup(props) {
		const router = useRouter();
		const vehicle_types: IVehicleTypeInfo[] = await get("vehicle_types");

		const route_array: IRouteNumber[] = await Promise.all(vehicle_types.map(async r => await get("routes", { type: r.id })))

		const routes = Object.fromEntries(vehicle_types.map((vtype, i) => [vtype.id, route_array[i]]))

		const new_route_dialog = ref(false);
		const new_route_form = ref(false);
		const new_route_number = ref("");
		const new_route_type: Ref<undefined | IVehicleTypeInfo> = ref(undefined)

		const required = (v: string) => !!v || 'Ennek a mezőnek a megadása kötelező!'


		async function route_does_not_exist(v: string) {
			if (!v || v == "") return true;
			const exists = (await get("routeexists", { route: v })).exists;
			// console.log(exists)
			return !exists || 'Ez a járat már létezik'
		}

		async function new_route_submit() {
			if (!new_route_form.value || new_route_type == undefined) return;

			const res = await post("route", { route: new_route_number.value, type: new_route_type.value?.id });
			if (res.success) router.push({ name: "edit", query: { route_number: new_route_number.value } });
		}

		function new_type(){
			router.push({ name: "newvehicletype"});
		}

		return {
			vehicle_types,
			routes,
			router,
			new_route_dialog, new_route_number, new_route_type, new_route_form,
			required, route_does_not_exist, new_route_submit,
			new_type
		}
	}
})

</script>

<template>
	<v-card max-width="1100">

		<!-- #region Új járat dialog -->

		<v-dialog
			v-model="new_route_dialog">
			<template v-slot:activator="{ props }">
				<v-btn
					color="primary"
					v-bind="props">
					Új járat
				</v-btn>
			</template>

			<v-card class="mx-auto pa-3" min-width="350" max-width="600">
				<v-card-title>
					Új járat
				</v-card-title>
				<v-form v-model="new_route_form" @submit.prevent="new_route_submit">
					<v-text-field v-model="new_route_number" :rules="[required, route_does_not_exist]" class="ma-2" clearable label="Járatszám"></v-text-field>

					<v-select
						v-model="new_route_type" :items="vehicle_types" item-title="nev" item-value="nev"
						label="Járműtípus" class="ma-2" :rules="[required]" return-object single-line></v-select>

					<v-btn
						:disabled="!new_route_form" block color="success" size="large" type="submit" variant="elevated"> Küldés
					</v-btn>
				</v-form>
				<v-card-actions>
					<v-btn color="primary" block @click="new_route_dialog = false">Mégse</v-btn>
				</v-card-actions>
			</v-card>
		</v-dialog>
		<!-- #endregion -->

		<v-btn
			color="primary"
			@click="new_type">
			Új Járműtípus
		</v-btn>

		<v-list-item v-for="type in vehicle_types" :key="type.id">
			<h3 class="text-overline">{{type.nev}}</h3>
			<v-container class="routes-container flex-wrap">
				<route-chip v-for="route in routes[type.id]" size="x-large" :route_number="route.jaratszam" :key="route" />
			</v-container>
		</v-list-item>
	</v-card>
</template>

<style scoped>
.routes-container {
	display: flex;
	gap: 10px;
}
</style>
<script lang="ts">
import { defineComponent, ref } from 'vue'
import { routes } from '@/router'
import { useRouter } from 'vue-router';

export default defineComponent({
	name: 'App',
	setup(props, context) {
		const drawer = ref(true);
		const route_items = routes.map(r => ({ title: r.name, value: r.path, prependIcon: r.icon }));
		const router = useRouter();
		const navigate = (path: string) => {
			router.push({ path })
		}

		return {
			drawer,
			route_items,
			navigate
		}
	}
})
</script>

<template>
	<v-app>
		<v-main>
			<v-app-bar
				color="primary"
				prominent>
				<v-app-bar-nav-icon variant="text" @click.stop="drawer = !drawer"></v-app-bar-nav-icon>

				<v-toolbar-title>Menetrendek</v-toolbar-title>

				<v-spacer></v-spacer>

				<v-btn variant="text" icon="mdi-magnify"></v-btn>

				<v-btn variant="text" icon="mdi-filter"></v-btn>

				<v-btn variant="text" icon="mdi-dots-vertical"></v-btn>
			</v-app-bar>

			<v-navigation-drawer
				v-model="drawer">
				<v-list>
					<v-list-item v-for="r in route_items" :key="r.name" v-bind="r" @click="navigate(r.value)"></v-list-item>
				</v-list>
			</v-navigation-drawer>
			<Suspense>
				<div class="main-content d-flex justify-center">
					<router-view />
				</div>
			</Suspense>
		</v-main>
	</v-app>
</template>



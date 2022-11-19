import { createApp } from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import { loadFonts } from './plugins/webfontloader'
import router from "./router"

loadFonts()

createApp(App)
  .use(vuetify)
  .use(router)
  .mixin({
	methods: {
		pad2: (s : string) => (s + "").padStart(2, "0")
	}
  })
  .mount('#app')



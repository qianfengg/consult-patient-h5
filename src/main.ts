import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import persist from 'pinia-plugin-persistedstate'

import './styles/main.scss'

const app = createApp(App)

app.use(createPinia().use(persist))
app.use(router)

app.mount('#app')

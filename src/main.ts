import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import './styles/tailwind.css'
import '@/assets/fonts.css'

import Toast from "vue-toastification"
import "vue-toastification/dist/index.css"
import "@/styles/toast.css"

const app = createApp(App)
app.use(createPinia())
app.use(router)

// Toast global options (optional)
app.use(Toast, {
    position: "top-right",
    timeout: 3000,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
})

app.mount('#app')

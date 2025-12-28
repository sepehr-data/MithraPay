import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import './styles/tailwind.css'
import '@/assets/fonts.css'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import Toast from "vue-toastification"
import "vue-toastification/dist/index.css"
import "@/styles/toast.css"

// 👇 NEW
import DatePicker from '@alireza-ab/vue3-persian-datepicker'
// (you probably need to import its css file too; if Vite complains,
// open node_modules/@alireza-ab/vue3-persian-datepicker/dist and import
// the css you see there, e.g.:
// import '@alireza-ab/vue3-persian-datepicker/dist/style.css'

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

const app = createApp(App)
app.use(createPinia())
app.use(router)
app.use(pinia)

// Toast global options (optional)
app.use(Toast, {
    position: "top-right",
    timeout: 3000,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
})

app.component('DatePicker', DatePicker)

app.mount('#app')

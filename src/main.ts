import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { VueQueryPlugin, QueryClient } from '@tanstack/vue-query'
import App from './App.vue'
import router from './router'
import './styles/tailwind.css'
import '@/assets/fonts.css'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import Toast from 'vue-toastification'
import 'vue-toastification/dist/index.css'
import '@/styles/toast.css'

// DatePicker
import DatePicker from '@alireza-ab/vue3-persian-datepicker'

const app = createApp(App)

// Pinia
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

// TanStack Query
const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 15_000,
            refetchOnWindowFocus: true,
            retry: 1,
        },
    },
})

// Plugins
app.use(pinia)
app.use(router)
app.use(VueQueryPlugin, { queryClient })

app.use(Toast, {
    position: 'top-right',
    timeout: 3000,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
})

// Global components
app.component('DatePicker', DatePicker)

// Mount (فقط یک بار)
app.mount('#app')

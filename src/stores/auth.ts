import { defineStore } from 'pinia'

interface User {
    id?: number | string
    phone?: string
    name?: string
    // add more fields if your backend returns them
    role?: string
}

export const useAuthStore = defineStore('auth', {
    state: () => ({
        token: (localStorage.getItem('auth_token') as string | null),
        user: (localStorage.getItem('auth_user')
            ? JSON.parse(localStorage.getItem('auth_user') as string)
            : null) as User | null
    }),
    getters: {
        isAuthenticated: (state) => !!state.token
    },
    actions: {
        login(payload: { token: string; user: User }) {
            this.token = payload.token
            this.user = payload.user
            localStorage.setItem('auth_token', payload.token)
            localStorage.setItem('auth_user', JSON.stringify(payload.user))
        },
        logout() {
            this.token = null
            this.user = null
            localStorage.removeItem('auth_token')
            localStorage.removeItem('auth_user')
        }
    }
})

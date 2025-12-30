import { defineStore } from 'pinia'
import { clearToken, getToken, setToken } from '@/lib/http'
import { getMe } from '@/services/user'
import type { UserMeResponse } from '@/api/user.dto'

interface User extends UserMeResponse {
    role?: string
}

export const useAuthStore = defineStore('auth', {
    state: () => ({
        token: getToken() as string | null,
        user: (localStorage.getItem('auth_user')
            ? JSON.parse(localStorage.getItem('auth_user') as string)
            : null) as User | null,
    }),
    getters: {
        isAuthenticated: (state) => !!state.token,
    },
    actions: {
        async initialize() {
            this.token = getToken()
            if (!this.user) {
                const stored = localStorage.getItem('auth_user')
                if (stored) {
                    this.user = JSON.parse(stored)
                }
            }

            if (this.token && !this.user) {
                await this.fetchMe()
            }
        },
        async login(payload: { token: string; user?: User }) {
            this.token = payload.token
            setToken(payload.token)
            if (payload.user) {
                this.setUser(payload.user)
            } else {
                await this.fetchMe()
            }
        },
        setUser(user: User) {
            this.user = user
            localStorage.setItem('auth_user', JSON.stringify(user))
        },
        async fetchMe() {
            if (!this.token) return
            try {
                const user = await getMe()
                this.setUser(user)
            } catch {
                // keep token but user not loaded
            }
        },
        logout() {
            this.token = null
            this.user = null
            clearToken()
            localStorage.removeItem('auth_user')
        },
    },
})

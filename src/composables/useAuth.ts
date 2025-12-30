import { computed, ref } from "vue"
import { getToken } from "@/lib/http"
import * as authApi from "@/services/auth"

const token = ref<string | null>(getToken())

export function useAuth() {
    const isAuthed = computed(() => !!token.value)

    async function requestOtp(phone: string) {
        return authApi.requestOtp({ phone })
    }

    async function verifyOtp(phone: string, code: string) {
        const res = await authApi.verifyOtp({ phone, code })
        token.value = res.access_token
        return res
    }

    function logout() {
        authApi.logout()
        token.value = null
    }

    return { token, isAuthed, requestOtp, verifyOtp, logout }
}

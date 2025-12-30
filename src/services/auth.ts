// src/services/auth.ts
import { http, setToken, clearToken } from "@/lib/http"
import { endpoints } from "@/api/endpoints"
import type {
    RegisterPayload,
    RegisterResponse,
    RequestOtpPayload,
    RequestOtpResponse,
    VerifyOtpPayload,
    VerifyOtpResponse,
} from "@/api/auth.dto"

export async function register(payload: RegisterPayload) {
    const { data } = await http.post<RegisterResponse>(endpoints.auth.register, payload)
    return data
}

export async function requestOtp(payload: RequestOtpPayload) {
    const { data } = await http.post<RequestOtpResponse>(endpoints.auth.requestOtp, payload)
    return data
}

export async function verifyOtp(payload: VerifyOtpPayload) {
    const { data } = await http.post<VerifyOtpResponse>(endpoints.auth.verifyOtp, payload)
    // طبق بک‌اند فقط access_token برمی‌گرده
    setToken(data.access_token)
    return data
}

export function logout() {
    // چون JWT ـه، logout سمت فرانت یعنی حذف توکن
    clearToken()
}

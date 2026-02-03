// src/services/auth.ts
import { http } from "@/lib/http"
import { endpoints } from "@/types/api_client_types/endpoints.ts"
import { useAuthStore } from "@/stores/auth"
import type {
    RegisterPayload,
    RegisterResponse,
    RequestOtpPayload,
    RequestOtpResponse,
    VerifyOtpPayload,
    VerifyOtpResponse,
} from "@/types/api_client_types/auth.dto.ts"

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

    // بک‌اند طبق گفته‌ی خودت access_token برمی‌گردونه
    const token = (data as any)?.access_token || (data as any)?.token
    if (!token) throw new Error("توکن از بک دریافت نشد")

    // ✅ ذخیره داخل Pinia (و localStorage توسط store)
    const auth = useAuthStore()

    // اگر بک user هم برگردوند، استفاده کن. اگر نه، حداقل phone رو ذخیره کن
    const user = (data as any)?.user ?? { phone: (payload as any)?.phone }

    auth.login({ token, user })

    return data
}

export function logout() {
    const auth = useAuthStore()
    auth.logout()
}

// src/services/auth.ts
import { http } from "@/lib/http"
import { endpoints } from "@/types/api_client_types/endpoints"
import type {
    RegisterPayload,
    RegisterResponse,
    RequestOtpPayload,
    RequestOtpResponse,
    VerifyOtpPayload,
    VerifyOtpResponse,
} from "@/types/api_client_types/auth.dto"

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
    return data
}

// src/services/user.ts
import { http } from "@/lib/http"
import { endpoints } from "@/types/api_client_types/endpoints.ts"
import type { UserMeResponse, UpdateMePayload, UpdateMeResponse } from "@/types/api_client_types/user.dto.ts"

export async function getMe() {
    const { data } = await http.get<UserMeResponse>(endpoints.user.me)
    return data
}

export async function updateMe(payload: UpdateMePayload) {
    const cleaned = Object.fromEntries(
        Object.entries(payload).filter(([k, v]) => {
            if (v === undefined) return false
            if (k === "password" && typeof v === "string" && !v.trim()) return false
            return true
        })
    ) as UpdateMePayload

    const { data } = await http.put<UpdateMeResponse>(endpoints.user.me, cleaned)
    return data
}

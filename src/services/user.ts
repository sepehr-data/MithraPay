// src/services/user.ts
import { http } from "@/lib/http"
import { endpoints } from "@/api/endpoints"
import type { UserMeResponse, UpdateMePayload, UpdateMeResponse } from "@/api/user.dto"

export async function getMe() {
    const { data } = await http.get<UserMeResponse>(endpoints.user.me)
    return data
}

export async function updateMe(payload: UpdateMePayload) {
    const { data } = await http.put<UpdateMeResponse>(endpoints.user.me, payload)
    return data
}

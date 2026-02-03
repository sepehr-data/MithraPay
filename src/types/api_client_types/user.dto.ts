// src/types/user.dto.ts

// GET /users/me
export type UserMeResponse = {
    id: number
    phone?: string | null
    name?: string | null
    last_name?: string | null
    email?: string | null
    birthday?: string | null
    sheba?: string | null
    bank_number?: string | null
}

// PUT /users/me
export type UpdateMePayload = Partial<{
    name: string | null
    last_name: string | null
    email: string | null
    birthday: string | null
    phone: string | null
    sheba: string | null
    bank_number: string | null
    password: string | null

}>

export type UpdateMeResponse = {
    message: string
    user: UserMeResponse
}


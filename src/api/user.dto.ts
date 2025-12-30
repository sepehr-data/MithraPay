// src/api/user.dto.ts

// GET /users/me
export type UserMeResponse = {
    id: number
    phone?: string | null
    name?: string | null
    last_name?: string | null
    email?: string | null
    birthday?: string | null
    sheba?: string | null
}

// PUT /users/me
export type UpdateMePayload = Partial<{
    name: string | null
    last_name: string | null
    email: string | null
    birthday: string | null
    sheba: string | null
    phone: string | null
    password: string | null
    account_number: string | null
}>

export type UpdateMeResponse = {
    message: string
    user: UserMeResponse
}

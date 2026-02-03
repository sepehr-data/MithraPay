// src/types/auth.dto.ts

// POST /auth/register
export type RegisterPayload = {
    phone: string
    email?: string
    full_name?: string
}

export type RegisterResponse = {
    id: number
    phone: string
    email: string | null
    full_name: string | null
}

// POST /auth/request-otp
export type RequestOtpPayload = {
    phone: string
}

export type RequestOtpResponse = {
    message: string
    debug_code?: string // فقط برای dev (طبق بک‌اند)
}

// POST /auth/verify-otp
export type VerifyOtpPayload = {
    phone: string
    code: string
}

export type VerifyOtpResponse = {
    access_token: string
}

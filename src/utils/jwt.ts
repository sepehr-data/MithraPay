// src/utils/jwt.ts
export type JwtPayload = {
    sub?: string | number
    phone?: string
    roles?: string[]
    exp?: number
    iat?: number
    is_phone_verified?: boolean
}

export function parseJwt(token: string): JwtPayload | null {
    try {
        const part = token.split(".")[1]
        if (!part) return null
        const base64 = part.replace(/-/g, "+").replace(/_/g, "/")
        const json = decodeURIComponent(
            atob(base64)
                .split("")
                .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
                .join("")
        )
        return JSON.parse(json)
    } catch {
        return null
    }
}

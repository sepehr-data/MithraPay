import axios from "axios"

const TOKEN_KEY = "access_token"

export function getToken() {
    return localStorage.getItem(TOKEN_KEY)
}

export function setToken(token: string) {
    localStorage.setItem(TOKEN_KEY, token)
}

export function clearToken() {
    localStorage.removeItem(TOKEN_KEY)
}

export const http = axios.create({
    baseURL: "/api",
    headers: { "Content-Type": "application/json" },
})

// اضافه کردن خودکار Bearer token به همه درخواست‌ها
http.interceptors.request.use((config) => {
    const token = getToken()
    if (token) {
        config.headers = config.headers ?? {}
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

// یکدست کردن خطاها (مثل AppError)
http.interceptors.response.use(
    (res) => res,
    (err) => Promise.reject(err?.response?.data ?? err)
)

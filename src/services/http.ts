import axios from 'axios'

export const http = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000',
    headers: { 'Content-Type': 'application/json' },
})

http.interceptors.request.use((config) => {
    const token = localStorage.getItem('auth_token')
    if (token) {
        config.headers = config.headers || {}
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

export class HttpError extends Error {
    constructor(
        public status: number,
        message: string,
        public body?: unknown,
    ) {
        super(message)
    }
}

export async function apiGet<T>(path: string, signal?: AbortSignal): Promise<T> {
    try {
        const res = await http.get<T>(path, { signal })
        return res.data
    } catch (err: any) {
        // axios error normalize
        const status = err?.response?.status ?? 0
        const body = err?.response?.data
        const msg =
            body?.message ||
            body?.error ||
            err?.message ||
            (status ? `HTTP ${status}` : 'Network error')

        throw new HttpError(status, msg, body)
    }
}

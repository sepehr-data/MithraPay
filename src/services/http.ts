import axios from 'axios'

export const http = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000',
    headers: { 'Content-Type': 'application/json' },
})

http.interceptors.request.use((config) => {
    let token = localStorage.getItem('access_token')

    if (token) token = token.replace(/^"+|"+$/g, '').trim()

    if (token) {
        if (typeof (config.headers as any)?.set === 'function') {
            ;(config.headers as any).set('Authorization', `Bearer ${token}`)
        } else {
            config.headers = config.headers ?? {}
            ;(config.headers as any).Authorization = `Bearer ${token}`
        }
    }

    console.log('Interceptor token?', !!token)
    console.log('Auth header:', (config.headers as any)?.Authorization ?? '(not set)')
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

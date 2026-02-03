export type RangeKey = 'today' | '7d' | '30d'

export const rangeOptions: { key: RangeKey; label: string }[] = [
    { key: 'today', label: 'امروز' },
    { key: '7d', label: '۷ روز اخیر' },
    { key: '30d', label: '۳۰ روز اخیر' },
]

export function rangeToParam(r: RangeKey) {
    return r // اگر بک‌اندت چیز دیگه‌ای می‌خواد همینجا مپ کن
}

export type OrderStatus = 'paid' | 'pending' | 'failed' | 'canceled'

export interface Order {
    id: string
    user: string
    productTitle: string
    status: OrderStatus
}

export type TicketStatus = 'open' | 'pending' | 'closed'

export interface Ticket {
    id: string
    user: string
    subject: string
    status: TicketStatus
    priority: 'low' | 'normal' | 'high'
}

export interface OrdersSummary {
    total: number
    paid: number
    pending: number
}

export interface TicketsSummary {
    open: number
}

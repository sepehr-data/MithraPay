import type { RangeKey } from '@/types/dashboard'

export function rangeStartDate(range: RangeKey) {
    const now = new Date()
    const start = new Date(now)

    if (range === 'today') {
        start.setHours(0, 0, 0, 0)
        return start
    }
    if (range === '7d') {
        start.setDate(start.getDate() - 7)
        return start
    }
    start.setDate(start.getDate() - 30)
    return start
}

export function inRange(iso: string | null, range: RangeKey) {
    if (!iso) return false
    const d = new Date(iso)
    return d >= rangeStartDate(range)
}

import { useQuery } from '@tanstack/vue-query'
import type { RangeKey } from '@/types/dashboard'
import { inRange } from '@/utils/range'
import { fetchAllOrders, fetchAllTickets, adminListUsers, adminListBanners } from '@/services/admin'
import type { GetAllOrdersResponse, GetAllTicketsResponse } from '@/api/admin.dto'

function byCreatedAtDesc(a: { created_at: string | null }, b: { created_at: string | null }) {
    const da = a.created_at ? new Date(a.created_at).getTime() : 0
    const db = b.created_at ? new Date(b.created_at).getTime() : 0
    return db - da
}

export function useDashboardOrders(range: () => RangeKey) {
    return useQuery({
        queryKey: ['admin-dashboard', 'orders', range()],
        queryFn: () => fetchAllOrders(),
        staleTime: 15_000,
        refetchInterval: 30_000,
        select: (orders: GetAllOrdersResponse) => {
            const filtered = orders
                .filter(o => inRange(o.created_at, range()))
                .sort(byCreatedAtDesc)

            const latest = filtered.slice(0, 6)
            const paidCount = filtered.filter(o => o.payment_status === 'PAID').length
            const reviewCount = filtered.filter(o => o.admin_status === 'pending').length

            const total = filtered.length
            const successRate = total ? Math.round((paidCount / total) * 100) : 0
            const reviewRate = total ? Math.round((reviewCount / total) * 100) : 0

            return { filtered, latest, total, paidCount, reviewCount, successRate, reviewRate }


        },
    })
}

export function useDashboardTickets(range: () => RangeKey) {
    return useQuery({
        queryKey: ['admin-dashboard', 'tickets', range()],
        queryFn: () => fetchAllTickets(),
        staleTime: 15_000,
        refetchInterval: 30_000,
        select: (tickets: GetAllTicketsResponse) => {
            const filtered = tickets
                .filter(t => inRange(t.created_at, range()))
                .sort(byCreatedAtDesc)

            const latest = filtered.slice(0, 5)
            const openCount = filtered.filter(t => t.status === 'open').length

            return { filtered, latest, openCount }
        },
    })
}

export function useUsersTotal() {
    return useQuery({
        queryKey: ['admin-dashboard', 'users-total'],
        queryFn: async () => {
            const res = await adminListUsers({ limit: 1, offset: 0 })
            return res.pagination.total
        },
        staleTime: 60_000,
        refetchInterval: 60_000,
    })
}

export function useActiveBannersCount() {
    return useQuery({
        queryKey: ['admin-dashboard', 'banners'],
        queryFn: () => adminListBanners(),
        staleTime: 60_000,
        refetchInterval: 60_000,
        select: (banners) => banners.filter(b => b.status === 'active').length, // اگر status فرق دارد تغییر بده
    })
}

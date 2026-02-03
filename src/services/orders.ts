// src/services/orders.ts
import { http } from "@/lib/http"
import { endpoints } from "@/types/api_client_types/endpoints.ts"
import type {
    CreateOrderPayload,
    CreateOrderResponse,
    OrderDetailsResponse,
    ListMyOrdersResponse,
    OrderDto,
} from "@/types/api_client_types/orders.dto.ts"
import type { Order, OrderStatus } from "@/services/types"

export async function createOrder(payload: CreateOrderPayload) {
    // ✅ بک باید user را از JWT بگیرد، پس فقط items می‌فرستیم
    const { data } = await http.post<CreateOrderResponse>(endpoints.orders.create, payload)
    return data
}

export async function getOrder(orderId: number) {
    const { data } = await http.get<OrderDetailsResponse>(endpoints.orders.byId(orderId))
    return data
}

/** ---- mappers (backend dto -> frontend Order) ---- */
function mapOrderStatus(dto: OrderDto): OrderStatus {
    const s = (dto.status || "").toLowerCase()
    const ps = (dto.payment_status || "").toLowerCase()

    if (s.includes("cancel")) return "canceled"
    if (s.includes("complete")) return "completed"
    if (ps === "paid" || s === "paid") return "paid"
    return "pending"
}

function mapOrder(dto: OrderDto): Order {
    return {
        id: String(dto.id),
        code: dto.order_number,
        status: mapOrderStatus(dto),
        createdAt: dto.created_at || new Date().toISOString(),
        items: [], // بک فعلاً items نمی‌فرسته
    }
}

/**
 * GET /orders/my?limit=50&offset=0
 * ✅ نیاز به userId ندارد (از توکن خوانده می‌شود)
 */
export async function listMyOrders(params?: { limit?: number; offset?: number }): Promise<Order[]> {
    const { data } = await http.get<ListMyOrdersResponse>(endpoints.orders.my, {
        params: {
            limit: params?.limit ?? 50,
            offset: params?.offset ?? 0,
        },
    })

    return (data || []).map(mapOrder)
}

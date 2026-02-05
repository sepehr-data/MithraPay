// src/services/orders.ts
import { http } from "@/lib/http"
import { endpoints } from "@/types/api_client_types/endpoints"
import type {
    CreateOrderPayload,
    CreateOrderResponse,
    OrderDetailsResponse,
    ListMyOrdersResponse,
    OrderDto,
    OrderItemDto,
    OrderDetailsDto,
} from "@/types/api_client_types/orders.dto"

/** -----------------------------
 * helpers
 * ----------------------------- */
export function unwrapOrderDetails(res: OrderDetailsResponse): OrderDetailsDto {
    const anyRes: any = res as any
    return (anyRes?.order ?? anyRes?.data?.order ?? anyRes?.data?.data?.order ?? anyRes) as OrderDetailsDto
}

export function itemTitle(it: OrderItemDto): string {
    return (it.productTitle || it.title || it.name || "بدون نام").toString()
}

/** -----------------------------
 * API
 * ----------------------------- */
export async function createOrder(payload: CreateOrderPayload) {
    const { data } = await http.post<CreateOrderResponse>(endpoints.orders.create, payload)
    return data
}

/** ✅ خروجی getOrder را unwrap می‌کنیم تا صفحه راحت باشد */
export async function getOrder(orderId: number): Promise<OrderDetailsDto> {
    const { data } = await http.get<OrderDetailsResponse>(endpoints.orders.byId(orderId))
    return unwrapOrderDetails(data)
}

/**
 * ✅ این صفحه باید DTO بک‌اند را بگیرد
 * GET /orders/my?limit=50&offset=0
 */
export async function listMyOrders(params?: { limit?: number; offset?: number }): Promise<OrderDto[]> {
    const { data } = await http.get<ListMyOrdersResponse>(endpoints.orders.my, {
        params: {
            limit: params?.limit ?? 50,
            offset: params?.offset ?? 0,
        },
    })
    return (data || []) as OrderDto[]
}

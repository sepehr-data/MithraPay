// src/services/orders.ts
import { http } from "@/lib/http"
import { endpoints } from "@/api/endpoints"
import type { CreateOrderPayload, CreateOrderResponse, OrderDetailsResponse } from "@/api/orders.dto"

export async function createOrder(payload: CreateOrderPayload) {
    const { data } = await http.post<CreateOrderResponse>(endpoints.orders.create, payload)
    return data
}

export async function getOrder(orderId: number) {
    const { data } = await http.get<OrderDetailsResponse>(endpoints.orders.byId(orderId))
    return data
}

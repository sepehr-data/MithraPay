// src/types/orders.dto.ts

/** -----------------------------
 * Enums مطابق entity بک‌اند
 * ----------------------------- */
export type OrderStatus = "PENDING" | "PAID" | "CANCELLED" | "FULFILLED"
export type PaymentStatus = "UNPAID" | "PAID" | "FAILED"
export type AdminStatus = "OPEN" | "REVIEWING" | "CLOSED" | "PENDING" | "open" | "reviewing" | "closed" | "pending"

/** -----------------------------
 * Create payloads
 * ----------------------------- */
export type CreateOrderItemPayload = {
    product_id: number
    quantity: number
}

export type CreateOrderPayload = {
    items: CreateOrderItemPayload[]
}

export type CreateOrderResponse = {
    order_id: number
    order_number: string
    total_amount: number
    currency?: string
}

/** -----------------------------
 * Order (طبق entity Order + to_dict)
 * ----------------------------- */
export type OrderDto = {
    id: number
    order_number: string
    user_id: number

    status: OrderStatus
    admin_status: AdminStatus
    payment_status: PaymentStatus

    total_amount: number | string // بعضی وقت‌ها DECIMAL به صورت string برمی‌گرده
    currency: string

    created_at: string | null
    updated_at?: string | null
}

/** -----------------------------
 * Order items (برای صفحه لازم داریم)
 * ----------------------------- */
export type OrderItemDto = {
    product_id?: number
    quantity: number

    // بسته به بک‌اند ممکنه یکی از اینها باشد:
    productTitle?: string
    title?: string
    name?: string

    // قیمت‌ها ممکن است در آیتم یا فقط در total_amount باشد
    unit_price?: number | string
    price?: number | string
    total_price?: number | string
}

/** -----------------------------
 * GET /orders/my
 * ----------------------------- */
export type ListMyOrdersResponse = OrderDto[]

/** -----------------------------
 * GET /orders/:id
 * ممکنه:
 * 1) خود سفارش با items برگرده
 * 2) یا داخل wrapper مثل { order: ... }
 * ----------------------------- */
export type OrderDetailsDto = OrderDto & {
    items: OrderItemDto[]
}

export type OrderDetailsResponse =
    | OrderDetailsDto
    | { order: OrderDetailsDto }
    | { data: { order: OrderDetailsDto } }

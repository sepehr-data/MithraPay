// src/types/orders.dto.ts

// items input (طبق بک: items = data.get("items", []))
export type CreateOrderItemPayload = {
    product_id: number
    quantity: number
}

//  user_id حذف شد (بک از JWT می‌گیره)
export type CreateOrderPayload = {
    items: CreateOrderItemPayload[]
}

// POST /orders/create
export type CreateOrderResponse = {
    order_id: number
    order_number: string
    total_amount: number
}

// خروجی سفارش (طبق OrderService.to_dict)
export type OrderDto = {
    id: number
    order_number: string
    user_id: number
    status: string
    payment_status: string
    total_amount: number
    currency: string
    created_at: string | null
}


// GET /orders/my
export type ListMyOrdersResponse = OrderDto[]

// GET /orders/:id
export type OrderDetailsResponse = Record<string, any>

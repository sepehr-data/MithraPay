// src/api/orders.dto.ts

// items input (طبق بک: items = data.get("items", []))
export type CreateOrderItemPayload = {
    product_id: number
    quantity: number
}

export type CreateOrderPayload = {
    user_id: number // فعلاً بک از body می‌گیره (TODO: get from JWT)
    items: CreateOrderItemPayload[]
}

// POST /orders/
export type CreateOrderResponse = {
    order_id: number
    order_number: string
    total_amount: number
}

// GET /orders/:id
// چون بک `return jsonify(svc.to_dict(order))` داره و ساختار دقیقش رو اینجا نداریم
// یک نوع "Flexible" می‌دیم تا بعداً با خروجی واقعی دقیقش کنیم.
export type OrderDetailsResponse = Record<string, any>

// src/types/api_client_types/cart.dto.ts

export type CartItemDto = {
    id: number
    product_id: number
    title?: string
    quantity: number
    line_total: number
    unit_price: number

    duration_type_id?: number | null
    subscription_type_id?: number | null
    personal_account?: boolean
}

export type CartResponse = {
    cart_id: number
    status: string
    items: CartItemDto[]
    count: number
    total: number
}

export type GetCartResponse = CartResponse

export type AddCartItemPayload = {
    product_id: number
    quantity?: number
    duration_type_id?: number | null
    subscription_type_id?: number | null
    personal_account?: boolean
}

export type AddCartItemResponse = CartResponse
export type RemoveCartItemResponse = CartResponse
export type ClearCartResponse = CartResponse

// ✅ new: update qty
export type UpdateCartItemQtyPayload = {
    quantity: number
}

// بک‌اند بعد از update هم Cart کامل برمی‌گرداند
export type UpdateCartItemQtyResponse = CartResponse

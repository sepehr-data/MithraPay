// src/api/cart.dto.ts

export type CartItemDto = {
    id: number
    product_id: number
    quantity: number

    // اگر بک اطلاعات محصول رو هم embed کنه:
    product?: any

    [key: string]: any
}

export type CartDto = {
    id?: number
    user_id: number
    items?: CartItemDto[]
    total_amount?: number

    [key: string]: any
}

// GET /cart/:user_id
export type GetCartResponse = CartDto

// POST /cart/items
export type AddCartItemPayload = {
    user_id: number
    product_id: number
    quantity?: number
}
export type AddCartItemResponse = CartDto

// PUT /cart/items/:item_id
export type UpdateCartItemPayload = {
    quantity: number
}
export type UpdateCartItemResponse = CartDto

// DELETE /cart/items/:item_id
export type RemoveCartItemResponse = CartDto

// DELETE /cart/:user_id
export type ClearCartResponse = CartDto

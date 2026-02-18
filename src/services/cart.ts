// src/services/cart.ts
import { http } from "@/lib/http"
import { endpoints } from "@/types/api_client_types/endpoints.ts"
import type {
    GetCartResponse,
    AddCartItemPayload,
    AddCartItemResponse,
    RemoveCartItemResponse,
    ClearCartResponse,
    UpdateCartItemQtyPayload,
    UpdateCartItemQtyResponse,
} from "@/types/api_client_types/cart.dto"

export async function getCart() {
    const { data } = await http.get<GetCartResponse>(endpoints.cart.getCart)
    return data
}

export async function addCartItem(payload: AddCartItemPayload) {
    const { data } = await http.post<AddCartItemResponse>(endpoints.cart.addItem, payload)
    return data
}

export async function removeCartItem(itemId: number) {
    const { data } = await http.delete<RemoveCartItemResponse>(endpoints.cart.removeItem(itemId))
    return data
}

export async function clearCart() {
    const { data } = await http.post<ClearCartResponse>(endpoints.cart.clear)
    return data
}

// ✅ new: update qty (PATCH /carts/items/:id)
export async function updateCartItemQty(itemId: number, payload: UpdateCartItemQtyPayload) {
    const { data } = await http.patch<UpdateCartItemQtyResponse>(
        endpoints.cart.updateItemQty(itemId),
        payload
    )
    return data
}

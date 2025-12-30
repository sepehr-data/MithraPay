// src/services/cart.ts
import { http } from "@/lib/http"
import { endpoints } from "@/api/endpoints"
import type {
    GetCartResponse,
    AddCartItemPayload,
    AddCartItemResponse,
    UpdateCartItemPayload,
    UpdateCartItemResponse,
    RemoveCartItemResponse,
    ClearCartResponse,
} from "@/api/cart.dto"

export async function getCart(userId: number) {
    const { data } = await http.get<GetCartResponse>(endpoints.cart.byUserId(userId))
    return data
}

export async function addCartItem(payload: AddCartItemPayload) {
    const { data } = await http.post<AddCartItemResponse>(endpoints.cart.addItem, payload)
    return data
}

export async function updateCartItem(itemId: number, payload: UpdateCartItemPayload) {
    const { data } = await http.put<UpdateCartItemResponse>(endpoints.cart.itemById(itemId), payload)
    return data
}

export async function removeCartItem(itemId: number) {
    const { data } = await http.delete<RemoveCartItemResponse>(endpoints.cart.itemById(itemId))
    return data
}

export async function clearCart(userId: number) {
    const { data } = await http.delete<ClearCartResponse>(endpoints.cart.clearByUserId(userId))
    return data
}

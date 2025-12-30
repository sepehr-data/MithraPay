// src/services/admin.ts
import { http } from "@/lib/http"
import { endpoints } from "@/api/endpoints"
import type {
    AdminListProductsResponse,
    AdminCreateProductPayload,
    AdminCreateProductResponse,
    AdminUpdateProductPayload,
    AdminUpdateProductResponse,
} from "@/api/admin.dto"

export async function adminListProducts() {
    const { data } = await http.get<AdminListProductsResponse>(endpoints.admin.products)
    return data
}

export async function adminCreateProduct(payload: AdminCreateProductPayload) {
    const { data } = await http.post<AdminCreateProductResponse>(endpoints.admin.products, payload)
    return data
}

export async function adminUpdateProduct(productId: number, payload: AdminUpdateProductPayload) {
    const { data } = await http.put<AdminUpdateProductResponse>(endpoints.admin.productById(productId), payload)
    return data
}

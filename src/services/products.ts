// src/services/products.ts
import { http } from "@/lib/http"
import { endpoints } from "@/api/endpoints"
import type {
    CreateProductPayload,
    CreateProductResponse,
    ListProductsQuery,
    ListProductsResponse,
    TopWeeklyProductsResponse,
    GetProductResponse,
} from "@/api/products.dto"

export async function createProduct(payload: CreateProductPayload) {
    const { data } = await http.post<CreateProductResponse>(endpoints.products.create, payload)
    return data
}

export async function listProducts(query?: ListProductsQuery) {
    const { data } = await http.get<ListProductsResponse>(endpoints.products.list, { params: query })
    return data
}

export async function getTopWeeklyProducts(limit = 8) {
    const { data } = await http.get<TopWeeklyProductsResponse>(endpoints.products.topWeekly, {
        params: { limit },
    })
    return data
}

export async function getProduct(productId: number) {
    const { data } = await http.get<GetProductResponse>(endpoints.products.byId(productId))
    return data
}

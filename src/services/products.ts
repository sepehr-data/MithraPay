// src/services/products.ts
import { http } from "@/lib/http"
import { endpoints } from "@/types/api_client_types/endpoints.ts"
import type {
    CreateProductPayload,
    CreateProductResponse,
    ListProductsQuery,
    ListProductsResponse,
    TopWeeklyProductsResponse,
    GetProductResponse,
} from "@/types/api_client_types/products.dto.ts"

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

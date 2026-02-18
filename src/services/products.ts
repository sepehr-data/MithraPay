// src/services/products.ts
import { http } from "@/lib/http"
import { endpoints } from "@/types/api_client_types/endpoints.ts"
import type {
    ListProductsQuery,
    ListProductsResponse,
    TopWeeklyProductsResponse,
    GetProductResponse,
    GetProductQuery,
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

// ✅ NEW: allow query params to resolve matrix price on backend
export async function getProduct(productId: number, query?: GetProductQuery) {
    const { data } = await http.get<GetProductResponse>(endpoints.products.byId(productId), {
        params: query,
    })
    return data
}

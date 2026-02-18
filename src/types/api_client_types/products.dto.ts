// src/types/products.dto.ts (UPDATED)

export type PlanRefDto = {
    id: number
    title: string
    slug: string
}

export type DurationTypeDto = PlanRefDto
export type SubscriptionTypeDto = PlanRefDto

// ✅ NEW: matrix price rows coming from backend
export type ProductPriceDto = {
    subscription_type_id: number
    duration_type_id: number
    price: number
}

export type ProductDto = {
    id: number
    title: string
    slug?: string | null
    category_id?: number | null
    category_slug?: string | null

    // ✅ backend now can return resolved price for a combination
    price: number | null

    // ✅ NEW: base price always available if backend sends it
    base_price?: number | null

    compare_at_price?: number | null

    delivery_type?: string | null
    platform?: string | null

    // -------------------------
    // Legacy single-value fields (optional)
    // -------------------------
    duration_type_id?: number | null
    subscription_type_id?: number | null
    personal_account?: boolean

    duration?: string | null
    subscription_type?: string | null

    // -------------------------
    // ✅ M2M arrays
    // -------------------------
    duration_types?: DurationTypeDto[] | null
    subscription_types?: SubscriptionTypeDto[] | null

    // -------------------------
    // ✅ NEW: matrix prices (optional)
    // -------------------------
    prices?: ProductPriceDto[] | null

    // Optional expanded objects (if backend returns them)
    duration_type_detail?: DurationTypeDto | null
    subscription_type_detail?: SubscriptionTypeDto | null

    region?: string | null
    stock?: number | null
    is_active?: boolean

    image_url?: string | null
    short_description?: string | null
    description?: string | null

    created_at?: string | null
    updated_at?: string | null
}

// GET /products/?category=&search=&duration_type_id=&subscription_type_id=&personal_account=
export type ListProductsQuery = Partial<{
    category: string
    search: string

    duration_type_id: number
    subscription_type_id: number
    personal_account: boolean
}>

export type ListProductsResponse = ProductDto[]

// GET /products/top-weekly?limit=
export type TopWeeklyProductsResponse = {
    items: ProductDto[]
    count: number
}

// ✅ NEW: query for GET /products/:id
export type GetProductQuery = Partial<{
    duration_type_id: number
    subscription_type_id: number
}>

// GET /products/:id
export type GetProductResponse = ProductDto

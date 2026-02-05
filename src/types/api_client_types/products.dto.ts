// src/types/products.dto.ts

export type DurationTypeDto = {
    id: number
    title: string
    slug: string
}

export type SubscriptionTypeDto = {
    id: number
    title: string
    slug: string
}

export type ProductDto = {
    id: number
    title: string
    slug?: string | null
    category_id?: number | null
    category_slug?: string | null

    price: number
    compare_at_price?: number | null

    delivery_type?: string | null
    platform?: string | null

    // ✅ NEW id-based fields
    duration_type_id?: number | null
    subscription_type_id?: number | null
    personal_account?: boolean

    // ⚠️ legacy (backward compatibility)
    duration?: string | null
    subscription_type?: string | null

    // ✅ expanded objects (if backend returns them)
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

// GET /products/:id
export type GetProductResponse = ProductDto

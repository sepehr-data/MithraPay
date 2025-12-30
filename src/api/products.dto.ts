// src/api/products.dto.ts

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
    duration?: string | null
    region?: string | null

    stock?: number | null
    is_active?: boolean

    image_url?: string | null
    short_description?: string | null
    description?: string | null

    created_at?: string | null
    updated_at?: string | null
}

// POST /products/
export type CreateProductPayload = {
    title: string
    slug?: string | null
    category_id?: number | null
    price: number
    compare_at_price?: number | null
    delivery_type?: string | null
    platform?: string | null
    duration?: string | null
    region?: string | null
    stock?: number | null
    is_active?: boolean
    image_url?: string | null
    short_description?: string | null
    description?: string | null
}

export type CreateProductResponse = ProductDto

// GET /products/?category=&search=
export type ListProductsQuery = Partial<{
    category: string
    search: string
}>
export type ListProductsResponse = ProductDto[]

// GET /products/top-weekly?limit=
export type TopWeeklyProductsResponse = {
    items: ProductDto[]
    count: number
}

// GET /products/:id
export type GetProductResponse = ProductDto

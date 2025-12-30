// src/api/admin.dto.ts

// GET /admin/products
export type AdminProductListItem = {
    id: number
    title: string
    price: number
    is_active: boolean
}

export type AdminListProductsResponse = AdminProductListItem[]

// POST /admin/products
export type AdminCreateProductPayload = {
    title: string
    slug?: string | null
    category_id?: number | null
    price?: number
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

export type AdminCreateProductResponse = {
    id: number
}

// PUT /admin/products/:id
export type AdminUpdateProductPayload = Partial<AdminCreateProductPayload>

export type AdminUpdateProductResponse = {
    id: number
}

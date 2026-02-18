// src/types/api_client_types/banners.dto.ts

export type BannerStatus = "active" | "enabled" | "true" | "1" | string

export type BannerDto = {
    id: number
    title: string | null
    link: string | null
    image_url: string | null
    status: BannerStatus | null
    created_at: string | null
    updated_at: string | null
}

// GET /banners
export type ListBannersResponse = BannerDto[]

// GET /banners/:id
export type GetBannerResponse = BannerDto

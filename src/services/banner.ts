// src/services/banners.ts
import { http } from "@/lib/http"
import { endpoints } from "@/types/api_client_types/endpoints"
import type { BannerDto, ListBannersResponse, GetBannerResponse } from "@/types/api_client_types/banner.dto"

/**
 * GET /banners
 * ✅ بنرهای فعال (Public)
 */
export async function listBanners(): Promise<BannerDto[]> {
    const { data } = await http.get<ListBannersResponse>(endpoints.banners.list)
    return data || []
}

/**
 * GET /banners/:id
 * ✅ دریافت یک بنر فعال
 */
export async function getBanner(id: number): Promise<BannerDto> {
    const { data } = await http.get<GetBannerResponse>(endpoints.banners.byId(id))
    return data
}

/**
 * helper: فقط برای UI
 */
export function isBannerActive(b: BannerDto): boolean {
    const s = String(b?.status ?? "").toLowerCase()
    return s === "active" || s === "enabled" || s === "1" || s === "true"
}

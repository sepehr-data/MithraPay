import type { ProductDto } from "@/api/products.dto"
import type { BlogPostDto } from "@/api/blog.dto"
import type { Product, BlogPost } from "@/services/types"

function normalizeSlug(value?: string | null, fallback?: string | number) {
    const base = (value || "").trim()
    if (base) return base
    if (fallback === undefined || fallback === null) return ""
    return String(fallback)
}

function normalizeText(value?: string | null) {
    return (value ?? "").toString().trim()
}

export function mapProductDto(dto: ProductDto): Product {
    const tags = [
        normalizeText(dto.platform),
        normalizeText(dto.region),
        normalizeText(dto.duration),
        normalizeText(dto.delivery_type),
    ].filter(Boolean)

    return {
        id: dto.id,
        slug: normalizeSlug(dto.slug, dto.id),
        title: normalizeText(dto.title) || `محصول ${dto.id}`,
        description: normalizeText(dto.short_description || dto.description),
        price: Number(dto.price ?? 0),
        compareAt: dto.compare_at_price ?? undefined,
        image: dto.image_url ?? undefined,
        categoryId: dto.category_slug ?? dto.category_id ?? "",
        isDigital: dto.delivery_type ? dto.delivery_type !== "physical" : true,
        tags: tags.length ? tags : undefined,
        createdAt: dto.created_at ?? undefined,
    }
}

export function mapBlogPostDto(dto: BlogPostDto): BlogPost {
    return {
        id: dto.id ? String(dto.id) : dto.slug,
        slug: dto.slug,
        title: normalizeText(dto.title) || "بدون عنوان",
        excerpt: normalizeText(dto.excerpt) || normalizeText(dto.content),
        content: normalizeText(dto.content),
        date: dto.created_at ?? dto.updated_at ?? "",
        cover: dto.image_url ?? undefined,
        createdAt: dto.created_at ?? undefined,
    }
}

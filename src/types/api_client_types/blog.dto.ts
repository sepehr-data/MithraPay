// src/types/blog.dto.ts

export type BlogPostDto = {
    id?: number
    slug: string
    title?: string | null
    excerpt?: string | null
    content?: string | null

    // تصاویر (بسته به اینکه بک چی می‌فرسته)
    image_url?: string | null
    cover_image?: string | null

    created_at?: string | null
    updated_at?: string | null

    category_id?: number | null

    category?: string | null

    [key: string]: any
}

// GET /blog/
export type ListBlogPostsResponse = BlogPostDto[]

// GET /blog/:slug
export type GetBlogPostResponse = BlogPostDto

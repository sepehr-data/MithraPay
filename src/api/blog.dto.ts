// src/api/blog.dto.ts

export type BlogPostDto = {
    id?: number
    slug: string
    title?: string | null
    excerpt?: string | null
    content?: string | null
    image_url?: string | null
    created_at?: string | null
    updated_at?: string | null

    // اگر بک فیلدهای بیشتری می‌فرسته، این باعث می‌شه TypeScript گیر نده
    [key: string]: any
}

// GET /blog/
export type ListBlogPostsResponse = BlogPostDto[]

// GET /blog/:slug
export type GetBlogPostResponse = BlogPostDto

// src/services/blog.ts
import { http } from "@/lib/http"
import { endpoints } from "@/types/api_client_types/endpoints.ts"
import type { ListBlogPostsResponse, GetBlogPostResponse } from "@/types/api_client_types/blog.dto.ts"

export async function listBlogPosts() {
    const { data } = await http.get<ListBlogPostsResponse>(endpoints.blog.list)
    return data
}

export async function getBlogPost(slug: string) {
    const { data } = await http.get<GetBlogPostResponse>(endpoints.blog.bySlug(slug))
    return data
}

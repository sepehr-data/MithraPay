// src/services/admin.ts
import { http } from "@/lib/http"
import { endpoints } from "@/types/api_client_types/endpoints.ts"
import type {
    AdminCreateProductPayload,
    AdminCreateProductResponse,
    AdminUpdateProductPayload,
    AdminDeleteProductResponse,
    AdminGetProductResponse,
    AdminListBlogsResponse,
    AdminCreateBlogPayload,
    AdminCreateBlogResponse,
    AdminUpdateBlogPayload,
    AdminUpdateBlogResponse,
    AdminGetUsersResponse,
    AdminProductListItem,
    AdminGetBlogResponse,
    AdminDeleteBlogResponse,
    AdminGetBannerResponse,
    AdminDeleteBannerResponse,
    AdminCreateBannerPayload,
    AdminCreateBannerResponse,
    AdminUpdateBannerPayload,
    AdminUpdateBannerResponse,
    AdminListBannersResponse,
    GetTicketResponse,
    GetAllTicketsResponse,
    UpdateTicketRequest,
    UpdateTicketResponse,
    GetAllOrdersResponse,
    UpdateOrderAdminStatusRequest,
    UpdateOrderAdminStatusResponse,
    AdminListAdminsResponse,
    AdminPromoteByPhonePayload,
    AdminPromoteByPhoneResponse,
    AdminRemoveAdminByPhonePayload,
    AdminRemoveAdminByPhoneResponse,

} from "@/types/api_client_types/admin.dto.ts"

/* ===================== PRODUCTS ===================== */

export async function adminListProducts(params?: { limit?: number; offset?: number }) {
    try {
        const resp = await http.get(endpoints.admin.products, {
            params: {
                limit: params?.limit ?? 50,
                offset: params?.offset ?? 0
            }
        });
        return resp.data as {
            items: AdminProductListItem[];
            pagination: { limit: number; offset: number; count: number; total: number };
        };
    } catch (err) {
        console.error("adminListProducts error:", err);
        throw err;
    }
}

export async function adminCreateProduct(
    payload: AdminCreateProductPayload
): Promise<AdminCreateProductResponse> {
    const { data } = await http.post<AdminCreateProductResponse>(
        endpoints.admin.products,
        payload
    )
    return data
}

// Get Product
export async function adminGetProduct(id: number): Promise<AdminGetProductResponse> {
    const { data } = await http.get<AdminGetProductResponse>(endpoints.admin.productById(id))
    return data
}


// Update Product
export async function adminUpdateProduct(
    id: number,
    payload: AdminUpdateProductPayload
): Promise<AdminCreateProductResponse> {
    const { data } = await http.put<AdminCreateProductResponse>(
        endpoints.admin.productById(id),
        payload
    )
    return data
}

// Delete Product
export async function adminDeleteProduct(
    id: number
): Promise<AdminDeleteProductResponse> {
    const { data } = await http.delete<AdminDeleteProductResponse>(
        endpoints.admin.productById(id)
    )
    return data
}
/* ===================== BLOGS ===================== */
// GET /admin/blogs
export async function adminListBlogs(params?: {
    limit?: number
    offset?: number
}): Promise<AdminListBlogsResponse> {
    const { data } = await http.get<AdminListBlogsResponse>(endpoints.admin.blogs, {
        params: {
            limit: params?.limit ?? 50,
            offset: params?.offset ?? 0,
        },
    })
    return data
}


// POST /admin/blogs
export async function adminCreateBlog(payload: AdminCreateBlogPayload) {
    const { data } = await http.post<AdminCreateBlogResponse>(
        endpoints.admin.blogs,
        payload
    )
    return data
}

// PUT /admin/blogs/:id
export async function adminUpdateBlog(
    blogId: number,
    payload: AdminUpdateBlogPayload
) {
    const { data } = await http.put<AdminUpdateBlogResponse>(
        endpoints.admin.blogById(blogId),
        payload
    )
    return data
}

export async function adminGetBlog(blogId: number): Promise<AdminGetBlogResponse> {
    const { data } = await http.get<AdminGetBlogResponse>(
        endpoints.admin.blogById(blogId)
    )
    return data
}

export async function adminDeleteBlog(blogId: number): Promise<AdminDeleteBlogResponse> {
    const { data } = await http.delete<AdminDeleteBlogResponse>(
        endpoints.admin.blogById(blogId)
    )
    return data
}

/* ===================== USERS ===================== */

// GET /admin/users
export async function adminListUsers(params?: {
    limit?: number
    offset?: number
}) {
    const { data } = await http.get<AdminGetUsersResponse>(
        endpoints.admin.users,
        {
            params: {
                limit: params?.limit ?? 50,
                offset: params?.offset ?? 0,
            },
        }
    )

    return data
}

/* ===================== BANNERS ===================== */

// GET /admin/banners
export async function adminListBanners() {
    const { data } = await http.get<AdminListBannersResponse>(endpoints.admin.banners)
    return data
}

// POST /admin/banners
export async function adminCreateBanner(payload: AdminCreateBannerPayload) {
    const { data } = await http.post<AdminCreateBannerResponse>(
        endpoints.admin.banners,
        payload
    )
    return data
}

// PUT /admin/banners/:id
export async function adminUpdateBanner(
    bannerId: number,
    payload: AdminUpdateBannerPayload
) {
    const { data } = await http.put<AdminUpdateBannerResponse>(
        endpoints.admin.bannerById(bannerId),
        payload
    )
    return data
}

// GET /admin/banners/:id
export async function adminGetBanner(bannerId: number): Promise<AdminGetBannerResponse> {
    const { data } = await http.get<AdminGetBannerResponse>(
        endpoints.admin.bannerById(bannerId)
    )
    return data
}

// DELETE /admin/banners/:id
export async function adminDeleteBanner(bannerId: number): Promise<AdminDeleteBannerResponse> {
    const { data } = await http.delete<AdminDeleteBannerResponse>(
        endpoints.admin.bannerById(bannerId)
    )
    return data
}


export async function fetchAllTickets(): Promise<GetAllTicketsResponse> {
    const { data } = await http.get<GetAllTicketsResponse>(endpoints.admin.tickets);
    return data;
}

export async function getTicket(ticketId: number): Promise<GetTicketResponse> {
    const { data } = await http.get<GetTicketResponse>(endpoints.admin.ticketById(ticketId));
    return data;
}

export async function updateTicket(ticketId: number, data: UpdateTicketRequest): Promise<UpdateTicketResponse> {
    const { data: response } = await http.patch<UpdateTicketResponse>(
        endpoints.admin.ticketById(ticketId),
        data
    );
    return response;
}

export async function fetchAllOrders(): Promise<GetAllOrdersResponse> {
    const { data } = await http.get<GetAllOrdersResponse>(endpoints.admin.orders);
    return data;
}

export async function updateOrderAdminStatus(
    orderId: number,
    data: UpdateOrderAdminStatusRequest
): Promise<UpdateOrderAdminStatusResponse> {
    const { data: response } = await http.patch<UpdateOrderAdminStatusResponse>(
        endpoints.admin.orderById(orderId), data);
    return response;
}

// GET /admin/admins
export async function adminListAdmins(params?: { limit?: number; offset?: number }) {
    try {
        const resp = await http.get<AdminListAdminsResponse>(endpoints.admin.admins, {
            params: {
                limit: params?.limit ?? 200,
                offset: params?.offset ?? 0,
            },
        })
        return resp.data
    } catch (err) {
        console.error("adminListAdmins error:", err)
        throw err
    }
}

// POST /admin/admins
export async function adminPromoteToAdminByPhone(
    payload: AdminPromoteByPhonePayload
): Promise<AdminPromoteByPhoneResponse> {
    try {
        const { data } = await http.post<AdminPromoteByPhoneResponse>(
            endpoints.admin.admins,
            payload
        )
        return data
    } catch (err) {
        console.error("adminPromoteToAdminByPhone error:", err)
        throw err
    }
}

// DELETE /admin/admins  (با body)
export async function adminRemoveAdminByPhone(
    payload: AdminRemoveAdminByPhonePayload
): Promise<AdminRemoveAdminByPhoneResponse> {
    try {
        const { data } = await http.delete<AdminRemoveAdminByPhoneResponse>(
            endpoints.admin.admins,
            { data: payload }
        )
        return data
    } catch (err) {
        console.error("adminRemoveAdminByPhone error:", err)
        throw err
    }
}

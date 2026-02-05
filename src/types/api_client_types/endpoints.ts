// src/types/endpoints.ts
export const endpoints = {

    auth: {
        register: "/auth/register",
        requestOtp: "/auth/request-otp",
        verifyOtp: "/auth/verify-otp",
        // login is disabled on backend (405) -> intentionally not exposed
    },

    user: {
        me: "/users/me",
    },

    admin: {

        // Admins
        admins: "/admin/admins",

        // Products
        products: "/admin/products",
        productById: (id: number) => `/admin/products/${id}`,

        // Blogs
        blogs: "/admin/blogs",
        blogById: (id: number) => `/admin/blogs/${id}`,

        // Users
        users: "/admin/users",

        // Banners
        banners: "/admin/banners",
        bannerById: (id: number) => `/admin/banners/${id}`,

        // Tickets
        tickets: "/admin/tickets",
        ticketById: (id: number) => `/admin/tickets/${id}`,

        // Orders
        orders: "/admin/orders",
        orderById: (id: number) => `/admin/orders/${id}`,
    },

    orders: {
        create: "/orders/create",
        list: "/orders/",
        my: "/orders/my",
        byId: (orderId: number) => `/orders/${orderId}`,
    },
    banners: {
        list: "/banners",
        byId: (id: number) => `/banners/${id}`,
    },

    products: {
        create: "/products/",
        list: "/products/",
        topWeekly: "/products/top-weekly",
        byId: (productId: number) => `/products/${productId}`,
    },

    blog: {
        list: "/blogs/",
        bySlug: (slug: string) => `/blogs/${encodeURIComponent(slug)}`,
    },

    cart: {
        byUserId: (userId: number) => `/cart/${userId}`,
        addItem: "/cart/items",
        itemById: (itemId: number) => `/cart/items/${itemId}`,
        clearByUserId: (userId: number) => `/cart/${userId}`,
    },

    tickets: {
        create: "/tickets/",
    },
} as const

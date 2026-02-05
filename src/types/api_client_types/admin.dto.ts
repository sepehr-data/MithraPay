// GET /admin/products
export type AdminProductListItem = {
    id: number
    title: string
    price: number
    is_active: boolean
    category_id?: number
    image_url?: string
    created_at?: string | null

    // ✅ NEW (id-based)
    duration_type_id?: number | null
    subscription_type_id?: number | null
    personal_account?: boolean

    // ⚠️ legacy (optional for backward compatibility)
    duration?: string | null
    subscription_type?: string | null
}

export type PlanType = 'individual' | 'family'
export type PlanDuration = '1m' | '3m' | '6m' | '12m'


// ✅ برای get (دریافت)
export type AdminGetProductResponse = {
    id: number
    title: string
    slug: string

    description?: string | null
    price?: number | null
    compare_at_price?: number | null
    category_id?: number | null
    image_url?: string | null
    is_active?: boolean | null

    delivery_type?: string | null
    platform?: string | null
    duration?: string | null
    region?: string | null
    stock?: number | null
    is_digital?: boolean | null

    // ✅ فیلدهای جدید
    plan_type?: PlanType[] | string | null
    plan_duration?: PlanDuration[] | string | null
}


export type AdminDeleteProductResponse = {
    ok: boolean
    message?: string
    deleted_id?: number
}


// POST /admin/products
export type AdminCreateProductPayload = {
    title: string
    slug: string
    category_id?: number
    price?: number
    compare_at_price?: number
    delivery_type?: string
    platform?: string

    // ✅ NEW preferred fields
    duration_type_id?: number | null
    subscription_type_id?: number | null
    personal_account?: boolean

    // ⚠️ legacy (optional)
    duration?: string
    subscription_type?: string

    region?: string
    stock?: number
    is_active?: boolean
    image_url?: string
    short_description?: string
    description?: string

    // ⚠️ قدیمی/نامشخص در بک‌اند فعلی
    // اگر توی DB/Entity نداری بهتره حذفش کنی، ولی فعلاً نگه می‌دارم که فرانت نشکنه
    is_digital?: boolean
}

export type AdminCreateProductResponse = {
    id: number
}

// PUT /admin/products/:id
export type AdminUpdateProductPayload = Partial<AdminCreateProductPayload>

// GET /admin/blogs
export type AdminBlogListItem = {
    id: number
    title: string
    slug: string
    excerpt: string
    cover_image?: string | null
    is_published: boolean
    published_at?: string | null
    author_name: string

    // ✅ new
    category_id?: number | null
}

export type AdminGetBlogResponse = {
    id: number
    title: string
    slug: string
    excerpt?: string | null
    content?: string | null
    cover_image?: string | null
    is_published: boolean
    published_at?: string | null
    author_name: string

    // ✅ new
    category_id?: number | null
}

export type AdminDeleteBlogResponse = {
    id: number
    deleted: boolean
}

export type AdminListBlogsResponse = AdminBlogListItem[]


// POST /admin/blogs
export type AdminCreateBlogPayload = {
    title: string
    slug: string
    content?: string | null
    cover_image?: string | null
    is_published?: boolean
    published_at?: string | null // ISO date string: "YYYY-MM-DD"
    author_name?: string

    // ✅ new
    category_id?: number | null
}

export type AdminCreateBlogResponse = {
    id: number
}

// PUT /admin/blogs/:id
export type AdminUpdateBlogPayload = Partial<AdminCreateBlogPayload>

export type AdminUpdateBlogResponse = {
    id: number
}


export type AdminUserItem = {
    id: number
    email: string | null
    full_name: string | null
    phone: string
    is_active: boolean
    created_at: string
}

export type AdminUsersPagination = {
    limit: number
    offset: number
    count: number
    total: number
}

export type AdminGetUsersResponse = {
    items: AdminUserItem[]
    pagination: AdminUsersPagination
}

// GET /admin/banners
export type AdminBannerListItem = {
    id: number
    title: string
    link?: string
    image_url: string
    status: string
    created_at?: string
    updated_at?: string
}

// POST /admin/banners
export type AdminCreateBannerPayload = {
    title: string
    link?: string
    image_url: string
    status?: string
}

// Response ایجاد بنر
export type AdminCreateBannerResponse = {
    id: number
}

// PUT /admin/banners/:id
export type AdminUpdateBannerPayload = Partial<AdminCreateBannerPayload>

// Response برای دریافت یک بنر
export type AdminGetBannerResponse = {
    id: number
    title: string
    link?: string
    image_url: string
    status: string
    created_at?: string
    updated_at?: string
}

// Response حذف بنر
export type AdminDeleteBannerResponse = {
    id: number
    deleted: boolean
}

// PUT /admin/banners/:id
export type AdminUpdateBannerResponse = AdminCreateBannerResponse

// GET /admin/banners
export type AdminListBannersResponse = AdminBannerListItem[]


// هر آیتم تیکت در لیست
export interface TicketListItem {
    id: number;
    name: string;
    email: string;
    phone: string;
    orderNumber?: string;
    subject: string;
    status: string;
    created_at: string | null; // ISO date string
}

export type GetAllTicketsResponse = TicketListItem[];

export interface TicketDetail {
    id: number;
    name: string;
    email: string;
    subject: string;
    message: string;
    phone: string;
    orderNumber?: string;
    status: string;
    accepted_policy: boolean;
    user_id: number | null;
    created_at: string | null; // ISO date string
}

export type GetTicketResponse = TicketDetail;


export type TicketStatus = 'open' | 'pending' | 'closed';
export type FinalDecision = 'approved' | 'rejected' | null;

export interface UpdateTicketRequest {
    status: TicketStatus;
    final_decision?: FinalDecision;
    reply?: string;
    decision?: 'approved' | 'rejected' | null;
}

export interface UpdateTicketResponse {
    success?: boolean;
    message?: string;
    error?: string;
    details?: string;
}
export type PaymentStatus = 'UNPAID' | 'PAID' | 'FAILED';
export type OrderStatus = 'PENDING' | 'PAID' | 'CANCELLED' | 'FULFILLED';

// وضعیت صفحه ادمین
export type AdminOrderStatus = 'open' | 'pending' | 'closed';

// مدل سفارش (برای پنل ادمین)
export interface Order {
    id: number;
    order_number: string;
    user_id: number;

    status: OrderStatus;
    payment_status: PaymentStatus;

    // اگر در API لیست هم برگردونی
    admin_status?: AdminOrderStatus;

    total_amount: number;
    currency: string;

    created_at: string | null; // چون بک‌اند ممکنه None بده
    updated_at: string | null; // چون بک‌اند ممکنه None بده
}

// پاسخ API برای fetchAllOrders
export type GetAllOrdersResponse = Order[];

// ---- PATCH /admin/orders/:id ----
export interface UpdateOrderAdminStatusRequest {
    admin_status: AdminOrderStatus;
}

export interface UpdateOrderAdminStatusResponse {
    success: true;
    message: string;
    data: {
        order_id: number;
        order_number: string;
        admin_status: AdminOrderStatus;
    };
}

export type AdminRoleName = string

export type AdminUserDTO = {
    id: number
    name: string | null
    first_name: string | null
    last_name: string | null
    phone: string
    email: string | null
    roles: AdminRoleName[]
    is_active: boolean
    created_at: string | null
    updated_at: string | null
}

export type AdminPromoteByPhonePayload = {
    phone: string // 09xxxxxxxxx
}

export type AdminPromoteByPhoneResponse = {
    ok: true
    admin: AdminUserDTO
}

export type AdminRemoveAdminByPhonePayload = {
    phone: string // 09xxxxxxxxx
}

export type AdminRemoveAdminByPhoneResponse = {
    ok: true
    removed: true
    user: AdminUserDTO
}

export type AdminListAdminsResponse = AdminUserDTO[]
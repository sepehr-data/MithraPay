<template>
  <div class="space-y-6 max-w-4xl mx-auto" dir="rtl">
    <!-- هدر با گرادیانت ملایم و اوپاسیتی کم -->
    <section
        class="relative rounded-3xl border border-base-300 shadow-sm overflow-hidden
             bg-gradient-to-l from-primary/15 via-primary/5 to-secondary/10"
    >
      <div class="absolute inset-y-0 right-0 w-1.5 bg-gradient-to-b from-primary/40 to-secondary/40"></div>

      <div class="px-5 sm:px-6 py-4 sm:py-5 pr-6">
        <div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div class="space-y-1">
            <h2 class="text-base sm:text-xl font-bold text-base-content">
              {{ isEdit ? 'ویرایش محصول' : 'افزودن محصول جدید' }}
            </h2>
            <p class="text-[11px] sm:text-xs text-base-content/80">
              مشخصات محصول را وارد کن تا در لیست محصولات نمایش داده شود.
            </p>
          </div>

          <div class="flex flex-col items-start sm:items-end gap-1 text-[11px] sm:text-xs">
            <span
                class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full
                     bg-primary/10 text-primary border border-primary/20"
            >
              <span class="w-1.5 h-1.5 rounded-full bg-gradient-to-br from-primary to-secondary"></span>
              {{ isEdit ? 'حالت ویرایش' : 'محصول جدید' }}
            </span>
          </div>
        </div>
      </div>
    </section>

    <!-- فرم مینیمال و کامپکت -->
    <form
        class="rounded-2xl bg-base-100 border border-base-300 shadow-sm px-4 sm:px-5 py-4 sm:py-5 space-y-5"
        @submit.prevent="save"
    >
      <!-- خلاصه کوچک بالا -->
      <div class="grid gap-3 sm:grid-cols-3 text-[11px] sm:text-xs rounded-2xl bg-base-200/60 px-3 py-2.5">
        <div class="flex flex-col gap-0.5">
          <span class="text-base-content/60">عنوان</span>
          <span class="font-semibold text-base-content truncate">
            {{ form.title || '—' }}
          </span>
        </div>

        <div class="flex flex-col gap-0.5">
          <span class="text-base-content/60">قیمت پایه</span>
          <span class="font-semibold text-primary">
            {{ form.price ? formatPreviewPrice(form.price) : '—' }}
          </span>
        </div>

        <div class="flex flex-col gap-0.5">
          <span class="text-base-content/60">دسته</span>
          <span class="font-semibold text-base-content truncate">
            {{ getCategoryTitle(form.category_id) || 'تنظیم نشده' }}
          </span>
        </div>
      </div>

      <!-- اطلاعات اصلی -->
      <div class="space-y-3">
        <h3 class="text-sm font-semibold text-base-content">اطلاعات اصلی</h3>

        <div class="grid gap-3 md:grid-cols-2">
          <label class="form-control">
            <span class="label-text text-[11px]">عنوان محصول</span>
            <input v-model="form.title" class="input input-bordered input-sm" required />
          </label>

          <label class="form-control">
            <span class="label-text text-[11px]">Slug</span>
            <input v-model="form.slug" class="input input-bordered input-sm ltr text-left" required />
          </label>
        </div>

        <div class="grid gap-3 md:grid-cols-2">
          <label class="form-control">
            <span class="label-text text-[11px]">توضیحات کوتاه</span>
            <input
                v-model="form.short_description"
                class="input input-bordered input-sm"
                placeholder="یک جمله کوتاه برای کارت محصول..."
            />
          </label>

          <label class="form-control">
            <span class="label-text text-[11px]">آدرس تصویر محصول</span>
            <input
                v-model="form.image_url"
                class="input input-bordered input-sm ltr text-left"
                placeholder="/images/product.png"
            />
          </label>
        </div>

        <label class="form-control">
          <span class="label-text text-[11px]">توضیحات</span>
          <textarea
              v-model="form.description"
              rows="3"
              class="textarea textarea-bordered text-xs"
              placeholder="توضیح کوتاه درباره محصول..."
          ></textarea>
        </label>
      </div>

      <!-- قیمت و دسته‌بندی -->
      <div class="space-y-3">
        <h3 class="text-sm font-semibold text-base-content">قیمت‌گذاری و دسته‌بندی</h3>

        <div class="grid gap-3 md:grid-cols-2">
          <label class="form-control">
            <span class="label-text text-[11px]">قیمت پایه (تومان)</span>
            <input
                v-model.number="form.price"
                type="number"
                class="input input-bordered input-sm ltr text-left"
                min="0"
                required
            />
          </label>

          <label class="form-control">
            <span class="label-text text-[11px]">قیمت قبل (اختیاری)</span>
            <input
                v-model.number="form.compare_at_price"
                type="number"
                class="input input-bordered input-sm ltr text-left"
                min="0"
            />
          </label>

          <label class="form-control">
            <span class="label-text text-[11px]">دسته‌بندی</span>
            <select v-model.number="form.category_id" class="select select-bordered select-sm">
              <option :value="undefined" disabled>انتخاب دسته‌بندی</option>
              <option v-for="cat in categories" :key="cat.id" :value="cat.id">
                {{ cat.title }}
              </option>
            </select>
          </label>
        </div>
      </div>

      <!-- اطلاعات پلن -->
      <div class="space-y-3">
        <h3 class="text-sm font-semibold text-base-content">اطلاعات پلن</h3>

        <div class="grid gap-3 md:grid-cols-2">
          <!-- نوع اشتراک -->
          <div class="form-control">
            <span class="label-text text-[11px] mb-1">نوع اشتراک</span>
            <div class="flex flex-wrap gap-2">
              <label class="inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-base-300 bg-base-100 cursor-pointer">
                <input v-model="form.plan_type" class="checkbox checkbox-sm" type="checkbox" value="individual" />
                <span class="text-xs">شخصی / Individual</span>
              </label>
              <label class="inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-base-300 bg-base-100 cursor-pointer">
                <input v-model="form.plan_type" class="checkbox checkbox-sm" type="checkbox" value="family" />
                <span class="text-xs">خانوادگی / Family</span>
              </label>
            </div>
          </div>

          <!-- مدت زمان -->
          <div class="form-control">
            <span class="label-text text-[11px] mb-1">مدت زمان اشتراک</span>
            <div class="flex flex-wrap gap-2">
              <label class="inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-base-300 bg-base-100 cursor-pointer">
                <input v-model="form.plan_duration" class="checkbox checkbox-sm" type="checkbox" value="1m" />
                <span class="text-xs">1 ماهه</span>
              </label>
              <label class="inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-base-300 bg-base-100 cursor-pointer">
                <input v-model="form.plan_duration" class="checkbox checkbox-sm" type="checkbox" value="3m" />
                <span class="text-xs">3 ماهه</span>
              </label>
              <label class="inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-base-300 bg-base-100 cursor-pointer">
                <input v-model="form.plan_duration" class="checkbox checkbox-sm" type="checkbox" value="6m" />
                <span class="text-xs">6 ماهه</span>
              </label>
              <label class="inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-base-300 bg-base-100 cursor-pointer">
                <input v-model="form.plan_duration" class="checkbox checkbox-sm" type="checkbox" value="12m" />
                <span class="text-xs">یک ساله</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      <!-- جدول قیمت‌ها -->
      <div v-if="form.plan_type.length && form.plan_duration.length" class="space-y-3">
        <h3 class="text-sm font-semibold text-base-content">قیمت برای هر ترکیب</h3>
        <div v-for="type in form.plan_type" :key="type" class="space-y-2">
          <h4 class="text-xs font-semibold">{{ type === 'individual' ? 'شخصی' : 'خانوادگی' }}</h4>
          <div class="grid grid-cols-4 gap-2">
            <div v-for="dur in form.plan_duration" :key="dur" class="flex flex-col">
              <span class="text-[10px]">{{ durationLabel(dur) }}</span>
              <input
                  type="number"
                  v-model.number="form.price_matrix[type][dur]"
                  class="input input-bordered input-sm ltr text-left"
                  min="0"
                  placeholder="قیمت"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- تنظیمات -->
      <div class="space-y-2">
        <h3 class="text-sm font-semibold text-base-content">تنظیمات</h3>

        <div class="flex flex-col gap-2">
          <label class="flex items-start gap-2 text-xs">
            <input v-model="form.is_digital" type="checkbox" class="checkbox checkbox-sm mt-0.5" />
            <span>محصول دیجیتال است (تحویل به صورت اکانت / کد / اشتراک)</span>
          </label>

          <label class="flex items-start gap-2 text-xs">
            <input v-model="form.is_active" type="checkbox" class="checkbox checkbox-sm mt-0.5" />
            <span>محصول فعال است</span>
          </label>
        </div>
      </div>

      <div class="flex justify-end gap-2 sm:gap-3 pt-1" dir="ltr">
        <RouterLink to="/admin/products" class="btn btn-ghost btn-sm">انصراف</RouterLink>
        <button class="btn btn-primary btn-sm px-6" type="submit" :disabled="loading.value">
          {{ isEdit ? 'ذخیره تغییرات' : 'ثبت محصول' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { reactive, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { adminCreateProduct, adminUpdateProduct, adminGetProduct } from '@/services/admin.ts'
import type { AdminCreateProductPayload, AdminGetProductResponse } from '@/types/api_client_types/admin.dto.ts'

/* -----------------------------
   Static Data
----------------------------- */
const categories = [
  { id: 1, title: 'اکانت' },
  { id: 2, title: 'گیفت کارت' },
  { id: 3, title: 'خدمات' },
]

/* -----------------------------
   Routing
----------------------------- */
const route = useRoute()
const router = useRouter()
const isEdit = computed(() => !!route.params.id)

/* -----------------------------
   Plan Types
----------------------------- */
type PlanType = 'individual' | 'family'
type PlanDuration = '1m' | '3m' | '6m' | '12m'

type PriceMatrix = Record<PlanType, Partial<Record<PlanDuration, number>>>

/* -----------------------------
   DB Mapping
----------------------------- */
const SUBSCRIPTION_TYPE_ID_BY_SLUG: Record<PlanType, number> = {
  individual: 2,
  family: 1,
}

const PLAN_TYPE_BY_SUBSCRIPTION_ID: Record<number, PlanType | undefined> = {
  2: 'individual',
  1: 'family',
}

const DURATION_TYPE_ID_BY_UI: Record<PlanDuration, number> = {
  '1m': 1,
  '3m': 2,
  '6m': 3,
  '12m': 4,
}

const DURATION_UI_BY_ID: Record<number, PlanDuration | undefined> = {
  1: '1m',
  2: '3m',
  3: '6m',
  4: '12m',
}

/* -----------------------------
   Form
----------------------------- */
type ProductForm = Omit<
    AdminCreateProductPayload,
    'subscription_type_ids' | 'duration_type_ids'
> & {
  plan_type: PlanType[]
  plan_duration: PlanDuration[]
  price_matrix: PriceMatrix
}

const form = reactive<ProductForm>({
  title: '',
  slug: '',
  description: '',
  short_description: '',
  price: undefined,
  compare_at_price: undefined,
  category_id: undefined,
  image_url: '',

  is_active: true,
  is_digital: true,

  delivery_type: undefined,
  platform: undefined,
  region: undefined,
  stock: undefined,

  plan_type: [],
  plan_duration: [],

  price_matrix: {
    individual: {},
    family: {},
  },
})

const loading = reactive({ value: false })

function formatPreviewPrice(val?: number) {
  if (!val) return '—'
  return new Intl.NumberFormat('fa-IR').format(val) + ' تومان'
}

/* -----------------------------
   Utils
----------------------------- */
const durationLabel = (d: PlanDuration) =>
    d === '1m' ? '1 ماهه'
        : d === '3m' ? '3 ماهه'
            : d === '6m' ? '6 ماهه'
                : '1 ساله'

function uniq<T>(arr: T[]) {
  return Array.from(new Set(arr))
}

/* -----------------------------
   Edit: load product and map to form
----------------------------- */
function resetMatrix() {
  form.price_matrix.individual = {}
  form.price_matrix.family = {}
}

function applyServerProductToForm(p: AdminGetProductResponse) {
  form.title = p.title ?? ''
  form.slug = p.slug ?? ''
  form.description = p.description ?? ''
  form.short_description = p.short_description ?? ''
  form.price = p.price ?? undefined
  form.compare_at_price = p.compare_at_price ?? undefined
  form.category_id = p.category_id ?? undefined
  form.image_url = p.image_url ?? ''
  form.is_active = (p.is_active ?? true) as boolean
  form.is_digital = (p.is_digital ?? true) as boolean

  form.delivery_type = p.delivery_type ?? undefined
  form.platform = p.platform ?? undefined
  form.region = p.region ?? undefined
  form.stock = p.stock ?? undefined

  // map subscription_types -> plan_type
  const planTypes: PlanType[] = []
  for (const st of (p.subscription_types ?? [])) {
    // اولویت: id mapping (سریع و دقیق)
    const t = PLAN_TYPE_BY_SUBSCRIPTION_ID[st.id]
    if (t) planTypes.push(t)
    else if (st.slug === 'individual') planTypes.push('individual')
    else if (st.slug === 'family') planTypes.push('family')
  }
  form.plan_type = uniq(planTypes)

  // map duration_types -> plan_duration
  const planDurs: PlanDuration[] = []
  for (const dt of (p.duration_types ?? [])) {
    const d = DURATION_UI_BY_ID[dt.id]
    if (d) planDurs.push(d)
    else {
      // اگر slugها دقیقاً همون‌هایی باشن که بک می‌فرسته
      if (dt.slug === '1_month') planDurs.push('1m')
      if (dt.slug === '3_month') planDurs.push('3m')
      if (dt.slug === '6_month') planDurs.push('6m')
      if (dt.slug === '1_year') planDurs.push('12m')
    }
  }
  form.plan_duration = uniq(planDurs)

  // map prices -> price_matrix
  resetMatrix()
  for (const row of (p.prices ?? [])) {
    const type = PLAN_TYPE_BY_SUBSCRIPTION_ID[row.subscription_type_id]
    const dur = DURATION_UI_BY_ID[row.duration_type_id]
    if (!type || !dur) continue
    form.price_matrix[type][dur] = row.price
  }

  // اگر بک personal_account داده باشه ولی آرایه‌ها خالی باشن، به صورت fallback:
  if (!form.plan_type.length && p.personal_account === true) {
    form.plan_type = ['individual']
  }
}

onMounted(async () => {
  if (!isEdit.value) return
  loading.value = true
  try {
    const id = Number(route.params.id)
    const p = await adminGetProduct(id)
    applyServerProductToForm(p)
  } catch (err: any) {
    console.error(err)
    alert(err?.message || 'خطا در دریافت محصول')
  } finally {
    loading.value = false
  }
})

/* -----------------------------
   Keep matrix clean when checkboxes change
----------------------------- */
watch(
    () => form.plan_type.slice(),
    (newTypes, oldTypes) => {
      const removed = oldTypes.filter(x => !newTypes.includes(x))
      for (const t of removed) {
        form.price_matrix[t] = {}
      }
    }
)

watch(
    () => form.plan_duration.slice(),
    (newDurs, oldDurs) => {
      const removed = oldDurs.filter(x => !newDurs.includes(x))
      if (!removed.length) return
      for (const t of (['individual', 'family'] as PlanType[])) {
        for (const d of removed) {
          if (form.price_matrix[t] && form.price_matrix[t][d] != null) {
            delete form.price_matrix[t][d]
          }
        }
      }
    }
)

/* -----------------------------
   Payload Builder
----------------------------- */
function buildPayload(): AdminCreateProductPayload {
  const payload: AdminCreateProductPayload = {
    title: form.title,
    slug: form.slug,
    description: form.description,
    short_description: form.short_description,
    price: form.price,
    compare_at_price: form.compare_at_price,
    category_id: form.category_id,
    image_url: form.image_url,
    is_active: form.is_active,
    is_digital: form.is_digital,

    delivery_type: form.delivery_type,
    platform: form.platform,
    region: form.region,
    stock: form.stock,

    personal_account: form.plan_type.includes('individual'),
  }

  payload.subscription_type_ids = uniq(
      form.plan_type.map(p => SUBSCRIPTION_TYPE_ID_BY_SLUG[p])
  )

  payload.duration_type_ids = uniq(
      form.plan_duration.map(d => DURATION_TYPE_ID_BY_UI[d])
  )

  payload.prices = []
  for (const type of form.plan_type) {
    for (const dur of form.plan_duration) {
      const price = form.price_matrix[type]?.[dur]
      if (price != null) {
        payload.prices.push({
          subscription_type_id: SUBSCRIPTION_TYPE_ID_BY_SLUG[type],
          duration_type_id: DURATION_TYPE_ID_BY_UI[dur],
          price,
        })
      }
    }
  }

  return payload
}

/* -----------------------------
   Save
----------------------------- */
async function save() {
  loading.value = true
  try {
    const payload = buildPayload()
    if (isEdit.value) {
      await adminUpdateProduct(Number(route.params.id), payload)
    } else {
      await adminCreateProduct(payload)
    }
    router.push('/admin/products')
  } catch (err: any) {
    console.error(err)
    alert(err?.message || 'خطا در ذخیره محصول')
  } finally {
    loading.value = false
  }
}

function getCategoryTitle(id?: number) {
  const cat = categories.find(c => c.id === id)
  return cat?.title ?? ''
}
</script>

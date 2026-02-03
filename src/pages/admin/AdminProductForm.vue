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
          <span class="text-base-content/60">قیمت</span>
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
            <span class="label-text text-[11px]">قیمت (تومان)</span>
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
            <select v-model="form.category_id" class="select select-bordered select-sm">
              <option value="" disabled>انتخاب دسته‌بندی</option>
              <option v-for="cat in categories" :key="cat.id" :value="cat.id">
                {{ cat.title }}
              </option>
            </select>
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
      </div>

      <!-- ✅ اطلاعات پلن (چند انتخابی / checkbox) -->
      <div class="space-y-3">
        <div class="flex items-center justify-between gap-2">
          <h3 class="text-sm font-semibold text-base-content">اطلاعات پلن</h3>

          <span class="text-[11px] text-base-content/60">
            {{ planSummary }}
          </span>
        </div>

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
import { reactive, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { adminCreateProduct, adminUpdateProduct, adminGetProduct } from '@/services/admin.ts'
import type { AdminCreateProductPayload, AdminGetProductResponse } from '@/types/api_client_types/admin.dto.ts'

/**
 * ✅ رفع Type Error ها:
 * بک در برخی فیلدها null برمی‌گرداند ولی تایپ‌ها optional هستند (undefined).
 * پس هنگام ست کردن روی فرم، null را به undefined تبدیل می‌کنیم.
 */

const categories = [
  { id: 1, title: 'اکانت' },
  { id: 2, title: 'گیفت کارت' },
  { id: 3, title: 'خدمات' },
]

const route = useRoute()
const router = useRouter()
const isEdit = computed(() => !!route.params.id)

type PlanType = 'individual' | 'family'
type PlanDuration = '1m' | '3m' | '6m' | '12m'

type ProductForm = AdminCreateProductPayload & {
  plan_type: PlanType[]
  plan_duration: PlanDuration[]
}

const form = reactive<ProductForm>({
  title: '',
  slug: '',
  description: '',
  price: undefined,
  compare_at_price: undefined,
  category_id: undefined,
  image_url: '',

  is_active: true,
  is_digital: true,

  delivery_type: undefined,
  platform: undefined,
  duration: undefined,
  region: undefined,
  stock: undefined,

  plan_type: [],
  plan_duration: [],
})

const loading = reactive({ value: false })

function normalizeToArray<T extends string>(val: any): T[] {
  if (Array.isArray(val)) return val as T[]
  if (typeof val === 'string' && val.length) return [val as T]
  return []
}

function nullToUndef<T>(v: T | null | undefined): T | undefined {
  return v === null ? undefined : v
}

const planSummary = computed(() => {
  const t = form.plan_type?.length ? form.plan_type.join('، ') : 'بدون نوع'
  const d = form.plan_duration?.length ? form.plan_duration.join('، ') : 'بدون مدت'
  return `${t} • ${d}`
})

function buildPayload(): AdminCreateProductPayload {
  const payload: any = {
    ...form,
    // ✅ اگر خالی بود اصلاً ارسال نشود
    plan_type: form.plan_type?.length ? form.plan_type : undefined,
    plan_duration: form.plan_duration?.length ? form.plan_duration : undefined,
  }

  // ✅ حذف undefined ها
  Object.keys(payload).forEach((k) => payload[k] === undefined && delete payload[k])
  return payload as AdminCreateProductPayload
}

onMounted(async () => {
  if (!isEdit.value) return

  loading.value = true
  try {
    const productId = Number(route.params.id)
    if (isNaN(productId)) {
      alert('شناسه محصول نامعتبر است')
      router.push('/admin/products')
      return
    }

    const data: AdminGetProductResponse = await adminGetProduct(productId)
    const anyData = data as any

    form.title = data.title ?? ''
    form.slug = data.slug ?? ''
    form.description = nullToUndef(data.description) ?? ''
    form.price = nullToUndef(data.price)
    form.compare_at_price = nullToUndef(data.compare_at_price)
    form.category_id = nullToUndef(data.category_id)
    form.image_url = nullToUndef(data.image_url) ?? ''

    form.is_active = (data.is_active ?? true) as any

    // ✅ این‌ها در بک ممکنه null باشند
    form.delivery_type = nullToUndef(anyData.delivery_type)
    form.platform = nullToUndef(anyData.platform)
    form.duration = nullToUndef(anyData.duration)
    form.region = nullToUndef(anyData.region)
    form.stock = nullToUndef(anyData.stock)

    // ✅ فیلدهای جدید پلن
    form.plan_type = normalizeToArray<PlanType>(anyData.plan_type)
    form.plan_duration = normalizeToArray<PlanDuration>(anyData.plan_duration)

    // اگر بک جدیداً is_digital هم داد
    form.is_digital = (anyData?.is_digital ?? true) as any
  } catch (err: any) {
    console.error('خطا در دریافت اطلاعات محصول:', err)
    alert('خطا در بارگذاری محصول برای ویرایش')
    router.push('/admin/products')
  } finally {
    loading.value = false
  }
})

async function save() {
  loading.value = true
  try {
    const payload = buildPayload()

    if (isEdit.value) {
      const productId = Number(route.params.id)
      if (isNaN(productId)) {
        alert('شناسه محصول نامعتبر است')
        return
      }
      await adminUpdateProduct(productId, payload)
    } else {
      await adminCreateProduct(payload)
    }

    router.push('/admin/products')
  } catch (err: any) {
    console.error('خطا در ذخیره محصول:', err)
    alert(err?.message || 'مشکلی در ذخیره محصول رخ داد.')
  } finally {
    loading.value = false
  }
}

function formatPreviewPrice(val?: number) {
  if (!val) return '—'
  return new Intl.NumberFormat('fa-IR').format(val) + ' تومان'
}

function getCategoryTitle(id?: number) {
  const cat = categories.find((c) => c.id === id)
  return cat?.title ?? ''
}
</script>

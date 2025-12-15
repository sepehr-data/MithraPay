<template>
  <div class="space-y-6 max-w-4xl mx-auto" dir="rtl">
    <!-- هدر با گرادیانت ملایم و اوپاسیتی کم -->
    <section
        class="relative rounded-3xl border border-base-300 shadow-sm overflow-hidden
             bg-gradient-to-l from-primary/15 via-primary/5 to-secondary/10"
    >
      <!-- نوار رنگی راست (خیلی ملایم) -->
      <div
          class="absolute inset-y-0 right-0 w-1.5 bg-gradient-to-b from-primary/40 to-secondary/40"
      ></div>

      <div class="px-5 sm:px-6 py-4 sm:py-5 pr-6">
        <div
            class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between"
        >
          <div class="space-y-1">
            <h2 class="text-base sm:text-xl font-bold text-base-content">
              {{ isEdit ? 'ویرایش محصول' : 'افزودن محصول جدید' }}
            </h2>
            <p class="text-[11px] sm:text-xs text-base-content/80">
              مشخصات محصول را وارد کن تا در لیست محصولات نمایش داده شود.
            </p>
          </div>

          <div
              class="flex flex-col items-start sm:items-end gap-1 text-[11px] sm:text-xs"
          >
            <span
                class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full
                     bg-primary/10 text-primary border border-primary/20"
            >
              <span
                  class="w-1.5 h-1.5 rounded-full bg-gradient-to-br from-primary to-secondary"
              ></span>
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
      <div
          class="grid gap-3 sm:grid-cols-3 text-[11px] sm:text-xs rounded-2xl bg-base-200/60 px-3 py-2.5"
      >
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
            {{ form.categoryId || 'تنظیم نشده' }}
          </span>
        </div>
      </div>

      <!-- اطلاعات اصلی -->
      <div class="space-y-3">
        <h3 class="text-sm font-semibold text-base-content">
          اطلاعات اصلی
        </h3>

        <div class="grid gap-3 md:grid-cols-2">
          <label class="form-control">
            <span class="label-text text-[11px]">عنوان محصول</span>
            <input
                v-model="form.title"
                class="input input-bordered input-sm"
                required
            />
          </label>

          <label class="form-control">
            <span class="label-text text-[11px]">Slug</span>
            <input
                v-model="form.slug"
                class="input input-bordered input-sm ltr text-left"
                required
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
        <h3 class="text-sm font-semibold text-base-content">
          قیمت‌گذاری و دسته‌بندی
        </h3>

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
                v-model.number="form.compareAt"
                type="number"
                class="input input-bordered input-sm ltr text-left"
                min="0"
            />
          </label>

          <label class="form-control">
            <span class="label-text text-[11px]">شناسه دسته</span>
            <input
                v-model="form.categoryId"
                class="input input-bordered input-sm"
            />
          </label>

          <label class="form-control">
            <span class="label-text text-[11px]">آدرس تصویر محصول</span>
            <input
                v-model="form.image"
                class="input input-bordered input-sm ltr text-left"
                placeholder=" /images/product.png"
            />
          </label>
        </div>
      </div>

      <!-- تنظیمات -->
      <div class="space-y-2">
        <h3 class="text-sm font-semibold text-base-content">
          تنظیمات
        </h3>

        <label class="inline-flex items-center gap-2 text-xs">
          <input
              v-model="form.isDigital"
              type="checkbox"
              class="checkbox checkbox-sm"
          />
          <span>محصول دیجیتال است (تحویل به صورت اکانت / کد / اشتراک)</span>
        </label>
      </div>

      <div
          class="flex justify-end gap-2 sm:gap-3 pt-1"
          dir="ltr"
      >
        <RouterLink
            to="/admin/products"
            class="btn btn-ghost btn-sm"
        >
          انصراف
        </RouterLink>
        <button
            class="btn btn-primary btn-sm px-6"
            type="submit"
        >
          {{ isEdit ? 'ذخیره تغییرات' : 'ثبت محصول' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { reactive, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useProductsStore } from '@/stores/products'

const route = useRoute()
const router = useRouter()
const store = useProductsStore()

const isEdit = computed(() => !!route.params.id)
const existing = isEdit.value
    ? (store.products as any[]).find((p: any) => p.id === route.params.id)
    : null

const form = reactive<any>(
    existing
        ? { ...existing }
        : {
          id: 'p' + Math.random().toString(36).slice(2, 7),
          slug: '',
          title: '',
          description: '',
          price: 0,
          compareAt: null,
          image: '',
          categoryId: '',
          isDigital: true,
        },
)

function save() {
  if (isEdit.value) {
    const idx = (store.products as any[]).findIndex(
        (p: any) => p.id === form.id,
    )
    if (idx >= 0) (store.products as any[])[idx] = { ...form }
  } else {
    ;(store.products as any[]).unshift({ ...form })
  }
  router.push('/admin/products')
}

function formatPreviewPrice(val: number) {
  return new Intl.NumberFormat('fa-IR').format(val) + ' تومان'
}
</script>

<template>
  <div class="space-y-6 max-w-4xl mx-auto" dir="rtl">
    <!-- هدر مینیمال شبیه فرم مقالات -->
    <section
        class="relative rounded-3xl border border-base-300 shadow-sm overflow-hidden
             bg-gradient-to-l from-primary/15 via-primary/5 to-secondary/10"
    >
      <div class="absolute inset-y-0 right-0 w-1.5 bg-gradient-to-b from-primary/40 to-secondary/40"></div>

      <div class="px-5 sm:px-6 py-4 sm:py-5 pr-6">
        <div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div class="space-y-1">
            <h2 class="text-base sm:text-xl font-bold text-base-content">
              {{ isEdit ? 'ویرایش بنر' : 'افزودن بنر جدید' }}
            </h2>
            <p class="text-[11px] sm:text-xs text-base-content/80">
              عنوان، آدرس تصویر و لینک مقصد را تنظیم کن تا در اسلایدر نمایش داده شود.
            </p>
          </div>

          <div class="flex flex-col items-start sm:items-end gap-1 text-[11px] sm:text-xs">
            <span
                class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full
                     bg-primary/10 text-primary border border-primary/20"
            >
              <span class="w-1.5 h-1.5 rounded-full bg-gradient-to-br from-primary to-secondary"></span>
              {{ isEdit ? 'حالت ویرایش' : 'بنر جدید' }}
            </span>
          </div>
        </div>
      </div>
    </section>

    <!-- کارت فرم -->
    <section
        class="rounded-2xl bg-base-100 border border-base-300 shadow-sm px-4 sm:px-5 py-4 sm:py-5 space-y-5"
    >
      <div
          class="grid gap-3 sm:grid-cols-4 text-[11px] sm:text-xs rounded-2xl bg-base-200/60 px-3 py-2.5"
      >
        <div class="flex flex-col gap-0.5 min-w-0 sm:col-span-1">
          <span class="text-base-content/60">عنوان</span>
          <span class="font-semibold text-base-content truncate">{{ banner.alt || '—' }}</span>
        </div>

        <div class="flex flex-col gap-0.5 min-w-0 sm:col-span-2">
          <span class="text-base-content/60">لینک مقصد</span>
          <span
              dir="ltr"
              class="font-semibold text-base-content block w-full truncate text-right [unicode-bidi:plaintext]"
              :title="banner.to"
          >
            {{ banner.to || '—' }}
          </span>
        </div>

        <div class="flex flex-col gap-0.5 min-w-0 sm:col-span-1">
          <span class="text-base-content/60">حالت</span>
          <span class="font-semibold text-base-content">
            {{ isEdit ? `ویرایش (ID: ${banner.id || route.params.id})` : 'ایجاد' }}
          </span>
        </div>
      </div>

      <!-- فرم -->
      <form @submit.prevent="saveBanner" class="space-y-4">
        <div class="space-y-3">
          <h3 class="text-sm font-semibold text-base-content">اطلاعات بنر</h3>

          <div class="grid gap-3 md:grid-cols-2">
            <label class="form-control">
              <span class="label-text text-[11px]">عنوان بنر</span>
              <input
                  v-model="banner.alt"
                  id="alt"
                  type="text"
                  class="input input-bordered input-sm"
                  placeholder="عنوان بنر را وارد کنید"
                  required
              />
            </label>

            <label class="form-control">
              <span class="label-text text-[11px]">لینک مقصد</span>
              <input
                  v-model="banner.to"
                  id="to"
                  type="url"
                  class="input input-bordered input-sm ltr text-left"
                  placeholder="/product/apple-tv"
                  required
              />
            </label>

            <label class="form-control md:col-span-2">
              <span class="label-text text-[11px]">آدرس تصویر بنر</span>
              <input
                  v-model="banner.image"
                  id="image"
                  type="text"
                  class="input input-bordered input-sm ltr text-left"
                  placeholder="/banners/slider3.webp"
                  required
              />
            </label>
          </div>
        </div>

        <div class="flex justify-end gap-2 sm:gap-3 pt-1" dir="ltr">
          <RouterLink to="/admin/banners" class="btn btn-outline btn-sm">
            انصراف
          </RouterLink>
          <button class="btn btn-primary btn-sm px-6" type="submit">
            {{ isEdit ? 'ذخیره تغییرات' : 'ذخیره بنر' }}
          </button>
        </div>
      </form>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import {
  adminCreateBanner,
  adminGetBanner,
  adminUpdateBanner,
} from '@/services/admin.ts'
import {AdminCreateBannerPayload } from '@/types/api_client_types/admin.dto.ts'
interface Banner {
  id: string
  image: string
  alt: string
  to: string
}

const route = useRoute()
const router = useRouter()
const toast = useToast()

const isEdit = computed(() => !!route.params.id)

const banner = ref<Banner>({
  id: '',
  image: '',
  alt: '',
  to: ''
})

// اگر حالت ویرایش است، بنر را از API دریافت کن
onMounted(async () => {
  if (isEdit.value) {
    try {
      const bannerId = Number(route.params.id)
      const data = await adminGetBanner(bannerId)
      banner.value = {
        id: data.id.toString(),
        image: data.image_url,
        alt: data.title,
        to: data.link || ''
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'خطا در دریافت اطلاعات بنر')
    }
  }
})

// ذخیره بنر (ایجاد یا ویرایش)
const saveBanner = async () => {
  try {
    const payload: AdminCreateBannerPayload = {
      title: banner.value.alt,
      link: banner.value.to,
      image_url: banner.value.image
    }

    if (isEdit.value) {
      await adminUpdateBanner(Number(banner.value.id), payload)
      toast.success('بنر با موفقیت ویرایش شد')
    } else {
      await adminCreateBanner(payload)
      toast.success('بنر با موفقیت ایجاد شد')
    }

    router.push('/admin/banners')
  } catch (err: any) {
    toast.error(err?.response?.data?.message || 'خطا در ذخیره بنر')
  }
}
</script>

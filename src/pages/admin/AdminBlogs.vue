<template>
  <div class="space-y-6" dir="rtl">
    <!-- HERO بالا برای مقالات -->
    <section
        class="relative overflow-hidden rounded-3xl bg-gradient-to-l from-primary/95 via-primary/85 to-secondary/80 text-primary-content p-5 sm:p-6 shadow-xl"
    >
      <div
          class="relative z-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
      >
        <!-- عنوان و توضیح -->
        <div class="space-y-1.5">
          <p
              class="text-[10px] uppercase tracking-[0.25em] text-primary-content/70"
          >
            ARTICLES
          </p>
          <h2 class="text-lg sm:text-2xl font-extrabold">
            مدیریت مقالات
          </h2>
          <p class="mt-1 text-xs sm:text-sm text-primary-content/80">
            مدیریت و ویرایش مقالات آموزشی و محتوای وبلاگ سپهر‌باکس.
          </p>
        </div>

        <!-- آمار و دکمه افزودن مطلب -->
        <div class="flex flex-col items-end gap-2 text-[11px] sm:text-xs">
          <div
              class="inline-flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-primary-content/10 border border-primary-content/20"
          >
            <span class="w-1.5 h-1.5 rounded-full bg-primary-content/80"></span>
            <span>تعداد کل مقالات:</span>
            <span class="font-bold text-sm">
              {{ totalBlogs }}
            </span>
          </div>

          <div class="flex flex-wrap gap-2 justify-end">
            <RouterLink
                to="/admin/blogs/new"
                class="btn btn-sm bg-primary-content text-primary rounded-2xl border-0 hover:bg-white"
            >
              مطلب جدید
            </RouterLink>
          </div>
        </div>
      </div>

      <!-- دکور بک‌گراند -->
      <div
          class="pointer-events-none absolute -left-24 -bottom-24 w-64 h-64 rounded-full border border-primary-content/20 opacity-40"
      ></div>
      <div
          class="pointer-events-none absolute -right-16 -top-16 w-48 h-48 rounded-full border border-primary-content/25 opacity-50"
      ></div>
    </section>

    <!-- لیست مقالات + جستجو -->
    <section
        class="bg-base-100 rounded-3xl border border-base-300/80 p-4 sm:p-5 shadow-sm space-y-4"
    >
      <!-- هدر لیست -->
      <div
          class="flex flex-col gap-3 md:flex-row md:items-center md:justify-between"
      >
        <div class="space-y-1">
          <h3 class="text-sm sm:text-base font-semibold text-base-content">
            مقالات
          </h3>
          <p class="text-[11px] sm:text-xs text-base-content/60">
            لیست مقالات منتشرشده / در حال تدوین
          </p>
        </div>

        <!-- سرچ -->
        <div class="w-full sm:w-72 relative">
          <span
              class="pointer-events-none absolute inset-y-0 right-3 flex items-center"
          >
            <svg
                class="w-4 h-4 text-base-content/50"
                viewBox="0 0 24 24"
                fill="none"
            >
              <circle
                  cx="11"
                  cy="11"
                  r="6"
                  stroke="currentColor"
                  stroke-width="1.5"
              />
              <line
                  x1="15.5"
                  y1="15.5"
                  x2="20"
                  y2="20"
                  stroke="currentColor"
                  stroke-width="1.5"
                  stroke-linecap="round"
              />
            </svg>
          </span>
          <input
              v-model="q"
              class="input input-bordered min-h-0 h-9 w-full pr-8 rounded-2xl text-[11px] py-1"
              placeholder="جستجو در عنوان یا نام نویسنده..."
          />
        </div>
      </div>

      <!-- بدنه لیست -->
      <div class="space-y-3">
        <!-- اگر مقاله‌ای هست -->
        <div
            v-if="filtered.length"
            class="grid gap-3 sm:gap-4 md:grid-cols-2"
        >
          <article
              v-for="p in filtered"
              :key="p.id"
              class="group rounded-2xl border border-base-300 bg-base-100/90 px-3.5 py-3 sm:px-4 sm:py-3.5 flex items-center justify-between gap-3 hover:-translate-y-0.5 hover:shadow-md hover:border-primary/40 transition-all"
          >
            <!-- اطلاعات مقاله -->
            <div class="flex flex-col gap-1 min-w-0">
              <h4
                  class="text-xs sm:text-sm font-medium text-base-content truncate max-w-[220px]"
              >
                {{ p.title }}
              </h4>

              <div class="flex flex-wrap gap-1.5 text-[10px] sm:text-[11px]">
                <span
                    class="inline-flex items-center px-2 py-0.5 rounded-full bg-base-200/80 text-base-content/70"
                >
                  نویسنده:
                  <span class="ml-1">{{ p.author || 'نامشخص' }}</span>
                </span>
                <span
                    class="inline-flex items-center px-2 py-0.5 rounded-full bg-base-200/60 text-base-content/70"
                >
                  تاریخ:
                  <span class="ml-1">{{ p.date }}</span>
                </span>

              </div>
            </div>

            <!-- اکشن‌ها -->
            <div
                class="flex flex-col items-end gap-1 text-[10px] sm:text-[11px] min-w-[120px]"
            >
              <RouterLink
                  :to="`/admin/blogs/${p.id}`"
                  class="btn btn-xs btn-outline w-full justify-center"
              >
                ویرایش
              </RouterLink>
              <button
                  class="btn btn-xs btn-error w-full justify-center"
                  @click="remove(p.id)"
              >
                حذف
              </button>
            </div>
          </article>
        </div>

        <!-- اگر هیچ مقاله‌ای نبود -->
        <div
            v-else
            class="py-10 flex flex-col items-center justify-center gap-2 text-center text-xs text-base-content/60"
        >
          <div
              class="h-16 w-16 rounded-3xl border border-dashed border-base-300 flex items-center justify-center mb-1"
          >
            <div class="h-8 w-8 rounded-2xl bg-base-200"></div>
          </div>
          <p>مقاله‌ای با این شرایط پیدا نشد.</p>
          <p class="text-[11px] text-base-content/50">
            عبارت جستجو را تغییر بده یا یک مطلب جدید اضافه کن.
          </p>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const blogs = ref([
  {
    id: 'b1',
    title: 'آیکلود یک اپ؛ مشکلات رایج آیکلاد',
    slug: 'icloud-common-issues',
    author: 'ادمین',
    date: '1404/03/20',
    content: '<p>نمونه متن...</p>',
  },
  {
    id: 'b2',
    title: 'مزایای یوتیوب پریمیوم',
    slug: 'youtube-premium',
    author: 'ادمین',
    date: '1404/03/21',
    content: '<p>نمونه متن...</p>',
  },
])

const q = ref('')

const filtered = computed(() => {
  if (!q.value) return blogs.value
  const t = q.value.toLowerCase()
  return blogs.value.filter(
      (b) =>
          b.title.toLowerCase().includes(t) ||
          (b.author && b.author.toLowerCase().includes(t)),
  )
})

const totalBlogs = computed(() => blogs.value.length)

function remove(id: string) {
  const idx = blogs.value.findIndex((b) => b.id === id)
  if (idx >= 0) blogs.value.splice(idx, 1)
}
</script>

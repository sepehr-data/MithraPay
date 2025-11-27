<template>
  <div class="category-page space-y-10 lg:space-y-12">
    <section class="space-y-4">
      <Breadcrumbs :crumbs="[{ title: 'دسته‌بندی' }, { title: catTitle }]" />
      <div class="rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-6 lg:p-8 shadow-lg">
        <p class="text-sm text-slate-200/80">خانه / گیفت کارت / {{ catTitle }}</p>
        <div class="mt-3 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div class="space-y-2">
            <h1 class="text-2xl lg:text-3xl font-bold">{{ catTitle }} اپل</h1>
            <p class="text-sm lg:text-base text-slate-200">
              خرید مطمئن و سریع گیفت کارت‌های اپل با تحویل آنی و پشتیبانی دائمی؛ مناسب شارژ اپل آیدی، آیتونز و سرویس‌های پریمیوم.
            </p>
          </div>
          <div class="flex items-center gap-3 text-amber-400">
            <div class="flex gap-1 text-lg" aria-hidden="true">
              <span>★</span><span>★</span><span>★</span><span>★</span><span class="text-amber-200">★</span>
            </div>
            <span class="text-slate-200 text-sm">({{ filtered.length }} محصول برتر)</span>
          </div>
        </div>
      </div>
    </section>

    <section class="grid gap-6 lg:grid-cols-[1.2fr,0.8fr] items-start">
      <div class="space-y-6">
        <div class="rounded-2xl bg-white p-6 shadow-md border border-slate-100 space-y-4">
          <div class="flex flex-col gap-2">
            <p class="text-xs font-medium uppercase tracking-widest text-primary-600">ویژه اپل</p>
            <h2 class="text-xl font-bold text-slate-800">چرا {{ catTitle }} از میتراپی؟</h2>
            <p class="text-sm text-slate-600 leading-relaxed">
              بیشترین تنوع موجودی، قیمت منصفانه و تحویل سریع باعث شده کاربران ایرانی برای خرید گیفت کارت‌های اپل سراغ ما بیایند. تمامی کدها قانونی و قابل فعال‌سازی در لحظه هستند.
            </p>
          </div>
          <ul class="grid gap-3 sm:grid-cols-2">
            <li class="flex items-start gap-3 rounded-xl border border-slate-100 p-3">
              <span class="text-emerald-500 text-lg">✔</span>
              <div>
                <p class="text-sm font-semibold text-slate-800">تحویل آنی</p>
                <p class="text-xs text-slate-600">کد پس از پرداخت بلافاصله نمایش داده می‌شود.</p>
              </div>
            </li>
            <li class="flex items-start gap-3 rounded-xl border border-slate-100 p-3">
              <span class="text-emerald-500 text-lg">✔</span>
              <div>
                <p class="text-sm font-semibold text-slate-800">پشتیبانی تخصصی</p>
                <p class="text-xs text-slate-600">راهنمایی فعال‌سازی و رفع خطاها به صورت ۲۴/۷.</p>
              </div>
            </li>
            <li class="flex items-start gap-3 rounded-xl border border-slate-100 p-3">
              <span class="text-emerald-500 text-lg">✔</span>
              <div>
                <p class="text-sm font-semibold text-slate-800">تنوع ریجن</p>
                <p class="text-xs text-slate-600">آمریکا، ترکیه، امارات و دیگر ریجن‌ها با موجودی کامل.</p>
              </div>
            </li>
            <li class="flex items-start gap-3 rounded-xl border border-slate-100 p-3">
              <span class="text-emerald-500 text-lg">✔</span>
              <div>
                <p class="text-sm font-semibold text-slate-800">قیمت رقابتی</p>
                <p class="text-xs text-slate-600">قیمت‌ها به‌روز و همراه با تخفیف دوره‌ای.</p>
              </div>
            </li>
          </ul>
        </div>

        <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div class="feature-tile">
            <div class="feature-icon">🔒</div>
            <div>
              <p class="feature-title">پرداخت امن</p>
              <p class="feature-copy">تسویه درگاه بانکی معتبر با رمز پویا.</p>
            </div>
          </div>
          <div class="feature-tile">
            <div class="feature-icon">⚡</div>
            <div>
              <p class="feature-title">فعال‌سازی سریع</p>
              <p class="feature-copy">آموزش قدم‌به‌قدم برای ورود کد.</p>
            </div>
          </div>
          <div class="feature-tile">
            <div class="feature-icon">🎁</div>
            <div>
              <p class="feature-title">هدیه ایده‌آل</p>
              <p class="feature-copy">مناسب گیمرها و کاربران اپل موزیک.</p>
            </div>
          </div>
        </div>

        <div class="rounded-2xl bg-white shadow-md border border-slate-100 overflow-hidden">
          <div class="flex items-center justify-between border-b border-slate-100 px-4 py-3 lg:px-6">
            <div>
              <p class="text-xs uppercase text-slate-500 tracking-widest">جستجو و انتخاب</p>
              <h3 class="text-lg font-semibold text-slate-800">محصولات موجود {{ catTitle }}</h3>
            </div>
            <div class="hidden text-sm text-slate-500 lg:block">{{ filtered.length }} محصول</div>
          </div>
          <div class="grid gap-0 lg:grid-cols-[320px,1fr]">
            <div class="border-b border-slate-100 bg-slate-50/60 p-4 lg:border-b-0 lg:border-e lg:p-6">
              <div class="sticky top-4 space-y-4">
                <h4 class="text-sm font-semibold text-slate-700">فیلترهای پیشرفته</h4>
                <FiltersSidebar v-model:onlyDigital="onlyDigital" v-model:onlyDiscount="onlyDiscount" />
              </div>
            </div>
            <div class="p-4 lg:p-6 space-y-4">
              <SortBar v-model="sort" :total="filtered.length" />
              <ProductGrid :products="paged" />
              <div class="mt-4 flex justify-center">
                <Pagination :page="page" :pages="pages" @update:page="page = $event" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="space-y-6 lg:sticky lg:top-6">
        <div class="rounded-2xl border border-slate-100 bg-white p-6 shadow-lg space-y-5">
          <div class="flex items-center justify-between">
            <p class="text-sm font-medium text-slate-700">خرید فوری</p>
            <span class="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-600">موجود</span>
          </div>
          <div class="space-y-2">
            <h3 class="text-xl font-bold text-slate-900">{{ filtered.length ? filtered[0].title : catTitle }}</h3>
            <p class="text-sm text-slate-600">{{ filtered.length ? 'پرفروش‌ترین انتخاب کاربران برای شارژ اپل آیدی.' : 'محصولات جدید به زودی افزوده می‌شوند.' }}</p>
          </div>
          <div class="flex items-center gap-2 text-amber-500" aria-hidden="true">
            <span>★</span><span>★</span><span>★</span><span>★</span><span class="text-amber-200">★</span>
            <span class="text-xs text-slate-500">امتیاز کاربران</span>
          </div>
          <div class="space-y-2">
            <p class="text-xs font-semibold uppercase tracking-widest text-slate-500">انتخاب مبلغ</p>
            <div class="grid grid-cols-2 gap-2">
              <button type="button" class="chip-btn chip-btn--active">10$</button>
              <button type="button" class="chip-btn">25$</button>
              <button type="button" class="chip-btn">50$</button>
              <button type="button" class="chip-btn">100$</button>
            </div>
          </div>
          <div class="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3">
            <span class="text-sm text-slate-500">قیمت نهایی</span>
            <div class="text-end">
              <p class="text-2xl font-bold text-slate-900" v-if="filtered.length && filtered[0].price">{{ filtered[0].price.toLocaleString() }} تومان</p>
              <p class="text-2xl font-bold text-slate-900" v-else>استعلام لحظه‌ای</p>
              <p class="text-xs text-slate-500">بدون هزینه پنهان</p>
            </div>
          </div>
          <button type="button" class="primary-btn">خرید و دریافت کد</button>
          <div class="space-y-2 text-sm text-slate-600">
            <div class="flex items-center gap-2">
              <span class="text-emerald-500">⏱</span>
              <span>تحویل آنی در داشبورد کاربری</span>
            </div>
            <div class="flex items-center gap-2">
              <span class="text-emerald-500">🌍</span>
              <span>انتخاب ریجن دلخواه در مراحل خرید</span>
            </div>
            <div class="flex items-center gap-2">
              <span class="text-emerald-500">💬</span>
              <span>پشتیبانی تلگرام و واتساپ</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="rounded-2xl border border-slate-100 bg-white p-6 shadow-md space-y-4">
      <div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <h3 class="text-lg font-semibold text-slate-900">جزئیات و راهنما</h3>
        <p class="text-sm text-slate-500">اطلاعات تکمیلی برای خرید و استفاده از {{ catTitle }}</p>
      </div>
      <div class="space-y-3 divide-y divide-slate-100">
        <details class="info-accordion" open>
          <summary>توضیحات محصول</summary>
          <p>
            خرید گیفت کارت اپل به شما امکان دسترسی به اپلیکیشن‌ها، بازی‌ها و اشتراک‌های رسمی اپل را می‌دهد. کدهای ارائه‌شده قابل استفاده روی همه دستگاه‌های اپل هستند.
          </p>
        </details>
        <details class="info-accordion">
          <summary>نحوه استفاده</summary>
          <p>
            پس از دریافت کد، وارد App Store یا iTunes شوید، گزینه Redeem Gift Card را انتخاب کرده و کد را وارد کنید. برای اطمینان از ریجن صحیح، پیش از ورود کد VPN خود را فعال کنید.
          </p>
        </details>
        <details class="info-accordion">
          <summary>سؤالات متداول</summary>
          <p>
            در صورت بروز خطا در فعال‌سازی، با پشتیبانی در تماس باشید تا راهنمایی لازم ارائه شود. موجودی کارت در لحظه خرید قابل مشاهده است و امکان استرداد پس از نمایش کد وجود ندارد.
          </p>
        </details>
        <details class="info-accordion">
          <summary>قوانین و شرایط</summary>
          <p>
            استفاده از کد صرفاً برای حساب‌های شخصی مجاز است. مسئولیت انتخاب ریجن صحیح بر عهده کاربر بوده و تمامی خریدها مطابق قوانین تجارت الکترونیک ایران انجام می‌شود.
          </p>
        </details>
      </div>
    </section>

    <section class="rounded-2xl border border-slate-100 bg-white p-6 shadow-md space-y-4">
      <div class="flex items-center justify-between">
        <h3 class="text-lg font-semibold text-slate-900">سؤالات متداول کاربران</h3>
        <span class="text-xs text-slate-500">پاسخ سریع به دغدغه‌های شما</span>
      </div>
      <div class="space-y-3">
        <details class="faq-item" open>
          <summary>
            آیا کدها تاریخ انقضا دارند؟
            <span class="chevron">⌄</span>
          </summary>
          <p>تمامی کدها معتبر و بدون تاریخ انقضای کوتاه‌مدت هستند. پیشنهاد می‌شود پس از خرید از آن استفاده کنید تا مطمئن شوید روی حساب شما شارژ شده است.</p>
        </details>
        <details class="faq-item">
          <summary>
            در صورت خطا در ریجن چه کنم؟
            <span class="chevron">⌄</span>
          </summary>
          <p>در صورت دریافت پیام خطای ریجن، با پشتیبانی تماس بگیرید تا مناسب‌ترین ریجن برای شما ارسال شود یا راهنمای تغییر ریجن دریافت کنید.</p>
        </details>
        <details class="faq-item">
          <summary>
            آیا می‌توانم برای شخص دیگری هدیه بخرم؟
            <span class="chevron">⌄</span>
          </summary>
          <p>بله، کافی است کد دریافتی را برای فرد مورد نظر ارسال کنید. کد پس از فعال‌سازی روی حساب گیرنده اعمال می‌شود.</p>
        </details>
      </div>
    </section>

    <section class="rounded-2xl bg-slate-50 border border-slate-100 p-4 lg:p-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between shadow-inner">
      <div class="flex items-center gap-2 text-slate-700">
        <span class="badge-icon">✅</span>
        <span class="text-sm font-semibold">100% قانونی و اورجینال</span>
      </div>
      <div class="flex items-center gap-2 text-slate-700">
        <span class="badge-icon">⚡</span>
        <span class="text-sm font-semibold">تحویل آنی کد</span>
      </div>
      <div class="flex items-center gap-2 text-slate-700">
        <span class="badge-icon">🛡</span>
        <span class="text-sm font-semibold">پشتیبانی ۲۴/۷</span>
      </div>
      <div class="flex items-center gap-2 text-slate-700">
        <span class="badge-icon">💳</span>
        <span class="text-sm font-semibold">پرداخت امن بانکی</span>
      </div>
    </section>

    <section class="space-y-4">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-xs uppercase tracking-widest text-slate-500">محصولات مشابه</p>
          <h3 class="text-lg font-semibold text-slate-900">گزینه‌های دیگری که ممکن است بپسندید</h3>
        </div>
        <span class="text-xs text-slate-500">نمایش {{ Math.min(filtered.length, 4) }} مورد</span>
      </div>
      <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div
          v-for="item in filtered.slice(0, 4)"
          :key="item.id"
          class="rounded-xl border border-slate-100 bg-white p-4 shadow-sm flex flex-col gap-3"
        >
          <div class="flex items-start justify-between">
            <div class="space-y-1">
              <h4 class="text-sm font-semibold text-slate-900">{{ item.title }}</h4>
              <p class="text-xs text-slate-500">{{ item.isDigital ? 'محصول دیجیتال' : 'تحویل فیزیکی' }}</p>
            </div>
            <span class="rounded-full bg-emerald-50 px-2 py-1 text-[11px] font-semibold text-emerald-600" v-if="item.compareAt && item.compareAt > item.price">تخفیف</span>
          </div>
          <p class="text-sm text-slate-700 line-clamp-2">{{ item.description || 'گیفت کارت مناسب برای خرید اپلیکیشن و اشتراک.' }}</p>
          <div class="mt-auto flex items-center justify-between">
            <div>
              <p class="text-base font-bold text-slate-900">{{ item.price.toLocaleString() }} تومان</p>
              <p class="text-[11px] text-slate-500">{{ item.compareAt ? 'قیمت قبل: ' + item.compareAt.toLocaleString() + ' تومان' : 'بهترین قیمت بازار' }}</p>
            </div>
            <button type="button" class="secondary-btn">مشاهده</button>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useProductsStore } from '@/stores/products'
import Breadcrumbs from '@/components/Breadcrumbs.vue'
import FiltersSidebar from '@/components/FiltersSidebar.vue'
import ProductGrid from '@/components/ProductGrid.vue'
import SortBar from '@/components/SortBar.vue'
import Pagination from '@/components/Pagination.vue'

const route = useRoute()
const store = useProductsStore()

const sort = ref('bestselling')
const onlyDigital = ref(false)
const onlyDiscount = ref(false)
const page = ref(1)
const perPage = 12

onMounted(() => store.load(route.params.slug as string))
watch(() => route.params.slug, () => store.load(route.params.slug as string))

const catTitle = computed(() => {
  const slug = route.params.slug as string
  if (slug === 'accounts') return 'اکانت‌ها'
  if (slug === 'gift-cards') return 'گیفت‌کارت'
  return 'محصولات'
})

const filtered = computed(() => {
  let items = store.products.slice()
  if (onlyDigital.value) items = items.filter(p => p.isDigital)
  if (onlyDiscount.value) items = items.filter(p => p.compareAt && p.compareAt > p.price)
  if (sort.value === 'price-asc') items.sort((a,b)=>a.price-b.price)
  if (sort.value === 'price-desc') items.sort((a,b)=>b.price-a.price)
  return items
})

const pages = computed(() => Math.max(1, Math.ceil(filtered.value.length / perPage)))
const paged = computed(() => {
  const start = (page.value - 1) * perPage
  return filtered.value.slice(start, start + perPage)
})
</script>

<style scoped>
.category-page {
  direction: rtl;
}

.primary-btn {
  @apply w-full rounded-xl bg-slate-900 px-4 py-3 text-white font-semibold transition hover:bg-slate-800 active:scale-[0.99];
}

.secondary-btn {
  @apply rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50;
}

.chip-btn {
  @apply w-full rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50;
}

.chip-btn--active {
  @apply border-slate-900 bg-slate-900 text-white shadow-sm;
}

.feature-tile {
  @apply flex gap-3 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm;
}

.feature-icon {
  @apply flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900/5 text-lg;
}

.feature-title {
  @apply text-sm font-semibold text-slate-900;
}

.feature-copy {
  @apply text-xs text-slate-600;
}

.info-accordion {
  @apply space-y-2 py-2;
}

.info-accordion summary {
  @apply cursor-pointer text-sm font-semibold text-slate-800 flex items-center justify-between;
}

.info-accordion p {
  @apply text-sm text-slate-600 leading-relaxed mt-2;
}

.faq-item {
  @apply rounded-xl border border-slate-100 bg-white px-4 py-3 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md;
}

.faq-item summary {
  @apply flex cursor-pointer items-center justify-between gap-3 text-sm font-semibold text-slate-900;
}

.faq-item[open] .chevron {
  transform: rotate(180deg);
}

.faq-item p {
  @apply mt-2 text-sm leading-relaxed text-slate-600;
}

.chevron {
  @apply text-lg text-slate-400 transition;
}

.badge-icon {
  @apply flex h-7 w-7 items-center justify-center rounded-full bg-white shadow-sm border border-slate-200 text-sm;
}
</style>

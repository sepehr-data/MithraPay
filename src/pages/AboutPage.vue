<template>
  <div class="bg-base-200 min-h-screen pb-16">
    <div class="max-w-6xl mx-auto px-4 lg:px-0 pt-8 space-y-10">

      <!-- top hero -->
      <section
          class="rounded-3xl bg-base-100 border border-base-300 px-6 py-10 lg:px-10 lg:py-12 flex flex-col lg:flex-row gap-8 items-center"
      >
        <div class="flex-1 text-right space-y-4">
          <p class="text-sm text-primary/80 font-medium">
            درباره MithraPay
          </p>
          <h1 class="text-3xl font-extrabold leading-relaxed">
            فروش اکانت، گیفت‌کارت و خدمات دیجیتال با تحویل سریع
          </h1>
          <p class="text-base text-base-content/70 leading-7">
            این پروژه یک کلون فرانت‌اند از یک فروشگاه اکانت است که با Vue + DaisyUI ساخته شده.
            هدفش اینه که تجربه خرید واقعی، دسته‌بندی مرتب و صفحه‌های واکنش‌گرا رو شبیه‌سازی کنه.
          </p>
          <div class="flex gap-3 justify-end pt-1">
            <RouterLink to="/category/accounts" class="btn btn-primary btn-sm rounded-full">
              مشاهده محصولات
            </RouterLink>
            <RouterLink to="/support" class="btn btn-outline btn-sm rounded-full">
              تماس با ما
            </RouterLink>
          </div>
        </div>
        <div
            class="w-full max-w-sm rounded-2xl bg-base-200/50 border border-base-300 p-5 grid grid-cols-2 gap-4"
        >
          <div class="text-right space-y-1">
            <p class="text-2xl font-extrabold">+120</p>
            <p class="text-xs text-base-content/60">نوع اکانت و سرویس</p>
          </div>
          <div class="text-right space-y-1">
            <p class="text-2xl font-extrabold">24/7</p>
            <p class="text-xs text-base-content/60">پشتیبانی</p>
          </div>
          <div class="text-right space-y-1">
            <p class="text-2xl font-extrabold">مدرن</p>
            <p class="text-xs text-base-content/60">UI / UX</p>
          </div>
          <div class="text-right space-y-1">
            <p class="text-2xl font-extrabold">Vue 3</p>
            <p class="text-xs text-base-content/60">Composition API</p>
          </div>
        </div>
      </section>

      <!-- what we do -->
      <section class="grid gap-6 md:grid-cols-3">
        <div class="bg-base-100 rounded-2xl border border-base-300 p-5 text-right space-y-2">
          <h2 class="font-semibold text-lg">چی می‌سازیم؟</h2>
          <p class="text-sm text-base-content/70 leading-6">
            طراحی صفحات فرانت‌اند برای فروش اکانت، گیفت‌کارت، بلاگ و پشتیبانی با تأکید روی تجربه کاربری.
          </p>
        </div>
        <div class="bg-base-100 rounded-2xl border border-base-300 p-5 text-right space-y-2">
          <h2 class="font-semibold text-lg">چرا این ساختار؟</h2>
          <p class="text-sm text-base-content/70 leading-6">
            چون بیشتر فروشگاه‌های ایرانی این حوزه، همین الگو (اسلایدر، دسته‌بندی، محصولات پرفروش) رو دنبال می‌کنن.
          </p>
        </div>
        <div class="bg-base-100 rounded-2xl border border-base-300 p-5 text-right space-y-2">
          <h2 class="font-semibold text-lg">چی واقعی نیست؟</h2>
          <p class="text-sm text-base-content/70 leading-6">
            سفارش، پرداخت، احراز هویت و بک‌اند صرفاً شبیه‌سازی شده و به درگاه واقعی وصل نیست.
          </p>
        </div>
      </section>

      <!-- timeline / steps -->
      <section class="bg-base-100 rounded-3xl border border-base-300 p-6 lg:p-8">
        <div class="flex items-center justify-between mb-6">
          <div class="text-right">
            <h2 class="text-xl font-bold">مسیر اجرای پروژه</h2>
            <p class="text-sm text-base-content/60">
              مراحل اصلی که این فرانت‌اند باهاش ساخته شده
            </p>
          </div>
        </div>
        <div class="grid gap-5 md:grid-cols-4">
          <div class="flex flex-col gap-2 text-right">
            <div class="w-9 h-9 rounded-full bg-primary text-primary-content flex items-center justify-center ml-auto">
              1
            </div>
            <h3 class="font-semibold text-sm">تحلیل قالب مرجع</h3>
            <p class="text-xs text-base-content/60">
              بررسی صفحه اصلی، دسته‌ها، اسلایدر و عناصر تکراری.
            </p>
          </div>
          <div class="flex flex-col gap-2 text-right">
            <div class="w-9 h-9 rounded-full bg-primary text-primary-content flex items-center justify-center ml-auto">
              2
            </div>
            <h3 class="font-semibold text-sm">طراحی ساختار Vue</h3>
            <p class="text-xs text-base-content/60">
              تعریف pages، components، stores و مسیرها.
            </p>
          </div>
          <div class="flex flex-col gap-2 text-right">
            <div class="w-9 h-9 rounded-full bg-primary text-primary-content flex items-center justify-center ml-auto">
              3
            </div>
            <h3 class="font-semibold text-sm">استایل با DaisyUI</h3>
            <p class="text-xs text-base-content/60">
              استفاده از کارت، navbar، دکمه و inputهای آماده.
            </p>
          </div>
          <div class="flex flex-col gap-2 text-right">
            <div class="w-9 h-9 rounded-full bg-primary text-primary-content flex items-center justify-center ml-auto">
              4
            </div>
            <h3 class="font-semibold text-sm">اتصال به داده‌های mock</h3>
            <p class="text-xs text-base-content/60">
              نمایش محصولات، بلاگ و دسته‌ها از فایل‌های JSON.
            </p>
          </div>
        </div>
      </section>

      <!-- team / contact -->
      <section class="grid gap-6 md:grid-cols-[1.1fr,0.9fr]">
        <div class="bg-base-100 rounded-2xl border border-base-300 p-6 text-right space-y-3">
          <h2 class="text-lg font-bold mb-2">ویژگی‌های این پروژه</h2>
          <ul class="space-y-2 text-sm text-base-content/70">
            <li class="flex items-start gap-2 justify-end">
              <span class="w-2 h-2 bg-primary rounded-full mt-1"></span>
              <span>کاملاً رسپانسیو و سازگار با موبایل</span>
            </li>
            <li class="flex items-start gap-2 justify-end">
              <span class="w-2 h-2 bg-primary rounded-full mt-1"></span>
              <span>ناوبری حرفه‌ای با مگامنو (فروشگاه)</span>
            </li>
            <li class="flex items-start gap-2 justify-end">
              <span class="w-2 h-2 bg-primary rounded-full mt-1"></span>
              <span>صفحه ورود/ثبت‌نام OTP با پس‌زمینه اختصاصی</span>
            </li>
            <li class="flex items-start gap-2 justify-end">
              <span class="w-2 h-2 bg-primary rounded-full mt-1"></span>
              <span>استفاده از فروشگاه (Pinia یا store شما) برای محصولات</span>
            </li>
          </ul>
        </div>

        <div class="bg-base-100 rounded-2xl border border-base-300 p-6 text-right space-y-3">
          <h2 class="text-lg font-bold">ارتباط</h2>
          <p class="text-sm text-base-content/70">
            اگر خواستید این فرانت‌اند به بک‌اند یا درگاه وصل شود، می‌توانید از همین ساختار ادامه دهید.
          </p>
          <div class="space-y-2 text-sm">
            <p class="flex items-center gap-2 justify-end">
              <span>support@mitherapay.ir</span>
              <span class="text-base-content/40">ایمیل</span>
            </p>
            <p class="flex items-center gap-2 justify-end">
              <span>0917 100 4008</span>
              <span class="text-base-content/40">پشتیبانی</span>
            </p>
          </div>
        </div>
      </section>

      <!-- footer line inside about -->
      <p class="text-center text-xs text-base-content/50 pt-6">
        این صفحه صرفاً برای نمایش ساختار «درباره ما» در پروژه شماست.
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
/* no special logic needed here right now */
</script>

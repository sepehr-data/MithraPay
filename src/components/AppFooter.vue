<template>
  <footer class="mt-16 bg-base-200 border-t border-base-300 text-base-content">
    <div class="max-w-7xl mx-auto px-4 lg:px-6 py-12">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">
        <!-- brand -->
        <div class="flex flex-col gap-4">
          <div class="flex items-center gap-3">
            <div class="h-16 w-16 rounded-2xl overflow-hidden flex items-center justify-center bg-base-100 shadow">
              <img
                  src="/src/assets/logo2.png"
                  alt="logo"
                  class="h-16 w-auto object-contain"
              />
            </div>
            <div>
              <p class="font-bold text-lg">MitheraPay</p>
              <p class="text-sm text-base-content/70">فروش اکانت و گیفت‌کارت</p>
            </div>
          </div>
          <p class="text-sm text-base-content/70 leading-relaxed">
            با میتراپی به سریع‌ترین شکل، اکانت‌ها و گیفت‌کارت‌های معتبر را تهیه کنید و از پشتیبانی مطمئن لذت ببرید.
          </p>
          <div class="space-y-1 text-sm text-base-content/80">
            <p class="flex items-center gap-2">
              <span class="text-base-content/60"><img src="@/assets/icons/call.png"></span>
              09171004008
            </p>
            <p class="flex items-center gap-2">
              <span class="text-base-content/60"><img src="@/assets/icons/email.png" /> </span>
              support@mitheraPay.ir
            </p>
          </div>
          <div class="flex gap-3 pt-2 text-base-content/60">
            <a href="#" class="hover:opacity-80">
              <img src="@/assets/socials/telegram.png" class="h-10 w-10 object-contain" />
            </a>
            <a href="#" class="hover:opacity-80">
              <img src="@/assets/socials/instagram.png" class="h-10 w-10 object-contain" />
            </a>
            <a href="#" class="hover:opacity-80">
              <img src="@/assets/socials/whatsapp.png" class="h-10 w-10 object-contain" />
            </a>
          </div>
        </div>

        <!-- quick links -->
        <div class="space-y-3">
          <h6 class="text-sm font-semibold text-base-content/80">اکانت ها</h6>
          <ul class="space-y-2 text-sm text-base-content/70">
            <li><a href="/product/apple-music" class="hover:text-primary">اپل موزیک</a></li>
            <li><a href="/product/apple-one" class="hover:text-primary">اپل وان</a></li>
            <li><a href="/category/icloud" class="hover:text-primary">فضای آیکلاد پلاس</a></li>
            <li><a href="/category/fitness" class="hover:text-primary">فیتنس پلاس</a></li>
            <li><a href="/category/appletv" class="hover:text-primary">اپل تی‌وی پلاس</a></li>
          </ul>
        </div>

        <div class="space-y-3">
          <h6 class="text-sm font-semibold text-base-content/80">کاربردی</h6>
          <ul class="space-y-2 text-sm text-base-content/70">
            <li><a href="/blog" class="hover:text-primary">بلاگ پلاس</a></li>
            <li><a href="/support/apple-id" class="hover:text-primary">ساخت اپل آیدی</a></li>
            <li><a href="/category/gift-cards" class="hover:text-primary">گیفت کارت</a></li>
            <li><a href="/support/region" class="hover:text-primary">تغییر ریجن اپل آیدی</a></li>
            <li><a href="/category/accessories" class="hover:text-primary">کابل و آداپتور</a></li>
          </ul>
        </div>

        <div class="space-y-3">
          <h6 class="text-sm font-semibold text-base-content/80">ارتباط با ما</h6>
          <ul class="space-y-2 text-sm text-base-content/70">
            <li><a href="/support" class="hover:text-primary">پشتیبانی</a></li>
            <li><a href="/terms" class="hover:text-primary">شرایط و قوانین</a></li>
            <li><a href="/instagram" class="hover:text-primary">اینستاگرام</a></li>
            <li><a href="/about" class="hover:text-primary">درباره ما</a></li>
          </ul>
          <div class="flex gap-3 pt-4">
            <div class="w-20 h-24 bg-base-100 border border-base-300 rounded-xl overflow-hidden flex items-center justify-center">
              <!--          <img src="/src/assets/enamad.png" alt="enamad" class="max-h-16" />-->
            </div>
            <div class="w-20 h-24 bg-base-100 border border-base-300 rounded-xl overflow-hidden flex items-center justify-center">
              <!--          <img src="/src/assets/samandehi.png" alt="samandehi" class="max-h-16" />-->
            </div>
            <div class="w-20 h-24 bg-base-100 border border-base-300 rounded-xl overflow-hidden flex items-center justify-center">
              <!--          <img src="/src/assets/zarinpal.png" alt="zarinpal" class="max-h-16" />-->
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="border-t border-base-300 bg-base-300/60">
      <div class="max-w-7xl mx-auto px-4 lg:px-6 py-4 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between text-xs text-base-content/70">
        <p>تمامی حقوق برای فروشگاه سپهر داده دیجیتال محفوظ است. © ۱۴۰۴</p>
        <div class="flex items-center gap-3 text-[11px] text-base-content/60">
          <span class="px-3 py-1 rounded-full bg-base-100 border border-base-200">پرداخت امن</span>
          <span class="px-3 py-1 rounded-full bg-base-100 border border-base-200">ارسال سریع</span>
          <span class="px-3 py-1 rounded-full bg-base-100 border border-base-200">پشتیبانی آنلاین</span>
        </div>
      </div>
    </div>
  </footer>
</template>
<script setup lang="ts">
</script>

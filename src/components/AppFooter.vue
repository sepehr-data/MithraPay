<template>
  <footer
      class="mt-16 border-t border-neutral-700 bg-neutral-800 text-base-100"
      dir="rtl"
  >
    <div class="max-w-7xl mx-auto px-4 lg:px-6 py-10 space-y-10">

      <!-- top: brand + links -->
      <div class="grid grid-cols-1 lg:grid-cols-4 gap-8 lg:gap-10 items-start">

        <!-- brand -->
        <div class="lg:col-span-1 flex flex-col gap-4">
          <div class="flex items-center gap-3">
            <div
                class="h-14 w-14 rounded-2xl overflow-hidden flex items-center justify-center
                     bg-neutral-900 border border-neutral-700"
            >
              <img
                  src="/src/assets/logo3.png"
                  alt="لوگوی RedSkyBox"
                  class="h-10 w-auto object-contain"
              />
            </div>
            <div class="space-y-0.5">
              <p class="font-semibold text-base">
                RedSkyBox
              </p>
              <p class="text-[11px] text-base-100/60">
                فروش اکانت و گیفت‌کارت قانونی
              </p>
            </div>
          </div>

          <div class="space-y-1.5 text-xs sm:text-sm text-base-100/80">
            <p class="flex items-center gap-2">
              <img
                  src="@/assets/icons/call.png"
                  class="h-4 w-4"
                  alt="تلفن"
                  style="filter: brightness(1.2) saturate(1.25);"
              />
              <span class="font-medium">پشتیبانی:</span>
              <span class="ltr:ml-1">09171004008</span>
            </p>
            <p class="flex items-center gap-2">
              <img
                  src="@/assets/icons/email.png"
                  class="h-4 w-4"
                  alt="ایمیل"
                  style="filter: brightness(1.2) saturate(1.25);"
              />
              <span class="font-medium">ایمیل:</span>
              <span class="ltr:ml-1 break-all">support@redskybox.ir</span>
            </p>
          </div>

          <!-- socials: کشیده به راست، اندازه یکسان -->
          <div class="flex justify-start gap-4 sm:gap-5 pt-1 mr-10 text-base-100/70">
            <!-- telegram -->
            <a href="#" class="hover:opacity-80 transition-opacity" aria-label="تلگرام">
              <span class="inline-flex items-center justify-center h-8 w-8">
                <img
                    src="@/assets/socials/telegram.png"
                    class="h-6 w-6 object-contain"
                    alt="تلگرام"
                />
              </span>
            </a>
            <!-- instagram -->
            <a href="#" class="hover:opacity-80 transition-opacity" aria-label="اینستاگرام">
              <span class="inline-flex items-center justify-center h-8 w-8">
                <img
                    src="@/assets/socials/instagram.png"
                    class="h-6 w-6 object-contain"
                    alt="اینستاگرام"
                />
              </span>
            </a>
            <!-- whatsapp -->
            <a href="#" class="hover:opacity-80 transition-opacity" aria-label="واتساپ">
              <span class="inline-flex items-center justify-center h-8 w-8">
                <img
                    src="@/assets/socials/whatsapp.png"
                    class="h-6 w-6 object-contain"
                    alt="واتساپ"
                />
              </span>
            </a>
          </div>
        </div>

        <!-- links + badges -->
        <div
            class="lg:col-span-3 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 lg:gap-4 text-xs sm:text-sm"
        >
          <!-- col 1 -->
          <div class="space-y-3">
            <h6 class="text-sm sm:text-[15px] font-semibold text-base-100/90">
              اکانت‌ها و سرویس‌ها
            </h6>
            <ul class="space-y-1.5 text-base-100/70">
              <li>
                <a href="/product/apple-music" class="hover:text-primary transition-colors">
                  Apple Music
                </a>
              </li>
              <li>
                <a href="/product/apple-one" class="hover:text-primary transition-colors">
                  Apple One
                </a>
              </li>
              <li>
                <a href="/category/icloud" class="hover:text-primary transition-colors">
                  iCloud+
                </a>
              </li>
              <li>
                <a href="/category/fitness" class="hover:text-primary transition-colors">
                  Fitness+
                </a>
              </li>
              <li>
                <a href="/category/appletv" class="hover:text-primary transition-colors">
                  Apple TV+
                </a>
              </li>
            </ul>
          </div>

          <!-- col 2 -->
          <div class="space-y-3">
            <h6 class="text-sm sm:text-[15px] font-semibold text-base-100/90">
              راهنما و خرید
            </h6>
            <ul class="space-y-1.5 text-base-100/70">
              <li>
                <a href="/blog" class="hover:text-primary transition-colors">
                  بلاگ و آموزش‌ها
                </a>
              </li>
              <li>
                <a href="/support/apple-id" class="hover:text-primary transition-colors">
                  ساخت Apple ID
                </a>
              </li>
              <li>
                <a href="/category/gift-cards" class="hover:text-primary transition-colors">
                  گیفت‌کارت سرویس‌ها
                </a>
              </li>
              <li>
                <a href="/support/region" class="hover:text-primary transition-colors">
                  تغییر ریجن Apple ID
                </a>
              </li>
              <li>
                <a href="/category/accessories" class="hover:text-primary transition-colors">
                  کابل و آداپتور
                </a>
              </li>
            </ul>
          </div>

          <!-- col 3 -->
          <div class="space-y-3">
            <h6 class="text-sm sm:text-[15px] font-semibold text-base-100/90">
              ارتباط و اعتماد
            </h6>
            <ul class="space-y-1.5 text-base-100/70">
              <li>
                <a href="/support" class="hover:text-primary transition-colors">
                  پشتیبانی و ارسال تیکت
                </a>
              </li>
              <li>
                <a href="/terms" class="hover:text-primary transition-colors">
                  شرایط و قوانین
                </a>
              </li>
              <li>
                <a href="/instagram" class="hover:text-primary transition-colors">
                  اینستاگرام رد اسکای باکس
                </a>
              </li>
              <li>
                <a href="/about" class="hover:text-primary transition-colors">
                  درباره ما
                </a>
              </li>
            </ul>
          </div>

          <!-- col 4: badges (طول کمتر، هنوز افقی) -->
          <div class="space-y-3 col-span-2 md:col-span-1">
            <h6 class="text-sm sm:text-[15px] font-semibold text-base-100/90">
              نمادها و مجوزها
            </h6>
            <div class="flex gap-2 sm:gap-3 flex-wrap sm:flex-nowrap">
              <div
                  class="w-16 h-24 sm:w-18 sm:h-24 bg-neutral-900 border border-neutral-700 rounded-xl overflow-hidden
                       flex items-center justify-center text-[10px] text-base-100/60"
              >
                <span class="opacity-70 text-center">نماد اعتماد</span>
              </div>
              <div
                  class="w-16 h-24 sm:w-18 sm:h-24 bg-neutral-900 border border-neutral-700 rounded-xl overflow-hidden
                       flex items-center justify-center text-[10px] text-base-100/60"
              >
                <span class="opacity-70 text-center">ساماندهی</span>
              </div>
              <div
                  class="w-16 h-24 sm:w-18 sm:h-24 bg-neutral-900 border border-neutral-700 rounded-xl overflow-hidden
                       flex items-center justify-center text-[10px] text-base-100/60"
              >
                <span class="opacity-70 text-center">درگاه پرداخت</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      <!-- bottom bar: centered text -->
      <div class="border-t border-neutral-700 pt-4 mt-2">
        <p class="text-[11px] sm:text-xs text-base-100/60 text-center">
          تمامی حقوق این وب‌سایت متعلق به شرکت سپهر داده دیجیتال است. © ۱۴۰۴
        </p>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
</script>

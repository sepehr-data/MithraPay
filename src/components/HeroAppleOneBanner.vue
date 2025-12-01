<template>
  <section
      dir="rtl"
      class="relative overflow-hidden rounded-[36px] bg-base-200/80 border border-base-300/70 shadow-[0_18px_45px_rgba(0,0,0,0.05)]"
  >
    <div class="absolute inset-0 bg-gradient-to-br from-white/90 via-base-100/85 to-base-200/90"></div>
    <div class="absolute right-10 top-8 h-24 w-24 rounded-full bg-white/60 blur-3xl"></div>
    <div class="absolute left-16 bottom-6 h-28 w-28 rounded-full bg-primary/10 blur-3xl"></div>

    <div
        class="relative grid items-center gap-10 lg:gap-12 lg:grid-cols-2 px-6 sm:px-10 py-10 sm:py-12 lg:py-14"
    >
      <div class="order-1 lg:order-2 space-y-10 text-center max-w-xl mx-auto">

        <!-- APPLE ONE TITLE -->
        <div class="flex items-center justify-center gap-4 text-base-content translate-x-[-15px]">
          <!-- One بزرگ‌تر -->
          <span class="text-6xl sm:text-7xl font-extrabold tracking-tight">
      One
    </span>

          <img
              src="/icons/apple-logo.png"
              alt="Apple"
              class="w-11 h-11 sm:w-14 sm:h-14 object-contain translate-y-[-10px] translate-x-[20px]"

          />
        </div>

        <!-- DESCRIPTION -->
        <div class="text-xl sm:text-2xl font-bold leading-[2.2rem] text-base-content/90 space-y-2">
          <p>دسترسی ساده به کلیه سرویس‌های</p>
          <p>آنلاین و محبوب اپل با خرید یک اشتراک</p>
        </div>

        <!-- BUTTON (سایز بزرگ + متن واقعاً سنتر) -->
        <div class="pt-2 flex justify-center">
          <RouterLink
              to="/search?q=apple%20one"
              class="px-12 py-4 text-lg sm:text-xl font-semibold rounded-3xl
             bg-primary text-primary-content shadow-lg inline-flex items-center justify-center
             hover:brightness-110 hover:shadow-xl transition-all duration-200"
              style="text-align:center;"
          >
            خرید اشتراک اپل وان
          </RouterLink>
        </div>

      </div>


      <!-- SERVICES GRID -->
      <div class="order-2 lg:order-1 grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-5">
        <div
            v-for="service in services"
            :key="service.name"
            class="group relative aspect-square w-[85%] mx-auto"
        >
          <img
              :src="iconSrc(service)"
              :alt="service.name"
              class="w-full h-full rounded-[40px] object-cover transition-all duration-200 group-hover:scale-[1.05]"
              @error="handleIconError(service)"
          />
        </div>

      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { reactive } from 'vue'

const services = [
  { name: 'Apple Music',   slug: 'apple-music' },
  { name: 'Apple TV+',     slug: 'apple-tv' },
  { name: 'Apple Arcade',  slug: 'apple-arcade' },
  { name: 'Apple News+',   slug: 'apple-news' },
  { name: 'Fitness+',      slug: 'apple-fitness' },
  { name: 'iCloud+',       slug: 'icloud-plus' },
]

const iconExt = reactive<Record<string, 'jpg' | 'png'>>({})

function iconSrc(service: { slug: string }) {
  const ext = iconExt[service.slug] || 'jpg'
  return `/icons/${service.slug}.${ext}`
}

function handleIconError(service: { slug: string }) {
  if (!iconExt[service.slug]) {
    iconExt[service.slug] = 'png'
  }
}
</script>

<template>
  <section
    dir="rtl"
    class="relative overflow-hidden rounded-[36px] bg-base-200/80 border border-base-300/70 shadow-[0_18px_45px_rgba(0,0,0,0.05)]"
  >
    <div class="absolute inset-0 bg-gradient-to-br from-white/90 via-base-100/85 to-base-200/90"></div>
    <div class="absolute right-10 top-8 h-24 w-24 rounded-full bg-white/60 blur-3xl"></div>
    <div class="absolute left-16 bottom-6 h-28 w-28 rounded-full bg-primary/10 blur-3xl"></div>

    <div class="relative grid items-center gap-10 lg:gap-12 lg:grid-cols-2 px-6 sm:px-10 py-10 sm:py-12 lg:py-14">
      <div class="order-1 lg:order-2 space-y-6 text-right max-w-xl ml-auto">
        <div class="flex items-center justify-end gap-3 text-base-content">
          <span class="text-5xl sm:text-6xl leading-none"></span>
          <span class="text-4xl sm:text-5xl font-extrabold tracking-tight">Apple One</span>
        </div>

        <p class="text-base sm:text-lg leading-8 sm:leading-9 text-base-content/80 font-medium">
          دسترسی ساده به کلیه سرویس‌های آنلاین و محبوب اپل با خرید یک اشتراک
        </p>

        <RouterLink
          to="/search?q=apple%20one"
          class="inline-flex items-center justify-center btn btn-primary px-7 sm:px-8 py-3 text-base sm:text-lg rounded-xl shadow-md transition-all duration-200 hover:shadow-xl hover:brightness-110"
        >
          خرید اشتراک اپل وان
        </RouterLink>
      </div>

      <div class="order-2 lg:order-1 grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-5">
        <div
          v-for="service in services"
          :key="service.name"
          class="group relative aspect-square rounded-2xl bg-base-100/90 border border-base-300/70 shadow-[8px_10px_28px_rgba(0,0,0,0.05),-10px_-10px_28px_rgba(255,255,255,0.7)] flex flex-col items-center justify-center gap-3 p-4 transition-transform duration-200 hover:-translate-y-1 hover:shadow-[0_18px_36px_rgba(0,0,0,0.08)]"
        >
          <div
            class="w-14 h-14 sm:w-16 sm:h-16 rounded-xl flex items-center justify-center text-2xl sm:text-3xl font-semibold text-white shadow-md bg-gradient-to-br"
            :class="service.gradient"
          >
            <span aria-hidden="true">{{ service.emoji }}</span>
          </div>
          <span class="text-sm sm:text-base font-semibold text-base-content/80">{{ service.name }}</span>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const services = [
  { name: 'Apple Music', emoji: '🎵', gradient: 'from-pink-500 via-fuchsia-500 to-purple-500' },
  { name: 'Apple TV+', emoji: '📺', gradient: 'from-slate-700 via-gray-800 to-black' },
  { name: 'Apple Arcade', emoji: '🎮', gradient: 'from-amber-400 via-orange-400 to-red-400' },
  { name: 'Apple News', emoji: '📰', gradient: 'from-rose-500 via-red-500 to-amber-400' },
  { name: 'Fitness+', emoji: '🏃‍♂️', gradient: 'from-lime-500 via-green-500 to-emerald-500' },
  { name: 'iCloud+', emoji: '☁️', gradient: 'from-sky-400 via-blue-500 to-indigo-500' },
]
</script>

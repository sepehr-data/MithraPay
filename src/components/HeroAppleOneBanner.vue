<template>
  <section
    dir="rtl"
    class="relative overflow-hidden rounded-[32px] bg-base-200/80 border border-base-300/70 shadow-lg"
  >
    <div class="absolute inset-0 bg-[url('/banners/banner0.jpg')] bg-cover bg-center opacity-25"></div>
    <div class="absolute inset-0 bg-gradient-to-l from-base-100/90 via-base-100/85 to-base-200/80"></div>

    <div class="relative grid gap-8 lg:gap-12 md:grid-cols-2 items-center p-6 sm:p-8 lg:p-12">
      <div class="order-1 md:order-2 space-y-6 text-right">
        <div class="flex items-center justify-end gap-3 text-neutral">
          <span class="text-5xl sm:text-6xl leading-none"></span>
          <span class="text-4xl sm:text-5xl font-extrabold tracking-tight">One</span>
        </div>

        <p class="text-lg sm:text-xl leading-9 font-medium text-base-content/90">
          دسترسی ساده به کلیه سرویس‌های
          <br />
          آنلاین و محبوب اپل با خرید یک اشتراک
        </p>

        <RouterLink
          to="/search?q=apple%20one"
          class="btn btn-neutral px-6 sm:px-8 py-3 text-base sm:text-lg rounded-xl shadow-md transition transform hover:-translate-y-0.5 hover:shadow-xl"
        >
          خرید اشتراک اپل وان
        </RouterLink>
      </div>

      <div class="order-2 md:order-1 grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-5">
        <div
          v-for="service in services"
          :key="service.name"
          class="group aspect-square rounded-2xl bg-gradient-to-br shadow-sm ring-1 ring-base-300/60 from-white to-base-200/80 flex flex-col items-center justify-center gap-3 p-4 transition transform duration-200 hover:-translate-y-1 hover:shadow-lg"
        >
          <div
            class="w-16 h-16 sm:w-20 sm:h-20 rounded-xl flex items-center justify-center text-3xl sm:text-4xl font-semibold text-white shadow-md"
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

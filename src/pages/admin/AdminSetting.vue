<template>
  <div class="space-y-6">
    <!-- header -->
    <div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h2 class="text-lg sm:text-xl font-bold">
          تنظیمات پنل مدیریت
        </h2>
        <p class="mt-1 text-xs sm:text-sm text-base-content/70">
          مدیریت اطلاعات پروفایل ادمین و تنظیمات کلی داشبورد.
        </p>
      </div>
    </div>

    <!-- cards -->
    <div class="grid gap-4 lg:grid-cols-2">
      <!-- profile settings -->
      <div class="rounded-2xl border border-base-300 bg-base-100 p-4 space-y-4">
        <h3 class="font-semibold text-sm sm:text-base">
          تنظیمات پروفایل
        </h3>
        <div class="flex items-center gap-3 mb-2">
          <div
              class="h-12 w-12 rounded-full bg-primary text-base-100 flex items-center justify-center text-base font-semibold shadow-sm"
          >
            {{ adminInitials }}
          </div>
          <div class="flex flex-col">
            <span class="font-semibold text-sm text-base-content">
              {{ adminName || 'کاربر ادمین' }}
            </span>
            <span class="text-[11px] text-base-content/60">
              نقش: مدیر سیستم
            </span>
          </div>
        </div>

        <div class="space-y-3">
          <div class="form-control">
            <label class="label">
              <span class="label-text text-xs sm:text-sm">نام نمایشی</span>
            </label>
            <input
                v-model="displayName"
                type="text"
                class="input input-sm sm:input-md input-bordered w-full"
                placeholder="نامی که در پنل نمایش داده می‌شود"
            />
          </div>

          <div class="form-control">
            <label class="label">
              <span class="label-text text-xs sm:text-sm">ایمیل ادمین</span>
            </label>
            <input
                v-model="adminEmail"
                type="email"
                class="input input-sm sm:input-md input-bordered w-full"
                placeholder="example@email.com"
            />
          </div>

          <div class="flex justify-end pt-2">
            <button class="btn btn-sm btn-primary">
              ذخیره تغییرات (دمو)
            </button>
          </div>
        </div>
      </div>

      <!-- app settings -->
      <div class="rounded-2xl border border-base-300 bg-base-100 p-4 space-y-4">
        <h3 class="font-semibold text-sm sm:text-base">
          تنظیمات کلی پنل
        </h3>

        <div class="space-y-3 text-xs sm:text-sm">
          <label class="flex items-center justify-between gap-3">
            <span>ارسال نوتیفیکیشن برای تیکت‌های جدید</span>
            <input type="checkbox" class="toggle toggle-sm" v-model="notifyTickets" />
          </label>

          <label class="flex items-center justify-between gap-3">
            <span>نمایش سفارش‌های امروز در بالای داشبورد</span>
            <input type="checkbox" class="toggle toggle-sm" v-model="showTodayOrders" />
          </label>

          <label class="flex items-center justify-between gap-3">
            <span>فعال‌سازی حالت فشرده جدول‌ها</span>
            <input type="checkbox" class="toggle toggle-sm" v-model="compactTables" />
          </label>
        </div>

        <div class="flex justify-end pt-2">
          <button class="btn btn-sm btn-outline">
            ذخیره تنظیمات (دمو)
          </button>
        </div>
      </div>
    </div>

    <!-- info card -->
    <div class="rounded-2xl border border-base-300 bg-base-100 p-4 text-xs sm:text-sm text-base-content/70">
      <p>
        این صفحه فعلاً به‌صورت نمایشی (Front-end) پیاده‌سازی شده است. می‌توانید این مقادیر را
        به API واقعی تنظیمات ادمین متصل کنید تا تغییرات در دیتابیس ذخیره شوند.
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

// این‌جا می‌تونی از استور/بک‌اند مقدار واقعی بگیری
const adminName = ref('ادمین اصلی')
const adminEmail = ref('admin@sepehrbox.ir')

const displayName = ref(adminName.value)

// سوییچ‌های تنظیمات کلی پنل (فعلاً دمو)
const notifyTickets = ref(true)
const showTodayOrders = ref(true)
const compactTables = ref(false)

const adminInitials = computed(() => {
  if (!adminName.value) return 'A'
  return adminName.value.trim().charAt(0).toUpperCase()
})
</script>

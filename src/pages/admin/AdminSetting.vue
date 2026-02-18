<template>
  <div class="space-y-6 max-w-5xl mx-auto" dir="rtl">
    <!-- HERO بالا برای تنظیمات -->
    <section
        class="relative rounded-3xl border border-base-300 shadow-sm overflow-hidden
             bg-gradient-to-l from-primary/15 via-primary/5 to-secondary/10"
    >
      <!-- نوار رنگی راست -->
      <div
          class="absolute inset-y-0 right-0 w-1.5 bg-gradient-to-b from-primary/40 to-secondary/40"
      ></div>

      <div class="px-5 sm:px-6 py-4 sm:py-5 pr-6">
        <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div class="space-y-1">
            <p class="text-[10px] uppercase tracking-[0.25em] text-base-content/60">
              ADMIN SETTINGS
            </p>
            <h2 class="text-base sm:text-xl font-bold text-base-content">
              تنظیمات مدیران سیستم
            </h2>
            <p class="text-[11px] sm:text-xs text-base-content/70">
              مدیریت تنظیمات کلی پنل و ادمین‌های دیگر رد اسکای.
            </p>
          </div>

          <!-- خلاصه ادمین‌ها -->
          <div class="flex flex-col items-start sm:items-end gap-2 text-[11px] sm:text-xs">
            <div
                class="inline-flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-primary/10 border border-primary/20"
            >
              <span
                  class="w-1.5 h-1.5 rounded-full bg-gradient-to-br from-primary to-secondary"
              ></span>
              <span>تعداد کل ادمین‌ها:</span>
              <span class="font-bold text-sm">
                {{ adminsCount }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
    <section class="grid gap-4 lg:grid-cols-2">
      <article class="rounded-2xl border border-base-300 bg-base-100 p-4 space-y-4">
        <h3 class="font-semibold">افزودن ادمین</h3>

        <input
            v-model="newAdminName"
            class="input input-bordered input-sm w-full"
            placeholder="نام نمایشی (اختیاری)"
        />

        <input
            v-model="newAdminPhone"
            class="input input-bordered input-sm w-full ltr"
            placeholder="09xxxxxxxxx"
        />

        <div class="flex justify-end">
          <button class="btn btn-primary btn-sm" @click="registerAdmin">
            ثبت ادمین
          </button>
        </div>
      </article>

      <!-- PANEL SETTINGS -->
      <article class="rounded-2xl border border-base-300 bg-base-100 p-4 space-y-3">
        <h3 class="font-semibold">تنظیمات پنل</h3>

        <label class="flex justify-between">
          <span>نوتیفیکیشن تیکت</span>
          <input type="checkbox" v-model="notifyTickets" class="toggle toggle-sm" />
        </label>

        <label class="flex justify-between">
          <span>سفارش‌های امروز</span>
          <input type="checkbox" v-model="showTodayOrders" class="toggle toggle-sm" />
        </label>

        <label class="flex justify-between">
          <span>حالت فشرده</span>
          <input type="checkbox" v-model="compactTables" class="toggle toggle-sm" />
        </label>
      </article>
    </section>

    <!-- ADMIN LIST -->
    <section class="rounded-3xl border border-base-300 bg-base-100 p-4 space-y-4">
      <h3 class="font-semibold">لیست ادمین‌ها</h3>

      <div v-if="loading" class="text-center text-sm">
        در حال بارگذاری...
      </div>

      <div v-else class="grid gap-3 md:grid-cols-2">
        <article
            v-for="a in filteredAdmins"
            :key="a.id"
            class="rounded-2xl border border-base-300 p-3 flex justify-between items-center"
        >
          <div>
            <div class="font-medium">
              {{ a.name || 'بدون نام' }}
            </div>
            <div class="text-xs ltr font-mono">
              {{ a.phone }}
            </div>
          </div>

          <div class="flex items-center gap-2">
            <span
                class="badge"
                :class="a.roles.includes('owner') ? 'badge-primary' : 'badge-ghost'"
            >
              {{ a.roles.includes('owner') ? 'Owner' : 'Admin' }}
            </span>

            <button
                v-if="!a.roles.includes('owner')"
                class="btn btn-xs btn-error"
                @click="removeAdmin(a)"
            >
              حذف
            </button>
          </div>
        </article>
      </div>
    </section>
  </div>
</template>
<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import {
  adminListAdmins,
  adminPromoteToAdminByPhone,
  adminRemoveAdminByPhone,
} from '@/services/admin'

import type {
  AdminUserDTO,
  AdminPromoteByPhonePayload,
} from '@/types/api_client_types/admin.dto.ts'

// state
const admins = ref<AdminUserDTO[]>([])
const loading = ref(false)

// form
const newAdminName = ref('')
const newAdminPhone = ref('')

// panel settings (فعلاً لوکال)
const notifyTickets = ref(true)
const showTodayOrders = ref(true)
const compactTables = ref(false)

// fetch admins
async function fetchAdmins() {
  loading.value = true
  try {
    admins.value = await adminListAdmins()
  } finally {
    loading.value = false
  }
}

// register admin
async function registerAdmin() {
  if (!newAdminPhone.value.trim()) {
    alert('شماره تلفن الزامی است')
    return
  }

  const payload: AdminPromoteByPhonePayload = {
    phone: newAdminPhone.value,
  }

  try {
    const res = await adminPromoteToAdminByPhone(payload)
    admins.value.unshift(res.admin)
    newAdminName.value = ''
    newAdminPhone.value = ''
  } catch {
    alert('خطا در ثبت ادمین')
  }
}

// remove admin
async function removeAdmin(admin: AdminUserDTO) {
  if (admin.roles.includes('owner')) {
    alert('حذف Owner مجاز نیست')
    return
  }

  if (!confirm('آیا از حذف این ادمین مطمئن هستید؟')) return

  try {
    await adminRemoveAdminByPhone({ phone: admin.phone })
    admins.value = admins.value.filter(a => a.id !== admin.id)
  } catch {
    alert('خطا در حذف ادمین')
  }
}

// computed
const adminsCount = computed(() => admins.value.length)

const filteredAdmins = computed(() => admins.value)

onMounted(fetchAdmins)
</script>

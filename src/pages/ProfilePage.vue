<template>
  <div class="min-h-screen overflow-x-hidden bg-gradient-to-b from-base-200 via-base-200 to-base-300">
    <!-- Main container -->
    <div class="max-w-6xl mx-auto w-full px-3 sm:px-4 py-5 sm:py-8 space-y-4 sm:space-y-6">
      <!-- Header -->
      <header class="rounded-3xl border border-base-300/70 bg-base-100/75 backdrop-blur shadow-xl">
        <div class="p-4 sm:p-6">
          <div class="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between min-w-0">
            <!-- Identity -->
            <div class="flex items-center gap-4 min-w-0">
              <div class="avatar placeholder shrink-0">
                <div
                    class="w-12 sm:w-14 rounded-2xl bg-gradient-to-br from-primary to-secondary text-primary-content shadow-lg"
                >
                  <span class="text-base sm:text-lg font-bold">{{ userInitial }}</span>
                </div>
              </div>

              <div class="min-w-0">
                <p class="text-xs sm:text-sm opacity-70">پروفایل کاربری</p>

                <div class="mt-1 flex flex-wrap items-end gap-x-3 gap-y-1 min-w-0">
                  <h1 class="text-xl sm:text-3xl font-extrabold leading-tight">
                    {{ fullName }}
                  </h1>

                  <span class="text-sm opacity-60">•</span>

                  <span class="text-sm sm:text-base font-semibold opacity-80">
                    {{ auth.user?.phone || 'بدون شماره' }}
                  </span>

                  <span class="text-sm opacity-60">•</span>

                  <span
                      class="text-sm sm:text-base opacity-80 ltr-input truncate max-w-[220px] sm:max-w-[420px]"
                      :title="displayEmail"
                  >
                    {{ displayEmail }}
                  </span>
                </div>
              </div>
            </div>

            <!-- Actions -->
            <div class="flex flex-wrap gap-2 lg:justify-end">
              <button class="btn btn-sm btn-ghost rounded-2xl text-error" @click="logout">
                خروج
              </button>
            </div>
          </div>

          <!-- Summary strip -->
          <div class="mt-5 grid gap-3 grid-cols-2 lg:grid-cols-4">
            <div class="rounded-2xl border border-base-300/60 bg-base-100 p-4 shadow-sm">
              <p class="text-xs opacity-70">سفارش فعال</p>
              <p class="text-2xl font-extrabold mt-1">{{ stats.activeOrders }}</p>
              <p class="text-xs opacity-60 mt-1 hidden sm:block">در حال پیگیری</p>
            </div>

            <div class="rounded-2xl border border-base-300/60 bg-base-100 p-4 shadow-sm">
              <p class="text-xs opacity-70">تکمیل شده</p>
              <p class="text-2xl font-extrabold mt-1">{{ stats.completedOrders }}</p>
              <p class="text-xs opacity-60 mt-1 hidden sm:block">تحویل موفق</p>
            </div>

            <div
                class="rounded-2xl border border-base-300/60 bg-gradient-to-br from-error/10 via-base-100 to-base-100 p-4 shadow-sm col-span-2 lg:col-span-1"
            >
              <p class="text-xs opacity-70">سفارشات لغو شده</p>
              <p class="text-xl sm:text-2xl font-extrabold mt-1">{{ stats.canceledOrders }}</p>
              <p class="text-xs opacity-60 mt-1">در این ماه</p>
            </div>

            <div
                class="rounded-2xl border border-base-300/60 bg-gradient-to-br from-success/10 via-base-100 to-base-100 p-4 shadow-sm"
            >
              <p class="text-xs opacity-70">امتیاز وفاداری</p>
              <p class="text-2xl font-extrabold mt-1">{{ stats.loyaltyPoints }}+</p>
              <p class="text-xs opacity-60 mt-1 hidden sm:block">پاداش‌های بیشتر</p>
            </div>
          </div>
        </div>
      </header>

      <!-- Main grid -->
      <div class="grid gap-4 lg:grid-cols-[1.25fr_0.75fr]">
        <!-- Left -->
        <section class="space-y-4 min-w-0">
          <div class="rounded-3xl border border-base-300/70 bg-base-100/75 backdrop-blur shadow-xl">
            <div class="p-4 sm:p-6">
              <div class="flex items-center justify-between gap-3">
                <div>
                  <p class="text-sm opacity-70">سفارش‌ها</p>
                  <h2 class="text-lg sm:text-xl font-bold">وضعیت سفارش‌ها</h2>
                </div>
                <RouterLink :to="{ name: 'orders' }" class="btn btn-sm btn-ghost rounded-2xl">
                  مشاهده
                </RouterLink>
              </div>

              <div class="mt-4 grid gap-3 grid-cols-2 sm:grid-cols-4">
                <div class="statusPill text-warning bg-warning/10">
                  <span class="text-xs">پردازش</span>
                  <span class="text-lg font-extrabold">{{ stats.processing }}</span>
                </div>

                <div class="statusPill text-success bg-success/10">
                  <span class="text-xs">تحویل</span>
                  <span class="text-lg font-extrabold">{{ stats.delivered }}</span>
                </div>

                <div class="statusPill text-error bg-error/10">
                  <span class="text-xs">لغو شده</span>
                  <span class="text-lg font-extrabold">{{ stats.canceled }}</span>
                </div>

                <div class="statusPill text-info bg-info/10">
                  <span class="text-xs">مرجوعی</span>
                  <span class="text-lg font-extrabold">{{ stats.returned }}</span>
                </div>
              </div>

              <div
                  v-if="stats.activeOrders === 0"
                  class="mt-4 rounded-2xl border border-base-300/60 bg-base-200/40 p-4"
              >
                <p class="text-sm font-bold">سفارش فعالی ندارید</p>
                <p class="text-xs opacity-70 mt-1">
                  می‌تونید تاریخچه سفارش‌ها رو ببینید یا از بخش پشتیبانی کمک بگیرید.
                </p>
                <div class="mt-3 flex flex-wrap gap-2">
                  <RouterLink :to="{ name: 'orders' }" class="btn btn-sm btn-outline rounded-2xl">
                    تاریخچه
                  </RouterLink>
                  <RouterLink to="/support" class="btn btn-sm btn-ghost rounded-2xl">
                    پشتیبانی
                  </RouterLink>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- Right -->
        <aside class="space-y-4 min-w-0">
          <div class="rounded-3xl border border-base-300/70 bg-base-100/75 backdrop-blur shadow-xl">
            <div class="p-4 sm:p-6">
              <div class="flex items-start justify-between gap-3">
                <div class="min-w-0">
                  <p class="text-sm opacity-70">کامل بودن</p>
                  <h3 class="text-lg font-bold">اطلاعات پروفایل</h3>
                  <p class="text-sm opacity-70 mt-1">{{ completionText }}</p>
                </div>

                <div
                    class="radial-progress shrink-0"
                    :class="profileCompletion >= 100 ? 'text-success' : 'text-primary'"
                    :style="`--value:${profileCompletion}; --size:${bigRadialSize}; --thickness:${bigRadialThickness};`"
                >
                  <span class="text-sm sm:text-base font-extrabold">{{ profileCompletion }}%</span>
                </div>
              </div>

              <progress
                  class="progress mt-5"
                  :class="profileCompletion >= 100 ? 'progress-success' : 'progress-primary'"
                  :value="profileCompletion"
                  max="100"
              ></progress>

              <div class="mt-3 flex flex-wrap gap-2">
                <span v-for="hint in completionHints" :key="hint" class="badge badge-outline">{{ hint }}</span>
              </div>

              <button class="btn btn-sm btn-outline rounded-2xl w-full mt-4" @click="openEdit">
                {{ profileCompletion >= 100 ? 'ویرایش' : 'تکمیل' }}
              </button>
            </div>
          </div>
        </aside>
      </div>
    </div>

    <!-- ✅ LAST: RECOMMENDATIONS -->
    <section class="relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen">
      <div class="max-w-6xl mx-auto w-full px-3 sm:px-4 py-4 sm:py-6">
        <div class="flex items-center justify-between gap-3">
          <div>
            <p class="text-sm opacity-70">پیشنهاداتی که</p>
            <h2 class="text-lg sm:text-xl font-bold">برای شما انتخاب شده‌اند</h2>
          </div>
        </div>

        <div class="mt-4 rec-row-shell">
          <button
              type="button"
              class="btn btn-sm btn-outline rounded-2xl recNav"
              @click="recPrev"
              :disabled="recNavDisabled || recBusy"
              aria-label="قبلی"
          >
            &lt;
          </button>

          <div ref="recViewport" class="rec-viewport" :style="{ '--rec-cols': String(recWindow) }">
            <div
                class="rec-track"
                :class="{ 'is-anim': recTransitioning }"
                :style="recTrackStyle"
                @transitionend="onRecTransitionEnd"
            >
              <div v-for="item in recRenderList" :key="item.__k" class="rec-cell">
                <ProductCard :product="item" class="product-card--rec" />
              </div>
            </div>
          </div>

          <button
              type="button"
              class="btn btn-sm btn-outline rounded-2xl recNav"
              @click="recNext"
              :disabled="recNavDisabled || recBusy"
              aria-label="بعدی"
          >
            &gt;
          </button>
        </div>
      </div>
    </section>

    <!-- ✅ EDIT PROFILE MODAL -->
    <dialog ref="editDialog" class="modal">
      <div class="modal-box w-full max-w-4xl text-right rounded-3xl">
        <!-- Header -->
        <div class="flex items-start justify-between gap-3">
          <div class="min-w-0">
            <h3 class="text-lg sm:text-xl font-bold truncate">ویرایش اطلاعات کاربری</h3>
          </div>

          <button
              type="button"
              class="btn btn-ghost btn-sm rounded-2xl shrink-0"
              @click="closeEdit"
              :disabled="saving"
          >
            بستن
          </button>
        </div>

        <!-- ✅ Stepper -->
        <div class="mt-5">
          <div class="flex items-center gap-3 sm:gap-4 select-none">
            <button type="button" class="flex items-center gap-3 text-right" @click="goStep(1)" :disabled="saving">
              <div
                  class="grid place-items-center rounded-2xl border font-extrabold transition w-10 h-10 sm:w-11 sm:h-11"
                  :class="
                  editStep >= 1
                    ? 'bg-primary text-primary-content border-primary/40 shadow-sm'
                    : 'bg-base-100 border-base-300 text-base-content/70'
                "
              >
                1
              </div>

              <div class="leading-tight">
                <div
                    class="text-sm sm:text-base font-extrabold"
                    :class="editStep >= 1 ? 'text-base-content' : 'text-base-content/70'"
                >
                  اطلاعات کاربری
                </div>
              </div>
            </button>

            <div class="flex-1 h-1 rounded-full bg-base-300/70 overflow-hidden">
              <div
                  class="h-full rounded-full transition-all duration-300"
                  :class="editStep >= 2 ? 'w-full bg-primary' : 'w-0 bg-primary'"
              ></div>
            </div>

            <button type="button" class="flex items-center gap-3 text-right" @click="goStep(2)" :disabled="saving">
              <div
                  class="grid place-items-center rounded-2xl border font-extrabold transition w-10 h-10 sm:w-11 sm:h-11"
                  :class="
                  editStep >= 2
                    ? 'bg-primary text-primary-content border-primary/40 shadow-sm'
                    : 'bg-base-100 border-base-300 text-base-content/70'
                "
              >
                2
              </div>

              <div class="leading-tight">
                <div
                    class="text-sm sm:text-base font-extrabold"
                    :class="editStep >= 2 ? 'text-base-content' : 'text-base-content/70'"
                >
                  اطلاعات حساب
                </div>
              </div>
            </button>
          </div>
        </div>

        <!-- ✅ FORM -->
        <form id="edit-profile-form" @submit.prevent="submitProfile" class="space-y-6 mt-6">
          <!-- STEP 1 -->
          <div v-show="editStep === 1" class="space-y-5">
            <div class="grid gap-4 sm:grid-cols-2">
              <div>
                <label class="label"><span class="label-text">نام</span></label>
                <input v-model.trim="firstName" type="text" class="input input-bordered w-full rounded-2xl" placeholder="مثلاً امیر" />
              </div>
              <div>
                <label class="label"><span class="label-text">نام خانوادگی</span></label>
                <input v-model.trim="lastName" type="text" class="input input-bordered w-full rounded-2xl" placeholder="مثلاً رضایی" />
              </div>
            </div>

            <div class="grid gap-4 sm:grid-cols-2">
              <div>
                <label class="label"><span class="label-text">ایمیل</span></label>
                <input
                    v-model.trim="email"
                    type="email"
                    class="input input-bordered w-full rounded-2xl ltr-input"
                    placeholder="example@email.com"
                />
                <p v-if="email && !isValidEmail(email)" class="mt-1 text-xs text-error">فرمت ایمیل صحیح نیست.</p>
              </div>

              <!-- ✅ Jalali Birthday Picker -->
              <div ref="birthdayPickerWrap" class="relative">
                <label class="label">
                  <span class="label-text">تاریخ تولد <span class="mr-1 text-xs text-error">(اختیاری)</span></span>
                </label>

                <!-- ✅ WRAP: button is positioned relative to INPUT only -->
                <div class="relative">
                  <input
                      v-model.trim="birthdayJalali"
                      type="text"
                      class="input input-bordered w-full rounded-2xl ltr-input pr-10"
                      placeholder="مثلاً 1403/09/07"
                      @focus="openBirthdayPicker()"
                      @click="openBirthdayPicker()"
                      @blur="onBirthdayBlur"
                      inputmode="numeric"
                      autocomplete="off"
                  />

                  <!-- ✅ FIX: no motion, fixed top/height, no transforms -->
                  <button
                      type="button"
                      class="calBtn btn btn-ghost btn-sm rounded-xl"
                      @click="toggleBirthdayPicker"
                      tabindex="-1"
                      aria-label="انتخاب تاریخ"
                  >
                    📅
                  </button>
                </div>

                <!-- ✅ FIX: keep space stable so layout doesn't jump -->
                <div class="mt-1 min-h-[18px]">
                  <p v-if="birthdayError" class="text-xs text-error">{{ birthdayError }}</p>
                </div>

                <!-- ✅ Popover Calendar (opens to the RIGHT on desktop) -->
                <div
                    v-show="birthdayPickerOpen"
                    class="jalali-popover rounded-2xl border border-base-300 bg-base-100 shadow-xl p-3"
                    role="dialog"
                    aria-label="انتخاب تاریخ شمسی"
                >
                  <div class="flex items-center justify-between gap-2">
                    <button type="button" class="btn btn-xs btn-ghost rounded-xl" @click="prevJMonth" aria-label="ماه قبل">
                      ‹
                    </button>

                    <div class="text-sm font-extrabold">
                      {{ jMonthNames[jViewMonth - 1] }} {{ jViewYear }}
                    </div>

                    <button type="button" class="btn btn-xs btn-ghost rounded-xl" @click="nextJMonth" aria-label="ماه بعد">
                      ›
                    </button>
                  </div>

                  <div class="grid grid-cols-7 gap-1 mt-2 text-xs opacity-70">
                    <div v-for="d in weekDaysFa" :key="d" class="text-center py-1">{{ d }}</div>
                  </div>

                  <div class="grid grid-cols-7 gap-1 mt-1">
                    <button
                        v-for="(cell, idx) in jCalendarCells"
                        :key="idx"
                        type="button"
                        class="btn btn-ghost btn-xs rounded-xl h-9"
                        :class="cell ? dayBtnClass(cell) : 'opacity-0 pointer-events-none'"
                        @click="cell && pickJDay(cell)"
                    >
                      {{ cell || '' }}
                    </button>
                  </div>

                  <div class="mt-2 flex items-center justify-between gap-2">
                    <button type="button" class="btn btn-xs btn-outline rounded-xl" @click="pickTodayJ">
                      امروز
                    </button>
                    <button type="button" class="btn btn-xs btn-ghost rounded-xl" @click="closeBirthdayPicker">
                      بستن
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div class="rounded-2xl border border-base-300/60 bg-base-200/40 p-4">
              <div class="flex items-center justify-between gap-3">
                <span class="text-sm font-semibold">تغییر شماره موبایل</span>
                <span class="text-xs opacity-60 shrink-0">در صورت نیاز</span>
              </div>
              <input
                  v-model.trim="newPhone"
                  type="text"
                  class="input input-bordered w-full rounded-2xl ltr-input mt-3"
                  placeholder="09xxxxxxxxx"
              />
            </div>
          </div>

          <!-- STEP 2 -->
          <div v-show="editStep === 2" class="space-y-4">
            <div class="rounded-2xl border border-base-300/60 bg-base-200/40 p-4">
              <div class="mb-4">
                <div class="flex items-center justify-between gap-3">
                  <span class="text-sm font-semibold">شماره حساب <span class="mr-1 text-xs text-error">(اختیاری)</span></span>
                </div>
                <input
                    v-model.trim="accountNumber"
                    type="text"
                    class="input input-bordered w-full rounded-2xl ltr-input mt-3"
                    placeholder="6219 8619 XXXX XXXX"
                />
              </div>

              <div class="flex items-center justify-between gap-3">
                <span class="text-sm font-semibold">شماره شبا</span>
                <span class="text-xs opacity-60 shrink-0">برای عودت وجه</span>
              </div>
              <input
                  v-model.trim="sheba"
                  type="text"
                  class="input input-bordered w-full rounded-2xl ltr-input mt-3"
                  placeholder="IRxxxxxxxxxxxxxxxxxxxxxx"
              />
            </div>
          </div>
        </form>

        <div class="modal-action mt-2 flex flex-col sm:flex-row sm:justify-start sm:items-center gap-2">
          <button
              v-if="editStep === 2"
              type="button"
              class="btn btn-outline rounded-2xl w-full sm:w-auto"
              @click="prevStep"
              :disabled="saving"
          >
            مرحله قبل
          </button>

          <button v-if="editStep === 1" type="button" class="btn btn-primary rounded-2xl w-full sm:w-auto" @click="nextStep">
            مرحله بعد
          </button>

          <button
              v-if="editStep === 2"
              type="submit"
              form="edit-profile-form"
              class="btn btn-primary rounded-2xl w-full sm:w-auto"
              :disabled="saving || !canSubmit"
          >
            <span v-if="!saving">ذخیره</span>
            <span v-else class="loading loading-spinner loading-sm"></span>
          </button>
        </div>
      </div>

      <form method="dialog" class="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch, onMounted, onUnmounted, nextTick } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import { http } from '@/services/http'

import ProductCard from '@/components/ProductCard.vue'
import type { Product } from '@/services/types'

/* =========================
   ✅ Jalali conversion (jalaali-js style, MIT)
========================= */
function div(a: number, b: number) { return ~~(a / b) }
function mod(a: number, b: number) { return a - ~~(a / b) * b }

function jalCal(jy: number) {
  const breaks = [-61, 9, 38, 199, 426, 686, 756, 818, 1111, 1181, 1210, 1635, 2060, 2097, 2192, 2262, 2324, 2394, 2456, 3178]
  const bl = breaks.length
  const gy = jy + 621
  let leapJ = -14
  let jp = breaks[0]
  let jm = 0
  let jump = 0
  if (jy < jp || jy >= breaks[bl - 1]) throw new Error('Invalid Jalali year ' + jy)

  for (let i = 1; i < bl; i++) {
    jm = breaks[i]
    jump = jm - jp
    if (jy < jm) break
    leapJ = leapJ + div(jump, 33) * 8 + div(mod(jump, 33), 4)
    jp = jm
  }
  let n = jy - jp
  leapJ = leapJ + div(n, 33) * 8 + div(mod(n, 33) + 3, 4)
  if (mod(jump, 33) === 4 && jump - n === 4) leapJ += 1

  const leapG = div(gy, 4) - div((div(gy, 100) + 1) * 3, 4) - 150
  const march = 20 + leapJ - leapG

  if (jump - n < 6) n = n - jump + div(jump + 4, 33) * 33
  let leap = mod(mod(n + 1, 33) - 1, 4)
  if (leap === -1) leap = 4

  return { leap, gy, march }
}

function g2d(gy: number, gm: number, gd: number) {
  let d =
      div((gy + div(gm - 8, 6) + 100100) * 1461, 4) +
      div(153 * mod(gm + 9, 12) + 2, 5) +
      gd - 34840408
  d = d - div(div(gy + 100100 + div(gm - 8, 6), 100) * 3, 4) + 752
  return d
}
function d2g(jdn: number) {
  let j = 4 * jdn + 139361631
  j = j + div(div(4 * jdn + 183187720, 146097) * 3, 4) * 4 - 3908
  const i = div(mod(j, 1461), 4) * 5 + 308
  const gd = div(mod(i, 153), 5) + 1
  const gm = mod(div(i, 153), 12) + 1
  const gy = div(j, 1461) - 100100 + div(8 - gm, 6)
  return { gy, gm, gd }
}
function j2d(jy: number, jm: number, jd: number) {
  const r = jalCal(jy)
  return g2d(r.gy, 3, r.march) + (jm - 1) * 31 - div(jm, 7) * (jm - 7) + jd - 1
}
function d2j(jdn: number) {
  const g = d2g(jdn)
  let jy = g.gy - 621
  const r = jalCal(jy)
  const jdn1f = g2d(g.gy, 3, r.march)
  let k = jdn - jdn1f
  let jm = 0
  let jd = 0

  if (k >= 0) {
    if (k <= 185) {
      jm = 1 + div(k, 31)
      jd = mod(k, 31) + 1
      return { jy, jm, jd }
    } else {
      k -= 186
    }
  } else {
    jy -= 1
    k += 179
    if (r.leap === 1) k += 1
  }
  jm = 7 + div(k, 30)
  jd = mod(k, 30) + 1
  return { jy, jm, jd }
}
function toJalaali(gy: number, gm: number, gd: number) { return d2j(g2d(gy, gm, gd)) }
function toGregorian(jy: number, jm: number, jd: number) { return d2g(j2d(jy, jm, jd)) }
function isValidJalaaliDate(jy: number, jm: number, jd: number) {
  if (jy < -61 || jy > 3177) return false
  if (jm < 1 || jm > 12) return false
  if (jd < 1 || jd > jalaaliMonthLength(jy, jm)) return false
  return true
}
function isLeapJalaaliYear(jy: number) { return jalCal(jy).leap === 0 }
function jalaaliMonthLength(jy: number, jm: number) {
  if (jm <= 6) return 31
  if (jm <= 11) return 30
  return isLeapJalaaliYear(jy) ? 30 : 29
}
/* ========================= */

const DEV_BYPASS_AUTH = import.meta.env.DEV && import.meta.env.VITE_DEV_BYPASS_AUTH === 'true'

const DEV_USER = {
  id: 1,
  name: 'کاربر تست',
  phone: '09120000000',
  email: 'test@example.com',
  birthday: '',
  sheba: '',
  accountNumber: '',
  lastName: 'نمونه'
}

const auth = useAuthStore()
const router = useRouter()
const toast = useToast()

const userInitial = computed(() => {
  const u: any = auth.user
  if (u?.name) return String(u.name).charAt(0)
  if (u?.phone) return String(u.phone).slice(-2)
  return 'U'
})

const fullName = computed(() => {
  const u: any = auth.user || {}
  const fn = String(u?.name || '').trim()
  const ln = String(u?.lastName || u?.last_name || '').trim()
  const merged = [fn, ln].filter(Boolean).join(' ').trim()
  return merged || 'کاربر گرامی'
})

const displayEmail = computed(() => (auth.user as any)?.email || 'ایمیل ثبت نشده')

const stats = {
  activeOrders: 0,
  completedOrders: 12,
  canceledOrders: 0,
  loyaltyPoints: 48,
  processing: 0,
  delivered: 12,
  canceled: 0,
  returned: 0
}

/** ✅ recommended products */
const recommendedProducts = ref<Product[]>(
    [
      { id: 101, slug: 'chatgpt-plus', title: 'ChatGPT Plus', image: 'https://placehold.co/600x600?text=ChatGPT', rating: 4.7, price: 590000, compareAt: 690000 },
      { id: 102, slug: 'capcut-pro', title: 'CapCut Pro', image: 'https://placehold.co/600x600?text=CapCut', rating: 4.6, price: 320000, compareAt: 0 },
      { id: 103, slug: 'duolingo-super', title: 'Duolingo Super', image: 'https://placehold.co/600x600?text=Duolingo', rating: 4.5, price: 210000, compareAt: 260000 },
      { id: 104, slug: 'grammarly-premium', title: 'Grammarly Premium', image: 'https://placehold.co/600x600?text=Grammarly', rating: 4.6, price: 430000, compareAt: 520000 },
      { id: 105, slug: 'vps-server', title: 'VPS Server', image: 'https://placehold.co/600x600?text=VPS', rating: 4.4, price: 780000, compareAt: 0 },
      { id: 106, slug: 'canva-pro', title: 'Canva Pro', image: 'https://placehold.co/600x600?text=Canva', rating: 4.7, price: 290000, compareAt: 360000 }
    ].map(p => p as any)
)

/** dialogs/steps */
const editDialog = ref<HTMLDialogElement | null>(null)
const editStep = ref<1 | 2>(1)
const saving = ref(false)

/** form */
const firstName = ref('')
const lastName = ref('')
const email = ref('')

const birthdayJalali = ref<string>('') // like 1403/09/07
const birthdayIso = ref<string>('')    // like 2024-11-27
const birthdayError = ref<string>('')

const newPhone = ref('')
const accountNumber = ref('')
const sheba = ref('')
const initialSnapshot = ref<any>({})

function normalize(v: any) { return String(v ?? '').trim() }
function pad2(n: number) { return String(n).padStart(2, '0') }

function isIsoDate(s: string) { return /^\d{4}-\d{2}-\d{2}$/.test(s) }
function isJalaliDateString(s: string) { return /^\d{4}\/\d{1,2}\/\d{1,2}$/.test(s) }

function isoToJalali(iso: string) {
  if (!iso || !isIsoDate(iso)) return ''
  const [y, m, d] = iso.split('-').map(Number)
  const j = toJalaali(y, m, d)
  return `${j.jy}/${pad2(j.jm)}/${pad2(j.jd)}`
}
function jalaliToIso(jstr: string) {
  const s = normalize(jstr)
  if (!s) return ''
  if (!isJalaliDateString(s)) return ''
  const [jy, jm, jd] = s.split('/').map(Number)
  if (!isValidJalaaliDate(jy, jm, jd)) return ''
  const g = toGregorian(jy, jm, jd)
  return `${g.gy}-${pad2(g.gm)}-${pad2(g.gd)}`
}

function normalizeBirthdayToIso(v: any): string {
  if (!v) return ''
  if (Array.isArray(v)) v = v[0]
  if (v && typeof v === 'object') v = (v as any).start ?? (v as any).from ?? v
  if (v instanceof Date) return v.toISOString().slice(0, 10)

  const s = String(v).trim()
  if (!s) return ''

  if (/^\d{4}-\d{2}-\d{2}/.test(s)) return s.slice(0, 10)
  if (isJalaliDateString(s)) return jalaliToIso(s)
  return ''
}

function syncBirthdayFromJalali() {
  birthdayError.value = ''
  const s = normalize(birthdayJalali.value)
  if (!s) {
    birthdayIso.value = ''
    return
  }
  const iso = jalaliToIso(s)
  if (!iso) {
    birthdayError.value = 'فرمت تاریخ شمسی صحیح نیست. نمونه: 1403/09/07'
    birthdayIso.value = ''
    return
  }
  birthdayIso.value = iso
}

function fillFormFromUser(u: any) {
  firstName.value = u?.name ?? ''
  lastName.value = u?.lastName ?? u?.last_name ?? ''
  email.value = u?.email ?? ''

  birthdayIso.value = normalizeBirthdayToIso(u?.birthday ?? '')
  birthdayJalali.value = birthdayIso.value ? isoToJalali(birthdayIso.value) : ''
  birthdayError.value = ''

  newPhone.value = u?.phone ?? ''
  accountNumber.value = u?.accountNumber ?? u?.account_number ?? ''
  sheba.value = u?.sheba ?? ''

  initialSnapshot.value = {
    name: normalize(firstName.value),
    lastName: normalize(lastName.value),
    email: normalize(email.value),
    birthdayIso: normalize(birthdayIso.value),
    phone: normalize(newPhone.value),
    accountNumber: normalize(accountNumber.value),
    sheba: normalize(sheba.value)
  }
}

watch(
    () => auth.user,
    (u) => {
      if (u) fillFormFromUser(u)
      else if (DEV_BYPASS_AUTH) {
        ;(auth as any).user = DEV_USER
        localStorage.setItem('auth_user', JSON.stringify(DEV_USER))
        fillFormFromUser(DEV_USER)
      }
    },
    { immediate: true }
)

function openEdit() {
  editStep.value = 1
  if (auth.user) fillFormFromUser(auth.user)
  editDialog.value?.showModal()
}
function closeEdit() { editDialog.value?.close() }

function goStep(step: 1 | 2) {
  if (saving.value) return
  if (step === 2 && email.value && !isValidEmail(email.value)) {
    toast.error('ایمیل معتبر نیست')
    return
  }
  if (birthdayJalali.value && !birthdayIso.value) {
    toast.error('تاریخ تولد معتبر نیست')
    return
  }
  editStep.value = step
}

function nextStep() {
  if (email.value && !isValidEmail(email.value)) {
    toast.error('ایمیل معتبر نیست')
    return
  }
  if (birthdayJalali.value && !birthdayIso.value) {
    toast.error('تاریخ تولد معتبر نیست')
    return
  }
  editStep.value = 2
}
function prevStep() { editStep.value = 1 }

function logout() {
  auth.logout?.()
  toast.success('با موفقیت خارج شدید')
  router.push('/')
}

function isValidEmail(v: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)
}

/* ====== Slider + Calendar state (unchanged) ====== */
const vw = ref(typeof window !== 'undefined' ? window.innerWidth : 1024)
function updateVW() { vw.value = window.innerWidth }
onMounted(() => {
  updateVW()
  window.addEventListener('resize', updateVW, { passive: true })
})
onUnmounted(() => {
  window.removeEventListener('resize', updateVW as any)
})

const recViewport = ref<HTMLDivElement | null>(null)
const recWindow = ref(3)
const recCursor = ref(0)
const recDir = ref<'next' | 'prev'>('next')
const recBuffering = ref(false)
const recTransitioning = ref(false)
const recOffset = ref(0)
const recBusy = computed(() => recBuffering.value || recTransitioning.value)
const recNavDisabled = computed(() => recommendedProducts.value.length <= recWindow.value)
const recSlidePct = computed(() => (recWindow.value ? 100 / recWindow.value : 0))
function productAtVirtual(v: number) {
  const list = recommendedProducts.value
  const len = list.length
  if (!len) return null
  const i = ((v % len) + len) % len
  return list[i]
}
const recRenderList = computed(() => {
  const len = recommendedProducts.value.length
  const w = recWindow.value
  if (!len || w <= 0) return []
  const count = Math.min(w, len)
  if (!recBuffering.value) {
    const out: any[] = []
    for (let k = 0; k < count; k++) {
      const v = recCursor.value + k
      const p = productAtVirtual(v)
      if (!p) continue
      out.push({ ...(p as any), __k: `v${v}` })
    }
    return out
  }
  const out: any[] = []
  if (recDir.value === 'next') {
    for (let k = 0; k < count + 1; k++) {
      const v = recCursor.value + k
      const p = productAtVirtual(v)
      if (!p) continue
      out.push({ ...(p as any), __k: `v${v}` })
    }
    return out
  }
  for (let k = 0; k < count + 1; k++) {
    const v = recCursor.value - 1 + k
    const p = productAtVirtual(v)
    if (!p) continue
    out.push({ ...(p as any), __k: `v${v}` })
  }
  return out
})
const recTrackStyle = computed(() => ({ transform: `translateX(${recOffset.value}%)` }))
function forceReflow() { void recViewport.value?.offsetWidth }
function startRecNext() {
  recDir.value = 'next'
  recBuffering.value = true
  recTransitioning.value = false
  recOffset.value = 0
  requestAnimationFrame(() => {
    forceReflow()
    recTransitioning.value = true
    recOffset.value = -recSlidePct.value
  })
}
async function startRecPrev() {
  recDir.value = 'prev'
  recBuffering.value = true
  recTransitioning.value = false
  recOffset.value = -recSlidePct.value
  await nextTick()
  requestAnimationFrame(() => {
    forceReflow()
    recTransitioning.value = true
    recOffset.value = 0
  })
}
function recNext() { if (!recNavDisabled.value && !recBusy.value) startRecNext() }
function recPrev() { if (!recNavDisabled.value && !recBusy.value) void startRecPrev() }
function onRecTransitionEnd(e: TransitionEvent) {
  if (e.propertyName !== 'transform') return
  if (!recTransitioning.value) return
  recTransitioning.value = false
  if (recDir.value === 'next') recCursor.value += 1
  else recCursor.value -= 1
  recBuffering.value = false
  recOffset.value = 0
}
function computeRecWindow() {
  const w = vw.value
  if (w < 640) recWindow.value = 1
  else if (w < 900) recWindow.value = 2
  else if (w < 1200) recWindow.value = 3
  else recWindow.value = 4
  const len = recommendedProducts.value.length
  recWindow.value = Math.max(1, Math.min(recWindow.value, len || 1))
}
let ro: ResizeObserver | null = null
onMounted(async () => {
  await nextTick()
  computeRecWindow()
  const el = recViewport.value
  if (el && 'ResizeObserver' in window) {
    ro = new ResizeObserver(() => computeRecWindow())
    ro.observe(el)
  } else {
    window.addEventListener('resize', computeRecWindow, { passive: true })
  }
})
onUnmounted(() => {
  if (ro) ro.disconnect()
  window.removeEventListener('resize', computeRecWindow as any)
})
watch(vw, () => computeRecWindow())

/* ====== Profile completion (unchanged) ====== */
const profileCompletion = computed(() => {
  const u: any = auth.user || {}
  const fields = [
    !!u?.name,
    !!(u?.lastName || u?.last_name),
    !!u?.phone,
    !!u?.email,
    !!u?.birthday,
    !!(u?.accountNumber || u?.account_number),
    !!u?.sheba
  ]
  const filled = fields.filter(Boolean).length
  return Math.round((filled / fields.length) * 100)
})
const completionText = computed(() => {
  const p = profileCompletion.value
  if (p >= 100) return 'پروفایل شما کامل است. در صورت نیاز می‌توانید اطلاعات را ویرایش کنید.'
  if (p >= 60) return 'پروفایل شما تقریباً کامل است. چند مورد باقی مانده است.'
  return 'پروفایل را تکمیل کنید تا تجربه بهتری از سفارش و پشتیبانی داشته باشید.'
})
const completionHints = computed(() => {
  const u: any = auth.user || {}
  const hints: string[] = []
  if (!u?.email) hints.push('ثبت ایمیل')
  if (!u?.birthday) hints.push('ثبت تولد')
  if (!(u?.accountNumber || u?.account_number)) hints.push('ثبت شماره حساب')
  if (!u?.sheba) hints.push('ثبت شبا')
  if (!(u?.lastName || u?.last_name)) hints.push('نام خانوادگی')
  return hints.length ? hints.slice(0, 4) : ['همه چیز کامل است']
})

/* ====== Modal submit / validation (kept minimal) ====== */
const isDirty = computed(() => {
  const snap = initialSnapshot.value || {}
  const now = {
    name: normalize(firstName.value),
    lastName: normalize(lastName.value),
    email: normalize(email.value),
    birthdayIso: normalize(birthdayIso.value),
    phone: normalize(newPhone.value),
    accountNumber: normalize(accountNumber.value),
    sheba: normalize(sheba.value)
  }
  return (
      now.name !== (snap.name || '') ||
      now.lastName !== (snap.lastName || '') ||
      now.email !== (snap.email || '') ||
      now.birthdayIso !== (snap.birthdayIso || '') ||
      now.phone !== (snap.phone || '') ||
      now.accountNumber !== (snap.accountNumber || '') ||
      now.sheba !== (snap.sheba || '')
  )
})
const canSubmit = computed(() => {
  if (!isDirty.value) return false
  if (email.value && !isValidEmail(email.value)) return false
  if (birthdayJalali.value && !birthdayIso.value) return false
  return true
})

async function submitProfile() {
  if (!canSubmit.value) return
  saving.value = true
  try {
    if (DEV_BYPASS_AUTH) {
      const current: any = auth.user || {}
      const updatedUser = {
            ...current,
            name: normalize(firstName.value) || current.name || '',
            lastName: normalize(lastName.value) || current.lastName || current.last_name || '',
            email: normalize(email.value) || current.email || '',
            birthday: normalize(birthdayIso.value) || '',
            phone: normalize(newPhone.value) || current.phone || '',
            accountNumber: normalize(accountNumber.value) || current.accountNumber || current.account_number || '',
            sheba: normalize(sheba.value) || current.sheba || ''
          }
      ;(auth as any).user = updatedUser
      localStorage.setItem('auth_user', JSON.stringify(updatedUser))
      fillFormFromUser(updatedUser)
      toast.success('اطلاعات ذخیره شد')
      closeEdit()
      return
    }

    const payload: any = {
      name: normalize(firstName.value) || null,
      last_name: normalize(lastName.value) || null,
      email: normalize(email.value) || null,
      birthday: normalize(birthdayIso.value) || null,
      phone: normalize(newPhone.value) || null,
      account_number: normalize(accountNumber.value) || null,
      sheba: normalize(sheba.value) || null
    }

    const res = await http.put('/users/me', payload)
    ;(auth as any).user = res.data.user
    localStorage.setItem('auth_user', JSON.stringify((auth as any).user))
    fillFormFromUser(res.data.user)

    toast.success('اطلاعات شما با موفقیت به‌روزرسانی شد')
    closeEdit()
  } catch (e: any) {
    console.error(e)
    toast.error(e?.response?.data?.error || 'خطا در به‌روزرسانی پروفایل')
  } finally {
    saving.value = false
  }
}

/* ====== Calendar popover state ====== */
const birthdayPickerWrap = ref<HTMLElement | null>(null)
const birthdayPickerOpen = ref(false)
const weekDaysFa = ['ش', 'ی', 'د', 'س', 'چ', 'پ', 'ج']
const jMonthNames = ['فروردین','اردیبهشت','خرداد','تیر','مرداد','شهریور','مهر','آبان','آذر','دی','بهمن','اسفند']

function todayJ() {
  const d = new Date()
  const j = toJalaali(d.getFullYear(), d.getMonth() + 1, d.getDate())
  return j
}
const jViewYear = ref<number>(todayJ().jy)
const jViewMonth = ref<number>(todayJ().jm)

function ensureViewOnCurrentValue() {
  if (birthdayIso.value && isIsoDate(birthdayIso.value)) {
    const [gy, gm, gd] = birthdayIso.value.split('-').map(Number)
    const j = toJalaali(gy, gm, gd)
    jViewYear.value = j.jy
    jViewMonth.value = j.jm
  } else {
    const j = todayJ()
    jViewYear.value = j.jy
    jViewMonth.value = j.jm
  }
}
function toggleBirthdayPicker() {
  if (birthdayPickerOpen.value) closeBirthdayPicker()
  else openBirthdayPicker()
}
function openBirthdayPicker() {
  birthdayPickerOpen.value = true
  ensureViewOnCurrentValue()
}
function closeBirthdayPicker() { birthdayPickerOpen.value = false }
function onBirthdayBlur() {
  window.setTimeout(() => syncBirthdayFromJalali(), 0)
}
function prevJMonth() {
  let y = jViewYear.value
  let m = jViewMonth.value - 1
  if (m < 1) { m = 12; y -= 1 }
  jViewYear.value = y
  jViewMonth.value = m
}
function nextJMonth() {
  let y = jViewYear.value
  let m = jViewMonth.value + 1
  if (m > 12) { m = 1; y += 1 }
  jViewYear.value = y
  jViewMonth.value = m
}
function getWeekIndexSaturdayFirst(jy: number, jm: number, jd: number) {
  const g = toGregorian(jy, jm, jd)
  const jsDay = new Date(g.gy, g.gm - 1, g.gd).getDay()
  return (jsDay + 1) % 7
}
const jCalendarCells = computed(() => {
  const y = jViewYear.value
  const m = jViewMonth.value
  const firstIndex = getWeekIndexSaturdayFirst(y, m, 1)
  const days = jalaaliMonthLength(y, m)
  const cells: Array<number | null> = []
  for (let i = 0; i < firstIndex; i++) cells.push(null)
  for (let d = 1; d <= days; d++) cells.push(d)
  while (cells.length < 42) cells.push(null)
  return cells
})
function selectedJParts() {
  if (!birthdayIso.value || !isIsoDate(birthdayIso.value)) return null
  const [gy, gm, gd] = birthdayIso.value.split('-').map(Number)
  return toJalaali(gy, gm, gd)
}
function dayBtnClass(day: number) {
  const sel = selectedJParts()
  const isSel = sel && sel.jy === jViewYear.value && sel.jm === jViewMonth.value && sel.jd === day
  return isSel ? 'btn-primary text-primary-content' : ''
}
function pickJDay(day: number) {
  const y = jViewYear.value
  const m = jViewMonth.value
  const jStr = `${y}/${pad2(m)}/${pad2(day)}`
  birthdayJalali.value = jStr
  birthdayError.value = ''
  birthdayIso.value = jalaliToIso(jStr)
  closeBirthdayPicker()
}
function pickTodayJ() {
  const j = todayJ()
  jViewYear.value = j.jy
  jViewMonth.value = j.jm
  pickJDay(j.jd)
}
function onDocPointer(e: PointerEvent) {
  if (!birthdayPickerOpen.value) return
  const root = birthdayPickerWrap.value
  const t = e.target as Node | null
  if (root && t && root.contains(t)) return
  closeBirthdayPicker()
}
onMounted(() => document.addEventListener('pointerdown', onDocPointer, { capture: true }))
onUnmounted(() => document.removeEventListener('pointerdown', onDocPointer as any, { capture: true } as any))

/* ====== Sizes (unchanged) ====== */
const bigRadialSize = computed(() => {
  if (vw.value >= 1024) return '6.8rem'
  if (vw.value >= 640) return '6.0rem'
  return '5.4rem'
})
const bigRadialThickness = computed(() => (vw.value >= 640 ? '11px' : '10px'))
</script>

<style scoped>
.ltr-input {
  direction: ltr;
  text-align: left;
}

/* ✅ allow popovers to render correctly inside modal */
.modal-box {
  overflow: visible;
}

.statusPill {
  border-radius: 1rem;
  padding: 0.75rem 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  border: 1px solid rgba(0, 0, 0, 0.06);
}

/* =========================
   Recommendations slider
========================= */
.rec-row-shell {
  display: grid;
  grid-template-columns: 44px 1fr 44px;
  gap: 10px;
  align-items: center;
}

.recNav {
  height: 44px;
  width: 44px;
  padding: 0;
  font-size: 18px;
  line-height: 1;
  transition: transform 160ms ease, opacity 160ms ease;
}
.recNav:hover { transform: translateY(-1px); }
.recNav:active { transform: translateY(0); }
.recNav:disabled {
  opacity: 0.45;
  cursor: not-allowed;
  transform: none;
}

.rec-viewport {
  overflow: hidden;
  min-width: 0;
  border-radius: 22px;
}

.rec-track {
  display: flex;
  align-items: stretch;
  will-change: transform;
  transform: translateX(0);
}
.rec-track.is-anim { transition: transform 420ms ease; }

.rec-cell {
  flex: 0 0 calc(100% / var(--rec-cols));
  min-width: 0;
  padding-inline: 6px;
  box-sizing: border-box;
  display: flex;
}

.rec-cell :deep(.card) {
  width: 100%;
  display: flex;
  flex-direction: column;
}
.rec-cell :deep(figure) { overflow: hidden; }
.rec-cell :deep(figure img) {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}
.rec-cell :deep(.card-title) {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
  line-height: 1.5;
  min-height: calc(1.5em * 2);
}
.rec-cell :deep(.card-body) {
  display: flex;
  flex-direction: column;
}
.rec-cell :deep(.card-body .btn.btn-ghost) { margin-top: auto; }

/* =========================
   ✅ Jalali popover (RIGHT of input on desktop)
========================= */
.jalali-popover {
  position: absolute;
  z-index: 60;
  top: 0;
  right: 0;
  transform: translateX(calc(100% + 12px));
  width: 320px;
  max-width: min(360px, 86vw);
}

/* ✅ On small screens, popover falls back below input */
@media (max-width: 640px) {
  .jalali-popover {
    top: calc(100% + 8px);
    right: 0;
    left: 0;
    transform: none;
    width: auto;
    max-width: none;
  }
}

/* =========================
   ✅ Calendar button: NO MOTION
========================= */
.calBtn {
  position: absolute;
  right: 8px;
  top: 8px;                 /* ثابت */
  height: calc(100% - 16px); /* هم‌قد input */
  width: 40px;
  padding: 0;
  display: grid;
  place-items: center;
  /* مهم: حذف هر موشن/ترنسفورم ناخواسته */
  transform: none !important;
  transition: none !important;
}

.calBtn:hover,
.calBtn:active,
.calBtn:focus {
  transform: none !important;
  transition: none !important;
}
</style>

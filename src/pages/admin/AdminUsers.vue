<template>
  <div class="space-y-6" dir="rtl">
    <!-- HERO بالا برای کاربران -->
    <section
        class="relative overflow-hidden rounded-3xl bg-gradient-to-l from-primary/95 via-primary/85 to-secondary/80 text-primary-content p-5 sm:p-6 shadow-xl"
    >
      <div
          class="relative z-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
      >
        <div class="space-y-1.5">
          <p
              class="text-[10px] uppercase tracking-[0.25em] text-primary-content/70"
          >
            USERS
          </p>
          <h2 class="text-lg sm:text-2xl font-extrabold">
            مدیریت کاربران
          </h2>
          <p class="mt-1 text-xs sm:text-sm text-primary-content/80">
            مشاهده، جستجو و مدیریت کاربران ثبت‌نام‌شده در سپهر‌باکس.
          </p>
        </div>


        <!-- باکس‌های آماری کنار هم -->
        <div
            class="flex flex-col items-end gap-2 text-[11px] sm:text-xs"
        >
          <div
              class="inline-flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-primary-content/10 border border-primary-content/20"
          >
            <span class="w-1.5 h-1.5 rounded-full bg-primary-content/80"></span>
            <span>تعداد کل کاربران:</span>
            <span class="font-bold text-sm">
      {{ totalUsers }}
    </span>
          </div>

          <div
              class="inline-flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-primary-content/10 border border-primary-content/20"
          >
            <span class="w-1.5 h-1.5 rounded-full bg-primary-content/80"></span>
            <span>در این لیست:</span>
            <span class="font-bold text-sm">
      {{ filteredCount }}
    </span>
          </div>
        </div>

      </div>

      <!-- دکور بک‌گراند -->
      <div
          class="pointer-events-none absolute -left-24 -bottom-24 w-64 h-64 rounded-full border border-primary-content/20 opacity-40"
      ></div>
      <div
          class="pointer-events-none absolute -right-16 -top-16 w-48 h-48 rounded-full border border-primary-content/25 opacity-50"
      ></div>
    </section>

    <!-- فیلتر و جستجو -->
    <section
        class="rounded-3xl bg-base-100 border border-base-300/80 p-4 sm:p-5 shadow-sm space-y-4"
    >
      <div
          class="flex flex-col gap-3 md:flex-row md:items-center md:justify-between"
      >
        <div class="space-y-1">
          <h3 class="text-sm sm:text-base font-semibold text-base-content">
            جستجو و فیلتر کاربران
          </h3>
        </div>

        <div class="w-full sm:w-72 relative ">
            <span
                class="pointer-events-none absolute inset-y-0 right-3 flex items-center"
            >
              <svg
                  class="w-4 h-4 text-base-content/50"
                  viewBox="0 0 24 24"
                  fill="none"
              >
                <circle
                    cx="11"
                    cy="11"
                    r="6"
                    stroke="currentColor"
                    stroke-width="1.5"
                />
                <line
                    x1="15.5"
                    y1="15.5"
                    x2="20"
                    y2="20"
                    stroke="currentColor"
                    stroke-width="1.5"
                    stroke-linecap="round"
                />
              </svg>
            </span>
          <input
              v-model="q"
              class="input input-bordered min-h-0 h-9 w-full pr-8 rounded-2xl text-[11px] py-1"
              placeholder="جستجو بر اساس شماره موبایل..."
          />
        </div>
      </div>

      <!-- تب‌های فیلتر -->
      <div class="flex flex-wrap gap-2 text-[11px] sm:text-xs">
        <button
            v-for="opt in filterOptions"
            :key="opt.key"
            type="button"
            class="px-3 py-1 rounded-full border transition-colors"
            :class="
            filterTab === opt.key
              ? 'bg-primary text-primary-content border-primary/70'
              : 'bg-base-100 border-base-300 text-base-content/70 hover:bg-base-200'
          "
            @click="filterTab = opt.key"
        >
          {{ opt.label }}
        </button>
      </div>
    </section>

    <!-- لیست کارت‌محور کاربران -->
    <section
        class="bg-base-100 rounded-3xl border border-base-300 p-4 sm:p-5 shadow-sm space-y-3"
    >
      <div class="flex items-center justify-between mb-1">
        <h3 class="font-semibold text-sm sm:text-base">
          کاربران
        </h3>
        <span class="text-[11px] sm:text-xs text-base-content/60">
          {{ filteredCount }} کاربر در این لیست
        </span>
      </div>

      <!-- اگر کاربری هست -->
      <div
          v-if="filtered.length"
          class="grid gap-3 sm:gap-4 md:grid-cols-2"
      >
        <article
            v-for="u in filtered"
            :key="u.id"
            class="group rounded-2xl border border-base-300 bg-base-100/90 px-3.5 py-3 sm:px-4 sm:py-3.5 flex items-center justify-between gap-3 hover:-translate-y-0.5 hover:shadow-md hover:border-primary/40 transition-all"
        >
          <!-- اطلاعات اصلی کاربر -->
          <div class="flex items-center gap-3">
            <!-- آواتار -->
            <div
                class="h-9 w-9 sm:h-10 sm:w-10 rounded-2xl bg-gradient-to-br from-primary/90 to-secondary/80 text-primary-content flex items-center justify-center text-xs sm:text-sm font-bold shadow-sm"
            >
              {{ avatarInitial(u) }}
            </div>

            <div class="flex flex-col gap-0.5">
              <!-- نام یا بدون نام -->
              <div class="flex items-center gap-2">
                <span
                    v-if="u.name"
                    class="text-xs sm:text-sm font-medium text-base-content"
                >
                  {{ u.name }}
                </span>
                <span
                    v-else
                    class="inline-flex items-center px-2 py-0.5 rounded-full bg-base-200/80 text-[10px] sm:text-[11px] text-base-content/70"
                >
                  بدون نام
                </span>

                <span
                    class="hidden sm:inline-flex items-center px-1.5 py-0.5 rounded-full bg-base-200 text-[10px] text-base-content/60"
                >
                  ID: {{ u.id }}
                </span>
              </div>

              <!-- شماره موبایل -->
              <span
                  class="inline-flex items-center px-2 py-0.5 rounded-full bg-base-200/70 text-[11px] sm:text-xs"
              >
                <span class="ltr font-mono text-base-content/90">
                  {{ u.phone }}
                </span>
              </span>
            </div>
          </div>

          <!-- تاریخ و وضعیت ساده -->
          <div
              class="flex flex-col items-end gap-1 text-[10px] sm:text-[11px]"
          >
            <span
                class="inline-flex items-center px-2 py-0.5 rounded-full bg-base-200/80 text-base-content/70 whitespace-nowrap"
            >
              {{ u.createdAt }}
            </span>
            <span
                class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-base-100 text-base-content/60 border border-dashed border-base-300 group-hover:border-primary/40"
            >
              <span class="w-1 h-1 rounded-full bg-success/70"></span>
              کاربر ثبت‌شده
            </span>
          </div>
        </article>
      </div>

      <!-- اگر هیچ کاربری در فیلتر نبود -->
      <div
          v-else
          class="py-10 flex flex-col items-center justify-center gap-2 text-center text-xs text-base-content/60"
      >
        <div
            class="h-16 w-16 rounded-3xl border border-dashed border-base-300 flex items-center justify-center mb-1"
        >
          <div class="h-8 w-8 rounded-2xl bg-base-200"></div>
        </div>
        <p>کاربری با این شرایط پیدا نشد.</p>
        <p class="text-[11px] text-base-content/50">
          عبارت جستجو یا فیلتر بالا را تغییر بده تا کاربران بیشتری نمایش داده شوند.
        </p>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

const users = ref([
  { id: 1, phone: '09120000000', name: 'کاربر تست', createdAt: '1404/03/10' },
  { id: 2, phone: '09350000000', name: '', createdAt: '1404/03/11' },
])

const q = ref('')

type FilterKey = 'all' | 'named' | 'nameless'

const filterOptions: { key: FilterKey; label: string }[] = [
  { key: 'all', label: 'همه کاربران' },
  { key: 'named', label: 'فقط کاربران با نام' },
  { key: 'nameless', label: 'فقط کاربران بدون نام' },
]

const filterTab = ref<FilterKey>('all')

// فیلتر نهایی بر اساس تب + جستجو
const filtered = computed(() => {
  let base = [...users.value]

  if (filterTab.value === 'named') {
    base = base.filter((u) => u.name && u.name.trim() !== '')
  } else if (filterTab.value === 'nameless') {
    base = base.filter((u) => !u.name || u.name.trim() === '')
  }

  if (q.value) {
    base = base.filter((u) => u.phone.includes(q.value))
  }

  return base
})

const totalUsers = computed(() => users.value.length)
const filteredCount = computed(() => filtered.value.length)
const namelessCount = computed(
    () => users.value.filter((u) => !u.name || u.name.trim() === '').length,
)

// حروف آواتار (اول نام، اگر نبود اول شماره)
const avatarInitial = (u: { name?: string; phone: string }) => {
  if (u.name && u.name.trim().length > 0) {
    return u.name.trim().charAt(0)
  }
  return u.phone.trim().charAt(0)
}
</script>

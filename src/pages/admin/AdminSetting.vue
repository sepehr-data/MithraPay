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

    <!-- ردیف: افزودن ادمین + تنظیمات کلی پنل -->
    <section class="grid gap-4 lg:grid-cols-2">
      <!-- افزودن ادمین -->
      <article class="rounded-2xl border border-base-300 bg-base-100 p-4 sm:p-5 space-y-4">
        <h3 class="font-semibold text-sm sm:text-base">
          افزودن ادمین
        </h3>

        <div class="space-y-3 text-xs sm:text-sm">
          <label class="form-control">
            <span class="label-text text-[11px] sm:text-xs">
              نام نمایشی
            </span>
            <input
                v-model="newAdminName"
                type="text"
                class="input input-bordered input-sm rounded-2xl text-[11px] w-full"
                placeholder="نامی که در پنل نمایش داده می‌شود"
            />
          </label>

          <label class="form-control">
            <span class="label-text text-[11px] sm:text-xs">
              شماره تلفن
            </span>
            <input
                v-model="newAdminPhone"
                type="tel"
                class="input input-bordered input-sm rounded-2xl text-[11px] w-full ltr text-left"
                placeholder="09xxxxxxxxx"
            />
          </label>
        </div>

        <!-- دکمه ثبت ادمین - راست‌چین -->
        <div class="flex justify-end pt-2 gap-2 text-[11px] sm:text-xs" dir="ltr">
          <button
              class="btn btn-sm btn-primary"
              type="button"
              @click="registerAdmin"
          >
            ثبت ادمین
          </button>
        </div>
      </article>

      <!-- تنظیمات کلی پنل (بدون دکمه، ذخیره خودکار) -->
      <article class="rounded-2xl border border-base-300 bg-base-100 p-4 sm:p-5 space-y-4">
        <h3 class="font-semibold text-sm sm:text-base">
          تنظیمات پنل
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
      </article>
    </section>

    <!-- لیست ادمین‌ها (همیشه نمایش داده می‌شود) -->
    <section class="rounded-3xl border border-base-300 bg-base-100 p-4 sm:p-5 space-y-4">
      <div class="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div class="space-y-1">
          <h3 class="font-semibold text-sm sm:text-base">
            لیست ادمین‌ها
          </h3>
        </div>
      </div>

      <!-- کارت‌های ادمین -->
      <div v-if="filteredAdmins.length" class="grid gap-3 sm:gap-4 md:grid-cols-2">
        <article
            v-for="a in filteredAdmins"
            :key="a.id"
            class="group rounded-2xl border border-base-300 bg-base-100/90 px-3.5 py-3 sm:px-4 sm:py-3.5 flex flex-col gap-2 hover:-translate-y-0.5 hover:shadow-md hover:border-primary/40 transition-all"
        >
          <!-- نمایش معمولی -->
          <div v-if="editingAdminId !== a.id" class="flex items-center justify-between gap-3">
            <div class="flex items-center gap-3">
              <div
                  class="h-9 w-9 rounded-full bg-gradient-to-br from-primary/90 to-secondary/80 text-primary-content flex items-center justify-center text-xs font-bold shadow-sm"
              >
                {{ a.name.charAt(0) || a.username.charAt(0) }}
              </div>
              <div class="flex flex-col gap-0.5">
                <span class="text-xs sm:text-sm font-medium text-base-content">
                  {{ a.name || 'بدون نام' }}
                </span>
                <span
                    class="text-[11px] sm:text-xs ltr font-mono bg-base-200/70 px-2 py-0.5 rounded-full"
                >
                  {{ a.username }}
                </span>
              </div>
            </div>

            <div class="flex flex-col items-end gap-1 text-[10px] sm:text-[11px]">
              <span
                  class="inline-flex items-center px-2 py-0.5 rounded-full"
                  :class="
                  a.role === 'owner'
                    ? 'bg-primary/10 text-primary'
                    : 'bg-base-200/80 text-base-content/80'
                "
              >
                {{ a.role === 'owner' ? 'Owner' : 'Admin' }}
              </span>
              <div class="flex gap-1" dir="ltr">
                <button
                    v-if="a.role !== 'owner'"
                    class="btn btn-xs btn-error"
                    type="button"
                    @click="removeAdmin(a.id)"
                >
                  حذف
                </button>
              </div>
            </div>
          </div>
        </article>
      </div>

      <div v-else class="py-8 text-center text-[11px] sm:text-xs text-base-content/60">
        هیچ ادمینی با این فیلتر پیدا نشد.
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive, watch } from 'vue'

type AdminRole = 'owner' | 'admin'

interface Admin {
  id: string
  name: string
  username: string
  role: AdminRole
  active: boolean
}

// دیتای نمونه ادمین‌ها
const admins = ref<Admin[]>([
  {
    id: 'a1',
    name: 'ادمین اصلی',
    username: 'main_admin',
    role: 'owner',
    active: true,
  },
  {
    id: 'a2',
    name: 'ادمین محتوا',
    username: 'content_admin',
    role: 'admin',
    active: true,
  },
])

// فرم افزودن ادمین (ساده: نام نمایشی + شماره تلفن)
const newAdminName = ref('')
const newAdminPhone = ref('')

function registerAdmin() {
  if (!newAdminName.value.trim() || !newAdminPhone.value.trim()) {
    alert('نام نمایشی و شماره تلفن الزامی است.')
    return
  }

  // فعلاً فقط نمونه: اینجا بعداً می‌تونی API بزنی
  alert('ادمین ثبت شد.')

  newAdminName.value = ''
  newAdminPhone.value = ''
}

// تنظیمات کلی پنل (با ذخیره‌ی خودکار)
const notifyTickets = ref(true)
const showTodayOrders = ref(true)
const compactTables = ref(false)

// آمار ادمین‌ها
const adminsCount = computed(() => admins.value.length)

// سرچ ادمین‌ها (الان استفاده نمی‌شه ولی نگه‌داشته شده برای آینده)
const adminSearch = ref('')

const filteredAdmins = computed(() => {
  const t = adminSearch.value.trim().toLowerCase()
  if (!t) return admins.value
  return admins.value.filter(
      a =>
          a.name.toLowerCase().includes(t) ||
          a.username.toLowerCase().includes(t),
  )
})

// ویرایش ادمین‌ها
const editingAdminId = ref<string | null>(null)
const editForm = reactive<{
  name: string
  username: string
  role: AdminRole
  password: string
}>({
  name: '',
  username: '',
  role: 'admin',
  password: '',
})

function startEdit(a: Admin) {
  editingAdminId.value = a.id
  editForm.name = a.name
  editForm.username = a.username
  editForm.role = a.role
  editForm.password = ''
}

function cancelEdit() {
  editingAdminId.value = null
}

function saveEdit() {
  if (!editingAdminId.value) return
  const target = admins.value.find(a => a.id === editingAdminId.value)
  if (!target) return

  target.name = editForm.name
  target.username = editForm.username
  target.role = editForm.role

  editingAdminId.value = null
  alert('تغییرات ادمین ذخیره شد.')
}

function removeAdmin(id: string) {
  const target = admins.value.find(a => a.id === id)
  if (!target) return
  if (target.role === 'owner') {
    alert('حذف Owner در این حالت مجاز نیست.')
    return
  }
  admins.value = admins.value.filter(a => a.id !== id)
}

// ذخیره خودکار تنظیمات پنل
function savePanelSettings() {
  console.log('panel settings changed', {
    notifyTickets: notifyTickets.value,
    showTodayOrders: showTodayOrders.value,
    compactTables: compactTables.value,
  })
}

watch([notifyTickets, showTodayOrders, compactTables], () => {
  savePanelSettings()
})
</script>

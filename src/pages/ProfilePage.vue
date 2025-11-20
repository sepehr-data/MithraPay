<template>
  <div class="min-h-screen bg-gradient-to-b from-base-200 via-base-200 to-base-300">
    <div class="max-w-6xl mx-auto px-4 py-8 space-y-6">
      <div class="grid gap-4 lg:grid-cols-[1.25fr_0.75fr]">
        <!-- Profile overview -->
        <section
          class="rounded-3xl border border-base-300/70 bg-base-100/80 shadow-xl backdrop-blur-sm"
        >
          <div class="flex flex-col gap-6 p-6">
            <div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div class="flex items-center gap-4">
                <div class="avatar placeholder">
                  <div class="w-16 rounded-2xl bg-gradient-to-br from-primary to-secondary text-primary-content shadow-lg">
                    <span class="text-lg">
                      {{ userInitial }}
                    </span>
                  </div>
                </div>

                <div>
                  <p class="text-sm opacity-70">خوش آمدید</p>
                  <h1 class="text-2xl font-bold leading-tight">{{ displayName }}</h1>
                  <p class="text-sm opacity-70 mt-1">{{ auth.user?.phone }}</p>
                </div>
              </div>

              <div class="grid w-full gap-3 rounded-2xl bg-base-200/60 p-4 text-sm md:w-auto md:grid-cols-3">
                <div class="rounded-xl bg-base-100 p-3 shadow-sm">
                  <p class="opacity-70">سفارش فعال</p>
                  <p class="text-lg font-semibold">{{ stats.activeOrders }}</p>
                </div>
                <div class="rounded-xl bg-base-100 p-3 shadow-sm">
                  <p class="opacity-70">تکمیل شده</p>
                  <p class="text-lg font-semibold">{{ stats.completedOrders }}</p>
                </div>
                <div class="rounded-xl bg-base-100 p-3 shadow-sm">
                  <p class="opacity-70">امتیاز وفاداری</p>
                  <p class="text-lg font-semibold">{{ stats.loyaltyPoints }}+</p>
                </div>
              </div>
            </div>

            <div class="grid gap-3 md:grid-cols-2">
              <div class="rounded-2xl border border-base-300/60 bg-base-100 p-4 shadow-sm">
                <div class="flex items-center justify-between gap-2">
                  <div>
                    <p class="text-sm opacity-70">پیگیری سفارش</p>
                    <p class="text-base font-semibold">سفارش‌های شما در دسترس هستند</p>
                  </div>
                  <span class="rounded-full bg-primary/10 px-3 py-1 text-xs text-primary">جدید</span>
                </div>
                <div class="mt-3 flex flex-wrap gap-2">
                  <RouterLink :to="{ name: 'orders' }" class="btn btn-sm btn-primary">مشاهده سفارش‌ها</RouterLink>
                  <button class="btn btn-sm btn-outline" @click="openEdit">ویرایش اطلاعات</button>
                </div>
              </div>

              <div class="rounded-2xl border border-base-300/60 bg-base-100 p-4 shadow-sm">
                <div class="flex items-center justify-between gap-2">
                  <div>
                    <p class="text-sm opacity-70">پشتیبانی</p>
                    <p class="text-base font-semibold">درخواست جدیدی ندارید</p>
                  </div>
                  <span class="rounded-full bg-secondary/10 px-3 py-1 text-xs text-secondary">0 تیکت</span>
                </div>
                <div class="mt-3 flex flex-wrap gap-2">
                  <RouterLink to="/support" class="btn btn-sm btn-outline">ارسال تیکت</RouterLink>
                  <button class="btn btn-sm btn-ghost" @click="logout">خروج از حساب</button>
                </div>
              </div>
            </div>

            <div class="rounded-2xl border border-dashed border-base-300/80 bg-base-100 p-4">
              <p class="text-sm font-semibold">گزارش وضعیت سفارش‌ها</p>
              <div class="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <div class="flex items-center justify-between rounded-xl bg-primary/10 px-4 py-3 text-primary">
                  <span>در انتظار پرداخت</span>
                  <span class="text-lg font-bold">{{ stats.pending }}</span>
                </div>
                <div class="flex items-center justify-between rounded-xl bg-warning/10 px-4 py-3 text-warning">
                  <span>در حال پردازش</span>
                  <span class="text-lg font-bold">{{ stats.processing }}</span>
                </div>
                <div class="flex items-center justify-between rounded-xl bg-info/10 px-4 py-3 text-info">
                  <span>در حال ارسال</span>
                  <span class="text-lg font-bold">{{ stats.shipping }}</span>
                </div>
                <div class="flex items-center justify-between rounded-xl bg-success/10 px-4 py-3 text-success">
                  <span>تحویل شده</span>
                  <span class="text-lg font-bold">{{ stats.delivered }}</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- Quick cards on the right -->
        <section class="space-y-4">
          <div class="rounded-3xl border border-base-300/70 bg-base-100/80 p-5 shadow-xl">
            <div class="flex items-center justify-between">
              <h2 class="text-lg font-semibold">آخرین وضعیت‌ها</h2>
              <span class="text-xs opacity-60">به‌روزرسانی روزانه</span>
            </div>
            <div class="mt-4 grid gap-3 sm:grid-cols-2">
              <div class="rounded-2xl bg-gradient-to-br from-base-200 to-base-300 p-4">
                <p class="text-sm opacity-70">پرداختی امروز</p>
                <p class="text-xl font-bold">{{ stats.todayPayments }} تومان</p>
                <p class="text-xs text-success mt-1">+{{ stats.growth }}% نسبت به دیروز</p>
              </div>
              <div class="rounded-2xl bg-gradient-to-br from-primary/10 to-secondary/10 p-4">
                <p class="text-sm opacity-70">امتیاز شما</p>
                <p class="text-xl font-bold">{{ stats.loyaltyPoints }}+</p>
                <p class="text-xs mt-1">با هر خرید امتیاز بیشتری بگیرید</p>
              </div>
              <div class="rounded-2xl bg-gradient-to-br from-warning/10 to-base-100 p-4">
                <p class="text-sm opacity-70">پیگیری مرجوعی</p>
                <p class="text-xl font-bold">0</p>
                <p class="text-xs mt-1">در حال حاضر درخواست مرجوعی ندارید</p>
              </div>
              <div class="rounded-2xl bg-gradient-to-br from-info/10 to-base-100 p-4">
                <p class="text-sm opacity-70">اعلان‌های جدید</p>
                <p class="text-xl font-bold">2</p>
                <p class="text-xs mt-1">پیشنهادها و یادآوری‌ها</p>
              </div>
            </div>
          </div>

          <div class="rounded-3xl border border-base-300/70 bg-base-100/80 p-5 shadow-xl">
            <div class="flex items-start justify-between gap-3">
              <div>
                <p class="text-sm opacity-70">بررسی سریع</p>
                <h3 class="text-lg font-semibold">آخرین سفارش‌ها</h3>
                <p class="text-sm opacity-70 mt-1">هیچ سفارش جدیدی ثبت نکرده‌اید</p>
              </div>
              <span class="rounded-full bg-base-200 px-3 py-1 text-xs">به‌روز</span>
            </div>
            <div class="mt-4 flex flex-wrap gap-2">
              <RouterLink :to="{ name: 'orders' }" class="btn btn-sm btn-outline">مشاهده تاریخچه</RouterLink>
              <RouterLink to="/support" class="btn btn-sm btn-ghost">راهنمایی می‌خواهم</RouterLink>
            </div>
          </div>
        </section>
      </div>

      <div class="grid gap-4 lg:grid-cols-[1.25fr_0.75fr]">
        <!-- Recommended products -->
        <section class="rounded-3xl border border-base-300/70 bg-base-100/80 p-6 shadow-xl">
          <div class="flex flex-wrap items-center gap-3">
            <div>
              <p class="text-sm opacity-70">پیشنهادات ویژه</p>
              <h2 class="text-xl font-semibold">برای شما انتخاب شده‌اند</h2>
            </div>
            <span class="rounded-full bg-primary/10 px-3 py-1 text-xs text-primary">خرید آسان</span>
          </div>

          <div class="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              <article
                v-for="product in recommendedProducts"
                :key="product.title"
                class="relative overflow-hidden rounded-2xl border border-base-300/60 bg-base-100 p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
              <div class="absolute inset-0 opacity-60" :class="product.bg"></div>
              <div class="relative z-10 flex flex-col gap-3">
                <div class="flex items-center justify-between">
                  <div class="rounded-xl bg-base-100/80 px-3 py-1 text-xs">{{ product.tag }}</div>
                  <span class="text-lg">{{ product.emoji }}</span>
                </div>
                <div>
                  <p class="text-sm opacity-80">{{ product.subtitle }}</p>
                  <h3 class="text-lg font-semibold">{{ product.title }}</h3>
                </div>
                <div class="flex items-center gap-2 text-sm">
                  <span class="badge badge-outline">امنیت پرداخت</span>
                  <span class="badge badge-outline">پشتیبانی</span>
                </div>
                <button class="btn btn-primary btn-sm w-full">مشاهده و خرید</button>
              </div>
            </article>
          </div>
        </section>

        <!-- Support & app -->
        <section class="space-y-4">
          <div class="rounded-3xl border border-base-300/70 bg-base-100/80 p-5 shadow-xl">
            <div class="flex items-start justify-between gap-3">
              <div>
                <p class="text-sm opacity-70">پشتیبانی سریع</p>
                <h3 class="text-lg font-semibold">هر زمان در کنار شما هستیم</h3>
                <p class="text-sm opacity-70 mt-1">
                  درخواست خود را ثبت کنید تا کارشناسان ما در کوتاه‌ترین زمان پاسخ دهند.
                </p>
              </div>
              <span class="rounded-full bg-success/10 px-3 py-1 text-xs text-success">آنلاین</span>
            </div>
            <div class="mt-4 flex flex-wrap gap-2">
              <RouterLink to="/support" class="btn btn-sm btn-primary">ثبت درخواست</RouterLink>
              <button class="btn btn-sm btn-outline" @click="openEdit">ویرایش پروفایل</button>
            </div>
          </div>

          <div class="rounded-3xl border border-base-300/70 bg-base-100/80 p-5 shadow-xl">
            <div class="flex items-start justify-between gap-3">
              <div>
                <p class="text-sm opacity-70">اپلیکیشن میتراپی</p>
                <h3 class="text-lg font-semibold">به‌زودی برای موبایل</h3>
                <p class="text-sm opacity-70 mt-1">با نصب نسخه موبایل، سفارش‌ها را سریع‌تر مدیریت کنید.</p>
              </div>
              <span class="rounded-full bg-base-200 px-3 py-1 text-xs">نسخه ۱.۰</span>
            </div>
            <div class="mt-4 grid gap-2 sm:grid-cols-2">
              <button class="btn btn-outline btn-sm w-full">دانلود برای اندروید</button>
              <button class="btn btn-outline btn-sm w-full">دانلود برای iOS</button>
            </div>
          </div>
        </section>
      </div>
    </div>

    <!-- EDIT PROFILE MODAL -->
    <dialog ref="editDialog" class="modal">
      <div class="modal-box w-full max-w-4xl text-right">
        <h3 class="mb-1 text-xl font-bold">ویرایش اطلاعات کاربری</h3>
        <p class="mb-4 text-xs opacity-70">در صورتی که مایل هستید پروفایل خود را تغییر دهید.</p>

        <form id="edit-profile-form" @submit.prevent="submitProfile" class="space-y-6">
          <div class="grid gap-4 md:grid-cols-2">
            <div>
              <label class="label">
                <span class="label-text">نام</span>
              </label>
              <input v-model="firstName" type="text" class="input input-bordered w-full" placeholder="نام" />
            </div>
            <div>
              <label class="label">
                <span class="label-text">نام خانوادگی</span>
              </label>
              <input v-model="lastName" type="text" class="input input-bordered w-full" placeholder="نام خانوادگی" />
            </div>
          </div>

          <div class="grid gap-4 md:grid-cols-2">
            <div>
              <label class="label">
                <span class="label-text">آدرس ایمیل</span>
              </label>
              <input
                v-model="email"
                type="email"
                class="input input-bordered w-full ltr-input"
                placeholder="example@email.com"
              />
            </div>
            <div>
              <label class="label">
                <span class="label-text">
                  تاریخ تولد
                  <span class="mr-1 text-xs text-error">(اختیاری)</span>
                </span>
              </label>
              <div class="birthday-picker-wrapper">
                <DatePicker
                  v-model="birthday"
                  class="w-full"
                  :input-props="{
                    class: 'input input-bordered w-full',
                    placeholder: 'انتخاب تاریخ'
                  }"
                />
              </div>
            </div>
          </div>

          <div class="divider"></div>

          <div class="grid gap-4 md:grid-cols-2">
            <div>
              <label class="label">
                <span class="label-text">
                  رمز عبور
                  <span class="mr-1 text-xs text-error">(اختیاری)</span>
                </span>
              </label>
              <label class="input input-bordered flex items-center gap-2">
                <input :type="showPassword ? 'text' : 'password'" v-model="password" class="grow" placeholder="********" />
                <button type="button" class="btn btn-ghost btn-xs" @click="showPassword = !showPassword">
                  👁
                </button>
              </label>
              <p class="mt-1 text-xs opacity-60">اگر مایل به تغییر پسورد خود هستید.</p>
            </div>

            <div>
              <label class="label">
                <span class="label-text">
                  تکرار رمز عبور
                  <span class="mr-1 text-xs text-error">(اختیاری)</span>
                </span>
              </label>
              <label class="input input-bordered flex items-center gap-2">
                <input
                  :type="showPasswordConfirm ? 'text' : 'password'"
                  v-model="passwordConfirm"
                  class="grow"
                  placeholder="********"
                />
                <button type="button" class="btn btn-ghost btn-xs" @click="showPasswordConfirm = !showPasswordConfirm">
                  👁
                </button>
              </label>
              <p class="mt-1 text-xs opacity-60">در صورت تمایل، لطفاً مجدد پسورد جدید را وارد کنید.</p>
            </div>
          </div>

          <div class="divider"></div>

          <div class="grid gap-4 md:grid-cols-2">
            <div class="space-y-1 rounded-2xl border border-base-300 p-4">
              <div class="flex items-center justify-between">
                <span class="text-sm font-semibold">تغییر شماره موبایل</span>
                <span class="text-lg">←</span>
              </div>
              <p class="mb-2 text-xs opacity-70">در صورتی که مایل به تغییر شماره موبایل خود هستید.</p>
              <input
                v-model="newPhone"
                type="text"
                class="input input-bordered w-full ltr-input"
                placeholder="09xxxxxxxxx"
              />
            </div>

            <div class="space-y-1 rounded-2xl border border-base-300 p-4">
              <div class="flex items-center justify-between">
                <span class="text-sm font-semibold">تغییر شماره شبا</span>
                <span class="text-lg">←</span>
              </div>
              <p class="mb-2 text-xs opacity-70">تنها در صورت عودت وجه، شماره شبا خود را وارد کنید.</p>
              <input
                v-model="sheba"
                type="text"
                class="input input-bordered w-full ltr-input"
                placeholder="IRxxxxxxxxxxxxxxxxxxxxxx"
              />
            </div>
          </div>
        </form>

        <div class="modal-action mt-4">
          <button type="button" class="btn btn-ghost" @click="closeEdit">لغو</button>
          <button type="submit" form="edit-profile-form" class="btn btn-primary">تایید</button>
        </div>
      </div>

      <form method="dialog" class="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import { http } from '@/services/http'

const auth = useAuthStore()
const router = useRouter()
const toast = useToast()

const userInitial = computed(() => {
  if (auth.user?.name) return auth.user.name.charAt(0)
  if (auth.user?.phone) return auth.user.phone.slice(-2)
  return '👤'
})

const displayName = computed(() => auth.user?.name || 'کاربر گرامی')

const stats = {
  activeOrders: 0,
  completedOrders: 12,
  loyaltyPoints: 48,
  pending: 0,
  processing: 0,
  shipping: 0,
  delivered: 12,
  todayPayments: 0,
  growth: 8
}

const recommendedProducts = [
  {
    title: 'ChatGPT5',
    subtitle: 'پرداخت خودکار و امن سرویس',
    tag: 'خدمات مخصوص شما',
    emoji: '🤖',
    bg: 'bg-gradient-to-br from-primary/10 via-base-200 to-secondary/10'
  },
  {
    title: 'CapCut',
    subtitle: 'پرداخت اشتراک و فعال‌سازی فوری',
    tag: 'بدون نیاز به حساب بانکی',
    emoji: '🎬',
    bg: 'bg-gradient-to-br from-secondary/10 via-base-100 to-primary/10'
  },
  {
    title: 'Duolingo',
    subtitle: 'یادگیری زبان بدون مرز',
    tag: 'پیشنهاد ویژه',
    emoji: '🦉',
    bg: 'bg-gradient-to-br from-info/10 via-base-100 to-base-200'
  },
  {
    title: 'Grammarly',
    subtitle: 'نوشتار حرفه‌ای با پرداخت امن',
    tag: 'اشتراک پریمیوم',
    emoji: '📝',
    bg: 'bg-gradient-to-br from-success/10 via-base-100 to-base-200'
  },
  {
    title: 'VPS Server',
    subtitle: 'سرور مجازی با پرداخت فوری',
    tag: 'تحویل سریع',
    emoji: '🖥️',
    bg: 'bg-gradient-to-br from-warning/10 via-base-100 to-base-200'
  },
  {
    title: 'Canva',
    subtitle: 'دسترسی به ابزارهای طراحی آنلاین',
    tag: 'پیشنهاد جدید',
    emoji: '🎨',
    bg: 'bg-gradient-to-br from-base-200 via-base-100 to-secondary/10'
  }
]

const editDialog = ref<HTMLDialogElement | null>(null)

const firstName = ref('')
const lastName = ref('')
const email = ref('')
const birthday = ref('')
const password = ref('')
const passwordConfirm = ref('')
const newPhone = ref('')
const sheba = ref('')

const showPassword = ref(false)
const showPasswordConfirm = ref(false)

onMounted(() => {
  if (auth.user) {
    firstName.value = auth.user.name || ''
    email.value = (auth.user as any).email || ''
    birthday.value = (auth.user as any).birthday || ''
    newPhone.value = auth.user.phone || ''
    sheba.value = (auth.user as any).sheba || ''
    lastName.value = (auth.user as any).lastName || ''
  }
})

function openEdit() {
  editDialog.value?.showModal()
}

function closeEdit() {
  editDialog.value?.close()
}

function logout() {
  auth.logout()
  toast.success('با موفقیت خارج شدید')
  router.push('/')
}

async function submitProfile() {
  if (password.value || passwordConfirm.value) {
    if (password.value !== passwordConfirm.value) {
      toast.error('رمز عبور و تکرار آن یکسان نیستند')
      return
    }
  }

  const payload: any = {
    name: firstName.value || null,
    last_name: lastName.value || null,
    email: email.value || null,
    birthday: birthday.value || null,
    phone: newPhone.value || null,
    sheba: sheba.value || null
  }

  if (password.value) {
    payload.password = password.value
  }

  try {
    const res = await http.put('/users/me', payload)

    auth.user = res.data.user
    localStorage.setItem('auth_user', JSON.stringify(auth.user))

    toast.success('اطلاعات شما با موفقیت به‌روزرسانی شد')
    closeEdit()
  } catch (e: any) {
    console.error(e)
    toast.error(e?.response?.data?.error || 'خطا در به‌روزرسانی پروفایل')
  }
}
</script>

<style scoped>
.ltr-input {
  direction: ltr;
  text-align: left;
}

.birthday-picker-wrapper :deep(*) {
  max-width: 100%;
}

.birthday-picker-wrapper :deep([style*='position: absolute']),
.birthday-picker-wrapper :deep(.menu),
.birthday-picker-wrapper :deep(.popover),
.birthday-picker-wrapper :deep(.dropdown),
.birthday-picker-wrapper :deep(.dp__menu),
.birthday-picker-wrapper :deep(.vpd-menu) {
  max-width: 100% !important;
  width: 100% !important;
  right: 0 !important;
  left: auto !important;
}
</style>

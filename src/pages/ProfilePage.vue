<template>
  <div class="max-w-4xl mx-auto px-4 py-6">
    <h1 class="text-2xl font-bold mb-6">پروفایل کاربری</h1>

    <div class="rounded-2xl border border-base-300 bg-base-100 p-6 shadow-md">
      <!-- HEADER -->
      <div class="flex items-center gap-4">
        <div class="avatar placeholder">
          <div class="bg-primary text-primary-content w-16 rounded-full">
            <span class="text-lg">
              {{ userInitial }}
            </span>
          </div>
        </div>

        <div class="flex-1">
          <h2 class="text-xl font-semibold">
            {{ auth.user?.name || 'کاربر گرامی' }}
          </h2>

          <p class="text-sm opacity-70 mt-1">
            شماره موبایل: {{ auth.user?.phone }}
          </p>
        </div>
      </div>

      <div class="divider my-6"></div>

      <!-- ACTIONS -->
      <div class="grid md:grid-cols-2 gap-4">
        <RouterLink
            :to="{ name: 'orders' }"
            class="btn btn-outline w-full justify-start"
        >
          مشاهده سفارش‌ها
        </RouterLink>

        <RouterLink
            to="/support"
            class="btn btn-outline w-full justify-start"
        >
          پشتیبانی و تیکت‌ها
        </RouterLink>

        <!-- EDIT PROFILE BUTTON (opens modal) -->
        <button
            class="btn btn-outline w-full justify-start"
            @click="openEdit"
        >
          ویرایش اطلاعات حساب
        </button>

        <button
            class="btn btn-error btn-outline w-full justify-start"
            @click="logout"
        >
          خروج از حساب
        </button>
      </div>
    </div>

    <!-- EDIT PROFILE MODAL -->
    <dialog ref="editDialog" class="modal">
      <div class="modal-box w-full max-w-4xl text-right">
      <h3 class="font-bold text-xl mb-1">ویرایش اطلاعات کاربری</h3>
        <p class="text-xs opacity-70 mb-4">
          در صورتی که مایل هستید پروفایل خود را تغییر دهید.
        </p>

        <form id="edit-profile-form" @submit.prevent="submitProfile" class="space-y-6">
          <!-- NAME ROW -->
          <div class="grid md:grid-cols-2 gap-4">
            <div>
              <label class="label">
                <span class="label-text">نام</span>
              </label>
              <input
                  v-model="firstName"
                  type="text"
                  class="input input-bordered w-full"
                  placeholder="نام"
              />
            </div>
            <div>
              <label class="label">
                <span class="label-text">نام خانوادگی</span>
              </label>
              <input
                  v-model="lastName"
                  type="text"
                  class="input input-bordered w-full"
                  placeholder="نام خانوادگی"
              />
            </div>
          </div>

          <!-- EMAIL + BIRTHDATE -->
          <div class="grid md:grid-cols-2 gap-4">
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
      <span class="text-xs text-error mr-1">(اختیاری)</span>
    </span>
              </label>

              <!-- wrap DatePicker in a container -->
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

          <!-- PASSWORD ROW -->
          <div class="grid md:grid-cols-2 gap-4">
            <div>
              <label class="label">
                <span class="label-text">
                  رمز عبور
                  <span class="text-xs text-error mr-1">(اختیاری)</span>
                </span>
              </label>
              <label class="input input-bordered flex items-center gap-2">
                <input
                    :type="showPassword ? 'text' : 'password'"
                    v-model="password"
                    class="grow"
                    placeholder="********"
                />
                <button
                    type="button"
                    class="btn btn-ghost btn-xs"
                    @click="showPassword = !showPassword"
                >
                  👁
                </button>
              </label>
              <p class="text-xs mt-1 opacity-60">
                اگر مایل به تغییر پسورد خود هستید.
              </p>
            </div>

            <div>
              <label class="label">
                <span class="label-text">
                  تکرار رمز عبور
                  <span class="text-xs text-error mr-1">(اختیاری)</span>
                </span>
              </label>
              <label class="input input-bordered flex items-center gap-2">
                <input
                    :type="showPasswordConfirm ? 'text' : 'password'"
                    v-model="passwordConfirm"
                    class="grow"
                    placeholder="********"
                />
                <button
                    type="button"
                    class="btn btn-ghost btn-xs"
                    @click="showPasswordConfirm = !showPasswordConfirm"
                >
                  👁
                </button>
              </label>
              <p class="text-xs mt-1 opacity-60">
                در صورت تمایل، لطفاً مجدد پسورد جدید را وارد کنید.
              </p>
            </div>
          </div>

          <div class="divider"></div>

          <!-- PHONE + SHEBA -->
          <div class="grid md:grid-cols-2 gap-4">
            <div class="rounded-2xl border border-base-300 p-4 space-y-1">
              <div class="flex items-center justify-between">
                <span class="font-semibold text-sm">تغییر شماره موبایل</span>
                <span class="text-lg">←</span>
              </div>
              <p class="text-xs opacity-70 mb-2">
                در صورتی که مایل به تغییر شماره موبایل خود هستید.
              </p>
              <input
                  v-model="newPhone"
                  type="text"
                  class="input input-bordered w-full ltr-input"
                  placeholder="09xxxxxxxxx"
              />
            </div>

            <div class="rounded-2xl border border-base-300 p-4 space-y-1">
              <div class="flex items-center justify-between">
                <span class="font-semibold text-sm">تغییر شماره شبا</span>
                <span class="text-lg">←</span>
              </div>
              <p class="text-xs opacity-70 mb-2">
                تنها در صورت عودت وجه، شماره شبا خود را وارد کنید.
              </p>
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
          <button type="button" class="btn btn-ghost" @click="closeEdit">
            لغو
          </button>
          <button type="submit" form="edit-profile-form" class="btn btn-primary">
            تایید
          </button>
        </div>
      </div>

      <!-- backdrop -->
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

// avatar initial
const userInitial = computed(() => {
  if (auth.user?.name) return auth.user.name.charAt(0)
  if (auth.user?.phone) return auth.user.phone.slice(-2)
  return '👤'
})

// modal ref
const editDialog = ref<HTMLDialogElement | null>(null)

// form state
const firstName = ref('')
const lastName = ref('')
const email = ref('')
const birthday = ref('')
const password = ref('')
const passwordConfirm = ref('')
const newPhone = ref('')
const sheba = ref('')

// password visibility
const showPassword = ref(false)
const showPasswordConfirm = ref(false)

onMounted(() => {
  // pre-fill from current user, if available
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
  // simple front-end validation
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
    birthday: birthday.value || null,   // Jalali string, stored as-is
    phone: newPhone.value || null,
    sheba: sheba.value || null
  }

  if (password.value) {
    payload.password = password.value
  }

  try {
    const res = await http.put('/users/me', payload)

    // backend returns { message, user }
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

/* --- Generic clamp for ANY popup inside the birthday picker wrapper --- */

/* Make the root of the datepicker full width */
.birthday-picker-wrapper :deep(*) {
  max-width: 100%;
}

/* If the library uses an absolutely-positioned menu/popup,
   this will clamp it to the wrapper and align it with the input (RTL) */
.birthday-picker-wrapper :deep([style*="position: absolute"]),
.birthday-picker-wrapper :deep(.menu),
.birthday-picker-wrapper :deep(.popover),
.birthday-picker-wrapper :deep(.dropdown),
.birthday-picker-wrapper :deep(.dp__menu),
.birthday-picker-wrapper :deep(.vpd-menu) {
  max-width: 100% !important;
  width: 100% !important;
  right: 0 !important;  /* RTL align with input */
  left: auto !important;
}

</style>

<template>
  <div class="bg-base-200 min-h-screen pb-16">
    <div class="max-w-5xl mx-auto px-4 lg:px-0 pt-8 space-y-8">

      <!-- hero / info -->
      <section
          class="bg-base-100 border border-base-300 rounded-3xl px-6 py-7 lg:px-10 lg:py-8 text-right space-y-3"
      >
        <p class="text-sm text-primary/80 font-medium">پشتیبانی</p>
        <h1 class="text-2xl font-extrabold leading-relaxed">
          چطور می‌تونیم کمک‌تون کنیم؟
        </h1>
        <p class="text-sm text-base-content/70 leading-6">
          اگر در سفارش، فعال‌سازی اکانت یا پرداخت شبیه‌سازی‌شده مشکلی دیدید، از یکی از روش‌های زیر پیام بدید.
          معمولاً سریع‌ترین راه تلگرامه 👇
        </p>
      </section>

      <!-- contact methods -->
      <section class="grid gap-5 md:grid-cols-3">
        <!-- telegram -->
        <div class="bg-base-100 border border-base-300 rounded-2xl p-5 text-right space-y-2">
          <div class="flex items-center justify-between gap-3">
            <h2 class="font-semibold">تلگرام</h2>
            <span class="badge badge-primary badge-sm">پیشنهادی</span>
          </div>
          <p class="text-xs text-base-content/60">
            پیام بدید و شماره سفارش رو بفرستید.
          </p>
          <a href="https://t.me/accountplus" class="link text-sm block text-left md:text-right">
            @accountplus
          </a>
        </div>

        <!-- email -->
        <div class="bg-base-100 border border-base-300 rounded-2xl p-5 text-right space-y-2">
          <h2 class="font-semibold">ایمیل</h2>
          <p class="text-xs text-base-content/60">
            مناسب ارسال اسکرین‌شات یا توضیح طولانی.
          </p>
          <a href="mailto:support@example.com" class="link text-sm block text-left md:text-right">
            support@example.com
          </a>
        </div>

        <!-- phone -->
        <div class="bg-base-100 border border-base-300 rounded-2xl p-5 text-right space-y-2">
          <h2 class="font-semibold">تلفن</h2>
          <p class="text-xs text-base-content/60">
            ساعات اداری
          </p>
          <p class="text-sm font-mono ltr text-left md:text-right">
            0000 000 0900
          </p>
        </div>
      </section>

      <!-- small faq -->
      <section class="bg-base-100 border border-base-300 rounded-2xl p-6 text-right space-y-3">
        <h2 class="text-lg font-bold">قبل از ارسال تیکت 👇</h2>
        <ul class="space-y-2 text-sm text-base-content/70 leading-6">
          <li>• اگر محصول دیجیتال است، تحویل از داخل پنل یا ایمیل انجام می‌شود.</li>
          <li>• اگر پرداخت تست بود و تراکنش ثبت نشد، نیازی به واریز نیست.</li>
          <li>• اگر اکانت فعال نشد، شناسه محصول و زمان خرید را بفرستید.</li>
        </ul>
      </section>

      <!-- support form -->
      <section class="bg-base-100 border border-base-300 rounded-2xl p-6 text-right space-y-4">
        <h2 class="text-lg font-bold">ارسال درخواست پشتیبانی</h2>
        <p class="text-xs text-base-content/60">
          فرم زیر را پر کنید؛ ما از طریق ایمیل یا تلگرام با شما تماس می‌گیریم.
        </p>
        <form class="grid gap-4 md:grid-cols-2" @submit.prevent="submitForm">
          <label class="form-control">
            <span class="label-text mb-1">نام و نام خانوادگی</span>
            <input v-model="form.name" type="text" class="input input-bordered" placeholder="مثلاً سروش رحیمی" required>
          </label>
          <label class="form-control">
            <span class="label-text mb-1">شماره موبایل</span>
            <input v-model="form.phone" type="tel" class="input input-bordered" placeholder="0912xxxxxxx" required>
          </label>
          <label class="form-control md:col-span-2">
            <span class="label-text mb-1">موضوع</span>
            <input v-model="form.subject" type="text" class="input input-bordered" placeholder="مشکل در فعالسازی اپل موزیک">
          </label>
          <label class="form-control md:col-span-2">
            <span class="label-text mb-1">توضیحات</span>
            <textarea v-model="form.message" rows="4" class="textarea textarea-bordered" placeholder="توضیح دهید چه مشکلی پیش آمده است..." required></textarea>
          </label>
          <div class="md:col-span-2 flex justify-end">
            <button class="btn btn-primary" type="submit">
              ارسال درخواست
            </button>
          </div>
        </form>
        <p v-if="sent" class="text-xs text-success mt-2 text-right">
          درخواست شما ثبت شد. در اولین فرصت تماس می‌گیریم.
        </p>
      </section>

    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'

const form = reactive({
  name: '',
  phone: '',
  subject: '',
  message: ''
})

const sent = ref(false)

function submitForm() {
  // here you can POST to your API
  sent.value = true
  // simple reset
  // Object.assign(form, { name: '', phone: '', subject: '', message: '' })
}
</script>

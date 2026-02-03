<template>
  <section
      id="contact"
      class="relative py-14 lg:py-20 overflow-hidden"
      dir="rtl"
  >
    <!-- پس‌زمینه دکوراتیو -->
    <div
        class="pointer-events-none absolute inset-0 opacity-70"
        aria-hidden="true"
    >
      <div
          class="absolute -left-24 top-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl"
      ></div>
      <div
          class="absolute -right-16 bottom-0 w-72 h-72 bg-secondary/10 rounded-full blur-3xl"
      ></div>
      <div
          class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[420px] h-[420px] border border-base-300/60 rounded-full opacity-40"
      ></div>
    </div>

    <div class="max-w-6xl mx-auto px-4 lg:px-0 relative z-10 space-y-10">
      <!-- هدر بالا -->
      <div class="flex flex-col items-center text-center gap-3">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-base-100/70 border border-base-200 shadow-sm">
          <span class="w-2 h-2 rounded-full bg-success animate-pulse"></span>
          <span class="text-[11px] text-base-content/70">
            پشتیبانی فعال • جواب‌گویی در کمتر از ۸ ساعت
          </span>
        </div>

        <h2 class="text-2xl md:text-3xl font-extrabold tracking-tight">
          یک پیام کوتاه تا حل شدن سوال‌تان
        </h2>
        <p class="max-w-2xl text-sm md:text-[15px] text-base-content/70">
          در مورد خرید، فعال‌سازی اشتراک، یا حتی قبل از ثبت سفارش سوالی دارید؟
          فرم زیر را پر کنید تا تیم سپهر باکس به‌صورت اختصاصی راهنمایتان کند.
        </p>
      </div>

      <!-- گرید اصلی -->
      <div
          class="grid gap-6 lg:gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] items-start"
      >
        <!-- کارت فرم -->
        <div
            class="card glass bg-base-100/90 border border-base-200/80 shadow-xl shadow-base-300/40"
        >
          <div class="card-body space-y-5">
            <div class="flex items-center justify-between gap-3">
              <div class="space-y-1 text-right">
                <h3 class="text-lg md:text-xl font-bold">
                  فرم ارتباط با پشتیبانی
                </h3>
              </div>
              <div
                  class="hidden sm:flex flex-col items-center justify-center px-2 py-1 rounded-xl bg-base-200/80 text-[11px] text-base-content/70"
              >
                <span>میانگین پاسخ‌گویی</span>
                <span class="font-semibold text-primary">کمتر از ۸ ساعت</span>
              </div>
            </div>

            <form class="space-y-4" @submit.prevent="handleSubmit">
              <!-- ردیف نام و ایمیل -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label class="form-control w-full">
                  <div class="label">
                    <span class="label-text text-xs md:text-sm">
                      نام و نام‌خانوادگی
                    </span>
                    <span
                        class="label-text-alt text-error text-[11px]"
                        v-if="errors.name"
                    >
                      {{ errors.name }}
                    </span>
                  </div>
                  <input
                      v-model="form.name"
                      type="text"
                      class="input input-bordered w-full input-sm md:input-md"
                      placeholder="مثلاً: امیر رضایی"
                  />
                </label>

                <label class="form-control w-full">
                  <div class="label">
                    <span class="label-text text-xs md:text-sm">ایمیل</span>
                    <span
                        class="label-text-alt text-error text-[11px]"
                        v-if="errors.email"
                    >
                      {{ errors.email }}
                    </span>
                  </div>
                  <input
                      v-model="form.email"
                      type="email"
                      class="input input-bordered w-full input-sm md:input-md ltr:!text-left"
                      placeholder="you@example.com"
                  />
                </label>
              </div>

              <!-- شماره سفارش + شماره تلفن -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">

                <label class="form-control w-full">
                  <div class="label">
                    <span class="label-text text-xs md:text-sm">
                      شماره تلفن
                    </span>
                  </div>
                  <input
                      v-model="form.phone"
                      type="tel"
                      class="input input-bordered input-sm md:input-md ltr:!text-left"
                      placeholder="09xxxxxxxxx"
                  />
                </label>

                <label class="form-control w-full">
                  <div class="label">
                    <span class="label-text text-xs md:text-sm">
                      شماره سفارش (اختیاری)
                    </span>
                  </div>
                  <input
                      v-model="form.orderNumber"
                      type="text"
                      class="input input-bordered input-sm md:input-md ltr:!text-left"
                      placeholder="مثلاً: 123456"
                  />
                </label>
              </div>
              <!-- موضوع پیام -->
              <label class="form-control">
                <div class="label">
                  <span class="label-text text-xs md:text-sm">
                    موضوع پیام
                  </span>
                  <span
                      v-if="errors.subject"
                      class="label-text-alt text-error text-[11px]"
                  >
                    {{ errors.subject }}
                  </span>
                </div>

                <div class="grid grid-cols-2 md:grid-cols-4 gap-2 text-[11px] md:text-xs">
                  <button
                      type="button"
                      class="btn btn-xs md:btn-sm rounded-full justify-center"
                      :class="form.subject === 'order' ? 'btn-primary' : 'btn-outline'"
                      @click="form.subject = 'order'"
                  >
                    سفارش / خرید
                  </button>

                  <button
                      type="button"
                      class="btn btn-xs md:btn-sm rounded-full justify-center"
                      :class="form.subject === 'activation' ? 'btn-primary' : 'btn-outline'"
                      @click="form.subject = 'activation'"
                  >
                    فعال‌سازی
                  </button>

                  <button
                      type="button"
                      class="btn btn-xs md:btn-sm rounded-full justify-center"
                      :class="form.subject === 'billing' ? 'btn-primary' : 'btn-outline'"
                      @click="form.subject = 'billing'"
                  >
                    پرداخت / مالی
                  </button>

                  <button
                      type="button"
                      class="btn btn-xs md:btn-sm rounded-full justify-center"
                      :class="form.subject === 'other' ? 'btn-primary' : 'btn-outline'"
                      @click="form.subject = 'other'"
                  >
                    سایر موارد
                  </button>
                </div>
              </label>

              <!-- پیام -->
              <label class="form-control">
                <div class="label">
                  <span class="label-text text-xs md:text-sm">متن پیام</span>
                  <span
                      class="label-text-alt text-error text-[11px]"
                      v-if="errors.message"
                  >
                    {{ errors.message }}
                  </span>
                </div>
                <textarea
                    v-model="form.message"
                    class="textarea textarea-bordered min-h-[130px] md:min-h-[130px] text-sm"
                    placeholder="لطفاً مشکل یا سوال خود را با جزئیات بنویسید."
                ></textarea>
              </label>

              <!-- ردیف نهایی: چک‌باکس قوانین + دکمه ارسال -->
              <div
                  class="flex flex-col md:flex-row md:items-center gap-3 pt-2"
              >
                <button
                    class="btn btn-primary w-full md:w-auto rounded-full px-8"
                    type="submit"
                    :disabled="isSubmitting"
                >
                  <span v-if="!isSubmitting" class="flex items-center gap-2">
                    <span>ارسال پیام</span>
                    <span class="text-lg leading-none">➜</span>
                  </span>
                  <span v-else class="flex items-center gap-2">
                    <span
                        class="loading loading-spinner loading-sm"
                    ></span>
                    <span>در حال ارسال...</span>
                  </span>
                </button>
                <!-- چک‌باکس قوانین کنار دکمه -->
                <label
                    class="flex items-start gap-2 text-[11px] md:text-xs cursor-pointer bg-base-200/60 rounded-xl px-3 py-2 border border-base-300/70 md:mr-auto"
                >
                  <input
                      v-model="form.acceptPolicy"
                      type="checkbox"
                      class="checkbox checkbox-xs mt-0.5"
                  />
                  <span class="leading-relaxed text-base-content/70">
                    تأیید می‌کنم
                    <button
                        type="button"
                        class="link link-primary link-hover text-[11px]"
                    >
                      قوانین و حریم خصوصی سایت
                    </button>
                    را مطالعه کرده‌ام و با آن موافقم.
                  </span>
                </label>

              </div>
            </form>
          </div>
        </div>

        <!-- ستون اطلاعات تماس / هایلایت‌ها -->
        <div class="space-y-4 lg:space-y-4">
          <!-- کارت اصلی اطلاعات (کمی کامپکت‌تر) -->
          <div
              class="card bg-base-100/95 border border-base-200 shadow-lg shadow-base-300/30"
          >
            <div class="card-body space-y-3 py-4">
              <h3 class="card-title text-base md:text-lg justify-between">
                راه‌های ارتباط مستقیم
                <span
                    class="badge badge-success badge-outline text-[10px] md:text-[11px]"
                >
                  پشتیبانی ۲۴ ساعته
                </span>
              </h3>

              <div class="space-y-3 text-sm">
                <div class="flex items-center gap-3">
                  <div
                      class="w-9 h-9 rounded-2xl bg-primary/10 flex items-center justify-center"
                  >
                    📩
                  </div>
                  <div class="flex flex-col gap-0.5">
                    <span class="text-[11px] text-base-content/60">
                      ایمیل پشتیبانی
                    </span>
                    <a
                        href="mailto:support@mithrapay.ir"
                        class="link link-hover text-xs md:text-sm ltr:!text-left"
                    >
                      support@sepehrbox.ir
                    </a>
                  </div>
                </div>

                <div class="flex items-center gap-3">
                  <div
                      class="w-9 h-9 rounded-2xl bg-secondary/10 flex items-center justify-center"
                  >
                    📞
                  </div>
                  <div class="flex flex-col gap-0.5">
                    <span class="text-[11px] text-base-content/60">
                      تماس تلفنی
                    </span>
                    <span class="text-xs md:text-sm ltr:!text-left">
                      021xxxxxxx
                    </span>
                  </div>
                </div>

                <div class="flex items-center gap-3">
                  <div
                      class="w-9 h-9 rounded-2xl bg-accent/10 flex items-center justify-center"
                  >
                    💬
                  </div>
                  <div class="flex flex-col gap-0.5">
                    <span class="text-[11px] text-base-content/60">
                      پشتیبانی واتساپ
                    </span>
                    <span class="text-xs md:text-sm ltr:!text-left">
                      09xxxxxxxxx
                    </span>
                  </div>
                </div>
              </div>

              <div class="divider my-2"></div>

              <div
                  class="grid grid-cols-2 gap-3 text-[11px] md:text-xs text-base-content/70"
              >
                <div class="space-y-1">
                  <p class="font-semibold text-sm">ساعات پاسخ‌گویی</p>
                  <p>هر روز، ۲۴ ساعته</p>
                </div>
                <div class="space-y-1">
                  <p class="font-semibold text-sm">وضعیت فعلی پشتیبانی</p>
                  <p class="flex items-center gap-1">
                    <span
                        class="w-2 h-2 rounded-full bg-success animate-pulse"
                    ></span>
                    آنلاین
                  </p>
                </div>
              </div>

              <div class="alert alert-info mt-1 text-[11px] md:text-xs">
                <span>
                  برای پیگیری سفارش، لطفاً «شماره سفارش» را حتماً در متن پیام
                  بنویسید تا سریع‌تر بررسی شود.
                </span>
              </div>
            </div>
          </div>

          <!-- کارت نکته / FAQ کوچک (برگشت داده شد) -->
          <div
              class="card bg-gradient-to-l from-primary/10 via-base-100 to-base-100 border border-primary/20"
          >
            <div class="card-body py-3.5 px-4 space-y-1.5">
              <p class="text-xs md:text-sm font-semibold">
                نمی‌دانید دقیقاً چه بنویسید؟
              </p>
              <p class="text-[11px] md:text-xs text-base-content/70 leading-relaxed">
                فقط برای ما بنویسید چه چیزی می‌خواهید انجام دهید
                (مثلاً «تمدید اپل موزیک»، «انتقال اشتراک»، «رفع ارور آیکلاد»)؛
                تیم پشتیبانی خودشان مرحله‌به‌مرحله راهنمایتان می‌کنند چه
                اطلاعات دیگری لازم است.
              </p>
            </div>
          </div>

          <!-- گرید آمار اعتماد هنوز حذف است (طبق درخواست قبلی) -->
        </div>
      </div>
    </div>
  </section>
  <!-- Success Alert (Minimal & Custom) -->
  <transition name="fade">
    <div
        v-if="showSuccessAlert"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4"
    >
      <div
          class="card bg-base-100 w-full max-w-sm shadow-2xl border border-base-200"
      >
        <div class="card-body text-center space-y-4">
          <div
              class="mx-auto w-12 h-12 rounded-full bg-success/10 flex items-center justify-center text-2xl"
          >
            ✅
          </div>

          <h3 class="text-base font-bold">
            پیام با موفقیت ارسال شد
          </h3>

          <p class="text-sm text-base-content/70 leading-relaxed">
            پیام شما با موفقیت ثبت شد 🌱
            تیم پشتیبانی به‌زودی با شما تماس می‌گیرد.
          </p>

          <button
              class="btn btn-success btn-sm rounded-full px-8 mx-auto"
              @click="showSuccessAlert = false"
          >
            متوجه شدم
          </button>
        </div>
      </div>
    </div>
  </transition>
  <!-- Policy Warning Alert -->
  <transition name="fade">
    <div
        v-if="showPolicyAlert"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4"
    >
      <div
          class="card bg-base-100 w-full max-w-sm shadow-2xl border border-warning/30"
      >
        <div class="card-body text-center space-y-4">
          <div
              class="mx-auto w-12 h-12 rounded-full bg-warning/15 flex items-center justify-center text-2xl"
          >
            ⚠️
          </div>

          <h3 class="text-base font-bold">
            نیاز به تأیید قوانین
          </h3>

          <p class="text-sm text-base-content/70 leading-relaxed">
            برای ارسال پیام، لطفاً
            <span class="font-medium text-base-content">
            قوانین و حریم خصوصی
          </span>
            سایت را مطالعه کرده و با آن موافقت کنید.
          </p>

          <button
              class="btn btn-warning btn-sm rounded-full px-8 mx-auto"
              @click="showPolicyAlert = false"
          >
            متوجه شدم
          </button>
        </div>
      </div>
    </div>
  </transition>


</template>

<script setup lang="ts">
import { reactive, ref } from "vue";
import { createTicket } from "@/services/ticket.ts";

const showSuccessAlert = ref(false);
const showPolicyAlert = ref(false);


type SubjectType =
    | "order"
    | "activation"
    | "billing"
    | "partnership"
    | "other"
    | "";

interface ContactForm {
  name: string;
  email: string;
  subject: SubjectType;
  message: string;
  phone: string;
  orderNumber?: string;
  acceptPolicy: boolean;
}

interface ContactErrors {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
}

const form = reactive<ContactForm>({
  name: "",
  email: "",
  subject: "",
  message: "",
  phone: "",
  orderNumber: undefined,
  acceptPolicy: false,
});

const errors = reactive<ContactErrors>({});
const isSubmitting = ref(false);

const validate = () => {
  errors.name = !form.name.trim() ? "نام را وارد کنید" : undefined;
  errors.email = !form.email.trim()
      ? "ایمیل را وارد کنید"
      : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)
          ? "ایمیل معتبر نیست"
          : undefined;
  errors.subject = !form.subject ? "موضوع را انتخاب کنید" : undefined;
  errors.message =
      form.message.trim().length < 10
          ? "لطفاً حداقل ۱۰ کاراکتر بنویسید"
          : undefined;

  return !errors.name && !errors.email && !errors.subject && !errors.message;
};

const resetForm = () => {
  form.name = "";
  form.email = "";
  form.subject = "";
  form.message = "";
  form.phone = "";
  form.orderNumber = undefined;
  form.acceptPolicy = false;
};

const handleSubmit = async () => {
  if (!validate()) return;

  if (!form.acceptPolicy) {
    showPolicyAlert.value = true;
    return;
  }

  try {
    isSubmitting.value = true;

    await createTicket({
      name: form.name,
      email: form.email,
      subject: form.subject,
      message: form.message,
      phone: form.phone,
      orderNumber: form.orderNumber,
      acceptPolicy: form.acceptPolicy,
    });

    showSuccessAlert.value = true;

    resetForm();
  } catch (error: any) {
    console.error(error);
    alert(
        error?.response?.data?.error ||
        "در ارسال پیام خطایی رخ داد؛ لطفاً دوباره تلاش کنید."
    );
  } finally {
    isSubmitting.value = false;
  }
};
</script>
<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>

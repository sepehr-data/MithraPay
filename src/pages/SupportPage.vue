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
            پشتیبانی فعال • جواب‌گویی در کمتر از ۲۴ ساعت
          </span>
        </div>

        <h2 class="text-2xl md:text-3xl font-extrabold tracking-tight">
          یک پیام کوتاه تا حل شدن سوال‌تان
        </h2>
        <p class="max-w-2xl text-sm md:text-[15px] text-base-content/70">
          در مورد خرید، فعال‌سازی اشتراک، یا حتی قبل از ثبت سفارش سوالی دارید؟
          فرم زیر را پر کنید تا تیم میتراپی به‌صورت اختصاصی راهنمایتان کند.
        </p>
      </div>

      <!-- گرید اصلی -->
      <div
          class="grid gap-6 lg:gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] items-start"
      >
        <!-- کارت فرم (glass) -->
        <div
            class="card glass bg-base-100/90 border border-base-200/80 shadow-xl shadow-base-300/40"
        >
          <div class="card-body space-y-5">
            <!-- تیتر کارت + چپ: کوچیک -->
            <div class="flex items-center justify-between gap-3">
              <div class="space-y-1 text-right">
                <h3 class="text-lg md:text-xl font-bold">
                  فرم ارتباط با پشتیبانی
                </h3>
                <p class="text-xs text-base-content/60">
                  اطلاعات تماس‌تان را کامل وارد کنید تا سریع‌تر پاسخ بگیرید.
                </p>
              </div>
              <div
                  class="hidden sm:flex flex-col items-center justify-center px-2 py-1 rounded-xl bg-base-200/80 text-[11px] text-base-content/70"
              >
                <span>میانگین پاسخ‌گویی</span>
                <span class="font-semibold text-primary">کمتر از ۲۴ ساعت</span>
              </div>
            </div>

            <form class="space-y-4" @submit.prevent="handleSubmit">
              <!-- ردیف اول -->
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
              <!-- ✅ موضوع پیام (یک سطر کامل) -->
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

              <!-- ✅ شماره تماس (زیر موضوع) -->
              <label class="form-control">
                <div class="label">
    <span class="label-text text-xs md:text-sm">
      شماره سفارش (اختیاری)
    </span>
                  <span class="label-text-alt text-[11px] text-base-content/50">
      برای پیگیری سریع‌تر پیشنهاد می‌شود وارد کنید
    </span>
                </div>
                <input
                    v-model="form.phone"
                    type="tel"
                    class="input input-bordered input-sm md:input-md ltr:!text-left"
                    placeholder="123XXXXXXX"
                />
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
                    class="textarea textarea-bordered min-h-[130px] md:min-h-[150px] text-sm"
                    placeholder="لطفاً مشکل یا سوال خود را با جزئیات بنویسید."
                ></textarea>
              </label>

              <!-- کانال ترجیحی -->
              <div class="grid grid-cols-1 md:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)] gap-4 items-center">
                <div class="form-control">
                  <div class="label">
                    <span class="label-text text-xs md:text-sm">
                      روش ترجیحی ارتباط
                    </span>
                  </div>
                  <div class="join join-vertical md:join-horizontal w-full">
                    <button
                        type="button"
                        class="btn btn-sm md:btn-xs lg:btn-sm join-item justify-center"
                        :class="{
                        'btn-primary btn-active':
                          form.preferredChannel === 'email',
                        'btn-ghost':
                          form.preferredChannel !== 'email',
                      }"
                        @click="form.preferredChannel = 'email'"
                    >
                      ایمیل
                    </button>
                    <button
                        type="button"
                        class="btn btn-sm md:btn-xs lg:btn-sm join-item justify-center"
                        :class="{
                        'btn-primary btn-active':
                          form.preferredChannel === 'phone',
                        'btn-ghost':
                          form.preferredChannel !== 'phone',
                      }"
                        @click="form.preferredChannel = 'phone'"
                    >
                      تماس تلفنی
                    </button>
                    <button
                        type="button"
                        class="btn btn-sm md:btn-xs lg:btn-sm join-item justify-center"
                        :class="{
                        'btn-primary btn-active':
                          form.preferredChannel === 'whatsapp',
                        'btn-ghost':
                          form.preferredChannel !== 'whatsapp',
                      }"
                        @click="form.preferredChannel = 'whatsapp'"
                    >
                      واتساپ
                    </button>
                  </div>
                </div>

                <!-- چک‌باکس قوانین -->
                <label
                    class="flex items-start gap-2 text-[11px] md:text-xs cursor-pointer bg-base-200/60 rounded-xl px-3 py-2 border border-base-300/70"
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

              <!-- دکمه + نکته -->
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

                <p
                    class="text-[11px] md:text-xs text-base-content/60 md:mr-auto"
                >
                  در ساعات شلوغی، ممکن است پاسخ‌گویی کمی بیشتر طول بکشد؛ اما هیچ
                  پیامی بی‌جواب نمی‌ماند ✨
                </p>
              </div>
            </form>
          </div>
        </div>

        <!-- ستون اطلاعات تماس / هایلایت‌ها -->
        <div class="space-y-4 lg:space-y-5">
          <!-- کارت اصلی اطلاعات -->
          <div
              class="card bg-base-100/95 border border-base-200 shadow-lg shadow-base-300/30"
          >
            <div class="card-body space-y-4">
              <h3 class="card-title text-base md:text-lg justify-between">
                راه‌های ارتباط مستقیم
                <span
                    class="badge badge-success badge-outline text-[10px] md:text-[11px]"
                >
                  پاسخ از ۹ صبح تا ۹ شب
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
                      support@mithrapay.ir
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
                      021-xxxxxxx
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
                      09xx xxx xxxx
                    </span>
                  </div>
                </div>
              </div>

              <div class="divider my-3"></div>

              <div
                  class="grid grid-cols-2 gap-3 text-[11px] md:text-xs text-base-content/70"
              >
                <div class="space-y-1">
                  <p class="font-semibold text-sm">ساعات پاسخ‌گویی</p>
                  <p>هر روز ۹ صبح تا ۹ شب</p>
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

              <div class="alert alert-info mt-2 text-[11px] md:text-xs">
                <span>
                  برای پیگیری سفارش، لطفاً «شماره سفارش» را حتماً در متن پیام
                  بنویسید تا سریع‌تر پیدا و بررسی شود.
                </span>
              </div>
            </div>
          </div>

          <!-- کارت نکته / FAQ کوچک -->
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

          <!-- آمار اعتماد (اختیاری، دکوریِ خوب) -->
          <div class="grid grid-cols-3 gap-3 text-center text-[11px] md:text-xs">
            <div
                class="rounded-2xl bg-base-100/90 border border-base-200 px-2.5 py-3 flex flex-col gap-1"
            >
              <span class="text-sm md:text-base font-bold text-primary">
                +۲۵۰۰
              </span>
              <span class="text-base-content/60">
                سفارش موفق
              </span>
            </div>
            <div
                class="rounded-2xl bg-base-100/90 border border-base-200 px-2.5 py-3 flex flex-col gap-1"
            >
              <span class="text-sm md:text-base font-bold text-primary">
                ۷ روز
              </span>
              <span class="text-base-content/60">
                پشتیبانی در هفته
              </span>
            </div>
            <div
                class="rounded-2xl bg-base-100/90 border border-base-200 px-2.5 py-3 flex flex-col gap-1"
            >
              <span class="text-sm md:text-base font-bold text-primary">
                ⭐ ۴.۹
              </span>
              <span class="text-base-content/60">
                رضایت مشتریان
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { reactive, ref } from "vue";

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
  preferredChannel: "email" | "phone" | "whatsapp";
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
  preferredChannel: "email",
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
  form.preferredChannel = "email";
  form.acceptPolicy = false;
};

const handleSubmit = async () => {
  if (!validate()) return;

  if (!form.acceptPolicy) {
    alert("لطفاً ابتدا با قوانین و حریم خصوصی موافقت کنید.");
    return;
  }

  try {
    isSubmitting.value = true;

    // اینجا بعداً API اصلی‌ات را صدا بزن (axios / fetch)
    // await api.contact.send(form)

    // دمو: شبیه‌سازی درخواست
    await new Promise((resolve) => setTimeout(resolve, 900));

    alert("پیام شما با موفقیت ارسال شد؛ ممنون از اعتمادتون به میتراپی 🌱");
    resetForm();
  } catch (error) {
    alert("در ارسال پیام خطایی رخ داد؛ لطفاً دوباره تلاش کنید.");
  } finally {
    isSubmitting.value = false;
  }
};
</script>

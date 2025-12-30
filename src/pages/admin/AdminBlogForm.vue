<template>
  <div class="space-y-6 max-w-4xl mx-auto" dir="rtl">
    <div class="rounded-2xl border border-warning/40 bg-warning/10 p-4 text-xs text-warning">
      TODO: API مدیریت بلاگ برای ایجاد/ویرایش مقاله در دسترس نیست. این فرم فعلاً ذخیره نمی‌کند.
    </div>
    <!-- هدر با گرادیانت ملایم و اوپاسیتی کم -->
    <section
        class="relative rounded-3xl border border-base-300 shadow-sm overflow-hidden
             bg-gradient-to-l from-primary/15 via-primary/5 to-secondary/10"
    >
      <!-- نوار رنگی راست (خیلی ملایم) -->
      <div
          class="absolute inset-y-0 right-0 w-1.5 bg-gradient-to-b from-primary/40 to-secondary/40"
      ></div>

      <div class="px-5 sm:px-6 py-4 sm:py-5 pr-6">
        <div
            class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between"
        >
          <div class="space-y-1">
            <h2 class="text-base sm:text-xl font-bold text-base-content">
              {{ isEdit ? 'ویرایش مقاله' : 'افزودن مقاله جدید' }}
            </h2>
            <p class="text-[11px] sm:text-xs text-base-content/80">
              عنوان، اطلاعات متا و محتوای مقاله را تنظیم کن تا در وبلاگ سپهر‌باکس نمایش داده شود.
            </p>
          </div>

          <div
              class="flex flex-col items-start sm:items-end gap-1 text-[11px] sm:text-xs"
          >
            <span
                class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full
                     bg-primary/10 text-primary border border-primary/20"
            >
              <span
                  class="w-1.5 h-1.5 rounded-full bg-gradient-to-br from-primary to-secondary"
              ></span>
              {{ isEdit ? 'حالت ویرایش' : 'مقاله جدید' }}
            </span>

            <RouterLink
                to="/admin/blogs"
                class="inline-flex items-center gap-1 text-[11px] sm:text-xs text-base-content/70 hover:text-primary"
            >
              بازگشت به لیست مقالات
            </RouterLink>
          </div>
        </div>
      </div>
    </section>

    <!-- فرم مینیمال و کامپکت -->
    <div
        class="rounded-2xl bg-base-100 border border-base-300 shadow-sm px-4 sm:px-5 py-4 sm:py-5 space-y-5"
    >
      <!-- خلاصه کوچک بالا -->
      <div
          class="grid gap-3 sm:grid-cols-3 text-[11px] sm:text-xs rounded-2xl bg-base-200/60 px-3 py-2.5"
      >
        <div class="flex flex-col gap-0.5">
          <span class="text-base-content/60">عنوان</span>
          <span class="font-semibold text-base-content truncate">
            {{ form.title || '—' }}
          </span>
        </div>
        <div class="flex flex-col gap-0.5">
          <span class="text-base-content/60">نویسنده</span>
          <span class="font-semibold text-base-content truncate">
            {{ form.author || 'ادمین' }}
          </span>
        </div>
        <div class="flex flex-col gap-0.5">
          <span class="text-base-content/60">تاریخ</span>
          <span class="font-semibold text-base-content">
            {{ form.date || '—' }}
          </span>
        </div>
      </div>

      <!-- بخش اطلاعات مقاله -->
      <div class="space-y-3">
        <h3 class="text-sm font-semibold text-base-content">
          اطلاعات مقاله
        </h3>

        <div class="grid gap-3 md:grid-cols-2">
          <label class="form-control">
            <span class="label-text text-[11px]">عنوان</span>
            <input
                v-model="form.title"
                class="input input-bordered input-sm"
                required
            />
          </label>

          <label class="form-control">
            <span class="label-text text-[11px]">Slug</span>
            <input
                v-model="form.slug"
                class="input input-bordered input-sm ltr text-left"
                placeholder="mesalan-icloud-common-issues"
                required
            />
          </label>

          <label class="form-control">
            <span class="label-text text-[11px]">نویسنده</span>
            <input
                v-model="form.author"
                class="input input-bordered input-sm"
                placeholder="ادمین"
            />
          </label>

          <label class="form-control">
            <span class="label-text text-[11px]">تاریخ</span>
            <input
                v-model="form.date"
                class="input input-bordered input-sm"
            />
          </label>

          <label class="form-control md:col-span-2">
            <span class="label-text text-[11px]">تصویر شاخص (URL)</span>
            <input
                v-model="form.cover"
                class="input input-bordered input-sm ltr text-left"
                placeholder="/banners/blog1.webp"
            />
          </label>
        </div>
      </div>

      <!-- تولبار ادیتور -->
      <div class="space-y-2">
        <h3 class="text-sm font-semibold text-base-content">
          محتوای مقاله
        </h3>

        <div
            class="flex flex-wrap gap-1.5 rounded-2xl bg-base-200/60 px-2.5 py-2"
        >
          <button
              type="button"
              class="btn btn-ghost btn-xs"
              @click="format('bold')"
          >
            Bold
          </button>
          <button
              type="button"
              class="btn btn-ghost btn-xs"
              @click="format('italic')"
          >
            Italic
          </button>
          <button
              type="button"
              class="btn btn-ghost btn-xs"
              @click="format('underline')"
          >
            Underline
          </button>
          <div class="w-px h-6 bg-base-300 mx-1 hidden sm:block"></div>
          <button
              type="button"
              class="btn btn-ghost btn-xs"
              @click="insertBlock('h2')"
          >
            H2
          </button>
          <button
              type="button"
              class="btn btn-ghost btn-xs"
              @click="insertBlock('h3')"
          >
            H3
          </button>
          <button
              type="button"
              class="btn btn-ghost btn-xs"
              @click="insertBlock('p')"
          >
            پاراگراف
          </button>
          <div class="w-px h-6 bg-base-300 mx-1 hidden sm:block"></div>
          <button
              type="button"
              class="btn btn-ghost btn-xs"
              @click="format('insertUnorderedList')"
          >
            لیست
          </button>
          <button
              type="button"
              class="btn btn-ghost btn-xs"
              @click="format('insertOrderedList')"
          >
            شماره‌دار
          </button>
          <button
              type="button"
              class="btn btn-ghost btn-xs"
              @click="insertLink"
          >
            لینک
          </button>
          <button
              type="button"
              class="btn btn-ghost btn-xs"
              @click="insertImage"
          >
            تصویر
          </button>
          <button
              type="button"
              class="btn btn-ghost btn-xs"
              @click="insertHr"
          >
            ─
          </button>
          <button
              type="button"
              class="btn btn-ghost btn-xs text-error"
              @click="clearContent"
          >
            پاک‌کردن
          </button>
        </div>

        <!-- ادیتور اصلی -->
        <div
            ref="editor"
            class="mt-1 min-h-[620px] sm:min-h-[200px] rounded-2xl border border-base-200 bg-base-200/40 p-3 text-right overflow-y-auto"
            contenteditable="true"
            data-placeholder="اینجا متن مقاله را بنویسید..."
            @input="onInput"
        ></div>

      </div>

      <!-- دکمه‌ها (سمت راست) -->
      <div
          class="flex justify-end gap-2 sm:gap-3 pt-1"
          dir="ltr"
      >
        <button
            class="btn btn-outline btn-sm"
            type="button"
            @click="showPreview = true"
        >
          پیش‌نمایش
        </button>
        <button
            class="btn btn-primary btn-sm px-6"
            type="button"
            @click="save"
        >
          {{ isEdit ? 'ذخیره تغییرات' : 'ذخیره مقاله' }}
        </button>
      </div>
    </div>

    <!-- PREVIEW MODAL -->
    <div
        v-if="showPreview"
        class="fixed inset-0 bg-black/40 z-50 flex items-center justify-center px-3"
    >
      <div
          class="bg-base-100 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto border border-base-300"
      >
        <div
            class="flex items-center justify-between px-4 py-3 border-b border-base-200"
        >
          <p class="font-semibold text-sm sm:text-base">
            پیش‌نمایش مقاله
          </p>
          <button
              class="btn btn-sm btn-ghost"
              @click="showPreview = false"
          >
            بستن
          </button>
        </div>
        <div class="p-5 space-y-4 text-right">
          <h1 class="text-xl sm:text-2xl font-bold">
            {{ form.title || 'بدون عنوان' }}
          </h1>
          <p class="text-[11px] sm:text-xs text-base-content/50">
            {{ form.author || 'ادمین' }} • {{ form.date }}
          </p>
          <img
              v-if="form.cover"
              :src="form.cover"
              class="w-full rounded-xl"
          />
          <article
              class="prose prose-sm max-w-none prose-img:rounded-xl"
              v-html="form.content"
          ></article>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const blogStore = ref([])

const route = useRoute()
const router = useRouter()

const isEdit = computed(() => !!route.params.id)
const existing = isEdit.value
    ? blogStore.value.find(b => b.id === route.params.id)
    : null

const form = reactive<any>(
    existing
        ? { ...existing }
        : {
          id: 'b' + Math.random().toString(36).slice(2, 7),
          title: '',
          slug: '',
          author: 'ادمین',
          date: new Date().toLocaleDateString('fa-IR'),
          cover: '',
          content: '', // قبلاً اینجا "اینجا متن مقاله را بنویسید..." بود
        },
)

const editor = ref<HTMLDivElement | null>(null)
const showPreview = ref(false)

onMounted(() => {
  if (editor.value) {
    editor.value.innerHTML = form.content
  }
})

function onInput() {
  if (editor.value) {
    form.content = editor.value.innerHTML
  }
}

function format(cmd: string) {
  document.execCommand(cmd, false)
  onInput()
}

function insertBlock(tag: 'h2' | 'h3' | 'p') {
  const html =
      tag === 'p'
          ? '<p>پاراگراف جدید...</p>'
          : tag === 'h2'
              ? '<h2>عنوان سطح ۲</h2>'
              : '<h3>عنوان سطح ۳</h3>'
  document.execCommand('insertHTML', false, html)
  onInput()
}

function insertHr() {
  document.execCommand('insertHTML', false, '<hr />')
  onInput()
}

function insertLink() {
  const url = prompt('آدرس لینک را وارد کنید:')
  if (!url) return
  const text = prompt('متن لینک؟') || url
  document.execCommand(
      'insertHTML',
      false,
      `<a href="${url}" target="_blank">${text}</a>`,
  )
  onInput()
}

function insertImage() {
  const url = prompt('آدرس تصویر را وارد کنید:')
  if (!url) return
  document.execCommand(
      'insertHTML',
      false,
      `<img src="${url}" alt="" style="max-width:100%;border-radius:1rem;margin:0.5rem 0;" />`,
  )
  onInput()
}

function clearContent() {
  if (!editor.value) return
  editor.value.innerHTML = ''
  form.content = ''
}

function save() {
  alert('امکان ذخیره مقاله در این نسخه فراهم نیست.')
  router.push('/admin/blogs')
}
</script>

<style scoped>
[contenteditable='true'] {
  direction: rtl;
  outline: none;
  line-height: 1.7;
}
.prose :where(h1, h2, h3, p, ul, ol) {
  text-align: right;
}

/* placeholder برای contenteditable وقتی خالی است */
[contenteditable='true'][data-placeholder]:empty::before {
  content: attr(data-placeholder);
  color: rgba(148, 163, 184, 0.9); /* یه خاکستری ملایم */
  pointer-events: none;
}
.prose :where(h1, h2, h3, p, ul, ol) {
  text-align: right;
}

</style>

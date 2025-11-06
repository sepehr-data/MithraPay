<template>
  <div class="space-y-5">
    <!-- header -->
    <div class="flex items-center justify-between">
      <h2 class="text-xl font-bold">
        {{ isEdit ? 'ویرایش مقاله' : 'افزودن مقاله جدید' }}
      </h2>
      <RouterLink to="/admin/blogs" class="btn btn-ghost btn-sm">بازگشت</RouterLink>
    </div>

    <!-- editor card -->
    <div class="bg-base-100 border border-base-300 rounded-2xl p-5 space-y-4">
      <!-- meta -->
      <div class="grid gap-3 md:grid-cols-2">
        <label class="form-control">
          <span class="label-text">عنوان</span>
          <input v-model="form.title" class="input input-bordered" />
        </label>
        <label class="form-control">
          <span class="label-text">Slug</span>
          <input
              v-model="form.slug"
              class="input input-bordered"
              placeholder="mesalan-icloud-common-issues"
          />
        </label>
        <label class="form-control">
          <span class="label-text">نویسنده</span>
          <input v-model="form.author" class="input input-bordered" placeholder="ادمین" />
        </label>
        <label class="form-control">
          <span class="label-text">تاریخ</span>
          <input v-model="form.date" class="input input-bordered" />
        </label>
        <label class="form-control md:col-span-2">
          <span class="label-text">تصویر شاخص (url)</span>
          <input v-model="form.cover" class="input input-bordered" placeholder="/banners/blog1.webp" />
        </label>
      </div>

      <!-- toolbar -->
      <div class="flex flex-wrap gap-2">
        <button type="button" class="btn btn-xs" @click="format('bold')">Bold</button>
        <button type="button" class="btn btn-xs" @click="format('italic')">Italic</button>
        <button type="button" class="btn btn-xs" @click="format('underline')">Underline</button>
        <button type="button" class="btn btn-xs" @click="insertBlock('h2')">H2</button>
        <button type="button" class="btn btn-xs" @click="insertBlock('h3')">H3</button>
        <button type="button" class="btn btn-xs" @click="insertBlock('p')">پاراگراف</button>
        <button type="button" class="btn btn-xs" @click="format('insertUnorderedList')">لیست</button>
        <button type="button" class="btn btn-xs" @click="format('insertOrderedList')">شماره‌دار</button>
        <button type="button" class="btn btn-xs" @click="insertLink">لینک</button>
        <button type="button" class="btn btn-xs" @click="insertImage">تصویر</button>
        <button type="button" class="btn btn-xs" @click="insertHr">─</button>
        <button type="button" class="btn btn-xs btn-ghost" @click="clearContent">پاک‌کردن</button>
      </div>

      <!-- big editor -->
      <div
          ref="editor"
          class="mt-1 min-h-[520px] rounded-xl border border-base-200 bg-base-200/40 p-3 text-right overflow-y-auto"
          contenteditable="true"
          @input="onInput"
      ></div>

      <div class="flex gap-3 justify-end">
        <button class="btn btn-outline" type="button" @click="showPreview = true">
          پیش‌نمایش
        </button>
        <button class="btn btn-primary" @click="save">ذخیره مقاله</button>
      </div>
    </div>

    <!-- PREVIEW MODAL -->
    <div v-if="showPreview" class="fixed inset-0 bg-black/40 z-50 flex items-center justify-center px-3">
      <div class="bg-base-100 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto border border-base-300">
        <div class="flex items-center justify-between px-4 py-3 border-b border-base-200">
          <p class="font-semibold">پیش‌نمایش مقاله</p>
          <button class="btn btn-sm btn-ghost" @click="showPreview = false">بستن</button>
        </div>
        <div class="p-5 space-y-4 text-right">
          <h1 class="text-2xl font-bold">{{ form.title || 'بدون عنوان' }}</h1>
          <p class="text-xs text-base-content/50">
            {{ form.author || 'ادمین' }} • {{ form.date }}
          </p>
          <img v-if="form.cover" :src="form.cover" class="w-full rounded-xl" />
          <article class="prose prose-sm max-w-none prose-img:rounded-xl" v-html="form.content"></article>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const blogStore = ref([
  {
    id: 'b1',
    title: 'نمونه مقاله',
    slug: 'sample-post',
    author: 'ادمین',
    date: '1404/08/15',
    cover: '',
    content: '<p>نمونه متن...</p>',
  },
])

const route = useRoute()
const router = useRouter()

const isEdit = computed(() => !!route.params.id)
const existing = isEdit.value ? blogStore.value.find((b) => b.id === route.params.id) : null

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
          content: '<p>اینجا متن مقاله را بنویسید...</p>',
        }
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
  document.execCommand('insertHTML', false, `<a href="${url}" target="_blank">${text}</a>`)
  onInput()
}

function insertImage() {
  const url = prompt('آدرس تصویر را وارد کنید:')
  if (!url) return
  document.execCommand(
      'insertHTML',
      false,
      `<img src="${url}" alt="" style="max-width:100%;border-radius:1rem;margin:0.5rem 0;" />`
  )
  onInput()
}

function clearContent() {
  if (!editor.value) return
  editor.value.innerHTML = ''
  form.content = ''
}

function save() {
  if (isEdit.value) {
    const idx = blogStore.value.findIndex((b) => b.id === form.id)
    if (idx >= 0) blogStore.value[idx] = { ...form }
  } else {
    blogStore.value.unshift({ ...form })
  }
  router.push('/admin/blogs')
}
</script>

<style scoped>
[contenteditable="true"] {
  direction: rtl;
  outline: none;
  line-height: 1.7;
}
.prose :where(h1, h2, h3, p, ul, ol) {
  text-align: right;
}
</style>

<template>
  <div class="space-y-6 max-w-4xl mx-auto" dir="rtl">
    <!-- هدر -->
    <section
        class="relative rounded-3xl border border-base-300 shadow-sm overflow-hidden
             bg-gradient-to-l from-primary/15 via-primary/5 to-secondary/10"
    >
      <div class="absolute inset-y-0 right-0 w-1.5 bg-gradient-to-b from-primary/40 to-secondary/40"></div>
      <div class="px-5 sm:px-6 py-4 sm:py-5 pr-6">
        <div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div class="space-y-1">
            <h2 class="text-base sm:text-xl font-bold text-base-content">
              {{ isEdit ? 'ویرایش مقاله' : 'افزودن مقاله جدید' }}
            </h2>
            <p class="text-[11px] sm:text-xs text-base-content/80">
              عنوان، اطلاعات متا و محتوای مقاله را تنظیم کن تا در وبلاگ نمایش داده شود.
            </p>
          </div>
          <div class="flex flex-col items-start sm:items-end gap-1 text-[11px] sm:text-xs">
            <span
                class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full
                     bg-primary/10 text-primary border border-primary/20"
            >
              <span class="w-1.5 h-1.5 rounded-full bg-gradient-to-br from-primary to-secondary"></span>
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

    <!-- فرم مقاله -->
    <div class="rounded-2xl bg-base-100 border border-base-300 shadow-sm px-4 sm:px-5 py-4 sm:py-5 space-y-5">
      <!-- خلاصه -->
      <div class="grid gap-3 sm:grid-cols-4 text-[11px] sm:text-xs rounded-2xl bg-base-200/60 px-3 py-2.5">
        <div class="flex flex-col gap-0.5">
          <span class="text-base-content/60">عنوان</span>
          <span class="font-semibold text-base-content truncate">{{ form.title || '—' }}</span>
        </div>
        <div class="flex flex-col gap-0.5">
          <span class="text-base-content/60">نویسنده</span>
          <span class="font-semibold text-base-content truncate">{{ form.author || 'ادمین' }}</span>
        </div>
        <div class="flex flex-col gap-0.5">
          <span class="text-base-content/60">تاریخ</span>
          <span class="font-semibold text-base-content">{{ form.date || '—' }}</span>
        </div>
        <div class="flex flex-col gap-0.5">
          <span class="text-base-content/60">دسته‌بندی</span>
          <span class="font-semibold text-base-content truncate">{{ selectedCategoryName || '—' }}</span>
        </div>
      </div>

      <!-- اطلاعات مقاله -->
      <div class="space-y-3">
        <h3 class="text-sm font-semibold text-base-content">اطلاعات مقاله</h3>

        <div class="grid gap-3 md:grid-cols-2">
          <label class="form-control">
            <span class="label-text text-[11px]">عنوان</span>
            <input v-model="form.title" class="input input-bordered input-sm" required />
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
            <input v-model="form.author" class="input input-bordered input-sm" placeholder="ادمین" />
          </label>

          <label class="form-control">
            <span class="label-text text-[11px]">تاریخ</span>
            <input v-model="form.date" type="date" class="input input-bordered input-sm ltr text-left" />
          </label>

          <!-- ✅ تصویر شاخص -->
          <label class="form-control">
            <span class="label-text text-[11px]">تصویر شاخص (URL)</span>
            <input
                v-model="form.cover"
                class="input input-bordered input-sm ltr text-left"
                placeholder="/banners/blog1.webp"
            />
          </label>

          <!-- ✅ دسته‌بندی (dropdown کنار تصویر شاخص) -->
          <label class="form-control">
            <span class="label-text text-[11px]">دسته‌بندی</span>
            <select v-model.number="form.category_id" class="select select-bordered select-sm bg-base-100">
              <option :value="0">بدون دسته‌بندی</option>
              <option v-for="c in BLOG_CATEGORIES" :key="c.id" :value="c.id">
                {{ c.name }}
              </option>
            </select>
          </label>
        </div>

        <!-- ✅ گزینه جدید: مقاله منتشر شده است (زیر تصویر شاخص) -->
        <div class="pt-1">
          <label class="flex items-start gap-2 text-xs">
            <input v-model="form.is_published" type="checkbox" class="checkbox checkbox-sm mt-0.5" />
            <span>مقاله منتشر شده است</span>
          </label>
        </div>
      </div>

      <!-- ادیتور -->
      <div class="space-y-2">
        <h3 class="text-sm font-semibold text-base-content">محتوای مقاله</h3>

        <div class="flex flex-wrap gap-1.5 rounded-2xl bg-base-200/60 px-2.5 py-2">
          <button type="button" class="btn btn-ghost btn-xs" @pointerdown.prevent @mousedown.prevent @click="wrapInline('strong')">Bold</button>
          <button type="button" class="btn btn-ghost btn-xs" @pointerdown.prevent @mousedown.prevent @click="wrapInline('em')">Italic</button>
          <button type="button" class="btn btn-ghost btn-xs" @pointerdown.prevent @mousedown.prevent @click="wrapInline('u')">Underline</button>

          <div class="w-px h-6 bg-base-300 mx-1 hidden sm:block"></div>

          <button type="button" class="btn btn-ghost btn-xs" @pointerdown.prevent @mousedown.prevent @click="wrapHeading(2)">H2</button>
          <button type="button" class="btn btn-ghost btn-xs" @pointerdown.prevent @mousedown.prevent @click="wrapHeading(3)">H3</button>
          <button type="button" class="btn btn-ghost btn-xs" @pointerdown.prevent @mousedown.prevent @click="wrapParagraph()">پاراگراف</button>

          <div class="w-px h-6 bg-base-300 mx-1 hidden sm:block"></div>

          <button type="button" class="btn btn-ghost btn-xs" @pointerdown.prevent @mousedown.prevent @click="makeList('ul')">لیست</button>
          <button type="button" class="btn btn-ghost btn-xs" @pointerdown.prevent @mousedown.prevent @click="makeList('ol')">شماره‌دار</button>

          <button type="button" class="btn btn-ghost btn-xs" @pointerdown.prevent @mousedown.prevent @click="makeLink">لینک</button>
          <button type="button" class="btn btn-ghost btn-xs" @pointerdown.prevent @mousedown.prevent @click="insertImage">تصویر</button>
          <button type="button" class="btn btn-ghost btn-xs" @pointerdown.prevent @mousedown.prevent @click="insertHr">─</button>

          <button type="button" class="btn btn-ghost btn-xs text-error" @pointerdown.prevent @mousedown.prevent @click="clearContent">پاک‌کردن</button>
        </div>

        <div
            ref="editor"
            class="editor-content mt-1 min-h-[620px] sm:min-h-[200px] rounded-2xl border border-base-200 bg-base-200/40 p-3 text-right overflow-y-auto"
            contenteditable="true"
            spellcheck="false"
            @input="onInput"
        ></div>
      </div>

      <!-- دکمه‌ها -->
      <div class="flex justify-end gap-2 sm:gap-3 pt-1" dir="ltr">
        <button class="btn btn-outline btn-sm" type="button" @click="showPreview = true">پیش‌نمایش</button>

        <button class="btn btn-primary btn-sm px-6" type="button" @click="save">
          {{ isEdit ? 'ذخیره تغییرات' : 'ذخیره مقاله' }}
        </button>
      </div>
    </div>

    <!-- پیش‌نمایش -->
    <div v-if="showPreview" class="fixed inset-0 bg-black/40 z-50 flex items-center justify-center px-3">
      <div class="bg-base-100 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto border border-base-300">
        <div class="flex items-center justify-between px-4 py-3 border-b border-base-200">
          <p class="font-semibold text-sm sm:text-base">پیش‌نمایش مقاله</p>
          <button class="btn btn-sm btn-ghost" @click="showPreview = false">بستن</button>
        </div>
        <div class="p-5 space-y-4 text-right">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <h1 class="text-xl sm:text-2xl font-bold">{{ form.title || 'بدون عنوان' }}</h1>

              <span v-if="selectedCategoryName" class="badge badge-ghost badge-sm rounded-full">
                {{ selectedCategoryName }}
              </span>
            </div>

            <span
                class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] border"
                :class="form.is_published
                ? 'bg-success/10 text-success border-success/25'
                : 'bg-error/10 text-error border-error/25'"
            >
              <span class="w-1.5 h-1.5 rounded-full" :class="form.is_published ? 'bg-success' : 'bg-error'"></span>
              {{ form.is_published ? 'منتشر شده' : 'پیش‌نویس' }}
            </span>
          </div>

          <p class="text-[11px] sm:text-xs text-base-content/50">
            {{ form.author || 'ادمین' }} • {{ form.date }}
          </p>

          <img v-if="form.cover" :src="form.cover" class="w-full rounded-xl" />
          <article class="prose prose-sm max-w-none prose-img:rounded-xl preview-content" v-html="form.content"></article>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted, onBeforeUnmount, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { adminCreateBlog, adminUpdateBlog, adminGetBlog } from '@/services/admin'


const BLOG_CATEGORIES = [
  { id: 1, name: 'موسیقی و استریم' },
  { id: 2, name: 'فیلم و سریال' },
  { id: 3, name: 'اپل و آیکلود' },
  { id: 4, name: 'یوتیوب و شبکه‌های اجتماعی' },
  { id: 5, name: 'گیمینگ و گیفت‌کارت' },
  { id: 6, name: 'آموزش و راهنما' },
  { id: 7, name: 'اخبار و بروزرسانی‌ها' },
  { id: 8, name: 'نکته‌ها و ترفندها' },
] as const

const route = useRoute()
const router = useRouter()

const blogId = computed(() => {
  const id = Number(route.params.id)
  return Number.isFinite(id) ? id : null
})
const isEdit = computed(() => blogId.value !== null)

const form = reactive({
  id: null as number | null,
  title: '',
  slug: '',
  author: 'ادمین',
  date: '',
  cover: '',
  content: '',
  is_published: true,

  // ✅ NEW: category id
  category_id: 0 as number, // 0 => بدون دسته‌بندی
})

const selectedCategoryName = computed(() => {
  const id = Number(form.category_id || 0)
  if (!id) return ''
  return BLOG_CATEGORIES.find(c => c.id === id)?.name || ''
})

const editor = ref<HTMLDivElement | null>(null)
const showPreview = ref(false)

let savedRange: Range | null = null

function isRangeInsideEditor(r: Range) {
  const el = editor.value
  if (!el) return false
  return el.contains(r.commonAncestorContainer)
}

function saveSelection() {
  const sel = window.getSelection()
  if (!sel || sel.rangeCount === 0) return
  const r = sel.getRangeAt(0)
  if (isRangeInsideEditor(r)) savedRange = r.cloneRange()
}

function getWorkingRange(): Range | null {
  const el = editor.value
  if (!el) return null

  const sel = window.getSelection()
  if (sel && sel.rangeCount > 0) {
    const r = sel.getRangeAt(0)
    if (isRangeInsideEditor(r)) return r
  }
  return savedRange
}

function focusAndSelectRange(r: Range) {
  const el = editor.value
  if (!el) return
  el.focus({ preventScroll: true } as any)

  const sel = window.getSelection()
  if (!sel) return
  sel.removeAllRanges()
  sel.addRange(r)
  savedRange = r.cloneRange()
}

function setCaretAfter(node: Node) {
  const r = document.createRange()
  r.setStartAfter(node)
  r.collapse(true)
  focusAndSelectRange(r)
}

function ensureHasSelectionOrWarn(): Range | null {
  const r = getWorkingRange()
  if (!r || r.collapsed) {
    alert('اول بخشی از متن را انتخاب کن.')
    return null
  }
  focusAndSelectRange(r)
  return r
}

function onInput() {
  if (editor.value) form.content = editor.value.innerHTML
}

function wrapInline(tag: 'strong' | 'em' | 'u') {
  const r = ensureHasSelectionOrWarn()
  if (!r) return

  const wrapper = document.createElement(tag)
  const frag = r.extractContents()
  wrapper.appendChild(frag)
  r.insertNode(wrapper)

  setCaretAfter(wrapper)
  onInput()
}

function wrapHeading(level: 2 | 3) {
  const r = ensureHasSelectionOrWarn()
  if (!r) return

  const h = document.createElement(`h${level}`)
  const frag = r.extractContents()
  h.appendChild(frag)
  r.insertNode(h)

  setCaretAfter(h)
  onInput()
}

function wrapParagraph() {
  const r = ensureHasSelectionOrWarn()
  if (!r) return

  const p = document.createElement('p')
  const frag = r.extractContents()
  p.appendChild(frag)
  r.insertNode(p)

  setCaretAfter(p)
  onInput()
}

function makeList(type: 'ul' | 'ol') {
  const r = ensureHasSelectionOrWarn()
  if (!r) return

  const text = r.toString()
  const lines = text.split(/\r?\n/).map((x) => x.trim()).filter(Boolean)

  const list = document.createElement(type)
  ;(lines.length ? lines : [text]).forEach((t) => {
    const li = document.createElement('li')
    li.textContent = t
    list.appendChild(li)
  })

  r.deleteContents()
  r.insertNode(list)

  setCaretAfter(list)
  onInput()
}

function makeLink() {
  const r = ensureHasSelectionOrWarn()
  if (!r) return

  const urlRaw = prompt('آدرس لینک را وارد کنید:')
  if (!urlRaw) return
  const url = /^https?:\/\//i.test(urlRaw) ? urlRaw : `https://${urlRaw}`

  const a = document.createElement('a')
  a.href = url
  a.target = '_blank'
  a.rel = 'noopener noreferrer'

  const frag = r.extractContents()
  a.appendChild(frag)
  r.insertNode(a)

  setCaretAfter(a)
  onInput()
}

function insertImage() {
  saveSelection()
  const url = prompt('آدرس تصویر را وارد کنید:')
  if (!url) return

  const r = getWorkingRange()
  if (!r) return
  focusAndSelectRange(r)

  const img = document.createElement('img')
  img.src = url
  img.style.maxWidth = '100%'
  img.style.borderRadius = '1rem'
  img.style.margin = '0.5rem 0'

  r.insertNode(img)
  setCaretAfter(img)
  onInput()
}

function insertHr() {
  const r = getWorkingRange()
  if (!r) return
  focusAndSelectRange(r)

  const hr = document.createElement('hr')
  r.insertNode(hr)
  setCaretAfter(hr)
  onInput()
}

function clearContent() {
  if (!editor.value) return
  editor.value.innerHTML = ''
  form.content = ''
  savedRange = null
}

function onSelectionChange() {
  saveSelection()
}

onMounted(async () => {
  document.addEventListener('selectionchange', onSelectionChange)

  if (!isEdit.value) {
    form.date = new Date().toISOString().slice(0, 10)
    form.is_published = true
    form.category_id = BLOG_CATEGORIES[0]?.id ?? 0
    return
  }

  try {
    const data = await adminGetBlog(blogId.value!)

    form.id = data.id
    form.title = data.title ?? ''
    form.slug = data.slug ?? ''
    form.author = data.author_name ?? 'ادمین'
    form.cover = data.cover_image ?? ''
    form.content = data.content ?? ''
    form.date = data.published_at ? data.published_at.slice(0, 10) : ''
    form.is_published = !!data.is_published

    // ✅ load category_id (fallback: 0)
    form.category_id = Number((data as any).category_id || 0)

    if (editor.value) editor.value.innerHTML = form.content
  } catch (err) {
    console.error(err)
    alert('بارگذاری مقاله انجام نشد')
  }
})

onBeforeUnmount(() => {
  document.removeEventListener('selectionchange', onSelectionChange)
})

async function save() {
  try {
    const payload = {
      title: form.title,
      slug: form.slug,
      author_name: form.author,
      cover_image: form.cover || null,
      content: form.content,
      is_published: !!form.is_published,
      published_at: form.is_published ? (form.date || null) : null,

      // ✅ NEW
      category_id: form.category_id ? form.category_id : null,
    }

    if (isEdit.value && form.id) await adminUpdateBlog(form.id, payload)
    else await adminCreateBlog(payload)

    router.push('/admin/blogs')
  } catch (err: any) {
    console.error('save blog error:', err?.response?.data || err)
    alert('ذخیره مقاله انجام نشد!')
  }
}
</script>

<style scoped>
.editor-content h2 {
  font-size: 1.55rem !important;
  font-weight: 900 !important;
  margin: 1.1rem 0 0.6rem !important;
  line-height: 1.35 !important;
}
.editor-content h3 {
  font-size: 1.25rem !important;
  font-weight: 850 !important;
  margin: 0.9rem 0 0.55rem !important;
  line-height: 1.45 !important;
}
.editor-content,
.editor-content p,
.editor-content li {
  font-size: 0.95rem;
  line-height: 1.9;
}
.preview-content :deep(h2) {
  font-size: 1.55rem !important;
  font-weight: 900 !important;
}
.preview-content :deep(h3) {
  font-size: 1.25rem !important;
  font-weight: 850 !important;
}
</style>

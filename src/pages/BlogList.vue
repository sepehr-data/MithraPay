<template>
  <div class="max-w-6xl mx-auto px-4 py-6">
    <div class="flex flex-col gap-6 lg:flex-row">
      <!-- main content (right in RTL) -->
      <main class="flex-1 space-y-5">
        <header class="text-right space-y-1">
          <h1 class="text-2xl font-bold">بلاگ</h1>
          <p class="text-sm text-base-content/60">
            آموزش‌ها، نکته‌ها و اخبار سرویس‌های دیجیتال
          </p>
        </header>

        <!-- posts grid -->
        <div class="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          <article
              v-for="p in filteredPosts"
              :key="p.id || p.slug"
              class="bg-base-100 border border-base-300 rounded-2xl overflow-hidden flex flex-col"
          >
            <figure class="aspect-[16/9] bg-base-200 overflow-hidden">
              <img
                  :src="p.cover || 'https://placehold.co/800x450?text=Blog'"
                  :alt="p.title"
                  class="w-full h-full object-cover"
              />
            </figure>
            <div class="p-4 flex-1 flex flex-col gap-3 text-right">
              <div class="flex items-start justify-between gap-3">
                <RouterLink
                    :to="`/blog/${p.slug}`"
                    class="text-base font-semibold hover:text-primary line-clamp-2"
                >
                  {{ p.title }}
                </RouterLink>
                <span
                    v-if="p.category"
                    class="badge badge-ghost badge-sm whitespace-nowrap"
                >
                  {{ p.category }}
                </span>
              </div>
              <p class="text-xs text-base-content/50">
                {{ formatDate(p.date || p.createdAt) }}
              </p>
              <p class="text-sm text-base-content/70 line-clamp-3">
                {{ getExcerpt(p) }}
              </p>
              <div class="mt-auto flex justify-end">
                <RouterLink
                    :to="`/blog/${p.slug}`"
                    class="btn btn-sm btn-outline rounded-full"
                >
                  ادامه مطلب
                </RouterLink>
              </div>
            </div>
          </article>

          <div
              v-if="!filteredPosts.length"
              class="col-span-full bg-base-100 border border-base-200 rounded-2xl p-8 text-center text-sm text-base-content/60"
          >
            مطلبی پیدا نشد.
          </div>
        </div>
      </main>

      <!-- sidebar (left in RTL) -->
      <aside
          class="lg:w-64 shrink-0 space-y-5 order-first lg:order-last"
      >
        <!-- categories -->
        <div class="bg-base-100 border border-base-300 rounded-2xl p-4 space-y-3">
          <p class="text-sm font-semibold text-right">دسته‌بندی‌ها</p>
          <div class="flex flex-wrap gap-2 justify-end">
            <button
                class="btn btn-xs"
                :class="activeCat === '' ? 'btn-primary' : 'btn-ghost'"
                @click="activeCat = ''"
            >
              همه
            </button>
            <button
                v-for="cat in categories"
                :key="cat"
                class="btn btn-xs"
                :class="activeCat === cat ? 'btn-primary' : 'btn-ghost'"
                @click="activeCat = cat"
            >
              {{ cat }}
            </button>
          </div>
          <p v-if="!categories.length" class="text-xs text-base-content/40 text-right">
            هنوز دسته‌ای تعریف نشده است.
          </p>
        </div>

        <!-- sort -->
        <div class="bg-base-100 border border-base-300 rounded-2xl p-4 space-y-3">
          <p class="text-sm font-semibold text-right">مرتب‌سازی</p>
          <select v-model="sort" class="select select-bordered w-full">
            <option value="newest">جدیدترین</option>
            <option value="oldest">قدیمی‌تر</option>
          </select>
        </div>
      </aside>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { listPosts } from '@/services/api'
import type { BlogPost } from '@/services/types'

const posts = ref<BlogPost[]>([])
const search = ref('')
const sort = ref<'newest' | 'oldest'>('newest')
const activeCat = ref('')

onMounted(async () => {
  posts.value = await listPosts()
})

const categories = computed(() => {
  const s = new Set<string>()
  posts.value.forEach((p: any) => {
    if (p.category) s.add(p.category)
    if (Array.isArray(p.tags)) p.tags.forEach((t: string) => s.add(t))
  })
  return Array.from(s)
})

const filteredPosts = computed(() => {
  let arr = [...posts.value]

  if (search.value.trim()) {
    const q = search.value.trim().toLowerCase()
    arr = arr.filter((p: any) =>
        (p.title && p.title.toLowerCase().includes(q)) ||
        (p.excerpt && p.excerpt.toLowerCase().includes(q)) ||
        (p.description && p.description.toLowerCase().includes(q))
    )
  }

  if (activeCat.value) {
    arr = arr.filter((p: any) => {
      const byCat = p.category === activeCat.value
      const byTag = Array.isArray(p.tags) && p.tags.includes(activeCat.value)
      return byCat || byTag
    })
  }

  arr.sort((a: any, b: any) => {
    const ad = new Date(a.date || a.createdAt || 0).getTime()
    const bd = new Date(b.date || b.createdAt || 0).getTime()
    return sort.value === 'newest' ? bd - ad : ad - bd
  })

  return arr
})

function formatDate(val?: string) {
  if (!val) return ''
  const d = new Date(val)
  if (isNaN(d.getTime())) return val
  return d.toLocaleDateString('fa-IR')
}

function getExcerpt(p: any) {
  if (p.excerpt) return p.excerpt
  if (p.description) return p.description
  if (p.content) return stripHtml(p.content).slice(0, 110) + '…'
  return ''
}

function stripHtml(html = '') {
  return html.replace(/<[^>]+>/g, '')
}
</script>

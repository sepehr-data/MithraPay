<template>
  <div class="space-y-4">
    <div class="flex items-center justify-between gap-4">
      <h2 class="text-xl font-bold">مدیریت مقالات</h2>
      <RouterLink to="/admin/blogs/new" class="btn btn-primary btn-sm">
        مطلب جدید
      </RouterLink>
    </div>

    <div>
      <input
          v-model="q"
          class="input input-bordered w-full md:max-w-sm"
          placeholder="جستجو در عنوان یا نویسنده..."
      />
    </div>

    <div class="bg-base-100 rounded-2xl border border-base-300 overflow-x-auto">
      <table class="table w-full">
        <thead>
        <tr>
          <th>عنوان</th>
          <th>نویسنده</th>
          <th>تاریخ</th>
          <th></th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="p in filtered" :key="p.id">
          <td class="whitespace-nowrap">{{ p.title }}</td>
          <td class="text-xs">{{ p.author || '-' }}</td>
          <td class="text-xs">{{ p.date }}</td>
          <td class="flex gap-2">
            <RouterLink :to="`/admin/blogs/${p.id}`" class="btn btn-xs btn-outline">
              ویرایش
            </RouterLink>
            <button class="btn btn-xs btn-error" @click="remove(p.id)">حذف</button>
          </td>
        </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const blogs = ref([
  {
    id: 'b1',
    title: 'آیکلود یک اپ؛ مشکلات رایج آیکلاد',
    slug: 'icloud-common-issues',
    author: 'ادمین',
    date: '1404/03/20',
    content: '<p>نمونه متن...</p>',
  },
  {
    id: 'b2',
    title: 'مزایای یوتیوب پریمیوم',
    slug: 'youtube-premium',
    author: 'ادمین',
    date: '1404/03/21',
    content: '<p>نمونه متن...</p>',
  },
])

const q = ref('')

const filtered = computed(() => {
  if (!q.value) return blogs.value
  const t = q.value.toLowerCase()
  return blogs.value.filter(
      (b) =>
          b.title.toLowerCase().includes(t) ||
          (b.author && b.author.toLowerCase().includes(t))
  )
})

function remove(id: string) {
  const idx = blogs.value.findIndex((b) => b.id === id)
  if (idx >= 0) blogs.value.splice(idx, 1)
}
</script>

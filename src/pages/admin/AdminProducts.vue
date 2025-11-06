<template>
  <div class="space-y-4">
    <div class="flex items-center justify-between gap-4">
      <h2 class="text-xl font-bold">مدیریت محصولات</h2>
      <RouterLink to="/admin/products/new" class="btn btn-primary btn-sm">
        افزودن محصول
      </RouterLink>
    </div>

    <div class="flex gap-2">
      <input
          v-model="q"
          type="text"
          class="input input-bordered w-full md:max-w-sm"
          placeholder="جستجو در عنوان یا دسته"
      />
    </div>

    <div class="bg-base-100 rounded-2xl border border-base-300 overflow-x-auto">
      <table class="table w-full">
        <thead>
        <tr>
          <th>عنوان</th>
          <th>قیمت</th>
          <th>دسته</th>
          <th></th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="p in filtered" :key="p.id">
          <td class="whitespace-nowrap">{{ p.title }}</td>
          <td>{{ formatPrice(p.price) }}</td>
          <td class="text-xs">{{ p.categoryId }}</td>
          <td class="flex gap-2">
            <RouterLink :to="`/admin/products/${p.id}`" class="btn btn-xs btn-outline">ویرایش</RouterLink>
            <button class="btn btn-xs btn-error" @click="remove(p.id)">حذف</button>
          </td>
        </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useProductsStore } from '@/stores/products'

const store = useProductsStore()
const q = ref('')

const filtered = computed(() => {
  if (!q.value) return store.products
  const t = q.value.toLowerCase()
  return store.products.filter(
      (p: any) =>
          p.title.toLowerCase().includes(t) ||
          (p.categoryId && p.categoryId.toLowerCase().includes(t))
  )
})

function formatPrice(val: number) {
  return new Intl.NumberFormat('fa-IR').format(val) + ' تومان'
}

function remove(id: string) {
  // in-memory delete
  const idx = store.products.findIndex((p: any) => p.id === id)
  if (idx >= 0) store.products.splice(idx, 1)
}
</script>

<template>
  <div class="flex items-center justify-between mb-4">
    <div class="text-sm opacity-80">تعداد: {{ total }}</div>
    <div class="flex items-center gap-2">
      <span class="text-sm">مرتب‌سازی:</span>
      <select v-model="model" class="select select-bordered select-sm w-44">
        <option value="bestselling">پرفروش‌ترین</option>
        <option value="newest">جدیدترین</option>
        <option value="price-asc">ارزان‌ترین</option>
        <option value="price-desc">گران‌ترین</option>
      </select>
    </div>
  </div>
</template>

<script setup lang="ts">
const model = defineModel<string>({ default: 'bestselling' })
defineProps<{ total: number }>()
</script>

<template>
  <div class="space-y-4">
    <div class="flex items-center justify-between">
      <h2 class="text-xl font-bold">بنرهای صفحه اصلی</h2>
      <button class="btn btn-primary btn-sm" @click="add">افزودن بنر</button>
    </div>

    <div class="bg-base-100 rounded-2xl border border-base-300 p-4 space-y-3">
      <div
          v-for="(b, idx) in banners"
          :key="b.id"
          class="flex flex-col md:flex-row gap-3 items-center justify-between border border-base-200 rounded-xl p-3"
      >
        <div class="flex items-center gap-3">
          <img :src="b.image" alt="" class="w-32 h-16 object-cover rounded-lg" />
          <div class="text-right">
            <p class="font-semibold text-sm">{{ b.alt || 'بدون عنوان' }}</p>
            <p class="text-xs text-base-content/50">لینک: {{ b.to }}</p>
          </div>
        </div>
        <div class="flex gap-2">
          <button class="btn btn-xs" @click="edit(idx)">ویرایش</button>
          <button class="btn btn-xs btn-error" @click="remove(idx)">حذف</button>
        </div>
      </div>
    </div>

    <!-- editor -->
    <div v-if="selected !== null" class="bg-base-100 rounded-2xl border border-base-300 p-4 space-y-3">
      <h3 class="font-semibold">ویرایش بنر</h3>
      <label class="form-control">
        <span class="label-text">آدرس تصویر</span>
        <input v-model="banners[selected].image" class="input input-bordered" />
      </label>
      <label class="form-control">
        <span class="label-text">متن جایگزین</span>
        <input v-model="banners[selected].alt" class="input input-bordered" />
      </label>
      <label class="form-control">
        <span class="label-text">لینک</span>
        <input v-model="banners[selected].to" class="input input-bordered" />
      </label>
      <button class="btn btn-primary btn-sm" @click="selected = null">ذخیره</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const banners = ref([
  {
    id: 'b1',
    image: '/banners/slider3.webp',
    alt: 'Apple tv+',
    to: '/product/apple-tv',
  },
  {
    id: 'b2',
    image: '/banners/slider4.webp',
    alt: 'Apple Music',
    to: '/product/apple-music-3m',
  },
])

const selected = ref<number | null>(null)

function add() {
  banners.value.push({
    id: 'b' + Math.random().toString(36).slice(2, 6),
    image: '',
    alt: '',
    to: '/',
  })
  selected.value = banners.value.length - 1
}

function edit(idx: number) {
  selected.value = idx
}

function remove(idx: number) {
  banners.value.splice(idx, 1)
  selected.value = null
}
</script>

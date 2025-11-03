<template>
  <h1 class="text-xl font-bold mb-6">بلاگ</h1>
  <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
    <article v-for="p in posts" :key="p.id" class="card bg-base-100 border border-base-300">
      <figure><img :src="p.cover || 'https://placehold.co/600x360?text=Blog'" /></figure>
      <div class="card-body">
        <RouterLink class="card-title text-base" :to="`/blog/${p.slug}`">{{ p.title }}</RouterLink>
        <p class="opacity-80 text-sm line-clamp-3">{{ p.excerpt }}</p>
        <div class="card-actions">
          <RouterLink class="btn btn-ghost btn-sm" :to="`/blog/${p.slug}`">ادامه</RouterLink>
        </div>
      </div>
    </article>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { listPosts } from '@/services/api'
import type { BlogPost } from '@/services/types'

const posts = ref<BlogPost[]>([])
onMounted(async () => {
  posts.value = await listPosts()
})
</script>

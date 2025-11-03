<template>
  <article v-if="post" class="prose prose-invert max-w-none">
    <h1>{{ post.title }}</h1>
    <img :src="post.cover || 'https://placehold.co/960x400?text=Cover'" class="rounded-xl my-4"/>
    <div v-html="post.content"></div>
  </article>
  <div v-else class="skeleton h-64 w-full"></div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { getPost } from '@/services/api'
import type { BlogPost } from '@/services/types'

const route = useRoute()
const post = ref<BlogPost | undefined>()
onMounted(async () => {
  post.value = await getPost(route.params.slug as string)
})
</script>

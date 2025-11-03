<template>
  <div class="breadcrumbs text-sm mb-4">
    <ul>
      <li><RouterLink to="/">خانه</RouterLink></li>
      <li v-for="(c,i) in crumbs" :key="i">
        <RouterLink v-if="c.to" :to="c.to">{{ c.title }}</RouterLink>
        <span v-else>{{ c.title }}</span>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
defineProps<{ crumbs: { title: string, to?: string }[] }>()
</script>

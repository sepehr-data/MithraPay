<template>
  <router-view v-slot="{ Component, route }">
    <!-- if route is auth, just render the component -->
    <component v-if="route.meta.auth" :is="Component" />
    <!-- otherwise use normal layout -->
    <DefaultLayout v-else>
      <component :is="Component" />
    </DefaultLayout>
  </router-view>
</template>

<script setup lang="ts">
import DefaultLayout from '@/layouts/DefaultLayout.vue'
</script>

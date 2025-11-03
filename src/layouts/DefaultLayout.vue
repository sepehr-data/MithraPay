<template>
  <div class="min-h-screen flex flex-col">
    <AppNavBar />
    <main class="container max-w-7xl py-6 grow">
      <slot />
    </main>
    <AppFooter />
    <CartDrawer />
  </div>
</template>

<script setup lang="ts">
import AppNavBar from '@/components/AppNavBar.vue'
import AppFooter from '@/components/AppFooter.vue'
import CartDrawer from '@/components/CartDrawer.vue'
</script>

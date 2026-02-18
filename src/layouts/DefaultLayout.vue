<template>
  <div>
    <AppNavBar />
    <main>
      <slot />
    </main>

    <!-- ✅ همیشه mount باشد -->
    <CartDrawer />
  </div>
</template>

<script setup lang="ts">
import AppNavBar from "@/components/AppNavBar.vue"
import CartDrawer from "@/components/CartDrawer.vue"  // مسیر را مطابق پروژه‌ات تنظیم کن
</script>

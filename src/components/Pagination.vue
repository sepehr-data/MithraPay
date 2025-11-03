<template>
  <div class="join">
    <button class="btn btn-sm join-item" :disabled="page<=1" @click="$emit('update:page', page-1)">«</button>
    <button class="btn btn-sm join-item">{{ page }}</button>
    <button class="btn btn-sm join-item" :disabled="page>=pages" @click="$emit('update:page', page+1)">»</button>
  </div>
</template>

<script setup lang="ts">
defineProps<{ page: number, pages: number }>()
</script>

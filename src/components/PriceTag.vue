<template>
  <div class="flex items-center gap-2">
    <span class="font-bold">{{ priceLabel }}</span>
    <span v-if="compareAt" class="line-through opacity-60 text-sm">{{ compareLabel }}</span>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { formatToman } from '@/services/currency'

const props = defineProps<{ price: number, compareAt?: number }>()
const priceLabel = computed(() => formatToman(props.price))
const compareLabel = computed(() => props.compareAt ? formatToman(props.compareAt) : '')
</script>

<script setup lang="ts">
import type { RangeKey } from '@/types/dashboard'

defineProps<{
  modelValue: RangeKey
  options: { key: RangeKey; label: string }[]
}>()

const emit = defineEmits<{ (e: 'update:modelValue', v: RangeKey): void }>()
</script>

<template>
  <div
      class="inline-flex items-center gap-1 rounded-full bg-primary-content/10 border border-primary-content/20 px-1.5 py-1"
  >
    <button
        v-for="opt in options"
        :key="opt.key"
        type="button"
        class="px-2.5 py-0.5 rounded-full border text-[10px] sm:text-[11px] transition-colors"
        :class="
        modelValue === opt.key
          ? 'bg-primary-content/90 text-primary font-semibold border-primary-content/0'
          : 'bg-transparent text-primary-content/90 border-transparent hover:bg-primary-content/20'
      "
        @click="emit('update:modelValue', opt.key)"
    >
      {{ opt.label }}
    </button>
  </div>
</template>

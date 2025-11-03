<template>
  <div class="rating rating-sm">
    <input v-for="i in 5" :key="i" type="radio" :name="'rating-'+_uid" class="mask mask-star-2 bg-yellow-400"
           :checked="i <= rounded" disabled/>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{ value: number }>()
const rounded = Math.round(props.value ?? 0)
</script>

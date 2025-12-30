<template>
  <div class="join">
    <button class="btn btn-sm join-item" :disabled="disabled" @click="decr">-</button>
    <input
        class="input input-bordered input-sm w-14 text-center join-item"
        :disabled="disabled"
        :value="model"
        @input="onInput"
    />
    <button class="btn btn-sm join-item" :disabled="disabled" @click="incr">+</button>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{ disabled?: boolean }>()
const model = defineModel<number>({ default: 1 })
function onInput(e: Event) {
  const v = Number((e.target as HTMLInputElement).value || 1)
  model.value = Math.max(1, v)
}
function incr() {
  if (props.disabled) return
  model.value++
}
function decr() {
  if (props.disabled) return
  model.value = Math.max(1, model.value - 1)
}
</script>

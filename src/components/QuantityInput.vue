<template>
  <div class="join">
    <button class="btn btn-sm join-item" @click="decr">-</button>
    <input class="input input-bordered input-sm w-14 text-center join-item" :value="model" @input="onInput" />
    <button class="btn btn-sm join-item" @click="incr">+</button>
  </div>
</template>

<script setup lang="ts">
const model = defineModel<number>({ default: 1 })
function onInput(e: Event) {
  const v = Number((e.target as HTMLInputElement).value || 1)
  model.value = Math.max(1, v)
}
function incr() { model.value++ }
function decr() { model.value = Math.max(1, model.value - 1) }
</script>

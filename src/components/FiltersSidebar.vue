<template>
  <aside class="space-y-4">
    <div class="card bg-base-100 border border-base-300">
      <div class="card-body gap-3">
        <h3 class="font-semibold">فیلترها</h3>
        <div class="form-control">
          <label class="label cursor-pointer">
            <span class="label-text">دیجیتال</span>
            <input type="checkbox" class="checkbox checkbox-sm" v-model="onlyDigital">
          </label>
          <label class="label cursor-pointer">
            <span class="label-text">دارای تخفیف</span>
            <input type="checkbox" class="checkbox checkbox-sm" v-model="onlyDiscount">
          </label>
        </div>
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
const onlyDigital = defineModel<boolean>('onlyDigital', { default: false })
const onlyDiscount = defineModel<boolean>('onlyDiscount', { default: false })
</script>

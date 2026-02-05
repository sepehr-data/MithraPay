<template>
  <div>

    <div class="w-full min-w-0 grid-wrap">
      <div class="product-grid">
        <ProductCard
            v-for="p in products"
            :key="p.id"
            :product="p"
            :highlight="highlight"
        />
      </div>

      <div
          v-if="!products?.length"
          class="mt-4 rounded-2xl border border-base-300 bg-base-100 p-6 text-center"
      >
        <p class="text-sm text-base-content/70">فعلاً محصولی برای نمایش نداریم.</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, ref } from 'vue'
import ProductCard from './ProductCard.vue'
import type { ProductDto } from '@/types/api_client_types/products.dto.ts'

const props = defineProps<{
  products: ProductDto[]
  highlight?: string
}>()

</script>

<style scoped>
.grid-wrap{
  container-type: inline-size;
}

.product-grid{
  --min: 150px;
  --max: 240px;

  display: grid;
  gap: .75rem;

  grid-template-columns: repeat(
    auto-fit,
    minmax(min(100%, var(--min)), var(--max))
  );

  /* ✅ این دو تا مشکل اختلاف ارتفاع رو جمع می‌کنه */
  align-items: stretch;      /* به‌جای start */
  justify-items: stretch;    /* همه آیتم‌ها فول‌ویدث ستون */

  justify-content: start;
}

/* ✅ اطمینان: کارت‌ها دقیقاً ارتفاع ردیف رو پر کنن */
:deep(.card){
  height: 100%;
}

/* ✅ اگر اکشن‌های کارتت بالا/پایین می‌پرن، این کمک می‌کنه */
:deep(.card-body){
  height: 100%;
}
</style>
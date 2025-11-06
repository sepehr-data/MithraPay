<template>
  <div class="max-w-3xl space-y-5">
    <div class="flex items-center justify-between">
      <h2 class="text-xl font-bold">
        {{ isEdit ? 'ویرایش محصول' : 'افزودن محصول جدید' }}
      </h2>
      <RouterLink to="/admin/products" class="btn btn-ghost btn-sm">بازگشت</RouterLink>
    </div>

    <form class="bg-base-100 border border-base-300 rounded-2xl p-6 space-y-4" @submit.prevent="save">
      <div class="grid gap-4 md:grid-cols-2">
        <label class="form-control">
          <span class="label-text">عنوان</span>
          <input v-model="form.title" class="input input-bordered" required />
        </label>
        <label class="form-control">
          <span class="label-text">Slug</span>
          <input v-model="form.slug" class="input input-bordered" required />
        </label>
        <label class="form-control">
          <span class="label-text">قیمت</span>
          <input v-model.number="form.price" type="number" class="input input-bordered" required />
        </label>
        <label class="form-control">
          <span class="label-text">قیمت قبل</span>
          <input v-model.number="form.compareAt" type="number" class="input input-bordered" />
        </label>
        <label class="form-control">
          <span class="label-text">شناسه دسته</span>
          <input v-model="form.categoryId" class="input input-bordered" placeholder="مثلاً cat-acc" />
        </label>
        <label class="form-control">
          <span class="label-text">آدرس تصویر</span>
          <input v-model="form.image" class="input input-bordered" placeholder="/images/product.png" />
        </label>
      </div>

      <label class="form-control">
        <span class="label-text">توضیحات</span>
        <textarea v-model="form.description" rows="4" class="textarea textarea-bordered"></textarea>
      </label>

      <label class="flex items-center gap-2">
        <input v-model="form.isDigital" type="checkbox" class="checkbox checkbox-sm" />
        <span class="text-sm">محصول دیجیتال است</span>
      </label>

      <button class="btn btn-primary" type="submit">
        ذخیره
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { reactive, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useProductsStore } from '@/stores/products'

const route = useRoute()
const router = useRouter()
const store = useProductsStore()

const isEdit = computed(() => !!route.params.id)
const existing = isEdit.value
    ? store.products.find((p: any) => p.id === route.params.id)
    : null

const form = reactive<any>(
    existing
        ? { ...existing }
        : {
          id: 'p' + Math.random().toString(36).slice(2, 7),
          slug: '',
          title: '',
          description: '',
          price: 0,
          compareAt: null,
          image: '',
          categoryId: '',
          isDigital: true,
        }
)

function save() {
  if (isEdit.value) {
    const idx = store.products.findIndex((p: any) => p.id === form.id)
    if (idx >= 0) store.products[idx] = { ...form }
  } else {
    store.products.unshift({ ...form })
  }
  router.push('/admin/products')
}
</script>

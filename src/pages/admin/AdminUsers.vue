<template>
  <div class="space-y-4">
    <div class="flex items-center justify-between">
      <h2 class="text-xl font-bold">کاربران</h2>
      <input
          v-model="q"
          class="input input-bordered w-48"
          placeholder="جستجو شماره..."
      />
    </div>

    <div class="bg-base-100 rounded-2xl border border-base-300 overflow-x-auto">
      <table class="table w-full">
        <thead>
        <tr>
          <th>شماره موبایل</th>
          <th>نام</th>
          <th>تاریخ ثبت</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="u in filtered" :key="u.id">
          <td class="ltr text-left md:text-right">{{ u.phone }}</td>
          <td>{{ u.name || '-' }}</td>
          <td class="text-xs">{{ u.createdAt }}</td>
        </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

const users = ref([
  { id: 1, phone: '09120000000', name: 'کاربر تست', createdAt: '1404/03/10' },
  { id: 2, phone: '09350000000', name: '', createdAt: '1404/03/11' },
])

const q = ref('')

const filtered = computed(() => {
  if (!q.value) return users.value
  return users.value.filter((u) => u.phone.includes(q.value))
})
</script>

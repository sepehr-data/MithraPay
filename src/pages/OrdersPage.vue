<template>
  <div class="max-w-6xl mx-auto px-4 py-6">
    <h1 class="text-2xl font-bold mb-6">سفارش‌های من</h1>

    <div
        class="rounded-2xl border border-base-300 bg-base-100 shadow-md overflow-hidden"
    >
      <!-- no orders -->
      <div v-if="!loading && !orders.length" class="p-6 text-center text-sm opacity-70">
        هنوز سفارشی ثبت نکرده‌اید.
      </div>

      <!-- table -->
      <div v-else>
        <div class="overflow-x-auto">
          <table class="table table-zebra w-full text-sm">
            <thead>
            <tr class="bg-base-200">
              <th class="text-right">اطلاعات سفارش</th>
              <th class="text-right">محصول</th>
              <th class="text-right">وضعیت سفارش</th>
              <th class="text-right">تاریخ ثبت سفارش</th>
              <th class="text-right">بیشتر</th>
            </tr>
            </thead>

            <tbody>
            <tr v-for="order in orders" :key="order.id">
              <!-- order code -->
              <td class="font-mono">
                {{ order.code }}
              </td>

              <!-- products summary -->
              <td>
                <div
                    v-for="(item, idx) in order.items"
                    :key="idx"
                    class="badge badge-outline mr-1 mb-1"
                >
                  {{ item.productTitle }} ×{{ item.quantity }}
                </div>
              </td>

              <!-- status -->
              <td>
                <span
                    class="badge"
                    :class="statusBadgeClass(order.status)"
                >
                  {{ statusLabel(order.status) }}
                </span>
              </td>

              <!-- date -->
              <td>
                {{ formatDate(order.createdAt) }}
              </td>

              <!-- actions -->
              <td class="space-x-2 space-x-reverse">
                <button class="btn btn-xs btn-outline" @click="openDetails(order)">
                  مشاهده سفارش
                </button>
                <button class="btn btn-xs btn-primary btn-outline">
                  ثبت نظر
                </button>
              </td>
            </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- simple modal for details (demo) -->
    <dialog ref="detailsModal" class="modal">
      <div class="modal-box max-w-lg">
        <h3 class="font-bold text-lg mb-3">
          سفارش {{ selectedOrder?.code }}
        </h3>
        <p class="text-sm mb-3 opacity-80">
          وضعیت: {{ selectedOrder ? statusLabel(selectedOrder.status) : '' }}
        </p>
        <ul class="list-disc pr-5 text-sm space-y-1">
          <li
              v-for="(item, idx) in selectedOrder?.items || []"
              :key="idx"
          >
            {{ item.productTitle }} ×{{ item.quantity }}
          </li>
        </ul>
        <div class="modal-action">
          <button class="btn" @click="closeDetails">بستن</button>
        </div>
      </div>
    </dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { Order, OrderStatus } from '@/services/types'
import { listOrders } from '@/services/api'
import { useToast } from 'vue-toastification'

const toast = useToast()

const orders = ref<Order[]>([])
const loading = ref(false)

const detailsModal = ref<HTMLDialogElement | null>(null)
const selectedOrder = ref<Order | null>(null)

function statusLabel(status: OrderStatus) {
  switch (status) {
    case 'completed':
      return 'تکمیل شده'
    case 'paid':
      return 'پرداخت شده'
    case 'canceled':
      return 'کنسل شده'
    default:
      return 'در حال بررسی'
  }
}

function statusBadgeClass(status: OrderStatus) {
  if (status === 'completed' || status === 'paid') return 'badge-success'
  if (status === 'canceled') return 'badge-error'
  return 'badge-warning'
}

function formatDate(iso: string) {
  // simple fallback; you can replace with jalali-lib later
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  return d.toLocaleString('fa-IR')
}

function openDetails(order: Order) {
  selectedOrder.value = order
  detailsModal.value?.showModal()
}

function closeDetails() {
  detailsModal.value?.close()
  selectedOrder.value = null
}

onMounted(async () => {
  loading.value = true
  try {
    orders.value = await listOrders()
  } catch (err: any) {
    console.error(err)
    toast.error(err?.response?.data?.message || 'خطا در دریافت سفارش‌ها')
  } finally {
    loading.value = false
  }
})
</script>

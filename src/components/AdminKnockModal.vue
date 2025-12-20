<template>
  <dialog class="modal" :open="open">
    <div class="modal-box">
      <h3 class="font-bold text-lg">ورود ادمین</h3>
      <p class="py-2 text-sm text-base-content/70">
        کد دسترسی را وارد کنید.
      </p>

      <form @submit.prevent="submit" class="space-y-3">
        <input
            ref="inputRef"
            v-model="code"
            type="password"
            class="input input-bordered w-full"
            placeholder="XXXXXX"
        />

        <div v-if="error" class="alert alert-error text-sm">
          <span>{{ error }}</span>
        </div>

        <div class="modal-action flex justify-end flex-row-reverse gap-2">

          <button type="button" class="btn btn-ghost" @click="close" :disabled="loading">
            بستن
          </button>

          <button type="submit" class="btn btn-primary" :disabled="loading || !code.trim()">
            <span v-if="!loading">ادامه</span>
            <span v-else class="loading loading-spinner loading-sm"></span>
          </button>
        </div>
      </form>
    </div>

    <!-- بک‌دراپ -->
    <form method="dialog" class="modal-backdrop" @submit.prevent="close">
      <button aria-label="close">close</button>
    </form>
  </dialog>
</template>

<script setup lang="ts">
import { nextTick, ref, watch } from "vue";
import { useRouter } from "vue-router";

const props = defineProps<{ open: boolean }>();
const emit = defineEmits<{ (e: "update:open", v: boolean): void }>();

const router = useRouter();

const code = ref("");
const loading = ref(false);
const error = ref<string | null>(null);
const inputRef = ref<HTMLInputElement | null>(null);

watch(
    () => props.open,
    async (v) => {
      if (!v) return;
      code.value = "";
      error.value = null;
      await nextTick();
      inputRef.value?.focus();
    }
);

function close() {
  emit("update:open", false);
}

async function submit() {
  loading.value = true;
  error.value = null;

  try {
    // فعلاً بک‌اند نداری: فقط برای جریان UX گیت موقت می‌ذاریم
    sessionStorage.setItem("admin_gate", "1");
    sessionStorage.setItem("admin_gate_exp", String(Date.now() + 5 * 60 * 1000)); // 5 دقیقه

    close();
    await router.push("/admin/login");
  } catch (e) {
    error.value = "خطایی رخ داد.";
  } finally {
    loading.value = false;
  }
}
</script>

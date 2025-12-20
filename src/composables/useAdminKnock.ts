import { onBeforeUnmount, onMounted, ref } from "vue";

export function useAdminKnock() {
    const isOpen = ref(false);

    const onKeyDown = (e: KeyboardEvent) => {
        const isShortcut =
            e.ctrlKey &&
            e.altKey &&
            (e.key === "A" || e.key === "a");

        if (!isShortcut) return;

        e.preventDefault();
        isOpen.value = true;
    };

    onMounted(() => {
        window.addEventListener("keydown", onKeyDown);
    });

    onBeforeUnmount(() => {
        window.removeEventListener("keydown", onKeyDown);
    });

    return {
        isOpen,
        close: () => (isOpen.value = false),
    };
}

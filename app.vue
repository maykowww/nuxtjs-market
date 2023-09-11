<template>
    <div class="fixed z-[-1] bg-[#F2F2F2] w-screen h-screen" />
    <NuxtPage />

    <MenuOverlay
        :class="[
            {
                'max-h-screen transition-all duration-200 ease-in visible':
                    userStore.isMenuOverlay,
            },
            {
                'max-h-0 transition-all duration-200 ease-out invisible':
                    !userStore.isMenuOverlay,
            },
        ]"
    />
</template>

<script setup>
import { useUserStore } from "./stores/user";
const userStore = useUserStore();

const route = useRoute();

let windowWidth = ref(process.client ? window.innerWidth : "");

onMounted(() => {
    userStore.isMenuOverlay = false;

    window.addEventListener("resize", () => {
        windowWidth.value = window.innerWidth;
    });
});

watch(
    () => windowWidth.value,
    () => {
        if (windowWidth.value >= 767) {
            userStore.isMenuOverlay = false;
        }
    }
);

watch(
    () => route.fullPath,
    () => {
        userStore.isLoading = true;
    }
);
</script>

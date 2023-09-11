<template>
    <MainLayout>
        <div id="ItemPage" class="mt-4 max-w-[1200px] mx-auto px-2">
            <div class="md:flex gap-4 justify-between mx-auto w-full">
                <div class="md:w-[40%]">
                    <img
                        v-if="currentImage"
                        class="rounded-lg object-fit"
                        :src="currentImage"
                        alt=""
                    />

                    <div
                        v-if="images[0] !== ''"
                        class="flex items-center justify-center mt-2"
                    >
                        <div v-for="(image, index) in images" :key="index">
                            <img
                                @mouseover="currentImage = image"
                                @click="currentImage = image"
                                width="70"
                                class="rounded-md object-fit border-[3px] cursor-pointer"
                                :class="
                                    currentImage === image
                                        ? 'border-[#FF5353]'
                                        : ''
                                "
                                :src="image"
                                alt=""
                            />
                        </div>
                    </div>
                </div>

                <div class="md:w-[60%] bg-white p-3 rounded-lg">
                    <div v-if="product">
                        <p class="mb-2">{{ product.title }}</p>
                        <p class="font-light text-[12px] mb-2">
                            {{ product.description }}
                        </p>
                    </div>

                    <div class="flex items-center pt-1.5">
                        <span
                            class="h-4 min-w-4 rounded-full p-0.5 bg-[#FFF000] mr-2"
                        >
                            <Icon
                                name="material-symbols:star-rate"
                                class="-mt-[17px]"
                                size="12"
                            />
                        </span>

                        <p class="text-[#FF5353]">Extra 5% off</p>
                    </div>

                    <div class="flex items-center justify-start my-2">
                        <Icon
                            name="material-symbols:star-rate"
                            color="FF5353"
                        />
                        <Icon
                            name="material-symbols:star-rate"
                            color="FF5353"
                        />
                        <Icon
                            name="material-symbols:star-rate"
                            color="FF5353"
                        />
                        <Icon
                            name="material-symbols:star-rate"
                            color="FF5353"
                        />
                        <Icon
                            name="material-symbols:star-rate"
                            color="FF5353"
                        />
                        <span class="text-[13px] font-light ml-2"
                            >5 213 Reviews 1,000+ orders</span
                        >
                    </div>

                    <div class="border-b"></div>

                    <div class="flex items-center justify-start gap-2 my-2">
                        <div class="text-xl font-bold">
                            $ {{ priceComputed }}
                        </div>
                        <span
                            class="bg-[#F5F5F5] border text-[#C08562] text-[9px] font-semibold px-1.5 rounded-sm"
                            >70% off</span
                        >
                    </div>

                    <p class="text-[#009A66] text-xs font-semibold pt-1">
                        Free 11-day delivery over $8.28
                    </p>

                    <p class="text-[#009A66] text-xs font-semibold pt-1">
                        Free Shipping
                    </p>

                    <div class="py-2"></div>

                    <button
                        @click="addToCart()"
                        :disabled="isInCart"
                        class="px-6 py-2 rounded-lg text-white text-lg font-semibold bg-gradient-to-r from-[#FF851A] to-[#FFAC2C]"
                    >
                        <div v-if="isInCart">Is Added</div>
                        <div v-else>Add to Cart</div>
                    </button>
                </div>
            </div>
        </div>
    </MainLayout>
</template>

<script setup>
import MainLayout from "~/layouts/MainLayout.vue";
import { getProductById } from "~/services/products";
import { useUserStore } from "~/stores/user";

const userStore = useUserStore();

const route = useRoute();

let product = ref(null);
let currentImage = ref(null);

onBeforeMount(async () => {
    product.value = await getProductById(route.params.id);
    userStore.isLoading = false;
});

watchEffect(() => {
    if (product && product.value) {
        const { url } = product.value;
        currentImage.value = url;
        images.value[0] = url;
        userStore.isLoading = false;
    }
    userStore.isLoading = false;
});

const isInCart = computed(() => {
    let res = false;

    userStore.cart.forEach((prod) => {
        if (route.params.id == prod.id) {
            res = true;
        }
    });

    return res;
});

const priceComputed = computed(() => {
    if (product && product.value) {
        return product.value.price / 100;
    }

    return "0.0";
});

const images = ref([
    "",
    "https://picsum.photos/id/212/800/800",
    "https://picsum.photos/id/112/800/800",
    "https://picsum.photos/id/222/800/800",
    "https://picsum.photos/id/242/800/800",
    "https://picsum.photos/id/252/800/800",
]);

const addToCart = () => {
    userStore.cart.push(product.value);
};
</script>

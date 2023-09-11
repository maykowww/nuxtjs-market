<template>
    <MainLayout>
        <div id="CheckoutPage" class="mt-4 max-w-[1200px] mx-auto px-2">
            <div class="md:flex gap-4 justify-between mx-auto w-full">
                <div class="md:w-[65%]">
                    <div class="bg-white rounded-lg p-4">
                        <div class="text-xl font-semibold mb-2">
                            Shipping Address
                        </div>

                        <div v-if="currentAddress">
                            <NuxtLink
                                to="/address"
                                class="flex items-center pb-2 text-blue-500 hover:text-red-400"
                            >
                                <Icon name="mdi:plus" size="18" class="mr-2" />
                                Update Address
                            </NuxtLink>

                            <div class="pt-2 border-t">
                                <div class="underline pb-1">
                                    Delivery Address
                                </div>

                                <ul class="text-xs">
                                    <li class="flex items-center gap-2">
                                        <div>Contact name:</div>
                                        <div class="font-bold">
                                            {{ currentAddress.name }}
                                        </div>
                                    </li>
                                    <li class="flex items-center gap-2">
                                        <div>Address:</div>
                                        <div class="font-bold">
                                            {{ currentAddress.address }}
                                        </div>
                                    </li>
                                    <li class="flex items-center gap-2">
                                        <div>Zip Code:</div>
                                        <div class="font-bold">
                                            {{ currentAddress.zipcode }}
                                        </div>
                                    </li>
                                    <li class="flex items-center gap-2">
                                        <div>City:</div>
                                        <div class="font-bold">
                                            {{ currentAddress.city }}
                                        </div>
                                    </li>
                                    <li class="flex items-center gap-2">
                                        <div>Country:</div>
                                        <div class="font-bold">
                                            {{ currentAddress.country }}
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        <NuxtLink
                            v-else
                            to="/address"
                            class="flex items-center text-blue-500 hover:text-red-400"
                        >
                            <Icon name="mdi:plus" size="18" class="mr-2" />
                            Add New Address
                        </NuxtLink>
                    </div>

                    <div id="Items" class="bg-white rounded-lg p-4 mt-4">
                        <div
                            v-for="product in userStore.checkout"
                            :key="product.id"
                        >
                            <CheckoutItem :product="product" />
                        </div>
                    </div>
                </div>

                <div class="md:hidden block my-4" />

                <div class="md:w-[35%]">
                    <div id="PlaceOrder" class="bg-white rounded-lg p-4">
                        <div class="text-2xl font-extrabold mb-2">Summary</div>

                        <div class="flex items-center justify-between my-4">
                            <div>Total Shipping</div>
                            <div>Free</div>
                        </div>

                        <div class="border-t"></div>

                        <div class="flex items-center justify-between my-4">
                            <div class="font-semibold">Total</div>
                            <div class="text-2xl font-semibold">
                                $
                                <span class="font-extrabold">{{
                                    total / 100
                                }}</span>
                            </div>
                        </div>

                        <form @submit.prevent="pay()">
                            <div
                                class="border border-gray-500 p-2 rounded-sm"
                                id="card-element"
                            />

                            <p
                                id="card-error"
                                role="alert"
                                class="text-red-700 text-center font-semibold"
                            />

                            <button
                                :disabled="isProcessing"
                                type="submit"
                                class="mt-4 bg-gradient-to-r from-[#FE630C] to-[#FF3200] w-full text-white text-[21px] font-semibold p-1.5 rounded-full"
                                :class="
                                    isProcessing ? 'opacity-70' : 'opacity-100'
                                "
                            >
                                <Icon
                                    v-if="isProcessing"
                                    name="eos-icons:loading"
                                />
                                <div v-else>Place Order</div>
                            </button>
                        </form>
                    </div>

                    <div class="bg-white rounded-lg p-4 mt-4">
                        <div class="text-lg font-semibold mb-2 mt-2">
                            AliExpress
                        </div>

                        <p class="my-2">
                            AliExpress keeps your information and payment safe
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </MainLayout>
</template>

<script setup>
definePageMeta({ middleware: "auth" });

import MainLayout from "~/layouts/MainLayout.vue";
import { getPaymentIntent } from "~/services/stripe";
import { getAddressById } from "~/services/addresses";
import { createOrder } from "~/services/orders";
import { useUserStore } from "~/stores/user";
const userStore = useUserStore();
const user = useSupabaseUser();

let stripe = null;
let elements = null;
let card = null;
let form = null;
let total = ref(0);
let clientSecret = null;
let currentAddress = ref(null);
let isProcessing = ref(false);

onBeforeMount(async () => {
    if (userStore.checkout.length < 1) {
        return navigateTo.apply("/shoppingcart");
    }

    total.value = 0.0;

    if (user.value) {
        const response = await getAddressById(user.value.id);

        currentAddress.value = response;

        setTimeout(() => (userStore.isLoading = false), 1000);
    }
});

onMounted(() => {
    isProcessing.value = true;

    userStore.checkout.forEach((item) => {
        total.value += item.price;
    });
});

watch(
    () => total.value,
    () => {
        if (total.value > 0) {
            stripeInit();
        }
    }
);

const stripeInit = async () => {
    const runtimeConfig = useRuntimeConfig();
    stripe = Stripe(runtimeConfig.public.stripePk);

    const res = await getPaymentIntent(total.value);

    clientSecret = res.client_secret;

    elements = stripe.elements();

    const style = {
        base: {
            fontSize: "18px",
        },
        invalid: {
            fontFamily: "Arial, sans-serif",
            color: "#EE4B2B",
            iconColor: "#EE4B2B",
        },
    };

    card = elements.create("card", {
        hidePostalCode: true,
        style,
    });

    card.mount("#card-element");

    card.on("change", (e) => {
        document.querySelector("button").disabled = e.empty;
        document.querySelector("#card-error").textContent = e.error
            ? e.error.message
            : "";
    });

    isProcessing.value = false;
};

const pay = async () => {
    if (currentAddress == "") {
        showError("Please add shipping address");
        return;
    }

    isProcessing.value = true;

    const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: { card },
    });

    if (result.error) {
        showError(result.error.message);
        isProcessing.value = false;
        return;
    } else {
        await create(result.paymentIntent.id);
        userStore.cart = [];
        userStore.checkout = [];
        setTimeout(() => navigateTo("/success"), 1000);
    }
};

const create = async (stripeId) => {
    const { name, address, zipcode, city, country } = currentAddress.value;

    await createOrder({
        body: {
            userId: user.value.id,
            stripeId,
            name,
            address,
            zipcode,
            city,
            country,
            products: userStore.checkout,
        },
    });
};

const showError = (errorMessageText) => {
    let errorMsg = document.querySelector("#card-error").textContent;

    errorMsg = errorMessageText;

    setTimeout(() => {
        errorMsg = "";
    }, 3000);
};
</script>

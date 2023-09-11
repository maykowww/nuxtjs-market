<template>
    <MainLayout>
        <div id="AddressPage" class="mt-4 max-w-[500px] mx-auto px-2">
            <div class="mx-auto bg-white rounded-lg p-3">
                <div class="text-xl text-bold mb-2">Address Details</div>

                <Form
                    v-slot="values"
                    :validationSchema="schema"
                    :initial-values="values"
                    @submit="submit"
                >
                    <TextInput
                        name="contactName"
                        class="w-full"
                        placeholder="Contact Name"
                        inputType="text"
                    />
                    <TextInput
                        name="address"
                        class="w-full mt-2"
                        placeholder="Address"
                        inputType="text"
                    />
                    <TextInput
                        name="zipCode"
                        class="w-full mt-2"
                        placeholder="Zip Code"
                        inputType="text"
                    />
                    <TextInput
                        name="city"
                        class="w-full mt-2"
                        placeholder="City"
                        inputType="text"
                    />
                    <TextInput
                        name="country"
                        class="w-full mt-2"
                        placeholder="Country"
                        inputType="text"
                    />

                    <button
                        :disabled="isWorking"
                        type="submit"
                        class="mt-6 bg-gradient-to-r from-[#FE630C] to-[#FF3200] w-full text-white text-[21px] font-semibold p-1.5 rounded-full"
                    >
                        <div v-if="!isWorking">Update Address</div>
                        <Icon
                            v-else
                            name="eos-icons:loading"
                            size="25"
                            class="mr-2"
                        />
                    </button>
                </Form>
            </div>
        </div>
    </MainLayout>
</template>

<script setup>
import MainLayout from "~/layouts/MainLayout.vue";
import * as yup from "yup";
import { Form, useForm } from "vee-validate";
import { useUserStore } from "~/stores/user";
import {
    getAddressById,
    updateAddress,
    createAddress,
} from "~/services/addresses";
const userStore = useUserStore();
const user = useSupabaseUser();

let currentAddress = ref(null);
let isUpdate = ref(false);
let isWorking = ref(false);

const schema = yup.object({
    contactName: yup.string().required("Contact Name is required."),
    address: yup.string().required("Address is required."),
    zipCode: yup.string().required("Zipcode is required."),
    city: yup.string().required("City is required."),
    country: yup.string().required("Country is required."),
});

const { setValues, values } = useForm();

watchEffect(async () => {
    const response = await getAddressById(user.value.id);

    currentAddress.value = response;

    if (currentAddress.value) {
        setValues({
            contactName: currentAddress.value.name,
            address: currentAddress.value.address,
            zipCode: currentAddress.value.zipcode,
            city: currentAddress.value.city,
            country: currentAddress.value.country,
        });

        isUpdate.value = true;
    }

    userStore.isLoading = false;
});

const submit = async (values) => {
    isWorking.value = true;
    const { contactName, address, zipCode, city, country } = values;

    if (isUpdate.value) {
        await updateAddress({
            id: currentAddress.value.id,
            body: {
                userId: user.value.id,
                name: contactName,
                address,
                zipCode,
                city,
                country,
            },
        });
    } else {
        await createAddress({
            body: {
                userId: user.value.id,
                name: contactName,
                address,
                zipCode,
                city,
                country,
            },
        });
    }

    isWorking = false;

    return navigateTo("/checkout");
};
</script>

<template>
    <div>
        <Field
            :name="name"
            class="w-full bg-white text-gray-800 border text-sm border-[#EFF0EB] rounded-lg p-3 placeholder-gray-500 focus:outline-none"
            @focus="isFocused = true"
            @blue="isFocused = false"
            :class="
                ({ 'border-gray-900': isFocused }, { 'border-gray-500': error })
            "
            :type="inputType"
            :placeholder="placeholder"
        />

        <ErrorMessage
            :name="name"
            class="text-red-500 text-[14px] font-semibold"
        />
    </div>
</template>

<script setup>
import { Field, ErrorMessage } from "vee-validate";
const emit = defineEmits(["update:input"]);

const props = defineProps(["name", "placeholder", "inputType"]);

const { name, placeholder, inputType, error } = toRefs(props);

const isFocused = ref(false);
</script>

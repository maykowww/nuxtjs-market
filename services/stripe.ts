export const getPaymentIntent = async (totalValue: string) => {
    const runtimeConfig = useRuntimeConfig();

    const { data } = await useFetch("/api/stripe/paymentintent", {
        method: "POST",
        headers: {
            Authorization: runtimeConfig.stripePk as string,
        },
        body: {
            amount: totalValue,
        },
    });

    return data.value;
};

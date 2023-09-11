import { Product } from "./products";

export type Order = {
    id: string;
    userId: string;
    stripeId: string;
    name: string;
    address: string;
    zipcode: string;
    city: string;
    country: string;
    products: Product[];
};

export const createOrder = async ({ body }: { body: Order }) => {
    const { data } = await useFetch("/api/prisma/createOrder/", {
        method: "POST",
        body,
    });

    return data.value;
};

export const getOrderById = async (id: string) => {
    const { data } = await useFetch(`/api/prisma/get-orders-by-user/${id}`);

    return data.value;
};

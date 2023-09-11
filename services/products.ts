import { Order } from "./orders";

export type Product = {
    title: string;
    description: string;
    url: string;
    price: number;
    orderItem: Order[];
};

export const searchByName = async (name: string) => {
    const { data } = await useFetch(`/api/prisma/search-by-name/${name}`);

    return data.value;
};

export const getAllProducts = async () => {
    const { data } = await useFetch(`/api/prisma/getProducts`);

    return data.value;
};

export const getProductById = async (id: string) => {
    const { data } = await useFetch(`/api/prisma/product-by-id/${id}`);

    return data.value;
};

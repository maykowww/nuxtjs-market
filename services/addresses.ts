export type Address = {
    userId: string;
    name: string;
    address: string;
    zipCode: string;
    city: string;
    country: string;
};

export const getAddressById = async (id: string) => {
    const { data } = await useFetch(`/api/prisma/get-address-by-user/${id}`);

    return data.value;
};

export const updateAddress = async ({
    id,
    body,
}: {
    id: string;
    body: Address;
}) => {
    const { data } = await useFetch(`/api/prisma/update-address/${id}`, {
        method: "PATCH",
        body,
    });

    return data.value;
};

export const createAddress = async ({
    body,
}: {
    id: string;
    body: Address;
}) => {
    const { data } = await useFetch(`/api/prisma/addAddress`, {
        method: "POST",
        body,
    });

    return data.value;
};

export const searchByName = async (name: string) => {
    const { data } = await useFetch(`/api/prisma/search-by-name/${name}`);

    return data.value;
};

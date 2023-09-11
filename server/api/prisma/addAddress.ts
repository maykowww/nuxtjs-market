import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
    const { userId, name, address, zipCode, city, country } = await readBody(
        event
    );

    try {
        const order = prisma.addresses.create({
            data: { userId, name, address, zipcode: zipCode, city, country },
        });

        return order;
    } catch (error) {
        throw new Error((error as Error).message);
    }
});

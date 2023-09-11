import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
    const { name, address, zipCode, city, country } = await readBody(event);

    const res = await prisma.addresses.update({
        where: { id: Number(event.context.params!.id) },
        data: { name, address, zipcode: zipCode, city, country },
    });

    return res;
});

import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
    const { id } = event.context.params!;
    const res = await prisma.addresses.findFirst({
        where: { userId: id },
    });

    return res;
});

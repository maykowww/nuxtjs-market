import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
    const {
        userId,
        stripeId,
        name,
        address,
        zipcode,
        city,
        country,
        products,
    } = await readBody(event);

    try {
        const order = await prisma.orders.create({
            data: {
                userId,
                stripeId,
                name,
                address,
                zipcode,
                city,
                country,
            },
        });

        products.forEach(async (product: any) => {
            await prisma.orderItem.create({
                data: {
                    orderId: order.id,
                    productId: product.id,
                },
            });
        });

        return order;
    } catch (error) {
        throw new Error((error as Error).message);
    }
});

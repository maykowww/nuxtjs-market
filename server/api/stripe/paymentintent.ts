import Stripe from "stripe";

export default defineEventHandler(async (event) => {
    const { amount } = await readBody(event);
    const stripe = new Stripe(process.env.STRIPE_SK_KEY!, {
        apiVersion: "2023-08-16",
    });

    return await stripe.paymentIntents.create({
        amount: Number(amount),
        currency: "usd",
        automatic_payment_methods: { enabled: true },
    });
});

import Stripe from "stripe";

const stripeKey = process.env.STRIPE_SECRET_KEY || "";

export const stripe = stripeKey
  ? new Stripe(stripeKey, {
      apiVersion: "2026-06-24.dahlia",
      typescript: true,
    })
  : null;

export function getStripe() {
  if (!stripe) {
    throw new Error(
      "STRIPE_SECRET_KEY is not configured. Set it in your environment variables to enable payments."
    );
  }
  return stripe;
}

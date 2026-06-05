import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2026-05-27.dahlia',
  appInfo: {
    name: 'Anubis',
    version: '1.0.0',
  },
});

import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { stripe } from '@/shared/lib/stripe';
import { prisma } from '@/shared/lib';
import { fulfillOrder } from '@/features/payment/stripe/lib/fulfillment';

export async function POST(req: Request) {
  const body = await req.text();
  const headersList = await headers();
  const signature = headersList.get('stripe-signature');

  if (!signature) {
    return NextResponse.json({ error: 'Missing stripe-signature header' }, { status: 400 });
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    console.error('Missing STRIPE_WEBHOOK_SECRET');
    return NextResponse.json({ error: 'Server misconfiguration' }, { status: 500 });
  }

  let event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err: any) {
    console.error(`Webhook signature verification failed: ${err.message}`);
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as any;
        console.log(`[Stripe Webhook] Received event type: ${event.type}`);
        console.log(`[Stripe Webhook] Session ID: ${session.id}`);

        await fulfillOrder(session.id);

        console.log(`[Stripe Webhook] Checkout session processing completed successfully for session ${session.id}`);
        break;
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as any;
        // In a real scenario we'd lookup payment by transactionId (paymentIntent.id)
        // Here we just update payment if we can find it
        const payment = await prisma.payment.findUnique({
          where: { transactionId: paymentIntent.id },
        });

        if (payment) {
          await prisma.payment.update({
            where: { id: payment.id },
            data: { status: 'FAILED' },
          });

          await prisma.order.update({
            where: { id: payment.orderId },
            data: { status: 'FAILED' },
          });
        }
        break;
      }

      case 'checkout.session.expired': {
        const session = event.data.object as any;
        const orderId = session.metadata?.orderId;
        
        if (orderId) {
          await prisma.payment.update({
            where: { orderId },
            data: { status: 'CANCELLED' },
          });

          await prisma.order.update({
            where: { id: orderId },
            data: { status: 'CANCELLED' },
          });
        }
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook error processing event:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { stripe } from '@/shared/lib/stripe';
import { prisma } from '@/shared/lib';
import crypto from 'crypto';

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
        console.log(`[Stripe Webhook] Session Metadata:`, JSON.stringify(session.metadata));

        const { orderId, eventId, quantity, userId } = session.metadata || {};

        if (!orderId || !eventId || !quantity || !userId) {
          const errorMsg = `Missing metadata in checkout session: orderId=${orderId}, eventId=${eventId}, quantity=${quantity}, userId=${userId}`;
          console.error(`[Stripe Webhook] ${errorMsg}`);
          throw new Error(errorMsg);
        }

        // 3. Find Order
        const order = await prisma.order.findUnique({
          where: { id: orderId },
        });
        if (!order) {
          const errorMsg = `Order with ID ${orderId} not found in database`;
          console.error(`[Stripe Webhook] ${errorMsg}`);
          throw new Error(errorMsg);
        }
        console.log(`[Stripe Webhook] Found Order in database:`, JSON.stringify(order));

        // 4. Find Payment
        const payment = await prisma.payment.findUnique({
          where: { orderId },
        });
        if (!payment) {
          const errorMsg = `Payment with orderId ${orderId} not found in database`;
          console.error(`[Stripe Webhook] ${errorMsg}`);
          throw new Error(errorMsg);
        }
        console.log(`[Stripe Webhook] Found Payment in database:`, JSON.stringify(payment));

        console.log(`[Stripe Webhook] session.payment_intent: ${session.payment_intent} (type: ${typeof session.payment_intent})`);

        // Perform updates inside a transaction to guarantee atomic execution of all business logic
        await prisma.$transaction(async (tx) => {
          // 5. Update Payment status
          const updatedPayment = await tx.payment.update({
            where: { orderId },
            data: {
              status: 'PAID',
              transactionId: session.payment_intent as string,
            },
          });
          console.log(`[Stripe Webhook] Updated Payment status to PAID:`, JSON.stringify(updatedPayment));

          // Update Order status
          const updatedOrder = await tx.order.update({
            where: { id: orderId },
            data: { status: 'PAID' },
          });
          console.log(`[Stripe Webhook] Updated Order status to PAID:`, JSON.stringify(updatedOrder));

          // Deduct ticket amount from Event
          const updatedEvent = await tx.event.update({
            where: { id: eventId },
            data: {
              ticketAmount: { decrement: parseInt(quantity, 10) },
            },
          });
          console.log(`[Stripe Webhook] Decremented Event ticket amount:`, JSON.stringify(updatedEvent));

          // 6. Create Ticket and 7. Link Ticket to User
          const ticket = await tx.ticket.create({
            data: {
              userId,
              eventId,
              orderId,
              quantity: parseInt(quantity, 10),
              totalPrice: order.totalAmount,
              status: 'CONFIRMED',
              qrCode: crypto.randomUUID(), // Generate a mock QR code string
            },
          });
          console.log(`[Stripe Webhook] Created Ticket and linked to User ${userId}:`, JSON.stringify(ticket));
        });

        console.log(`[Stripe Webhook] Checkout session processing completed successfully for order ${orderId}`);
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

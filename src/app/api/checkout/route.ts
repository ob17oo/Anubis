import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOption } from '@/shared/lib/auth';
import { prisma } from '@/shared/lib';
import { stripe } from '@/shared/lib/stripe';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOption);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { eventId, ticketTypeId, quantity } = await req.json();

    if (!eventId || !ticketTypeId || !quantity || quantity < 1) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }

    const event = await prisma.event.findUnique({
      where: { id: eventId },
    });

    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    const ticketType = await prisma.ticketType.findUnique({
      where: { id: ticketTypeId },
    });

    if (!ticketType || ticketType.eventId !== eventId) {
      return NextResponse.json({ error: 'Invalid ticket type' }, { status: 400 });
    }

    const availableTickets = ticketType.capacity - ticketType.soldCount;
    if (availableTickets < quantity) {
      return NextResponse.json({ error: 'Not enough tickets available in this category' }, { status: 400 });
    }

    const totalAmount = ticketType.price * quantity;

    // Create Order
    const order = await prisma.order.create({
      data: {
        userId: session.user.id,
        totalAmount,
        status: 'PENDING',
      },
    });

    // Create Payment
    const payment = await prisma.payment.create({
      data: {
        orderId: order.id,
        amount: totalAmount,
        status: 'PENDING',
        provider: 'stripe',
        currency: 'RUB',
      },
    });

    const host = process.env.NEXT_PUBLIC_APP_URL || req.headers.get('origin') || 'http://localhost:3000';

    const stripeSession = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'rub',
            product_data: {
              name: `Билет: ${event.title} (${ticketType.name})`,
              description: `${event.location} - ${event.date.toISOString().split('T')[0]}`,
              images: [event.imageUrl],
            },
            unit_amount: ticketType.price * 100, // Stripe expects amount in cents/kopecks
          },
          quantity,
        },
      ],
      mode: 'payment',
      success_url: `${host}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${host}/payment/cancel`,
      client_reference_id: session.user.id,
      metadata: {
        orderId: order.id,
        eventId: event.id,
        ticketTypeId: ticketType.id,
        quantity: quantity.toString(),
        userId: session.user.id,
      },
    });

    // Save the Stripe Session ID as transactionId for later manual or automatic fulfillment
    await prisma.payment.update({
      where: { orderId: order.id },
      data: { transactionId: stripeSession.id },
    });

    return NextResponse.json({ url: stripeSession.url });
  } catch (error) {
    console.error('Stripe checkout error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

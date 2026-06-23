import { stripe } from "@/shared/lib/stripe"
import { prisma } from "@/shared/lib"
import crypto from "crypto"

export async function fulfillOrder(sessionId: string) {
  console.log(`[Fulfillment] Starting fulfillment for session: ${sessionId}`);

  // 1. Retrieve the session from Stripe
  const session = await stripe.checkout.sessions.retrieve(sessionId);
  if (!session) {
    throw new Error(`Checkout session ${sessionId} not found in Stripe`);
  }

  const { orderId, eventId, ticketTypeId, quantity, userId } = session.metadata || {};

  if (!orderId || !eventId || !ticketTypeId || !quantity || !userId) {
    const errorMsg = `Missing metadata in checkout session: orderId=${orderId}, eventId=${eventId}, ticketTypeId=${ticketTypeId}, quantity=${quantity}, userId=${userId}`;
    console.error(`[Fulfillment] ${errorMsg}`);
    throw new Error(errorMsg);
  }

  // 2. Find Order and Payment
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { tickets: true }
  });

  if (!order) {
    throw new Error(`Order with ID ${orderId} not found in database`);
  }

  // If order is already PAID, skip fulfillment to prevent duplicate tickets
  if (order.status === 'PAID' || order.tickets.length > 0) {
    console.log(`[Fulfillment] Order ${orderId} is already fulfilled or has tickets.`);
    return { order, alreadyFulfilled: true };
  }

  const payment = await prisma.payment.findUnique({
    where: { orderId },
  });

  if (!payment) {
    throw new Error(`Payment with orderId ${orderId} not found in database`);
  }

  // Perform updates inside a transaction to guarantee atomic execution of all business logic
  const result = await prisma.$transaction(async (tx) => {
    // 3. Update Payment status
    const updatedPayment = await tx.payment.update({
      where: { orderId },
      data: {
        status: 'PAID',
        transactionId: (session.payment_intent as string) || sessionId, // Use payment intent ID or fallback to session ID
      },
    });

    // 4. Update Order status
    const updatedOrder = await tx.order.update({
      where: { id: orderId },
      data: { status: 'PAID' },
    });

    // 5. Increment soldCount on TicketType
    const updatedTicketType = await tx.ticketType.update({
      where: { id: ticketTypeId },
      data: {
        soldCount: { increment: parseInt(quantity, 10) },
      },
    });

    // 6. Create Ticket and link to user
    const ticket = await tx.ticket.create({
      data: {
        userId,
        eventId,
        ticketTypeId,
        orderId,
        quantity: parseInt(quantity, 10),
        totalPrice: order.totalAmount,
        status: 'CONFIRMED',
        qrCode: crypto.randomUUID(), // Generate a mock QR code string
      },
    });

    console.log(`[Fulfillment] Fulfill success! Created ticket: ${ticket.id}`);

    return {
      order: updatedOrder,
      payment: updatedPayment,
      ticketType: updatedTicketType,
      ticket,
      alreadyFulfilled: false
    };
  });

  return result;
}

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOption } from '@/shared/lib/auth';
import { prisma } from '@/shared/lib';
import { fulfillOrder } from '@/features/payment/stripe/lib/fulfillment';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOption);
    if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'MODERATOR')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { paymentId } = await req.json();
    if (!paymentId) {
      return NextResponse.json({ error: 'Missing paymentId' }, { status: 400 });
    }

    const payment = await prisma.payment.findUnique({
      where: { id: paymentId },
    });

    if (!payment) {
      return NextResponse.json({ error: 'Payment not found' }, { status: 404 });
    }

    if (payment.status === 'PAID') {
      return NextResponse.json({ success: true, message: 'Payment is already PAID' });
    }

    if (!payment.transactionId || !payment.transactionId.startsWith('cs_')) {
      return NextResponse.json({ 
        error: 'No active Stripe Checkout Session ID found. Manual fulfillment is only supported for Stripe orders.' 
      }, { status: 400 });
    }

    const result = await fulfillOrder(payment.transactionId);

    return NextResponse.json({ success: true, result });
  } catch (error: any) {
    console.error('[Admin Fulfillment API] Error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}

import { requireUser } from '@/lib/server/auth';
import { getPaymentCollection } from '@/lib/server/db/payments';
import { errorResponse } from '@/lib/server/utils/response';
import { NextResponse } from 'next/server';

// ----------------- GET -----------------
export async function GET() {
  try {
    const { userId } = await requireUser();

    const paymentCollection = await getPaymentCollection();

    const now = new Date();
    const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1).getTime();
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1).getTime();

    const pipeline = [
      {
        $match: {
          isDeleted: false,
          userId,
          createdAt: { $gte: startOfLastMonth },
        },
      },
      {
        $project: {
          amount: 1,
          month: {
            $cond: [{ $gte: ['$createdAt', startOfThisMonth] }, 'thisMonth', 'lastMonth'],
          },
        },
      },
      {
        $group: {
          _id: '$month',
          totalRevenue: { $sum: '$amount' },
        },
      },
    ];

    const results = await paymentCollection.aggregate(pipeline).toArray();

    let thisMonthRevenue = 0;
    let lastMonthRevenue = 0;

    for (const entry of results) {
      if (entry._id === 'thisMonth') thisMonthRevenue = entry.totalRevenue;
      if (entry._id === 'lastMonth') lastMonthRevenue = entry.totalRevenue;
    }

    return NextResponse.json({ thisMonthRevenue, lastMonthRevenue }, { status: 200 });
  } catch (error) {
    return errorResponse('Failed to fetch user-specific revenue stats', error, 400);
  }
}

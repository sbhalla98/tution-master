import { requireUser } from '@/lib/server/auth';
import { getStudentActivityLogCollection, getStudentCollection } from '@/lib/server/db/students';
import { errorResponse } from '@/lib/server/utils/response';
import dayjs from 'dayjs';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { userId } = await requireUser();
    const studentCollection = await getStudentCollection();
    const activityCollection = await getStudentActivityLogCollection();

    const endOfLastMonth = dayjs().subtract(1, 'month').endOf('month').valueOf();

    // Step 1: Get all students for the user (only id and deletedAt)
    const students = await studentCollection
      .find({ userId }, { projection: { id: 1, deletedAt: 1 } })
      .toArray();

    const studentMap = new Map<string, EpochTimeStamp | null>(
      students.map((s) => [s.id, s.deletedAt ?? null])
    );

    const studentIds = Array.from(studentMap.keys());

    if (studentIds.length === 0) {
      return NextResponse.json({
        currentActiveCount: 0,
        activeAtEndOfLastMonth: 0,
      });
    }

    // Step 2: Get latest status change before end of last month
    const statusLogs = await activityCollection
      .aggregate([
        {
          $match: {
            studentId: { $in: studentIds },
            userId,
            type: 'status_changed',
            timestamp: { $lte: endOfLastMonth },
          },
        },
        { $sort: { timestamp: -1 } },
        {
          $group: {
            _id: '$studentId',
            lastStatus: { $first: '$meta.to' },
            lastChangeTime: { $first: '$timestamp' },
          },
        },
      ])
      .toArray();

    // Step 3: Filter active students as of last month's end
    const activeAtEndOfLastMonth = statusLogs.filter(({ _id, lastStatus }) => {
      const deletedAt = studentMap.get(_id);
      const notDeleted = !deletedAt || deletedAt > endOfLastMonth;
      return lastStatus === 'active' && notDeleted;
    }).length;

    // Step 4: Count current active students
    const currentActiveCount = await studentCollection.countDocuments({
      userId,
      status: 'active',
      isDeleted: false,
    });

    return NextResponse.json({
      currentActiveCount,
      activeAtEndOfLastMonth,
    });
  } catch (error) {
    return errorResponse('Failed to fetch student activity stats', error);
  }
}

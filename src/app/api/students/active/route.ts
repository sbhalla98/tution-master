import { requireUser } from '@/lib/server/auth';
import { getStudentActivityLogCollection, getStudentCollection } from '@/lib/server/db/students';
import { errorResponse } from '@/lib/server/utils/response';
import dayjs from 'dayjs';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const { userId } = await requireUser();
    const studentCollection = await getStudentCollection();
    const activityCollection = await getStudentActivityLogCollection();

    const endOfLastMonth = dayjs().subtract(1, 'month').endOf('month').valueOf();

    // Step 1: Get all students for the user (only id and deletedAt)
    const students = await studentCollection
      .find({ userId }, { projection: { deletedAt: 1, id: 1 } })
      .toArray();

    const studentMap = new Map<string, EpochTimeStamp | null>(
      students.map((s) => [s.id, s.deletedAt ?? null])
    );

    const studentIds = Array.from(studentMap.keys());

    if (studentIds.length === 0) {
      return NextResponse.json({
        activeAtEndOfLastMonth: 0,
        currentActiveCount: 0,
      });
    }

    // Step 2: Get latest status change before end of last month
    const statusLogs = await activityCollection
      .aggregate([
        {
          $match: {
            studentId: { $in: studentIds },
            timestamp: { $lte: endOfLastMonth },
            type: 'status_changed',
            userId,
          },
        },
        { $sort: { timestamp: -1 } },
        {
          $group: {
            _id: '$studentId',
            lastChangeTime: { $first: '$timestamp' },
            lastStatus: { $first: '$meta.to' },
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
      isDeleted: false,
      status: 'active',
      userId,
    });

    return NextResponse.json({
      activeAtEndOfLastMonth,
      currentActiveCount,
    });
  } catch (error) {
    return errorResponse('Failed to fetch student activity stats', error);
  }
}

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// Helper to resolve the active employee/team-lead user ID
async function resolveCurrentUserId(): Promise<{ id: string; name: string; organizationId: string | null; avatar?: string | null }> {
  try {
    const session = await getServerSession(authOptions);
    if (session?.user?.email) {
      const dbUser = await prisma.user.findUnique({
        where: { email: session.user.email },
        select: { id: true, name: true, organizationId: true, avatar: true },
      });
      if (dbUser) return dbUser;
    }
  } catch (err) {
    console.warn("Could not read NextAuth session:", err);
  }

  // Fallback to Team Lead Sarah Chen in database
  const tlUser = await prisma.user.findFirst({
    where: {
      OR: [
        { role: "TEAM_LEAD" },
        { email: "teamlead@roacs.com" },
        { name: "Sarah Chen" },
      ],
    },
    select: { id: true, name: true, organizationId: true, avatar: true },
  });

  if (tlUser) return tlUser;

  // Fallback to first user in database
  const firstUser = await prisma.user.findFirst({
    select: { id: true, name: true, organizationId: true, avatar: true },
  });

  if (!firstUser) {
    throw new Error("No user accounts found in database.");
  }

  return firstUser;
}

// Get local YYYY-MM-DD string
function getTodayDateString(): string {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

// GET /api/team-lead/attendance - Fetch current attendance status & today's record
export async function GET(req: NextRequest) {
  try {
    const currentUser = await resolveCurrentUserId();
    const todayStr = getTodayDateString();
    const includeHistory = req.nextUrl.searchParams.get("history") === "true";

    // Query today's attendance record
    const todayRecord = await prisma.attendanceRecord.findUnique({
      where: {
        employeeId_date: {
          employeeId: currentUser.id,
          date: todayStr,
        },
      },
    });

    const isCheckedIn = Boolean(todayRecord?.checkIn && !todayRecord?.checkOut);
    const isCompletedToday = Boolean(todayRecord?.checkIn && todayRecord?.checkOut);

    let elapsedSeconds = 0;
    if (isCheckedIn && todayRecord?.checkIn) {
      elapsedSeconds = Math.max(
        0,
        Math.floor((Date.now() - new Date(todayRecord.checkIn).getTime()) / 1000)
      );
    }

    let historyRecords: Array<{
      id: string;
      employeeId: string;
      organizationId: string | null;
      date: string;
      checkIn: Date | null;
      checkOut: Date | null;
      workHours: number;
      status: string;
      createdAt: Date;
      updatedAt: Date;
    }> = [];
    if (includeHistory) {
      historyRecords = await prisma.attendanceRecord.findMany({
        where: {
          employeeId: currentUser.id,
        },
        orderBy: {
          date: "desc",
        },
        take: 50,
      });
    }

    return NextResponse.json({
      success: true,
      user: {
        id: currentUser.id,
        name: currentUser.name,
        avatar: currentUser.avatar,
      },
      todayDate: todayStr,
      isCheckedIn,
      isCompletedToday,
      checkInTime: todayRecord?.checkIn?.toISOString() || null,
      checkOutTime: todayRecord?.checkOut?.toISOString() || null,
      elapsedSeconds,
      workHours: todayRecord?.workHours || 0,
      status: todayRecord?.status || "Yet to check-in",
      todayRecord,
      history: historyRecords,
    });
  } catch (error) {
    console.error("Error fetching attendance:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch attendance records",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// POST /api/team-lead/attendance - Check-in or Check-out
export async function POST(req: NextRequest) {
  try {
    const currentUser = await resolveCurrentUserId();
    const body = await req.json();
    const action = body.action; // "check-in" | "check-out"
    const todayStr = getTodayDateString();
    const now = new Date();

    if (action === "check-in") {
      // Check if already checked in and not checked out
      const existing = await prisma.attendanceRecord.findUnique({
        where: {
          employeeId_date: {
            employeeId: currentUser.id,
            date: todayStr,
          },
        },
      });

      if (existing?.checkIn && !existing?.checkOut) {
        // Already checked in, return current active state
        const elapsed = Math.max(
          0,
          Math.floor((now.getTime() - new Date(existing.checkIn).getTime()) / 1000)
        );
        return NextResponse.json({
          success: true,
          message: "Already checked in",
          isCheckedIn: true,
          checkInTime: existing.checkIn.toISOString(),
          elapsedSeconds: elapsed,
          record: existing,
        });
      }

      // Determine late / on-time based on 9:30 AM
      const hours = now.getHours();
      const minutes = now.getMinutes();
      const isLate = hours > 9 || (hours === 9 && minutes > 30);
      const status = isLate ? "Late" : "On Time";

      const record = await prisma.attendanceRecord.upsert({
        where: {
          employeeId_date: {
            employeeId: currentUser.id,
            date: todayStr,
          },
        },
        create: {
          employeeId: currentUser.id,
          organizationId: currentUser.organizationId,
          date: todayStr,
          checkIn: now,
          checkOut: null,
          status,
          workHours: 0,
        },
        update: {
          checkIn: now,
          checkOut: null,
          status,
          workHours: 0,
        },
      });

      return NextResponse.json({
        success: true,
        message: "Checked in successfully",
        isCheckedIn: true,
        checkInTime: record.checkIn?.toISOString(),
        elapsedSeconds: 0,
        status: record.status,
        record,
      });
    }

    if (action === "check-out") {
      const existing = await prisma.attendanceRecord.findUnique({
        where: {
          employeeId_date: {
            employeeId: currentUser.id,
            date: todayStr,
          },
        },
      });

      if (!existing || !existing.checkIn) {
        return NextResponse.json(
          { error: "No active check-in record found for today to check out." },
          { status: 400 }
        );
      }

      // Calculate total worked hours
      const checkInTime = new Date(existing.checkIn);
      const diffMs = Math.max(0, now.getTime() - checkInTime.getTime());
      const workHours = parseFloat((diffMs / (1000 * 60 * 60)).toFixed(2));

      const record = await prisma.attendanceRecord.update({
        where: { id: existing.id },
        data: {
          checkOut: now,
          workHours,
        },
      });

      return NextResponse.json({
        success: true,
        message: "Checked out successfully",
        isCheckedIn: false,
        checkInTime: record.checkIn?.toISOString(),
        checkOutTime: record.checkOut?.toISOString(),
        workHours: record.workHours,
        status: record.status,
        record,
      });
    }

    return NextResponse.json(
      { error: "Invalid action. Expected 'check-in' or 'check-out'." },
      { status: 400 }
    );
  } catch (error) {
    console.error("Error processing attendance action:", error);
    return NextResponse.json(
      {
        error: "Failed to process attendance action",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// DELETE /api/team-lead/attendance - Reset today's punch (for testing/cleanup)
export async function DELETE(req: NextRequest) {
  try {
    const currentUser = await resolveCurrentUserId();
    const todayStr = getTodayDateString();

    await prisma.attendanceRecord.deleteMany({
      where: {
        employeeId: currentUser.id,
        date: todayStr,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Today's attendance record cleared.",
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete attendance record", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}


import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// Helper to resolve the active employee/team-lead user ID
async function resolveCurrentUserId(): Promise<{ id: string; name: string; avatar?: string | null }> {
  try {
    const session = await getServerSession(authOptions);
    if (session?.user?.email) {
      const dbUser = await prisma.user.findUnique({
        where: { email: session.user.email },
        select: { id: true, name: true, avatar: true },
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
    select: { id: true, name: true, avatar: true },
  });

  if (tlUser) return tlUser;

  // Ultimate fallback to first user in database
  const firstUser = await prisma.user.findFirst({
    select: { id: true, name: true, avatar: true },
  });

  if (!firstUser) {
    throw new Error("No user accounts found in database. Please run seed.");
  }

  return firstUser;
}

// GET /api/team-lead/leave - Fetch all leave requests for current user
export async function GET(req: NextRequest) {
  try {
    const currentUser = await resolveCurrentUserId();

    const dbLeaves = await prisma.leaveRequest.findMany({
      where: {
        employeeId: currentUser.id,
      },
      include: {
        employee: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const formatted = dbLeaves.map((leave) => {
      // Parse days from duration e.g. "2 days" -> 2 or "0.5 days" -> 0.5
      const daysMatch = leave.duration.match(/[\d.]+/);
      const days = daysMatch ? parseFloat(daysMatch[0]) : 1;

      return {
        id: leave.id,
        employeeId: leave.employeeId,
        employeeName: leave.employee?.name || currentUser.name,
        employeeAvatar: leave.employee?.avatar || "SC",
        leaveTypeId: leave.type.toLowerCase().replace(/\s+/g, "-"),
        leaveTypeName: leave.type,
        startDate: leave.startDate.toISOString().split("T")[0],
        endDate: leave.endDate.toISOString().split("T")[0],
        days,
        duration: leave.duration,
        reason: leave.note || "",
        status: leave.status as "Pending" | "Approved" | "Rejected",
        managerName: leave.escalatedBy || "Amira Patel (VP of Engineering)",
        appliedAt: leave.createdAt.toISOString(),
        updatedAt: leave.updatedAt.toISOString(),
      };
    });

    return NextResponse.json({ success: true, data: formatted });
  } catch (error: any) {
    console.error("GET /api/team-lead/leave error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch leave requests" },
      { status: 500 }
    );
  }
}

// POST /api/team-lead/leave - Create a new leave request in MySQL
export async function POST(req: NextRequest) {
  try {
    const currentUser = await resolveCurrentUserId();
    const body = await req.json();

    const {
      leaveTypeName,
      startDate,
      endDate,
      days,
      reason,
      isHalfDay = false,
      halfDaySession = "First Half",
      emergencyContact = "",
      managerName = "Amira Patel (VP of Engineering)",
    } = body;

    if (!leaveTypeName || !startDate || !reason?.trim()) {
      return NextResponse.json(
        { success: false, error: "Missing required leave parameters." },
        { status: 400 }
      );
    }

    const effectiveEndDate = isHalfDay ? startDate : (endDate || startDate);
    const calculatedDays = isHalfDay ? 0.5 : (typeof days === "number" ? days : 1);
    const durationStr = isHalfDay ? "0.5 days" : `${calculatedDays} ${calculatedDays === 1 ? "day" : "days"}`;

    // Construct detailed note
    const noteParts = [reason.trim()];
    if (isHalfDay) noteParts.push(`Session: ${halfDaySession}`);
    if (emergencyContact.trim()) noteParts.push(`Contact: ${emergencyContact.trim()}`);
    const fullNote = noteParts.join(" | ");

    const created = await prisma.leaveRequest.create({
      data: {
        employeeId: currentUser.id,
        type: leaveTypeName,
        startDate: new Date(startDate),
        endDate: new Date(effectiveEndDate),
        duration: durationStr,
        note: fullNote,
        status: "Pending",
        escalatedBy: managerName,
      },
      include: {
        employee: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
      },
    });

    const responseItem = {
      id: created.id,
      employeeId: created.employeeId,
      employeeName: created.employee?.name || currentUser.name,
      employeeAvatar: created.employee?.avatar || "SC",
      leaveTypeId: created.type.toLowerCase().replace(/\s+/g, "-"),
      leaveTypeName: created.type,
      startDate: created.startDate.toISOString().split("T")[0],
      endDate: created.endDate.toISOString().split("T")[0],
      days: calculatedDays,
      duration: created.duration,
      reason: created.note || "",
      status: created.status as "Pending",
      managerName: created.escalatedBy || managerName,
      appliedAt: created.createdAt.toISOString(),
      updatedAt: created.updatedAt.toISOString(),
    };

    return NextResponse.json({ success: true, data: responseItem }, { status: 201 });
  } catch (error: any) {
    console.error("POST /api/team-lead/leave error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to submit leave request to database" },
      { status: 500 }
    );
  }
}

// DELETE /api/team-lead/leave - Cancel/delete a pending leave request
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ success: false, error: "Leave ID is required" }, { status: 400 });
    }

    const leave = await prisma.leaveRequest.findUnique({
      where: { id },
    });

    if (!leave) {
      return NextResponse.json({ success: false, error: "Leave request not found" }, { status: 404 });
    }

    if (leave.status !== "Pending") {
      return NextResponse.json(
        { success: false, error: "Only pending leave requests can be cancelled." },
        { status: 400 }
      );
    }

    await prisma.leaveRequest.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: "Leave request cancelled successfully." });
  } catch (error: any) {
    console.error("DELETE /api/team-lead/leave error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to cancel leave request" },
      { status: 500 }
    );
  }
}

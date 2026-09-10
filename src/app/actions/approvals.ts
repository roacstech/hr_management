// @ts-nocheck
"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getEscalatedLeaves(filter: "All" | "Pending" | "Approved" = "Pending") {
  try {
    const whereClause: any = {};
    if (filter !== "All") {
      whereClause.status = filter;
    }

    const leaves = await prisma.leaveRequest.findMany({
      where: whereClause,
      include: {
        employee: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return leaves.map((leave) => ({
      id: leave.id,
      employee: leave.employee.name,
      type: leave.type,
      from: new Date(leave.startDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      to: new Date(leave.endDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      duration: leave.duration,
      note: leave.note || "No notes provided.",
      escalatedBy: leave.escalatedBy || "System",
      status: leave.status,
    }));
  } catch (error) {
    console.error("Error fetching escalated leaves:", error);
    return [];
  }
}

export async function getEscalatedPayroll() {
  try {
    const payroll = await prisma.payrollAdjustment.findMany({
      where: {
        status: "Pending",
      },
      include: {
        employee: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return payroll.map((adj) => ({
      id: adj.id,
      employee: adj.employee.name,
      type: adj.type,
      amount: `$${adj.amount.toFixed(2)}`,
      reason: adj.reason,
      escalatedBy: adj.escalatedBy || "System",
      status: adj.status,
    }));
  } catch (error) {
    console.error("Error fetching escalated payroll:", error);
    return [];
  }
}

export async function updateLeaveStatus(id: string, status: "Approved" | "Rejected") {
  try {
    await prisma.leaveRequest.update({
      where: { id },
      data: { status },
    });
    revalidatePath("/manager-dashboard/approvals");
    return { success: true };
  } catch (error) {
    console.error("Error updating leave status:", error);
    return { success: false, error: "Failed to update status" };
  }
}

export async function updatePayrollStatus(id: string, status: "Approved" | "Rejected") {
  try {
    await prisma.payrollAdjustment.update({
      where: { id },
      data: { status },
    });
    revalidatePath("/manager-dashboard/approvals");
    return { success: true };
  } catch (error) {
    console.error("Error updating payroll status:", error);
    return { success: false, error: "Failed to update status" };
  }
}

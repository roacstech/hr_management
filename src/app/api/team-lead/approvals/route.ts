import { NextRequest, NextResponse } from "next/server";
import { tenantStore } from "@/lib/tenant-store";

export interface UnifiedApprovalItem {
  id: string;
  category: "LEAVE" | "CORRECTION";
  employeeName: string;
  employeeAvatar?: string;
  title: string;
  subtitle: string;
  dates: string;
  reason: string;
  status: "Pending" | "Approved" | "Rejected";
  appliedAt: string;
  reviewedBy?: string;
  reviewedAt?: string;
  rejectionReason?: string;
  meta?: string;
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.max(1, parseInt(searchParams.get("limit") || "10", 10));
    const tab = searchParams.get("tab") || "ALL";
    const orgId = searchParams.get("orgId") || "org-roacs";
    const search = (searchParams.get("search") || "").toLowerCase().trim();

    const state = tenantStore.getState();
    const leaveRequests = (state.leaveRequests || []).filter((l) => l.organizationId === orgId);
    const timesheetCorrections = (state.timesheetCorrections || []).filter((c) => c.organizationId === orgId);

    const allLeaveItems: UnifiedApprovalItem[] = leaveRequests.map((l) => ({
      id: l.id,
      category: "LEAVE",
      employeeName: l.employeeName,
      employeeAvatar: l.employeeAvatar || "EM",
      title: `${l.leaveTypeName} (${l.days} ${l.days === 1 ? "Day" : "Days"})`,
      subtitle: "Time-Off Application",
      dates: `${l.startDate} to ${l.endDate}`,
      reason: l.reason,
      status: l.status,
      appliedAt: l.appliedAt,
      reviewedBy: l.reviewedBy,
      reviewedAt: l.reviewedAt,
      meta: "PTO Balance: 8.0 Days Remaining",
    }));

    const allCorrectionItems: UnifiedApprovalItem[] = timesheetCorrections.map((c) => ({
      id: c.id,
      category: "CORRECTION",
      employeeName: c.employeeName,
      employeeAvatar: c.employeeAvatar || "EM",
      title: `${c.type}`,
      subtitle: `Target Punch: ${c.requestedTime}`,
      dates: `Work Date: ${c.date}`,
      reason: c.reason,
      status: c.status,
      appliedAt: c.appliedAt,
      reviewedBy: c.reviewedBy,
      reviewedAt: c.reviewedAt,
      rejectionReason: c.rejectionReason,
      meta: c.originalTime ? `Original recorded: ${c.originalTime}` : "No punch recorded",
    }));

    const allCombined = [...allLeaveItems, ...allCorrectionItems].sort((a, b) => {
      // Show pending items first, then by date applied descending
      if (a.status === "Pending" && b.status !== "Pending") return -1;
      if (a.status !== "Pending" && b.status === "Pending") return 1;
      return new Date(b.appliedAt || "").getTime() - new Date(a.appliedAt || "").getTime();
    });

    const pendingLeaves = allLeaveItems.filter((i) => i.status === "Pending");
    const pendingCorrections = allCorrectionItems.filter((i) => i.status === "Pending");
    const resolvedItems = allCombined.filter((i) => i.status !== "Pending");

    const counts = {
      all: allCombined.length,
      leave: allLeaveItems.length,
      correction: allCorrectionItems.length,
      resolved: resolvedItems.length,
      pending: pendingLeaves.length + pendingCorrections.length,
    };

    let filtered = allCombined;
    if (tab === "LEAVE") {
      filtered = allLeaveItems;
    } else if (tab === "CORRECTION") {
      filtered = allCorrectionItems;
    } else if (tab === "RESOLVED") {
      filtered = resolvedItems;
    }

    if (search) {
      filtered = filtered.filter(
        (i) =>
          i.employeeName.toLowerCase().includes(search) ||
          i.title.toLowerCase().includes(search) ||
          i.reason.toLowerCase().includes(search) ||
          i.dates.toLowerCase().includes(search)
      );
    }

    const totalItems = filtered.length;
    const totalPages = Math.max(1, Math.ceil(totalItems / limit));
    const safePage = Math.min(page, totalPages);
    const startIndex = (safePage - 1) * limit;
    const paginatedItems = filtered.slice(startIndex, startIndex + limit);

    return NextResponse.json({
      success: true,
      items: paginatedItems,
      pagination: {
        page: safePage,
        limit,
        totalItems,
        totalPages,
        hasNextPage: safePage < totalPages,
        hasPrevPage: safePage > 1,
      },
      counts,
    });
  } catch (err: any) {
    console.error("Error fetching approvals:", err);
    return NextResponse.json({ error: "Failed to fetch approvals", details: err?.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const orgId = body.orgId || "org-roacs";
    const reviewerName = body.reviewerName || "Team Lead";

    // Handle Bulk Approval
    if (body.bulk && Array.isArray(body.items)) {
      body.items.forEach((item: { id: string; category: "LEAVE" | "CORRECTION" }) => {
        if (item.category === "LEAVE") {
          tenantStore.approveLeaveRequest(orgId, item.id, reviewerName);
        } else {
          tenantStore.approveTimesheetCorrection(orgId, item.id, reviewerName);
        }
      });
      return NextResponse.json({ success: true, count: body.items.length });
    }

    const { id, type, action, reason } = body;
    if (!id || !type || !action) {
      return NextResponse.json({ error: "Missing required fields: id, type, action" }, { status: 400 });
    }

    if (type === "LEAVE") {
      if (action === "APPROVE") {
        tenantStore.approveLeaveRequest(orgId, id, reviewerName);
      } else {
        tenantStore.rejectLeaveRequest(orgId, id, reviewerName, reason);
      }
    } else {
      if (action === "APPROVE") {
        tenantStore.approveTimesheetCorrection(orgId, id, reviewerName);
      } else {
        tenantStore.rejectTimesheetCorrection(orgId, id, reviewerName, reason);
      }
    }

    return NextResponse.json({ success: true, id, status: action === "APPROVE" ? "Approved" : "Rejected" });
  } catch (err: any) {
    console.error("Error handling approval action:", err);
    return NextResponse.json({ error: "Failed to update approval", details: err?.message }, { status: 500 });
  }
}

"use client";

import { useState, useEffect, useCallback } from "react";
import { useTenant } from "@/context/TenantContext";
import { PlusIcon, CloseIcon } from "@/components/SidebarIcons";

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

interface PaginationMeta {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

interface CountsMeta {
  all: number;
  leave: number;
  correction: number;
  resolved: number;
  pending: number;
}

export default function ApprovalsDeskPage() {
  const {
    currentOrg,
    approveLeaveRequest,
    rejectLeaveRequest,
    approveTimesheetCorrection,
    rejectTimesheetCorrection,
    showToast,
  } = useTenant();

  const [activeTab, setActiveTab] = useState<"ALL" | "LEAVE" | "CORRECTION" | "RESOLVED">("ALL");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize] = useState<number>(10);
  const [items, setItems] = useState<UnifiedApprovalItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta>({
    page: 1,
    limit: 10,
    totalItems: 0,
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false,
  });
  const [counts, setCounts] = useState<CountsMeta>({
    all: 0,
    leave: 0,
    correction: 0,
    resolved: 0,
    pending: 0,
  });

  const [rejectionModal, setRejectionModal] = useState<{
    isOpen: boolean;
    id: string;
    type: "LEAVE" | "CORRECTION";
    name: string;
    reason: string;
  }>({
    isOpen: false,
    id: "",
    type: "LEAVE",
    name: "",
    reason: "",
  });

  const [selectedViewItem, setSelectedViewItem] = useState<UnifiedApprovalItem | null>(null);

  const currentOrgId = currentOrg?.id || "org-roacs";

  // Fetch paginated approvals from server
  const fetchApprovals = useCallback(
    async (page: number, tab: string) => {
      setIsLoading(true);
      try {
        const res = await fetch(
          `/api/team-lead/approvals?page=${page}&limit=${pageSize}&tab=${tab}&orgId=${currentOrgId}`
        );
        if (res.ok) {
          const data = await res.json();
          setItems(data.items || []);
          if (data.pagination) {
            setPagination(data.pagination);
          }
          if (data.counts) {
            setCounts(data.counts);
          }
        }
      } catch (err) {
        console.error("Failed to fetch approvals from server", err);
      } finally {
        setIsLoading(false);
      }
    },
    [currentOrgId, pageSize]
  );

  // Initial and reactive fetch on page / tab change
  useEffect(() => {
    fetchApprovals(currentPage, activeTab);
  }, [currentPage, activeTab, fetchApprovals]);

  // Tab change handler
  const handleTabChange = (tab: "ALL" | "LEAVE" | "CORRECTION" | "RESOLVED") => {
    setActiveTab(tab);
    setCurrentPage(1);
    setSelectedIds([]);
  };

  // Single item approval: stays in the table with status updated
  const handleApproveSingle = async (item: UnifiedApprovalItem) => {
    // 1. Optimistically update item in local table state so it stays in the table with updated status
    setItems((prev) =>
      prev.map((i) =>
        i.id === item.id
          ? {
              ...i,
              status: "Approved",
              reviewedBy: "Sarah Chen",
              reviewedAt: new Date().toISOString(),
            }
          : i
      )
    );

    // 2. Adjust counts
    setCounts((prev) => ({
      ...prev,
      pending: Math.max(0, prev.pending - 1),
      resolved: prev.resolved + 1,
    }));

    // 3. Update tenantContext so tenantStore (localStorage, dock badge, notifications) stays synced
    if (item.category === "LEAVE") {
      approveLeaveRequest(item.id, "Sarah Chen");
    } else {
      approveTimesheetCorrection(item.id, "Sarah Chen");
    }

    // 4. Update server
    try {
      await fetch("/api/team-lead/approvals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: item.id,
          type: item.category,
          action: "APPROVE",
          reviewerName: "Sarah Chen",
          orgId: currentOrgId,
        }),
      });
    } catch (e) {
      console.error("Failed to sync approval with server", e);
    }

    // 5. Remove from selections if selected
    setSelectedIds((prev) => prev.filter((id) => id !== item.id));
  };

  const handleOpenReject = (item: UnifiedApprovalItem) => {
    setRejectionModal({
      isOpen: true,
      id: item.id,
      type: item.category,
      name: item.employeeName,
      reason: "",
    });
  };

  // Single item rejection: stays in the table with status updated
  const handleConfirmReject = async (e: React.FormEvent) => {
    e.preventDefault();
    const { id, type, reason } = rejectionModal;

    // 1. Optimistically update item in local table state so it stays in the table with updated status
    setItems((prev) =>
      prev.map((i) =>
        i.id === id
          ? {
              ...i,
              status: "Rejected",
              rejectionReason: reason,
              reviewedBy: "Sarah Chen",
              reviewedAt: new Date().toISOString(),
            }
          : i
      )
    );

    // 2. Adjust counts
    setCounts((prev) => ({
      ...prev,
      pending: Math.max(0, prev.pending - 1),
      resolved: prev.resolved + 1,
    }));

    // 3. Update tenantContext
    if (type === "LEAVE") {
      rejectLeaveRequest(id, "Sarah Chen", reason);
    } else {
      rejectTimesheetCorrection(id, "Sarah Chen", reason);
    }

    // 4. Update server
    try {
      await fetch("/api/team-lead/approvals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id,
          type,
          action: "REJECT",
          reviewerName: "Sarah Chen",
          reason,
          orgId: currentOrgId,
        }),
      });
    } catch (e) {
      console.error("Failed to sync rejection with server", e);
    }

    setSelectedIds((prev) => prev.filter((item) => item !== id));
    setRejectionModal((prev) => ({ ...prev, isOpen: false }));
  };

  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Select all pending items currently on page
  const pendingPageItems = items.filter((i) => i.status === "Pending");
  const isAllPageSelected =
    pendingPageItems.length > 0 &&
    pendingPageItems.every((item) => selectedIds.includes(item.id));

  const handleSelectAll = () => {
    if (isAllPageSelected) {
      const pagePendingIds = new Set(pendingPageItems.map((i) => i.id));
      setSelectedIds((prev) => prev.filter((id) => !pagePendingIds.has(id)));
    } else {
      const pagePendingIds = pendingPageItems.map((i) => i.id);
      setSelectedIds((prev) => Array.from(new Set([...prev, ...pagePendingIds])));
    }
  };

  // Bulk approve: updates all selected items and keeps them in table
  const handleBulkApprove = async () => {
    const selectedItems = items.filter((i) => selectedIds.includes(i.id));

    // 1. Optimistic update
    setItems((prev) =>
      prev.map((i) =>
        selectedIds.includes(i.id)
          ? {
              ...i,
              status: "Approved",
              reviewedBy: "Sarah Chen",
              reviewedAt: new Date().toISOString(),
            }
          : i
      )
    );

    setCounts((prev) => ({
      ...prev,
      pending: Math.max(0, prev.pending - selectedIds.length),
      resolved: prev.resolved + selectedIds.length,
    }));

    // 2. Context updates
    selectedItems.forEach((item) => {
      if (item.category === "LEAVE") {
        approveLeaveRequest(item.id, "Sarah Chen");
      } else {
        approveTimesheetCorrection(item.id, "Sarah Chen");
      }
    });

    // 3. Server bulk update
    try {
      await fetch("/api/team-lead/approvals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bulk: true,
          items: selectedItems.map((i) => ({ id: i.id, category: i.category })),
          reviewerName: "Sarah Chen",
          orgId: currentOrgId,
        }),
      });
    } catch (e) {
      console.error("Failed to sync bulk approval with server", e);
    }

    showToast(`Bulk approved ${selectedIds.length} team request(s)!`, "success");
    setSelectedIds([]);
  };

  return (
    <div className="space-y-6 pb-16 font-sans">
      {/* 1. Header Banner & Filters */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-gray-200/90 shadow-xs flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">
        {/* Left: Title, Pending Count & Bulk Action Controls */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center space-x-2.5">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
              Team Approvals Desk
            </h1>
            {/* {counts.pending > 0 && (
              <span className="text-[11px] font-bold text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-full animate-pulse">
                {counts.pending} Awaiting Decision
              </span>
            )} */}
          </div>

          {selectedIds.length > 0 && (
            <div className="flex items-center space-x-2 sm:pl-3 sm:border-l sm:border-gray-200 animate-in fade-in zoom-in-95 duration-150">
              <button
                type="button"
                onClick={handleBulkApprove}
                className="inline-flex items-center px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-xs font-bold rounded-lg shadow-sm transition cursor-pointer"
              >
                Approve Selected ({selectedIds.length})
              </button>
              <button
                type="button"
                onClick={() => setSelectedIds([])}
                className="px-2.5 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold rounded-lg transition cursor-pointer"
              >
                Clear Selection
              </button>
            </div>
          )}
        </div>

        {/* Right: Category Tabs (Always isolated, neatly aligned, never wraps unevenly with bulk buttons) */}
        <div className="flex flex-wrap items-center gap-1 text-xs shrink-0">
          {[
            { id: "ALL", label: `All Requests (${counts.all})` },
            { id: "LEAVE", label: `Leave & PTO (${counts.leave})` },
            { id: "CORRECTION", label: `Timesheet Corrections (${counts.correction})` },
            { id: "RESOLVED", label: `History (${counts.resolved})` },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => handleTabChange(tab.id as any)}
              className={`px-3.5 py-2 rounded-lg font-semibold transition cursor-pointer ${
                activeTab === tab.id
                  ? "bg-blue-600 text-white shadow-xs"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* 2. Requests Table List with Server-Side Pagination */}
      <div className="bg-white rounded-lg border border-gray-200/90 shadow-xs overflow-hidden">
        {isLoading && items.length === 0 ? (
          <div className="p-16 text-center flex flex-col items-center justify-center">
            <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mb-3" />
            <p className="text-xs text-gray-500 font-medium">Loading requests...</p>
          </div>
        ) : items.length === 0 ? (
          <div className="p-12 text-center flex flex-col items-center justify-center">
            <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-base font-bold text-gray-900">All Caught Up!</h3>
            <p className="text-xs text-gray-500 mt-1 max-w-sm">
              There are currently no items pending your approval in this view.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-200 bg-slate-100/90 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                  {activeTab !== "RESOLVED" && (
                    <th className="py-3 px-4 w-8">
                      {pendingPageItems.length > 0 ? (
                        <input
                          type="checkbox"
                          checked={isAllPageSelected}
                          onChange={handleSelectAll}
                          className="w-4 h-4 rounded text-blue-600 border-gray-300 focus:ring-blue-500 cursor-pointer align-middle"
                          title={isAllPageSelected ? "Deselect all on this page" : "Select all pending on this page"}
                        />
                      ) : (
                        <div className="w-4 h-4" />
                      )}
                    </th>
                  )}
                  <th className="py-3 px-4">Employee</th>
                  <th className="py-3 px-4">Request Type</th>
                  <th className="py-3 px-4">Dates / Details</th>
                  <th className="py-3 px-4">Employee Note</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-xs">
                {items.map((item) => {
                  const isSelected = selectedIds.includes(item.id);
                  const isPending = item.status === "Pending";

                  return (
                    <tr
                      key={item.id}
                      className={`hover:bg-gray-50/70 transition-colors ${
                        isSelected ? "bg-blue-50/40" : ""
                      }`}
                    >
                      {/* Checkbox: selectable only if Pending */}
                      {activeTab !== "RESOLVED" && (
                        <td className="py-3.5 px-4">
                          {isPending ? (
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => handleToggleSelect(item.id)}
                              className="w-4 h-4 rounded text-blue-600 border-gray-300 focus:ring-blue-500 cursor-pointer"
                            />
                          ) : (
                            <div className="w-4 h-4" />
                          )}
                        </td>
                      )}

                      {/* Employee */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 rounded-xl bg-slate-800 text-white font-bold flex items-center justify-center text-xs shrink-0">
                            {item.employeeAvatar}
                          </div>
                          <span className="font-bold text-gray-900 leading-tight">
                            {item.employeeName}
                          </span>
                        </div>
                      </td>

                      {/* Request Type */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className="font-bold text-gray-800 leading-tight">
                          {item.title}
                        </span>
                      </td>

                      {/* Dates */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className="font-semibold text-gray-800 leading-tight">
                          {item.dates}
                        </span>
                      </td>

                      {/* Reason */}
                      <td className="py-3.5 px-4 max-w-xs">
                        <p className="text-gray-700 text-xs truncate" title={item.reason}>
                          {item.reason}
                        </p>
                      </td>

                      {/* Status badge: vertically centered, whitespace-nowrap preventing awkward wraps */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        {item.status === "Pending" && (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 whitespace-nowrap">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mr-1.5 animate-pulse shrink-0" />
                            Pending Review
                          </span>
                        )}
                        {item.status === "Approved" && (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 whitespace-nowrap">
                            Approved
                          </span>
                        )}
                        {item.status === "Rejected" && (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-100 text-rose-800 whitespace-nowrap">
                            Rejected
                          </span>
                        )}
                      </td>

                      {/* Actions: View Eye Icon + Approve/Reject or Decided */}
                      <td className="py-3.5 px-5 text-right whitespace-nowrap">
                        <div className="inline-flex items-center space-x-1.5">
                          {/* View Eye Icon */}
                          <button
                            type="button"
                            onClick={() => setSelectedViewItem(item)}
                            className="p-1.5 rounded-lg text-gray-500 hover:text-blue-600 hover:bg-blue-50 border border-gray-200 transition cursor-pointer"
                            title="View full details"
                          >
                            <svg
                              className="w-4 h-4"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                              <circle cx="12" cy="12" r="3" />
                            </svg>
                          </button>

                          {item.status === "Pending" ? (
                            <>
                              <button
                                type="button"
                                onClick={() => handleApproveSingle(item)}
                                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold text-xs rounded-lg transition shadow-xs cursor-pointer"
                              >
                                Approve
                              </button>
                              <button
                                type="button"
                                onClick={() => handleOpenReject(item)}
                                className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200/80 font-semibold text-xs rounded-lg transition cursor-pointer"
                              >
                                Reject
                              </button>
                            </>
                          ) : (
                            <span className="inline-flex items-center px-2 py-1 text-[11px] font-medium text-gray-400 italic">
                              Decided
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* 3. Server-Side Pagination Controls */}
        {pagination.totalItems > 0 && (
          <div className="px-5 py-4 border-t border-gray-100 bg-gray-50/50 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs select-none">
            <div className="text-gray-500">
              Showing{" "}
              <span className="font-semibold text-gray-900">
                {(pagination.page - 1) * pagination.limit + 1}
              </span>{" "}
              to{" "}
              <span className="font-semibold text-gray-900">
                {Math.min(pagination.page * pagination.limit, pagination.totalItems)}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-gray-900">{pagination.totalItems}</span> requests
            </div>

            <div className="flex items-center space-x-1.5">
              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={!pagination.hasPrevPage || isLoading}
                className={`px-3 py-1.5 rounded-lg font-semibold border transition flex items-center space-x-1 ${
                  !pagination.hasPrevPage || isLoading
                    ? "border-gray-200 text-gray-300 bg-gray-50 cursor-not-allowed"
                    : "border-gray-200 text-gray-700 bg-white hover:bg-gray-100 active:scale-95 shadow-xs cursor-pointer"
                }`}
              >
                Previous
              </button>

              {/* Numbered Page Buttons */}
              {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setCurrentPage(p)}
                  disabled={isLoading}
                  className={`w-8 h-8 rounded-lg font-semibold transition cursor-pointer text-xs ${
                    currentPage === p
                      ? "bg-blue-600 text-white shadow-xs"
                      : "text-gray-700 hover:bg-gray-100 border border-gray-200/80 bg-white"
                  }`}
                >
                  {p}
                </button>
              ))}

              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.min(pagination.totalPages, p + 1))}
                disabled={!pagination.hasNextPage || isLoading}
                className={`px-3 py-1.5 rounded-lg font-semibold border transition flex items-center space-x-1 ${
                  !pagination.hasNextPage || isLoading
                    ? "border-gray-200 text-gray-300 bg-gray-50 cursor-not-allowed"
                    : "border-gray-200 text-gray-700 bg-white hover:bg-gray-100 active:scale-95 shadow-xs cursor-pointer"
                }`}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 4. Rejection Reason Modal */}
      {rejectionModal.isOpen && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 backdrop-blur-[1px] animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-200 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-gray-900">
                Reject Request
              </h3>
              <button
                type="button"
                onClick={() => setRejectionModal((prev) => ({ ...prev, isOpen: false }))}
                className="text-gray-400 hover:text-gray-600 p-1 cursor-pointer"
              >
                <CloseIcon size={18} />
              </button>
            </div>

            <p className="text-xs text-gray-500 mb-4">
              Specify a reason for declining the request from{" "}
              <span className="font-bold text-gray-800">{rejectionModal.name}</span>. This feedback
              will be logged in their request history.
            </p>

            <form onSubmit={handleConfirmReject} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Reason for Rejection
                </label>
                <textarea
                  rows={3}
                  required
                  value={rejectionModal.reason}
                  onChange={(e) =>
                    setRejectionModal((prev) => ({ ...prev, reason: e.target.value }))
                  }
                  className="w-full text-xs p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-500 focus:outline-none transition resize-none"
                  placeholder="e.g. Critical release sprint deadline overlapping..."
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setRejectionModal((prev) => ({ ...prev, isOpen: false }))}
                  className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-xl transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl transition shadow-sm cursor-pointer"
                >
                  Confirm Rejection
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 5. View Full Details Modal */}
      {selectedViewItem && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 backdrop-blur-[1px] animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-gray-200 animate-in zoom-in-95 duration-200 space-y-5">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <div className="flex items-center space-x-3">
                <div className="w-11 h-11 rounded-2xl bg-slate-900 text-white font-black flex items-center justify-center text-sm shadow-md">
                  {selectedViewItem.employeeAvatar}
                </div>
                <div>
                  <h3 className="text-base font-bold text-gray-900">
                    {selectedViewItem.employeeName}
                  </h3>
                  <div className="flex items-center space-x-2 mt-0.5">
                    <span
                      className={`px-2 py-0.5 rounded text-[10.5px] font-bold ${
                        selectedViewItem.category === "LEAVE"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-purple-100 text-purple-800"
                      }`}
                    >
                      {selectedViewItem.category === "LEAVE" ? "Leave Request" : "Punch Correction"}
                    </span>
                    <span className="text-[11px] text-gray-400">
                      Applied: {selectedViewItem.appliedAt ? new Date(selectedViewItem.appliedAt).toLocaleString() : "Recent"}
                    </span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedViewItem(null)}
                className="text-gray-400 hover:text-gray-600 p-1.5 rounded-lg hover:bg-gray-100 transition cursor-pointer"
              >
                <CloseIcon size={18} />
              </button>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-2 gap-3.5 bg-gray-50/70 p-4 rounded-xl border border-gray-100 text-xs">
              <div>
                <span className="text-gray-400 font-medium block">Request Type</span>
                <span className="font-bold text-gray-900 mt-0.5 block">{selectedViewItem.title}</span>
                {selectedViewItem.subtitle && (
                  <span className="text-[11px] text-gray-500 mt-0.5 block">{selectedViewItem.subtitle}</span>
                )}
              </div>

              <div>
                <span className="text-gray-400 font-medium block">Status</span>
                <div className="mt-1">
                  {selectedViewItem.status === "Pending" && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mr-1.5 animate-pulse" />
                      Pending Review
                    </span>
                  )}
                  {selectedViewItem.status === "Approved" && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800">
                      Approved
                    </span>
                  )}
                  {selectedViewItem.status === "Rejected" && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-100 text-rose-800">
                      Rejected
                    </span>
                  )}
                </div>
              </div>

              <div className="col-span-2 border-t border-gray-200/60 pt-2.5">
                <span className="text-gray-400 font-medium block">Dates / Schedule</span>
                <span className="font-semibold text-gray-800 mt-0.5 block">{selectedViewItem.dates}</span>
                {selectedViewItem.meta && (
                  <span className="text-[11px] text-gray-500 mt-0.5 block">{selectedViewItem.meta}</span>
                )}
              </div>

              {selectedViewItem.reviewedBy && (
                <div className="col-span-2 border-t border-gray-200/60 pt-2.5">
                  <span className="text-gray-400 font-medium block">Review Details</span>
                  <span className="text-gray-700 block mt-0.5">
                    Decided by <strong className="text-gray-900">{selectedViewItem.reviewedBy}</strong>
                    {selectedViewItem.reviewedAt ? ` on ${new Date(selectedViewItem.reviewedAt).toLocaleString()}` : ""}
                  </span>
                </div>
              )}
            </div>

            {/* Note Section */}
            <div className="space-y-1.5">
              <span className="text-xs font-semibold text-gray-700">Employee Explanation</span>
              <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-200/70 text-xs text-gray-700 leading-relaxed">
                {selectedViewItem.reason || "No comments provided."}
              </div>
            </div>

            {/* Rejection Note */}
            {selectedViewItem.rejectionReason && (
              <div className="space-y-1.5">
                <span className="text-xs font-semibold text-rose-700">Rejection Note</span>
                <div className="p-3 rounded-xl bg-rose-50/70 border border-rose-200 text-xs text-rose-700 leading-relaxed">
                  {selectedViewItem.rejectionReason}
                </div>
              </div>
            )}

            {/* Footer */}
            <div className="flex items-center justify-end space-x-2 pt-2 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setSelectedViewItem(null)}
                className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-xl transition cursor-pointer"
              >
                Close
              </button>

              {selectedViewItem.status === "Pending" && (
                <>
                  <button
                    type="button"
                    onClick={() => {
                      const itemToReject = selectedViewItem;
                      setSelectedViewItem(null);
                      handleOpenReject(itemToReject);
                    }}
                    className="px-4 py-2 text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-xl transition cursor-pointer"
                  >
                    Reject
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      handleApproveSingle(selectedViewItem);
                      setSelectedViewItem((prev) => (prev ? { ...prev, status: "Approved" } : null));
                    }}
                    className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition shadow-sm cursor-pointer"
                  >
                    Approve
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

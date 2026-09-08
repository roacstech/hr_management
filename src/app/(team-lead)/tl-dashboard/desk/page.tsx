"use client";

import { useState } from "react";
import { useTenant } from "@/context/TenantContext";
import { PlusIcon, CloseIcon, LeaveTrackerIcon, TimeTrackerIcon } from "@/components/SidebarIcons";

export default function ApprovalsDeskPage() {
  const {
    leaveRequests,
    timesheetCorrections,
    approveLeaveRequest,
    rejectLeaveRequest,
    approveTimesheetCorrection,
    rejectTimesheetCorrection,
    showToast,
  } = useTenant();

  const [activeTab, setActiveTab] = useState<"ALL" | "LEAVE" | "CORRECTION" | "RESOLVED">("ALL");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
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
    reason: "Sprint delivery crunch / operational overlap",
  });

  // Direct team requests: pending leaves + pending corrections
  const pendingLeaves = leaveRequests.filter((l) => l.status === "Pending");
  const pendingCorrections = timesheetCorrections.filter((c) => c.status === "Pending");
  const resolvedLeaves = leaveRequests.filter((l) => l.status !== "Pending");
  const resolvedCorrections = timesheetCorrections.filter((c) => c.status !== "Pending");

  const totalPending = pendingLeaves.length + pendingCorrections.length;

  // Unified items list
  interface UnifiedApprovalItem {
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
    rejectionReason?: string;
    meta?: string;
  }

  const allItems: UnifiedApprovalItem[] = [
    ...pendingLeaves.map((l) => ({
      id: l.id,
      category: "LEAVE" as const,
      employeeName: l.employeeName,
      employeeAvatar: l.employeeAvatar || "EM",
      title: `${l.leaveTypeName} (${l.days} ${l.days === 1 ? "Day" : "Days"})`,
      subtitle: "Time-Off Application",
      dates: `${l.startDate} to ${l.endDate}`,
      reason: l.reason,
      status: l.status,
      appliedAt: l.appliedAt,
      meta: "PTO Balance: 8.0 Days Remaining",
    })),
    ...pendingCorrections.map((c) => ({
      id: c.id,
      category: "CORRECTION" as const,
      employeeName: c.employeeName,
      employeeAvatar: c.employeeAvatar || "EM",
      title: `${c.type}`,
      subtitle: `Target Punch: ${c.requestedTime}`,
      dates: `Work Date: ${c.date}`,
      reason: c.reason,
      status: c.status,
      appliedAt: c.appliedAt,
      meta: c.originalTime ? `Original recorded: ${c.originalTime}` : "No punch recorded",
    })),
  ];

  const resolvedItems: UnifiedApprovalItem[] = [
    ...resolvedLeaves.map((l) => ({
      id: l.id,
      category: "LEAVE" as const,
      employeeName: l.employeeName,
      employeeAvatar: l.employeeAvatar || "EM",
      title: `${l.leaveTypeName} (${l.days} Days)`,
      subtitle: "Time-Off Application",
      dates: `${l.startDate} to ${l.endDate}`,
      reason: l.reason,
      status: l.status,
      appliedAt: l.appliedAt,
    })),
    ...resolvedCorrections.map((c) => ({
      id: c.id,
      category: "CORRECTION" as const,
      employeeName: c.employeeName,
      employeeAvatar: c.employeeAvatar || "EM",
      title: `${c.type}`,
      subtitle: `Target Punch: ${c.requestedTime}`,
      dates: `Work Date: ${c.date}`,
      reason: c.reason,
      status: c.status,
      appliedAt: c.appliedAt,
      rejectionReason: c.rejectionReason,
    })),
  ];

  const displayedItems =
    activeTab === "ALL"
      ? allItems
      : activeTab === "LEAVE"
      ? allItems.filter((i) => i.category === "LEAVE")
      : activeTab === "CORRECTION"
      ? allItems.filter((i) => i.category === "CORRECTION")
      : resolvedItems;

  const handleApproveSingle = (item: UnifiedApprovalItem) => {
    if (item.category === "LEAVE") {
      approveLeaveRequest(item.id, "Sarah Chen");
    } else {
      approveTimesheetCorrection(item.id, "Sarah Chen");
    }
    setSelectedIds((prev) => prev.filter((id) => id !== item.id));
  };

  const handleOpenReject = (item: UnifiedApprovalItem) => {
    setRejectionModal({
      isOpen: true,
      id: item.id,
      type: item.category,
      name: item.employeeName,
      reason: "Scheduling conflict during project milestone deadline",
    });
  };

  const handleConfirmReject = (e: React.FormEvent) => {
    e.preventDefault();
    if (rejectionModal.type === "LEAVE") {
      rejectLeaveRequest(rejectionModal.id, "Sarah Chen", rejectionModal.reason);
    } else {
      rejectTimesheetCorrection(rejectionModal.id, "Sarah Chen", rejectionModal.reason);
    }
    setSelectedIds((prev) => prev.filter((id) => id !== rejectionModal.id));
    setRejectionModal({ ...rejectionModal, isOpen: false });
  };

  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedIds.length === displayedItems.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(displayedItems.map((i) => i.id));
    }
  };

  const handleBulkApprove = () => {
    selectedIds.forEach((id) => {
      const item = displayedItems.find((i) => i.id === id);
      if (item) {
        if (item.category === "LEAVE") {
          approveLeaveRequest(item.id, "Sarah Chen");
        } else {
          approveTimesheetCorrection(item.id, "Sarah Chen");
        }
      }
    });
    showToast(`Bulk approved ${selectedIds.length} team request(s)!`, "success");
    setSelectedIds([]);
  };

  return (
    <div className="space-y-6 pb-16 font-sans">
      {/* 1. Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-200/90 shadow-xs">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-[11px] font-bold text-amber-700 bg-amber-50 border border-amber-200/60 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              Instant Authorization Desk
            </span>
            {totalPending > 0 && (
              <span className="text-[11px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full animate-pulse">
                {totalPending} Awaiting Decision
              </span>
            )}
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mt-2 tracking-tight">
            Team Approvals Desk
          </h1>
          <p className="text-gray-500 text-xs mt-0.5 max-w-2xl">
            Instantly review, approve or reject standard daily operational items including leave requests, time-off, and timesheet punch regularizations.
          </p>
        </div>
        {selectedIds.length > 0 && (
          <div className="flex items-center space-x-2.5 shrink-0 animate-in fade-in zoom-in-95 duration-150">
            <button
              type="button"
              onClick={handleBulkApprove}
              className="inline-flex items-center px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow-sm transition cursor-pointer"
            >
              Approve Selected ({selectedIds.length})
            </button>
            <button
              type="button"
              onClick={() => setSelectedIds([])}
              className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold rounded-lg transition cursor-pointer"
            >
              Clear Selection
            </button>
          </div>
        )}
      </div>

      {/* 2. Top Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-gray-200/90 shadow-xs space-y-1">
          <p className="text-xs text-gray-500 font-medium">Pending Approvals</p>
          <p className="text-2xl font-extrabold text-amber-600">{totalPending}</p>
          <span className="text-[11px] text-amber-700 font-medium">Requires immediate response</span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gray-200/90 shadow-xs space-y-1">
          <p className="text-xs text-gray-500 font-medium">Leave & PTO Requests</p>
          <p className="text-2xl font-extrabold text-blue-600">{pendingLeaves.length}</p>
          <span className="text-[11px] text-gray-400 font-medium">Annual, casual, & sick leave</span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gray-200/90 shadow-xs space-y-1">
          <p className="text-xs text-gray-500 font-medium">Timesheet Corrections</p>
          <p className="text-2xl font-extrabold text-indigo-600">{pendingCorrections.length}</p>
          <span className="text-[11px] text-gray-400 font-medium">Missed clock-outs & WFH</span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gray-200/90 shadow-xs space-y-1">
          <p className="text-xs text-gray-500 font-medium">Resolved This Month</p>
          <p className="text-2xl font-extrabold text-emerald-600">{resolvedItems.length}</p>
          <span className="text-[11px] text-emerald-700 font-medium">Audited in system</span>
        </div>
      </div>

      {/* 3. Category Tabs */}
      <div className="bg-white p-2 rounded-xl border border-gray-200/90 shadow-xs flex items-center justify-between">
        <div className="flex flex-wrap items-center gap-1 text-xs">
          {[
            { id: "ALL", label: `All Requests (${allItems.length})` },
            { id: "LEAVE", label: `Leave & PTO (${pendingLeaves.length})` },
            { id: "CORRECTION", label: `Timesheet Corrections (${pendingCorrections.length})` },
            { id: "RESOLVED", label: `History (${resolvedItems.length})` },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => {
                setActiveTab(tab.id as any);
                setSelectedIds([]);
              }}
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

        {activeTab !== "RESOLVED" && displayedItems.length > 0 && (
          <button
            type="button"
            onClick={handleSelectAll}
            className="text-xs text-blue-600 hover:underline font-semibold px-3 py-1 cursor-pointer"
          >
            {selectedIds.length === displayedItems.length ? "Deselect All" : "Select All"}
          </button>
        )}
      </div>

      {/* 4. Requests List */}
      <div className="bg-white rounded-2xl border border-gray-200/90 shadow-xs overflow-hidden">
        {displayedItems.length === 0 ? (
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
                <tr className="border-b border-gray-100 bg-gray-50/60 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
                  {activeTab !== "RESOLVED" && <th className="py-3 px-4 w-8" />}
                  <th className="py-3 px-4">Employee</th>
                  <th className="py-3 px-4">Request Type</th>
                  <th className="py-3 px-4">Work / Leave Dates</th>
                  <th className="py-3 px-4">Reason & Details</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-xs">
                {displayedItems.map((item) => {
                  const isSelected = selectedIds.includes(item.id);

                  return (
                    <tr
                      key={item.id}
                      className={`hover:bg-gray-50/70 transition-colors ${
                        isSelected ? "bg-blue-50/40" : ""
                      }`}
                    >
                      {/* Checkbox */}
                      {activeTab !== "RESOLVED" && (
                        <td className="py-3.5 px-4">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handleToggleSelect(item.id)}
                            className="w-4 h-4 rounded text-blue-600 border-gray-300 focus:ring-blue-500 cursor-pointer"
                          />
                        </td>
                      )}

                      {/* Employee */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-9 h-9 rounded-xl bg-slate-800 text-white font-bold flex items-center justify-center text-xs shrink-0">
                            {item.employeeAvatar}
                          </div>
                          <div>
                            <p className="font-bold text-gray-900 leading-tight">
                              {item.employeeName}
                            </p>
                            <p className="text-[11px] text-gray-400 mt-0.5">
                              {item.appliedAt ? new Date(item.appliedAt).toLocaleDateString() : "Recent"}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Request Type */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center space-x-2">
                          <span
                            className={`px-2 py-0.5 rounded text-[10.5px] font-bold ${
                              item.category === "LEAVE"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-purple-100 text-purple-800"
                            }`}
                          >
                            {item.category === "LEAVE" ? "Leave" : "Punch Correction"}
                          </span>
                        </div>
                        <p className="font-bold text-gray-800 mt-1 leading-tight">{item.title}</p>
                        <p className="text-[11px] text-gray-400">{item.subtitle}</p>
                      </td>

                      {/* Dates */}
                      <td className="py-3.5 px-4">
                        <p className="font-semibold text-gray-800 leading-tight">{item.dates}</p>
                        {item.meta && (
                          <p className="text-[11px] text-gray-400 mt-0.5 font-medium">{item.meta}</p>
                        )}
                      </td>

                      {/* Reason */}
                      <td className="py-3.5 px-4 max-w-xs">
                        <p className="text-gray-700 leading-relaxed text-[11.5px]">{item.reason}</p>
                        {item.rejectionReason && (
                          <p className="text-[11px] text-rose-600 font-semibold mt-1">
                            Rejection Note: {item.rejectionReason}
                          </p>
                        )}
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4">
                        {item.status === "Pending" && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mr-1.5 animate-pulse" />
                            Pending Review
                          </span>
                        )}
                        {item.status === "Approved" && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800">
                            Approved
                          </span>
                        )}
                        {item.status === "Rejected" && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-100 text-rose-800">
                            Rejected
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-5 text-right whitespace-nowrap">
                        {item.status === "Pending" ? (
                          <div className="inline-flex items-center space-x-1.5">
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
                          </div>
                        ) : (
                          <span className="text-[11px] text-gray-400 font-medium italic">
                            Decided
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 5. Rejection Reason Modal */}
      {rejectionModal.isOpen && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 backdrop-blur-[1px] animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-200 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <h3 className="text-base font-bold text-gray-900 tracking-tight">
                Reject Request
              </h3>
              <button
                onClick={() => setRejectionModal({ ...rejectionModal, isOpen: false })}
                className="w-7 h-7 rounded-md bg-gray-100 hover:bg-gray-200 text-gray-500 flex items-center justify-center cursor-pointer"
              >
                <CloseIcon className="w-3.5 h-3.5" />
              </button>
            </div>

            <form onSubmit={handleConfirmReject} className="space-y-4 pt-4 text-xs">
              <p className="text-gray-600 leading-relaxed">
                Provide feedback or justification for rejecting the request submitted by{" "}
                <span className="font-bold text-gray-900">{rejectionModal.name}</span>.
              </p>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  Reason for Rejection
                </label>
                <textarea
                  rows={3}
                  required
                  value={rejectionModal.reason}
                  onChange={(e) =>
                    setRejectionModal({ ...rejectionModal, reason: e.target.value })
                  }
                  className="w-full bg-white text-sm border border-gray-300 rounded-lg p-3 focus:ring-1 focus:ring-rose-500"
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setRejectionModal({ ...rejectionModal, isOpen: false })}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-lg transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-lg shadow-sm transition cursor-pointer"
                >
                  Confirm Rejection
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

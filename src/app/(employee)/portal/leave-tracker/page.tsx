"use client";

import { useState, useMemo, useEffect } from "react";
import { useTenant } from "@/context/TenantContext";
import CalendarPicker from "@/components/CalendarPicker";

export default function ApplyLeavePage() {
  const {
    currentOrg,
    leavePolicies,
    leaveRequests,
    teamLeadProfile,
    applyLeaveRequest,
    cancelLeaveRequest,
    showToast,
  } = useTenant();

  // Drawer state (Offcanvas from right side)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Selected leave detail modal state
  const [selectedRequest, setSelectedRequest] = useState<any | null>(null);

  // Cancellation confirmation modal state
  const [cancelTargetRequest, setCancelTargetRequest] = useState<any | null>(null);
  const [isCancelling, setIsCancelling] = useState(false);

  // Filter & Search states
  const [activeTab, setActiveTab] = useState<"All" | "Pending" | "Approved" | "Rejected">("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTypeFilter, setSelectedTypeFilter] = useState("All");

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  // Initial empty form state
  const initialFormState = {
    leaveTypeId: "",
    leaveTypeName: "",
    startDate: "",
    endDate: "",
    isHalfDay: false,
    halfDaySession: "First Half" as "First Half" | "Second Half",
    reason: "",
    emergencyContact: "",
  };

  // Apply Form State
  const defaultManager = teamLeadProfile?.reportingManager || "Amira Patel (VP of Engineering)";

  const [formData, setFormData] = useState(initialFormState);

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Drawer handlers to always ensure fresh empty state
  const handleOpenDrawer = () => {
    setFormData(initialFormState);
    setIsDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    setFormData(initialFormState);
  };

  // Handle ESC key to close drawer and modals
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (cancelTargetRequest) {
          setCancelTargetRequest(null);
        } else if (selectedRequest) {
          setSelectedRequest(null);
        } else if (isDrawerOpen) {
          handleCloseDrawer();
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [cancelTargetRequest, selectedRequest, isDrawerOpen]);

  // Reset form whenever drawer closes
  useEffect(() => {
    if (!isDrawerOpen) {
      setFormData(initialFormState);
    }
  }, [isDrawerOpen]);

  // Update leaveTypeName when leaveTypeId changes
  const handleLeaveTypeChange = (typeId: string) => {
    const policy = leavePolicies.find((p) => p.id === typeId);
    setFormData((prev) => ({
      ...prev,
      leaveTypeId: typeId,
      leaveTypeName: policy ? policy.name : "",
    }));
  };

  // Calculate day count automatically
  const calculatedDays = useMemo(() => {
    if (!formData.startDate) return 0;
    if (formData.isHalfDay) return 0.5;
    if (!formData.endDate) return 1;
    const start = new Date(formData.startDate);
    const end = new Date(formData.endDate);
    if (end < start) return 0;
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return diffDays;
  }, [formData.startDate, formData.endDate, formData.isHalfDay]);

  // Database leaves state
  const [dbLeaves, setDbLeaves] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch real leaves from database API
  const fetchLeaves = async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/team-lead/leave");
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        setDbLeaves(json.data);
      }
    } catch (err) {
      console.error("Failed to load leave records from database:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, []);

  // Filter leaves belonging to Employee from database
  const myLeaves = useMemo(() => {
    return [...dbLeaves].sort(
      (a, b) => new Date(b.appliedAt || "").getTime() - new Date(a.appliedAt || "").getTime()
    );
  }, [dbLeaves]);

  // Tab counts
  const counts = useMemo(() => {
    return {
      all: myLeaves.length,
      pending: myLeaves.filter((r) => r.status === "Pending").length,
      approved: myLeaves.filter((r) => r.status === "Approved").length,
      rejected: myLeaves.filter((r) => r.status === "Rejected").length,
    };
  }, [myLeaves]);

  // Filtered and searched leave items
  const filteredLeaves = useMemo(() => {
    return myLeaves.filter((item) => {
      // Tab filter
      if (activeTab !== "All" && item.status !== activeTab) return false;

      // Type filter
      if (selectedTypeFilter !== "All" && item.leaveTypeName !== selectedTypeFilter) return false;

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchReason = item.reason?.toLowerCase().includes(q);
        const matchType = item.leaveTypeName?.toLowerCase().includes(q);
        const matchStart = item.startDate?.includes(q);
        const matchEnd = item.endDate?.includes(q);
        const matchManager = item.managerName?.toLowerCase().includes(q) || item.reviewedBy?.toLowerCase().includes(q);
        if (!matchReason && !matchType && !matchStart && !matchEnd && !matchManager) {
          return false;
        }
      }

      return true;
    });
  }, [myLeaves, activeTab, selectedTypeFilter, searchQuery]);

  // Pagination calculation
  const totalItems = filteredLeaves.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

  // Reset to page 1 if current page is out of bounds
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(1);
    }
  }, [totalPages, currentPage]);

  const paginatedLeaves = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredLeaves.slice(startIndex, startIndex + pageSize);
  }, [filteredLeaves, currentPage, pageSize]);

  // Handle Form Submit (Persist to MySQL database)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.leaveTypeId) {
      showToast("Please select a leave type.", "error");
      return;
    }

    if (!formData.startDate || (!formData.isHalfDay && !formData.endDate) || !formData.reason.trim()) {
      showToast("Please fill in all mandatory fields.", "error");
      return;
    }

    if (!formData.isHalfDay && new Date(formData.endDate) < new Date(formData.startDate)) {
      showToast("End date cannot be prior to start date.", "error");
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        leaveTypeName: formData.leaveTypeName || "Casual Leave",
        startDate: formData.startDate,
        endDate: formData.isHalfDay ? formData.startDate : formData.endDate,
        days: calculatedDays,
        reason: formData.reason.trim(),
        isHalfDay: formData.isHalfDay,
        halfDaySession: formData.isHalfDay ? formData.halfDaySession : undefined,
        emergencyContact: formData.emergencyContact,
        managerName: defaultManager,
      };

      const res = await fetch("/api/team-lead/leave", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || "Failed to submit leave request to database");
      }

      showToast(`Leave application sent to ${defaultManager} for approval!`, "success");

      // Inform context to trigger UI notification immediately
      applyLeaveRequest({
        employeeId: "emp-am-001",
        employeeName: "Alex Morgan",
        employeeAvatar: "AM",
        leaveTypeId: formData.leaveTypeId,
        leaveTypeName: formData.leaveTypeName || "Casual Leave",
        startDate: formData.startDate,
        endDate: formData.isHalfDay ? formData.startDate : formData.endDate,
        days: calculatedDays,
        reason: formData.reason.trim()
      });

      handleCloseDrawer();
      setCurrentPage(1); // Jump to page 1
      await fetchLeaves(); // Reload from database
    } catch (err: any) {
      showToast(err.message || "Failed to submit leave request.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Trigger custom cancellation modal
  const handleOpenCancelModal = (item: any) => {
    setCancelTargetRequest(item);
  };

  // Perform confirmed cancellation
  const handleConfirmCancel = async () => {
    if (!cancelTargetRequest) return;
    setIsCancelling(true);
    try {
      const res = await fetch(`/api/team-lead/leave?id=${encodeURIComponent(cancelTargetRequest.id)}`, {
        method: "DELETE",
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || "Failed to cancel leave request");
      }
      showToast("Leave request cancelled successfully.", "success");
      if (selectedRequest?.id === cancelTargetRequest.id) {
        setSelectedRequest(null);
      }
      setCancelTargetRequest(null);
      await fetchLeaves();
    } catch (err: any) {
      showToast(err.message || "Failed to cancel leave request.", "error");
    } finally {
      setIsCancelling(false);
    }
  };

  // Quick helper to format dates
  const formatDate = (dateStr: string) => {
    if (!dateStr) return "-";
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="space-y-6 pb-20 font-sans">
      {/* Top Header Section with Actions */}
      <div className="bg-white rounded-sm border border-gray-200/90 shadow-xs p-6 sm:p-7">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
              Apply Leave & Time-Off
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              id="apply-leave-open-btn"
              onClick={handleOpenDrawer}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 active:scale-[0.98] text-white text-sm font-bold shadow-md shadow-blue-500/20 hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-200 cursor-pointer"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
              </svg>
              Apply Leave
            </button>
          </div>
        </div>
      </div>

      {/* Main Leave Requests Table View */}
      <div className="bg-white rounded-sm  border border-gray-200/90 shadow-xs overflow-hidden">
        {/* Table Filter & Search Header */}
        <div className="p-5 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Status Tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-gray-50 rounded-xl border border-gray-200/70 overflow-x-auto">
            {(["All", "Pending", "Approved", "Rejected"] as const).map((tab) => {
              const count =
                tab === "All"
                  ? counts.all
                  : tab === "Pending"
                  ? counts.pending
                  : tab === "Approved"
                  ? counts.approved
                  : counts.rejected;

              const isActive = activeTab === tab;
              return (
                <button
                  key={tab}
                  type="button"
                  onClick={() => {
                    setActiveTab(tab);
                    setCurrentPage(1);
                  }}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                    isActive
                      ? "bg-white text-gray-900 shadow-xs border border-gray-200/80"
                      : "text-gray-500 hover:text-gray-900 hover:bg-white/60"
                  }`}
                >
                  {tab} Leaves
                  <span
                    className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                      isActive
                        ? tab === "Pending"
                          ? "bg-amber-100 text-amber-800"
                          : tab === "Approved"
                          ? "bg-emerald-100 text-emerald-800"
                          : tab === "Rejected"
                          ? "bg-rose-100 text-rose-800"
                          : "bg-gray-200 text-gray-800"
                        : "bg-gray-200/70 text-gray-600"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Search & Type Selectors */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <svg
                className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search reason, dates..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-48 sm:w-60 pl-9 pr-3 py-1.5 text-xs bg-gray-50 border border-gray-200 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
              />
            </div>

            <select
              value={selectedTypeFilter}
              onChange={(e) => {
                setSelectedTypeFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="px-3 py-1.5 text-xs bg-gray-50 border border-gray-200 rounded-lg text-gray-700 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition cursor-pointer"
            >
              <option value="All">All Types</option>
              <option value="Casual Leave">Casual Leave</option>
              <option value="Sick Leave">Sick Leave</option>
              <option value="Annual Leave">Annual Leave</option>
              <option value="Unpaid Leave">Unpaid Leave</option>
            </select>
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-gray-600">
            <thead className="bg-gray-50/80 text-[11px] font-bold text-gray-500 uppercase tracking-wider border-b border-gray-200/80">
              <tr>
                <th className="py-3.5 px-5">Leave Type</th>
                <th className="py-3.5 px-4">Applied Date</th>
                <th className="py-3.5 px-4">Leave Duration</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="py-16 text-center">
                    <div className="flex flex-col items-center justify-center gap-2.5">
                      <svg className="animate-spin w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      <p className="text-xs font-semibold text-gray-500">Loading leave applications from database...</p>
                    </div>
                  </td>
                </tr>
              ) : paginatedLeaves.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-14 text-center">
                    <div className="flex flex-col items-center justify-center max-w-sm mx-auto">
                      <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mb-3">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <p className="text-sm font-bold text-gray-800">No leave requests found</p>
                      <p className="text-xs text-gray-400 mt-1">
                        {searchQuery || activeTab !== "All" || selectedTypeFilter !== "All"
                          ? "Try clearing filters to find what you're looking for."
                          : "You haven't submitted any leave applications yet."}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedLeaves.map((item) => {
                  const isPending = item.status === "Pending";
                  const isApproved = item.status === "Approved";
                  const isRejected = item.status === "Rejected";

                  return (
                    <tr
                      key={item.id}
                      className="hover:bg-blue-50/30 transition-colors group cursor-default"
                    >
                      {/* Leave Type */}
                      <td className="py-3.5 px-5 whitespace-nowrap">
                        <div className="flex items-center">
                          <span className="font-bold text-gray-900 group-hover:text-blue-600 transition">
                            {item.leaveTypeName}
                          </span>
                          {item.isHalfDay && (
                            <span className="ml-2 text-[10px] font-semibold bg-indigo-50 text-indigo-700 px-1.5 py-0.5 rounded border border-indigo-200">
                              {item.halfDaySession || "Half Day"}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Applied Date */}
                      <td className="py-3.5 px-4 whitespace-nowrap font-medium text-gray-600">
                        {formatDate(item.appliedAt)}
                      </td>

                      {/* Period */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-1.5 font-semibold text-gray-800">
                          <span>{formatDate(item.startDate)}</span>
                          {item.startDate !== item.endDate && (
                            <>
                              <span className="text-gray-400">→</span>
                              <span>{formatDate(item.endDate)}</span>
                            </>
                          )}
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        {isPending && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200/80">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                            Pending Review
                          </span>
                        )}
                        {isApproved && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/80">
                            <svg className="w-3 h-3 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                            </svg>
                            Approved
                          </span>
                        )}
                        {isRejected && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-200/80">
                            <svg className="w-3 h-3 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                            Rejected
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-5 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => setSelectedRequest(item)}
                            className="px-2.5 py-1 text-[11px] font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-md transition cursor-pointer"
                          >
                            Details
                          </button>

                          {isPending && (
                            <button
                              type="button"
                              onClick={() => handleOpenCancelModal(item)}
                              className="px-2.5 py-1 text-[11px] font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-md transition cursor-pointer"
                              title="Cancel this pending application"
                            >
                              Cancel
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Table Pagination Footer */}
        <div className="p-4 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-gray-500 bg-gray-50/50">
          <div className="flex items-center gap-3">
            <span>
              Showing <strong className="text-gray-800">{totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1}</strong> to{" "}
              <strong className="text-gray-800">{Math.min(currentPage * pageSize, totalItems)}</strong> of{" "}
              <strong className="text-gray-800">{totalItems}</strong> applications
            </span>

            <div className="flex items-center gap-1.5 border-l border-gray-200 pl-3">
              <span className="text-gray-400">Rows:</span>
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="bg-white border border-gray-200 rounded px-2 py-0.5 text-xs text-gray-700 font-semibold focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-1 self-end sm:self-auto">
            {/* Prev Button */}
            <button
              type="button"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className={`px-2.5 py-1 rounded-lg border text-xs font-semibold flex items-center gap-1 transition ${
                currentPage === 1
                  ? "bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300 cursor-pointer"
              }`}
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
              Prev
            </button>

            {/* Page Numbers */}
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => {
              const isActive = currentPage === pageNum;
              return (
                <button
                  key={pageNum}
                  type="button"
                  onClick={() => setCurrentPage(pageNum)}
                  className={`w-7 h-7 rounded-lg text-xs font-bold transition flex items-center justify-center cursor-pointer ${
                    isActive
                      ? "bg-blue-600 text-white shadow-xs"
                      : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300"
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}

            {/* Next Button */}
            <button
              type="button"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className={`px-2.5 py-1 rounded-lg border text-xs font-semibold flex items-center gap-1 transition ${
                currentPage === totalPages
                  ? "bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300 cursor-pointer"
              }`}
            >
              Next
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* OFFCANVAS SLIDE-OVER DRAWER (FROM RIGHT SIDE)            */}
      {/* ======================================================== */}
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 transition-opacity duration-300 ${
          isDrawerOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={handleCloseDrawer}
        aria-hidden="true"
      />

      {/* Drawer Container (Right side) */}
      <div
        id="apply-leave-offcanvas"
        className={`fixed inset-y-0 right-0 z-50 w-full max-w-lg bg-white shadow-2xl flex flex-col overflow-x-hidden transform transition-transform duration-300 ease-in-out ${
          isDrawerOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Drawer Header */}
        <div className="p-6 border-b border-gray-100 bg-white flex items-start justify-between">
          <div className="space-y-1">
            <h2 className="text-xl font-bold text-gray-900 tracking-tight">Apply for Leave</h2>
          </div>

          <button
            type="button"
            onClick={handleCloseDrawer}
            className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-800 flex items-center justify-center transition cursor-pointer"
            aria-label="Close offcanvas drawer"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Drawer Form Body (Scrollable, No horizontal scroll) */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden p-6 space-y-6">

          {/* Form */}
          <form id="apply-leave-form" onSubmit={handleSubmit} className="space-y-5">
            {/* Leave Type Selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-700">Leave Type *</label>
              <select
                required
                value={formData.leaveTypeId}
                onChange={(e) => handleLeaveTypeChange(e.target.value)}
                className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition cursor-pointer"
              >
                <option value="" disabled>
                  Select Leave Type...
                </option>
                {leavePolicies.map((policy) => (
                  <option key={policy.id} value={policy.id}>
                    {policy.name} ({policy.annualAllocation} Days/Year)
                  </option>
                ))}
              </select>
            </div>

            {/* Half Day Toggle */}
            <div className="p-3 bg-gray-50 border border-gray-200/80 rounded-xl space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-gray-700 cursor-pointer flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.isHalfDay}
                    onChange={(e) => setFormData({ ...formData, isHalfDay: e.target.checked })}
                    className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500 cursor-pointer"
                  />
                  <span>Apply as Half Day</span>
                </label>
                {formData.isHalfDay && (
                  <span className="text-[10px] font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded-full">
                    0.5 Working Day
                  </span>
                )}
              </div>

              {formData.isHalfDay && (
                <div className="flex items-center gap-3 pt-2 border-t border-gray-200/60">
                  <label className="flex items-center gap-1.5 text-xs text-gray-700 cursor-pointer">
                    <input
                      type="radio"
                      name="halfDaySession"
                      checked={formData.halfDaySession === "First Half"}
                      onChange={() => setFormData({ ...formData, halfDaySession: "First Half" })}
                      className="text-blue-600 focus:ring-blue-500 cursor-pointer"
                    />
                    First Half (Morning)
                  </label>
                  <label className="flex items-center gap-1.5 text-xs text-gray-700 cursor-pointer">
                    <input
                      type="radio"
                      name="halfDaySession"
                      checked={formData.halfDaySession === "Second Half"}
                      onChange={() => setFormData({ ...formData, halfDaySession: "Second Half" })}
                      className="text-blue-600 focus:ring-blue-500 cursor-pointer"
                    />
                    Second Half (Afternoon)
                  </label>
                </div>
              )}
            </div>

            {/* Dates Row with Professional CalendarPicker */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <CalendarPicker
                id="apply-leave-start-date"
                label="Start Date"
                required
                align="left"
                placeholder="Select start date..."
                value={formData.startDate}
                onChange={(newStart) => {
                  setFormData((prev) => ({
                    ...prev,
                    startDate: newStart,
                    endDate: prev.endDate && prev.endDate < newStart ? newStart : prev.endDate,
                  }));
                }}
              />

              {!formData.isHalfDay ? (
                <CalendarPicker
                  id="apply-leave-end-date"
                  label="End Date"
                  required
                  align="right"
                  placeholder="Select end date..."
                  minDate={formData.startDate || undefined}
                  value={formData.endDate}
                  onChange={(newEnd) => {
                    setFormData((prev) => ({
                      ...prev,
                      endDate: newEnd,
                    }));
                  }}
                />
              ) : (
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-gray-400">End Date</label>
                  <input
                    type="text"
                    disabled
                    value="Same as Start Date (Half Day)"
                    className="w-full p-2.5 bg-gray-100 border border-gray-200 rounded-xl text-xs text-gray-400 cursor-not-allowed"
                  />
                </div>
              )}
            </div>

            {/* Duration Pill Indicator */}
            <div className="px-3.5 py-2 rounded-lg bg-slate-50 border border-slate-200/80 flex items-center justify-between text-xs">
              <span className="text-gray-500 font-medium">Calculated Leave Duration:</span>
              <span
                className={`font-extrabold px-2 py-0.5 rounded border ${
                  calculatedDays > 0
                    ? "text-blue-700 bg-blue-50 border-blue-200"
                    : "text-gray-400 bg-gray-100 border-gray-200"
                }`}
              >
                {calculatedDays > 0
                  ? `${calculatedDays} ${calculatedDays === 1 ? "Working Day" : "Working Days"}`
                  : "0 Working Days"}
              </span>
            </div>

            {/* Reason Textarea */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-700 flex items-center justify-between">
                <span>Reason for Leave *</span>
                <span className="text-[10px] text-gray-400 font-normal">
                  {formData.reason.length} characters
                </span>
              </label>
              <textarea
                required
                rows={3}
                placeholder="Explain the reason for your time-off request..."
                value={formData.reason}
                onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition resize-none"
              />

              {/* Quick suggestion pills */}
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                <span className="text-[10px] text-gray-900">Quick reasons:</span>
                {["Doctor Appointment", "Family Emergency", "Personal Errands", "Annual Vacation"].map(
                  (suggestion) => (
                    <button
                      key={suggestion}
                      type="button"
                      onClick={() => setFormData((prev) => ({ ...prev, reason: suggestion }))}
                      className="text-[10px] px-2 py-0.5 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-md transition cursor-pointer"
                    >
                      {suggestion}
                    </button>
                  )
                )}
              </div>
            </div>

            {/* Emergency Contact */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-700">
                Emergency Contact Phone while on Leave
              </label>
              <input
                type="text"
                placeholder="+1 (555) 000-0000"
                value={formData.emergencyContact}
                onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.value })}
                className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
              />
            </div>
          </form>
        </div>

        {/* Drawer Footer Actions */}
        <div className="p-5 border-t border-gray-100 bg-gray-50/70 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={handleCloseDrawer}
            className="px-4 py-2.5 text-xs font-bold text-gray-600 hover:text-gray-900 bg-white hover:bg-gray-100 border border-gray-200 rounded-xl transition cursor-pointer"
          >
            Cancel
          </button>

          <button
            type="submit"
            form="apply-leave-form"
            disabled={isSubmitting}
            className="inline-flex items-center gap-2 px-6 py-2.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl shadow-md shadow-blue-500/20 transition cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin w-4 h-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Sending Request...
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
                Submit to Manager
              </>
            )}
          </button>
        </div>
      </div>

      {/* ======================================================== */}
      {/* LEAVE DETAILS MODAL                                      */}
      {/* ======================================================== */}
      {selectedRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full border border-gray-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-gray-100 flex items-start justify-between">
              <div>
                <span
                  className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    selectedRequest.status === "Pending"
                      ? "bg-amber-100 text-amber-800"
                      : selectedRequest.status === "Approved"
                      ? "bg-emerald-100 text-emerald-800"
                      : "bg-rose-100 text-rose-800"
                  }`}
                >
                  {selectedRequest.status}
                </span>
                <h3 className="text-lg font-bold text-gray-900 mt-1">
                  {selectedRequest.leaveTypeName} Request
                </h3>
                <p className="text-xs text-gray-400">ID: {selectedRequest.id}</p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedRequest(null)}
                className="w-7 h-7 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-500 flex items-center justify-center transition cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4 p-3 bg-gray-50 rounded-xl border border-gray-100">
                <div>
                  <span className="text-gray-400 block font-medium">Leave Period</span>
                  <span className="text-gray-800 font-bold">
                    {formatDate(selectedRequest.startDate)} → {formatDate(selectedRequest.endDate)}
                  </span>
                </div>
                <div>
                  <span className="text-gray-400 block font-medium">Total Days</span>
                  <span className="text-gray-800 font-bold">
                    {selectedRequest.days} {selectedRequest.days === 1 ? "Day" : "Days"}
                  </span>
                </div>
              </div>

              <div>
                <span className="text-gray-400 block font-medium mb-1">Reason for Application</span>
                <p className="p-3 bg-gray-50 rounded-xl border border-gray-100 text-gray-800 font-medium">
                  {selectedRequest.reason}
                </p>
              </div>

              {/* Assigned Manager Profile Card */}
              <div className="p-3.5 bg-gradient-to-r from-blue-50/70 to-indigo-50/70 rounded-xl border border-blue-100 flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-xs shadow-xs shrink-0">
                  AP
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-gray-900 text-xs truncate">
                      {selectedRequest.managerName || defaultManager}
                    </span>
                    <span className="text-[9px] font-extrabold px-1.5 py-0.2 bg-blue-100 text-blue-800 rounded">
                      Approver
                    </span>
                  </div>
                  <p className="text-[10px] text-gray-500 mt-0.5">
                    {selectedRequest.status === "Pending"
                      ? "Designated manager for time-off approvals"
                      : selectedRequest.reviewedBy
                      ? `Reviewed by ${selectedRequest.reviewedBy}`
                      : "Workflow completed"}
                  </p>
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t border-gray-100">
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Submitted On:</span>
                  <span className="font-semibold text-gray-700">
                    {formatDate(selectedRequest.appliedAt)}
                  </span>
                </div>
                {selectedRequest.reviewedAt && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">Reviewed On:</span>
                    <span className="font-semibold text-gray-700">
                      {formatDate(selectedRequest.reviewedAt)} (by {selectedRequest.reviewedBy})
                    </span>
                  </div>
                )}
                {selectedRequest.rejectionReason && (
                  <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 mt-2">
                    <strong className="block font-bold">Manager's Remark:</strong>
                    {selectedRequest.rejectionReason}
                  </div>
                )}
              </div>
            </div>

            <div className="p-4 bg-gray-50/80 border-t border-gray-100 flex items-center justify-between">
              {selectedRequest.status === "Pending" ? (
                <button
                  type="button"
                  onClick={() => handleOpenCancelModal(selectedRequest)}
                  className="px-3.5 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-xl text-xs font-bold transition cursor-pointer"
                >
                  Cancel Request
                </button>
              ) : (
                <span className="text-[11px] text-gray-400">Request has concluded</span>
              )}

              <button
                type="button"
                onClick={() => setSelectedRequest(null)}
                className="px-4 py-2 bg-gray-800 hover:bg-gray-900 text-white rounded-xl text-xs font-bold transition cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* CANCELLATION CONFIRMATION MODAL                          */}
      {/* ======================================================== */}
      {cancelTargetRequest && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-md w-full border border-gray-100 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150">
            {/* Modal Header & Icon */}
            <div className="p-6 text-center">
              <div className="w-14 h-14 rounded-2xl bg-rose-50 border border-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-4 shadow-xs">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>

              <h3 className="text-lg font-extrabold text-gray-900 tracking-tight">
                Cancel Leave Request?
              </h3>
              <p className="text-xs text-gray-500 mt-1.5 leading-relaxed">
                Are you sure you want to cancel this pending time-off request? This application will be permanently withdrawn and removed from manager review.
              </p>

              {/* Leave Details Card */}
              <div className="mt-4 p-3.5 bg-gray-50/80 rounded-xl border border-gray-200/70 text-left space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-gray-900">
                    {cancelTargetRequest.leaveTypeName}
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                    Pending Review
                  </span>
                </div>

                <div className="text-[11px] text-gray-600 flex items-center justify-between">
                  <span>
                    {formatDate(cancelTargetRequest.startDate)}
                    {cancelTargetRequest.startDate !== cancelTargetRequest.endDate && (
                      <> → {formatDate(cancelTargetRequest.endDate)}</>
                    )}
                  </span>
                  <span className="font-semibold text-gray-800">
                    {cancelTargetRequest.days} {cancelTargetRequest.days === 1 ? "Day" : "Days"}
                  </span>
                </div>

                {cancelTargetRequest.reason && (
                  <p className="text-[11px] text-gray-500 italic truncate border-t border-gray-200/50 pt-1.5 mt-1.5">
                    &ldquo;{cancelTargetRequest.reason}&rdquo;
                  </p>
                )}
              </div>
            </div>

            {/* Modal Actions */}
            <div className="p-4 bg-gray-50/90 border-t border-gray-100 flex items-center justify-end gap-2.5">
              <button
                type="button"
                disabled={isCancelling}
                onClick={() => setCancelTargetRequest(null)}
                className="px-4 py-2 text-xs font-semibold text-gray-700 bg-white hover:bg-gray-100 border border-gray-200 rounded-xl transition cursor-pointer disabled:opacity-50"
              >
                No, Keep Request
              </button>

              <button
                type="button"
                disabled={isCancelling}
                onClick={handleConfirmCancel}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 active:scale-95 rounded-xl shadow-sm shadow-rose-500/20 transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isCancelling ? (
                  <>
                    <svg className="animate-spin w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Cancelling...
                  </>
                ) : (
                  <>
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Yes, Cancel Request
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

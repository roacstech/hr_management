"use client";

import { useState } from "react";
import { useTenant } from "@/context/TenantContext";
import { PlusIcon, CloseIcon } from "@/components/SidebarIcons";

export default function LeaveTrackerPage() {
  const { currentOrg, employees, leavePolicies, leaveRequests, showToast } = useTenant();

  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [applyForm, setApplyForm] = useState({
    employeeId: employees[0]?.id || "",
    leaveTypeId: leavePolicies[0]?.id || "",
    startDate: new Date().toISOString().split("T")[0],
    endDate: new Date().toISOString().split("T")[0],
    reason: "Personal family commitment",
    days: 1,
  });

  const pendingCount = leaveRequests.filter((l) => l.status === "Pending").length;
  const approvedCount = leaveRequests.filter((l) => l.status === "Approved").length;

  const handleApprove = (reqId: string, empName: string) => {
    const req = leaveRequests.find((r) => r.id === reqId);
    if (req) {
      req.status = "Approved";
      showToast(`Approved leave application for ${empName}`);
    }
  };

  const handleReject = (reqId: string, empName: string) => {
    const req = leaveRequests.find((r) => r.id === reqId);
    if (req) {
      req.status = "Rejected";
      showToast(`Rejected leave application for ${empName}`, "info");
    }
  };

  const handleApplyOnBehalf = (e: React.FormEvent) => {
    e.preventDefault();
    const emp = employees.find((e) => e.id === applyForm.employeeId) || employees[0];
    const pol = leavePolicies.find((p) => p.id === applyForm.leaveTypeId) || leavePolicies[0];

    leaveRequests.unshift({
      id: `lr-${Date.now()}`,
      organizationId: currentOrg.id,
      employeeId: emp.id,
      employeeName: emp.name,
      employeeAvatar: emp.avatar || "EM",
      leaveTypeId: pol.id,
      leaveTypeName: pol.name,
      startDate: applyForm.startDate,
      endDate: applyForm.endDate,
      days: Number(applyForm.days),
      reason: applyForm.reason,
      status: "Approved", // HR applying on behalf is auto-approved
      appliedAt: new Date().toISOString(),
    });

    setIsApplyModalOpen(false);
    showToast(`Leave applied and approved for ${emp.name}.`);
  };

  return (
    <div className="space-y-6 pb-16 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-200/90 shadow-xs">
        <div>
          <span className="text-[11px] font-bold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
            {currentOrg.name} Attendance & Leaves
          </span>
          <h1 className="text-2xl font-bold text-gray-900 mt-1.5 tracking-tight">
            Leave Tracker & Time-Off
          </h1>
          <p className="text-gray-500 text-xs mt-0.5">
            Review PTO balances, holiday calendar, and process staff leave applications.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setIsApplyModalOpen(true)}
          className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg shadow-sm transition cursor-pointer"
        >
          <PlusIcon className="w-3.5 h-3.5 mr-1.5 text-white" size={14} />
          Apply Leave on Behalf
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-gray-200/90 shadow-xs space-y-1">
          <p className="text-xs text-gray-500 font-medium">Pending Approvals</p>
          <p className="text-2xl font-bold text-amber-600">{pendingCount}</p>
          <span className="text-[11px] text-gray-400">Requires review</span>
        </div>
        <div className="bg-white p-5 rounded-xl border border-gray-200/90 shadow-xs space-y-1">
          <p className="text-xs text-gray-500 font-medium">Approved This Month</p>
          <p className="text-2xl font-bold text-emerald-600">{approvedCount}</p>
          <span className="text-[11px] text-gray-400">Recorded in calendar</span>
        </div>
        <div className="bg-white p-5 rounded-xl border border-gray-200/90 shadow-xs space-y-1">
          <p className="text-xs text-gray-500 font-medium">Active Leave Policies</p>
          <p className="text-2xl font-bold text-gray-900">{leavePolicies.length}</p>
          <span className="text-[11px] text-gray-400">Annual, Casual, Sick</span>
        </div>
        <div className="bg-white p-5 rounded-xl border border-gray-200/90 shadow-xs space-y-1">
          <p className="text-xs text-gray-500 font-medium">Workforce Availability</p>
          <p className="text-2xl font-bold text-blue-600">96.4%</p>
          <span className="text-[11px] text-gray-400">Above target</span>
        </div>
      </div>

      {/* Leave Requests Table */}
      <div className="bg-white rounded-2xl border border-gray-200/90 overflow-hidden shadow-xs">
        <div className="p-4 border-b border-gray-100 flex justify-between items-center text-xs">
          <h2 className="font-bold text-gray-900 uppercase tracking-wide">
            Staff Leave Applications ({leaveRequests.length})
          </h2>
          <span className="text-gray-400">Filtered by active tenant</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-gray-600">
            <thead className="bg-slate-50 text-[11px] font-bold text-gray-500 border-b border-gray-200">
              <tr>
                <th className="px-5 py-3">Employee</th>
                <th className="px-5 py-3">Leave Type</th>
                <th className="px-5 py-3">Dates & Days</th>
                <th className="px-5 py-3">Reason</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {leaveRequests.map((req) => (
                <tr key={req.id} className="hover:bg-gray-50/60 transition">
                  <td className="px-5 py-3.5 font-bold text-gray-900 whitespace-nowrap">
                    {req.employeeName}
                  </td>
                  <td className="px-5 py-3.5 whitespace-nowrap">
                    <span className="px-2 py-0.5 rounded text-[10.5px] font-semibold bg-blue-50 text-blue-700">
                      {req.leaveTypeName}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 font-mono text-[11px] text-gray-700 whitespace-nowrap">
                    {req.days} Day(s) ({req.startDate} to {req.endDate})
                  </td>
                  <td className="px-5 py-3.5 text-gray-600 max-w-xs truncate">{req.reason}</td>
                  <td className="px-5 py-3.5 whitespace-nowrap">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        req.status === "Approved"
                          ? "bg-emerald-100 text-emerald-800"
                          : req.status === "Pending"
                          ? "bg-amber-100 text-amber-800"
                          : "bg-rose-100 text-rose-800"
                      }`}
                    >
                      {req.status}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-right whitespace-nowrap space-x-2">
                    {req.status === "Pending" ? (
                      <>
                        <button
                          type="button"
                          onClick={() => handleApprove(req.id, req.employeeName)}
                          className="px-2.5 py-1 text-xs font-bold text-white bg-emerald-600 rounded hover:bg-emerald-700 shadow-2xs"
                        >
                          Approve
                        </button>
                        <button
                          type="button"
                          onClick={() => handleReject(req.id, req.employeeName)}
                          className="px-2.5 py-1 text-xs font-medium text-gray-600 bg-white border border-gray-200 rounded hover:bg-gray-50"
                        >
                          Reject
                        </button>
                      </>
                    ) : (
                      <span className="text-[11px] text-gray-400 font-mono">Processed</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Apply Leave on Behalf */}
      {isApplyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 w-full max-w-md p-6 space-y-4 text-xs">
            <div className="flex justify-between items-center border-b border-gray-100 pb-3">
              <h3 className="text-base font-bold text-gray-900">Apply Leave on Behalf</h3>
              <button
                type="button"
                onClick={() => setIsApplyModalOpen(false)}
                className="w-7 h-7 rounded bg-gray-100 text-gray-500 flex items-center justify-center"
              >
                <CloseIcon className="w-3.5 h-3.5" size={14} />
              </button>
            </div>

            <form onSubmit={handleApplyOnBehalf} className="space-y-3">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Select Employee</label>
                <select
                  value={applyForm.employeeId}
                  onChange={(e) => setApplyForm({ ...applyForm, employeeId: e.target.value })}
                  className="w-full rounded-md border border-gray-200 p-2 bg-white"
                >
                  {employees.map((e) => (
                    <option key={e.id} value={e.id}>
                      {e.name} ({e.department})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Leave Type</label>
                <select
                  value={applyForm.leaveTypeId}
                  onChange={(e) => setApplyForm({ ...applyForm, leaveTypeId: e.target.value })}
                  className="w-full rounded-md border border-gray-200 p-2 bg-white"
                >
                  {leavePolicies.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.annualAllocation}d allocated)
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Start Date</label>
                  <input
                    type="date"
                    value={applyForm.startDate}
                    onChange={(e) => setApplyForm({ ...applyForm, startDate: e.target.value })}
                    className="w-full rounded-md border border-gray-200 p-2 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">End Date</label>
                  <input
                    type="date"
                    value={applyForm.endDate}
                    onChange={(e) => setApplyForm({ ...applyForm, endDate: e.target.value })}
                    className="w-full rounded-md border border-gray-200 p-2 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Total Days</label>
                <input
                  type="number"
                  value={applyForm.days}
                  onChange={(e) => setApplyForm({ ...applyForm, days: Number(e.target.value) })}
                  className="w-full rounded-md border border-gray-200 p-2 font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Reason / Note</label>
                <textarea
                  rows={2}
                  value={applyForm.reason}
                  onChange={(e) => setApplyForm({ ...applyForm, reason: e.target.value })}
                  className="w-full rounded-md border border-gray-200 p-2"
                />
              </div>

              <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsApplyModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold"
                >
                  Record & Approve Leave
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

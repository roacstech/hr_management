"use client";

import { useState, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useTenant } from "@/context/TenantContext";
import { AttendanceRecord } from "@/lib/types";
import { PlusIcon, CloseIcon } from "@/components/SidebarIcons";

function AttendanceContent() {
  const { currentOrg, employees, attendanceRecords, showToast } = useTenant();
  const searchParams = useSearchParams();
  const isMyView = searchParams.get("view") === "my";

  const myEmployee = useMemo(
    () => employees.find((e) => e.name === "Amira Patel") || employees[0],
    [employees]
  );

  const displayedRecords = useMemo(() => {
    if (isMyView) {
      return attendanceRecords.filter(
        (a) => a.employeeName === "Amira Patel" || a.employeeId === myEmployee?.id
      );
    }
    return attendanceRecords;
  }, [attendanceRecords, isMyView, myEmployee]);

  const [isPunchModalOpen, setIsPunchModalOpen] = useState(false);
  const [punchForm, setPunchForm] = useState({
    employeeId: myEmployee?.id || employees[0]?.id || "",
    status: "Present" as AttendanceRecord["status"],
    checkIn: "08:50 AM",
    checkOut: "06:00 PM",
    workHours: 8.5,
  });

  const activeEmployees = employees.filter((e) => e.status !== "Offboarded");
  const presentCount = attendanceRecords.filter((a) => a.status === "Present" || a.status === "Late").length;
  const lateCount = attendanceRecords.filter((a) => a.status === "Late").length;
  const leaveCount = attendanceRecords.filter((a) => a.status === "On Leave").length;

  const handleManualPunch = (e: React.FormEvent) => {
    e.preventDefault();
    const emp = employees.find((e) => e.id === punchForm.employeeId) || employees[0];
    const newRecord: AttendanceRecord = {
      id: `att-${Date.now()}`,
      organizationId: currentOrg.id,
      employeeId: emp.id,
      employeeName: emp.name,
      date: new Date().toISOString().split("T")[0],
      checkIn: punchForm.checkIn,
      checkOut: punchForm.checkOut,
      status: punchForm.status,
      workHours: Number(punchForm.workHours),
      overtimeHours: Math.max(0, Number(punchForm.workHours) - 8),
    };

    attendanceRecords.unshift(newRecord);
    setIsPunchModalOpen(false);
    showToast(`Recorded manual attendance punch for ${emp.name}.`);
  };

  const handleExportCSV = () => {
    const headers = "Date,Employee,Status,CheckIn,CheckOut,WorkHours,OvertimeHours\n";
    const rows = attendanceRecords
      .map((r) => `"${r.date}","${r.employeeName}","${r.status}","${r.checkIn || ""}","${r.checkOut || ""}",${r.workHours},${r.overtimeHours}`)
      .join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Attendance_${currentOrg.name}_${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
    showToast("Exported attendance log sheet.");
  };

  return (
    <div className="space-y-6 pb-16 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-200/90 shadow-xs">
        <div>
          <span className="text-[11px] font-bold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
            {isMyView ? "Personal Attendance & Timecard" : "Employee Attendance & Biometrics"}
          </span>
          <h1 className="text-2xl font-bold text-gray-900 mt-1.5 tracking-tight">
            {isMyView ? "My Attendance Logs" : "Attendance & Punch Logs"}
          </h1>
          <p className="text-gray-500 text-xs mt-0.5">
            {isMyView
              ? "Real-time personal punch times, shift check-ins, and daily working hours for Amira Patel."
              : "Real-time daily punch times, punctuality compliance, and manual regularization adjustments."}
          </p>
        </div>
        <div className="flex items-center space-x-2.5">
          <button
            type="button"
            onClick={handleExportCSV}
            className="px-3.5 py-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 text-xs font-semibold rounded-lg shadow-xs transition cursor-pointer"
          >
            Export Sheet CSV
          </button>
          <button
            type="button"
            onClick={() => setIsPunchModalOpen(true)}
            className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg shadow-sm transition cursor-pointer"
          >
            <PlusIcon className="w-3.5 h-3.5 mr-1.5 text-white" size={14} />
            {isMyView ? "Log Punch Regularization" : "Record Manual Punch"}
          </button>
        </div>
      </div>

      {isMyView ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-xl border border-gray-200/90 shadow-xs space-y-1">
            <p className="text-xs text-gray-500 font-medium">Today&apos;s Status</p>
            <p className="text-2xl font-bold text-emerald-600">Present</p>
            <span className="text-[11px] text-gray-400">Clocked in at 08:50 AM</span>
          </div>
          <div className="bg-white p-5 rounded-xl border border-gray-200/90 shadow-xs space-y-1">
            <p className="text-xs text-gray-500 font-medium">Logged Work Hours</p>
            <p className="text-2xl font-bold text-gray-900">8.2 hrs</p>
            <span className="text-[11px] text-emerald-600 font-semibold">Standard shift completed</span>
          </div>
          <div className="bg-white p-5 rounded-xl border border-gray-200/90 shadow-xs space-y-1">
            <p className="text-xs text-gray-500 font-medium">Punctuality Score</p>
            <p className="text-2xl font-bold text-blue-600">100%</p>
            <span className="text-[11px] text-gray-400">No late arrivals logged</span>
          </div>
          <div className="bg-white p-5 rounded-xl border border-gray-200/90 shadow-xs space-y-1">
            <p className="text-xs text-gray-500 font-medium">Overtime Recorded</p>
            <p className="text-2xl font-bold text-gray-900">0.0 hrs</p>
            <span className="text-[11px] text-gray-400">Eligible for 1.5x regular rate</span>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-xl border border-gray-200/90 shadow-xs space-y-1">
            <p className="text-xs text-gray-500 font-medium">Present Today</p>
            <p className="text-2xl font-bold text-gray-900">
              {presentCount} / {activeEmployees.length}
            </p>
            <span className="text-[11px] text-emerald-600 font-semibold">
              {Math.round((presentCount / Math.max(1, activeEmployees.length)) * 100)}% Attendance Rate
            </span>
          </div>
          <div className="bg-white p-5 rounded-xl border border-gray-200/90 shadow-xs space-y-1">
            <p className="text-xs text-gray-500 font-medium">Late Arrivals</p>
            <p className="text-2xl font-bold text-amber-600">{lateCount}</p>
            <span className="text-[11px] text-gray-400">Beyond grace period</span>
          </div>
          <div className="bg-white p-5 rounded-xl border border-gray-200/90 shadow-xs space-y-1">
            <p className="text-xs text-gray-500 font-medium">On Approved Leave</p>
            <p className="text-2xl font-bold text-blue-600">{leaveCount}</p>
            <span className="text-[11px] text-gray-400">Recorded in tracker</span>
          </div>
          <div className="bg-white p-5 rounded-xl border border-gray-200/90 shadow-xs space-y-1">
            <p className="text-xs text-gray-500 font-medium">Unaccounted Absent</p>
            <p className="text-2xl font-bold text-emerald-600">0</p>
            <span className="text-[11px] text-gray-400">100% accounted for</span>
          </div>
        </div>
      )}

      {/* Punch Logs Table */}
      <div className="bg-white rounded-2xl border border-gray-200/90 overflow-hidden shadow-xs">
        <div className="p-4 border-b border-gray-100 flex justify-between items-center text-xs">
          <h2 className="font-bold text-gray-900 uppercase tracking-wide">
            {isMyView ? "My Personal Punch Log Records" : "Daily Punch Log Records"} ({displayedRecords.length})
          </h2>
          <span suppressHydrationWarning className="text-gray-400">Today: {new Date().toLocaleDateString()}</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-gray-600">
            <thead className="bg-slate-50 text-[11px] font-bold text-gray-500 border-b border-gray-200">
              <tr>
                <th className="px-5 py-3">Employee</th>
                <th className="px-5 py-3">Date</th>
                <th className="px-5 py-3">Clock In</th>
                <th className="px-5 py-3">Clock Out</th>
                <th className="px-5 py-3">Total Hours</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3 text-right">Overtime</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 font-mono text-[11.5px]">
              {displayedRecords.map((att) => (
                <tr key={att.id} className="hover:bg-gray-50/60 transition">
                  <td className="px-5 py-3.5 font-sans font-bold text-gray-900 whitespace-nowrap">
                    {att.employeeName}
                  </td>
                  <td className="px-5 py-3.5 whitespace-nowrap text-gray-500">{att.date}</td>
                  <td className="px-5 py-3.5 whitespace-nowrap font-semibold text-gray-800">
                    {att.checkIn || "—"}
                  </td>
                  <td className="px-5 py-3.5 whitespace-nowrap font-semibold text-gray-800">
                    {att.checkOut || "—"}
                  </td>
                  <td className="px-5 py-3.5 whitespace-nowrap">{att.workHours} hrs</td>
                  <td className="px-5 py-3.5 font-sans whitespace-nowrap">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        att.status === "Present"
                          ? "bg-emerald-100 text-emerald-800"
                          : att.status === "Late"
                          ? "bg-amber-100 text-amber-800"
                          : att.status === "On Leave"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-rose-100 text-rose-800"
                      }`}
                    >
                      {att.status}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-right whitespace-nowrap font-semibold text-emerald-600">
                    {att.overtimeHours > 0 ? `+${att.overtimeHours} hrs` : "0 hrs"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Manual Attendance Punch */}
      {isPunchModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 w-full max-w-md p-6 space-y-4 text-xs">
            <div className="flex justify-between items-center border-b border-gray-100 pb-3">
              <h3 className="text-base font-bold text-gray-900">Record Manual Punch</h3>
              <button
                type="button"
                onClick={() => setIsPunchModalOpen(false)}
                className="w-7 h-7 rounded bg-gray-100 text-gray-500 flex items-center justify-center"
              >
                <CloseIcon className="w-3.5 h-3.5" size={14} />
              </button>
            </div>

            <form onSubmit={handleManualPunch} className="space-y-3">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Select Employee</label>
                <select
                  value={punchForm.employeeId}
                  onChange={(e) => setPunchForm({ ...punchForm, employeeId: e.target.value })}
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
                <label className="block font-semibold text-gray-700 mb-1">Punch Status</label>
                <select
                  value={punchForm.status}
                  onChange={(e) =>
                    setPunchForm({ ...punchForm, status: e.target.value as AttendanceRecord["status"] })
                  }
                  className="w-full rounded-md border border-gray-200 p-2 bg-white"
                >
                  <option value="Present">Present</option>
                  <option value="Late">Late Arrival</option>
                  <option value="Half Day">Half Day</option>
                  <option value="On Leave">On Leave</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Clock In Time</label>
                  <input
                    type="text"
                    value={punchForm.checkIn}
                    onChange={(e) => setPunchForm({ ...punchForm, checkIn: e.target.value })}
                    className="w-full rounded-md border border-gray-200 p-2 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Clock Out Time</label>
                  <input
                    type="text"
                    value={punchForm.checkOut}
                    onChange={(e) => setPunchForm({ ...punchForm, checkOut: e.target.value })}
                    className="w-full rounded-md border border-gray-200 p-2 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Total Hours Worked</label>
                <input
                  type="number"
                  step="0.5"
                  value={punchForm.workHours}
                  onChange={(e) => setPunchForm({ ...punchForm, workHours: Number(e.target.value) })}
                  className="w-full rounded-md border border-gray-200 p-2 font-mono"
                />
              </div>

              <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsPunchModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold"
                >
                  Save Punch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AttendancePage() {
  return (
    <Suspense fallback={null}>
      <AttendanceContent />
    </Suspense>
  );
}

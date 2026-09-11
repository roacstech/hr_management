"use client";

import { useState, useEffect, useCallback } from "react";
import { TimeTrackerIcon } from "@/components/SidebarIcons";

interface EmployeeAttendanceRecord {
  id: string;
  date: string;
  checkIn: string;
  checkOut: string | null;
  totalHours: string;
  status: "On Time" | "Late" | "Missing Punch" | "Present";
}

export default function EmployeeAttendancePage() {
  const [dbRecords, setDbRecords] = useState<EmployeeAttendanceRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const fetchAttendance = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/team-lead/attendance?history=true");
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.history)) {
          const mapped: EmployeeAttendanceRecord[] = data.history.map(
            (r: {
              id: string;
              date: string;
              checkIn: string | null;
              checkOut: string | null;
              workHours: number;
              status: string;
            }) => ({
              id: r.id,
              date: r.date,
              checkIn: r.checkIn
                ? new Date(r.checkIn).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : "--",
              checkOut: r.checkOut
                ? new Date(r.checkOut).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : r.checkIn
                ? "In Progress"
                : "--",
              totalHours:
                r.workHours > 0
                  ? `${r.workHours}h`
                  : r.checkIn && !r.checkOut
                  ? "Tracking..."
                  : "--",
              status: (r.status === "Present" ? "On Time" : r.status) as EmployeeAttendanceRecord["status"],
            })
          );
          setDbRecords(mapped);
        }
      }
    } catch (e) {
      console.error("Failed to load DB attendance history:", e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAttendance();
    const handleUpdate = () => fetchAttendance();
    window.addEventListener("attendance-updated", handleUpdate);
    return () => window.removeEventListener("attendance-updated", handleUpdate);
  }, [fetchAttendance]);

  // Only real DB records are shown
  const attendanceList = dbRecords;

  const totalPages = Math.max(1, Math.ceil(attendanceList.length / pageSize));
  const paginatedData = attendanceList.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <div className="space-y-6 pb-16 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-200/90 shadow-xs">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mt-2 tracking-tight">
            My Attendance History
          </h1>
          <p className="text-gray-500 text-xs mt-0.5 max-w-2xl">
            View your personal attendance records, clock-in times, and total shift hours.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200/90 shadow-xs overflow-hidden flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-200 bg-slate-100/90 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                <th className="py-3 px-5">Date</th>
                <th className="py-3 px-4">Check-In</th>
                <th className="py-3 px-4">Check-Out</th>
                <th className="py-3 px-4">Total Hours</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-xs">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="py-14 text-center">
                    <div className="flex items-center justify-center space-x-2 text-gray-400">
                      <svg className="w-5 h-5 animate-spin text-blue-600" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span className="text-xs font-semibold">Loading attendance records from database...</span>
                    </div>
                  </td>
                </tr>
              ) : attendanceList.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-14 text-center">
                    <div className="flex flex-col items-center justify-center max-w-sm mx-auto">
                      <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mb-3">
                        <TimeTrackerIcon className="w-6 h-6" size={24} />
                      </div>
                      <p className="text-sm font-bold text-gray-800">No attendance records found</p>
                      <p className="text-xs text-gray-400 mt-1">
                        You have not recorded any attendance punches yet. Use the Check-in button in the top navigation to record your attendance.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedData.map((record) => (
                  <tr key={record.id} className="hover:bg-gray-50/70 transition-colors">
                    <td className="py-3.5 px-5 font-bold text-gray-900">{record.date}</td>
                    <td className="py-3.5 px-4 font-semibold text-gray-700">{record.checkIn}</td>
                    <td className="py-3.5 px-4 font-semibold text-gray-700">{record.checkOut || "--"}</td>
                    <td className="py-3.5 px-4 font-semibold text-gray-700">{record.totalHours}</td>
                    <td className="py-3.5 px-4">
                      {record.status === "On Time" && (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800">
                          On Time
                        </span>
                      )}
                      {record.status === "Late" && (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800">
                          Late
                        </span>
                      )}
                      {record.status === "Missing Punch" && (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-100 text-rose-800">
                          Missing Punch
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <div className="px-5 py-4 border-t border-gray-100 bg-gray-50/50 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs select-none mt-auto">
          <div className="text-gray-500">
            Showing{" "}
            <span className="font-semibold text-gray-900">
              {attendanceList.length === 0 ? 0 : (currentPage - 1) * pageSize + 1}
            </span>{" "}
            to{" "}
            <span className="font-semibold text-gray-900">
              {Math.min(currentPage * pageSize, attendanceList.length)}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-gray-900">{attendanceList.length}</span> records
          </div>

          <div className="flex items-center space-x-1.5">
            <button
              type="button"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className={`px-3 py-1.5 rounded-lg font-semibold border transition flex items-center space-x-1 ${
                currentPage === 1
                  ? "border-gray-200 text-gray-300 bg-gray-50 cursor-not-allowed"
                  : "border-gray-200 text-gray-700 bg-white hover:bg-gray-100 active:scale-95 shadow-xs cursor-pointer"
              }`}
            >
              Previous
            </button>

            {/* Numbered Page Buttons */}
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => {
              if (
                p === 1 ||
                p === totalPages ||
                (p >= currentPage - 1 && p <= currentPage + 1)
              ) {
                return (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setCurrentPage(p)}
                    className={`w-7 h-7 flex items-center justify-center rounded-lg font-bold transition cursor-pointer ${
                      currentPage === p
                        ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                        : "text-gray-600 hover:bg-gray-200 bg-gray-100"
                    }`}
                  >
                    {p}
                  </button>
                );
              } else if (p === currentPage - 2 || p === currentPage + 2) {
                return (
                  <span key={p} className="text-gray-400 px-1">
                    ...
                  </span>
                );
              }
              return null;
            })}

            <button
              type="button"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages || attendanceList.length === 0}
              className={`px-3 py-1.5 rounded-lg font-semibold border transition flex items-center space-x-1 ${
                currentPage === totalPages || attendanceList.length === 0
                  ? "border-gray-200 text-gray-300 bg-gray-50 cursor-not-allowed"
                  : "border-gray-200 text-gray-700 bg-white hover:bg-gray-100 active:scale-95 shadow-xs cursor-pointer"
              }`}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

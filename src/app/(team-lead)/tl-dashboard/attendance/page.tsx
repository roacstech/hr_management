"use client";

import { useState } from "react";
import { useTenant } from "@/context/TenantContext";
import { TimeTrackerIcon } from "@/components/SidebarIcons";

interface TLAttendanceRecord {
  id: string;
  date: string;
  checkIn: string;
  checkOut: string | null;
  totalHours: string;
  status: "On Time" | "Late" | "Missing Punch";
}

const dummyAttendance: TLAttendanceRecord[] = Array.from({ length: 45 }).map((_, i) => {
  const d = new Date();
  d.setDate(d.getDate() - i);
  const dateStr = d.toISOString().split("T")[0];
  
  // Randomize some statuses
  let status: "On Time" | "Late" | "Missing Punch" = "On Time";
  let checkIn = "09:00 AM";
  let checkOut: string | null = "06:00 PM";
  let totalHours = "9h 00m";

  if (i % 12 === 0) {
    status = "Late";
    checkIn = "09:30 AM";
    totalHours = "8h 30m";
  } else if (i % 20 === 0) {
    status = "Missing Punch";
    checkOut = null;
    totalHours = "--";
  }

  return {
    id: `tl-att-${i}`,
    date: dateStr,
    checkIn,
    checkOut,
    totalHours,
    status,
  };
});

export default function TLAttendancePage() {
  const { teamLeadProfile } = useTenant();
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const totalPages = Math.ceil(dummyAttendance.length / pageSize);

  const paginatedData = dummyAttendance.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div className="space-y-6 pb-16 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-200/90 shadow-xs">
        <div>
          <div className="flex items-center space-x-2">
            {/* <span className="text-[11px] font-bold text-blue-700 bg-blue-50 border border-blue-200/60 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              My Profile
            </span> */}
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mt-2 tracking-tight">
            My Attendance History
          </h1>
          <p className="text-gray-500 text-xs mt-0.5 max-w-2xl">
            View your personal attendance records, clock-in times, and total shift hours.
          </p>
        </div>
        {/* <div className="flex items-center space-x-2.5 shrink-0">
          <div className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg shadow-sm flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-800 font-bold overflow-hidden">
               {teamLeadProfile?.profileImageUrl ? (
                  <img
                    src={teamLeadProfile.profileImageUrl}
                    alt={teamLeadProfile?.name || "TL"}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  teamLeadProfile?.avatar || "SC"
                )}
            </div>
            <div>
              <p className="text-sm font-bold text-gray-900">{teamLeadProfile?.name || "Team Lead"}</p>
              <p className="text-[10px] text-gray-500">{teamLeadProfile?.employeeId || "RC-001"}</p>
            </div>
          </div>
        </div> */}
      </div>

      <div className="bg-white rounded-sm border border-gray-200/90 shadow-xs overflow-hidden flex flex-col">
        {/* <div className="p-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-sm font-bold text-gray-800">Attendance Log</h2>
        </div> */}

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
              {paginatedData.map((record) => (
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
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <div className="px-5 py-4 border-t border-gray-100 bg-gray-50/50 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs select-none mt-auto">
          <div className="text-gray-500">
            Showing{" "}
            <span className="font-semibold text-gray-900">
              {(currentPage - 1) * pageSize + 1}
            </span>{" "}
            to{" "}
            <span className="font-semibold text-gray-900">
              {Math.min(currentPage * pageSize, dummyAttendance.length)}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-gray-900">{dummyAttendance.length}</span> records
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
              // Simple pagination display logic to avoid too many buttons
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
              } else if (
                p === currentPage - 2 ||
                p === currentPage + 2
              ) {
                return <span key={p} className="text-gray-400 px-1">...</span>;
              }
              return null;
            })}

            <button
              type="button"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className={`px-3 py-1.5 rounded-lg font-semibold border transition flex items-center space-x-1 ${
                currentPage === totalPages
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

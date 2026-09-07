"use client";

import React, { useState } from "react";
import { AttendanceIcon, FolderIcon, MoreIcon } from "@/components/SidebarIcons";

export default function MyAttendancePage() {
  const [isRequestingCorrection, setIsRequestingCorrection] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-xl font-bold text-gray-900">My Attendance</h1>
          <p className="text-xs text-gray-500 mt-1">View your historical logs and submit correction requests.</p>
        </div>
        <button 
          onClick={() => setIsRequestingCorrection(!isRequestingCorrection)}
          className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold py-2 px-4 rounded-lg shadow-md shadow-blue-500/20 transition-all"
        >
          {isRequestingCorrection ? "Cancel Request" : "Request Correction"}
        </button>
      </div>

      {isRequestingCorrection && (
        <div className="bg-white p-6 rounded-xl border border-blue-200 shadow-lg shadow-blue-100/50 animate-in fade-in slide-in-from-top-4 duration-300">
          <h2 className="text-sm font-bold text-gray-900 mb-4 border-b border-gray-100 pb-2">Submit Correction Request</h2>
          <form className="space-y-4 text-xs" onSubmit={(e) => { e.preventDefault(); setIsRequestingCorrection(false); }}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-500 font-medium mb-1.5">Date of Missed Clock-in</label>
                <input type="date" className="w-full border border-gray-200 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" required />
              </div>
              <div>
                <label className="block text-gray-500 font-medium mb-1.5">Correct Time</label>
                <input type="time" className="w-full border border-gray-200 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" required />
              </div>
            </div>
            <div>
              <label className="block text-gray-500 font-medium mb-1.5">Reason for Correction</label>
              <textarea rows={3} placeholder="Forgot to clock in, system error, etc." className="w-full border border-gray-200 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" required></textarea>
            </div>
            <div className="flex justify-end pt-2">
              <button type="submit" className="bg-blue-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-blue-700 shadow-md">
                Submit Request
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl border border-gray-200/80 shadow-xs overflow-hidden">
            <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h2 className="text-sm font-bold text-gray-800 flex items-center">
                <AttendanceIcon className="w-4 h-4 mr-2 text-blue-500" />
                Recent Logs
              </h2>
              <select className="text-xs border border-gray-200 rounded-md p-1.5 bg-white text-gray-600 outline-none">
                <option>This Week</option>
                <option>Last Week</option>
                <option>This Month</option>
              </select>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50/50 text-gray-500 text-[10px] uppercase tracking-wider">
                    <th className="p-3 font-semibold border-b border-gray-100">Date</th>
                    <th className="p-3 font-semibold border-b border-gray-100">Clock In</th>
                    <th className="p-3 font-semibold border-b border-gray-100">Clock Out</th>
                    <th className="p-3 font-semibold border-b border-gray-100">Total Hours</th>
                    <th className="p-3 font-semibold border-b border-gray-100 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="text-xs">
                  {[
                    { date: "Sep 7, 2026", in: "09:00 AM", out: "--:--", total: "--", status: "Active" },
                    { date: "Sep 6, 2026", in: "08:55 AM", out: "05:05 PM", total: "8h 10m", status: "Completed" },
                    { date: "Sep 5, 2026", in: "09:05 AM", out: "05:00 PM", total: "7h 55m", status: "Completed" },
                    { date: "Sep 4, 2026", in: "08:58 AM", out: "05:15 PM", total: "8h 17m", status: "Completed" },
                    { date: "Sep 3, 2026", in: "09:00 AM", out: "05:00 PM", total: "8h 00m", status: "Completed" },
                  ].map((log, i) => (
                    <tr key={i} className="border-b border-gray-50 hover:bg-gray-50/50 transition">
                      <td className="p-3 font-medium text-gray-800">{log.date}</td>
                      <td className="p-3 text-gray-600">{log.in}</td>
                      <td className="p-3 text-gray-600">{log.out}</td>
                      <td className="p-3 text-gray-600 font-semibold">{log.total}</td>
                      <td className="p-3 text-right">
                        <span className={`px-2 py-1 rounded-md text-[10px] font-bold ${
                          log.status === "Active" ? "bg-blue-50 text-blue-600" : "bg-emerald-50 text-emerald-600"
                        }`}>
                          {log.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Summary Widget */}
          <div className="bg-white rounded-xl border border-gray-200/80 shadow-xs p-5">
            <h3 className="text-sm font-bold text-gray-900 mb-4">Weekly Summary</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-500 font-medium">Hours Worked</span>
                  <span className="text-gray-900 font-bold">32h 22m / 40h</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: "80%" }}></div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="bg-gray-50 rounded-lg p-3 text-center border border-gray-100">
                  <div className="text-[10px] text-gray-500 uppercase font-bold tracking-wider mb-1">Avg Clock In</div>
                  <div className="text-sm font-bold text-gray-800">08:59 AM</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-3 text-center border border-gray-100">
                  <div className="text-[10px] text-gray-500 uppercase font-bold tracking-wider mb-1">Avg Clock Out</div>
                  <div className="text-sm font-bold text-gray-800">05:05 PM</div>
                </div>
              </div>
            </div>
          </div>

          {/* Pending Correction Requests */}
          <div className="bg-white rounded-xl border border-gray-200/80 shadow-xs p-5">
            <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center justify-between">
              Pending Requests
              <span className="bg-orange-100 text-orange-600 text-[10px] px-1.5 py-0.5 rounded font-bold">1</span>
            </h3>
            <div className="space-y-3">
              <div className="border border-orange-200 bg-orange-50/50 rounded-lg p-3">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <div className="text-xs font-bold text-gray-900">Missed Clock-in</div>
                    <div className="text-[10px] text-gray-500">For Sep 2, 2026</div>
                  </div>
                  <span className="text-[10px] font-bold text-orange-600 uppercase">Pending Review</span>
                </div>
                <p className="text-[11px] text-gray-600 italic">"Forgot my access card, started working at 9:00 AM."</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import React, { useState } from "react";
import { LeaveTrackerIcon, StarIcon } from "@/components/SidebarIcons";

export default function MyLeaveTrackerPage() {
  const [isRequestingLeave, setIsRequestingLeave] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-xl font-bold text-gray-900">My Leave Tracker</h1>
          <p className="text-xs text-gray-500 mt-1">Check remaining balances and submit time-off requests.</p>
        </div>
        <button 
          onClick={() => setIsRequestingLeave(!isRequestingLeave)}
          className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold py-2 px-4 rounded-lg shadow-md shadow-blue-500/20 transition-all"
        >
          {isRequestingLeave ? "Cancel Request" : "Request Time Off"}
        </button>
      </div>

      {/* Leave Balances */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { type: "Annual Leave", used: 10, total: 20, color: "blue" },
          { type: "Sick Leave", used: 2, total: 10, color: "emerald" },
          { type: "Personal Days", used: 1, total: 3, color: "purple" },
          { type: "Unpaid Leave", used: 0, total: 0, color: "gray" },
        ].map((balance, i) => (
          <div key={i} className="bg-white p-5 rounded-xl border border-gray-200/80 shadow-xs">
            <h3 className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2">{balance.type}</h3>
            <div className="flex items-end space-x-2">
              <span className="text-2xl font-black text-gray-900 tracking-tight">{balance.total - balance.used}</span>
              <span className="text-xs font-semibold text-gray-400 mb-1">days left</span>
            </div>
            {balance.total > 0 && (
              <div className="mt-3">
                <div className="flex justify-between text-[10px] text-gray-500 mb-1 font-medium">
                  <span>{balance.used} used</span>
                  <span>{balance.total} total</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-1.5">
                  <div className={`bg-${balance.color}-500 h-1.5 rounded-full`} style={{ width: `${(balance.used / balance.total) * 100}%` }}></div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Request Time Off Form (Toggle) */}
      {isRequestingLeave && (
        <div className="bg-white p-6 rounded-xl border border-blue-200 shadow-lg shadow-blue-100/50 animate-in fade-in slide-in-from-top-4 duration-300">
          <h2 className="text-sm font-bold text-gray-900 mb-4 border-b border-gray-100 pb-2">Submit Time-Off Request</h2>
          <form className="space-y-4 text-xs" onSubmit={(e) => { e.preventDefault(); setIsRequestingLeave(false); }}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-500 font-medium mb-1.5">Leave Type</label>
                <select className="w-full border border-gray-200 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all">
                  <option>Annual Leave</option>
                  <option>Sick Leave</option>
                  <option>Personal Days</option>
                  <option>Unpaid Leave</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-gray-500 font-medium mb-1.5">Start Date</label>
                  <input type="date" className="w-full border border-gray-200 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" required />
                </div>
                <div>
                  <label className="block text-gray-500 font-medium mb-1.5">End Date</label>
                  <input type="date" className="w-full border border-gray-200 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" required />
                </div>
              </div>
            </div>
            <div>
              <label className="block text-gray-500 font-medium mb-1.5">Reason</label>
              <textarea rows={3} placeholder="Vacation, medical appointment, etc." className="w-full border border-gray-200 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"></textarea>
            </div>
            <div className="flex justify-end pt-2">
              <button type="submit" className="bg-blue-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-blue-700 shadow-md">
                Submit Request
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Leave History List */}
      <div className="bg-white rounded-xl border border-gray-200/80 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-gray-100 bg-gray-50/50">
          <h2 className="text-sm font-bold text-gray-800 flex items-center">
            <LeaveTrackerIcon className="w-4 h-4 mr-2 text-emerald-500" />
            Recent Leave Requests
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 text-gray-500 text-[10px] uppercase tracking-wider">
                <th className="p-3 font-semibold border-b border-gray-100">Leave Type</th>
                <th className="p-3 font-semibold border-b border-gray-100">Dates</th>
                <th className="p-3 font-semibold border-b border-gray-100">Duration</th>
                <th className="p-3 font-semibold border-b border-gray-100 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="text-xs">
              {[
                { type: "Sick Leave", dates: "Sep 1, 2026 - Sep 2, 2026", duration: "2 days", status: "Approved", statusColor: "emerald" },
                { type: "Annual Leave", dates: "Aug 15, 2026 - Aug 19, 2026", duration: "5 days", status: "Approved", statusColor: "emerald" },
                { type: "Personal Days", dates: "Jul 10, 2026", duration: "1 day", status: "Approved", statusColor: "emerald" },
                { type: "Annual Leave", dates: "Dec 20, 2026 - Jan 2, 2027", duration: "10 days", status: "Pending", statusColor: "orange" },
              ].map((req, i) => (
                <tr key={i} className="border-b border-gray-50 hover:bg-gray-50/50 transition">
                  <td className="p-3 font-bold text-gray-800">{req.type}</td>
                  <td className="p-3 text-gray-600">{req.dates}</td>
                  <td className="p-3 text-gray-600 font-medium">{req.duration}</td>
                  <td className="p-3 text-right">
                    <span className={`px-2 py-1 rounded-md text-[10px] font-bold bg-${req.statusColor}-50 text-${req.statusColor}-600`}>
                      {req.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

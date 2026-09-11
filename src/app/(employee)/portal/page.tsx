"use client";

import React, { useState } from "react";
import { AttendanceIcon, LeaveTrackerIcon, StarIcon } from "@/components/SidebarIcons";
import AttendanceWidget from "@/components/AttendanceWidget";

export default function PersonalDashboardPage() {
  const [clockedIn, setClockedIn] = useState(false);
  const [time, setTime] = useState("09:00 AM");

  const handleClockToggle = () => {
    setClockedIn(!clockedIn);
    const now = new Date();
    setTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
  };

  return (
    <div className="space-y-6">
      {/* Announcement Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center space-x-2 mb-2">
            <StarIcon className="w-5 h-5 text-yellow-300" />
            <span className="text-xs font-bold uppercase tracking-wider text-blue-100">Company Announcement</span>
          </div>
          <h2 className="text-xl font-bold mb-1">Q3 Townhall Meeting Next Week</h2>
          <p className="text-sm text-blue-100 max-w-2xl">
            Join us for our quarterly all-hands meeting on Thursday at 2 PM. We will be discussing our Q3 achievements and outlining our goals for the end of the year.
          </p>
        </div>
        {/* Decorative background elements */}
        <div className="absolute right-0 top-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Clock In/Out Widget */}
        <div className="flex items-center justify-center p-4">
          <AttendanceWidget />
        </div>

        {/* Current Shifts Widget */}
        <div className="bg-white rounded-xl shadow-xs border border-gray-100 p-6">
          <h3 className="text-sm font-bold text-gray-800 flex items-center mb-1">
            <LeaveTrackerIcon className="w-4 h-4 mr-2 text-emerald-500" />
            My Upcoming Shifts
          </h3>
          <p className="text-xs text-gray-500 mb-4">Your schedule for this week.</p>
          
          <div className="space-y-3">
            {[
              { day: "Today", date: "Sep 7", time: "9:00 AM - 5:00 PM", status: "Active" },
              { day: "Tomorrow", date: "Sep 8", time: "9:00 AM - 5:00 PM", status: "Upcoming" },
              { day: "Wednesday", date: "Sep 9", time: "9:00 AM - 5:00 PM", status: "Upcoming" },
            ].map((shift, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 rounded-lg border border-gray-50 bg-gray-50/50">
                <div>
                  <div className="text-xs font-bold text-gray-900">{shift.day}</div>
                  <div className="text-[11px] text-gray-500">{shift.date}</div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-semibold text-gray-700">{shift.time}</div>
                  <div className={`text-[10px] font-bold uppercase ${shift.status === 'Active' ? 'text-emerald-600' : 'text-gray-400'}`}>
                    {shift.status}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions / Links */}
        <div className="bg-white rounded-xl shadow-xs border border-gray-100 p-6">
          <h3 className="text-sm font-bold text-gray-800 mb-4">Quick Links</h3>
          <div className="space-y-2">
            <a href="/portal/leave-tracker" className="block p-3 rounded-lg border border-gray-100 hover:border-blue-200 hover:bg-blue-50 transition-colors group">
              <div className="text-sm font-semibold text-gray-800 group-hover:text-blue-700">Request Time Off</div>
              <div className="text-xs text-gray-500">Submit vacation or sick leave</div>
            </a>
            <a href="/portal/payslips" className="block p-3 rounded-lg border border-gray-100 hover:border-blue-200 hover:bg-blue-50 transition-colors group">
              <div className="text-sm font-semibold text-gray-800 group-hover:text-blue-700">View Latest Payslip</div>
              <div className="text-xs text-gray-500">Access your recent payroll</div>
            </a>
            <a href="/portal/profile" className="block p-3 rounded-lg border border-gray-100 hover:border-blue-200 hover:bg-blue-50 transition-colors group">
              <div className="text-sm font-semibold text-gray-800 group-hover:text-blue-700">Update Profile</div>
              <div className="text-xs text-gray-500">Manage emergency contacts & details</div>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useTenant } from "@/context/TenantContext";
import AttendanceWidget from "@/components/AttendanceWidget";

export default function TeamRosterPage() {
  const {
    teamLeadProfile,
    leaveRequests,
    timesheetCorrections,
    announcements,
  } = useTenant();

  const [greeting, setGreeting] = useState("Good Afternoon");

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good Morning");
    else if (hour < 17) setGreeting("Good Afternoon");
    else setGreeting("Good Evening");
  }, []);

  // Hardcoded dummy team data representing direct reports
  const directReports = [
    { id: "emp-103", name: "Liam O'Connor", status: "Present", shiftName: "General Engineering Shift", avatar: "LO" },
    { id: "emp-105", name: "Carlos Mendez", status: "Late", shiftName: "General Engineering Shift", avatar: "CM" },
    { id: "emp-108", name: "Rachel Kim", status: "On Leave", shiftName: "General Engineering Shift", avatar: "RK" },
    { id: "emp-109", name: "Maya Lin", status: "Present", shiftName: "General Engineering Shift", avatar: "ML" },
    { id: "emp-110", name: "Ethan Walker", status: "Missing Clock-Out", shiftName: "General Engineering Shift", avatar: "EW" },
    { id: "emp-102", name: "David Chen", status: "Present", shiftName: "Morning Operations Shift", avatar: "DC" },
  ];

  // KPIs mapped directly to the requested ASCII wireframe values where possible
  const totalTeam = 12;
  const presentCount = 9;
  const onLeaveCount = 2;
  const pendingApprovalsCount =
    leaveRequests.filter((r) => r.status === "Pending").length +
    timesheetCorrections.filter((c) => c.status === "Pending").length;

  // Mini-lists
  const pendingLeaves = leaveRequests.filter((r) => r.status === "Pending").slice(0, 2);
  const pendingCorrections = timesheetCorrections.filter((c) => c.status === "Pending").slice(0, 2);
  const recentPendingApprovals = [...pendingLeaves, ...pendingCorrections].slice(0, 4);

  const upcomingLeaves = leaveRequests
    .filter((r) => r.status === "Approved")
    .slice(0, 3);

  const todayAttendance = directReports.slice(0, 4);
  const recentAnnouncements = announcements.slice(0, 3);



  return (
    <div className="space-y-6 pb-16 font-sans pt-6 sm:pt-8">
      {/* 1. Top Section */}
      <div className="flex flex-col xl:flex-row gap-6 items-start pt-4">
        {/* Left Side: Attendance Widget */}
        <div className="shrink-0 flex items-start justify-center">
          <AttendanceWidget />
        </div>

        {/* Right Side: Greeting Banner & KPI Row */}
        <div className="flex-1 w-full flex flex-col gap-6">
          
          {/* Greeting Banner */}
          <div className="bg-white p-6 rounded-xl border border-gray-200/90 flex items-center gap-6 shadow-xs w-full">
            {/* <div className="w-20 h-20 rounded border border-gray-100 flex items-center justify-center shrink-0 bg-white">
            </div> */}
            <div className="flex flex-col justify-center">
              <h1 className="text-xl text-gray-800 font-semibold flex items-center gap-3">
                {greeting},
                <span className="font-small text-blue-700">
                  {teamLeadProfile?.name?.split(" ")[0] || ""}
                </span>
              </h1>
              <p className="text-gray-500 mt-2 text-sm font-medium">
                {teamLeadProfile?.role || "Team Lead"} • {teamLeadProfile?.workLocation || ""}
              </p>
            </div>
          </div>

          {/* KPI Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Team", value: totalTeam, color: "text-blue-700", bg: "bg-blue-50" },
              { label: "Present", value: presentCount, color: "text-emerald-700", bg: "bg-emerald-50" },
              { label: "On Leave", value: onLeaveCount, color: "text-indigo-700", bg: "bg-indigo-50" },
              { label: "Pending", value: pendingApprovalsCount > 0 ? pendingApprovalsCount : 4, color: "text-amber-700", bg: "bg-amber-50" },
            ].map((kpi, idx) => (
              <div key={idx} className="bg-white p-5 rounded-xl border border-gray-200/90 shadow-xs flex flex-col items-start space-y-2 border-l-4" style={{ borderColor: kpi.bg.replace("bg-", "") }}>
                <p className="text-sm text-gray-500 font-semibold">{kpi.label}</p>
                <div className={`text-3xl font-extrabold ${kpi.color}`}>{kpi.value}</div>
              </div>
            ))}
          </div>

        </div>
      </div>

      {/* 3. Two-Column Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        
        {/* LEFT COLUMN */}
        <div className="space-y-6">
          
          {/* Pending Approvals */}
          <div className="bg-white rounded-xl border border-gray-200/90 shadow-xs overflow-hidden flex flex-col">
            <div className="p-4 border-b border-gray-100 bg-slate-50 flex items-center justify-between">
              <h2 className="text-sm font-bold text-gray-800">Pending Approvals</h2>
            </div>
            <div className="p-4 space-y-3">
              {recentPendingApprovals.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-6">No pending approvals.</p>
              ) : (
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                recentPendingApprovals.map((item: any) => (
                  <div key={item.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition">
                    <div>
                      <p className="text-sm font-bold text-gray-900">{item.employeeName}</p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {item.leaveType || "Timesheet Correction"} • {item.startDate ? `${item.startDate}` : item.date}
                      </p>
                    </div>
                    <div className="flex items-center mt-3 sm:mt-0">
                      <span className="px-2.5 py-1 bg-amber-50 text-amber-700 border border-amber-200 rounded-md text-[11px] font-bold">
                        Pending
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
            <div className="p-3 border-t border-gray-100 bg-gray-50 text-center mt-auto">
              <Link href="/tl-dashboard/desk" className="text-xs font-bold text-blue-600 hover:text-blue-800 transition">
                View All →
              </Link>
            </div>
          </div>

          {/* Upcoming Team Leaves */}
          <div className="bg-white rounded-xl border border-gray-200/90 shadow-xs overflow-hidden">
            <div className="p-4 border-b border-gray-100 bg-slate-50">
              <h2 className="text-sm font-bold text-gray-800">Upcoming Team Leaves</h2>
            </div>
            <div className="p-4 space-y-3">
              {upcomingLeaves.length === 0 ? (
                <p className="text-sm text-gray-500 py-4">No upcoming leaves scheduled.</p>
              ) : (
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                upcomingLeaves.map((leave: any) => (
                  <div key={leave.id} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs font-bold">
                        {leave.employeeName.charAt(0)}
                      </div>
                      <p className="text-sm font-semibold text-gray-800">{leave.employeeName}</p>
                    </div>
                    <p className="text-xs font-medium text-gray-500">{leave.startDate} to {leave.endDate}</p>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN */}
        <div className="space-y-6">
          
          {/* Team Attendance Today */}
          <div className="bg-white rounded-xl border border-gray-200/90 shadow-xs overflow-hidden flex flex-col">
            <div className="p-4 border-b border-gray-100 bg-slate-50 flex items-center justify-between">
              <h2 className="text-sm font-bold text-gray-800">Team Attendance Today</h2>
            </div>
            <div className="p-4 space-y-3">
              {todayAttendance.map((member) => (
                <div key={member.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 transition border border-transparent hover:border-gray-100">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full bg-slate-800 text-white flex items-center justify-center text-xs font-bold">
                      {member.avatar}
                    </div>
                    <p className="text-sm font-semibold text-gray-800">{member.name}</p>
                  </div>
                  <div>
                    {member.status === "Present" && <span className="px-2.5 py-1 text-[11px] font-bold rounded-md bg-emerald-100 text-emerald-800">Present</span>}
                    {member.status === "Late" && <span className="px-2.5 py-1 text-[11px] font-bold rounded-md bg-amber-100 text-amber-800">Late</span>}
                    {member.status === "On Leave" && <span className="px-2.5 py-1 text-[11px] font-bold rounded-md bg-indigo-100 text-indigo-800">On Leave</span>}
                    {member.status === "Missing Clock-Out" && <span className="px-2.5 py-1 text-[11px] font-bold rounded-md bg-rose-100 text-rose-800">Overdue</span>}
                  </div>
                </div>
              ))}
            </div>
            <div className="p-3 border-t border-gray-100 bg-gray-50 text-center mt-auto">
              <Link href="/tl-dashboard/attendance" className="text-xs font-bold text-blue-600 hover:text-blue-800 transition">
                View All →
              </Link>
            </div>
          </div>

          {/* Announcements */}
          <div className="bg-white rounded-xl border border-gray-200/90 shadow-xs overflow-hidden">
            <div className="p-4 border-b border-gray-100 bg-slate-50">
              <h2 className="text-sm font-bold text-gray-800">Announcements</h2>
            </div>
            <div className="p-4 space-y-4">
              {recentAnnouncements.length === 0 ? (
                <p className="text-sm text-gray-500">No recent announcements.</p>
              ) : (
                recentAnnouncements.map((ann) => (
                  <div key={ann.id} className="border-l-2 border-blue-500 pl-3">
                    <p className="text-sm font-semibold text-gray-800">{ann.title}</p>
                    <p className="text-xs text-gray-500 mt-1 line-clamp-2">{ann.content}</p>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}

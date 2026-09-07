"use client";

import { useState } from "react";
import Link from "next/link";
import { useTenant } from "@/context/TenantContext";

export default function HRDashboardRootPage() {
  const {
    currentOrg,
    employees,
    leaveRequests,
    attendanceRecords,
    payrollRuns,
    announcements,
    showToast,
  } = useTenant();

  const [analyticsDimension, setAnalyticsDimension] = useState<
    "department" | "team" | "role" | "type" | "location" | "gender"
  >("department");
  const [turnoverRange, setTurnoverRange] = useState<"6m" | "12m" | "custom">("6m");
  const [activePendingFilter, setActivePendingFilter] = useState<"all" | "leave" | "payroll">("all");

  // Dynamic KPI calculations based on current organization's data
  const totalEmployees = employees.length;
  const activeEmployees = employees.filter(
    (e) => e.status === "Active" || e.status === "Probation"
  ).length;
  const onLeaveToday = employees.filter((e) =>
    attendanceRecords.some((a) => a.employeeId === e.id && a.status === "On Leave")
  ).length;
  const newEmployeesThisMonth = employees.filter((e) => {
    const joinDate = new Date(e.joiningDate);
    const now = new Date();
    return (
      joinDate.getMonth() === now.getMonth() &&
      joinDate.getFullYear() === now.getFullYear()
    );
  }).length;
  const offboardedThisMonth = employees.filter(
    (e) => e.status === "Offboarded"
  ).length;
  const pendingLeaves = leaveRequests.filter((r) => r.status === "Pending");
  const presentToday = attendanceRecords.filter(
    (a) => a.status === "Present" || a.status === "Late"
  ).length;
  const todayAttendanceRate =
    activeEmployees > 0
      ? Math.round((presentToday / Math.max(activeEmployees, 1)) * 100)
      : 100;

  const latestPayroll = payrollRuns[0];
  const monthlyPayrollCost = latestPayroll
    ? latestPayroll.netPayroll
    : employees.reduce((acc, e) => acc + (e.compensation?.basicSalary || 0), 0);

  // 1. Headcount analytics aggregation
  const getHeadcountData = () => {
    const map: Record<string, number> = {};
    employees.forEach((emp) => {
      let key = "Other";
      if (analyticsDimension === "department") key = emp.department || "Unassigned";
      else if (analyticsDimension === "team") key = emp.team || "General";
      else if (analyticsDimension === "role") key = emp.designation || "Staff";
      else if (analyticsDimension === "type") key = emp.employmentType || "Full Time";
      else if (analyticsDimension === "location") key = emp.workLocation || "HQ";
      else if (analyticsDimension === "gender") key = emp.gender || "Not specified";

      map[key] = (map[key] || 0) + 1;
    });

    const entries = Object.entries(map).sort((a, b) => b[1] - a[1]);
    const total = Math.max(employees.length, 1);
    return entries.map(([label, count]) => ({
      label,
      count,
      percentage: Math.round((count / total) * 100),
    }));
  };

  const headcountBreakdown = getHeadcountData();

  // 2. Turnover data calculation
  // Formula: Turnover Rate = Employees Left / Average Employee Count * 100
  const monthlyTurnoverData = [
    { month: "Apr 2026", start: 136, hires: 3, left: 1, end: 138, rate: 0.73 },
    { month: "May 2026", start: 138, hires: 4, left: 0, end: 142, rate: 0.0 },
    { month: "Jun 2026", start: 142, hires: 2, left: 1, end: 143, rate: 0.7 },
    { month: "Jul 2026", start: 143, hires: 1, left: 2, end: 142, rate: 1.4 },
    { month: "Aug 2026", start: 142, hires: 2, left: 1, end: 143, rate: 0.7 },
    { month: "Sep 2026", start: 143, hires: 1, left: 1, end: 143, rate: 0.7 },
  ];

  const filteredTurnover =
    turnoverRange === "12m"
      ? [
          { month: "Oct 2025", start: 130, hires: 2, left: 1, end: 131, rate: 0.77 },
          { month: "Nov 2025", start: 131, hires: 3, left: 0, end: 134, rate: 0.0 },
          { month: "Dec 2025", start: 134, hires: 1, left: 2, end: 133, rate: 1.5 },
          { month: "Jan 2026", start: 133, hires: 4, left: 1, end: 136, rate: 0.74 },
          { month: "Feb 2026", start: 136, hires: 2, left: 1, end: 137, rate: 0.73 },
          { month: "Mar 2026", start: 137, hires: 1, left: 2, end: 136, rate: 1.47 },
          ...monthlyTurnoverData,
        ]
      : monthlyTurnoverData;

  const currentMonthTurnover = filteredTurnover[filteredTurnover.length - 1];

  // Action handlers
  const handleApproveLeave = (reqId: string, empName: string) => {
    const req = leaveRequests.find((r) => r.id === reqId);
    if (req) {
      req.status = "Approved";
      showToast(`Approved leave request for ${empName}`);
    }
  };

  const handleRejectLeave = (reqId: string, empName: string) => {
    const req = leaveRequests.find((r) => r.id === reqId);
    if (req) {
      req.status = "Rejected";
      showToast(`Rejected leave request for ${empName}`, "info");
    }
  };

  return (
    <div className="space-y-8 pb-14 font-sans">
      {/* 1. ENTERPRISE HEADER BANNER */}
      <div className="bg-white p-6 rounded-2xl border border-gray-200/90 shadow-xs flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-[11px] font-bold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              {currentOrg.name} Executive Workspace
            </span>
            <span className="text-[11px] text-gray-400 font-medium">
              Organization ID: <code className="text-gray-600">{currentOrg.id}</code>
            </span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mt-1.5 tracking-tight">
            Organization Dashboard
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Real-time workforce metrics, departmental analytics, turnover trends, and pending operational tasks.
          </p>
        </div>

        <div className="flex items-center space-x-2.5 shrink-0">
          <Link
            href="/hr-dashboard/employees"
            className="px-3.5 py-2 text-xs font-semibold text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 rounded-lg transition shadow-xs"
          >
            Employee Directory
          </Link>
          <Link
            href="/hr-dashboard/payroll"
            className="px-3.5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition shadow-sm"
          >
            Run Monthly Payroll
          </Link>
        </div>
      </div>

      {/* 2. 8 KPI METRIC CARDS */}
      <div>
        <div className="flex items-center justify-between mb-3.5">
          <h2 className="text-xs font-bold text-gray-700 uppercase tracking-wider">
            Workforce Health & Key Performance Indicators
          </h2>
          <span className="text-[11px] text-gray-400">
            Filtered by active tenant ({currentOrg.name})
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Total Employees */}
          <div className="bg-white p-5 rounded-xl border border-gray-200/90 shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-gray-500">Total Headcount</span>
              <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-slate-100 text-slate-700">
                Limit: {currentOrg.employeeLimit}
              </span>
            </div>
            <div className="flex items-baseline space-x-2">
              <span className="text-3xl font-black text-gray-900">{totalEmployees}</span>
              <span className="text-xs text-emerald-600 font-semibold">
                {currentOrg.employeeLimit - activeEmployees} slots free
              </span>
            </div>
            <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-blue-600 h-1.5 rounded-full transition-all duration-500"
                style={{
                  width: `${Math.min(
                    100,
                    Math.round((activeEmployees / currentOrg.employeeLimit) * 100)
                  )}%`,
                }}
              />
            </div>
            <p className="text-[11px] text-gray-400">
              {activeEmployees} Active staff • {offboardedThisMonth} Offboarded
            </p>
          </div>

          {/* Card 2: Active Employees */}
          <div className="bg-white p-5 rounded-xl border border-gray-200/90 shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-gray-500">Active Employees</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </div>
            <div className="flex items-baseline space-x-2">
              <span className="text-3xl font-black text-gray-900">{activeEmployees}</span>
              <span className="text-xs text-gray-500 font-medium">Regular workforce</span>
            </div>
            <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
              <div className="bg-emerald-500 h-1.5 rounded-full w-[95%]" />
            </div>
            <p className="text-[11px] text-gray-400">Payroll & compliance eligible</p>
          </div>

          {/* Card 3: Employees on Leave */}
          <div className="bg-white p-5 rounded-xl border border-gray-200/90 shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-gray-500">On Leave Today</span>
              <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-amber-50 text-amber-700">
                Availability: {100 - Math.round((onLeaveToday / Math.max(activeEmployees, 1)) * 100)}%
              </span>
            </div>
            <div className="flex items-baseline space-x-2">
              <span className="text-3xl font-black text-gray-900">{onLeaveToday}</span>
              <span className="text-xs text-amber-600 font-medium">Authorized absences</span>
            </div>
            <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
              <div className="bg-amber-500 h-1.5 rounded-full w-[12%]" />
            </div>
            <p className="text-[11px] text-gray-400">Approved Annual, Sick, or Casual</p>
          </div>

          {/* Card 4: New Hires This Month */}
          <div className="bg-white p-5 rounded-xl border border-gray-200/90 shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-gray-500">New Hires (This Month)</span>
              <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-blue-50 text-blue-700">
                +1 Joined
              </span>
            </div>
            <div className="flex items-baseline space-x-2">
              <span className="text-3xl font-black text-gray-900">
                {newEmployeesThisMonth || 1}
              </span>
              <span className="text-xs text-gray-500 font-medium">In onboarding</span>
            </div>
            <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
              <div className="bg-indigo-500 h-1.5 rounded-full w-[35%]" />
            </div>
            <p className="text-[11px] text-gray-400">Welcome pipeline active</p>
          </div>

          {/* Card 5: Offboarded This Month */}
          <div className="bg-white p-5 rounded-xl border border-gray-200/90 shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-gray-500">Offboarded (This Month)</span>
              <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-slate-100 text-slate-700">
                Preserved
              </span>
            </div>
            <div className="flex items-baseline space-x-2">
              <span className="text-3xl font-black text-gray-900">{offboardedThisMonth}</span>
              <span className="text-xs text-gray-500 font-medium">Separations</span>
            </div>
            <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
              <div className="bg-slate-400 h-1.5 rounded-full w-[20%]" />
            </div>
            <p className="text-[11px] text-gray-400">Retained for payroll & audit</p>
          </div>

          {/* Card 6: Pending Leave Requests */}
          <div className="bg-white p-5 rounded-xl border border-gray-200/90 shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-gray-500">Pending Leave Requests</span>
              {pendingLeaves.length > 0 && (
                <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-red-100 text-red-700 animate-pulse">
                  Action Required
                </span>
              )}
            </div>
            <div className="flex items-baseline space-x-2">
              <span className="text-3xl font-black text-gray-900">{pendingLeaves.length}</span>
              <span className="text-xs text-gray-500 font-medium">Awaiting HR/TL review</span>
            </div>
            <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
              <div className="bg-rose-500 h-1.5 rounded-full w-[45%]" />
            </div>
            <p className="text-[11px] text-gray-400">Requires supervisor sign-off</p>
          </div>

          {/* Card 7: Today's Attendance */}
          <div className="bg-white p-5 rounded-xl border border-gray-200/90 shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-gray-500">Today&apos;s Attendance</span>
              <span className="text-[11px] font-semibold text-emerald-600">
                {presentToday} Clocked In
              </span>
            </div>
            <div className="flex items-baseline space-x-2">
              <span className="text-3xl font-black text-gray-900">{todayAttendanceRate}%</span>
              <span className="text-xs text-emerald-600 font-medium">Punctual & logged</span>
            </div>
            <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-emerald-500 h-1.5 rounded-full"
                style={{ width: `${todayAttendanceRate}%` }}
              />
            </div>
            <p className="text-[11px] text-gray-400">Shift grace period active</p>
          </div>

          {/* Card 8: Monthly Payroll Cost */}
          <div className="bg-white p-5 rounded-xl border border-gray-200/90 shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-gray-500">Monthly Payroll Run</span>
              <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-indigo-50 text-indigo-700">
                {latestPayroll ? latestPayroll.month : "Current"}
              </span>
            </div>
            <div className="flex items-baseline space-x-2">
              <span className="text-2xl font-black text-gray-900">
                ${monthlyPayrollCost.toLocaleString()}
              </span>
              <span className="text-xs text-gray-400 font-medium">Net</span>
            </div>
            <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
              <div className="bg-indigo-600 h-1.5 rounded-full w-[88%]" />
            </div>
            <p className="text-[11px] text-gray-400">
              Tax, PF & deductions processed
            </p>
          </div>
        </div>
      </div>

      {/* 3. HEADCOUNT ANALYTICS & TURNOVER RATE SECTION (DUAL COLUMN) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 7 cols: Employee Headcount Analytics */}
        <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-gray-200/90 shadow-xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide">
                Employee Headcount Analytics
              </h3>
              <p className="text-xs text-gray-500 mt-0.5">
                Multi-dimensional workforce distribution for {currentOrg.name}
              </p>
            </div>

            {/* Dimension switcher tabs */}
            <div className="flex flex-wrap gap-1 bg-gray-100 p-1 rounded-lg text-xs">
              {(
                [
                  { id: "department", label: "Department" },
                  { id: "team", label: "Team" },
                  { id: "role", label: "Role" },
                  { id: "type", label: "Type" },
                  { id: "location", label: "Location" },
                  { id: "gender", label: "Gender" },
                ] as const
              ).map((dim) => (
                <button
                  key={dim.id}
                  type="button"
                  onClick={() => setAnalyticsDimension(dim.id)}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition cursor-pointer ${
                    analyticsDimension === dim.id
                      ? "bg-white text-blue-600 shadow-xs"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  {dim.label}
                </button>
              ))}
            </div>
          </div>

          {/* Breakdown bars */}
          <div className="space-y-3.5 pt-2">
            {headcountBreakdown.map((item, idx) => {
              const barColors = [
                "bg-blue-600",
                "bg-indigo-600",
                "bg-cyan-600",
                "bg-emerald-600",
                "bg-amber-500",
                "bg-rose-500",
              ];
              const color = barColors[idx % barColors.length];

              return (
                <div key={item.label} className="space-y-1.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold text-gray-800">{item.label}</span>
                    <span className="text-gray-500 font-mono text-[11.5px]">
                      {item.count} staff ({item.percentage}%)
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
                    <div
                      className={`${color} h-2.5 rounded-full transition-all duration-500`}
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
            <span>Total analyzed active records: {employees.length}</span>
            <Link
              href="/hr-dashboard/employees"
              className="text-blue-600 hover:underline font-semibold"
            >
              Manage directory →
            </Link>
          </div>
        </div>

        {/* Right 5 cols: Monthly Employee Turnover */}
        <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-gray-200/90 shadow-xs space-y-5 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide">
                  Monthly Employee Turnover
                </h3>
                <p className="text-[11px] text-gray-500 mt-0.5">
                  Formula: Left / Avg Count × 100
                </p>
              </div>

              {/* Range Toggle */}
              <div className="flex bg-gray-100 p-0.5 rounded-md text-[11px]">
                <button
                  type="button"
                  onClick={() => setTurnoverRange("6m")}
                  className={`px-2 py-1 rounded font-semibold transition ${
                    turnoverRange === "6m"
                      ? "bg-white text-blue-600 shadow-xs"
                      : "text-gray-600"
                  }`}
                >
                  6 Months
                </button>
                <button
                  type="button"
                  onClick={() => setTurnoverRange("12m")}
                  className={`px-2 py-1 rounded font-semibold transition ${
                    turnoverRange === "12m"
                      ? "bg-white text-blue-600 shadow-xs"
                      : "text-gray-600"
                  }`}
                >
                  12 Months
                </button>
              </div>
            </div>

            {/* Current Month Summary Card */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-gray-700">
                  {currentMonthTurnover.month} Rate
                </span>
                <span className="text-xl font-extrabold text-blue-600">
                  {currentMonthTurnover.rate.toFixed(2)}%
                </span>
              </div>
              <div className="grid grid-cols-4 gap-2 pt-2 border-t border-slate-200/60 text-center">
                <div>
                  <p className="text-[10px] text-gray-500 font-medium">Starting</p>
                  <p className="text-xs font-bold text-gray-800">{currentMonthTurnover.start}</p>
                </div>
                <div>
                  <p className="text-[10px] text-emerald-600 font-medium">+ Hires</p>
                  <p className="text-xs font-bold text-emerald-700">+{currentMonthTurnover.hires}</p>
                </div>
                <div>
                  <p className="text-[10px] text-rose-600 font-medium">- Left</p>
                  <p className="text-xs font-bold text-rose-700">-{currentMonthTurnover.left}</p>
                </div>
                <div>
                  <p className="text-[10px] text-gray-500 font-medium">Ending</p>
                  <p className="text-xs font-bold text-gray-800">{currentMonthTurnover.end}</p>
                </div>
              </div>
            </div>

            {/* Visual Turnover Chart Trend */}
            <div className="space-y-2 pt-1">
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                Turnover Movement Trend
              </span>
              <div className="space-y-2">
                {filteredTurnover.slice(-6).map((item) => (
                  <div key={item.month} className="flex items-center text-xs space-x-3">
                    <span className="w-16 font-medium text-gray-500 shrink-0 text-[11px]">
                      {item.month}
                    </span>
                    <div className="flex-1 bg-gray-100 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-indigo-600 h-2 rounded-full"
                        style={{ width: `${Math.max(5, item.rate * 35)}%` }}
                      />
                    </div>
                    <span className="w-12 text-right font-mono text-[11px] font-semibold text-gray-700 shrink-0">
                      {item.rate.toFixed(2)}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-2 text-[11px] text-gray-400 flex justify-between items-center border-t border-gray-100">
            <span>Retention Target: 95%+</span>
            <span className="text-emerald-600 font-semibold">Healthy Retention</span>
          </div>
        </div>
      </div>

      {/* 4. DASHBOARD ADDITIONAL SECTIONS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Section 1: Employees Currently On Leave */}
        <div className="bg-white p-5 rounded-2xl border border-gray-200/90 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
              On Leave Currently
            </h3>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700">
              {employees.filter((e) => e.status === "Active").slice(0, 3).length} Staff
            </span>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-2.5 rounded-lg bg-gray-50 text-xs">
              <div className="flex items-center space-x-2.5">
                <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-[10px]">
                  SW
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Sophia Williams</p>
                  <p className="text-[10px] text-gray-400">Product & Design</p>
                </div>
              </div>
              <div className="text-right">
                <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-100 text-blue-800">
                  Annual Leave
                </span>
                <p className="text-[10px] text-gray-400 mt-0.5">Returns Sep 11</p>
              </div>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-lg bg-gray-50 text-xs">
              <div className="flex items-center space-x-2.5">
                <div className="w-7 h-7 rounded-full bg-purple-100 text-purple-700 font-bold flex items-center justify-center text-[10px]">
                  RK
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Rachel Kim</p>
                  <p className="text-[10px] text-gray-400">Sales & Growth</p>
                </div>
              </div>
              <div className="text-right">
                <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-purple-100 text-purple-800">
                  Casual Leave
                </span>
                <p className="text-[10px] text-gray-400 mt-0.5">Returns Tomorrow</p>
              </div>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-lg bg-gray-50 text-xs">
              <div className="flex items-center space-x-2.5">
                <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-700 font-bold flex items-center justify-center text-[10px]">
                  CM
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Carlos Mendez</p>
                  <p className="text-[10px] text-gray-400">Engineering</p>
                </div>
              </div>
              <div className="text-right">
                <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-100 text-emerald-800">
                  Sick Leave
                </span>
                <p className="text-[10px] text-gray-400 mt-0.5">Doctor appointment</p>
              </div>
            </div>
          </div>

          <Link
            href="/hr-dashboard/leave-tracker"
            className="block text-center text-xs text-blue-600 hover:underline font-semibold pt-1"
          >
            Open Leave Tracker →
          </Link>
        </div>

        {/* Section 2: Birthdays & Work Anniversaries */}
        <div className="bg-white p-5 rounded-2xl border border-gray-200/90 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
              Birthdays & Anniversaries
            </h3>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700">
              September
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3 rounded-lg border border-emerald-100 bg-emerald-50/40 space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-emerald-950">Work Anniversary Milestone</span>
                <span className="text-[10px] font-bold text-emerald-700">Saturday, Sep 12</span>
              </div>
              <p className="text-gray-700 text-xs">
                <strong>Elena Rostova</strong> completes 3 years with Roacs Corporation.
              </p>
            </div>

            <div className="p-3 rounded-lg border border-purple-100 bg-purple-50/40 space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-purple-950">Upcoming Birthday</span>
                <span className="text-[10px] font-bold text-purple-700">Sep 29</span>
              </div>
              <p className="text-gray-700 text-xs">
                <strong>Amira Patel</strong> (HR Operations Director)
              </p>
            </div>

            <div className="p-3 rounded-lg border border-blue-100 bg-blue-50/40 space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-blue-950">Upcoming Birthday</span>
                <span className="text-[10px] font-bold text-blue-700">Nov 23</span>
              </div>
              <p className="text-gray-700 text-xs">
                <strong>David Chen</strong> (Senior Fullstack Engineer)
              </p>
            </div>
          </div>
        </div>

        {/* Section 3: Recent Hires & Recent Offboarding */}
        <div className="bg-white p-5 rounded-2xl border border-gray-200/90 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
              Workforce Movements
            </h3>
            <span className="text-[11px] font-medium text-gray-400">Lifecycle</span>
          </div>

          <div className="space-y-3 text-xs">
            {/* Recent Hire */}
            <div className="flex items-start space-x-2.5 p-2.5 rounded-lg bg-gray-50">
              <span className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <p className="font-bold text-gray-900 truncate">Carlos Mendez</p>
                  <span className="text-[10px] text-gray-400">Jul 1</span>
                </div>
                <p className="text-gray-500 text-[11px]">Junior Cloud Engineer • Core Backend</p>
                <span className="inline-block mt-1 px-1.5 py-0.5 rounded text-[9.5px] font-semibold bg-emerald-100 text-emerald-800">
                  New Hire
                </span>
              </div>
            </div>

            {/* Recent Offboarded */}
            <div className="flex items-start space-x-2.5 p-2.5 rounded-lg bg-gray-50">
              <span className="w-2 h-2 rounded-full bg-slate-400 mt-1.5 shrink-0" />
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <p className="font-bold text-gray-900 truncate">Tariq Mansour</p>
                  <span className="text-[10px] text-gray-400">Aug 31</span>
                </div>
                <p className="text-gray-500 text-[11px]">DevOps Engineer • Academic Sabbatical</p>
                <span className="inline-block mt-1 px-1.5 py-0.5 rounded text-[9.5px] font-semibold bg-slate-200 text-slate-700">
                  Offboarded (Settled)
                </span>
              </div>
            </div>

            {/* Notice Period */}
            <div className="flex items-start space-x-2.5 p-2.5 rounded-lg bg-gray-50">
              <span className="w-2 h-2 rounded-full bg-amber-500 mt-1.5 shrink-0" />
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <p className="font-bold text-gray-900 truncate">Rachel Kim</p>
                  <span className="text-[10px] text-amber-600 font-medium">Notice Period</span>
                </div>
                <p className="text-gray-500 text-[11px]">Growth Marketing • Serving 30 days</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 5. PENDING ADMIN ACTIONS & LATEST ANNOUNCEMENTS (DUAL COLUMN) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 7 cols: Pending Admin Actions */}
        <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-gray-200/90 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <div>
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide">
                Pending Admin Actions
              </h3>
              <p className="text-xs text-gray-500 mt-0.5">
                Leave approvals, expense audits, and payroll verification
              </p>
            </div>
            <div className="flex bg-gray-100 p-0.5 rounded-lg text-xs">
              <button
                type="button"
                onClick={() => setActivePendingFilter("all")}
                className={`px-2.5 py-1 rounded-md font-semibold transition ${
                  activePendingFilter === "all" ? "bg-white text-blue-600 shadow-xs" : "text-gray-600"
                }`}
              >
                All
              </button>
              <button
                type="button"
                onClick={() => setActivePendingFilter("leave")}
                className={`px-2.5 py-1 rounded-md font-semibold transition ${
                  activePendingFilter === "leave" ? "bg-white text-blue-600 shadow-xs" : "text-gray-600"
                }`}
              >
                Leaves
              </button>
            </div>
          </div>

          <div className="space-y-3">
            {pendingLeaves.length > 0 ? (
              pendingLeaves.map((req) => (
                <div
                  key={req.id}
                  className="p-3.5 rounded-xl border border-gray-200/80 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs"
                >
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-800 font-bold flex items-center justify-center shrink-0">
                      {req.employeeAvatar || "EM"}
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-gray-900">{req.employeeName}</span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-50 text-blue-700">
                          {req.leaveTypeName}
                        </span>
                      </div>
                      <p className="text-gray-600 text-[11px] mt-0.5 font-mono">
                        {req.days} Day(s) • {req.startDate} to {req.endDate}
                      </p>
                      <p className="text-gray-500 text-[11px] italic mt-0.5">
                        &quot;{req.reason}&quot;
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 shrink-0 self-end sm:self-center">
                    <button
                      type="button"
                      onClick={() => handleApproveLeave(req.id, req.employeeName)}
                      className="px-3 py-1.5 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition shadow-2xs cursor-pointer"
                    >
                      Approve
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRejectLeave(req.id, req.employeeName)}
                      className="px-3 py-1.5 rounded-md bg-white border border-gray-200 hover:bg-gray-100 text-gray-700 font-semibold text-xs transition cursor-pointer"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-xs text-gray-400 py-6">
                No pending leave approvals at this time.
              </p>
            )}

            {/* Secondary action: September Payroll Run */}
            <div className="p-3.5 rounded-xl border border-indigo-100 bg-indigo-50/40 flex items-center justify-between text-xs">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white font-bold flex items-center justify-center shrink-0">
                  $
                </div>
                <div>
                  <p className="font-bold text-indigo-950">September 2026 Payroll Run</p>
                  <p className="text-[11px] text-indigo-800">
                    Calculated for {activeEmployees} employees ($
                    {monthlyPayrollCost.toLocaleString()} Net)
                  </p>
                </div>
              </div>
              <Link
                href="/hr-dashboard/payroll"
                className="px-3 py-1.5 rounded-md bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs transition"
              >
                Review Payroll
              </Link>
            </div>
          </div>
        </div>

        {/* Right 5 cols: Latest Company Announcements */}
        <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-gray-200/90 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <div>
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide">
                Latest Bulletins
              </h3>
              <p className="text-xs text-gray-500 mt-0.5">Published via CMS authoring panel</p>
            </div>
            <Link
              href="/hr-dashboard/cms"
              className="text-xs text-blue-600 hover:underline font-semibold"
            >
              CMS Panel →
            </Link>
          </div>

          <div className="space-y-3 text-xs">
            {announcements.slice(0, 3).map((ann) => (
              <div
                key={ann.id}
                className="p-3 rounded-xl border border-gray-100 hover:border-blue-200 hover:bg-blue-50/30 transition space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`px-2 py-0.5 rounded text-[9.5px] font-bold uppercase tracking-wider ${
                      ann.priority === "Urgent"
                        ? "bg-rose-100 text-rose-800"
                        : ann.priority === "Important"
                        ? "bg-amber-100 text-amber-800"
                        : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {ann.priority} • {ann.category}
                  </span>
                  <span className="text-[10.5px] text-gray-400 font-medium">
                    {ann.publishDate}
                  </span>
                </div>
                <h4 className="font-bold text-gray-900 text-xs leading-snug">{ann.title}</h4>
                <p className="text-gray-600 text-[11px] line-clamp-2 leading-relaxed">
                  {ann.summary}
                </p>
                <div className="pt-1 flex items-center justify-between text-[10px] text-gray-400">
                  <span>Audience: {ann.audience}</span>
                  <span>By {ann.authorName}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { useTenant } from "@/context/TenantContext";
import { PlusIcon, CloseIcon, AttendanceIcon, TimeTrackerIcon } from "@/components/SidebarIcons";

interface TeamRosterMember {
  id: string;
  name: string;
  employeeId: string;
  designation: string;
  avatar: string;
  shiftName: string;
  shiftHours: string;
  checkIn?: string;
  checkOut?: string;
  status: "Active Working" | "Late Arrival" | "Missing Clock-Out" | "On Leave" | "Completed Shift";
  latenessMinutes?: number;
  elapsedHours?: string;
  isOverdue?: boolean;
}

export default function TeamRosterPage() {
  const { currentOrg, employees, attendanceRecords, regularizePunch, showToast } = useTenant();

  // Search & Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [shiftFilter, setShiftFilter] = useState("ALL");

  // Regularize Modal State
  const [isRegularizeModalOpen, setIsRegularizeModalOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<TeamRosterMember | null>(null);
  const [regularizeForm, setRegularizeForm] = useState({
    date: new Date().toISOString().split("T")[0],
    checkIn: "09:00 AM",
    checkOut: "06:00 PM",
    reason: "Forgot to punch out due to extended deployment",
  });

  // Direct team members under Team Lead
  // Filters employees where assignedTLId matches Sarah/David or belonging to Engineering Team
  const directReports: TeamRosterMember[] = [
    {
      id: "emp-103",
      name: "Liam O'Connor",
      employeeId: "RC-103",
      designation: "QA Automation Engineer",
      avatar: "LO",
      shiftName: "General Engineering Shift",
      shiftHours: "09:00 AM - 06:00 PM",
      checkIn: "08:56 AM",
      checkOut: undefined,
      status: "Active Working",
      elapsedHours: "5h 44m",
    },
    {
      id: "emp-105",
      name: "Carlos Mendez",
      employeeId: "RC-105",
      designation: "Junior Cloud Engineer",
      avatar: "CM",
      shiftName: "General Engineering Shift",
      shiftHours: "09:00 AM - 06:00 PM",
      checkIn: "09:22 AM",
      checkOut: undefined,
      status: "Late Arrival",
      latenessMinutes: 22,
      elapsedHours: "5h 18m",
    },
    {
      id: "emp-109-live",
      name: "Maya Lin",
      employeeId: "RC-111",
      designation: "Frontend Platform Engineer",
      avatar: "ML",
      shiftName: "General Engineering Shift",
      shiftHours: "09:00 AM - 06:00 PM",
      checkIn: "08:52 AM",
      checkOut: undefined,
      status: "Active Working",
      elapsedHours: "5h 48m",
    },
    {
      id: "emp-110-live",
      name: "Ethan Walker",
      employeeId: "RC-110",
      designation: "UI Systems Developer",
      avatar: "EW",
      shiftName: "General Engineering Shift",
      shiftHours: "09:00 AM - 06:00 PM",
      checkIn: "08:45 AM",
      checkOut: undefined,
      status: "Missing Clock-Out",
      isOverdue: true,
      elapsedHours: "9h 55m",
    },
    {
      id: "emp-108",
      name: "Rachel Kim",
      employeeId: "RC-108",
      designation: "Growth Tech Specialist",
      avatar: "RK",
      shiftName: "General Engineering Shift",
      shiftHours: "09:00 AM - 06:00 PM",
      checkIn: undefined,
      checkOut: undefined,
      status: "On Leave",
    },
    {
      id: "emp-102",
      name: "David Chen",
      employeeId: "RC-102",
      designation: "Senior Backend Engineer",
      avatar: "DC",
      shiftName: "Morning Operations Shift",
      shiftHours: "07:30 AM - 04:30 PM",
      checkIn: "07:28 AM",
      checkOut: "04:35 PM",
      status: "Completed Shift",
      elapsedHours: "9h 07m",
    },
  ];

  // Metrics
  const totalTeam = directReports.length;
  const activeWorkingCount = directReports.filter((m) => m.status === "Active Working").length;
  const lateArrivalCount = directReports.filter((m) => m.status === "Late Arrival").length;
  const missingClockOutCount = directReports.filter((m) => m.status === "Missing Clock-Out").length;
  const onLeaveCount = directReports.filter((m) => m.status === "On Leave").length;

  // Filtered List
  const filteredRoster = directReports.filter((m) => {
    const matchesSearch =
      m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.designation.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "ALL" ||
      (statusFilter === "ACTIVE" && m.status === "Active Working") ||
      (statusFilter === "LATE" && m.status === "Late Arrival") ||
      (statusFilter === "MISSING" && m.status === "Missing Clock-Out") ||
      (statusFilter === "LEAVE" && m.status === "On Leave");

    const matchesShift =
      shiftFilter === "ALL" ||
      (shiftFilter === "GENERAL" && m.shiftName.includes("General")) ||
      (shiftFilter === "MORNING" && m.shiftName.includes("Morning"));

    return matchesSearch && matchesStatus && matchesShift;
  });

  const handleOpenRegularize = (member: TeamRosterMember) => {
    setSelectedMember(member);
    setRegularizeForm({
      date: new Date().toISOString().split("T")[0],
      checkIn: member.checkIn || "09:00 AM",
      checkOut: "06:00 PM",
      reason: member.status === "Missing Clock-Out" ? "Shift finished at 6:00 PM, user missed sign out" : "Biometric punch adjustment",
    });
    setIsRegularizeModalOpen(true);
  };

  const handleSubmitRegularize = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMember) return;

    regularizePunch(
      selectedMember.id,
      regularizeForm.date,
      regularizeForm.checkIn,
      regularizeForm.checkOut,
      "Present"
    );

    // Update local display status
    selectedMember.checkOut = regularizeForm.checkOut;
    selectedMember.status = "Completed Shift";
    selectedMember.isOverdue = false;

    setIsRegularizeModalOpen(false);
    showToast(`Punch regularization recorded for ${selectedMember.name}.`);
  };

  const handlePingMember = (member: TeamRosterMember) => {
    showToast(`Direct alert ping sent to ${member.name} (${member.status === "Missing Clock-Out" ? "Missing Clock-Out alert" : "Punctuality reminder"}).`, "info");
  };

  const handleExportCSV = () => {
    const headers = "Employee ID,Name,Designation,Shift,Status,Check-In,Check-Out,Notes\n";
    const rows = directReports
      .map(
        (m) =>
          `"${m.employeeId}","${m.name}","${m.designation}","${m.shiftName}","${m.status}","${m.checkIn || "N/A"}","${m.checkOut || "N/A"}","${
            m.latenessMinutes ? `Late by ${m.latenessMinutes}m` : m.isOverdue ? "Missing Clock-out" : "Normal"
          }"`
      )
      .join("\n");

    const blob = new Blob([headers + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Team_Roster_Attendance_${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
    showToast("Exported Team Roster CSV successfully.");
  };

  return (
    <div className="space-y-6 pb-16 font-sans">
      {/* 1. Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-200/90 shadow-xs">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-[11px] font-bold text-amber-700 bg-amber-50 border border-amber-200/60 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              Direct Team • Engineering
            </span>
            <span className="flex items-center space-x-1 text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Live Attendance Stream</span>
            </span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mt-2 tracking-tight">
            Team Roster & Attendance
          </h1>
          <p className="text-gray-500 text-xs mt-0.5 max-w-2xl">
            Track live shift entries, missing clock-outs, and late arrivals for your immediate direct reports. Regularize missed punches with audit trail.
          </p>
        </div>
        <div className="flex items-center space-x-2.5 shrink-0">
          <button
            type="button"
            onClick={handleExportCSV}
            className="px-3.5 py-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 text-xs font-semibold rounded-lg shadow-xs transition cursor-pointer"
          >
            Export Sheet CSV
          </button>
          <button
            type="button"
            onClick={() => handleOpenRegularize(directReports[3])}
            className="inline-flex items-center px-4 py-2 bg-amber-600 hover:bg-amber-700 active:scale-95 text-white text-xs font-bold rounded-lg shadow-sm transition cursor-pointer"
          >
            <PlusIcon className="w-3.5 h-3.5 mr-1.5 text-white" size={14} />
            Regularize Missed Punch
          </button>
        </div>
      </div>

      {/* 2. Top Metrics Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white p-5 rounded-xl border border-gray-200/90 shadow-xs space-y-1">
          <div className="flex items-center justify-between">
            <p className="text-xs text-gray-500 font-medium">Direct Team Size</p>
            <span className="w-2 h-2 rounded-full bg-blue-500" />
          </div>
          <p className="text-2xl font-extrabold text-gray-900">{totalTeam}</p>
          <span className="text-[11px] text-gray-400 font-medium">Frontend & Cloud Infra</span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gray-200/90 shadow-xs space-y-1">
          <div className="flex items-center justify-between">
            <p className="text-xs text-gray-500 font-medium">Active On Shift</p>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
          </div>
          <p className="text-2xl font-extrabold text-emerald-600">{activeWorkingCount}</p>
          <span className="text-[11px] text-emerald-700 font-semibold">Clocked in right now</span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-amber-200/80 bg-amber-50/20 shadow-xs space-y-1">
          <div className="flex items-center justify-between">
            <p className="text-xs text-amber-800 font-semibold">Late Arrivals</p>
            <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-amber-200 text-amber-900">
              Grace +15m
            </span>
          </div>
          <p className="text-2xl font-extrabold text-amber-700">{lateArrivalCount}</p>
          <span className="text-[11px] text-amber-700 font-medium">Requires punctuality review</span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-rose-200/80 bg-rose-50/20 shadow-xs space-y-1">
          <div className="flex items-center justify-between">
            <p className="text-xs text-rose-800 font-semibold">Missing Clock-Outs</p>
            <span className="w-2 h-2 rounded-full bg-rose-500" />
          </div>
          <p className="text-2xl font-extrabold text-rose-600">{missingClockOutCount}</p>
          <span className="text-[11px] text-rose-700 font-medium">Shift ended without punch-out</span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gray-200/90 shadow-xs space-y-1">
          <div className="flex items-center justify-between">
            <p className="text-xs text-gray-500 font-medium">On Approved Leave</p>
            <span className="w-2 h-2 rounded-full bg-indigo-500" />
          </div>
          <p className="text-2xl font-extrabold text-indigo-600">{onLeaveCount}</p>
          <span className="text-[11px] text-gray-400 font-medium">PTO registered in HR</span>
        </div>
      </div>

      {/* 3. Filter and Search Controls */}
      <div className="bg-white p-4 rounded-xl border border-gray-200/90 shadow-xs flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div className="flex-1 relative max-w-md">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search direct report by name, ID or role..."
            className="w-full bg-gray-50 text-xs sm:text-sm text-gray-800 placeholder-gray-400 pl-3.5 pr-8 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-blue-500 focus:bg-white transition"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute right-2.5 top-2.5 text-gray-400 hover:text-gray-600 text-xs"
            >
              ✕
            </button>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="text-gray-500 font-medium text-[11px] mr-1">Filter Status:</span>
          {[
            { id: "ALL", label: "All (6)" },
            { id: "ACTIVE", label: "Active Working" },
            { id: "LATE", label: "Late" },
            { id: "MISSING", label: "Missing Punch-Out" },
            { id: "LEAVE", label: "On Leave" },
          ].map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setStatusFilter(item.id)}
              className={`px-3 py-1.5 rounded-lg font-semibold transition cursor-pointer ${
                statusFilter === item.id
                  ? "bg-blue-600 text-white shadow-xs"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {item.label}
            </button>
          ))}

          <select
            value={shiftFilter}
            onChange={(e) => setShiftFilter(e.target.value)}
            className="ml-2 bg-gray-50 border border-gray-200 text-gray-700 py-1.5 px-2.5 rounded-lg text-xs font-semibold focus:outline-none"
          >
            <option value="ALL">All Shifts</option>
            <option value="GENERAL">General Shift</option>
            <option value="MORNING">Morning Shift</option>
          </select>
        </div>
      </div>

      {/* 4. Team Roster Live Grid */}
      <div className="bg-white rounded-2xl border border-gray-200/90 shadow-xs overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-gray-900 tracking-tight">
              Live Team Shift & Punch Status
            </h2>
            <p className="text-[11px] text-gray-400 mt-0.5">
              Showing {filteredRoster.length} direct team members
            </p>
          </div>
          <span className="text-[11px] text-gray-400 font-medium">
            Shift Window: 09:00 AM - 06:00 PM (15m Grace)
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/60 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
                <th className="py-3 px-5">Team Member</th>
                <th className="py-3 px-4">Assigned Shift</th>
                <th className="py-3 px-4">Check-In</th>
                <th className="py-3 px-4">Check-Out</th>
                <th className="py-3 px-4">Live Status</th>
                <th className="py-3 px-4">Punctuality / Anomaly</th>
                <th className="py-3 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-xs">
              {filteredRoster.map((member) => {
                return (
                  <tr
                    key={member.id}
                    className={`hover:bg-gray-50/60 transition-colors ${
                      member.status === "Missing Clock-Out"
                        ? "bg-rose-50/30"
                        : member.status === "Late Arrival"
                        ? "bg-amber-50/20"
                        : ""
                    }`}
                  >
                    {/* Employee Profile */}
                    <td className="py-3.5 px-5">
                      <div className="flex items-center space-x-3">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-slate-700 to-slate-900 text-white font-bold flex items-center justify-center text-xs shrink-0 shadow-xs">
                          {member.avatar}
                        </div>
                        <div>
                          <p className="font-bold text-gray-900 leading-tight">
                            {member.name}
                          </p>
                          <p className="text-[11px] text-gray-400 leading-tight mt-0.5">
                            {member.employeeId} • {member.designation}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Shift */}
                    <td className="py-3.5 px-4 text-gray-600">
                      <p className="font-semibold text-gray-800 leading-tight">{member.shiftName}</p>
                      <p className="text-[11px] text-gray-400">{member.shiftHours}</p>
                    </td>

                    {/* Check In */}
                    <td className="py-3.5 px-4">
                      {member.checkIn ? (
                        <div className="flex items-center space-x-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          <span className="font-semibold text-gray-800">{member.checkIn}</span>
                        </div>
                      ) : (
                        <span className="text-gray-400 italic">--</span>
                      )}
                    </td>

                    {/* Check Out */}
                    <td className="py-3.5 px-4">
                      {member.checkOut ? (
                        <span className="font-semibold text-gray-800">{member.checkOut}</span>
                      ) : member.status === "Missing Clock-Out" ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800">
                          Overdue Punch-Out
                        </span>
                      ) : member.status === "Active Working" ? (
                        <span className="inline-flex items-center text-[11px] text-emerald-700 font-medium bg-emerald-50 px-2 py-0.5 rounded">
                          In Progress ({member.elapsedHours})
                        </span>
                      ) : (
                        <span className="text-gray-400 italic">--</span>
                      )}
                    </td>

                    {/* Status Badge */}
                    <td className="py-3.5 px-4">
                      {member.status === "Active Working" && (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5 animate-pulse" />
                          Active on Shift
                        </span>
                      )}
                      {member.status === "Late Arrival" && (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800">
                          Late Arrival
                        </span>
                      )}
                      {member.status === "Missing Clock-Out" && (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-100 text-rose-800 animate-pulse">
                          Missing Clock-Out
                        </span>
                      )}
                      {member.status === "On Leave" && (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold bg-indigo-100 text-indigo-800">
                          On PTO Leave
                        </span>
                      )}
                      {member.status === "Completed Shift" && (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold bg-gray-100 text-gray-700">
                          Completed ({member.elapsedHours})
                        </span>
                      )}
                    </td>

                    {/* Punctuality Details */}
                    <td className="py-3.5 px-4">
                      {member.latenessMinutes ? (
                        <div className="flex items-center space-x-1 text-amber-700 font-semibold text-[11px]">
                          <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span>+{member.latenessMinutes}m beyond grace</span>
                        </div>
                      ) : member.status === "Missing Clock-Out" ? (
                        <div className="flex items-center space-x-1 text-rose-700 font-semibold text-[11px]">
                          <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                          </svg>
                          <span>Shift ended without sign-out</span>
                        </div>
                      ) : member.status === "On Leave" ? (
                        <span className="text-gray-500 text-[11px]">PTO Approved</span>
                      ) : (
                        <span className="text-emerald-600 font-medium text-[11px]">On-Time Compliant</span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-5 text-right space-x-1.5 whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => handlePingMember(member)}
                        className="px-2.5 py-1 text-xs font-semibold rounded-md border border-gray-200 hover:bg-gray-100 text-gray-700 transition cursor-pointer"
                        title="Send ping notification"
                      >
                        Ping
                      </button>
                      <button
                        type="button"
                        onClick={() => handleOpenRegularize(member)}
                        className="px-2.5 py-1 text-xs font-semibold rounded-md bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200/80 transition cursor-pointer"
                        title="Adjust or regularize punch"
                      >
                        Regularize
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* 5. Regularize Missed Punch Modal */}
      {isRegularizeModalOpen && selectedMember && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 backdrop-blur-[1px] animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-gray-200 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <div>
                <h3 className="text-base font-bold text-gray-900 tracking-tight">
                  Regularize Punch Log
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Adjust punch records for {selectedMember.name} ({selectedMember.employeeId})
                </p>
              </div>
              <button
                onClick={() => setIsRegularizeModalOpen(false)}
                className="w-7 h-7 rounded-md bg-gray-100 hover:bg-gray-200 text-gray-500 flex items-center justify-center cursor-pointer"
              >
                <CloseIcon className="w-3.5 h-3.5" />
              </button>
            </div>

            <form onSubmit={handleSubmitRegularize} className="space-y-4 pt-4 text-xs">
              <div className="p-3 bg-amber-50 rounded-lg border border-amber-200/70 text-amber-900 flex items-start space-x-2">
                <span className="text-base">⚠️</span>
                <p className="leading-relaxed">
                  As Team Lead, your regularization entry is logged with timestamp and submitted to the HR biometrics audit sheet.
                </p>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  Target Work Date
                </label>
                <input
                  type="date"
                  required
                  value={regularizeForm.date}
                  onChange={(e) => setRegularizeForm({ ...regularizeForm, date: e.target.value })}
                  className="w-full bg-white text-sm border border-gray-300 rounded-lg px-3 py-2 focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">
                    Clock-In Time
                  </label>
                  <input
                    type="text"
                    required
                    value={regularizeForm.checkIn}
                    onChange={(e) => setRegularizeForm({ ...regularizeForm, checkIn: e.target.value })}
                    placeholder="09:00 AM"
                    className="w-full bg-white text-sm border border-gray-300 rounded-lg px-3 py-2 focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">
                    Clock-Out Time
                  </label>
                  <input
                    type="text"
                    required
                    value={regularizeForm.checkOut}
                    onChange={(e) => setRegularizeForm({ ...regularizeForm, checkOut: e.target.value })}
                    placeholder="06:00 PM"
                    className="w-full bg-white text-sm border border-gray-300 rounded-lg px-3 py-2 focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  Regularization Reason & Audit Note
                </label>
                <textarea
                  rows={2}
                  required
                  value={regularizeForm.reason}
                  onChange={(e) => setRegularizeForm({ ...regularizeForm, reason: e.target.value })}
                  placeholder="State reason for missing clock out / in adjustment..."
                  className="w-full bg-white text-sm border border-gray-300 rounded-lg px-3 py-2 focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsRegularizeModalOpen(false)}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-lg transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-lg shadow-sm transition cursor-pointer"
                >
                  Confirm & Regularize
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

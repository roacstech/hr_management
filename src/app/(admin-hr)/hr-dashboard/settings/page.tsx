"use client";

import { useState, useMemo } from "react";
import { useTenant } from "@/context/TenantContext";
import {
  OrganizationPlan,
  BillingCycle,
  WorkShift,
  LeaveTypePolicy,
  EmploymentType,
} from "@/lib/types";
import {
  BuildingIcon,
  CloseIcon,
  GearIcon,
  LeaveTrackerIcon,
  ReportsIcon,
  SearchIcon,
  AttendanceIcon,
  PlusIcon,
} from "@/components/SidebarIcons";

export default function CompanySettingsPage() {
  const {
    currentOrg,
    employees,
    workShifts,
    attendanceRules,
    leavePolicies,
    auditLogs,
    invoices,
    updateOrganizationProfile,
    updateSubscriptionPlan,
    addWorkShift,
    updateWorkShift,
    updateAttendanceRules,
    addLeavePolicy,
    updateLeavePolicy,
    deleteLeavePolicy,
    showToast,
  } = useTenant();

  const [activeTab, setActiveTab] = useState<
    "profile" | "shifts" | "attendance" | "leaves" | "subscription" | "audit" | "roles"
  >("profile");

  // Profile Form State
  const [profileForm, setProfileForm] = useState({
    name: currentOrg.name,
    industry: currentOrg.industry,
    size: currentOrg.size,
    address: currentOrg.address,
    country: currentOrg.country,
    timezone: currentOrg.timezone,
    currency: currentOrg.currency,
    financialYear: currentOrg.financialYear,
    workingWeek: currentOrg.workingWeek,
  });

  // Attendance Rules Form State
  const [attendanceForm, setAttendanceForm] = useState({
    checkInRequired: attendanceRules.checkInRequired,
    checkOutRequired: attendanceRules.checkOutRequired,
    gracePeriodMinutes: attendanceRules.gracePeriodMinutes,
    lateMarkRule: attendanceRules.lateMarkRule,
    halfDayRule: attendanceRules.halfDayRule,
    minWorkingHours: attendanceRules.minWorkingHours,
    overtimeEnabled: attendanceRules.overtimeEnabled,
    weekendWorkingAllowed: attendanceRules.weekendWorkingAllowed,
    wfhAllowed: attendanceRules.wfhAllowed,
    regularizationAllowed: attendanceRules.regularizationAllowed,
    geoLocationRequired: attendanceRules.geoLocationRequired,
    ipRestrictionEnabled: attendanceRules.ipRestrictionEnabled,
  });

  // Shift Modal State
  const [isShiftModalOpen, setIsShiftModalOpen] = useState(false);
  const [editingShift, setEditingShift] = useState<WorkShift | null>(null);
  const [shiftForm, setShiftForm] = useState({
    name: "Standard Morning Shift",
    startTime: "09:00 AM",
    endTime: "06:00 PM",
    gracePeriodMinutes: 15,
    minWorkingHours: 8,
    halfDayWorkingHours: 4,
    breakDurationMinutes: 60,
    weeklyOffDays: ["Saturday", "Sunday"],
    isNightShift: false,
    assignedType: "Company" as WorkShift["assignedTo"]["type"],
    targetId: "",
  });

  // Leave Policy Modal State
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);
  const [editingPolicy, setEditingPolicy] = useState<LeaveTypePolicy | null>(null);
  const [leaveForm, setLeaveForm] = useState({
    name: "Wellness & Mental Health Day",
    code: "WELL",
    annualAllocation: 5,
    paid: true,
    carryForward: false,
    maxCarryForward: 0,
    accrualType: "Annual Upfront" as LeaveTypePolicy["accrualType"],
    maxConsecutiveDays: 3,
    minNoticePeriod: 1,
    attachmentRequired: false,
    halfDayAllowed: true,
    negativeBalanceAllowed: false,
    status: "Active" as "Active" | "Inactive",
    effectiveDate: "Immediate" as "Immediate" | "Next Leave Year",
  });

  // Subscription Modal State
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<OrganizationPlan>(currentOrg.plan);
  const [selectedCycle, setSelectedCycle] = useState<BillingCycle>(currentOrg.billingCycle);

  // Audit Log Search & Filter
  const [auditSearch, setAuditSearch] = useState("");
  const [auditModuleFilter, setAuditModuleFilter] = useState("all");

  const filteredAuditLogs = useMemo(() => {
    return auditLogs.filter((log) => {
      const matchesSearch =
        !auditSearch ||
        log.userName.toLowerCase().includes(auditSearch.toLowerCase()) ||
        log.action.toLowerCase().includes(auditSearch.toLowerCase()) ||
        log.newValue.toLowerCase().includes(auditSearch.toLowerCase());
      const matchesMod = auditModuleFilter === "all" || log.module === auditModuleFilter;
      return matchesSearch && matchesMod;
    });
  }, [auditLogs, auditSearch, auditModuleFilter]);

  // Profile Save
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateOrganizationProfile(profileForm);
  };

  // Attendance Rules Save
  const handleSaveAttendanceRules = (e: React.FormEvent) => {
    e.preventDefault();
    updateAttendanceRules(attendanceForm);
  };

  // Shift Save
  const handleSaveShift = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingShift) {
      updateWorkShift(editingShift.id, {
        name: shiftForm.name,
        startTime: shiftForm.startTime,
        endTime: shiftForm.endTime,
        gracePeriodMinutes: Number(shiftForm.gracePeriodMinutes),
        minWorkingHours: Number(shiftForm.minWorkingHours),
        halfDayWorkingHours: Number(shiftForm.halfDayWorkingHours),
        breakDurationMinutes: Number(shiftForm.breakDurationMinutes),
        weeklyOffDays: shiftForm.weeklyOffDays,
        isNightShift: shiftForm.isNightShift,
        assignedTo: { type: shiftForm.assignedType, targetId: shiftForm.targetId },
      });
    } else {
      addWorkShift({
        name: shiftForm.name,
        startTime: shiftForm.startTime,
        endTime: shiftForm.endTime,
        gracePeriodMinutes: Number(shiftForm.gracePeriodMinutes),
        minWorkingHours: Number(shiftForm.minWorkingHours),
        halfDayWorkingHours: Number(shiftForm.halfDayWorkingHours),
        breakDurationMinutes: Number(shiftForm.breakDurationMinutes),
        weeklyOffDays: shiftForm.weeklyOffDays,
        isNightShift: shiftForm.isNightShift,
        assignedTo: { type: shiftForm.assignedType, targetId: shiftForm.targetId },
      });
    }
    setIsShiftModalOpen(false);
    setEditingShift(null);
  };

  // Leave Policy Save
  const handleSaveLeavePolicy = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingPolicy) {
      updateLeavePolicy(editingPolicy.id, {
        name: leaveForm.name,
        code: leaveForm.code,
        annualAllocation: Number(leaveForm.annualAllocation),
        paid: leaveForm.paid,
        carryForward: leaveForm.carryForward,
        maxCarryForward: Number(leaveForm.maxCarryForward),
        accrualType: leaveForm.accrualType,
        maxConsecutiveDays: Number(leaveForm.maxConsecutiveDays),
        minNoticePeriod: Number(leaveForm.minNoticePeriod),
        attachmentRequired: leaveForm.attachmentRequired,
        halfDayAllowed: leaveForm.halfDayAllowed,
        negativeBalanceAllowed: leaveForm.negativeBalanceAllowed,
        status: leaveForm.status,
        effectiveDate: leaveForm.effectiveDate,
      });
    } else {
      addLeavePolicy({
        name: leaveForm.name,
        code: leaveForm.code,
        annualAllocation: Number(leaveForm.annualAllocation),
        paid: leaveForm.paid,
        carryForward: leaveForm.carryForward,
        maxCarryForward: Number(leaveForm.maxCarryForward),
        accrualType: leaveForm.accrualType,
        maxConsecutiveDays: Number(leaveForm.maxConsecutiveDays),
        minNoticePeriod: Number(leaveForm.minNoticePeriod),
        attachmentRequired: leaveForm.attachmentRequired,
        halfDayAllowed: leaveForm.halfDayAllowed,
        negativeBalanceAllowed: leaveForm.negativeBalanceAllowed,
        employmentTypeEligibility: ["Full Time" as EmploymentType, "Part Time" as EmploymentType],
        status: leaveForm.status,
        effectiveDate: leaveForm.effectiveDate,
      });
    }
    setIsLeaveModalOpen(false);
    setEditingPolicy(null);
  };

  // Upgrade Plan Confirm
  const handleConfirmPlanChange = () => {
    updateSubscriptionPlan(selectedPlan, selectedCycle);
    setIsUpgradeModalOpen(false);
  };

  // Export Audit CSV
  const handleExportAuditCSV = () => {
    const headers = "ID,Timestamp,User,Module,Action,RecordID,PreviousValue,NewValue,IPAddress\n";
    const rows = filteredAuditLogs
      .map(
        (l) =>
          `"${l.id}","${l.timestamp}","${l.userName}","${l.module}","${l.action}","${l.recordId}","${l.previousValue || ""}","${l.newValue}","${l.ipAddress}"`
      )
      .join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Audit_Log_${currentOrg.name}_${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
    showToast("Downloaded security audit trail CSV.");
  };

  return (
    <div className="space-y-6 pb-16 font-sans">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-gray-200/90 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-[11px] font-bold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              {currentOrg.name} Configuration Console
            </span>
            <span className="text-[11px] text-gray-400 font-mono">
              Tenant ID: {currentOrg.id}
            </span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mt-1.5 tracking-tight">
            Company Settings & Policies
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Manage company profile, multi-shift rosters, attendance rules, custom PTO allocations, and SaaS subscription.
          </p>
        </div>
      </div>

      {/* Tabs Bar */}
      <div className="bg-white px-4 border border-gray-200/90 rounded-xl shadow-xs flex space-x-2 overflow-x-auto text-xs font-semibold">
        {(
          [
            { id: "profile", label: "Company Profile", icon: BuildingIcon },
            { id: "shifts", label: "Work Shifts", icon: BuildingIcon },
            { id: "attendance", label: "Attendance Rules", icon: AttendanceIcon },
            { id: "leaves", label: "Leave Policies", icon: LeaveTrackerIcon },
            { id: "subscription", label: "Subscription & Billing", icon: GearIcon },
            { id: "audit", label: "Audit Logs", icon: ReportsIcon },
            { id: "roles", label: "Roles & Permissions", icon: GearIcon },
          ] as const
        ).map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`py-3 px-3 border-b-2 flex items-center space-x-1.5 whitespace-nowrap transition cursor-pointer ${
                activeTab === tab.id
                  ? "border-blue-600 text-blue-600 font-bold"
                  : "border-transparent text-gray-500 hover:text-gray-800"
              }`}
            >
              <Icon className="w-3.5 h-3.5" size={15} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: COMPANY PROFILE */}
      {activeTab === "profile" && (
        <form onSubmit={handleSaveProfile} className="bg-white p-6 rounded-2xl border border-gray-200/90 shadow-xs space-y-5 max-w-3xl text-xs">
          <div>
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide">
              Company Legal Entity
            </h3>
            <p className="text-gray-500 text-[11px] mt-0.5">
              Primary organization profile applied across all payslips and notifications.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-gray-700 mb-1">Company Legal Name</label>
              <input
                type="text"
                value={profileForm.name}
                onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                className="w-full rounded-lg border border-gray-200 p-2.5 text-xs text-gray-900 focus:border-blue-500 outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-gray-700 mb-1">Industry Sector</label>
              <input
                type="text"
                value={profileForm.industry}
                onChange={(e) => setProfileForm({ ...profileForm, industry: e.target.value })}
                className="w-full rounded-lg border border-gray-200 p-2.5 text-xs text-gray-900 focus:border-blue-500 outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-gray-700 mb-1">Headquarters Address</label>
              <input
                type="text"
                value={profileForm.address}
                onChange={(e) => setProfileForm({ ...profileForm, address: e.target.value })}
                className="w-full rounded-lg border border-gray-200 p-2.5 text-xs text-gray-900 focus:border-blue-500 outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-gray-700 mb-1">Country</label>
              <input
                type="text"
                value={profileForm.country}
                onChange={(e) => setProfileForm({ ...profileForm, country: e.target.value })}
                className="w-full rounded-lg border border-gray-200 p-2.5 text-xs text-gray-900 focus:border-blue-500 outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-semibold text-gray-700 mb-1">Primary Timezone</label>
              <select
                value={profileForm.timezone}
                onChange={(e) => setProfileForm({ ...profileForm, timezone: e.target.value })}
                className="w-full rounded-lg border border-gray-200 p-2.5 text-xs text-gray-900 bg-white"
              >
                <option value="UTC-07:00 (Pacific Time)">UTC-07:00 (Pacific Time)</option>
                <option value="UTC-05:00 (Eastern Time)">UTC-05:00 (Eastern Time)</option>
                <option value="UTC+00:00 (GMT)">UTC+00:00 (GMT)</option>
                <option value="UTC+05:30 (India Standard Time)">UTC+05:30 (IST)</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-gray-700 mb-1">Financial Year</label>
              <input
                type="text"
                value={profileForm.financialYear}
                onChange={(e) => setProfileForm({ ...profileForm, financialYear: e.target.value })}
                className="w-full rounded-lg border border-gray-200 p-2.5 text-xs text-gray-900"
              />
            </div>

            <div>
              <label className="block font-semibold text-gray-700 mb-1">Standard Working Week</label>
              <input
                type="text"
                value={profileForm.workingWeek}
                onChange={(e) => setProfileForm({ ...profileForm, workingWeek: e.target.value })}
                className="w-full rounded-lg border border-gray-200 p-2.5 text-xs text-gray-900"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-gray-100 flex justify-end">
            <button
              type="submit"
              className="px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold transition shadow-xs cursor-pointer"
            >
              Save Organization Profile
            </button>
          </div>
        </form>
      )}

      {/* TAB 2: WORK SHIFTS */}
      {activeTab === "shifts" && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white p-5 rounded-2xl border border-gray-200/90 shadow-xs">
            <div>
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide">
                Work Shifts Configuration
              </h3>
              <p className="text-gray-500 text-xs">
                Configure standard, morning, and night shifts with grace periods and roster assignments.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setEditingShift(null);
                setShiftForm({
                  name: "Night Support Shift",
                  startTime: "08:00 PM",
                  endTime: "05:00 AM",
                  gracePeriodMinutes: 20,
                  minWorkingHours: 8,
                  halfDayWorkingHours: 4,
                  breakDurationMinutes: 60,
                  weeklyOffDays: ["Saturday", "Sunday"],
                  isNightShift: true,
                  assignedType: "Company",
                  targetId: "",
                });
                setIsShiftModalOpen(true);
              }}
              className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-lg shadow-sm"
            >
              <PlusIcon className="w-3.5 h-3.5 mr-1.5 text-white" size={14} />
               Create New Shift
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {workShifts.map((shift) => (
              <div
                key={shift.id}
                className="bg-white p-5 rounded-2xl border border-gray-200/90 shadow-xs space-y-3"
              >
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-gray-900 text-sm">{shift.name}</h4>
                  {shift.isNightShift && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-100 text-indigo-800">
                      Night Shift
                    </span>
                  )}
                </div>

                <div className="text-xs space-y-1.5 text-gray-600 font-mono">
                  <p className="text-blue-600 font-bold">
                    {shift.startTime} – {shift.endTime}
                  </p>
                  <p className="text-[11px] text-gray-500 font-sans">
                    Grace Period: {shift.gracePeriodMinutes} mins • Break: {shift.breakDurationMinutes} mins
                  </p>
                  <p className="text-[11px] text-gray-500 font-sans">
                    Working Days: {shift.weeklyOffDays.length > 0 ? "Mon - Fri" : "All Days"}
                  </p>
                  <p className="text-[11px] text-gray-700 font-sans font-semibold pt-1 border-t border-gray-100">
                    Assigned To: {shift.assignedTo.type} ({shift.assignedTo.targetName || "Entire Company"})
                  </p>
                </div>

                <div className="pt-2 border-t border-gray-100 flex justify-end">
                  <button
                    type="button"
                    onClick={() => {
                      setEditingShift(shift);
                      setShiftForm({
                        name: shift.name,
                        startTime: shift.startTime,
                        endTime: shift.endTime,
                        gracePeriodMinutes: shift.gracePeriodMinutes,
                        minWorkingHours: shift.minWorkingHours,
                        halfDayWorkingHours: shift.halfDayWorkingHours,
                        breakDurationMinutes: shift.breakDurationMinutes,
                        weeklyOffDays: shift.weeklyOffDays,
                        isNightShift: shift.isNightShift,
                        assignedType: shift.assignedTo.type,
                        targetId: shift.assignedTo.targetId || "",
                      });
                      setIsShiftModalOpen(true);
                    }}
                    className="text-xs font-semibold text-blue-600 hover:text-blue-800"
                  >
                    Edit Shift →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: ATTENDANCE RULES */}
      {activeTab === "attendance" && (
        <form onSubmit={handleSaveAttendanceRules} className="bg-white p-6 rounded-2xl border border-gray-200/90 shadow-xs space-y-6 max-w-3xl text-xs">
          <div>
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide">
              Punctuality & Attendance Policy Rules
            </h3>
            <p className="text-gray-500 text-xs mt-0.5">
              Automated rules governing late marks, half-days, WFH approvals, and biometric geofencing.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-3.5 rounded-xl border border-gray-200 space-y-2">
              <label className="flex items-center space-x-2.5 font-semibold text-gray-800 cursor-pointer">
                <input
                  type="checkbox"
                  checked={attendanceForm.checkInRequired}
                  onChange={(e) => setAttendanceForm({ ...attendanceForm, checkInRequired: e.target.checked })}
                  className="rounded text-blue-600"
                />
                <span>Mandatory Web / Biometric Check-In</span>
              </label>
              <p className="text-[11px] text-gray-400 pl-6">
                Employees must record punch times when starting shifts.
              </p>
            </div>

            <div className="p-3.5 rounded-xl border border-gray-200 space-y-2">
              <label className="flex items-center space-x-2.5 font-semibold text-gray-800 cursor-pointer">
                <input
                  type="checkbox"
                  checked={attendanceForm.checkOutRequired}
                  onChange={(e) => setAttendanceForm({ ...attendanceForm, checkOutRequired: e.target.checked })}
                  className="rounded text-blue-600"
                />
                <span>Mandatory Web Check-Out</span>
              </label>
              <p className="text-[11px] text-gray-400 pl-6">
                Punches required upon conclusion of daily tasks.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-gray-700 mb-1">Grace Period (Minutes)</label>
              <input
                type="number"
                value={attendanceForm.gracePeriodMinutes}
                onChange={(e) => setAttendanceForm({ ...attendanceForm, gracePeriodMinutes: Number(e.target.value) })}
                className="w-full rounded-lg border border-gray-200 p-2.5 text-xs text-gray-900 font-mono"
              />
            </div>

            <div>
              <label className="block font-semibold text-gray-700 mb-1">Minimum Working Hours</label>
              <input
                type="number"
                step="0.5"
                value={attendanceForm.minWorkingHours}
                onChange={(e) => setAttendanceForm({ ...attendanceForm, minWorkingHours: Number(e.target.value) })}
                className="w-full rounded-lg border border-gray-200 p-2.5 text-xs text-gray-900 font-mono"
              />
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block font-semibold text-gray-700 mb-1">Late Mark Rule Description</label>
              <input
                type="text"
                value={attendanceForm.lateMarkRule}
                onChange={(e) => setAttendanceForm({ ...attendanceForm, lateMarkRule: e.target.value })}
                className="w-full rounded-lg border border-gray-200 p-2.5 text-xs text-gray-900"
              />
            </div>

            <div>
              <label className="block font-semibold text-gray-700 mb-1">Half-Day Working Threshold</label>
              <input
                type="text"
                value={attendanceForm.halfDayRule}
                onChange={(e) => setAttendanceForm({ ...attendanceForm, halfDayRule: e.target.value })}
                className="w-full rounded-lg border border-gray-200 p-2.5 text-xs text-gray-900"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-gray-100">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={attendanceForm.overtimeEnabled}
                onChange={(e) => setAttendanceForm({ ...attendanceForm, overtimeEnabled: e.target.checked })}
                className="rounded text-blue-600"
              />
              <span className="font-semibold text-gray-700">Overtime Calculation</span>
            </label>

            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={attendanceForm.wfhAllowed}
                onChange={(e) => setAttendanceForm({ ...attendanceForm, wfhAllowed: e.target.checked })}
                className="rounded text-blue-600"
              />
              <span className="font-semibold text-gray-700">Work From Home (WFH)</span>
            </label>

            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={attendanceForm.regularizationAllowed}
                onChange={(e) => setAttendanceForm({ ...attendanceForm, regularizationAllowed: e.target.checked })}
                className="rounded text-blue-600"
              />
              <span className="font-semibold text-gray-700">Attendance Regularization</span>
            </label>
          </div>

          <div className="pt-3 border-t border-gray-100 flex justify-end">
            <button
              type="submit"
              className="px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold transition shadow-xs cursor-pointer"
            >
              Save Attendance Rules
            </button>
          </div>
        </form>
      )}

      {/* TAB 4: LEAVE POLICIES */}
      {activeTab === "leaves" && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white p-5 rounded-2xl border border-gray-200/90 shadow-xs">
            <div>
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide">
                Custom Leave Policies ({leavePolicies.length})
              </h3>
              <p className="text-gray-500 text-xs">
                Manage leave quotas (e.g. 15 Annual, 10 Casual, 12 Sick), rollover carry forwards, and eligibility.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setEditingPolicy(null);
                setLeaveForm({
                  name: "Paternity / Family Support Leave",
                  code: "PAT",
                  annualAllocation: 10,
                  paid: true,
                  carryForward: false,
                  maxCarryForward: 0,
                  accrualType: "Annual Upfront",
                  maxConsecutiveDays: 10,
                  minNoticePeriod: 7,
                  attachmentRequired: true,
                  halfDayAllowed: false,
                  negativeBalanceAllowed: false,
                  status: "Active",
                  effectiveDate: "Immediate",
                });
                setIsLeaveModalOpen(true);
              }}
              className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-lg shadow-sm"
            >
              <PlusIcon className="w-3.5 h-3.5 mr-1.5 text-white" size={14} />
               Create Custom Policy
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200/90 overflow-hidden shadow-xs">
            <table className="w-full text-left text-xs text-gray-600">
              <thead className="bg-slate-50/80 text-[11px] font-bold uppercase tracking-wider text-gray-500 border-b border-gray-200">
                <tr>
                  <th className="px-5 py-3.5">Leave Name & Code</th>
                  <th className="px-5 py-3.5">Annual Allocation</th>
                  <th className="px-5 py-3.5">Type</th>
                  <th className="px-5 py-3.5">Carry Forward</th>
                  <th className="px-5 py-3.5">Notice & Rules</th>
                  <th className="px-5 py-3.5">Status</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {leavePolicies.map((pol) => (
                  <tr key={pol.id} className="hover:bg-gray-50/60 transition">
                    <td className="px-5 py-4 whitespace-nowrap">
                      <p className="font-bold text-gray-900">{pol.name}</p>
                      <span className="font-mono text-[10.5px] font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">
                        {pol.code}
                      </span>
                    </td>
                    <td className="px-5 py-4 font-mono font-bold text-gray-900 whitespace-nowrap">
                      {pol.annualAllocation} Days / year
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-0.5 rounded text-[10.5px] font-semibold ${
                          pol.paid ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"
                        }`}
                      >
                        {pol.paid ? "Paid Leave" : "Loss of Pay"}
                      </span>
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap font-mono text-[11px]">
                      {pol.carryForward ? `Max ${pol.maxCarryForward} Days` : "No Carry Forward"}
                    </td>
                    <td className="px-5 py-4 text-[11px] text-gray-500 whitespace-nowrap">
                      Min Notice: {pol.minNoticePeriod}d • Half-Day: {pol.halfDayAllowed ? "Yes" : "No"}
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10.5px] font-bold ${
                          pol.status === "Active"
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {pol.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right whitespace-nowrap space-x-2">
                      <button
                        type="button"
                        onClick={() => {
                          setEditingPolicy(pol);
                          setLeaveForm({
                            name: pol.name,
                            code: pol.code,
                            annualAllocation: pol.annualAllocation,
                            paid: pol.paid,
                            carryForward: pol.carryForward,
                            maxCarryForward: pol.maxCarryForward,
                            accrualType: pol.accrualType,
                            maxConsecutiveDays: pol.maxConsecutiveDays,
                            minNoticePeriod: pol.minNoticePeriod,
                            attachmentRequired: pol.attachmentRequired,
                            halfDayAllowed: pol.halfDayAllowed,
                            negativeBalanceAllowed: pol.negativeBalanceAllowed,
                            status: pol.status,
                            effectiveDate: pol.effectiveDate,
                          });
                          setIsLeaveModalOpen(true);
                        }}
                        className="text-xs font-semibold text-blue-600 hover:text-blue-800"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteLeavePolicy(pol.id)}
                        className="text-xs font-semibold text-rose-600 hover:text-rose-800"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 5: SAAS SUBSCRIPTION & BILLING */}
      {activeTab === "subscription" && (
        <div className="space-y-6">
          {/* Plan Usage & Status Banner */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200/90 shadow-xs flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center space-x-2.5">
                <span className="text-sm font-bold text-gray-900">Current Plan:</span>
                <span className="px-3 py-1 rounded-lg text-xs font-black bg-blue-600 text-white shadow-xs">
                  {currentOrg.plan} Edition
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                  {currentOrg.subscriptionStatus}
                </span>
              </div>
              <p className="text-xs text-gray-500">
                Billed {currentOrg.billingCycle} • Next renewal scheduled on {currentOrg.renewalDate} (${currentOrg.monthlyCost}/month).
              </p>
            </div>

            <div className="w-full md:w-72 space-y-1.5">
              <div className="flex justify-between text-xs font-semibold">
                <span>Employee Slots Allocated:</span>
                <span className="font-mono text-blue-600 font-bold">
                  {employees.filter((e) => e.status !== "Offboarded").length} / {currentOrg.employeeLimit}
                </span>
              </div>
              <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-blue-600 h-2.5 rounded-full transition-all duration-500"
                  style={{
                    width: `${Math.min(
                      100,
                      Math.round(
                        (employees.filter((e) => e.status !== "Offboarded").length /
                          currentOrg.employeeLimit) *
                          100
                      )
                    )}%`,
                  }}
                />
              </div>
              <p className="text-[10.5px] text-gray-400 text-right">
                {currentOrg.employeeLimit -
                  employees.filter((e) => e.status !== "Offboarded").length}{" "}
                slots remaining
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                setSelectedPlan(currentOrg.plan);
                setSelectedCycle(currentOrg.billingCycle);
                setIsUpgradeModalOpen(true);
              }}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md transition cursor-pointer shrink-0"
            >
              Change / Upgrade Plan
            </button>
          </div>

          {/* Plan Feature Comparison Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Starter */}
            <div
              className={`p-6 rounded-2xl border transition space-y-4 ${
                currentOrg.plan === "Starter"
                  ? "bg-blue-50/50 border-blue-400 ring-2 ring-blue-200"
                  : "bg-white border-gray-200"
              }`}
            >
              <div>
                <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
                  Starter Plan
                </span>
                <h4 className="text-2xl font-black text-gray-900 mt-1">$99 / month</h4>
                <p className="text-xs text-gray-500 mt-1">
                  Ideal for emerging businesses & boutique teams.
                </p>
              </div>

              <div className="space-y-2 pt-2 text-xs text-gray-700">
                <p className="font-bold text-gray-900">Features Included:</p>
                <p>✓ Up to 25 Active Employees</p>
                <p>✓ Leave Tracker & Accrual Rules</p>
                <p>✓ Daily Attendance Punch In/Out</p>
                <p className="text-gray-400">✗ Automated Payroll Processing</p>
                <p className="text-gray-400">✗ CMS Bulletins & Handbook</p>
              </div>
            </div>

            {/* Professional */}
            <div
              className={`p-6 rounded-2xl border transition space-y-4 ${
                currentOrg.plan === "Professional"
                  ? "bg-blue-50/50 border-blue-400 ring-2 ring-blue-200"
                  : "bg-white border-gray-200"
              }`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
                    Professional Plan
                  </span>
                  <h4 className="text-2xl font-black text-gray-900 mt-1">$499 / month</h4>
                  <p className="text-xs text-gray-500 mt-1">
                    Complete workforce operations for scaling mid-market companies.
                  </p>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-600 text-white">
                  Active Plan
                </span>
              </div>

              <div className="space-y-2 pt-2 text-xs text-gray-700">
                <p className="font-bold text-gray-900">Features Included:</p>
                <p>✓ Up to 200 Active Employees</p>
                <p>✓ Global Payroll & Tax Deduction Engine</p>
                <p>✓ PDF Payslip Generation & Bulk Dispatch</p>
                <p>✓ CMS Company Bulletins & Knowledge Base</p>
                <p>✓ Multi-Shift Roster Management</p>
                <p>✓ Audit Trail Logging</p>
              </div>
            </div>

            {/* Enterprise */}
            <div
              className={`p-6 rounded-2xl border transition space-y-4 ${
                currentOrg.plan === "Enterprise"
                  ? "bg-blue-50/50 border-blue-400 ring-2 ring-blue-200"
                  : "bg-white border-gray-200"
              }`}
            >
              <div>
                <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
                  Enterprise Suite
                </span>
                <h4 className="text-2xl font-black text-gray-900 mt-1">$999 / month</h4>
                <p className="text-xs text-gray-500 mt-1">
                  Global enterprises requiring custom SLAs and unlimited scale.
                </p>
              </div>

              <div className="space-y-2 pt-2 text-xs text-gray-700">
                <p className="font-bold text-gray-900">Features Included:</p>
                <p>✓ Up to 1,000+ Active Employees</p>
                <p>✓ Custom Salary Structure Components</p>
                <p>✓ Dedicated Account Concierge</p>
                <p>✓ 99.99% Guaranteed SLA</p>
                <p>✓ SOC2 Type II Audit Compliance</p>
              </div>
            </div>
          </div>

          {/* Billing & Invoice History */}
          <div className="bg-white p-5 rounded-2xl border border-gray-200/90 shadow-xs space-y-4">
            <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
              SaaS Billing History & Receipts
            </h4>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-gray-600">
                <thead className="bg-slate-50 text-[11px] font-bold uppercase text-gray-500 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-2.5">Invoice #</th>
                    <th className="px-4 py-2.5">Billing Date</th>
                    <th className="px-4 py-2.5">Plan / Cycle</th>
                    <th className="px-4 py-2.5">Amount Disbursed</th>
                    <th className="px-4 py-2.5">Payment Status</th>
                    <th className="px-4 py-2.5 text-right">Receipt</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {invoices.map((inv) => (
                    <tr key={inv.id}>
                      <td className="px-4 py-3 font-mono font-semibold text-gray-900">{inv.invoiceNumber}</td>
                      <td className="px-4 py-3">{inv.date}</td>
                      <td className="px-4 py-3">{inv.planName}</td>
                      <td className="px-4 py-3 font-mono font-bold text-gray-900">${inv.amount}</td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-0.5 rounded text-[10.5px] font-bold bg-emerald-100 text-emerald-800">
                          {inv.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          type="button"
                          onClick={() => showToast(`Downloaded invoice ${inv.invoiceNumber}.`)}
                          className="text-blue-600 hover:text-blue-800 font-semibold text-xs"
                        >
                          Download PDF
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: AUDIT LOGS */}
      {activeTab === "audit" && (
        <div className="bg-white p-5 rounded-2xl border border-gray-200/90 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs">
            <div>
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide">
                Security & Administrative Audit Trail
              </h3>
              <p className="text-gray-500 text-xs">
                Immutable chronological ledger of sensitive actions across employee, payroll, and setting modifications.
              </p>
            </div>
            <button
              type="button"
              onClick={handleExportAuditCSV}
              className="px-3.5 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold"
            >
              Export to CSV
            </button>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 text-xs">
            <div className="relative flex-1">
              <SearchIcon className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search audit trail by user, action, or record..."
                value={auditSearch}
                onChange={(e) => setAuditSearch(e.target.value)}
                className="w-full bg-white pl-9 pr-3 py-1.5 rounded-lg border border-gray-200"
              />
            </div>
            <select
              value={auditModuleFilter}
              onChange={(e) => setAuditModuleFilter(e.target.value)}
              className="bg-white border border-gray-200 rounded-lg p-1.5 text-xs text-gray-700"
            >
              <option value="all">All Modules</option>
              <option value="Employee">Employee</option>
              <option value="Payroll">Payroll</option>
              <option value="Leave Policy">Leave Policy</option>
              <option value="Company Settings">Company Settings</option>
              <option value="CMS">CMS</option>
              <option value="Subscription">Subscription</option>
            </select>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-gray-600">
              <thead className="bg-slate-50 text-[11px] font-bold uppercase text-gray-500 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-2.5">Timestamp</th>
                  <th className="px-4 py-2.5">User</th>
                  <th className="px-4 py-2.5">Module</th>
                  <th className="px-4 py-2.5">Action</th>
                  <th className="px-4 py-2.5">Details</th>
                  <th className="px-4 py-2.5">IP Address</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-mono text-[11.5px]">
                {filteredAuditLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-gray-50/50">
                    <td className="px-4 py-3 whitespace-nowrap text-gray-400">
                      {new Date(log.timestamp).toLocaleString()}
                    </td>
                    <td className="px-4 py-3 font-sans font-semibold text-gray-900 whitespace-nowrap">
                      {log.userName}
                    </td>
                    <td className="px-4 py-3 font-sans whitespace-nowrap">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">
                        {log.module}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-semibold text-blue-600 whitespace-nowrap">
                      {log.action}
                    </td>
                    <td className="px-4 py-3 font-sans text-gray-700 max-w-xs truncate">
                      {log.newValue}
                    </td>
                    <td className="px-4 py-3 text-gray-400 whitespace-nowrap">
                      {log.ipAddress}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 7: ROLES & PERMISSIONS MATRIX */}
      {activeTab === "roles" && (
        <div className="bg-white p-6 rounded-2xl border border-gray-200/90 shadow-xs space-y-4 text-xs">
          <div>
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide">
              Role-Based Access Control (RBAC) Matrix
            </h3>
            <p className="text-gray-500 text-xs mt-0.5">
              Strict access controls isolated per tenant organization.
            </p>
          </div>

          <div className="overflow-x-auto border border-gray-200 rounded-xl">
            <table className="w-full text-left text-xs text-gray-600">
              <thead className="bg-slate-100 text-gray-800 font-bold border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3">Permission Area</th>
                  <th className="px-4 py-3 text-center">Org Admin</th>
                  <th className="px-4 py-3 text-center">Manager</th>
                  <th className="px-4 py-3 text-center">Team Lead</th>
                  <th className="px-4 py-3 text-center">Employee</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                <tr>
                  <td className="px-4 py-3 font-semibold text-gray-900">Organization Dashboard & Turnover Analytics</td>
                  <td className="px-4 py-3 text-center font-bold text-emerald-600">Full Access</td>
                  <td className="px-4 py-3 text-center text-gray-600">Dept Only</td>
                  <td className="px-4 py-3 text-center text-gray-600">Team Only</td>
                  <td className="px-4 py-3 text-center text-rose-500">No Access</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-semibold text-gray-900">Employee Directory & Onboarding/Offboarding</td>
                  <td className="px-4 py-3 text-center font-bold text-emerald-600">Manage All</td>
                  <td className="px-4 py-3 text-center text-gray-600">View Dept</td>
                  <td className="px-4 py-3 text-center text-gray-600">View Team</td>
                  <td className="px-4 py-3 text-center text-gray-500">Own Profile</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-semibold text-gray-900">Global Payroll Processing & Salary Adjustments</td>
                  <td className="px-4 py-3 text-center font-bold text-emerald-600">Full Control</td>
                  <td className="px-4 py-3 text-center text-rose-500">Restricted</td>
                  <td className="px-4 py-3 text-center text-rose-500">Restricted</td>
                  <td className="px-4 py-3 text-center text-gray-500">Own Payslips</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-semibold text-gray-900">SaaS Billing, Subscription & Plan Limits</td>
                  <td className="px-4 py-3 text-center font-bold text-emerald-600">Full Control</td>
                  <td className="px-4 py-3 text-center text-rose-500">Restricted</td>
                  <td className="px-4 py-3 text-center text-rose-500">Restricted</td>
                  <td className="px-4 py-3 text-center text-rose-500">Restricted</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-semibold text-gray-900">Company Announcements & Knowledge Base (CMS)</td>
                  <td className="px-4 py-3 text-center font-bold text-emerald-600">Author & Publish</td>
                  <td className="px-4 py-3 text-center text-gray-600">Read & Suggest</td>
                  <td className="px-4 py-3 text-center text-gray-600">Read Only</td>
                  <td className="px-4 py-3 text-center text-gray-600">Read Only</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL: PLAN UPGRADE */}
      {isUpgradeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 w-full max-w-lg p-6 space-y-4 text-xs">
            <div className="flex justify-between items-center border-b border-gray-100 pb-3">
              <h3 className="text-base font-bold text-gray-900">Upgrade Organization Plan</h3>
              <button
                type="button"
                onClick={() => setIsUpgradeModalOpen(false)}
                className="w-7 h-7 rounded bg-gray-100 text-gray-500 flex items-center justify-center"
              >
                <CloseIcon className="w-3.5 h-3.5" size={14} />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Select Tier</label>
                <div className="grid grid-cols-3 gap-2">
                  {(["Starter", "Professional", "Enterprise"] as const).map((tier) => (
                    <button
                      key={tier}
                      type="button"
                      onClick={() => setSelectedPlan(tier)}
                      className={`p-3 rounded-xl border text-center font-bold transition ${
                        selectedPlan === tier
                          ? "border-blue-600 bg-blue-50 text-blue-900"
                          : "border-gray-200 bg-white text-gray-700"
                      }`}
                    >
                      {tier}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Billing Cycle</label>
                <div className="grid grid-cols-2 gap-2">
                  {(["Monthly", "Annual"] as const).map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setSelectedCycle(c)}
                      className={`p-2.5 rounded-xl border text-center font-bold transition ${
                        selectedCycle === c
                          ? "border-blue-600 bg-blue-50 text-blue-900"
                          : "border-gray-200 bg-white text-gray-700"
                      }`}
                    >
                      {c} (20% Off Annual)
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <p className="font-bold text-gray-900">
                  New Employee Limit:{" "}
                  {selectedPlan === "Starter" ? 25 : selectedPlan === "Professional" ? 200 : 1000}{" "}
                  Slots
                </p>
                <p className="text-gray-500 text-[11px]">
                  Immediate upgrade. An invoice receipt will be registered to your company billing log.
                </p>
              </div>
            </div>

            <div className="flex justify-between items-center pt-3 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setIsUpgradeModalOpen(false)}
                className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 font-semibold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmPlanChange}
                className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold"
              >
                Confirm Plan Update
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: SHIFT CREATE / EDIT */}
      {isShiftModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 w-full max-w-lg p-6 space-y-4 text-xs">
            <div className="flex justify-between items-center border-b border-gray-100 pb-3">
              <h3 className="text-base font-bold text-gray-900">
                {editingShift ? "Edit Work Shift" : "Create New Work Shift"}
              </h3>
              <button
                type="button"
                onClick={() => setIsShiftModalOpen(false)}
                className="w-7 h-7 rounded bg-gray-100 text-gray-500 flex items-center justify-center"
              >
                <CloseIcon className="w-3.5 h-3.5" size={14} />
              </button>
            </div>

            <form onSubmit={handleSaveShift} className="space-y-3">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Shift Name</label>
                <input
                  type="text"
                  required
                  value={shiftForm.name}
                  onChange={(e) => setShiftForm({ ...shiftForm, name: e.target.value })}
                  className="w-full rounded-md border border-gray-200 p-2"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Start Time</label>
                  <input
                    type="text"
                    value={shiftForm.startTime}
                    onChange={(e) => setShiftForm({ ...shiftForm, startTime: e.target.value })}
                    className="w-full rounded-md border border-gray-200 p-2 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">End Time</label>
                  <input
                    type="text"
                    value={shiftForm.endTime}
                    onChange={(e) => setShiftForm({ ...shiftForm, endTime: e.target.value })}
                    className="w-full rounded-md border border-gray-200 p-2 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Grace Period (m)</label>
                  <input
                    type="number"
                    value={shiftForm.gracePeriodMinutes}
                    onChange={(e) => setShiftForm({ ...shiftForm, gracePeriodMinutes: Number(e.target.value) })}
                    className="w-full rounded-md border border-gray-200 p-2 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Min Hours</label>
                  <input
                    type="number"
                    value={shiftForm.minWorkingHours}
                    onChange={(e) => setShiftForm({ ...shiftForm, minWorkingHours: Number(e.target.value) })}
                    className="w-full rounded-md border border-gray-200 p-2 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Break (m)</label>
                  <input
                    type="number"
                    value={shiftForm.breakDurationMinutes}
                    onChange={(e) => setShiftForm({ ...shiftForm, breakDurationMinutes: Number(e.target.value) })}
                    className="w-full rounded-md border border-gray-200 p-2 font-mono"
                  />
                </div>
              </div>

              <div className="pt-2">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={shiftForm.isNightShift}
                    onChange={(e) => setShiftForm({ ...shiftForm, isNightShift: e.target.checked })}
                    className="rounded text-blue-600"
                  />
                  <span className="font-semibold text-gray-700">Night Shift Toggle (Spans Midnight)</span>
                </label>
              </div>

              <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsShiftModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold"
                >
                  Save Shift
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: LEAVE POLICY CREATE / EDIT */}
      {isLeaveModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 w-full max-w-lg p-6 space-y-4 text-xs">
            <div className="flex justify-between items-center border-b border-gray-100 pb-3">
              <h3 className="text-base font-bold text-gray-900">
                {editingPolicy ? "Edit Leave Policy" : "Create Custom Leave Policy"}
              </h3>
              <button
                type="button"
                onClick={() => setIsLeaveModalOpen(false)}
                className="w-7 h-7 rounded bg-gray-100 text-gray-500 flex items-center justify-center"
              >
                <CloseIcon className="w-3.5 h-3.5" size={14} />
              </button>
            </div>

            <form onSubmit={handleSaveLeavePolicy} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Leave Policy Name</label>
                  <input
                    type="text"
                    required
                    value={leaveForm.name}
                    onChange={(e) => setLeaveForm({ ...leaveForm, name: e.target.value })}
                    className="w-full rounded-md border border-gray-200 p-2"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Code</label>
                  <input
                    type="text"
                    required
                    value={leaveForm.code}
                    onChange={(e) => setLeaveForm({ ...leaveForm, code: e.target.value.toUpperCase() })}
                    className="w-full rounded-md border border-gray-200 p-2 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Annual Allocation (Days)</label>
                  <input
                    type="number"
                    value={leaveForm.annualAllocation}
                    onChange={(e) => setLeaveForm({ ...leaveForm, annualAllocation: Number(e.target.value) })}
                    className="w-full rounded-md border border-gray-200 p-2 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Carry Forward Days</label>
                  <input
                    type="number"
                    value={leaveForm.maxCarryForward}
                    onChange={(e) =>
                      setLeaveForm({
                        ...leaveForm,
                        maxCarryForward: Number(e.target.value),
                        carryForward: Number(e.target.value) > 0,
                      })
                    }
                    className="w-full rounded-md border border-gray-200 p-2 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Compensation</label>
                  <select
                    value={leaveForm.paid ? "paid" : "unpaid"}
                    onChange={(e) => setLeaveForm({ ...leaveForm, paid: e.target.value === "paid" })}
                    className="w-full rounded-md border border-gray-200 p-2 bg-white"
                  >
                    <option value="paid">Paid Leave</option>
                    <option value="unpaid">Unpaid / Loss of Pay (LOP)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Effective Timeline</label>
                  <select
                    value={leaveForm.effectiveDate}
                    onChange={(e) =>
                      setLeaveForm({
                        ...leaveForm,
                        effectiveDate: e.target.value as "Immediate" | "Next Leave Year",
                      })
                    }
                    className="w-full rounded-md border border-gray-200 p-2 bg-white"
                  >
                    <option value="Immediate">Applies Immediately</option>
                    <option value="Next Leave Year">Next Leave Year</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={leaveForm.halfDayAllowed}
                    onChange={(e) => setLeaveForm({ ...leaveForm, halfDayAllowed: e.target.checked })}
                    className="rounded text-blue-600"
                  />
                  <span className="font-semibold text-gray-700">Half-Day Applications Permitted</span>
                </label>

                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={leaveForm.attachmentRequired}
                    onChange={(e) => setLeaveForm({ ...leaveForm, attachmentRequired: e.target.checked })}
                    className="rounded text-blue-600"
                  />
                  <span className="font-semibold text-gray-700">Medical / Travel Certificate Required</span>
                </label>
              </div>

              <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsLeaveModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold"
                >
                  Save Policy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

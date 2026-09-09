"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, useSyncExternalStore } from "react";
import {
  Organization,
  Employee,
  Department,
  Team,
  LeaveTypePolicy,
  LeaveRequest,
  AttendanceRecord,
  WorkShift,
  AttendanceRules,
  PayrollRun,
  Payslip,
  Announcement,
  KnowledgeBaseCategory,
  KnowledgeBaseArticle,
  AuditLog,
  TenantNotification,
  SubscriptionInvoice,
  OrganizationPlan,
  BillingCycle,
  OffboardingDetails,
  TimesheetCorrectionRequest,
  TeamMemberTimesheet,
  TeamSpacePost,
  TeamSpaceComment,
} from "@/lib/types";
import { TeamLeadProfile } from "@/lib/mock-data";
import { tenantStore } from "@/lib/tenant-store";

interface ToastMessage {
  id: string;
  message: string;
  type: "success" | "error" | "info";
}

interface TenantContextValue {
  currentOrgId: string;
  currentOrg: Organization;
  allOrganizations: Organization[];
  switchOrganization: (orgId: string) => void;
  employees: Employee[];
  departments: Department[];
  teams: Team[];
  payrollRuns: PayrollRun[];
  leavePolicies: LeaveTypePolicy[];
  leaveRequests: LeaveRequest[];
  attendanceRecords: AttendanceRecord[];
  workShifts: WorkShift[];
  attendanceRules: AttendanceRules;
  announcements: Announcement[];
  knowledgeBaseCategories: KnowledgeBaseCategory[];
  knowledgeBaseArticles: KnowledgeBaseArticle[];
  auditLogs: AuditLog[];
  notifications: TenantNotification[];
  invoices: SubscriptionInvoice[];
  timesheetCorrections: TimesheetCorrectionRequest[];
  teamTimesheets: TeamMemberTimesheet[];
  teamSpacePosts: TeamSpacePost[];
  toasts: ToastMessage[];
  showToast: (message: string, type?: "success" | "error" | "info") => void;
  dismissToast: (id: string) => void;

  // Operations
  updateOrganizationProfile: (updates: Partial<Organization>) => void;
  addEmployee: (input: Omit<Employee, "id" | "organizationId" | "createdAt" | "updatedAt" | "leaveBalances">) => Employee;
  updateEmployee: (empId: string, updates: Partial<Employee>) => Employee;
  offboardEmployee: (empId: string, details: OffboardingDetails) => Employee;
  bulkImportEmployees: (rawList: Array<Partial<Employee>>) => ReturnType<typeof tenantStore.bulkImportEmployees>;
  calculateMonthlyPayroll: (month: string, year: number, workingDays?: number) => PayrollRun;
  updatePayrollRunStatus: (runId: string, status: PayrollRun["status"]) => PayrollRun;
  getPayslip: (payrollItemId: string) => Payslip;
  updateSubscriptionPlan: (newPlan: OrganizationPlan, cycle: BillingCycle) => void;
  addLeavePolicy: (policy: Omit<LeaveTypePolicy, "id" | "organizationId">) => LeaveTypePolicy;
  updateLeavePolicy: (id: string, updates: Partial<LeaveTypePolicy>) => LeaveTypePolicy;
  deleteLeavePolicy: (id: string) => void;
  addWorkShift: (shift: Omit<WorkShift, "id" | "organizationId">) => WorkShift;
  updateWorkShift: (id: string, updates: Partial<WorkShift>) => WorkShift;
  updateAttendanceRules: (updates: Partial<AttendanceRules>) => AttendanceRules;
  createAnnouncement: (ann: Omit<Announcement, "id" | "organizationId" | "createdAt">) => Announcement;
  updateAnnouncement: (id: string, updates: Partial<Announcement>) => Announcement;
  deleteAnnouncement: (id: string) => void;
  createArticle: (art: Omit<KnowledgeBaseArticle, "id" | "organizationId" | "publishedDate" | "lastUpdated" | "viewCount">) => KnowledgeBaseArticle;
  updateArticle: (id: string, updates: Partial<KnowledgeBaseArticle>) => KnowledgeBaseArticle;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  clearAllNotifications: () => void;
  refreshState: () => void;

  // Team Lead Operations
  approveTimesheetCorrection: (id: string, reviewerName?: string) => void;
  rejectTimesheetCorrection: (id: string, reviewerName?: string, reason?: string) => void;
  approveLeaveRequest: (id: string, reviewerName?: string) => void;
  rejectLeaveRequest: (id: string, reviewerName?: string, reason?: string) => void;
  verifyTeamTimesheet: (timesheetId: string) => void;
  submitTeamTimesheetsToHR: (weekId: string) => void;
  createTeamSpacePost: (post: Omit<TeamSpacePost, "id" | "organizationId" | "createdAt" | "reactions" | "comments">) => TeamSpacePost;
  togglePostReaction: (postId: string, emoji: string, userName?: string) => void;
  addPostComment: (postId: string, comment: Omit<TeamSpaceComment, "id" | "timestamp">) => TeamSpaceComment;
  regularizePunch: (employeeId: string, date: string, checkIn: string, checkOut: string, status?: AttendanceRecord["status"]) => void;
  teamLeadProfile: TeamLeadProfile;
  updateTeamLeadProfile: (updates: Partial<TeamLeadProfile>) => TeamLeadProfile;
  managerProfile: TeamLeadProfile;
  updateManagerProfile: (updates: Partial<TeamLeadProfile>) => TeamLeadProfile;
}

const TenantContext = createContext<TenantContextValue | null>(null);

let toastCounter = 0;

function useStoreVersion(): number {
  return useSyncExternalStore(
    tenantStore.subscribe,
    tenantStore.getSnapshot,
    tenantStore.getServerSnapshot
  );
}

export function TenantProvider({ children }: { children: React.ReactNode }) {
  useStoreVersion();

  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  useEffect(() => {
    tenantStore.initClient();
  }, []);

  const currentOrgId = tenantStore.getActiveOrgId();

  const refreshState = useCallback(() => {
    tenantStore.notify();
  }, []);

  const showToast = (message: string, type: "success" | "error" | "info" = "success") => {
    const id = `toast-${++toastCounter}`;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const switchOrganization = (orgId: string) => {
    tenantStore.setActiveOrgId(orgId);
    const org = tenantStore.getOrganization(orgId);
    showToast(`Switched active organization to: ${org?.name || orgId}`, "info");
  };

  const allOrganizations = tenantStore.getOrganizations();
  const currentOrg = tenantStore.getOrganization(currentOrgId) || allOrganizations[0];

  const employees = tenantStore.getEmployees(currentOrgId);
  const departments = tenantStore.getState().departments.filter((d) => d.organizationId === currentOrgId);
  const teams = tenantStore.getState().teams.filter((t) => t.organizationId === currentOrgId);
  const payrollRuns = tenantStore.getPayrollRuns(currentOrgId);
  const leavePolicies = tenantStore.getLeavePolicies(currentOrgId);
  const leaveRequests = tenantStore.getState().leaveRequests.filter((l) => l.organizationId === currentOrgId);
  const attendanceRecords = tenantStore.getState().attendanceRecords.filter((a) => a.organizationId === currentOrgId);
  const workShifts = tenantStore.getWorkShifts(currentOrgId);
  const attendanceRules = tenantStore.getAttendanceRules(currentOrgId);
  const announcements = tenantStore.getAnnouncements(currentOrgId);
  const knowledgeBaseCategories = tenantStore.getKnowledgeBaseCategories(currentOrgId);
  const knowledgeBaseArticles = tenantStore.getKnowledgeBaseArticles(currentOrgId);
  const auditLogs = tenantStore.getAuditLogs(currentOrgId);
  const notifications = tenantStore.getNotifications(currentOrgId);
  const invoices = tenantStore.getInvoices(currentOrgId);
  const timesheetCorrections = tenantStore.getTimesheetCorrections(currentOrgId);
  const teamTimesheets = tenantStore.getTeamTimesheets(currentOrgId);
  const teamSpacePosts = tenantStore.getTeamSpacePosts(currentOrgId);

  // Operations
  const updateOrganizationProfile = (updates: Partial<Organization>) => {
    tenantStore.updateOrganizationProfile(currentOrgId, updates);
    refreshState();
    showToast("Company profile and settings updated successfully.");
  };

  const addEmployee = (input: Omit<Employee, "id" | "organizationId" | "createdAt" | "updatedAt" | "leaveBalances">) => {
    try {
      const created = tenantStore.addEmployee(currentOrgId, input);
      refreshState();
      showToast(`Employee ${created.name} (${created.employeeId}) created successfully!`);
      return created;
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : "Failed to add employee";
      showToast(errorMsg, "error");
      throw err;
    }
  };

  const updateEmployee = (empId: string, updates: Partial<Employee>) => {
    const updated = tenantStore.updateEmployee(currentOrgId, empId, updates);
    refreshState();
    showToast(`Updated employee ${updated.name}.`);
    return updated;
  };

  const offboardEmployee = (empId: string, details: OffboardingDetails) => {
    const offboarded = tenantStore.offboardEmployee(currentOrgId, empId, details);
    refreshState();
    showToast(`${offboarded.name} has been offboarded. Account disabled.`, "info");
    return offboarded;
  };

  const bulkImportEmployees = (rawList: Array<Partial<Employee>>) => {
    try {
      const res = tenantStore.bulkImportEmployees(currentOrgId, rawList);
      refreshState();
      if (res.success > 0) {
        showToast(`Successfully imported ${res.success} employee(s).`);
      }
      if (res.duplicate > 0 || res.failed > 0) {
        showToast(`${res.duplicate} duplicate(s), ${res.failed} failed row(s).`, "info");
      }
      return res;
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : "Bulk import failed";
      showToast(errorMsg, "error");
      throw err;
    }
  };

  const calculateMonthlyPayroll = (month: string, year: number, workingDays?: number) => {
    const run = tenantStore.calculateMonthlyPayroll(currentOrgId, month, year, workingDays);
    refreshState();
    showToast(`Payroll calculated for ${month} ${year}. Total Net: $${run.netPayroll.toLocaleString()}`);
    return run;
  };

  const updatePayrollRunStatus = (runId: string, status: PayrollRun["status"]) => {
    const run = tenantStore.updatePayrollRunStatus(currentOrgId, runId, status);
    refreshState();
    showToast(`Payroll status updated to: ${status}`);
    return run;
  };

  const getPayslip = (payrollItemId: string) => {
    return tenantStore.generatePayslip(currentOrgId, payrollItemId);
  };

  const updateSubscriptionPlan = (newPlan: OrganizationPlan, cycle: BillingCycle) => {
    tenantStore.updateSubscriptionPlan(currentOrgId, newPlan, cycle);
    refreshState();
    showToast(`Subscription plan upgraded to ${newPlan} (${cycle})!`, "success");
  };

  const addLeavePolicy = (policy: Omit<LeaveTypePolicy, "id" | "organizationId">) => {
    const p = tenantStore.addLeavePolicy(currentOrgId, policy);
    refreshState();
    showToast(`Leave policy ${p.name} created.`);
    return p;
  };

  const updateLeavePolicy = (id: string, updates: Partial<LeaveTypePolicy>) => {
    const p = tenantStore.updateLeavePolicy(currentOrgId, id, updates);
    refreshState();
    showToast(`Leave policy ${p.name} updated.`);
    return p;
  };

  const deleteLeavePolicy = (id: string) => {
    tenantStore.deleteLeavePolicy(currentOrgId, id);
    refreshState();
    showToast("Leave policy removed.");
  };

  const addWorkShift = (shift: Omit<WorkShift, "id" | "organizationId">) => {
    const s = tenantStore.addWorkShift(currentOrgId, shift);
    refreshState();
    showToast(`Work shift ${s.name} created.`);
    return s;
  };

  const updateWorkShift = (id: string, updates: Partial<WorkShift>) => {
    const s = tenantStore.updateWorkShift(currentOrgId, id, updates);
    refreshState();
    showToast(`Work shift ${s.name} updated.`);
    return s;
  };

  const updateAttendanceRules = (updates: Partial<AttendanceRules>) => {
    const r = tenantStore.updateAttendanceRules(currentOrgId, updates);
    refreshState();
    showToast("Attendance rules updated.");
    return r;
  };

  const createAnnouncement = (ann: Omit<Announcement, "id" | "organizationId" | "createdAt">) => {
    const a = tenantStore.createAnnouncement(currentOrgId, ann);
    refreshState();
    showToast(`Announcement "${a.title}" published!`);
    return a;
  };

  const updateAnnouncement = (id: string, updates: Partial<Announcement>) => {
    const a = tenantStore.updateAnnouncement(currentOrgId, id, updates);
    refreshState();
    showToast(`Announcement "${a.title}" updated.`);
    return a;
  };

  const deleteAnnouncement = (id: string) => {
    tenantStore.deleteAnnouncement(currentOrgId, id);
    refreshState();
    showToast("Announcement deleted.");
  };

  const createArticle = (art: Omit<KnowledgeBaseArticle, "id" | "organizationId" | "publishedDate" | "lastUpdated" | "viewCount">) => {
    const a = tenantStore.createArticle(currentOrgId, art);
    refreshState();
    showToast(`Knowledge Base article "${a.title}" published.`);
    return a;
  };

  const updateArticle = (id: string, updates: Partial<KnowledgeBaseArticle>) => {
    const a = tenantStore.updateArticle(currentOrgId, id, updates);
    refreshState();
    showToast(`Article "${a.title}" updated.`);
    return a;
  };

  const markNotificationAsRead = (id: string) => {
    tenantStore.markNotificationAsRead(currentOrgId, id);
    refreshState();
  };

  const markAllNotificationsAsRead = () => {
    tenantStore.markAllNotificationsAsRead(currentOrgId);
    refreshState();
    showToast("All notifications marked as read.");
  };

  const clearAllNotifications = () => {
    tenantStore.clearAllNotifications(currentOrgId);
    refreshState();
    showToast("All notifications cleared.");
  };

  // Team Lead Operations
  const approveTimesheetCorrection = (id: string, reviewerName: string = "Team Lead") => {
    tenantStore.approveTimesheetCorrection(currentOrgId, id, reviewerName);
    refreshState();
    showToast("Timesheet punch correction approved successfully!");
  };

  const rejectTimesheetCorrection = (id: string, reviewerName: string = "Team Lead", reason?: string) => {
    tenantStore.rejectTimesheetCorrection(currentOrgId, id, reviewerName, reason);
    refreshState();
    showToast("Correction request rejected.", "info");
  };

  const approveLeaveRequest = (id: string, reviewerName: string = "Team Lead") => {
    tenantStore.approveLeaveRequest(currentOrgId, id, reviewerName);
    refreshState();
    showToast("Leave request approved.");
  };

  const rejectLeaveRequest = (id: string, reviewerName: string = "Team Lead", reason?: string) => {
    tenantStore.rejectLeaveRequest(currentOrgId, id, reviewerName, reason);
    refreshState();
    showToast("Leave request rejected.", "info");
  };

  const verifyTeamTimesheet = (timesheetId: string) => {
    tenantStore.verifyTeamTimesheet(currentOrgId, timesheetId);
    refreshState();
    showToast("Timesheet verified for employee.");
  };

  const submitTeamTimesheetsToHR = (weekId: string) => {
    tenantStore.submitTeamTimesheetsToHR(currentOrgId, weekId);
    refreshState();
    showToast("Timesheets submitted to HR for payroll processing!", "success");
  };

  const createTeamSpacePost = (post: Omit<TeamSpacePost, "id" | "organizationId" | "createdAt" | "reactions" | "comments">) => {
    const p = tenantStore.createTeamSpacePost(currentOrgId, post);
    refreshState();
    showToast(`Published team update: "${p.title}"`);
    return p;
  };

  const togglePostReaction = (postId: string, emoji: string, userName?: string) => {
    tenantStore.togglePostReaction(currentOrgId, postId, emoji, userName);
    refreshState();
  };

  const addPostComment = (postId: string, comment: Omit<TeamSpaceComment, "id" | "timestamp">) => {
    const c = tenantStore.addPostComment(currentOrgId, postId, comment);
    refreshState();
    showToast("Comment posted.");
    return c;
  };

  const regularizePunch = (employeeId: string, date: string, checkIn: string, checkOut: string, status: AttendanceRecord["status"] = "Present") => {
    tenantStore.regularizePunch(currentOrgId, employeeId, date, checkIn, checkOut, status);
    refreshState();
    showToast("Attendance regularized successfully.");
  };

  const teamLeadProfile = tenantStore.getTeamLeadProfile(currentOrgId);

  const updateTeamLeadProfile = (updates: Partial<TeamLeadProfile>) => {
    const updated = tenantStore.updateTeamLeadProfile(currentOrgId, updates);
    refreshState();
    return updated;
  };

  const managerProfile = tenantStore.getManagerProfile(currentOrgId);

  const updateManagerProfile = (updates: Partial<TeamLeadProfile>) => {
    const updated = tenantStore.updateManagerProfile(currentOrgId, updates);
    refreshState();
    return updated;
  };

  // Periodic check
  useEffect(() => {
    const handleStorage = () => refreshState();
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, [refreshState]);

  return (
    <TenantContext.Provider
      value={{
        currentOrgId,
        currentOrg,
        allOrganizations,
        switchOrganization,
        employees,
        departments,
        teams,
        payrollRuns,
        leavePolicies,
        leaveRequests,
        attendanceRecords,
        workShifts,
        attendanceRules,
        announcements,
        knowledgeBaseCategories,
        knowledgeBaseArticles,
        auditLogs,
        notifications,
        invoices,
        timesheetCorrections,
        teamTimesheets,
        teamSpacePosts,
        toasts,
        showToast,
        dismissToast,
        updateOrganizationProfile,
        addEmployee,
        updateEmployee,
        offboardEmployee,
        bulkImportEmployees,
        calculateMonthlyPayroll,
        updatePayrollRunStatus,
        getPayslip,
        updateSubscriptionPlan,
        addLeavePolicy,
        updateLeavePolicy,
        deleteLeavePolicy,
        addWorkShift,
        updateWorkShift,
        updateAttendanceRules,
        createAnnouncement,
        updateAnnouncement,
        deleteAnnouncement,
        createArticle,
        updateArticle,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        clearAllNotifications,
        refreshState,
        approveTimesheetCorrection,
        rejectTimesheetCorrection,
        approveLeaveRequest,
        rejectLeaveRequest,
        verifyTeamTimesheet,
        submitTeamTimesheetsToHR,
        createTeamSpacePost,
        togglePostReaction,
        addPostComment,
        regularizePunch,
        teamLeadProfile,
        updateTeamLeadProfile,
        managerProfile,
        updateManagerProfile,
      }}
    >
      {children}

      {/* Floating Toast Notification Container */}
      <div className="fixed bottom-5 right-5 z-[9999] flex flex-col gap-2 pointer-events-none max-w-md w-full px-4">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center justify-between p-3.5 rounded-lg shadow-xl text-xs font-medium border transition-all animate-in slide-in-from-bottom-3 duration-200 ${
              toast.type === "error"
                ? "bg-red-900/95 text-white border-red-700 shadow-red-900/20"
                : toast.type === "info"
                ? "bg-slate-900/95 text-white border-slate-700 shadow-slate-900/20"
                : "bg-emerald-900/95 text-white border-emerald-700 shadow-emerald-900/20"
            }`}
          >
            <div className="flex items-center space-x-2.5">
              <span className="w-2 h-2 rounded-full shrink-0 bg-current animate-pulse" />
              <span>{toast.message}</span>
            </div>
            <button
              onClick={() => dismissToast(toast.id)}
              className="ml-3 text-white/70 hover:text-white text-base leading-none px-1"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </TenantContext.Provider>
  );
}

export function useTenant() {
  const context = useContext(TenantContext);
  if (!context) {
    throw new Error("useTenant must be used within a TenantProvider");
  }
  return context;
}

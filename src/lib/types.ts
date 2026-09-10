export type OrganizationPlan = "Starter" | "Professional" | "Enterprise";
export type SubscriptionStatus = "Trial" | "Active" | "Past Due" | "Suspended" | "Cancelled";
export type BillingCycle = "Monthly" | "Annual";

export interface Organization {
  id: string;
  name: string;
  logo: string;
  industry: string;
  size: string;
  address: string;
  country: string;
  timezone: string;
  currency: string;
  financialYear: string;
  workingWeek: string;
  plan: OrganizationPlan;
  employeeLimit: number;
  subscriptionStatus: SubscriptionStatus;
  billingCycle: BillingCycle;
  monthlyCost: number;
  renewalDate: string;
  startDate: string;
}

export type EmployeeStatus = "Active" | "Probation" | "Notice Period" | "Inactive" | "Offboarded";
export type EmploymentType = "Full Time" | "Part Time" | "Contract" | "Intern" | "Consultant";
export type UserRole = "admin-hr" | "manager" | "team-lead" | "employee";

export interface OffboardingDetails {
  lastWorkingDate: string;
  reason: string;
  noticePeriod: string;
  exitInterviewRequired: boolean;
  finalSettlementRequired: boolean;
  disableAccountDate: string;
  assetReturnStatus: "Pending" | "In Progress" | "Completed";
  remarks: string;
  offboardedAt: string;
}

export interface EmployeeCompensation {
  basicSalary: number;
  hra: number;
  allowances: number;
  specialAllowance: number;
  bonus: number;
  incentives: number;
  overtime: number;
  tax: number;
  pf: number;
  insurance: number;
  otherDeductions: number;
  currency: string;
  paymentMethod: "Bank Transfer" | "Direct Deposit" | "Cheque";
  bankName: string;
  accountNumber: string;
  routingCode: string;
}

export interface LeaveBalance {
  leaveTypeId: string;
  leaveTypeName: string;
  allocated: number;
  used: number;
  pending: number;
  remaining: number;
}

export interface Employee {
  id: string;
  organizationId: string;
  employeeId: string;
  firstName: string;
  lastName: string;
  name: string;
  email: string;
  personalEmail: string;
  phone: string;
  avatar?: string;
  dateOfBirth: string;
  gender: "Male" | "Female" | "Non-Binary" | "Prefer not to say";
  address: string;
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
  };
  department: string;
  designation: string;
  team: string;
  assignedTLId?: string;
  assignedTLName?: string;
  assignedManagerId?: string;
  assignedManagerName?: string;
  employmentType: EmploymentType;
  workLocation: string;
  joiningDate: string;
  probationEndDate?: string;
  status: EmployeeStatus;
  role: UserRole;
  compensation: EmployeeCompensation;
  leaveBalances: LeaveBalance[];
  offboardingDetails?: OffboardingDetails;
  createdAt: string;
  updatedAt: string;
}

export interface Department {
  id: string;
  organizationId: string;
  name: string;
  headEmployeeId?: string;
  headEmployeeName?: string;
  memberCount: number;
}

export interface Team {
  id: string;
  organizationId: string;
  departmentId: string;
  departmentName: string;
  name: string;
  leadEmployeeId?: string;
  leadEmployeeName?: string;
  memberCount: number;
}

export type AccrualType = "Annual Upfront" | "Monthly Accrual" | "Quarterly Accrual";

export interface LeaveTypePolicy {
  id: string;
  organizationId: string;
  name: string;
  code: string;
  annualAllocation: number;
  paid: boolean;
  carryForward: boolean;
  maxCarryForward: number;
  accrualType: AccrualType;
  maxConsecutiveDays: number;
  minNoticePeriod: number;
  attachmentRequired: boolean;
  halfDayAllowed: boolean;
  negativeBalanceAllowed: boolean;
  genderRestriction?: "All" | "Female" | "Male";
  employmentTypeEligibility: EmploymentType[];
  status: "Active" | "Inactive";
  effectiveDate: "Immediate" | "Next Leave Year";
}

export interface LeaveRequest {
  id: string;
  organizationId: string;
  employeeId: string;
  employeeName: string;
  employeeAvatar?: string;
  leaveTypeId: string;
  leaveTypeName: string;
  startDate: string;
  endDate: string;
  days: number;
  reason: string;
  status: "Pending" | "Approved" | "Rejected";
  appliedAt: string;
  reviewedBy?: string;
  reviewedAt?: string;
  rejectionReason?: string;
  managerName?: string;
  isHalfDay?: boolean;
  halfDaySession?: "First Half" | "Second Half";
  contactDuringLeave?: string;
}

export interface AttendanceRecord {
  id: string;
  organizationId: string;
  employeeId: string;
  employeeName: string;
  date: string;
  checkIn?: string;
  checkOut?: string;
  status: "Present" | "Late" | "Half Day" | "Absent" | "On Leave";
  workHours: number;
  overtimeHours: number;
}

export interface WorkShift {
  id: string;
  organizationId: string;
  name: string;
  startTime: string;
  endTime: string;
  gracePeriodMinutes: number;
  minWorkingHours: number;
  halfDayWorkingHours: number;
  breakDurationMinutes: number;
  weeklyOffDays: string[];
  isNightShift: boolean;
  assignedTo: {
    type: "Company" | "Department" | "Team" | "Employee";
    targetId?: string;
    targetName?: string;
  };
}

export interface AttendanceRules {
  id: string;
  organizationId: string;
  checkInRequired: boolean;
  checkOutRequired: boolean;
  gracePeriodMinutes: number;
  lateMarkRule: string;
  halfDayRule: string;
  minWorkingHours: number;
  overtimeEnabled: boolean;
  weekendWorkingAllowed: boolean;
  wfhAllowed: boolean;
  regularizationAllowed: boolean;
  geoLocationRequired: boolean;
  ipRestrictionEnabled: boolean;
  allowedIps: string[];
}

export type PayrollStatus = "Draft" | "Processing" | "Approved" | "Paid" | "Locked";

export interface PayrollItem {
  id: string;
  payrollRunId: string;
  organizationId: string;
  employeeId: string;
  employeeName: string;
  employeeCode: string;
  department: string;
  designation: string;
  basicSalary: number;
  hra: number;
  allowances: number;
  specialAllowance: number;
  grossEarnings: number;
  workingDays: number;
  paidDays: number;
  unpaidLeaveDays: number;
  lopDeduction: number;
  bonus: number;
  incentives: number;
  overtimePay: number;
  pfDeduction: number;
  insuranceDeduction: number;
  otherDeductions: number;
  taxDeduction: number;
  totalDeductions: number;
  netSalary: number;
  paymentStatus: "Pending" | "Paid";
  paymentMethod: string;
  bankName: string;
  accountNumber: string;
}

export interface PayrollRun {
  id: string;
  organizationId: string;
  month: string;
  year: number;
  status: PayrollStatus;
  totalEmployees: number;
  workingDays: number;
  grossPayroll: number;
  totalBonuses: number;
  totalDeductions: number;
  taxDeductions: number;
  netPayroll: number;
  items: PayrollItem[];
  processedAt?: string;
  approvedAt?: string;
  paidAt?: string;
  lockedAt?: string;
}

export interface Payslip {
  id: string;
  organizationId: string;
  payrollRunId: string;
  payrollItemId: string;
  employeeId: string;
  employeeName: string;
  employeeCode: string;
  department: string;
  designation: string;
  month: string;
  year: number;
  generatedDate: string;
  workingDays: number;
  paidDays: number;
  leaveWithoutPay: number;
  basicSalary: number;
  hra: number;
  allowances: number;
  specialAllowance: number;
  bonus: number;
  incentives: number;
  grossSalary: number;
  pfDeduction: number;
  taxDeduction: number;
  insuranceDeduction: number;
  lopDeduction: number;
  otherDeductions: number;
  totalDeductions: number;
  netSalary: number;
  netSalaryWords: string;
  bankName: string;
  accountNumber: string;
  companyName: string;
  companyLogo: string;
  companyAddress: string;
}

export type AnnouncementAudience = "Entire Company" | "Department" | "Team" | "Selected Employees";
export type AnnouncementPriority = "Normal" | "Important" | "Urgent";
export type AnnouncementStatus = "Draft" | "Scheduled" | "Published" | "Archived";

export interface Announcement {
  id: string;
  organizationId: string;
  title: string;
  summary: string;
  content: string;
  featuredImage?: string;
  category: "Company All-Hands" | "Policy Update" | "Holiday & Celebration" | "General News" | "Health & Safety";
  publishDate: string;
  expiryDate?: string;
  audience: AnnouncementAudience;
  audienceTargetName?: string;
  priority: AnnouncementPriority;
  status: AnnouncementStatus;
  authorName: string;
  authorRole: string;
  createdAt: string;
}

export interface KnowledgeBaseCategory {
  id: string;
  organizationId: string;
  name: string;
  description: string;
  iconName: string;
  articleCount: number;
}

export interface KnowledgeBaseArticle {
  id: string;
  organizationId: string;
  categoryId: string;
  categoryName: string;
  title: string;
  content: string;
  tags: string[];
  attachmentName?: string;
  attachmentSize?: string;
  version: string;
  publishedDate: string;
  lastUpdated: string;
  status: "Draft" | "Published" | "Archived";
  authorName: string;
  viewCount: number;
}

export interface AuditLog {
  id: string;
  organizationId: string;
  userId: string;
  userName: string;
  action: string;
  module: "Employee" | "Payroll" | "Leave Policy" | "Attendance" | "Company Settings" | "CMS" | "Subscription";
  recordId: string;
  previousValue?: string;
  newValue: string;
  ipAddress: string;
  timestamp: string;
}

export interface TenantNotification {
  id: string;
  organizationId: string;
  targetUserId?: string;
  title: string;
  message: string;
  category: "employee" | "payroll" | "policy" | "announcement" | "subscription" | "leave";
  read: boolean;
  timestamp: string;
  link?: string;
}

export interface SubscriptionInvoice {
  id: string;
  organizationId: string;
  invoiceNumber: string;
  date: string;
  amount: number;
  planName: string;
  status: "Paid" | "Pending";
  pdfDownloadName: string;
}

export interface TimesheetCorrectionRequest {
  id: string;
  organizationId: string;
  employeeId: string;
  employeeName: string;
  employeeAvatar?: string;
  date: string;
  type: "Missing Punch-Out" | "Missing Punch-In" | "Late Regularization" | "WFH Adjustment";
  originalTime?: string;
  requestedTime: string;
  reason: string;
  status: "Pending" | "Approved" | "Rejected";
  appliedAt: string;
  reviewedBy?: string;
  reviewedAt?: string;
  rejectionReason?: string;
}

export interface DayHourDetail {
  date: string;
  dayOfWeek: string; // Mon, Tue, Wed, Thu, Fri, Sat, Sun
  hours: number;
  checkIn?: string;
  checkOut?: string;
  status: "Regular" | "Overtime" | "Weekend" | "Leave" | "Missing";
}

export interface TeamMemberTimesheet {
  id: string;
  organizationId: string;
  weekId: string; // e.g. "2026-W36"
  weekRange: string; // e.g. "Sep 01 - Sep 07, 2026"
  employeeId: string;
  employeeName: string;
  employeeAvatar?: string;
  designation: string;
  dailyHours: DayHourDetail[];
  regularHours: number;
  overtimeHours: number;
  totalHours: number;
  status: "Draft" | "Verified" | "SubmittedToHR";
  hasDiscrepancy: boolean;
  discrepancyNote?: string;
  verifiedAt?: string;
  submittedToHRAt?: string;
}

export interface TeamSpaceReaction {
  emoji: string;
  count: number;
  users: string[];
}

export interface TeamSpaceComment {
  id: string;
  authorName: string;
  authorRole: string;
  authorAvatar?: string;
  content: string;
  timestamp: string;
}

export interface TeamSpacePost {
  id: string;
  organizationId: string;
  teamId?: string;
  category: "Goal" | "Schedule" | "Recognition" | "Announcement";
  title: string;
  content: string;
  authorName: string;
  authorRole: string;
  authorAvatar?: string;
  createdAt: string;
  priority: "Normal" | "Important" | "Urgent";
  pinned?: boolean;
  targetEmployeeName?: string;
  badge?: string;
  goalProgress?: number;
  goalTargetDate?: string;
  scheduleDetails?: {
    shiftName: string;
    timing: string;
    rosterSummary: string;
    effectiveDates: string;
  };
  reactions: TeamSpaceReaction[];
  comments: TeamSpaceComment[];
}


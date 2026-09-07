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
  PayrollItem,
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
} from "./types";
import {
  initialOrganizations,
  initialDepartments,
  initialTeams,
  initialEmployees,
  initialLeavePolicies,
  initialLeaveRequests,
  initialAttendanceRecords,
  initialWorkShifts,
  initialAttendanceRules,
  initialPayrollRuns,
  initialAnnouncements,
  initialKnowledgeBaseCategories,
  initialKnowledgeBaseArticles,
  initialAuditLogs,
  initialNotifications,
  initialSubscriptionInvoices,
} from "./mock-data";

export interface TenantDataState {
  organizations: Organization[];
  departments: Department[];
  teams: Team[];
  employees: Employee[];
  leavePolicies: LeaveTypePolicy[];
  leaveRequests: LeaveRequest[];
  attendanceRecords: AttendanceRecord[];
  workShifts: WorkShift[];
  attendanceRules: Record<string, AttendanceRules>;
  payrollRuns: PayrollRun[];
  announcements: Announcement[];
  knowledgeBaseCategories: KnowledgeBaseCategory[];
  knowledgeBaseArticles: KnowledgeBaseArticle[];
  auditLogs: AuditLog[];
  notifications: TenantNotification[];
  invoices: SubscriptionInvoice[];
}

const STORAGE_KEY = "crewsync_enterprise_hrms_v1";

function numberToWords(num: number): string {
  if (num === 0) return "Zero Dollars";
  const units = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"];
  const tens = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];

  function convertSection(n: number): string {
    if (n === 0) return "";
    if (n < 20) return units[n] + " ";
    if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 !== 0 ? " " + units[n % 10] : "") + " ";
    return units[Math.floor(n / 100)] + " Hundred " + convertSection(n % 100);
  }

  const thousands = Math.floor(num / 1000);
  const remainder = Math.floor(num % 1000);
  let result = "";
  if (thousands > 0) {
    result += convertSection(thousands) + "Thousand ";
  }
  if (remainder > 0) {
    result += convertSection(remainder);
  }
  return result.trim() + " Dollars Only";
}

type Listener = () => void;

export class TenantDataStore {
  private state: TenantDataState;
  private listeners: Set<Listener> = new Set();
  private version: number = 0;
  private activeOrgId: string = "org-roacs";

  constructor() {
    this.state = this.getInitialState();
  }

  public subscribe = (listener: Listener): (() => void) => {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  };

  public getSnapshot = (): number => {
    return this.version;
  };

  public getServerSnapshot = (): number => {
    return 0;
  };

  public notify = (): void => {
    this.version++;
    this.listeners.forEach((l) => l());
  };

  public getActiveOrgId(): string {
    return this.activeOrgId;
  }

  public setActiveOrgId(orgId: string): void {
    this.activeOrgId = orgId;
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("crewsync_active_org", orgId);
      } catch {
        // ignore
      }
    }
    this.notify();
  }

  private getInitialState(): TenantDataState {
    return {
      organizations: initialOrganizations,
      departments: initialDepartments,
      teams: initialTeams,
      employees: initialEmployees,
      leavePolicies: initialLeavePolicies,
      leaveRequests: initialLeaveRequests,
      attendanceRecords: initialAttendanceRecords,
      workShifts: initialWorkShifts,
      attendanceRules: { "org-roacs": initialAttendanceRules },
      payrollRuns: initialPayrollRuns,
      announcements: initialAnnouncements,
      knowledgeBaseCategories: initialKnowledgeBaseCategories,
      knowledgeBaseArticles: initialKnowledgeBaseArticles,
      auditLogs: initialAuditLogs,
      notifications: initialNotifications,
      invoices: initialSubscriptionInvoices,
    };
  }

  public initClient(): void {
    if (typeof window === "undefined") return;
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        this.state = {
          organizations: parsed.organizations || initialOrganizations,
          departments: parsed.departments || initialDepartments,
          teams: parsed.teams || initialTeams,
          employees: parsed.employees || initialEmployees,
          leavePolicies: parsed.leavePolicies || initialLeavePolicies,
          leaveRequests: parsed.leaveRequests || initialLeaveRequests,
          attendanceRecords: parsed.attendanceRecords || initialAttendanceRecords,
          workShifts: parsed.workShifts || initialWorkShifts,
          attendanceRules: parsed.attendanceRules || { "org-roacs": initialAttendanceRules },
          payrollRuns: parsed.payrollRuns || initialPayrollRuns,
          announcements: parsed.announcements || initialAnnouncements,
          knowledgeBaseCategories: parsed.knowledgeBaseCategories || initialKnowledgeBaseCategories,
          knowledgeBaseArticles: parsed.knowledgeBaseArticles || initialKnowledgeBaseArticles,
          auditLogs: parsed.auditLogs || initialAuditLogs,
          notifications: parsed.notifications || initialNotifications,
          invoices: parsed.invoices || initialSubscriptionInvoices,
        };
      }
      const savedOrg = localStorage.getItem("crewsync_active_org");
      if (savedOrg && this.getOrganization(savedOrg)) {
        this.activeOrgId = savedOrg;
      }
      this.notify();
    } catch (err) {
      console.warn("Failed to load HRMS local storage, defaulting to seed data", err);
    }
  }

  private persist() {
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
      } catch (err) {
        console.warn("Failed to persist state", err);
      }
    }
    this.notify();
  }

  public getState(): TenantDataState {
    return this.state;
  }

  // 1. TENANT / ORG OPS
  public getOrganization(orgId: string): Organization | undefined {
    return this.state.organizations.find((o) => o.id === orgId);
  }

  public getOrganizations(): Organization[] {
    return this.state.organizations;
  }

  public updateOrganizationProfile(orgId: string, updates: Partial<Organization>, user = "Amira Patel"): Organization {
    const org = this.getOrganization(orgId);
    if (!org) throw new Error("Organization not found");
    const previous = `${org.name} (${org.address})`;
    Object.assign(org, updates);
    this.addAuditLog(orgId, user, "Company Settings", "UPDATED_COMPANY_PROFILE", orgId, previous, `${org.name} (${org.address})`);
    this.persist();
    return org;
  }

  // 2. EMPLOYEE OPS
  public getEmployees(orgId: string): Employee[] {
    return this.state.employees.filter((e) => e.organizationId === orgId);
  }

  public getEmployee(orgId: string, empId: string): Employee | undefined {
    return this.state.employees.find((e) => e.organizationId === orgId && (e.id === empId || e.employeeId === empId));
  }

  public addEmployee(orgId: string, input: Omit<Employee, "id" | "organizationId" | "createdAt" | "updatedAt" | "leaveBalances">, user = "Amira Patel"): Employee {
    const org = this.getOrganization(orgId);
    if (!org) throw new Error("Organization not found");

    const currentCount = this.state.employees.filter((e) => e.organizationId === orgId && e.status !== "Offboarded").length;
    if (currentCount >= org.employeeLimit) {
      throw new Error("Your current subscription employee limit has been reached. Upgrade your plan to add more employees.");
    }

    // Auto-initialize leave balances from active company policies
    const policies = this.state.leavePolicies.filter((lp) => lp.organizationId === orgId && lp.status === "Active");
    const leaveBalances = policies.map((p) => ({
      leaveTypeId: p.id,
      leaveTypeName: p.name,
      allocated: p.annualAllocation,
      used: 0,
      pending: 0,
      remaining: p.annualAllocation,
    }));

    const newId = `emp-${Date.now()}`;
    const newEmployee: Employee = {
      ...input,
      id: newId,
      organizationId: orgId,
      leaveBalances,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.state.employees.unshift(newEmployee);

    this.addAuditLog(orgId, user, "Employee", "CREATED_EMPLOYEE", newId, undefined, `Created ${newEmployee.name} (${newEmployee.designation})`);

    this.addNotification(orgId, {
      title: "New Employee Onboarded",
      message: `${newEmployee.name} has been added to ${newEmployee.department}. Welcome credentials dispatched.`,
      category: "employee",
      link: "/hr-dashboard/employees",
    });

    this.persist();
    return newEmployee;
  }

  public updateEmployee(orgId: string, empId: string, updates: Partial<Employee>, user = "Amira Patel"): Employee {
    const emp = this.getEmployee(orgId, empId);
    if (!emp) throw new Error("Employee not found");
    const prev = `${emp.name} - ${emp.designation} (${emp.status})`;
    Object.assign(emp, updates, { updatedAt: new Date().toISOString() });
    this.addAuditLog(orgId, user, "Employee", "UPDATED_EMPLOYEE", emp.id, prev, `${emp.name} - ${emp.designation} (${emp.status})`);
    this.persist();
    return emp;
  }

  public offboardEmployee(orgId: string, empId: string, details: OffboardingDetails, user = "Amira Patel"): Employee {
    const emp = this.getEmployee(orgId, empId);
    if (!emp) throw new Error("Employee not found");

    emp.status = "Offboarded";
    emp.offboardingDetails = details;
    emp.updatedAt = new Date().toISOString();

    this.addAuditLog(
      orgId,
      user,
      "Employee",
      "OFFBOARDED_EMPLOYEE",
      emp.id,
      `Active -> Offboarded`,
      `Reason: ${details.reason}, Assets: ${details.assetReturnStatus}`
    );

    this.addNotification(orgId, {
      title: "Employee Offboarded",
      message: `${emp.name} has completed separation on ${details.lastWorkingDate}. Account access disabled.`,
      category: "employee",
      link: "/hr-dashboard/employees",
    });

    this.persist();
    return emp;
  }

  public bulkImportEmployees(
    orgId: string,
    rawList: Array<Partial<Employee>>,
    user = "Amira Patel"
  ): {
    success: number;
    duplicate: number;
    failed: number;
    errors: Array<{ row: number; reason: string }>;
    imported: Employee[];
  } {
    const org = this.getOrganization(orgId);
    if (!org) throw new Error("Organization not found");

    const existingEmails = new Set(this.state.employees.filter((e) => e.organizationId === orgId).map((e) => e.email.toLowerCase()));
    const existingEmpIds = new Set(this.state.employees.filter((e) => e.organizationId === orgId).map((e) => e.employeeId.toUpperCase()));

    let currentActive = this.state.employees.filter((e) => e.organizationId === orgId && e.status !== "Offboarded").length;

    let success = 0;
    let duplicate = 0;
    let failed = 0;
    const errors: Array<{ row: number; reason: string }> = [];
    const imported: Employee[] = [];

    const policies = this.state.leavePolicies.filter((lp) => lp.organizationId === orgId && lp.status === "Active");

    rawList.forEach((row, idx) => {
      const rowNum = idx + 1;

      if (currentActive >= org.employeeLimit) {
        failed++;
        errors.push({ row: rowNum, reason: "Organization subscription employee limit reached" });
        return;
      }

      if (!row.firstName || !row.lastName || !row.email) {
        failed++;
        errors.push({ row: rowNum, reason: "Missing required fields (First Name, Last Name, or Email)" });
        return;
      }

      const email = row.email.toLowerCase().trim();
      const empId = row.employeeId ? row.employeeId.toUpperCase().trim() : `RC-${Math.floor(1000 + Math.random() * 9000)}`;

      if (existingEmails.has(email) || existingEmpIds.has(empId)) {
        duplicate++;
        errors.push({ row: rowNum, reason: `Duplicate Email (${email}) or Employee ID (${empId}) detected` });
        return;
      }

      existingEmails.add(email);
      existingEmpIds.add(empId);

      const leaveBalances = policies.map((p) => ({
        leaveTypeId: p.id,
        leaveTypeName: p.name,
        allocated: p.annualAllocation,
        used: 0,
        pending: 0,
        remaining: p.annualAllocation,
      }));

      const newEmp: Employee = {
        id: `emp-bulk-${Date.now()}-${idx}`,
        organizationId: orgId,
        employeeId: empId,
        firstName: row.firstName,
        lastName: row.lastName,
        name: `${row.firstName} ${row.lastName}`,
        email: email,
        personalEmail: row.personalEmail || email,
        phone: row.phone || "+1 (555) 000-0000",
        avatar: `${row.firstName[0]}${row.lastName[0]}`,
        dateOfBirth: row.dateOfBirth || "1995-01-01",
        gender: row.gender || "Prefer not to say",
        address: row.address || "100 Main St",
        emergencyContact: row.emergencyContact || { name: "Emergency Contact", relationship: "Family", phone: "+1 (555) 000-0000" },
        department: row.department || "Engineering",
        designation: row.designation || "Staff Member",
        team: row.team || "Core Team",
        assignedTLId: row.assignedTLId,
        assignedTLName: row.assignedTLName,
        assignedManagerId: row.assignedManagerId,
        assignedManagerName: row.assignedManagerName,
        employmentType: row.employmentType || "Full Time",
        workLocation: row.workLocation || "HQ",
        joiningDate: row.joiningDate || new Date().toISOString().split("T")[0],
        status: "Active",
        role: "employee",
        compensation: row.compensation || {
          basicSalary: 5000,
          hra: 1500,
          allowances: 500,
          specialAllowance: 300,
          bonus: 0,
          incentives: 0,
          overtime: 0,
          tax: 900,
          pf: 400,
          insurance: 150,
          otherDeductions: 50,
          currency: "USD",
          paymentMethod: "Bank Transfer",
          bankName: "Standard Bank",
          accountNumber: "•••• 0000",
          routingCode: "121000358",
        },
        leaveBalances,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      this.state.employees.unshift(newEmp);
      imported.push(newEmp);
      currentActive++;
      success++;
    });

    this.addAuditLog(
      orgId,
      user,
      "Employee",
      "BULK_IMPORTED_EMPLOYEES",
      `Count: ${success}`,
      undefined,
      `Imported: ${success}, Duplicates: ${duplicate}, Failed: ${failed}`
    );

    this.persist();
    return { success, duplicate, failed, errors, imported };
  }

  // 3. PAYROLL & COMPENSATION ENGINE
  public getPayrollRuns(orgId: string): PayrollRun[] {
    return this.state.payrollRuns.filter((r) => r.organizationId === orgId);
  }

  public calculateMonthlyPayroll(
    orgId: string,
    month: string,
    year: number,
    workingDays = 21,
    user = "Amira Patel"
  ): PayrollRun {
    const activeEmployees = this.state.employees.filter(
      (e) => e.organizationId === orgId && (e.status === "Active" || e.status === "Probation" || e.status === "Notice Period")
    );

    const runId = `pr-${year}-${month.toLowerCase()}`;
    const items: PayrollItem[] = activeEmployees.map((emp) => {
      const comp = emp.compensation;
      const grossEarnings = comp.basicSalary + comp.hra + comp.allowances + comp.specialAllowance;
      
      // Calculate unpaid leaves (LOP)
      const unpaidLeaveBalance = emp.leaveBalances.find((b) => b.leaveTypeId === "lt-unpaid" || b.leaveTypeName.toLowerCase().includes("unpaid"));
      const unpaidLeaveDays = unpaidLeaveBalance ? unpaidLeaveBalance.used : 0;
      
      const lopDeduction = unpaidLeaveDays > 0 ? Math.round((comp.basicSalary / workingDays) * unpaidLeaveDays) : 0;
      const paidDays = Math.max(0, workingDays - unpaidLeaveDays);

      const totalDeductions = comp.pf + comp.insurance + comp.otherDeductions + comp.tax + lopDeduction;
      const netSalary = grossEarnings + comp.bonus + comp.incentives + comp.overtime - totalDeductions;

      return {
        id: `pi-${runId}-${emp.id}`,
        payrollRunId: runId,
        organizationId: orgId,
        employeeId: emp.id,
        employeeName: emp.name,
        employeeCode: emp.employeeId,
        department: emp.department,
        designation: emp.designation,
        basicSalary: comp.basicSalary,
        hra: comp.hra,
        allowances: comp.allowances,
        specialAllowance: comp.specialAllowance,
        grossEarnings,
        workingDays,
        paidDays,
        unpaidLeaveDays,
        lopDeduction,
        bonus: comp.bonus,
        incentives: comp.incentives,
        overtimePay: comp.overtime,
        pfDeduction: comp.pf,
        insuranceDeduction: comp.insurance,
        otherDeductions: comp.otherDeductions,
        taxDeduction: comp.tax,
        totalDeductions,
        netSalary,
        paymentStatus: "Pending",
        paymentMethod: comp.paymentMethod,
        bankName: comp.bankName,
        accountNumber: comp.accountNumber,
      };
    });

    const grossPayroll = items.reduce((acc, i) => acc + i.grossEarnings, 0);
    const totalBonuses = items.reduce((acc, i) => acc + i.bonus + i.incentives + i.overtimePay, 0);
    const totalDeductions = items.reduce((acc, i) => acc + i.totalDeductions, 0);
    const taxDeductions = items.reduce((acc, i) => acc + i.taxDeduction, 0);
    const netPayroll = items.reduce((acc, i) => acc + i.netSalary, 0);

    const existingRunIndex = this.state.payrollRuns.findIndex((r) => r.organizationId === orgId && r.id === runId);

    const newRun: PayrollRun = {
      id: runId,
      organizationId: orgId,
      month,
      year,
      status: "Processing",
      totalEmployees: activeEmployees.length,
      workingDays,
      grossPayroll,
      totalBonuses,
      totalDeductions,
      taxDeductions,
      netPayroll,
      items,
      processedAt: new Date().toISOString(),
    };

    if (existingRunIndex >= 0) {
      this.state.payrollRuns[existingRunIndex] = newRun;
    } else {
      this.state.payrollRuns.unshift(newRun);
    }

    this.addAuditLog(
      orgId,
      user,
      "Payroll",
      "CALCULATED_MONTHLY_PAYROLL",
      runId,
      undefined,
      `Computed payroll for ${month} ${year}: ${activeEmployees.length} employees ($${netPayroll.toLocaleString()} Net)`
    );

    this.persist();
    return newRun;
  }

  public updatePayrollRunStatus(
    orgId: string,
    runId: string,
    status: PayrollRun["status"],
    user = "Amira Patel"
  ): PayrollRun {
    const run = this.state.payrollRuns.find((r) => r.organizationId === orgId && r.id === runId);
    if (!run) throw new Error("Payroll run not found");

    const prev = run.status;
    run.status = status;

    if (status === "Approved") {
      run.approvedAt = new Date().toISOString();
    } else if (status === "Paid") {
      run.paidAt = new Date().toISOString();
      run.items.forEach((item) => {
        item.paymentStatus = "Paid";
      });
      this.addNotification(orgId, {
        title: "Payroll Disbursed",
        message: `${run.month} ${run.year} payroll has been disbursed to ${run.totalEmployees} employees. Payslips generated.`,
        category: "payroll",
        link: "/hr-dashboard/payroll",
      });
    } else if (status === "Locked") {
      run.lockedAt = new Date().toISOString();
    }

    this.addAuditLog(orgId, user, "Payroll", "UPDATED_PAYROLL_STATUS", runId, `Status: ${prev}`, `Status: ${status}`);
    this.persist();
    return run;
  }

  public generatePayslip(orgId: string, payrollItemId: string): Payslip {
    const org = this.getOrganization(orgId);
    if (!org) throw new Error("Organization not found");

    let foundItem: PayrollItem | undefined;
    let foundRun: PayrollRun | undefined;

    for (const run of this.state.payrollRuns.filter((r) => r.organizationId === orgId)) {
      const itm = run.items.find((i) => i.id === payrollItemId);
      if (itm) {
        foundItem = itm;
        foundRun = run;
        break;
      }
    }

    if (!foundItem || !foundRun) throw new Error("Payroll item not found");

    return {
      id: `ps-${foundItem.id}`,
      organizationId: orgId,
      payrollRunId: foundRun.id,
      payrollItemId: foundItem.id,
      employeeId: foundItem.employeeId,
      employeeName: foundItem.employeeName,
      employeeCode: foundItem.employeeCode,
      department: foundItem.department,
      designation: foundItem.designation,
      month: foundRun.month,
      year: foundRun.year,
      generatedDate: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      workingDays: foundItem.workingDays,
      paidDays: foundItem.paidDays,
      leaveWithoutPay: foundItem.unpaidLeaveDays,
      basicSalary: foundItem.basicSalary,
      hra: foundItem.hra,
      allowances: foundItem.allowances,
      specialAllowance: foundItem.specialAllowance,
      bonus: foundItem.bonus,
      incentives: foundItem.incentives,
      grossSalary: foundItem.grossEarnings + foundItem.bonus + foundItem.incentives + foundItem.overtimePay,
      pfDeduction: foundItem.pfDeduction,
      taxDeduction: foundItem.taxDeduction,
      insuranceDeduction: foundItem.insuranceDeduction,
      lopDeduction: foundItem.lopDeduction,
      otherDeductions: foundItem.otherDeductions,
      totalDeductions: foundItem.totalDeductions,
      netSalary: foundItem.netSalary,
      netSalaryWords: numberToWords(foundItem.netSalary),
      bankName: foundItem.bankName,
      accountNumber: foundItem.accountNumber,
      companyName: org.name,
      companyLogo: org.logo,
      companyAddress: org.address,
    };
  }

  // 4. SETTINGS & POLICIES
  public getLeavePolicies(orgId: string): LeaveTypePolicy[] {
    return this.state.leavePolicies.filter((lp) => lp.organizationId === orgId);
  }

  public addLeavePolicy(orgId: string, policy: Omit<LeaveTypePolicy, "id" | "organizationId">, user = "Amira Patel"): LeaveTypePolicy {
    const newPolicy: LeaveTypePolicy = {
      ...policy,
      id: `lt-${Date.now()}`,
      organizationId: orgId,
    };
    this.state.leavePolicies.push(newPolicy);
    this.addAuditLog(orgId, user, "Leave Policy", "CREATED_LEAVE_POLICY", newPolicy.id, undefined, `${newPolicy.name} (${newPolicy.annualAllocation} Days)`);
    this.persist();
    return newPolicy;
  }

  public updateLeavePolicy(orgId: string, policyId: string, updates: Partial<LeaveTypePolicy>, user = "Amira Patel"): LeaveTypePolicy {
    const policy = this.state.leavePolicies.find((lp) => lp.organizationId === orgId && lp.id === policyId);
    if (!policy) throw new Error("Leave policy not found");
    const prev = `${policy.name} (${policy.annualAllocation} Days, ${policy.status})`;
    Object.assign(policy, updates);
    this.addAuditLog(orgId, user, "Leave Policy", "UPDATED_LEAVE_POLICY", policyId, prev, `${policy.name} (${policy.annualAllocation} Days, ${policy.status})`);
    this.persist();
    return policy;
  }

  public deleteLeavePolicy(orgId: string, policyId: string, user = "Amira Patel") {
    const idx = this.state.leavePolicies.findIndex((lp) => lp.organizationId === orgId && lp.id === policyId);
    if (idx >= 0) {
      const policy = this.state.leavePolicies[idx];
      this.state.leavePolicies.splice(idx, 1);
      this.addAuditLog(orgId, user, "Leave Policy", "DELETED_LEAVE_POLICY", policyId, policy.name, "Deleted");
      this.persist();
    }
  }

  public getWorkShifts(orgId: string): WorkShift[] {
    return this.state.workShifts.filter((ws) => ws.organizationId === orgId);
  }

  public addWorkShift(orgId: string, shift: Omit<WorkShift, "id" | "organizationId">, user = "Amira Patel"): WorkShift {
    const newShift: WorkShift = {
      ...shift,
      id: `shift-${Date.now()}`,
      organizationId: orgId,
    };
    this.state.workShifts.push(newShift);
    this.addAuditLog(orgId, user, "Company Settings", "CREATED_WORK_SHIFT", newShift.id, undefined, `${newShift.name} (${newShift.startTime} - ${newShift.endTime})`);
    this.persist();
    return newShift;
  }

  public updateWorkShift(orgId: string, shiftId: string, updates: Partial<WorkShift>, user = "Amira Patel"): WorkShift {
    const shift = this.state.workShifts.find((ws) => ws.organizationId === orgId && ws.id === shiftId);
    if (!shift) throw new Error("Shift not found");
    const prev = `${shift.name} (${shift.startTime} - ${shift.endTime})`;
    Object.assign(shift, updates);
    this.addAuditLog(orgId, user, "Company Settings", "UPDATED_WORK_SHIFT", shiftId, prev, `${shift.name} (${shift.startTime} - ${shift.endTime})`);
    this.persist();
    return shift;
  }

  public getAttendanceRules(orgId: string): AttendanceRules {
    if (!this.state.attendanceRules[orgId]) {
      this.state.attendanceRules[orgId] = {
        ...initialAttendanceRules,
        id: `ar-${orgId}`,
        organizationId: orgId,
      };
      this.persist();
    }
    return this.state.attendanceRules[orgId];
  }

  public updateAttendanceRules(orgId: string, updates: Partial<AttendanceRules>, user = "Amira Patel"): AttendanceRules {
    const current = this.getAttendanceRules(orgId);
    Object.assign(current, updates);
    this.addAuditLog(orgId, user, "Attendance", "UPDATED_ATTENDANCE_RULES", current.id, undefined, "Updated rule definitions");
    this.persist();
    return current;
  }

  public updateSubscriptionPlan(
    orgId: string,
    newPlan: OrganizationPlan,
    billingCycle: BillingCycle,
    user = "Amira Patel"
  ): Organization {
    const org = this.getOrganization(orgId);
    if (!org) throw new Error("Organization not found");

    const prev = `${org.plan} (${org.employeeLimit} limit)`;
    org.plan = newPlan;
    org.billingCycle = billingCycle;

    if (newPlan === "Starter") {
      org.employeeLimit = 25;
      org.monthlyCost = billingCycle === "Annual" ? 79 : 99;
    } else if (newPlan === "Professional") {
      org.employeeLimit = 200;
      org.monthlyCost = billingCycle === "Annual" ? 399 : 499;
    } else {
      org.employeeLimit = 1000;
      org.monthlyCost = billingCycle === "Annual" ? 899 : 999;
    }

    const newInvoice: SubscriptionInvoice = {
      id: `inv-${Date.now()}`,
      organizationId: orgId,
      invoiceNumber: `INV-${org.logo}-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
      date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      amount: org.monthlyCost * (billingCycle === "Annual" ? 12 : 1),
      planName: `${newPlan} Plan (${billingCycle})`,
      status: "Paid",
      pdfDownloadName: `Invoice_${newPlan}_${new Date().getMonth() + 1}.pdf`,
    };
    this.state.invoices.unshift(newInvoice);

    this.addAuditLog(orgId, user, "Subscription", "UPDATED_SUBSCRIPTION_PLAN", orgId, prev, `${newPlan} (${org.employeeLimit} limit)`);
    this.addNotification(orgId, {
      title: "Plan Upgraded",
      message: `Your organization has successfully upgraded to the ${newPlan} plan (${org.employeeLimit} employee slots).`,
      category: "subscription",
      link: "/hr-dashboard/settings",
    });

    this.persist();
    return org;
  }

  public getInvoices(orgId: string): SubscriptionInvoice[] {
    return this.state.invoices.filter((i) => i.organizationId === orgId);
  }

  // 5. CMS & KNOWLEDGE BASE
  public getAnnouncements(orgId: string): Announcement[] {
    return this.state.announcements.filter((a) => a.organizationId === orgId);
  }

  public createAnnouncement(orgId: string, announcement: Omit<Announcement, "id" | "organizationId" | "createdAt">, user = "Amira Patel"): Announcement {
    const newAnn: Announcement = {
      ...announcement,
      id: `ann-${Date.now()}`,
      organizationId: orgId,
      createdAt: new Date().toISOString(),
    };
    this.state.announcements.unshift(newAnn);

    this.addAuditLog(orgId, user, "CMS", "CREATED_ANNOUNCEMENT", newAnn.id, undefined, newAnn.title);

    if (newAnn.status === "Published") {
      this.addNotification(orgId, {
        title: "Company Bulletin Published",
        message: `${newAnn.title} (${newAnn.priority} Priority, Audience: ${newAnn.audience})`,
        category: "announcement",
        link: "/hr-dashboard/cms",
      });
    }

    this.persist();
    return newAnn;
  }

  public updateAnnouncement(orgId: string, annId: string, updates: Partial<Announcement>, user = "Amira Patel"): Announcement {
    const ann = this.state.announcements.find((a) => a.organizationId === orgId && a.id === annId);
    if (!ann) throw new Error("Announcement not found");
    const prev = `${ann.title} (${ann.status})`;
    Object.assign(ann, updates);
    this.addAuditLog(orgId, user, "CMS", "UPDATED_ANNOUNCEMENT", annId, prev, `${ann.title} (${ann.status})`);
    this.persist();
    return ann;
  }

  public deleteAnnouncement(orgId: string, annId: string, user = "Amira Patel") {
    const idx = this.state.announcements.findIndex((a) => a.organizationId === orgId && a.id === annId);
    if (idx >= 0) {
      const ann = this.state.announcements[idx];
      this.state.announcements.splice(idx, 1);
      this.addAuditLog(orgId, user, "CMS", "DELETED_ANNOUNCEMENT", annId, ann.title, "Deleted");
      this.persist();
    }
  }

  public getKnowledgeBaseCategories(orgId: string): KnowledgeBaseCategory[] {
    return this.state.knowledgeBaseCategories.filter((k) => k.organizationId === orgId);
  }

  public getKnowledgeBaseArticles(orgId: string): KnowledgeBaseArticle[] {
    return this.state.knowledgeBaseArticles.filter((a) => a.organizationId === orgId);
  }

  public createArticle(orgId: string, article: Omit<KnowledgeBaseArticle, "id" | "organizationId" | "publishedDate" | "lastUpdated" | "viewCount">, user = "Amira Patel"): KnowledgeBaseArticle {
    const newArt: KnowledgeBaseArticle = {
      ...article,
      id: `art-${Date.now()}`,
      organizationId: orgId,
      publishedDate: new Date().toISOString().split("T")[0],
      lastUpdated: new Date().toISOString().split("T")[0],
      viewCount: 1,
    };
    this.state.knowledgeBaseArticles.unshift(newArt);
    this.addAuditLog(orgId, user, "CMS", "CREATED_KB_ARTICLE", newArt.id, undefined, `${newArt.title} (${newArt.categoryName})`);
    this.persist();
    return newArt;
  }

  public updateArticle(orgId: string, artId: string, updates: Partial<KnowledgeBaseArticle>, user = "Amira Patel"): KnowledgeBaseArticle {
    const art = this.state.knowledgeBaseArticles.find((a) => a.organizationId === orgId && a.id === artId);
    if (!art) throw new Error("Article not found");
    const prev = `${art.title} (${art.version})`;
    Object.assign(art, updates, { lastUpdated: new Date().toISOString().split("T")[0] });
    this.addAuditLog(orgId, user, "CMS", "UPDATED_KB_ARTICLE", artId, prev, `${art.title} (${art.version})`);
    this.persist();
    return art;
  }

  // 6. AUDIT LOGS & NOTIFICATIONS
  public getAuditLogs(orgId: string): AuditLog[] {
    return this.state.auditLogs.filter((l) => l.organizationId === orgId);
  }

  public addAuditLog(
    orgId: string,
    userName: string,
    module: AuditLog["module"],
    action: string,
    recordId: string,
    previousValue?: string,
    newValue = ""
  ): AuditLog {
    const log: AuditLog = {
      id: `log-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      organizationId: orgId,
      userId: "user-current",
      userName,
      action,
      module,
      recordId,
      previousValue,
      newValue,
      ipAddress: "192.168.1.42",
      timestamp: new Date().toISOString(),
    };
    this.state.auditLogs.unshift(log);
    this.persist();
    return log;
  }

  public getNotifications(orgId: string): TenantNotification[] {
    return this.state.notifications.filter((n) => n.organizationId === orgId);
  }

  public addNotification(orgId: string, notif: Omit<TenantNotification, "id" | "organizationId" | "read" | "timestamp">): TenantNotification {
    const newNotif: TenantNotification = {
      ...notif,
      id: `notif-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      organizationId: orgId,
      read: false,
      timestamp: "Just now",
    };
    this.state.notifications.unshift(newNotif);
    this.persist();
    return newNotif;
  }

  public markNotificationAsRead(orgId: string, notifId: string) {
    const notif = this.state.notifications.find((n) => n.organizationId === orgId && n.id === notifId);
    if (notif) {
      notif.read = true;
      this.persist();
    }
  }

  public clearAllNotifications(orgId: string) {
    this.state.notifications = this.state.notifications.filter((n) => n.organizationId !== orgId);
    this.persist();
  }

  public resetToDefaults() {
    if (typeof window !== "undefined") {
      localStorage.removeItem(STORAGE_KEY);
    }
    this.state = this.loadState();
  }
}

export const tenantStore = new TenantDataStore();

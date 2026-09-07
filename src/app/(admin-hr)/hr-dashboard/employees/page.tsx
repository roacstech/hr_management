"use client";

import { useState, useMemo } from "react";
import { useTenant } from "@/context/TenantContext";
import {
  Employee,
  EmployeeStatus,
  EmploymentType,
  UserRole,
  OffboardingDetails,
} from "@/lib/types";
import {
  SearchIcon,
  PlusIcon,
  CloseIcon,
  FolderIcon,
} from "@/components/SidebarIcons";
import EmptyState from "@/components/EmptyState";
import Link from "next/link";

export default function EmployeesDirectoryPage() {
  const {
    currentOrg,
    employees,
    departments,
    teams,
    addEmployee,
    updateEmployee,
    offboardEmployee,
    bulkImportEmployees,
    showToast,
  } = useTenant();

  // Filters State
  const [search, setSearch] = useState("");
  const [deptFilter, setDeptFilter] = useState("all");
  const [teamFilter, setTeamFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [locationFilter, setLocationFilter] = useState("all");
  const [managerFilter, setManagerFilter] = useState("all");

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  const [isOffboardModalOpen, setIsOffboardModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [isDetailDrawerOpen, setIsDetailDrawerOpen] = useState(false);

  // Add Employee Form State (3 Sections)
  const [addStep, setAddStep] = useState<1 | 2 | 3>(1);
  const [formData, setFormData] = useState({
    // Section 1: Personal
    firstName: "",
    lastName: "",
    personalEmail: "",
    workEmail: "",
    phone: "",
    dateOfBirth: "1994-05-12",
    gender: "Prefer not to say" as Employee["gender"],
    address: "",
    emergencyName: "",
    emergencyRel: "Family",
    emergencyPhone: "",

    // Section 2: Employment
    employeeId: "",
    department: "",
    designation: "",
    team: "",
    assignedTLId: "",
    assignedManagerId: "",
    employmentType: "Full Time" as EmploymentType,
    workLocation: "San Francisco HQ (Hybrid)",
    joiningDate: new Date().toISOString().split("T")[0],
    probationEndDate: "",

    // Section 3: Account & Compensation
    role: "employee" as UserRole,
    initialStatus: "Active" as EmployeeStatus,
    basicSalary: 6000,
    hra: 1800,
    allowances: 600,
    specialAllowance: 400,
    tax: 1200,
    pf: 450,
    insurance: 150,
  });

  // Offboarding Form State
  const [offboardingForm, setOffboardingForm] = useState<OffboardingDetails>({
    lastWorkingDate: new Date().toISOString().split("T")[0],
    reason: "Resignation - Career Advancement",
    noticePeriod: "30 Days",
    exitInterviewRequired: true,
    finalSettlementRequired: true,
    disableAccountDate: new Date().toISOString().split("T")[0],
    assetReturnStatus: "In Progress",
    remarks: "Handover in progress with assigned team lead.",
    offboardedAt: new Date().toISOString(),
  });

  // Bulk Import Wizard State
  const [bulkStep, setBulkStep] = useState<1 | 2 | 3>(1);
  const [bulkCsvText, setBulkCsvText] = useState("");
  const [importSummary, setImportSummary] = useState<{
    success: number;
    duplicate: number;
    failed: number;
    errors: Array<{ row: number; reason: string }>;
  } | null>(null);

  // Detail Drawer Active Tab
  const [detailTab, setDetailTab] = useState<
    "overview" | "job" | "compensation" | "leaves" | "history"
  >("overview");

  // Unique filters data
  const locations = useMemo(() => {
    return Array.from(new Set(employees.map((e) => e.workLocation).filter(Boolean)));
  }, [employees]);

  const managers = useMemo(() => {
    return employees.filter((e) => e.role === "manager" || e.role === "admin-hr");
  }, [employees]);

  const teamLeads = useMemo(() => {
    return employees.filter((e) => e.role === "team-lead" || e.role === "manager");
  }, [employees]);

  // Subscription Limit Calculation
  const activeEmployeeCount = employees.filter((e) => e.status !== "Offboarded").length;
  const isLimitReached = activeEmployeeCount >= currentOrg.employeeLimit;

  // Filtered employees list
  const filteredEmployees = useMemo(() => {
    return employees.filter((emp) => {
      const q = search.toLowerCase().trim();
      const matchesSearch =
        !q ||
        emp.name.toLowerCase().includes(q) ||
        emp.email.toLowerCase().includes(q) ||
        emp.employeeId.toLowerCase().includes(q) ||
        emp.designation.toLowerCase().includes(q);

      const matchesDept = deptFilter === "all" || emp.department === deptFilter;
      const matchesTeam = teamFilter === "all" || emp.team === teamFilter;
      const matchesStatus = statusFilter === "all" || emp.status === statusFilter;
      const matchesType = typeFilter === "all" || emp.employmentType === typeFilter;
      const matchesLoc = locationFilter === "all" || emp.workLocation === locationFilter;
      const matchesMgr =
        managerFilter === "all" ||
        emp.assignedManagerId === managerFilter ||
        emp.assignedManagerName === managerFilter;

      return (
        matchesSearch &&
        matchesDept &&
        matchesTeam &&
        matchesStatus &&
        matchesType &&
        matchesLoc &&
        matchesMgr
      );
    });
  }, [
    employees,
    search,
    deptFilter,
    teamFilter,
    statusFilter,
    typeFilter,
    locationFilter,
    managerFilter,
  ]);

  const handleToggleEmployeeStatus = (emp: Employee) => {
    const newStatus: EmployeeStatus = emp.status === "Active" ? "Inactive" : "Active";
    const updated = updateEmployee(emp.id, { status: newStatus });
    setSelectedEmployee(updated);
  };

  // Handle Add Employee Submit
  const handleCreateEmployee = (e: React.FormEvent) => {
    e.preventDefault();

    if (isLimitReached) {
      showToast(
        "Your current subscription employee limit has been reached. Upgrade your plan to add more employees.",
        "error"
      );
      return;
    }

    try {
      const assignedMgr = employees.find((e) => e.id === formData.assignedManagerId);
      const assignedTL = employees.find((e) => e.id === formData.assignedTLId);

      addEmployee({
        employeeId:
          formData.employeeId ||
          `${currentOrg.logo}-${Math.floor(100 + Math.random() * 900)}`,
        firstName: formData.firstName,
        lastName: formData.lastName,
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.workEmail,
        personalEmail: formData.personalEmail || formData.workEmail,
        phone: formData.phone || "+1 (555) 000-0000",
        avatar: `${formData.firstName[0] || "E"}${formData.lastName[0] || "M"}`,
        dateOfBirth: formData.dateOfBirth,
        gender: formData.gender,
        address: formData.address || "Main Office Address",
        emergencyContact: {
          name: formData.emergencyName || "Emergency Contact",
          relationship: formData.emergencyRel,
          phone: formData.emergencyPhone || "+1 (555) 000-0000",
        },
        department: formData.department || departments[0]?.name || "Engineering",
        designation: formData.designation || "Software Specialist",
        team: formData.team || teams[0]?.name || "General Team",
        assignedTLId: formData.assignedTLId,
        assignedTLName: assignedTL?.name,
        assignedManagerId: formData.assignedManagerId,
        assignedManagerName: assignedMgr?.name,
        employmentType: formData.employmentType,
        workLocation: formData.workLocation,
        joiningDate: formData.joiningDate,
        probationEndDate: formData.probationEndDate,
        status: formData.initialStatus,
        role: formData.role,
        compensation: {
          basicSalary: Number(formData.basicSalary),
          hra: Number(formData.hra),
          allowances: Number(formData.allowances),
          specialAllowance: Number(formData.specialAllowance),
          bonus: 0,
          incentives: 0,
          overtime: 0,
          tax: Number(formData.tax),
          pf: Number(formData.pf),
          insurance: Number(formData.insurance),
          otherDeductions: 50,
          currency: "USD",
          paymentMethod: "Bank Transfer",
          bankName: "Standard National Bank",
          accountNumber: "•••• 7789",
          routingCode: "121000358",
        },
      });

      setIsAddModalOpen(false);
      setAddStep(1);
    } catch {
      // Error handled by store/toast
    }
  };

  // Handle Offboarding Confirm
  const handleConfirmOffboarding = () => {
    if (!selectedEmployee) return;
    offboardEmployee(selectedEmployee.id, offboardingForm);
    setIsOffboardModalOpen(false);
    setSelectedEmployee(null);
  };

  // Handle Bulk Import Submit
  const handleProcessBulkImport = () => {
    const lines = bulkCsvText
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean);

    if (lines.length < 2) {
      showToast("Please provide a CSV with header and at least one row.", "error");
      return;
    }

    const headers = lines[0].split(",").map((h) => h.trim().toLowerCase());
    const parsedRows: Array<Partial<Employee>> = [];

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(",").map((v) => v.trim());
      const rowObj: Record<string, string> = {};
      headers.forEach((h, idx) => {
        rowObj[h] = values[idx] || "";
      });

      parsedRows.push({
        employeeId: rowObj["employee id"] || rowObj["id"] || rowObj["employeeid"],
        firstName: rowObj["first name"] || rowObj["firstname"] || "Staff",
        lastName: rowObj["last name"] || rowObj["lastname"] || "Member",
        email: rowObj["email"] || rowObj["work email"],
        personalEmail: rowObj["personal email"] || rowObj["email"],
        phone: rowObj["phone"] || "+1 (555) 000-0000",
        department: rowObj["department"] || departments[0]?.name || "Engineering",
        designation: rowObj["designation"] || rowObj["role"] || "Associate",
        team: rowObj["team"] || "General",
        employmentType:
          (rowObj["employment type"] as EmploymentType) || "Full Time",
        workLocation: rowObj["location"] || "HQ",
        joiningDate: rowObj["joining date"] || new Date().toISOString().split("T")[0],
      });
    }

    const res = bulkImportEmployees(parsedRows);
    setImportSummary(res);
    setBulkStep(3);
  };

  // Download CSV Template
  const handleDownloadTemplate = () => {
    const csvContent =
      "Employee ID,First Name,Last Name,Email,Phone,Department,Designation,Team,Employment Type,Location,Joining Date\n" +
      `${currentOrg.logo}-501,Alexander,Wright,alexander.w@company.com,+1 (555) 301-4455,Engineering,Frontend Engineer,Frontend Platform,Full Time,HQ,2026-09-01\n` +
      `${currentOrg.logo}-502,Beatrice,Vance,beatrice.v@company.com,+1 (555) 301-4456,Product & Design,Product Strategist,UX & Product Systems,Full Time,HQ,2026-09-01\n`;

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `Employee_Import_Template_${currentOrg.logo}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("Downloaded sample employee CSV template.");
  };

  return (
    <div className="space-y-6 pb-16 font-sans">
      {/* 1. HEADER WITH ACTIONS & LIMIT GAUGE */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-200/90 shadow-xs">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
              Employee Directory
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-700">
              {filteredEmployees.length} Total
            </span>
          </div>
          <p className="text-gray-500 text-xs mt-1">
            Manage employee master records, organizational hierarchies, assignments, and soft offboarding.
          </p>
        </div>

        <div className="flex items-center space-x-2.5 shrink-0">
          <button
            type="button"
            onClick={() => {
              setBulkStep(1);
              setBulkCsvText("");
              setImportSummary(null);
              setIsBulkModalOpen(true);
            }}
            className="inline-flex items-center px-3.5 py-2 text-xs font-semibold text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 rounded-lg transition shadow-xs cursor-pointer"
          >
            <FolderIcon className="w-4 h-4 mr-1.5 text-gray-500" size={16} />
            Bulk Import CSV
          </button>

          <button
            type="button"
            onClick={() => {
              if (isLimitReached) {
                showToast(
                  "Your current subscription employee limit has been reached. Upgrade your plan to add more employees.",
                  "error"
                );
              }
              setAddStep(1);
              setIsAddModalOpen(true);
            }}
            className="inline-flex items-center px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition shadow-sm cursor-pointer"
          >
            <PlusIcon className="w-3.5 h-3.5 mr-1.5 text-white" size={14} />
            Add Employee
          </button>
        </div>
      </div>

      {/* SUBSCRIPTION LIMIT WARNING BANNER (SHOWN IF LIMIT REACHED) */}
      {isLimitReached && (
        <div className="p-4 rounded-xl border border-amber-300 bg-amber-50 text-amber-900 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 animate-in fade-in duration-200">
          <div className="flex items-center space-x-3">
            <span className="w-8 h-8 rounded-full bg-amber-200 text-amber-800 font-bold flex items-center justify-center shrink-0">
              !
            </span>
            <div>
              <p className="font-bold text-xs leading-tight">
                Your current subscription employee limit has been reached. Upgrade your plan to add more employees.
              </p>
              <p className="text-[11px] text-amber-700 mt-0.5">
                Current usage: {activeEmployeeCount} active employees out of {currentOrg.employeeLimit} allowed slots on the {currentOrg.plan} plan.
              </p>
            </div>
          </div>
          <Link
            href="/hr-dashboard/settings?tab=subscription"
            className="px-3.5 py-1.5 rounded-md bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs transition shrink-0 text-center"
          >
            Upgrade Plan Now
          </Link>
        </div>
      )}

      {/* 2. COMPREHENSIVE FILTER BAR */}
      <div className="bg-white p-4 rounded-xl border border-gray-200/90 shadow-xs space-y-3 text-xs">
        <div className="flex flex-col md:flex-row gap-3">
          {/* Search Box */}
          <div className="relative flex-1">
            <SearchIcon className="w-4 h-4 text-gray-400 absolute left-3 top-2.5 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, email, employee ID, designation..."
              className="w-full bg-white text-xs text-gray-800 placeholder-gray-400 pl-9 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition shadow-2xs"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            )}
          </div>

          {/* Quick Clear Button */}
          {(deptFilter !== "all" ||
            statusFilter !== "all" ||
            typeFilter !== "all" ||
            teamFilter !== "all" ||
            locationFilter !== "all" ||
            managerFilter !== "all" ||
            search) && (
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setDeptFilter("all");
                setTeamFilter("all");
                setStatusFilter("all");
                setTypeFilter("all");
                setLocationFilter("all");
                setManagerFilter("all");
              }}
              className="px-3 py-2 text-xs font-semibold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100/70 rounded-lg transition"
            >
              Reset Filters
            </button>
          )}
        </div>

        {/* 6 Dropdown Filters */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 pt-1">
          {/* Department */}
          <div>
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
              Department
            </label>
            <select
              value={deptFilter}
              onChange={(e) => setDeptFilter(e.target.value)}
              className="w-full bg-white border border-gray-200 rounded-md p-1.5 text-xs text-gray-700 outline-none focus:border-blue-500"
            >
              <option value="all">All Departments</option>
              {departments.map((d) => (
                <option key={d.id} value={d.name}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>

          {/* Team */}
          <div>
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
              Team
            </label>
            <select
              value={teamFilter}
              onChange={(e) => setTeamFilter(e.target.value)}
              className="w-full bg-white border border-gray-200 rounded-md p-1.5 text-xs text-gray-700 outline-none focus:border-blue-500"
            >
              <option value="all">All Teams</option>
              {teams.map((t) => (
                <option key={t.id} value={t.name}>
                  {t.name}
                </option>
              ))}
            </select>
          </div>

          {/* Status */}
          <div>
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
              Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full bg-white border border-gray-200 rounded-md p-1.5 text-xs text-gray-700 outline-none focus:border-blue-500"
            >
              <option value="all">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Probation">Probation</option>
              <option value="Notice Period">Notice Period</option>
              <option value="Inactive">Inactive</option>
              <option value="Offboarded">Offboarded</option>
            </select>
          </div>

          {/* Employment Type */}
          <div>
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
              Employment Type
            </label>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full bg-white border border-gray-200 rounded-md p-1.5 text-xs text-gray-700 outline-none focus:border-blue-500"
            >
              <option value="all">All Types</option>
              <option value="Full Time">Full Time</option>
              <option value="Part Time">Part Time</option>
              <option value="Contract">Contract</option>
              <option value="Intern">Intern</option>
              <option value="Consultant">Consultant</option>
            </select>
          </div>

          {/* Location */}
          <div>
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
              Work Location
            </label>
            <select
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
              className="w-full bg-white border border-gray-200 rounded-md p-1.5 text-xs text-gray-700 outline-none focus:border-blue-500"
            >
              <option value="all">All Locations</option>
              {locations.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
          </div>

          {/* Manager */}
          <div>
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
              Assigned Manager
            </label>
            <select
              value={managerFilter}
              onChange={(e) => setManagerFilter(e.target.value)}
              className="w-full bg-white border border-gray-200 rounded-md p-1.5 text-xs text-gray-700 outline-none focus:border-blue-500"
            >
              <option value="all">All Managers</option>
              {managers.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* 3. PROFESSIONAL EMPLOYEE DIRECTORY TABLE */}
      <div className="bg-white rounded-2xl border border-gray-200/90 overflow-hidden shadow-xs">
        {filteredEmployees.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-gray-600">
              <thead className="bg-slate-50/80 text-[11px] font-bold uppercase tracking-wider text-gray-500 border-b border-gray-200">
                <tr>
                  <th className="px-5 py-3.5">Employee ID</th>
                  <th className="px-5 py-3.5">Employee Details</th>
                  <th className="px-5 py-3.5">Department & Team</th>
                  <th className="px-5 py-3.5">Designation</th>
                  <th className="px-5 py-3.5">Reporting TL / Mgr</th>
                  <th className="px-5 py-3.5">Type & Joined</th>
                  <th className="px-5 py-3.5">Status</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredEmployees.map((emp) => (
                  <tr
                    key={emp.id}
                    className="hover:bg-blue-50/25 transition group cursor-pointer"
                    onClick={() => {
                      setSelectedEmployee(emp);
                      setIsDetailDrawerOpen(true);
                    }}
                  >
                    {/* Employee ID */}
                    <td className="px-5 py-4 font-mono font-bold text-gray-800 whitespace-nowrap">
                      {emp.employeeId}
                    </td>

                    {/* Name & Avatar */}
                    <td className="px-5 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold flex items-center justify-center text-xs shrink-0 shadow-xs">
                          {emp.avatar || emp.firstName[0]}
                        </div>
                        <div>
                          <p className="font-bold text-gray-900 group-hover:text-blue-600 transition leading-tight">
                            {emp.name}
                          </p>
                          <p className="text-[11px] text-gray-400 font-normal leading-tight mt-0.5">
                            {emp.email}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Department & Team */}
                    <td className="px-5 py-4 whitespace-nowrap">
                      <p className="font-semibold text-gray-800">{emp.department}</p>
                      <p className="text-[11px] text-gray-400">{emp.team || "Core Team"}</p>
                    </td>

                    {/* Designation */}
                    <td className="px-5 py-4 font-medium text-gray-700 whitespace-nowrap">
                      {emp.designation}
                    </td>

                    {/* TL & Manager */}
                    <td className="px-5 py-4 whitespace-nowrap">
                      <p className="text-gray-800 font-medium">
                        TL: {emp.assignedTLName || "Self / Lead"}
                      </p>
                      <p className="text-[11px] text-gray-400">
                        Mgr: {emp.assignedManagerName || "Head of Dept"}
                      </p>
                    </td>

                    {/* Employment Type & Joining Date */}
                    <td className="px-5 py-4 whitespace-nowrap">
                      <span className="font-medium text-gray-800">{emp.employmentType}</span>
                      <p className="text-[11px] text-gray-400 font-mono">
                        {emp.joiningDate}
                      </p>
                    </td>

                    {/* Status Badge */}
                    <td className="px-5 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10.5px] font-bold ${
                          emp.status === "Active"
                            ? "bg-emerald-100 text-emerald-800"
                            : emp.status === "Probation"
                            ? "bg-blue-100 text-blue-800"
                            : emp.status === "Notice Period"
                            ? "bg-amber-100 text-amber-800"
                            : emp.status === "Offboarded"
                            ? "bg-slate-200 text-slate-700"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {emp.status}
                      </span>
                    </td>

                    {/* Row Action Buttons */}
                    <td
                      className="px-5 py-4 text-right whitespace-nowrap space-x-2"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedEmployee(emp);
                          setIsDetailDrawerOpen(true);
                        }}
                        className="text-blue-600 hover:text-blue-800 font-semibold text-xs"
                      >
                        View
                      </button>

                      {emp.status !== "Offboarded" && (
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedEmployee(emp);
                            setIsOffboardModalOpen(true);
                          }}
                          className="text-rose-600 hover:text-rose-800 font-semibold text-xs"
                        >
                          Offboard
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState
            title="No employee records found"
            description={`No employees matching your selected filter criteria were located in ${currentOrg.name}.`}
            actionLabel="Reset Search & Filters"
            onAction={() => {
              setSearch("");
              setDeptFilter("all");
              setStatusFilter("all");
              setTypeFilter("all");
            }}
            className="border-none shadow-none py-16"
          />
        )}
      </div>

      {/* 4. MULTI-SECTION ADD EMPLOYEE MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-slate-50/60">
              <div>
                <h3 className="text-base font-bold text-gray-900">
                  Add New Employee — {currentOrg.name}
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Slot verification: {activeEmployeeCount} of {currentOrg.employeeLimit} slots allocated.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="w-7 h-7 rounded-md bg-gray-100 hover:bg-gray-200 text-gray-500 flex items-center justify-center cursor-pointer"
              >
                <CloseIcon className="w-3.5 h-3.5" size={14} />
              </button>
            </div>

            {/* Steps Tab Indicators */}
            <div className="px-6 py-3 bg-gray-50/80 border-b border-gray-200/80 flex items-center justify-between text-xs font-semibold">
              <button
                type="button"
                onClick={() => setAddStep(1)}
                className={`flex items-center space-x-2 ${
                  addStep === 1 ? "text-blue-600" : "text-gray-500"
                }`}
              >
                <span className="w-5 h-5 rounded-full bg-current text-white flex items-center justify-center text-[10px] font-bold">
                  1
                </span>
                <span>Personal Details</span>
              </button>
              <div className="h-0.5 w-12 bg-gray-200" />
              <button
                type="button"
                onClick={() => setAddStep(2)}
                className={`flex items-center space-x-2 ${
                  addStep === 2 ? "text-blue-600" : "text-gray-500"
                }`}
              >
                <span className="w-5 h-5 rounded-full bg-current text-white flex items-center justify-center text-[10px] font-bold">
                  2
                </span>
                <span>Employment & Hierarchy</span>
              </button>
              <div className="h-0.5 w-12 bg-gray-200" />
              <button
                type="button"
                onClick={() => setAddStep(3)}
                className={`flex items-center space-x-2 ${
                  addStep === 3 ? "text-blue-600" : "text-gray-500"
                }`}
              >
                <span className="w-5 h-5 rounded-full bg-current text-white flex items-center justify-center text-[10px] font-bold">
                  3
                </span>
                <span>Account & Compensation</span>
              </button>
            </div>

            {/* Modal Body: Form Steps */}
            <form onSubmit={handleCreateEmployee} className="flex-1 overflow-y-auto p-6 space-y-4 text-xs">
              {/* STEP 1: PERSONAL INFORMATION */}
              {addStep === 1 && (
                <div className="space-y-4">
                  <h4 className="font-bold text-gray-900 text-xs uppercase tracking-wider pb-1 border-b border-gray-100">
                    1. Personal Information
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-semibold text-gray-700 mb-1">
                        First Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.firstName}
                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                        placeholder="e.g. Eleanor"
                        className="w-full rounded-md border border-gray-200 p-2.5 text-xs text-gray-900 outline-none focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-gray-700 mb-1">
                        Last Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.lastName}
                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                        placeholder="e.g. Vance"
                        className="w-full rounded-md border border-gray-200 p-2.5 text-xs text-gray-900 outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block font-semibold text-gray-700 mb-1">
                        Date of Birth
                      </label>
                      <input
                        type="date"
                        value={formData.dateOfBirth}
                        onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                        className="w-full rounded-md border border-gray-200 p-2.5 text-xs text-gray-900 outline-none focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-gray-700 mb-1">
                        Gender
                      </label>
                      <select
                        value={formData.gender}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            gender: e.target.value as Employee["gender"],
                          })
                        }
                        className="w-full rounded-md border border-gray-200 p-2.5 text-xs text-gray-900 outline-none focus:border-blue-500 bg-white"
                      >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Non-Binary">Non-Binary</option>
                        <option value="Prefer not to say">Prefer not to say</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-semibold text-gray-700 mb-1">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+1 (555) 234-5678"
                        className="w-full rounded-md border border-gray-200 p-2.5 text-xs text-gray-900 outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-semibold text-gray-700 mb-1">
                        Personal Email
                      </label>
                      <input
                        type="email"
                        value={formData.personalEmail}
                        onChange={(e) => setFormData({ ...formData, personalEmail: e.target.value })}
                        placeholder="personal@gmail.com"
                        className="w-full rounded-md border border-gray-200 p-2.5 text-xs text-gray-900 outline-none focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-gray-700 mb-1">
                        Work Email <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.workEmail}
                        onChange={(e) => setFormData({ ...formData, workEmail: e.target.value })}
                        placeholder="name@company.com"
                        className="w-full rounded-md border border-gray-200 p-2.5 text-xs text-gray-900 outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">
                      Residential Address
                    </label>
                    <input
                      type="text"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      placeholder="e.g. 742 Evergreen Terrace, San Francisco, CA"
                      className="w-full rounded-md border border-gray-200 p-2.5 text-xs text-gray-900 outline-none focus:border-blue-500"
                    />
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                    <span className="font-bold text-gray-900 text-xs">Emergency Contact</span>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[11px] text-gray-600 mb-1">Contact Name</label>
                        <input
                          type="text"
                          value={formData.emergencyName}
                          onChange={(e) => setFormData({ ...formData, emergencyName: e.target.value })}
                          placeholder="Spouse / Parent"
                          className="w-full rounded-md border border-gray-200 p-2 text-xs bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] text-gray-600 mb-1">Relationship</label>
                        <input
                          type="text"
                          value={formData.emergencyRel}
                          onChange={(e) => setFormData({ ...formData, emergencyRel: e.target.value })}
                          placeholder="e.g. Spouse"
                          className="w-full rounded-md border border-gray-200 p-2 text-xs bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] text-gray-600 mb-1">Emergency Phone</label>
                        <input
                          type="tel"
                          value={formData.emergencyPhone}
                          onChange={(e) => setFormData({ ...formData, emergencyPhone: e.target.value })}
                          placeholder="+1 (555) 999-0000"
                          className="w-full rounded-md border border-gray-200 p-2 text-xs bg-white"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 2: EMPLOYMENT INFORMATION */}
              {addStep === 2 && (
                <div className="space-y-4">
                  <h4 className="font-bold text-gray-900 text-xs uppercase tracking-wider pb-1 border-b border-gray-100">
                    2. Employment & Team Assignment
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block font-semibold text-gray-700 mb-1">
                        Employee ID
                      </label>
                      <input
                        type="text"
                        value={formData.employeeId}
                        onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
                        placeholder={`Auto (e.g. ${currentOrg.logo}-105)`}
                        className="w-full rounded-md border border-gray-200 p-2.5 text-xs text-gray-900 outline-none font-mono"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-gray-700 mb-1">
                        Department <span className="text-red-500">*</span>
                      </label>
                      <select
                        required
                        value={formData.department}
                        onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                        className="w-full rounded-md border border-gray-200 p-2.5 text-xs text-gray-900 bg-white"
                      >
                        {departments.map((d) => (
                          <option key={d.id} value={d.name}>
                            {d.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block font-semibold text-gray-700 mb-1">
                        Designation / Job Title <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.designation}
                        onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                        placeholder="e.g. Senior Software Engineer"
                        className="w-full rounded-md border border-gray-200 p-2.5 text-xs text-gray-900"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block font-semibold text-gray-700 mb-1">
                        Team
                      </label>
                      <select
                        value={formData.team}
                        onChange={(e) => setFormData({ ...formData, team: e.target.value })}
                        className="w-full rounded-md border border-gray-200 p-2.5 text-xs text-gray-900 bg-white"
                      >
                        {teams.map((t) => (
                          <option key={t.id} value={t.name}>
                            {t.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block font-semibold text-gray-700 mb-1">
                        Assigned Team Lead (TL)
                      </label>
                      <select
                        value={formData.assignedTLId}
                        onChange={(e) => setFormData({ ...formData, assignedTLId: e.target.value })}
                        className="w-full rounded-md border border-gray-200 p-2.5 text-xs text-gray-900 bg-white"
                      >
                        <option value="">No TL / Self-Led</option>
                        {teamLeads.map((tl) => (
                          <option key={tl.id} value={tl.id}>
                            {tl.name} ({tl.department})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block font-semibold text-gray-700 mb-1">
                        Assigned Manager
                      </label>
                      <select
                        value={formData.assignedManagerId}
                        onChange={(e) => setFormData({ ...formData, assignedManagerId: e.target.value })}
                        className="w-full rounded-md border border-gray-200 p-2.5 text-xs text-gray-900 bg-white"
                      >
                        <option value="">Executive Committee / Self</option>
                        {managers.map((m) => (
                          <option key={m.id} value={m.id}>
                            {m.name} ({m.designation})
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block font-semibold text-gray-700 mb-1">
                        Employment Type
                      </label>
                      <select
                        value={formData.employmentType}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            employmentType: e.target.value as EmploymentType,
                          })
                        }
                        className="w-full rounded-md border border-gray-200 p-2.5 text-xs text-gray-900 bg-white"
                      >
                        <option value="Full Time">Full Time</option>
                        <option value="Part Time">Part Time</option>
                        <option value="Contract">Contract</option>
                        <option value="Intern">Intern</option>
                        <option value="Consultant">Consultant</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-semibold text-gray-700 mb-1">
                        Work Location
                      </label>
                      <input
                        type="text"
                        value={formData.workLocation}
                        onChange={(e) => setFormData({ ...formData, workLocation: e.target.value })}
                        className="w-full rounded-md border border-gray-200 p-2.5 text-xs text-gray-900"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-gray-700 mb-1">
                        Joining Date
                      </label>
                      <input
                        type="date"
                        value={formData.joiningDate}
                        onChange={(e) => setFormData({ ...formData, joiningDate: e.target.value })}
                        className="w-full rounded-md border border-gray-200 p-2.5 text-xs text-gray-900 font-mono"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 3: ACCOUNT & COMPENSATION */}
              {addStep === 3 && (
                <div className="space-y-4">
                  <h4 className="font-bold text-gray-900 text-xs uppercase tracking-wider pb-1 border-b border-gray-100">
                    3. Account Permissions & Compensation
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-semibold text-gray-700 mb-1">
                        System User Role
                      </label>
                      <select
                        value={formData.role}
                        onChange={(e) =>
                          setFormData({ ...formData, role: e.target.value as UserRole })
                        }
                        className="w-full rounded-md border border-gray-200 p-2.5 text-xs text-gray-900 bg-white"
                      >
                        <option value="employee">Employee (Self-Service Portal)</option>
                        <option value="team-lead">Team Lead (Team Attendance & Approvals)</option>
                        <option value="manager">Manager (Department Head)</option>
                        <option value="admin-hr">Admin / HR (Tenant Admin)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-semibold text-gray-700 mb-1">
                        Account Initial Status
                      </label>
                      <select
                        value={formData.initialStatus}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            initialStatus: e.target.value as EmployeeStatus,
                          })
                        }
                        className="w-full rounded-md border border-gray-200 p-2.5 text-xs text-gray-900 bg-white"
                      >
                        <option value="Active">Active</option>
                        <option value="Probation">Probation (3 Months)</option>
                      </select>
                    </div>
                  </div>

                  {/* Compensation Breakdown */}
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                    <span className="font-bold text-gray-900 text-xs">
                      Monthly Salary Structure (USD)
                    </span>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <div>
                        <label className="block text-[11px] text-gray-600 mb-1">Basic Salary ($)</label>
                        <input
                          type="number"
                          value={formData.basicSalary}
                          onChange={(e) => setFormData({ ...formData, basicSalary: Number(e.target.value) })}
                          className="w-full rounded-md border border-gray-200 p-2 text-xs bg-white font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] text-gray-600 mb-1">HRA ($)</label>
                        <input
                          type="number"
                          value={formData.hra}
                          onChange={(e) => setFormData({ ...formData, hra: Number(e.target.value) })}
                          className="w-full rounded-md border border-gray-200 p-2 text-xs bg-white font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] text-gray-600 mb-1">Allowances ($)</label>
                        <input
                          type="number"
                          value={formData.allowances}
                          onChange={(e) => setFormData({ ...formData, allowances: Number(e.target.value) })}
                          className="w-full rounded-md border border-gray-200 p-2 text-xs bg-white font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] text-gray-600 mb-1">Special Allowance ($)</label>
                        <input
                          type="number"
                          value={formData.specialAllowance}
                          onChange={(e) => setFormData({ ...formData, specialAllowance: Number(e.target.value) })}
                          className="w-full rounded-md border border-gray-200 p-2 text-xs bg-white font-mono"
                        />
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-200 flex justify-between items-center text-xs">
                      <span className="text-gray-500 font-medium">Estimated Monthly Gross:</span>
                      <span className="text-sm font-black text-gray-900 font-mono">
                        $
                        {(
                          Number(formData.basicSalary) +
                          Number(formData.hra) +
                          Number(formData.allowances) +
                          Number(formData.specialAllowance)
                        ).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <div className="p-3 bg-blue-50 rounded-xl text-blue-900 text-[11.5px] leading-relaxed">
                    <p className="font-semibold">Automatic System Provisioning:</p>
                    <p className="text-blue-700 mt-0.5">
                      Creating this record will initialize 15 Annual, 10 Casual, and 12 Sick leaves based on {currentOrg.name} company policy, and dispatch login credentials to {formData.workEmail || "the work email"}.
                    </p>
                  </div>
                </div>
              )}

              {/* Modal Footer Controls */}
              <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                {addStep > 1 ? (
                  <button
                    type="button"
                    onClick={() => setAddStep((s) => (s - 1) as 1 | 2 | 3)}
                    className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold cursor-pointer"
                  >
                    ← Previous Step
                  </button>
                ) : (
                  <div />
                )}

                {addStep < 3 ? (
                  <button
                    type="button"
                    onClick={() => setAddStep((s) => (s + 1) as 1 | 2 | 3)}
                    className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold cursor-pointer shadow-xs"
                  >
                    Next Step →
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={isLimitReached}
                    className="px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold cursor-pointer shadow-md disabled:bg-gray-400"
                  >
                    {isLimitReached ? "Limit Reached" : "Save & Onboard Employee"}
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 5. BULK IMPORT WIZARD MODAL */}
      {isBulkModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden text-xs">
            <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-slate-50/60">
              <div>
                <h3 className="text-base font-bold text-gray-900">
                  Bulk Staff Import Wizard
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Import employee profiles in batches using CSV formatting.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsBulkModalOpen(false)}
                className="w-7 h-7 rounded-md bg-gray-100 hover:bg-gray-200 text-gray-500 flex items-center justify-center cursor-pointer"
              >
                <CloseIcon className="w-3.5 h-3.5" size={14} />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4">
              {/* Step 1: Template & Upload */}
              {bulkStep === 1 && (
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200 flex items-center justify-between">
                    <div>
                      <p className="font-bold text-blue-900 text-xs">
                        Download Standard CSV Template
                      </p>
                      <p className="text-[11px] text-blue-700 mt-0.5">
                        Includes required column headers: Employee ID, First Name, Last Name, Email, Department, Designation, etc.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={handleDownloadTemplate}
                      className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-xs"
                    >
                      Download CSV
                    </button>
                  </div>

                  <div>
                    <label className="block font-semibold text-gray-800 mb-1.5">
                      Paste CSV Content or Upload:
                    </label>
                    <textarea
                      rows={8}
                      value={bulkCsvText}
                      onChange={(e) => setBulkCsvText(e.target.value)}
                      placeholder={`Employee ID,First Name,Last Name,Email,Phone,Department,Designation,Team,Employment Type,Location,Joining Date\n${currentOrg.logo}-601,Julian,Bashir,julian.b@company.com,+1 (555) 444-1234,Operations & HR,HR Specialist,Talent & Culture,Full Time,HQ,2026-09-01`}
                      className="w-full rounded-xl border border-gray-200 p-3 font-mono text-[11px] text-gray-800 focus:border-blue-500 outline-none"
                    />
                  </div>

                  <div className="flex justify-end pt-2">
                    <button
                      type="button"
                      disabled={!bulkCsvText.trim()}
                      onClick={() => setBulkStep(2)}
                      className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-xs disabled:bg-gray-300"
                    >
                      Verify & Map Columns →
                    </button>
                  </div>
                </div>
              )}

              {/* Step 2: Verification Preview */}
              {bulkStep === 2 && (
                <div className="space-y-4">
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                    <p className="font-bold text-gray-900">Validation & Duplicate Detection</p>
                    <p className="text-[11px] text-gray-500">
                      Verifying rows against organization limits and existing employee records...
                    </p>
                  </div>

                  <div className="p-4 rounded-xl border border-gray-100 bg-gray-50/50">
                    <p className="text-xs font-semibold text-gray-700 mb-2">
                      Ready to process rows from your CSV.
                    </p>
                    <p className="text-[11px] text-gray-500">
                      Active slots remaining: {currentOrg.employeeLimit - activeEmployeeCount} slots.
                    </p>
                  </div>

                  <div className="flex justify-between items-center pt-2">
                    <button
                      type="button"
                      onClick={() => setBulkStep(1)}
                      className="px-3.5 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold"
                    >
                      ← Back
                    </button>
                    <button
                      type="button"
                      onClick={handleProcessBulkImport}
                      className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-xs"
                    >
                      Confirm & Import Staff
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3: Import Summary Report */}
              {bulkStep === 3 && importSummary && (
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-3 text-center">
                    <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200">
                      <p className="text-[10px] uppercase tracking-wider font-bold text-emerald-800">
                        Imported
                      </p>
                      <p className="text-2xl font-black text-emerald-700">
                        {importSummary.success}
                      </p>
                    </div>
                    <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200">
                      <p className="text-[10px] uppercase tracking-wider font-bold text-amber-800">
                        Duplicate
                      </p>
                      <p className="text-2xl font-black text-amber-700">
                        {importSummary.duplicate}
                      </p>
                    </div>
                    <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200">
                      <p className="text-[10px] uppercase tracking-wider font-bold text-rose-800">
                        Failed
                      </p>
                      <p className="text-2xl font-black text-rose-700">
                        {importSummary.failed}
                      </p>
                    </div>
                  </div>

                  {importSummary.errors.length > 0 && (
                    <div className="p-3.5 rounded-xl border border-rose-200 bg-rose-50/50 space-y-1.5 max-h-40 overflow-y-auto">
                      <p className="font-bold text-rose-900 text-xs">Failed Rows & Error Log:</p>
                      {importSummary.errors.map((err, i) => (
                        <p key={i} className="text-[11px] text-rose-700">
                          Row {err.row}: {err.reason}
                        </p>
                      ))}
                    </div>
                  )}

                  <div className="flex justify-end pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        setIsBulkModalOpen(false);
                        setBulkStep(1);
                      }}
                      className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold"
                    >
                      Done & Return to Directory
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 6. EMPLOYEE OFFBOARDING WORKFLOW MODAL */}
      {isOffboardModalOpen && selectedEmployee && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 w-full max-w-lg overflow-hidden text-xs">
            <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-rose-50/60">
              <div className="flex items-center space-x-2.5">
                <span className="w-8 h-8 rounded-full bg-rose-100 text-rose-700 font-bold flex items-center justify-center text-xs">
                  {selectedEmployee.avatar || "EM"}
                </span>
                <div>
                  <h3 className="text-base font-bold text-gray-900">
                    Offboard Employee: {selectedEmployee.name}
                  </h3>
                  <p className="text-xs text-rose-600 font-medium">
                    {selectedEmployee.employeeId} • {selectedEmployee.designation}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsOffboardModalOpen(false)}
                className="w-7 h-7 rounded-md bg-gray-100 hover:bg-gray-200 text-gray-500 flex items-center justify-center cursor-pointer"
              >
                <CloseIcon className="w-3.5 h-3.5" size={14} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 text-[11px] leading-relaxed">
                <strong>Soft Deletion Policy:</strong> The employee record will transition to{" "}
                <code className="bg-amber-100 px-1 py-0.5 rounded font-bold">OFFBOARDED</code>.
                Login access will be disabled, but all historical payroll, tax receipts, attendance,
                and leave balances remain permanently preserved in the company audit vault.
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">
                    Last Working Date
                  </label>
                  <input
                    type="date"
                    value={offboardingForm.lastWorkingDate}
                    onChange={(e) =>
                      setOffboardingForm({ ...offboardingForm, lastWorkingDate: e.target.value })
                    }
                    className="w-full rounded-md border border-gray-200 p-2 text-xs"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">
                    Notice Period
                  </label>
                  <select
                    value={offboardingForm.noticePeriod}
                    onChange={(e) =>
                      setOffboardingForm({ ...offboardingForm, noticePeriod: e.target.value })
                    }
                    className="w-full rounded-md border border-gray-200 p-2 text-xs bg-white"
                  >
                    <option value="Immediate">Immediate / Zero Notice</option>
                    <option value="15 Days">15 Days</option>
                    <option value="30 Days">30 Days Standard</option>
                    <option value="60 Days">60 Days</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  Offboarding Reason
                </label>
                <select
                  value={offboardingForm.reason}
                  onChange={(e) =>
                    setOffboardingForm({ ...offboardingForm, reason: e.target.value })
                  }
                  className="w-full rounded-md border border-gray-200 p-2 text-xs bg-white"
                >
                  <option value="Voluntary Resignation - Better Opportunity">
                    Voluntary Resignation - Career Advancement
                  </option>
                  <option value="Relocation / Family Relocation">
                    Relocation Abroad / Family Relocation
                  </option>
                  <option value="Retirement">Retirement</option>
                  <option value="Mutual Separation">Mutual Separation Agreement</option>
                  <option value="Performance Separation">Performance Separation</option>
                  <option value="Contract Expiration">Contract Period Concluded</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  Company Assets Return Status
                </label>
                <select
                  value={offboardingForm.assetReturnStatus}
                  onChange={(e) =>
                    setOffboardingForm({
                      ...offboardingForm,
                      assetReturnStatus: e.target.value as OffboardingDetails["assetReturnStatus"],
                    })
                  }
                  className="w-full rounded-md border border-gray-200 p-2 text-xs bg-white"
                >
                  <option value="Pending">Pending Return (Laptop, Badge, Monitor)</option>
                  <option value="In Progress">In Progress (Shipped to IT)</option>
                  <option value="Completed">Completed (All hardware verified)</option>
                </select>
              </div>

              <div className="space-y-2 pt-1">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={offboardingForm.exitInterviewRequired}
                    onChange={(e) =>
                      setOffboardingForm({
                        ...offboardingForm,
                        exitInterviewRequired: e.target.checked,
                      })
                    }
                    className="rounded text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-gray-700 font-medium">Exit Interview Required with HR</span>
                </label>

                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={offboardingForm.finalSettlementRequired}
                    onChange={(e) =>
                      setOffboardingForm({
                        ...offboardingForm,
                        finalSettlementRequired: e.target.checked,
                      })
                    }
                    className="rounded text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-gray-700 font-medium">
                    Process Final Settlement in Next Payroll Cycle
                  </span>
                </label>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Remarks & Handover Notes</label>
                <textarea
                  rows={2}
                  value={offboardingForm.remarks}
                  onChange={(e) =>
                    setOffboardingForm({ ...offboardingForm, remarks: e.target.value })
                  }
                  className="w-full rounded-md border border-gray-200 p-2 text-xs"
                />
              </div>

              <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setIsOffboardModalOpen(false)}
                  className="px-3.5 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmOffboarding}
                  className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold shadow-xs cursor-pointer"
                >
                  Confirm Separation
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 7. EMPLOYEE DETAILS SLIDE-OVER DRAWER */}
      {isDetailDrawerOpen && selectedEmployee && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div
            className="fixed inset-0 bg-black/35 backdrop-blur-[1px] transition-opacity"
            onClick={() => setIsDetailDrawerOpen(false)}
          />

          <div className="fixed right-0 top-0 h-screen w-full max-w-xl bg-white shadow-2xl border-l border-gray-200 flex flex-col animate-in slide-in-from-right duration-200">
            {/* Drawer Header */}
            <div className="p-6 border-b border-gray-100 bg-slate-50/60 flex items-center justify-between">
              <div className="flex items-center space-x-3.5">
                <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold flex items-center justify-center text-sm shadow-md">
                  {selectedEmployee.avatar || selectedEmployee.firstName[0]}
                </div>
                <div>
                  <h3 className="text-base font-bold text-gray-900 leading-tight">
                    {selectedEmployee.name}
                  </h3>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {selectedEmployee.employeeId} • {selectedEmployee.designation}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsDetailDrawerOpen(false)}
                className="w-7 h-7 rounded-md bg-gray-100 hover:bg-gray-200 text-gray-500 flex items-center justify-center cursor-pointer"
              >
                <CloseIcon className="w-3.5 h-3.5" size={14} />
              </button>
            </div>

            {/* Tab Navigation */}
            <div className="px-6 border-b border-gray-100 flex space-x-4 text-xs font-semibold overflow-x-auto">
              {(
                [
                  { id: "overview", label: "Overview" },
                  { id: "job", label: "Job & Hierarchy" },
                  { id: "compensation", label: "Compensation" },
                  { id: "leaves", label: "Leave Balances" },
                  { id: "history", label: "Audit & Offboarding" },
                ] as const
              ).map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setDetailTab(tab.id)}
                  className={`py-3 border-b-2 transition whitespace-nowrap ${
                    detailTab === tab.id
                      ? "border-blue-600 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-800"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Content Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 text-xs">
              {/* Tab 1: Overview */}
              {detailTab === "overview" && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3 p-4 rounded-xl bg-gray-50 border border-gray-100">
                    <div>
                      <p className="text-gray-400 text-[10px] uppercase font-bold">Status</p>
                      <span className="font-bold text-gray-900 text-xs mt-0.5 inline-block">
                        {selectedEmployee.status}
                      </span>
                    </div>
                    <div>
                      <p className="text-gray-400 text-[10px] uppercase font-bold">Role</p>
                      <span className="font-bold text-gray-900 text-xs mt-0.5 inline-block">
                        {selectedEmployee.role}
                      </span>
                    </div>
                    <div>
                      <p className="text-gray-400 text-[10px] uppercase font-bold">Work Location</p>
                      <span className="font-semibold text-gray-800 text-xs mt-0.5 inline-block">
                        {selectedEmployee.workLocation}
                      </span>
                    </div>
                    <div>
                      <p className="text-gray-400 text-[10px] uppercase font-bold">Date of Joining</p>
                      <span className="font-mono text-gray-800 text-xs mt-0.5 inline-block">
                        {selectedEmployee.joiningDate}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-bold text-gray-900 text-xs uppercase tracking-wider">
                      Contact Information
                    </h4>
                    <div className="p-3.5 rounded-xl border border-gray-100 space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Work Email:</span>
                        <span className="font-medium text-gray-900">{selectedEmployee.email}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Personal Email:</span>
                        <span className="font-medium text-gray-900">
                          {selectedEmployee.personalEmail}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Phone:</span>
                        <span className="font-medium text-gray-900">{selectedEmployee.phone}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Address:</span>
                        <span className="font-medium text-gray-900">{selectedEmployee.address}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-bold text-gray-900 text-xs uppercase tracking-wider">
                      Emergency Contact
                    </h4>
                    <div className="p-3.5 rounded-xl border border-gray-100 space-y-1">
                      <p className="font-bold text-gray-900">
                        {selectedEmployee.emergencyContact?.name} (
                        {selectedEmployee.emergencyContact?.relationship})
                      </p>
                      <p className="text-gray-500">{selectedEmployee.emergencyContact?.phone}</p>
                    </div>
                  </div>

                  {/* Administrative Action Controls */}
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3 pt-3">
                    <h4 className="font-bold text-gray-900 text-xs uppercase tracking-wider">
                      Administrative Actions
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => handleToggleEmployeeStatus(selectedEmployee)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                          selectedEmployee.status === "Active"
                            ? "bg-amber-100 hover:bg-amber-200 text-amber-800"
                            : "bg-emerald-600 hover:bg-emerald-700 text-white"
                        }`}
                      >
                        {selectedEmployee.status === "Active"
                          ? "Deactivate Account"
                          : "Activate Account"}
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          showToast(`Temporary password reset link dispatched to ${selectedEmployee.email}`);
                        }}
                        className="px-3 py-1.5 rounded-lg bg-white border border-gray-200 hover:bg-gray-100 text-gray-700 font-semibold text-xs transition"
                      >
                        Reset Password
                      </button>

                      {selectedEmployee.status !== "Offboarded" && (
                        <button
                          type="button"
                          onClick={() => {
                            setIsDetailDrawerOpen(false);
                            setIsOffboardModalOpen(true);
                          }}
                          className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs transition shadow-2xs"
                        >
                          Start Offboarding
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 2: Job & Hierarchy */}
              {detailTab === "job" && (
                <div className="space-y-4">
                  <div className="p-4 rounded-xl border border-gray-100 bg-gray-50 space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Department:</span>
                      <span className="font-bold text-gray-900">{selectedEmployee.department}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Team:</span>
                      <span className="font-bold text-gray-900">{selectedEmployee.team}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Designation:</span>
                      <span className="font-bold text-gray-900">{selectedEmployee.designation}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Assigned Team Lead (TL):</span>
                      <span className="font-bold text-blue-600">
                        {selectedEmployee.assignedTLName || "Self-Led"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Assigned Manager:</span>
                      <span className="font-bold text-blue-600">
                        {selectedEmployee.assignedManagerName || "Department Head"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Employment Type:</span>
                      <span className="font-medium text-gray-800">
                        {selectedEmployee.employmentType}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 3: Compensation */}
              {detailTab === "compensation" && (
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5">
                    <div className="flex justify-between font-semibold">
                      <span>Basic Salary:</span>
                      <span className="font-mono">
                        ${selectedEmployee.compensation?.basicSalary?.toLocaleString() || 0}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">HRA:</span>
                      <span className="font-mono">
                        ${selectedEmployee.compensation?.hra?.toLocaleString() || 0}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Standard Allowances:</span>
                      <span className="font-mono">
                        ${selectedEmployee.compensation?.allowances?.toLocaleString() || 0}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Special Allowance:</span>
                      <span className="font-mono">
                        ${selectedEmployee.compensation?.specialAllowance?.toLocaleString() || 0}
                      </span>
                    </div>

                    <div className="pt-2 border-t border-slate-200 flex justify-between font-bold text-gray-900">
                      <span>Gross Monthly Pay:</span>
                      <span className="font-mono">
                        $
                        {(
                          (selectedEmployee.compensation?.basicSalary || 0) +
                          (selectedEmployee.compensation?.hra || 0) +
                          (selectedEmployee.compensation?.allowances || 0) +
                          (selectedEmployee.compensation?.specialAllowance || 0)
                        ).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl border border-gray-100 space-y-2">
                    <h5 className="font-bold text-gray-900 text-[11px] uppercase tracking-wider">
                      Deductions & Benefits
                    </h5>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Provident Fund (PF):</span>
                      <span className="font-mono">
                        ${selectedEmployee.compensation?.pf?.toLocaleString() || 0}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Medical Insurance:</span>
                      <span className="font-mono">
                        ${selectedEmployee.compensation?.insurance?.toLocaleString() || 0}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Estimated Income Tax:</span>
                      <span className="font-mono">
                        ${selectedEmployee.compensation?.tax?.toLocaleString() || 0}
                      </span>
                    </div>
                  </div>

                  <div className="p-3 bg-gray-50 rounded-lg text-gray-600 text-[11px]">
                    Disbursement: {selectedEmployee.compensation?.paymentMethod} •{" "}
                    {selectedEmployee.compensation?.bankName} (
                    {selectedEmployee.compensation?.accountNumber})
                  </div>
                </div>
              )}

              {/* Tab 4: Leaves */}
              {detailTab === "leaves" && (
                <div className="space-y-3">
                  <h4 className="font-bold text-gray-900 text-xs uppercase tracking-wider">
                    Allocated Leave Balances (Annual)
                  </h4>
                  {selectedEmployee.leaveBalances && selectedEmployee.leaveBalances.length > 0 ? (
                    selectedEmployee.leaveBalances.map((bal) => (
                      <div
                        key={bal.leaveTypeId}
                        className="p-3.5 rounded-xl border border-gray-100 flex items-center justify-between"
                      >
                        <div>
                          <p className="font-bold text-gray-900">{bal.leaveTypeName}</p>
                          <p className="text-[11px] text-gray-400">
                            Allocated: {bal.allocated} Days • Used: {bal.used}
                          </p>
                        </div>
                        <div className="text-right">
                          <span className="text-base font-black text-blue-600 font-mono">
                            {bal.remaining}
                          </span>
                          <span className="text-[10px] text-gray-400 block">Days left</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-400">No leave balances initialized.</p>
                  )}
                </div>
              )}

              {/* Tab 5: History & Offboarding */}
              {detailTab === "history" && (
                <div className="space-y-4">
                  {selectedEmployee.offboardingDetails ? (
                    <div className="p-4 rounded-xl border border-rose-200 bg-rose-50/50 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-rose-900">Separation Completed</span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-200 text-rose-800">
                          Offboarded
                        </span>
                      </div>
                      <p className="text-gray-700">
                        <strong>Last Working Date:</strong>{" "}
                        {selectedEmployee.offboardingDetails.lastWorkingDate}
                      </p>
                      <p className="text-gray-700">
                        <strong>Reason:</strong> {selectedEmployee.offboardingDetails.reason}
                      </p>
                      <p className="text-gray-700">
                        <strong>Assets Status:</strong>{" "}
                        {selectedEmployee.offboardingDetails.assetReturnStatus}
                      </p>
                      <p className="text-gray-700">
                        <strong>Remarks:</strong> {selectedEmployee.offboardingDetails.remarks}
                      </p>
                    </div>
                  ) : (
                    <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/50 text-emerald-900 space-y-1">
                      <p className="font-bold">Active Staff Member</p>
                      <p className="text-emerald-700 text-xs">
                        This employee is actively employed and in good standing with {currentOrg.name}.
                      </p>
                    </div>
                  )}

                  <div className="pt-2">
                    <p className="text-gray-400 text-[11px]">
                      Created on {new Date(selectedEmployee.createdAt).toLocaleDateString()} • Last
                      modified {new Date(selectedEmployee.updatedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

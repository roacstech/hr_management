"use client";

import { useState, useMemo } from "react";
import { useTenant } from "@/context/TenantContext";
import { PayrollRun, Payslip, Employee } from "@/lib/types";
import { CloseIcon, SearchIcon, CompensationIcon } from "@/components/SidebarIcons";
import EmptyState from "@/components/EmptyState";

export default function GlobalPayrollPage() {
  const {
    currentOrg,
    employees,
    payrollRuns,
    calculateMonthlyPayroll,
    updatePayrollRunStatus,
    getPayslip,
    updateEmployee,
    showToast,
  } = useTenant();

  // Selected Month & Year
  const [selectedMonth, setSelectedMonth] = useState("September");
  const [selectedYear, setSelectedYear] = useState(2026);
  const [activeTab, setActiveTab] = useState<"runs" | "compensation" | "payslips">("runs");

  // Filter & Search
  const [search, setSearch] = useState("");

  // Modals state
  const [selectedPayslip, setSelectedPayslip] = useState<Payslip | null>(null);
  const [isPayslipModalOpen, setIsPayslipModalOpen] = useState(false);
  const [isEditSalaryModalOpen, setIsEditSalaryModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);

  // Edit Salary Form
  const [salaryForm, setSalaryForm] = useState({
    basicSalary: 6000,
    hra: 1800,
    allowances: 600,
    specialAllowance: 400,
    bonus: 0,
    incentives: 0,
    tax: 1200,
    pf: 450,
    insurance: 150,
    otherDeductions: 50,
    paymentMethod: "Bank Transfer" as Employee["compensation"]["paymentMethod"],
    bankName: "Standard National Bank",
    accountNumber: "•••• 4821",
  });

  // Current active payroll run for selected month/year
  const currentRun = useMemo(() => {
    return (
      payrollRuns.find(
        (r) =>
          r.organizationId === currentOrg.id &&
          r.month.toLowerCase() === selectedMonth.toLowerCase() &&
          r.year === selectedYear
      ) || payrollRuns[0]
    );
  }, [payrollRuns, currentOrg.id, selectedMonth, selectedYear]);

  // Handle Calculate / Recalculate Payroll
  const handleCalculatePayroll = () => {
    calculateMonthlyPayroll(selectedMonth, selectedYear, 21);
  };

  // Handle Status Transitions
  const handleStatusChange = (newStatus: PayrollRun["status"]) => {
    if (!currentRun) return;
    updatePayrollRunStatus(currentRun.id, newStatus);
  };

  // Handle View Payslip
  const handleViewPayslip = (payrollItemId: string) => {
    try {
      const ps = getPayslip(payrollItemId);
      setSelectedPayslip(ps);
      setIsPayslipModalOpen(true);
    } catch {
      showToast("Unable to load payslip for this item.", "error");
    }
  };

  // Open Edit Salary Modal
  const handleOpenEditSalary = (emp: Employee) => {
    setEditingEmployee(emp);
    const comp = emp.compensation;
    setSalaryForm({
      basicSalary: comp.basicSalary,
      hra: comp.hra,
      allowances: comp.allowances,
      specialAllowance: comp.specialAllowance,
      bonus: comp.bonus,
      incentives: comp.incentives,
      tax: comp.tax,
      pf: comp.pf,
      insurance: comp.insurance,
      otherDeductions: comp.otherDeductions,
      paymentMethod: comp.paymentMethod,
      bankName: comp.bankName,
      accountNumber: comp.accountNumber,
    });
    setIsEditSalaryModalOpen(true);
  };

  // Save Salary Changes
  const handleSaveSalary = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEmployee) return;

    updateEmployee(editingEmployee.id, {
      compensation: {
        ...editingEmployee.compensation,
        basicSalary: Number(salaryForm.basicSalary),
        hra: Number(salaryForm.hra),
        allowances: Number(salaryForm.allowances),
        specialAllowance: Number(salaryForm.specialAllowance),
        bonus: Number(salaryForm.bonus),
        incentives: Number(salaryForm.incentives),
        tax: Number(salaryForm.tax),
        pf: Number(salaryForm.pf),
        insurance: Number(salaryForm.insurance),
        otherDeductions: Number(salaryForm.otherDeductions),
        paymentMethod: salaryForm.paymentMethod,
        bankName: salaryForm.bankName,
        accountNumber: salaryForm.accountNumber,
      },
    });

    setIsEditSalaryModalOpen(false);
    showToast(`Updated compensation structure for ${editingEmployee.name}.`);
  };

  // Bulk Email Simulation
  const handleBulkEmailPayslips = () => {
    showToast(
      `Dispatched encrypted PDF payslips to all ${currentRun?.totalEmployees || 0} active employees.`,
      "success"
    );
  };

  // Filter items in current run
  const filteredItems = useMemo(() => {
    if (!currentRun?.items) return [];
    return currentRun.items.filter(
      (item) =>
        item.employeeName.toLowerCase().includes(search.toLowerCase()) ||
        item.employeeCode.toLowerCase().includes(search.toLowerCase()) ||
        item.department.toLowerCase().includes(search.toLowerCase())
    );
  }, [currentRun, search]);

  return (
    <div className="space-y-6 pb-16 font-sans">
      {/* 1. HEADER WITH MONTH SELECTOR & RUN WORKFLOW */}
      <div className="bg-white p-6 rounded-2xl border border-gray-200/90 shadow-xs flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-[11px] font-bold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              {currentOrg.name} Payroll Engine
            </span>
            {currentRun && (
              <span
                className={`px-2 py-0.5 rounded-full text-[10.5px] font-bold ${
                  currentRun.status === "Paid"
                    ? "bg-emerald-100 text-emerald-800"
                    : currentRun.status === "Approved"
                    ? "bg-blue-100 text-blue-800"
                    : currentRun.status === "Locked"
                    ? "bg-slate-200 text-slate-800"
                    : "bg-amber-100 text-amber-800"
                }`}
              >
                Status: {currentRun.status}
              </span>
            )}
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mt-1.5 tracking-tight">
            Global Payroll & Compensation
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Process monthly salaries, calculate unpaid leave / LOP deductions, verify taxes, and generate PDF payslips.
          </p>
        </div>

        {/* Month Selector & Processing Actions */}
        <div className="flex items-center space-x-3 shrink-0">
          <div className="flex items-center space-x-1.5 bg-gray-50 p-1 rounded-lg border border-gray-200">
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="bg-transparent text-xs font-semibold text-gray-800 outline-none p-1"
            >
              <option value="August">August</option>
              <option value="September">September</option>
              <option value="October">October</option>
            </select>
            <span className="text-gray-400">/</span>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className="bg-transparent text-xs font-semibold text-gray-800 outline-none p-1"
            >
              <option value={2026}>2026</option>
              <option value={2025}>2025</option>
            </select>
          </div>

          <button
            type="button"
            onClick={handleCalculatePayroll}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-lg shadow-sm transition cursor-pointer"
          >
            Calculate / Refresh Run
          </button>
        </div>
      </div>

      {/* 2. SUMMARY KPI CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
        <div className="bg-white p-4 rounded-xl border border-gray-200/90 shadow-xs space-y-1">
          <p className="text-[11px] font-semibold text-gray-500">Gross Payroll</p>
          <p className="text-xl font-bold text-gray-900">
            ${currentRun?.grossPayroll?.toLocaleString() || "0"}
          </p>
          <span className="text-[10px] text-gray-400 font-mono">
            {currentRun?.totalEmployees || 0} Staff
          </span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200/90 shadow-xs space-y-1">
          <p className="text-[11px] font-semibold text-gray-500">Total Deductions</p>
          <p className="text-xl font-bold text-rose-600">
            -${currentRun?.totalDeductions?.toLocaleString() || "0"}
          </p>
          <span className="text-[10px] text-gray-400">PF, LOP & Benefits</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200/90 shadow-xs space-y-1">
          <p className="text-[11px] font-semibold text-gray-500">Tax Deductions</p>
          <p className="text-xl font-bold text-gray-900">
            ${currentRun?.taxDeductions?.toLocaleString() || "0"}
          </p>
          <span className="text-[10px] text-gray-400">IRS / Regional</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200/90 shadow-xs space-y-1">
          <p className="text-[11px] font-semibold text-gray-500">Total Bonuses</p>
          <p className="text-xl font-bold text-emerald-600">
            +${currentRun?.totalBonuses?.toLocaleString() || "0"}
          </p>
          <span className="text-[10px] text-gray-400">Incentives & OT</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200/90 shadow-xs space-y-1 sm:col-span-2 lg:col-span-2">
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-semibold text-gray-500">Net Disbursement</p>
            <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
              {currentRun?.month} {currentRun?.year}
            </span>
          </div>
          <p className="text-2xl font-black text-gray-900">
            ${currentRun?.netPayroll?.toLocaleString() || "0"}
          </p>
          <p className="text-[10.5px] text-gray-400">
            Formulas applied: Gross + Bonuses - Tax - PF - LOP
          </p>
        </div>
      </div>

      {/* 3. TABS NAVIGATION */}
      <div className="border-b border-gray-200 flex space-x-6 text-xs font-semibold">
        <button
          type="button"
          onClick={() => setActiveTab("runs")}
          className={`pb-3 border-b-2 transition flex items-center space-x-1.5 ${
            activeTab === "runs"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-gray-500 hover:text-gray-800"
          }`}
        >
          <CompensationIcon className="w-4 h-4" size={16} />
          <span>Monthly Payroll Run ({currentRun?.month} {currentRun?.year})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("compensation")}
          className={`pb-3 border-b-2 transition ${
            activeTab === "compensation"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-gray-500 hover:text-gray-800"
          }`}
        >
          Employee Compensation Roster ({employees.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("payslips")}
          className={`pb-3 border-b-2 transition ${
            activeTab === "payslips"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-gray-500 hover:text-gray-800"
          }`}
        >
          Payslips & Distribution
        </button>
      </div>

      {/* TAB 1: MONTHLY PAYROLL RUN PROCESSOR */}
      {activeTab === "runs" && (
        <div className="space-y-4">
          {/* Action Bar for Payroll Stages */}
          <div className="bg-white p-4 rounded-xl border border-gray-200/90 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs">
            <div className="flex items-center space-x-3">
              <span className="font-bold text-gray-800">
                Workflow Stage: <span className="text-blue-600">{currentRun?.status}</span>
              </span>
              <span className="text-gray-400">|</span>
              <span className="text-gray-500 font-mono">
                Working Days: {currentRun?.workingDays || 21} Days
              </span>
            </div>

            <div className="flex flex-wrap gap-2">
              {currentRun?.status === "Processing" && (
                <button
                  type="button"
                  onClick={() => handleStatusChange("Approved")}
                  className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold transition shadow-xs cursor-pointer"
                >
                  Submit for Approval
                </button>
              )}

              {currentRun?.status === "Approved" && (
                <button
                  type="button"
                  onClick={() => handleStatusChange("Paid")}
                  className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition shadow-xs cursor-pointer"
                >
                  Confirm & Mark as Paid
                </button>
              )}

              {currentRun?.status === "Paid" && (
                <button
                  type="button"
                  onClick={() => handleStatusChange("Locked")}
                  className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-900 text-white font-semibold transition cursor-pointer"
                >
                  Lock Completed Payroll
                </button>
              )}

              {currentRun?.status === "Locked" && (
                <span className="px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 font-semibold">
                  Locked & Reconciled
                </span>
              )}
            </div>
          </div>

          {/* Payroll Items Table */}
          <div className="bg-white rounded-2xl border border-gray-200/90 overflow-hidden shadow-xs">
            <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs">
              <div className="relative w-full sm:w-72">
                <SearchIcon className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Filter payroll line items..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full bg-white pl-9 pr-3 py-1.5 rounded-lg border border-gray-200 text-xs outline-none focus:border-blue-500"
                />
              </div>

              <span className="text-gray-400">
                Formula: Net = Gross + Bonus + Incentives - Tax - PF - LOP
              </span>
            </div>

            {filteredItems.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-gray-600">
                  <thead className="bg-slate-50/80 text-[11px] font-bold uppercase tracking-wider text-gray-500 border-b border-gray-200">
                    <tr>
                      <th className="px-5 py-3.5">Employee</th>
                      <th className="px-5 py-3.5">Basic</th>
                      <th className="px-5 py-3.5">Gross Pay</th>
                      <th className="px-5 py-3.5">Paid / LOP Days</th>
                      <th className="px-5 py-3.5">LOP Deduction</th>
                      <th className="px-5 py-3.5">Bonuses & OT</th>
                      <th className="px-5 py-3.5">PF & Taxes</th>
                      <th className="px-5 py-3.5">Net Salary</th>
                      <th className="px-5 py-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredItems.map((item) => (
                      <tr key={item.id} className="hover:bg-blue-50/20 transition">
                        <td className="px-5 py-4 whitespace-nowrap">
                          <p className="font-bold text-gray-900">{item.employeeName}</p>
                          <p className="text-[11px] text-gray-400">
                            {item.employeeCode} • {item.department}
                          </p>
                        </td>
                        <td className="px-5 py-4 font-mono font-medium text-gray-800 whitespace-nowrap">
                          ${item.basicSalary.toLocaleString()}
                        </td>
                        <td className="px-5 py-4 font-mono font-bold text-gray-900 whitespace-nowrap">
                          ${item.grossEarnings.toLocaleString()}
                        </td>
                        <td className="px-5 py-4 whitespace-nowrap font-mono">
                          <span className="text-emerald-700 font-semibold">
                            {item.paidDays} Paid
                          </span>{" "}
                          /{" "}
                          <span className={item.unpaidLeaveDays > 0 ? "text-rose-600 font-bold" : "text-gray-400"}>
                            {item.unpaidLeaveDays} LOP
                          </span>
                        </td>
                        <td className="px-5 py-4 font-mono whitespace-nowrap text-rose-600 font-semibold">
                          {item.lopDeduction > 0 ? `-$${item.lopDeduction}` : "$0"}
                        </td>
                        <td className="px-5 py-4 font-mono text-emerald-600 font-semibold whitespace-nowrap">
                          +${(item.bonus + item.incentives + item.overtimePay).toLocaleString()}
                        </td>
                        <td className="px-5 py-4 font-mono whitespace-nowrap text-gray-700">
                          ${(item.pfDeduction + item.taxDeduction).toLocaleString()}
                        </td>
                        <td className="px-5 py-4 font-mono font-black text-gray-900 whitespace-nowrap text-sm">
                          ${item.netSalary.toLocaleString()}
                        </td>
                        <td className="px-5 py-4 text-right whitespace-nowrap space-x-2">
                          <button
                            type="button"
                            onClick={() => handleViewPayslip(item.id)}
                            className="px-2.5 py-1 text-xs font-semibold text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 rounded-md transition"
                          >
                            Payslip
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <EmptyState
                title="No payroll run records found"
                description={`Click "Calculate / Refresh Run" above to compute monthly payroll for ${selectedMonth} ${selectedYear}.`}
                className="border-none shadow-none py-12"
              />
            )}
          </div>
        </div>
      )}

      {/* TAB 2: EMPLOYEE COMPENSATION ROSTER */}
      {activeTab === "compensation" && (
        <div className="bg-white rounded-2xl border border-gray-200/90 overflow-hidden shadow-xs space-y-4 p-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs">
            <div>
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide">
                Staff Compensation Matrix
              </h3>
              <p className="text-gray-500 text-xs">
                Configure base salaries, special allowances, and provident fund percentages.
              </p>
            </div>
            <span className="text-gray-400 font-mono text-xs">
              {employees.length} Salary Profiles Configured
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-gray-600">
              <thead className="bg-slate-50/80 text-[11px] font-bold uppercase tracking-wider text-gray-500 border-b border-gray-200">
                <tr>
                  <th className="px-5 py-3">Employee</th>
                  <th className="px-5 py-3">Basic Salary</th>
                  <th className="px-5 py-3">HRA</th>
                  <th className="px-5 py-3">Allowances</th>
                  <th className="px-5 py-3">Special Allowance</th>
                  <th className="px-5 py-3">PF Deduct</th>
                  <th className="px-5 py-3">Disbursement Bank</th>
                  <th className="px-5 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {employees.map((emp) => (
                  <tr key={emp.id} className="hover:bg-gray-50/60 transition">
                    <td className="px-5 py-3.5 whitespace-nowrap">
                      <p className="font-bold text-gray-900">{emp.name}</p>
                      <p className="text-[11px] text-gray-400">{emp.designation}</p>
                    </td>
                    <td className="px-5 py-3.5 font-mono font-semibold text-gray-900">
                      ${emp.compensation?.basicSalary?.toLocaleString() || 0}
                    </td>
                    <td className="px-5 py-3.5 font-mono text-gray-700">
                      ${emp.compensation?.hra?.toLocaleString() || 0}
                    </td>
                    <td className="px-5 py-3.5 font-mono text-gray-700">
                      ${emp.compensation?.allowances?.toLocaleString() || 0}
                    </td>
                    <td className="px-5 py-3.5 font-mono text-gray-700">
                      ${emp.compensation?.specialAllowance?.toLocaleString() || 0}
                    </td>
                    <td className="px-5 py-3.5 font-mono text-gray-700">
                      ${emp.compensation?.pf?.toLocaleString() || 0}
                    </td>
                    <td className="px-5 py-3.5 whitespace-nowrap">
                      <p className="text-gray-800 font-medium">
                        {emp.compensation?.bankName || "Direct Deposit"}
                      </p>
                      <p className="text-[11px] text-gray-400">
                        {emp.compensation?.accountNumber || "•••• 0000"}
                      </p>
                    </td>
                    <td className="px-5 py-3.5 text-right whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => handleOpenEditSalary(emp)}
                        className="px-3 py-1 text-xs font-semibold text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 rounded-md transition"
                      >
                        Edit Structure
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: PAYSLIPS & BULK ACTIONS */}
      {activeTab === "payslips" && (
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-xl border border-gray-200/90 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-xs">
            <div>
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide">
                Payslips Distribution — {currentRun?.month} {currentRun?.year}
              </h3>
              <p className="text-gray-500 text-xs mt-0.5">
                Generate, download, and email encrypted PDF payslips to employees.
              </p>
            </div>

            <div className="flex items-center space-x-2.5">
              <button
                type="button"
                onClick={handleBulkEmailPayslips}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-sm transition"
              >
                Bulk Email Payslips ({filteredItems.length})
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className="bg-white p-5 rounded-2xl border border-gray-200/90 shadow-xs hover:border-blue-300 transition space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-gray-900">{item.employeeName}</span>
                  <span className="font-mono text-xs font-black text-blue-600">
                    ${item.netSalary.toLocaleString()}
                  </span>
                </div>
                <div className="text-xs text-gray-500 space-y-1">
                  <p>{item.designation} • {item.department}</p>
                  <p className="font-mono text-[11px]">
                    Paid Days: {item.paidDays} | LOP Days: {item.unpaidLeaveDays}
                  </p>
                  <p className="text-[11px] text-gray-400">
                    Disbursed via: {item.paymentMethod} ({item.bankName})
                  </p>
                </div>
                <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => handleViewPayslip(item.id)}
                    className="text-xs font-semibold text-blue-600 hover:text-blue-800"
                  >
                    View & Print Payslip →
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      showToast(`Dispatched payslip email to ${item.employeeName}.`)
                    }
                    className="text-xs text-gray-500 hover:text-gray-800 font-medium"
                  >
                    Email PDF
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. PROFESSIONAL PAYSLIP MODAL (PDF / PRINT VIEW) */}
      {isPayslipModalOpen && selectedPayslip && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-300 w-full max-w-2xl max-h-[92vh] flex flex-col overflow-hidden text-xs">
            {/* Modal Actions Header */}
            <div className="p-4 border-b border-gray-200 bg-slate-50 flex items-center justify-between">
              <span className="font-bold text-gray-800 text-xs">
                Payslip Preview: {selectedPayslip.employeeName} ({selectedPayslip.month}{" "}
                {selectedPayslip.year})
              </span>
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-xs cursor-pointer"
                >
                  Print / Download PDF
                </button>
                <button
                  type="button"
                  onClick={() => setIsPayslipModalOpen(false)}
                  className="w-7 h-7 rounded-md bg-gray-100 hover:bg-gray-200 text-gray-500 flex items-center justify-center cursor-pointer"
                >
                  <CloseIcon className="w-3.5 h-3.5" size={14} />
                </button>
              </div>
            </div>

            {/* Printable Payslip Body */}
            <div className="p-8 overflow-y-auto space-y-6 print:p-0 print:m-0" id="printable-payslip">
              {/* Company Header */}
              <div className="flex items-start justify-between border-b border-gray-200 pb-5">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-600 text-white font-black text-sm flex items-center justify-center shadow-xs">
                    {selectedPayslip.companyLogo}
                  </div>
                  <div>
                    <h2 className="text-lg font-black text-gray-900 tracking-tight">
                      {selectedPayslip.companyName}
                    </h2>
                    <p className="text-[11px] text-gray-500 max-w-xs leading-relaxed">
                      {selectedPayslip.companyAddress}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
                    Official Salary Payslip
                  </span>
                  <p className="text-sm font-bold text-gray-900 mt-0.5">
                    {selectedPayslip.month} {selectedPayslip.year}
                  </p>
                  <p className="text-[10.5px] text-gray-400">
                    Generated on {selectedPayslip.generatedDate}
                  </p>
                </div>
              </div>

              {/* Employee & Bank Info Matrix */}
              <div className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-gray-50 border border-gray-100 text-[11.5px]">
                <div className="space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-gray-500 font-medium">Employee Name:</span>
                    <span className="font-bold text-gray-900">{selectedPayslip.employeeName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500 font-medium">Employee Code:</span>
                    <span className="font-mono font-bold text-gray-900">
                      {selectedPayslip.employeeCode}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500 font-medium">Department:</span>
                    <span className="font-semibold text-gray-800">{selectedPayslip.department}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500 font-medium">Designation:</span>
                    <span className="font-semibold text-gray-800">{selectedPayslip.designation}</span>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-gray-500 font-medium">Working Days:</span>
                    <span className="font-mono font-bold text-gray-900">
                      {selectedPayslip.workingDays}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500 font-medium">Paid Days:</span>
                    <span className="font-mono font-bold text-emerald-700">
                      {selectedPayslip.paidDays}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500 font-medium">Loss of Pay (LOP):</span>
                    <span className="font-mono font-bold text-rose-600">
                      {selectedPayslip.leaveWithoutPay} Days
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500 font-medium">Bank Details:</span>
                    <span className="font-semibold text-gray-800">
                      {selectedPayslip.bankName} ({selectedPayslip.accountNumber})
                    </span>
                  </div>
                </div>
              </div>

              {/* Earnings vs Deductions Table */}
              <div className="border border-gray-200 rounded-xl overflow-hidden">
                <table className="w-full text-xs">
                  <thead className="bg-slate-100 text-gray-700 font-bold border-b border-gray-200">
                    <tr>
                      <th className="px-4 py-2.5 text-left w-1/2">Earnings (Credits)</th>
                      <th className="px-4 py-2.5 text-right">Amount ($)</th>
                      <th className="px-4 py-2.5 text-left w-1/2 border-l border-gray-200">
                        Deductions (Debits)
                      </th>
                      <th className="px-4 py-2.5 text-right">Amount ($)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-[11.5px]">
                    <tr>
                      <td className="px-4 py-2 text-gray-600">Basic Monthly Salary</td>
                      <td className="px-4 py-2 text-right font-mono">
                        ${selectedPayslip.basicSalary.toLocaleString()}
                      </td>
                      <td className="px-4 py-2 text-gray-600 border-l border-gray-200">
                        Provident Fund (PF)
                      </td>
                      <td className="px-4 py-2 text-right font-mono text-rose-600">
                        ${selectedPayslip.pfDeduction.toLocaleString()}
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2 text-gray-600">House Rent Allowance (HRA)</td>
                      <td className="px-4 py-2 text-right font-mono">
                        ${selectedPayslip.hra.toLocaleString()}
                      </td>
                      <td className="px-4 py-2 text-gray-600 border-l border-gray-200">
                        Income Tax Deduction (TDS)
                      </td>
                      <td className="px-4 py-2 text-right font-mono text-rose-600">
                        ${selectedPayslip.taxDeduction.toLocaleString()}
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2 text-gray-600">Special Allowance</td>
                      <td className="px-4 py-2 text-right font-mono">
                        ${selectedPayslip.specialAllowance.toLocaleString()}
                      </td>
                      <td className="px-4 py-2 text-gray-600 border-l border-gray-200">
                        Medical Insurance
                      </td>
                      <td className="px-4 py-2 text-right font-mono text-rose-600">
                        ${selectedPayslip.insuranceDeduction.toLocaleString()}
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2 text-gray-600">Bonus & Incentives</td>
                      <td className="px-4 py-2 text-right font-mono text-emerald-600">
                        +${(selectedPayslip.bonus + selectedPayslip.incentives).toLocaleString()}
                      </td>
                      <td className="px-4 py-2 text-gray-600 border-l border-gray-200">
                        Unpaid Leave / LOP
                      </td>
                      <td className="px-4 py-2 text-right font-mono text-rose-600">
                        ${selectedPayslip.lopDeduction.toLocaleString()}
                      </td>
                    </tr>
                    <tr className="bg-slate-50 font-bold border-t border-gray-200">
                      <td className="px-4 py-2.5 text-gray-900">Total Gross Earnings</td>
                      <td className="px-4 py-2.5 text-right font-mono text-gray-900">
                        ${selectedPayslip.grossSalary.toLocaleString()}
                      </td>
                      <td className="px-4 py-2.5 text-gray-900 border-l border-gray-200">
                        Total Deductions
                      </td>
                      <td className="px-4 py-2.5 text-right font-mono text-rose-700">
                        ${selectedPayslip.totalDeductions.toLocaleString()}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Net Salary Summary Block */}
              <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200 flex items-center justify-between">
                <div>
                  <p className="text-[11px] font-bold text-blue-900 uppercase tracking-wider">
                    Net Take-Home Salary
                  </p>
                  <p className="text-xs text-blue-800 italic mt-0.5">
                    {selectedPayslip.netSalaryWords}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-black text-blue-900 font-mono">
                    ${selectedPayslip.netSalary.toLocaleString()}
                  </span>
                  <span className="text-[10px] text-blue-700 block font-semibold">USD</span>
                </div>
              </div>

              {/* Signatures & Stamp */}
              <div className="pt-6 border-t border-gray-200 flex justify-between items-end text-[11px] text-gray-500">
                <div>
                  <p className="font-semibold text-gray-800">
                    Authorized Signatory — {selectedPayslip.companyName}
                  </p>
                  <p className="text-[10px] text-gray-400">
                    This is an electronically generated and authenticated document.
                  </p>
                </div>
                <div className="w-24 h-10 border border-dashed border-gray-300 rounded flex items-center justify-center text-[10px] text-gray-400 font-mono">
                  [DIGITAL STAMP]
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5. EDIT SALARY STRUCTURE MODAL */}
      {isEditSalaryModalOpen && editingEmployee && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 w-full max-w-lg overflow-hidden text-xs">
            <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-slate-50/60">
              <h3 className="text-base font-bold text-gray-900">
                Edit Salary: {editingEmployee.name}
              </h3>
              <button
                type="button"
                onClick={() => setIsEditSalaryModalOpen(false)}
                className="w-7 h-7 rounded-md bg-gray-100 hover:bg-gray-200 text-gray-500 flex items-center justify-center cursor-pointer"
              >
                <CloseIcon className="w-3.5 h-3.5" size={14} />
              </button>
            </div>

            <form onSubmit={handleSaveSalary} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Basic Salary ($)</label>
                  <input
                    type="number"
                    value={salaryForm.basicSalary}
                    onChange={(e) => setSalaryForm({ ...salaryForm, basicSalary: Number(e.target.value) })}
                    className="w-full rounded-md border border-gray-200 p-2 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">HRA ($)</label>
                  <input
                    type="number"
                    value={salaryForm.hra}
                    onChange={(e) => setSalaryForm({ ...salaryForm, hra: Number(e.target.value) })}
                    className="w-full rounded-md border border-gray-200 p-2 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Standard Allowances ($)</label>
                  <input
                    type="number"
                    value={salaryForm.allowances}
                    onChange={(e) => setSalaryForm({ ...salaryForm, allowances: Number(e.target.value) })}
                    className="w-full rounded-md border border-gray-200 p-2 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Special Allowance ($)</label>
                  <input
                    type="number"
                    value={salaryForm.specialAllowance}
                    onChange={(e) => setSalaryForm({ ...salaryForm, specialAllowance: Number(e.target.value) })}
                    className="w-full rounded-md border border-gray-200 p-2 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">PF Deduction ($)</label>
                  <input
                    type="number"
                    value={salaryForm.pf}
                    onChange={(e) => setSalaryForm({ ...salaryForm, pf: Number(e.target.value) })}
                    className="w-full rounded-md border border-gray-200 p-2 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Estimated Tax ($)</label>
                  <input
                    type="number"
                    value={salaryForm.tax}
                    onChange={(e) => setSalaryForm({ ...salaryForm, tax: Number(e.target.value) })}
                    className="w-full rounded-md border border-gray-200 p-2 font-mono"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-gray-100 flex justify-between items-center">
                <button
                  type="button"
                  onClick={() => setIsEditSalaryModalOpen(false)}
                  className="px-3.5 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-xs cursor-pointer"
                >
                  Save Compensation Structure
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

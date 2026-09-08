"use client";

import { useState } from "react";
import { useTenant } from "@/context/TenantContext";
import { TeamMemberTimesheet, DayHourDetail } from "@/lib/types";
import { CloseIcon, TimeTrackerIcon } from "@/components/SidebarIcons";

export default function TimesheetVerificationPage() {
  const {
    teamTimesheets,
    verifyTeamTimesheet,
    submitTeamTimesheetsToHR,
    showToast,
  } = useTenant();

  const [periodType, setPeriodType] = useState<"WEEKLY" | "BIWEEKLY">("WEEKLY");
  const [selectedWeekId] = useState("2026-W36");
  const [selectedMemberDetail, setSelectedMemberDetail] = useState<TeamMemberTimesheet | null>(null);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [confirmCertified, setConfirmCertified] = useState(false);

  // Active period timesheets
  const currentTimesheets = teamTimesheets.filter((t) => t.weekId === selectedWeekId);

  // Calculations
  const totalRegular = currentTimesheets.reduce((acc, t) => acc + t.regularHours, 0);
  const totalOvertime = currentTimesheets.reduce((acc, t) => acc + t.overtimeHours, 0);
  const totalHours = totalRegular + totalOvertime;
  const verifiedCount = currentTimesheets.filter((t) => t.status === "Verified" || t.status === "SubmittedToHR").length;
  const isAllSubmitted = currentTimesheets.length > 0 && currentTimesheets.every((t) => t.status === "SubmittedToHR");
  const discrepancyCount = currentTimesheets.filter((t) => t.hasDiscrepancy).length;

  const handleVerifySingle = (id: string, name: string) => {
    verifyTeamTimesheet(id);
    showToast(`Verified logged hours for ${name}.`);
  };

  const handleOpenSubmitModal = () => {
    if (discrepancyCount > 0) {
      showToast(`Warning: ${discrepancyCount} timesheet(s) have unresolved punch discrepancies. Please inspect before submitting.`, "error");
    }
    setIsSubmitModalOpen(true);
  };

  const handleConfirmSubmitToHR = (e: React.FormEvent) => {
    e.preventDefault();
    submitTeamTimesheetsToHR(selectedWeekId);
    setIsSubmitModalOpen(false);
    setConfirmCertified(false);
  };

  const handleExportCSV = () => {
    const headers = "Employee ID,Name,Designation,Regular Hours,Overtime Hours,Total Hours,Status\n";
    const rows = currentTimesheets
      .map(
        (t) =>
          `"${t.employeeId}","${t.employeeName}","${t.designation}",${t.regularHours},${t.overtimeHours},${t.totalHours},"${t.status}"`
      )
      .join("\n");

    const blob = new Blob([headers + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Timesheet_Verification_${selectedWeekId}.csv`;
    link.click();
    showToast("Exported Timesheet Verification report.");
  };

  return (
    <div className="space-y-6 pb-16 font-sans">
      {/* 1. Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-200/90 shadow-xs">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-[11px] font-bold text-amber-700 bg-amber-50 border border-amber-200/60 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              Payroll Preparation Desk
            </span>
            {isAllSubmitted ? (
              <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                ✓ Submitted to HR Payroll
              </span>
            ) : (
              <span className="text-[11px] font-bold text-blue-800 bg-blue-100 px-2.5 py-0.5 rounded-full">
                Verification in Progress
              </span>
            )}
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mt-2 tracking-tight">
            Timesheet Verification
          </h1>
          <p className="text-gray-500 text-xs mt-0.5 max-w-2xl">
            Review and submit accurate weekly or bi-weekly hours logged by your engineering team to HR for final payroll calculation and disbursement.
          </p>
        </div>

        <div className="flex items-center space-x-2.5 shrink-0">
          <button
            type="button"
            onClick={handleExportCSV}
            className="px-3.5 py-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 text-xs font-semibold rounded-lg shadow-xs transition cursor-pointer"
          >
            Export Timesheet CSV
          </button>
          <button
            type="button"
            disabled={isAllSubmitted}
            onClick={handleOpenSubmitModal}
            className={`inline-flex items-center px-4 py-2 font-bold text-xs rounded-lg shadow-sm transition cursor-pointer ${
              isAllSubmitted
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-emerald-600 hover:bg-emerald-700 text-white active:scale-95"
            }`}
          >
            <TimeTrackerIcon className="w-3.5 h-3.5 mr-1.5 text-white" size={14} />
            {isAllSubmitted ? "Submitted to HR" : "Verify & Submit to HR"}
          </button>
        </div>
      </div>

      {/* 2. Period Navigation Bar */}
      <div className="bg-white p-4 rounded-xl border border-gray-200/90 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center space-x-2">
          <span className="text-xs font-semibold text-gray-500">Period Frequency:</span>
          <div className="bg-gray-100 p-0.5 rounded-lg flex items-center text-xs">
            <button
              type="button"
              onClick={() => setPeriodType("WEEKLY")}
              className={`px-3 py-1 rounded-md font-semibold transition cursor-pointer ${
                periodType === "WEEKLY"
                  ? "bg-white text-gray-900 shadow-xs"
                  : "text-gray-500 hover:text-gray-800"
              }`}
            >
              Weekly (Mon - Sun)
            </button>
            <button
              type="button"
              onClick={() => setPeriodType("BIWEEKLY")}
              className={`px-3 py-1 rounded-md font-semibold transition cursor-pointer ${
                periodType === "BIWEEKLY"
                  ? "bg-white text-gray-900 shadow-xs"
                  : "text-gray-500 hover:text-gray-800"
              }`}
            >
              Bi-Weekly (14 Days)
            </button>
          </div>
        </div>

        <div className="flex items-center space-x-3 text-xs">
          <button
            type="button"
            onClick={() => showToast("Showing previous cycle records (read-only audit).", "info")}
            className="px-2.5 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 text-gray-600 font-medium cursor-pointer"
          >
            ← Previous Period
          </button>
          <div className="flex items-center space-x-2 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-200">
            <span className="font-bold text-gray-900">Current Cycle:</span>
            <span className="text-gray-600 font-semibold">Sep 01 - Sep 07, 2026 (Week 36)</span>
          </div>
          <button
            type="button"
            onClick={() => showToast("Next cycle has not commenced yet.", "info")}
            className="px-2.5 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 text-gray-400 font-medium cursor-not-allowed"
          >
            Next Period →
          </button>
        </div>
      </div>

      {/* 3. KPI Header Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-gray-200/90 shadow-xs space-y-1">
          <p className="text-xs text-gray-500 font-medium">Total Team Logged Hours</p>
          <p className="text-2xl font-extrabold text-gray-900">{totalHours.toFixed(1)} hrs</p>
          <span className="text-[11px] text-gray-400 font-medium">Regular: {totalRegular.toFixed(1)} hrs</span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gray-200/90 shadow-xs space-y-1">
          <p className="text-xs text-gray-500 font-medium">Approved Overtime</p>
          <p className="text-2xl font-extrabold text-amber-600">{totalOvertime.toFixed(1)} hrs</p>
          <span className="text-[11px] text-amber-700 font-medium">Calculated for payroll bonus</span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gray-200/90 shadow-xs space-y-1">
          <p className="text-xs text-gray-500 font-medium">Verification Status</p>
          <p className="text-2xl font-extrabold text-emerald-600">
            {verifiedCount} / {currentTimesheets.length}
          </p>
          <span className="text-[11px] text-emerald-700 font-medium">
            {Math.round((verifiedCount / Math.max(1, currentTimesheets.length)) * 100)}% verified by TL
          </span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gray-200/90 shadow-xs space-y-1">
          <p className="text-xs text-gray-500 font-medium">HR Payroll Status</p>
          <p className={`text-2xl font-extrabold ${isAllSubmitted ? "text-emerald-600" : "text-amber-600"}`}>
            {isAllSubmitted ? "Submitted" : "Pending Submit"}
          </p>
          <span className="text-[11px] text-gray-400 font-medium">
            {isAllSubmitted ? "Locked for processing" : "Requires TL final sign-off"}
          </span>
        </div>
      </div>

      {/* 4. Detailed Timesheet Grid */}
      <div className="bg-white rounded-2xl border border-gray-200/90 shadow-xs overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-gray-900 tracking-tight">
              Weekly Team Timesheet Matrix
            </h2>
            <p className="text-[11px] text-gray-400 mt-0.5">
              Day-by-day punch breakdown for Sep 01 - Sep 07, 2026
            </p>
          </div>
          {discrepancyCount > 0 && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800">
              ⚠️ {discrepancyCount} Flagged Discrepancy
            </span>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/60 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
                <th className="py-3 px-4">Employee</th>
                <th className="py-3 px-2 text-center">Tue<br /><span className="font-normal text-[10px]">Sep 1</span></th>
                <th className="py-3 px-2 text-center">Wed<br /><span className="font-normal text-[10px]">Sep 2</span></th>
                <th className="py-3 px-2 text-center">Thu<br /><span className="font-normal text-[10px]">Sep 3</span></th>
                <th className="py-3 px-2 text-center">Fri<br /><span className="font-normal text-[10px]">Sep 4</span></th>
                <th className="py-3 px-2 text-center">Sat<br /><span className="font-normal text-[10px]">Sep 5</span></th>
                <th className="py-3 px-2 text-center">Sun<br /><span className="font-normal text-[10px]">Sep 6</span></th>
                <th className="py-3 px-2 text-center">Mon<br /><span className="font-normal text-[10px]">Sep 7</span></th>
                <th className="py-3 px-3 text-right">Regular</th>
                <th className="py-3 px-3 text-right">OT</th>
                <th className="py-3 px-3 text-right">Total</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-xs">
              {currentTimesheets.map((sheet) => {
                return (
                  <tr
                    key={sheet.id}
                    className={`hover:bg-gray-50/70 transition-colors ${
                      sheet.hasDiscrepancy ? "bg-amber-50/20" : ""
                    }`}
                  >
                    {/* Employee */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center space-x-2.5">
                        <div className="w-8 h-8 rounded-lg bg-slate-800 text-white font-bold flex items-center justify-center text-xs shrink-0">
                          {sheet.employeeAvatar || "EM"}
                        </div>
                        <div>
                          <p className="font-bold text-gray-900 leading-tight">
                            {sheet.employeeName}
                          </p>
                          <p className="text-[11px] text-gray-400 mt-0.5">
                            {sheet.designation}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Daily Hours Pills (Tue - Mon) */}
                    {sheet.dailyHours.map((day, idx) => (
                      <td key={idx} className="py-3.5 px-2 text-center">
                        {day.status === "Weekend" ? (
                          <span className="inline-block px-2 py-0.5 rounded text-[10px] font-medium bg-gray-100 text-gray-400">
                            Off
                          </span>
                        ) : day.status === "Leave" ? (
                          <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-100 text-indigo-700">
                            PTO
                          </span>
                        ) : (
                          <span
                            className={`inline-block px-2 py-0.5 rounded text-[11px] font-bold ${
                              day.status === "Overtime"
                                ? "bg-amber-100 text-amber-800"
                                : "bg-emerald-50 text-emerald-800"
                            }`}
                            title={`In: ${day.checkIn || "--"} | Out: ${day.checkOut || "--"}`}
                          >
                            {day.hours.toFixed(1)}h
                          </span>
                        )}
                      </td>
                    ))}

                    {/* Hours Summary */}
                    <td className="py-3.5 px-3 text-right font-semibold text-gray-700">
                      {sheet.regularHours.toFixed(1)}h
                    </td>
                    <td className="py-3.5 px-3 text-right font-semibold text-amber-700">
                      {sheet.overtimeHours > 0 ? `+${sheet.overtimeHours.toFixed(1)}h` : "0.0h"}
                    </td>
                    <td className="py-3.5 px-3 text-right font-extrabold text-gray-900">
                      {sheet.totalHours.toFixed(1)}h
                    </td>

                    {/* Status Badge */}
                    <td className="py-3.5 px-4">
                      {sheet.status === "SubmittedToHR" ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10.5px] font-bold bg-purple-100 text-purple-800">
                          Locked (Submitted)
                        </span>
                      ) : sheet.status === "Verified" ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10.5px] font-bold bg-emerald-100 text-emerald-800">
                          ✓ Verified
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10.5px] font-bold bg-amber-100 text-amber-800">
                          Pending Review
                        </span>
                      )}
                      {sheet.hasDiscrepancy && (
                        <p className="text-[10px] text-amber-700 font-semibold mt-1">
                          ⚠️ {sheet.discrepancyNote || "Discrepancy"}
                        </p>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right whitespace-nowrap space-x-1.5">
                      <button
                        type="button"
                        onClick={() => setSelectedMemberDetail(sheet)}
                        className="px-2.5 py-1 text-xs font-semibold rounded-md border border-gray-200 hover:bg-gray-100 text-gray-700 transition cursor-pointer"
                        title="Inspect daily punches"
                      >
                        Inspect
                      </button>
                      {sheet.status === "Draft" && (
                        <button
                          type="button"
                          onClick={() => handleVerifySingle(sheet.id, sheet.employeeName)}
                          className="px-2.5 py-1 text-xs font-bold rounded-md bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 transition cursor-pointer"
                        >
                          Verify
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* 5. Detailed Punch Breakdown Drawer / Modal */}
      {selectedMemberDetail && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 backdrop-blur-[1px] animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-gray-200 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-slate-800 text-white font-bold flex items-center justify-center text-sm">
                  {selectedMemberDetail.employeeAvatar || "EM"}
                </div>
                <div>
                  <h3 className="text-base font-bold text-gray-900 tracking-tight">
                    {selectedMemberDetail.employeeName}
                  </h3>
                  <p className="text-xs text-gray-500">
                    {selectedMemberDetail.designation} • Week 36 Breakdown
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedMemberDetail(null)}
                className="w-7 h-7 rounded-md bg-gray-100 hover:bg-gray-200 text-gray-500 flex items-center justify-center cursor-pointer"
              >
                <CloseIcon className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="py-4 space-y-2 text-xs">
              <div className="p-3 bg-gray-50 rounded-lg border border-gray-200/80 flex items-center justify-between">
                <div>
                  <span className="text-gray-500">Total Hours Logged:</span>
                  <span className="font-extrabold text-gray-900 ml-1.5">
                    {selectedMemberDetail.totalHours.toFixed(1)} hrs
                  </span>
                </div>
                <div>
                  <span className="text-gray-500">Regular:</span>
                  <span className="font-bold text-gray-800 ml-1">
                    {selectedMemberDetail.regularHours.toFixed(1)}h
                  </span>
                  <span className="text-gray-400 mx-1">|</span>
                  <span className="text-gray-500">OT:</span>
                  <span className="font-bold text-amber-700 ml-1">
                    {selectedMemberDetail.overtimeHours.toFixed(1)}h
                  </span>
                </div>
              </div>

              <h4 className="font-bold text-gray-800 pt-2">Daily Time Log Entries</h4>
              <div className="divide-y divide-gray-100 border border-gray-100 rounded-lg overflow-hidden">
                {selectedMemberDetail.dailyHours.map((day, idx) => (
                  <div key={idx} className="p-2.5 flex items-center justify-between hover:bg-gray-50">
                    <div>
                      <span className="font-bold text-gray-800 w-12 inline-block">
                        {day.dayOfWeek}
                      </span>
                      <span className="text-gray-500">{day.date}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      {day.checkIn && (
                        <span className="text-gray-600 text-[11px]">
                          {day.checkIn} - {day.checkOut || "No Punch-Out"}
                        </span>
                      )}
                      <span
                        className={`font-bold px-2 py-0.5 rounded text-[11px] ${
                          day.status === "Overtime"
                            ? "bg-amber-100 text-amber-800"
                            : day.status === "Leave"
                            ? "bg-indigo-100 text-indigo-800"
                            : day.status === "Weekend"
                            ? "bg-gray-100 text-gray-400"
                            : "bg-emerald-50 text-emerald-800"
                        }`}
                      >
                        {day.status === "Weekend" ? "Weekend" : `${day.hours.toFixed(1)} hrs`}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-end space-x-2 pt-3 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setSelectedMemberDetail(null)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-lg text-xs transition cursor-pointer"
              >
                Close
              </button>
              {selectedMemberDetail.status === "Draft" && (
                <button
                  type="button"
                  onClick={() => {
                    handleVerifySingle(selectedMemberDetail.id, selectedMemberDetail.employeeName);
                    setSelectedMemberDetail(null);
                  }}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-xs shadow-sm transition cursor-pointer"
                >
                  Verify Timesheet
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 6. Verify & Submit to HR Modal */}
      {isSubmitModalOpen && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 backdrop-blur-[1px] animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-200 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <h3 className="text-base font-bold text-gray-900 tracking-tight">
                Submit Team Timesheets to HR
              </h3>
              <button
                onClick={() => setIsSubmitModalOpen(false)}
                className="w-7 h-7 rounded-md bg-gray-100 hover:bg-gray-200 text-gray-500 flex items-center justify-center cursor-pointer"
              >
                <CloseIcon className="w-3.5 h-3.5" />
              </button>
            </div>

            <form onSubmit={handleConfirmSubmitToHR} className="space-y-4 pt-4 text-xs">
              <div className="p-3.5 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-900 space-y-1">
                <p className="font-bold text-sm">Week 36 Submission Summary</p>
                <p className="text-[11.5px] leading-relaxed">
                  You are submitting logged hours for <span className="font-bold">{currentTimesheets.length} direct reports</span> ({totalHours.toFixed(1)} Total Hours, {totalOvertime.toFixed(1)} OT Hours).
                </p>
              </div>

              <div className="p-3 bg-amber-50 rounded-lg border border-amber-200/70 text-amber-900 text-[11.5px] leading-relaxed">
                ⚠️ Once submitted, timesheets will be locked for the current cycle. HR Payroll administrators will use these approved figures for monthly salary calculation.
              </div>

              <label className="flex items-start space-x-2.5 pt-1 cursor-pointer select-none">
                <input
                  type="checkbox"
                  required
                  checked={confirmCertified}
                  onChange={(e) => setConfirmCertified(e.target.checked)}
                  className="w-4 h-4 rounded text-emerald-600 border-gray-300 focus:ring-emerald-500 mt-0.5"
                />
                <span className="text-gray-700 leading-relaxed">
                  I certify that the recorded shift entries, overtime hours, and attendance regularizations have been verified by me as Team Lead.
                </span>
              </label>

              <div className="flex items-center justify-end space-x-2 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsSubmitModalOpen(false)}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-lg transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!confirmCertified}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold rounded-lg shadow-sm transition cursor-pointer"
                >
                  Confirm & Submit to HR
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ReportsPage() {
  const reports = [
    { name: "Monthly Workforce Headcount & Turnover Analysis", category: "Human Capital", generated: "Sep 1, 2026", format: "PDF / XLSX" },
    { name: "Overtime & Utilization Summary Q3", category: "Timesheets", generated: "Aug 31, 2026", format: "PDF / CSV" },
    { name: "Leave & Absenteeism Trend Report", category: "Attendance", generated: "Aug 28, 2026", format: "PDF" },
    { name: "Gross vs Net Payroll Expenditure Statement", category: "Finance", generated: "Aug 25, 2026", format: "XLSX" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-xl border border-gray-200/80 shadow-xs">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Reports & Analytics</h1>
          <p className="text-gray-500 text-xs mt-0.5">Download executive summaries, headcount metrics, and compliance exports.</p>
        </div>
        <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-md shadow-xs transition">
          Generate Custom Report
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200/80 overflow-hidden shadow-xs">
        <div className="p-4 border-b border-gray-100">
          <h2 className="text-xs font-bold text-gray-900 uppercase tracking-wide">Standard Reports</h2>
        </div>
        <div className="divide-y divide-gray-100">
          {reports.map((r, idx) => (
            <div key={idx} className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-gray-50/60 transition text-xs">
              <div>
                <h3 className="font-semibold text-gray-900">{r.name}</h3>
                <p className="text-[11px] text-gray-400 mt-0.5">Category: {r.category} • Generated: {r.generated} • Formats: {r.format}</p>
              </div>
              <button className="text-xs font-medium text-gray-700 hover:text-gray-900 px-3 py-1.5 border border-gray-200 rounded-md hover:bg-gray-50 transition">
                Download
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function TimeTrackerPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-xl border border-gray-200/80 shadow-xs">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Time Tracker & Timesheets</h1>
          <p className="text-gray-500 text-xs mt-0.5">Review project-based hours logged, client billable ratio, and overtime approvals.</p>
        </div>
        <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-md shadow-xs transition">
          + Add Time Entry
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-xl border border-gray-200/80 shadow-xs space-y-1">
          <p className="text-xs text-gray-500 font-medium">Hours Logged (Week)</p>
          <p className="text-2xl font-bold text-gray-900">4,912 hrs</p>
          <span className="text-[11px] text-gray-400">Avg 38.6 hrs / employee</span>
        </div>
        <div className="bg-white p-5 rounded-xl border border-gray-200/80 shadow-xs space-y-1">
          <p className="text-xs text-gray-500 font-medium">Billable Ratio</p>
          <p className="text-2xl font-bold text-gray-900">87.4%</p>
          <span className="text-[11px] text-gray-400">+3.2% from last week</span>
        </div>
        <div className="bg-white p-5 rounded-xl border border-gray-200/80 shadow-xs space-y-1">
          <p className="text-xs text-gray-500 font-medium">Pending Timesheets</p>
          <p className="text-2xl font-bold text-gray-900">11</p>
          <span className="text-[11px] text-gray-400">Awaiting Lead approval</span>
        </div>
      </div>
    </div>
  );
}

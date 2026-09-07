export default function OperationsPage() {
  const operations = [
    { title: "Automated Payroll Sync", status: "Operational", lastRun: "Today, 06:00 AM", interval: "Daily" },
    { title: "Biometric Punch Device Sync", status: "Operational", lastRun: "10 mins ago", interval: "Every 15m" },
    { title: "Slack / Teams Notification Dispatcher", status: "Operational", lastRun: "2 mins ago", interval: "Realtime" },
    { title: "Tax Bracket & Compliance Audit", status: "Scheduled", lastRun: "Sep 1, 2026", interval: "Monthly" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-xl border border-gray-200/80 shadow-xs">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Operations & System Pipelines</h1>
          <p className="text-gray-500 text-xs mt-0.5">Real-time background sync pipelines, integration bridges, and scheduled routines.</p>
        </div>
        <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-md shadow-xs transition">
          Trigger Sync Cycle
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200/80 overflow-hidden shadow-xs">
        <div className="p-4 border-b border-gray-100">
          <h2 className="text-xs font-bold text-gray-900 uppercase tracking-wide">Background Runners</h2>
        </div>
        <div className="divide-y divide-gray-100">
          {operations.map((op, idx) => (
            <div key={idx} className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-gray-50/60 transition text-xs">
              <div>
                <h3 className="font-semibold text-gray-900">{op.title}</h3>
                <p className="text-[11px] text-gray-400 mt-0.5">Frequency: {op.interval} • Last run: {op.lastRun}</p>
              </div>
              <div className="flex items-center space-x-3">
                <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-gray-100 text-gray-700 border border-gray-200/60">
                  {op.status}
                </span>
                <button className="text-xs text-gray-700 hover:text-gray-900 font-medium px-3 py-1.5 border border-gray-200 rounded-md hover:bg-gray-50 transition">
                  Run
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

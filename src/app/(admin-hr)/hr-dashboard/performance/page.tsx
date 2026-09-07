export default function PerformancePage() {
  const reviews = [
    { employee: "Sarah Jenkins", role: "Product Designer", cycle: "Q3 2026 Review", score: "4.8 / 5.0", status: "Completed" },
    { employee: "David Chen", role: "Senior Fullstack Engineer", cycle: "Q3 2026 Review", score: "4.9 / 5.0", status: "Completed" },
    { employee: "Elena Rostova", role: "Product Manager", cycle: "Mid-Year Review", score: "Pending", status: "Self-Review Due" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-xl border border-gray-200/80 shadow-xs">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Performance & Appraisal</h1>
          <p className="text-gray-500 text-xs mt-0.5">360-degree feedback reviews, KPI goal tracking, and promotion recommendations.</p>
        </div>
        <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-md shadow-xs transition">
          + Launch Appraisal Cycle
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-xl border border-gray-200/80 shadow-xs space-y-1">
          <p className="text-xs text-gray-500 font-medium">Avg Organization Score</p>
          <p className="text-2xl font-bold text-gray-900">4.65 / 5.0</p>
          <span className="text-[11px] text-gray-400">Top 10% benchmark</span>
        </div>
        <div className="bg-white p-5 rounded-xl border border-gray-200/80 shadow-xs space-y-1">
          <p className="text-xs text-gray-500 font-medium">Completed Reviews</p>
          <p className="text-2xl font-bold text-gray-900">118 / 142</p>
          <span className="text-[11px] text-gray-400">83% completion rate</span>
        </div>
        <div className="bg-white p-5 rounded-xl border border-gray-200/80 shadow-xs space-y-1">
          <p className="text-xs text-gray-500 font-medium">Eligible for Increment</p>
          <p className="text-2xl font-bold text-gray-900">29</p>
          <span className="text-[11px] text-gray-400">High performers</span>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200/80 overflow-hidden shadow-xs">
        <div className="p-4 border-b border-gray-100">
          <h2 className="text-xs font-bold text-gray-900 uppercase tracking-wide">Active Cycle</h2>
        </div>
        <div className="divide-y divide-gray-100">
          {reviews.map((r, i) => (
            <div key={i} className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-gray-50/60 transition text-xs">
              <div>
                <h3 className="font-semibold text-gray-900">{r.employee}</h3>
                <p className="text-[11px] text-gray-400">{r.role} • {r.cycle}</p>
              </div>
              <div className="flex items-center space-x-3">
                <span className="font-mono text-gray-700 font-medium">{r.score}</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-gray-100 text-gray-700 border border-gray-200/60">
                  {r.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

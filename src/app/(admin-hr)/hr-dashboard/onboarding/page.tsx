export default function OnboardingPage() {
  const candidates = [
    { name: "Michael Vance", role: "Frontend Developer", stage: "Document Verification", progress: 80, startDate: "Sep 15, 2026" },
    { name: "Elena Rostova", role: "Product Manager", stage: "Equipment Provisioning", progress: 60, startDate: "Sep 18, 2026" },
    { name: "Liam O'Connor", role: "QA Engineer", stage: "Contract Signing", progress: 30, startDate: "Oct 1, 2026" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-xl border border-gray-200/80 shadow-xs">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Employee Onboarding</h1>
          <p className="text-gray-500 text-xs mt-0.5">Track candidate onboarding workflows and document provisioning.</p>
        </div>
        <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-md shadow-xs transition">
          + Start Onboarding
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-xl border border-gray-200/80 shadow-xs space-y-1">
          <p className="text-xs text-gray-500 font-medium">Active In Pipeline</p>
          <p className="text-2xl font-bold text-gray-900">7</p>
          <span className="text-[11px] text-gray-400">3 joining this month</span>
        </div>
        <div className="bg-white p-5 rounded-xl border border-gray-200/80 shadow-xs space-y-1">
          <p className="text-xs text-gray-500 font-medium">Pending Verifications</p>
          <p className="text-2xl font-bold text-gray-900">4</p>
          <span className="text-[11px] text-gray-400">Requires HR review</span>
        </div>
        <div className="bg-white p-5 rounded-xl border border-gray-200/80 shadow-xs space-y-1">
          <p className="text-xs text-gray-500 font-medium">Avg Cycle Duration</p>
          <p className="text-2xl font-bold text-gray-900">4.2 Days</p>
          <span className="text-[11px] text-gray-400">Within target SLA</span>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200/80 overflow-hidden shadow-xs">
        <div className="p-4 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-xs font-bold text-gray-900 uppercase tracking-wide">Candidate Pipeline</h2>
        </div>
        <div className="divide-y divide-gray-100">
          {candidates.map((c, i) => (
            <div key={i} className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-gray-50/60 transition">
              <div>
                <h3 className="font-semibold text-gray-900 text-xs">{c.name}</h3>
                <p className="text-[11px] text-gray-400">{c.role} • Starting {c.startDate}</p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-36">
                  <div className="flex justify-between text-[11px] text-gray-600 mb-1">
                    <span>{c.stage}</span>
                    <span>{c.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-gray-700 h-1.5 rounded-full" style={{ width: `${c.progress}%` }} />
                  </div>
                </div>
                <button className="text-xs text-gray-700 hover:text-gray-900 font-medium px-3 py-1.5 border border-gray-200 rounded-md hover:bg-gray-50 transition">
                  Manage
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

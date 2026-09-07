export default function EngagementPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-xl border border-gray-200/80 shadow-xs">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Employee Engagement</h1>
          <p className="text-gray-500 text-xs mt-0.5">Pulse surveys, team recognition kudos, and organizational wellness.</p>
        </div>
        <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-md shadow-xs transition">
          + Launch Pulse Survey
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-xl border border-gray-200/80 shadow-xs space-y-1">
          <p className="text-xs text-gray-500 font-medium">eNPS Score</p>
          <p className="text-2xl font-bold text-gray-900">+68</p>
          <span className="text-[11px] text-gray-400">High satisfaction</span>
        </div>
        <div className="bg-white p-5 rounded-xl border border-gray-200/80 shadow-xs space-y-1">
          <p className="text-xs text-gray-500 font-medium">Kudos Given (Month)</p>
          <p className="text-2xl font-bold text-gray-900">342</p>
          <span className="text-[11px] text-gray-400">Peer recognitions</span>
        </div>
        <div className="bg-white p-5 rounded-xl border border-gray-200/80 shadow-xs space-y-1">
          <p className="text-xs text-gray-500 font-medium">Participation Rate</p>
          <p className="text-2xl font-bold text-gray-900">91.4%</p>
          <span className="text-[11px] text-gray-400">130 respondents</span>
        </div>
      </div>
    </div>
  );
}

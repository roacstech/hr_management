export default function TravelPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-xl border border-gray-200/80 shadow-xs">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Corporate Travel</h1>
          <p className="text-gray-500 text-xs mt-0.5">Manage business travel requests, flight bookings, and hotel expense approvals.</p>
        </div>
        <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-md shadow-xs transition">
          + New Travel Request
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-xl border border-gray-200/80 shadow-xs space-y-1">
          <p className="text-xs text-gray-500 font-medium">Active Trips</p>
          <p className="text-2xl font-bold text-gray-900">4</p>
          <span className="text-[11px] text-gray-400">London & New York hubs</span>
        </div>
        <div className="bg-white p-5 rounded-xl border border-gray-200/80 shadow-xs space-y-1">
          <p className="text-xs text-gray-500 font-medium">Pending Approvals</p>
          <p className="text-2xl font-bold text-gray-900">2</p>
          <span className="text-[11px] text-gray-400">Awaiting Finance signoff</span>
        </div>
        <div className="bg-white p-5 rounded-xl border border-gray-200/80 shadow-xs space-y-1">
          <p className="text-xs text-gray-500 font-medium">Q3 Budget Spent</p>
          <p className="text-2xl font-bold text-gray-900">$14,820</p>
          <span className="text-[11px] text-gray-400">62% of allocated budget</span>
        </div>
      </div>
    </div>
  );
}

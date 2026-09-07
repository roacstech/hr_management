export default function TasksPage() {
  const taskList = [
    { title: "Review Q3 Health Insurance Renewal Quotations", due: "Sep 10, 2026", priority: "High", assignedTo: "HR Ops Team" },
    { title: "Audit Biometric Device Firmware in Branch Office", due: "Sep 12, 2026", priority: "Medium", assignedTo: "IT Support" },
    { title: "Send Onboarding Welcome Kits to October Hires", due: "Sep 25, 2026", priority: "Normal", assignedTo: "People Team" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-xl border border-gray-200/80 shadow-xs">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Task Management</h1>
          <p className="text-gray-500 text-xs mt-0.5">Assign administrative checklists, compliance deadlines, and team follow-ups.</p>
        </div>
        <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-md shadow-xs transition">
          + Create Task
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200/80 overflow-hidden shadow-xs">
        <div className="p-4 border-b border-gray-100">
          <h2 className="text-xs font-bold text-gray-900 uppercase tracking-wide">Action Items</h2>
        </div>
        <div className="divide-y divide-gray-100">
          {taskList.map((task, idx) => (
            <div key={idx} className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-gray-50/60 transition text-xs">
              <div className="flex items-start space-x-3">
                <input type="checkbox" className="mt-0.5 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                <div>
                  <h3 className="font-semibold text-gray-900">{task.title}</h3>
                  <p className="text-[11px] text-gray-400 mt-0.5">Assigned to: {task.assignedTo} • Due {task.due}</p>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-gray-100 text-gray-700 border border-gray-200/60">
                {task.priority} Priority
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

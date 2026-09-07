export default function FilesPage() {
  const folders = [
    { name: "Company Policy Handbooks", filesCount: 14, updated: "Yesterday" },
    { name: "Health Insurance & Benefits", filesCount: 8, updated: "3 days ago" },
    { name: "NDA & Employment Contracts", filesCount: 142, updated: "Today" },
    { name: "Compliance & Safety Certifications", filesCount: 22, updated: "Last week" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-xl border border-gray-200/80 shadow-xs">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Document Repository</h1>
          <p className="text-gray-500 text-xs mt-0.5">Secure storage for legal contracts, handbooks, and compliance archives.</p>
        </div>
        <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-md shadow-xs transition">
          + Upload File
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {folders.map((f, i) => (
          <div key={i} className="p-4 bg-white rounded-xl border border-gray-200/80 hover:border-gray-300 shadow-xs transition group cursor-pointer text-xs">
            <h3 className="font-semibold text-gray-900">{f.name}</h3>
            <p className="text-[11px] text-gray-400 mt-1">{f.filesCount} files • {f.updated}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

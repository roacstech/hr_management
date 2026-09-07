export default function HRLettersPage() {
  const templates = [
    { name: "Employment Verification Letter", issued: "48 times", lastUsed: "Today" },
    { name: "Offer of Employment Letter", issued: "12 times", lastUsed: "Yesterday" },
    { name: "Promotion & Increment Notice", issued: "29 times", lastUsed: "Aug 30, 2026" },
    { name: "Relieving & Experience Certificate", issued: "6 times", lastUsed: "Aug 20, 2026" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-xl border border-gray-200/80 shadow-xs">
        <div>
          <h1 className="text-xl font-bold text-gray-900">HR Letters & Certificates</h1>
          <p className="text-gray-500 text-xs mt-0.5">Automated letter generation with digital signatures and verification.</p>
        </div>
        <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-md shadow-xs transition">
          + Issue Letter
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {templates.map((t, idx) => (
          <div key={idx} className="p-4 bg-white rounded-xl border border-gray-200/80 shadow-xs hover:border-gray-300 transition flex items-center justify-between text-xs">
            <div>
              <h3 className="font-semibold text-gray-900">{t.name}</h3>
              <p className="text-[11px] text-gray-400 mt-0.5">Issued: {t.issued} • Last used: {t.lastUsed}</p>
            </div>
            <button className="text-xs font-medium text-gray-700 bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-md hover:bg-gray-100 transition">
              Generate
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

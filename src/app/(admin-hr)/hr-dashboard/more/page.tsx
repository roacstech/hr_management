import Link from "next/link";

export default function MoreModulesPage() {
  const modules = [
    { title: "Employee Directory", desc: "View workforce master records and contact cards.", path: "/hr-dashboard/employees" },
    { title: "Payroll & Compensation", desc: "Manage monthly payouts, tax brackets, and salary sheets.", path: "/hr-dashboard/payroll" },
    { title: "CMS Authoring Panel", desc: "Draft internal company bulletins and policy notices.", path: "/hr-dashboard/cms" },
    { title: "Company Settings", desc: "Tenant setup, working hours, and branding preferences.", path: "/hr-dashboard/settings" },
    { title: "Performance Appraisals", desc: "Quarterly review cycles and KPI tracking.", path: "/hr-dashboard/performance" },
    { title: "Document Repository", desc: "Company handbooks, contracts, and archives.", path: "/hr-dashboard/files" },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl border border-gray-200/80 shadow-xs">
        <h1 className="text-xl font-bold text-gray-900">Additional Management Modules</h1>
        <p className="text-gray-500 text-xs mt-0.5">Access specialized modules, directories, payroll, and configuration.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {modules.map((m, idx) => (
          <Link
            key={idx}
            href={m.path}
            className="p-5 bg-white rounded-xl border border-gray-200/80 hover:border-gray-300 shadow-xs transition group"
          >
            <h3 className="text-sm font-bold text-gray-900 group-hover:text-blue-600 transition">
              {m.title}
            </h3>
            <p className="text-xs text-gray-500 mt-1">{m.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}

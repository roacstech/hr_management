export default function EmployeeProfilePage() {
  return (
    <div className="p-8 max-w-4xl mx-auto space-y-6">
      <div className="bg-white p-6 rounded-xl border border-gray-200/80 shadow-xs">
        <h1 className="text-xl font-bold text-gray-900">My Employee Profile</h1>
        <p className="text-gray-500 text-xs mt-0.5">Welcome to your personal self-service employee repository.</p>
      </div>

      <div className="bg-white p-6 rounded-xl border border-gray-200/80 shadow-xs space-y-4 text-xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <span className="text-gray-400 text-[11px] block">Full Name</span>
            <span className="font-semibold text-gray-900 text-sm">Alex Morgan</span>
          </div>
          <div>
            <span className="text-gray-400 text-[11px] block">Employee ID</span>
            <span className="font-semibold text-gray-900 text-sm">EMP-1048</span>
          </div>
          <div>
            <span className="text-gray-400 text-[11px] block">Department</span>
            <span className="font-semibold text-gray-900 text-sm">Engineering</span>
          </div>
          <div>
            <span className="text-gray-400 text-[11px] block">Role</span>
            <span className="font-semibold text-gray-900 text-sm">Fullstack Developer</span>
          </div>
        </div>
      </div>
    </div>
  );
}
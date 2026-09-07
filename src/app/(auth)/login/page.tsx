"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const [role, setRole] = useState("employee");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // In a real application, your backend authentication (like NextAuth or Clerk)
    // will return the authenticated user's role. Then you redirect accordingly:
    switch (role) {
      case "super-admin":
        router.push("/saas-dashboard/tenants");
        break;
      case "admin-hr":
        router.push("/hr-dashboard");
        break;
      case "manager":
        router.push("/manager-dashboard/department");
        break;
      case "team-lead":
        router.push("/tl-dashboard/roster");
        break;
      case "employee":
      default:
        router.push("/portal/profile");
        break;
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md space-y-6 rounded-xl bg-white p-8 shadow-md border border-gray-100">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900">CrewSync</h2>
          <p className="mt-2 text-sm text-gray-500">Bringing your entire workforce together into perfect alignment</p>
        </div>
        
        <form className="space-y-4" onSubmit={handleLogin}>
          <div>
            <label className="block text-sm font-medium text-black">Email Address</label>
            <input type="email" required placeholder="name@company.com" className="mt-1 w-full rounded-md border border-gray-300 p-2.5 outline-none focus:border-blue-500 text-gray-900" />
          </div>

          <div>
            <label className="block text-sm font-medium text-black">Password</label>
            <input type="password" required placeholder="••••••••" className="mt-1 w-full rounded-md border border-gray-300 p-2.5 outline-none focus:border-blue-500 text-gray-900" />
          </div>

          {/* Temporary Role Selector to test out all your 5 new folder routes */}
          <div>
            <label className="block text-sm font-medium text-blue-600 font-bold">Simulate Login As Role:</label>
            <select value={role} onChange={(e) => setRole(e.target.value)} className="mt-1 w-full rounded-md border border-blue-300 bg-blue-50 p-2.5 outline-none text-gray-800 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
              <option value="super-admin">Super Admin (Platform Owner)</option>
              <option value="admin-hr">Admin / HR (Tenant Admin)</option>
              <option value="manager">Manager (Department Head)</option>
              <option value="team-lead">Team Lead (Supervisor)</option>
              <option value="employee">Employee (Self-Service)</option>
            </select>
          </div>

          <button type="submit" className="w-full rounded-md bg-blue-600 p-3 text-sm font-semibold text-white hover:bg-blue-700 transition cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}

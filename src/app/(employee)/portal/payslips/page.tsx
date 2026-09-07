"use client";

import React from "react";
import { CompensationIcon, FolderIcon } from "@/components/SidebarIcons";

export default function MyPayslipsPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-xl font-bold text-gray-900">My Payslips</h1>
          <p className="text-xs text-gray-500 mt-1">Access, view, and securely download your monthly payroll slips.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl border border-gray-200/80 shadow-xs overflow-hidden">
            <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h2 className="text-sm font-bold text-gray-800 flex items-center">
                <CompensationIcon className="w-4 h-4 mr-2 text-blue-500" />
                Recent Payslips
              </h2>
              <select className="text-xs border border-gray-200 rounded-md p-1.5 bg-white text-gray-600 outline-none">
                <option>2026</option>
                <option>2025</option>
                <option>2024</option>
              </select>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50/50 text-gray-500 text-[10px] uppercase tracking-wider">
                    <th className="p-3 font-semibold border-b border-gray-100">Month</th>
                    <th className="p-3 font-semibold border-b border-gray-100">Pay Date</th>
                    <th className="p-3 font-semibold border-b border-gray-100">Net Pay</th>
                    <th className="p-3 font-semibold border-b border-gray-100">Status</th>
                    <th className="p-3 font-semibold border-b border-gray-100 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="text-xs">
                  {[
                    { month: "August 2026", date: "Aug 31, 2026", net: "$4,250.00", status: "Paid" },
                    { month: "July 2026", date: "Jul 31, 2026", net: "$4,250.00", status: "Paid" },
                    { month: "June 2026", date: "Jun 30, 2026", net: "$4,250.00", status: "Paid" },
                    { month: "May 2026", date: "May 31, 2026", net: "$4,250.00", status: "Paid" },
                    { month: "April 2026", date: "Apr 30, 2026", net: "$4,250.00", status: "Paid" },
                    { month: "March 2026", date: "Mar 31, 2026", net: "$4,250.00", status: "Paid" },
                  ].map((slip, i) => (
                    <tr key={i} className="border-b border-gray-50 hover:bg-gray-50/50 transition">
                      <td className="p-3 font-bold text-gray-800">{slip.month}</td>
                      <td className="p-3 text-gray-600">{slip.date}</td>
                      <td className="p-3 text-gray-900 font-semibold">{slip.net}</td>
                      <td className="p-3">
                        <span className="px-2 py-1 rounded-md text-[10px] font-bold bg-emerald-50 text-emerald-600">
                          {slip.status}
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        <button className="text-blue-600 font-semibold hover:underline mr-3">View</button>
                        <button className="text-blue-600 font-semibold hover:underline">Download</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl p-6 text-white shadow-lg">
            <h3 className="text-sm font-bold text-blue-100 mb-6 uppercase tracking-wider">Latest Pay Summary</h3>
            <div className="mb-6">
              <div className="text-3xl font-black mb-1">$4,250.00</div>
              <div className="text-xs text-blue-200">Net Pay for August 2026</div>
            </div>
            <div className="space-y-3 border-t border-blue-500/50 pt-4 text-xs">
              <div className="flex justify-between">
                <span className="text-blue-200">Gross Earnings</span>
                <span className="font-semibold">$5,500.00</span>
              </div>
              <div className="flex justify-between">
                <span className="text-blue-200">Taxes</span>
                <span className="font-semibold text-red-200">-$950.00</span>
              </div>
              <div className="flex justify-between">
                <span className="text-blue-200">Deductions</span>
                <span className="font-semibold text-red-200">-$300.00</span>
              </div>
            </div>
            <button className="w-full mt-6 bg-white text-blue-600 hover:bg-blue-50 font-bold py-2 rounded-lg transition-colors shadow-sm text-sm">
              View Detailed Breakdown
            </button>
          </div>

          <div className="bg-white rounded-xl border border-gray-200/80 shadow-xs p-5">
            <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center">
              <FolderIcon className="w-4 h-4 mr-2 text-gray-400" />
              Tax Documents
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 border border-gray-100 rounded-lg bg-gray-50/50 hover:border-blue-200 transition-colors group cursor-pointer">
                <div>
                  <div className="text-xs font-bold text-gray-900 group-hover:text-blue-700">W-2 Form (2025)</div>
                  <div className="text-[10px] text-gray-500">Issued Jan 31, 2026</div>
                </div>
                <button className="text-xs font-semibold text-blue-600">Download</button>
              </div>
              <div className="flex justify-between items-center p-3 border border-gray-100 rounded-lg bg-gray-50/50 hover:border-blue-200 transition-colors group cursor-pointer">
                <div>
                  <div className="text-xs font-bold text-gray-900 group-hover:text-blue-700">W-4 Declaration</div>
                  <div className="text-[10px] text-gray-500">Last updated Oct 2023</div>
                </div>
                <button className="text-xs font-semibold text-blue-600">Update</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

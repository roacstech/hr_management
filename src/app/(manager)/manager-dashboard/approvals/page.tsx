"use client";

import React, { useState } from "react";
import { OperationsIcon } from "@/components/SidebarIcons";

export default function ManagerApprovalsHub() {
  const [activeTab, setActiveTab] = useState("leaves");

  const leaves = [
    { id: "L-102", employee: "Alex Morgan", type: "Annual Leave", dates: "Dec 20 - Jan 2", duration: "10 days", escalatedBy: "Mark T.", status: "Pending" },
    { id: "L-105", employee: "Samantha Lee", type: "Sick Leave", dates: "Oct 15 - Oct 17", duration: "3 days", escalatedBy: "Mark T.", status: "Pending" },
  ];

  const payroll = [
    { id: "P-401", employee: "James Wilson", type: "Overtime Bonus", amount: "$450.00", reason: "Weekend deployment support", escalatedBy: "Sarah J.", status: "Pending" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Escalated Approvals Hub</h1>
          <p className="text-xs text-gray-500 mt-1">Final approval queue for requests escalated past Team Leads.</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-white border border-gray-200/80 p-1 rounded-xl shadow-xs w-fit">
        <button
          onClick={() => setActiveTab("leaves")}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
            activeTab === "leaves" 
              ? "bg-purple-50 text-purple-700 shadow-sm" 
              : "text-gray-500 hover:text-gray-800 hover:bg-gray-50"
          }`}
        >
          Leave Requests ({leaves.length})
        </button>
        <button
          onClick={() => setActiveTab("payroll")}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
            activeTab === "payroll" 
              ? "bg-purple-50 text-purple-700 shadow-sm" 
              : "text-gray-500 hover:text-gray-800 hover:bg-gray-50"
          }`}
        >
          Payroll Adjustments ({payroll.length})
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200/80 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <h2 className="text-sm font-bold text-gray-800 flex items-center">
            <OperationsIcon className="w-4 h-4 mr-2 text-purple-500" />
            {activeTab === "leaves" ? "Escalated Leave Requests" : "Escalated Payroll Adjustments"}
          </h2>
        </div>
        
        {activeTab === "leaves" && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50 text-gray-500 text-[10px] uppercase tracking-wider">
                  <th className="p-4 font-semibold border-b border-gray-100">ID & Employee</th>
                  <th className="p-4 font-semibold border-b border-gray-100">Leave Details</th>
                  <th className="p-4 font-semibold border-b border-gray-100">Escalated By</th>
                  <th className="p-4 font-semibold border-b border-gray-100 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="text-xs">
                {leaves.map((req) => (
                  <tr key={req.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition">
                    <td className="p-4">
                      <div className="font-bold text-gray-900">{req.employee}</div>
                      <div className="text-[10px] text-gray-500 mt-0.5">{req.id}</div>
                    </td>
                    <td className="p-4">
                      <div className="font-semibold text-gray-800">{req.type}</div>
                      <div className="text-[11px] text-gray-500 mt-0.5">{req.dates} ({req.duration})</div>
                    </td>
                    <td className="p-4">
                      <div className="inline-flex items-center space-x-2">
                        <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-[9px]">MT</div>
                        <span className="text-gray-600 font-medium">{req.escalatedBy}</span>
                      </div>
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <button className="bg-emerald-50 text-emerald-600 hover:bg-emerald-100 font-bold py-1.5 px-3 rounded-lg transition-colors border border-emerald-200">Approve</button>
                      <button className="bg-red-50 text-red-600 hover:bg-red-100 font-bold py-1.5 px-3 rounded-lg transition-colors border border-red-200">Reject</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === "payroll" && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50 text-gray-500 text-[10px] uppercase tracking-wider">
                  <th className="p-4 font-semibold border-b border-gray-100">ID & Employee</th>
                  <th className="p-4 font-semibold border-b border-gray-100">Adjustment Details</th>
                  <th className="p-4 font-semibold border-b border-gray-100">Escalated By</th>
                  <th className="p-4 font-semibold border-b border-gray-100 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="text-xs">
                {payroll.map((req) => (
                  <tr key={req.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition">
                    <td className="p-4">
                      <div className="font-bold text-gray-900">{req.employee}</div>
                      <div className="text-[10px] text-gray-500 mt-0.5">{req.id}</div>
                    </td>
                    <td className="p-4">
                      <div className="font-semibold text-gray-800">{req.type} - <span className="text-emerald-600">{req.amount}</span></div>
                      <div className="text-[11px] text-gray-500 mt-0.5 italic">"{req.reason}"</div>
                    </td>
                    <td className="p-4">
                      <div className="inline-flex items-center space-x-2">
                        <div className="w-6 h-6 rounded-full bg-purple-100 text-purple-700 font-bold flex items-center justify-center text-[9px]">SJ</div>
                        <span className="text-gray-600 font-medium">{req.escalatedBy}</span>
                      </div>
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <button className="bg-emerald-50 text-emerald-600 hover:bg-emerald-100 font-bold py-1.5 px-3 rounded-lg transition-colors border border-emerald-200">Approve</button>
                      <button className="bg-red-50 text-red-600 hover:bg-red-100 font-bold py-1.5 px-3 rounded-lg transition-colors border border-red-200">Reject</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

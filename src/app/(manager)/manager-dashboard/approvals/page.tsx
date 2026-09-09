"use client";

import React, { useState, useEffect } from "react";
import { getEscalatedLeaves, updateLeaveStatus } from "@/app/actions/approvals";

type FilterType = "All" | "Pending" | "Approved";

export default function ManagerApprovalsHub() {
  const [leaves, setLeaves] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterType>("Pending");

  const loadData = async () => {
    setLoading(true);
    const fetchedLeaves = await getEscalatedLeaves(filter);
    setLeaves(fetchedLeaves);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, [filter]);

  const handleApproveLeave = async (id: string) => {
    await updateLeaveStatus(id, "Approved");
    loadData();
  };

  const handleRejectLeave = async (id: string) => {
    await updateLeaveStatus(id, "Rejected");
    loadData();
  };

  return (
    <div className="space-y-6 bg-gray-50 min-h-full pb-10">
      {/* Header Area */}
      <div className="flex items-center justify-between p-6 bg-white border-b border-gray-200 shadow-xs mb-6 rounded-t-xl">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Escalated Approvals Hub</h1>
          <p className="text-xs text-gray-500 mt-1">Final approval queue for requests escalated past Team Leads, and Team Lead requests.</p>
        </div>
        <div className="flex space-x-6 text-sm font-semibold">
          {(["All", "Pending", "Approved"] as FilterType[]).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg transition-all ${
                filter === f 
                  ? "bg-blue-600 text-white shadow-md" 
                  : "text-gray-500 hover:text-gray-800"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Main Table Container */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden mx-6">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-max">
            <thead>
              <tr className="bg-[#f8fafc] text-gray-500 text-[11px] font-bold uppercase tracking-wider border-b border-gray-200">
                <th className="p-4">ID</th>
                <th className="p-4">NAME</th>
                <th className="p-4">FROM</th>
                <th className="p-4">TO</th>
                <th className="p-4">ESCALATED BY</th>
                <th className="p-4">STATUS</th>
                <th className="p-4 text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {leaves.map((req) => (
                <tr key={req.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="p-4">
                    <div className="text-[10px] text-gray-500 font-medium">{req.id}</div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-9 h-9 rounded-full bg-[#1e293b] text-white flex items-center justify-center text-xs font-bold shrink-0 shadow-sm">
                        {req.employee.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase()}
                      </div>
                      <span className="font-bold text-gray-900">{req.employee}</span>
                    </div>
                  </td>
                  <td className="p-4 text-gray-600 font-medium">{req.from}</td>
                  <td className="p-4 text-gray-600 font-medium">{req.to}</td>
                  <td className="p-4">
                    <div className="inline-flex items-center space-x-2">
                      <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-[9px]">
                        {req.escalatedBy.substring(0, 2).toUpperCase()}
                      </div>
                      <span className="text-gray-600 font-medium">{req.escalatedBy}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    {req.status === "Pending" ? (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-[11px] font-bold bg-yellow-50 text-yellow-700 border border-yellow-200/50">
                        <span className="w-1.5 h-1.5 rounded-full bg-yellow-500 mr-2 shadow-xs"></span>
                        Pending Review
                      </span>
                    ) : (
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-[11px] font-bold border ${req.status === "Approved" ? "bg-green-50 text-green-700 border-green-200/50" : "bg-red-50 text-red-700 border-red-200/50"}`}>
                        {req.status}
                      </span>
                    )}
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end items-center space-x-2">
                      {req.status === "Pending" ? (
                        <>
                          <button 
                            onClick={() => handleApproveLeave(req.id)}
                            disabled={loading}
                            className="bg-[#10b981] hover:bg-[#059669] text-white font-bold py-1.5 px-4 rounded-md shadow-sm transition-colors disabled:opacity-50 text-xs"
                          >
                            Approve
                          </button>
                          <button 
                            onClick={() => handleRejectLeave(req.id)}
                            disabled={loading}
                            className="bg-red-50 hover:bg-red-100 text-red-600 font-bold py-1.5 px-4 rounded-md transition-colors border border-red-100 shadow-sm disabled:opacity-50 text-xs"
                          >
                            Reject
                          </button>
                        </>
                      ) : (
                         <span className="text-gray-400 text-xs italic">No actions</span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {leaves.length === 0 && !loading && (
          <div className="p-12 flex flex-col items-center justify-center text-gray-400">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-3 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
             </svg>
            <span className="text-sm font-medium text-gray-500">No requests found.</span>
          </div>
        )}
        {loading && (
          <div className="p-12 text-center text-gray-500 text-sm font-medium">Loading requests...</div>
        )}

      </div>
    </div>
  );
}

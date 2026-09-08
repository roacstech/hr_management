"use client";

import React, { useState } from "react";
import { TrophyIcon, StarIcon, OperationsIcon } from "@/components/SidebarIcons";

export default function ManagerPerformancePage() {
  const [activeTab, setActiveTab] = useState("kpis");

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Performance & Appraisals</h1>
          <p className="text-xs text-gray-500 mt-1">Set KPIs, conduct reviews, and approve promotions.</p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold py-2 px-4 rounded-lg shadow-md shadow-blue-500/20 transition-all">
          + New Appraisal
        </button>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-white border border-gray-200/80 p-1 rounded-xl shadow-xs w-fit">
        <button
          onClick={() => setActiveTab("kpis")}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
            activeTab === "kpis" 
              ? "bg-purple-50 text-purple-700 shadow-sm" 
              : "text-gray-500 hover:text-gray-800 hover:bg-gray-50"
          }`}
        >
          Department KPIs
        </button>
        <button
          onClick={() => setActiveTab("reviews")}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
            activeTab === "reviews" 
              ? "bg-purple-50 text-purple-700 shadow-sm" 
              : "text-gray-500 hover:text-gray-800 hover:bg-gray-50"
          }`}
        >
          Quarterly Reviews
        </button>
        <button
          onClick={() => setActiveTab("promotions")}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
            activeTab === "promotions" 
              ? "bg-purple-50 text-purple-700 shadow-sm" 
              : "text-gray-500 hover:text-gray-800 hover:bg-gray-50"
          }`}
        >
          Promotions & Role Movements
        </button>
      </div>

      {activeTab === "kpis" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl border border-gray-200/80 shadow-xs p-6">
            <h3 className="text-sm font-bold text-gray-800 flex items-center mb-4">
              <StarIcon className="w-4 h-4 mr-2 text-yellow-500" />
              Q3 Active KPIs
            </h3>
            <div className="space-y-4">
              {[
                { title: "Reduce Server Downtime", target: "99.9% Uptime", progress: 85, color: "blue" },
                { title: "Deploy New Frontend Arch", target: "100% Completion", progress: 60, color: "indigo" },
                { title: "Resolve Critical Bugs", target: "< 5 bugs/week", progress: 92, color: "emerald" },
              ].map((kpi, idx) => (
                <div key={idx} className="border border-gray-100 rounded-lg p-4 bg-gray-50/50">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="text-xs font-bold text-gray-900">{kpi.title}</h4>
                    <span className="text-[10px] font-bold text-gray-500 bg-white px-2 py-0.5 rounded border border-gray-200">Target: {kpi.target}</span>
                  </div>
                  <div className="flex justify-between text-[10px] font-medium text-gray-500 mb-1">
                    <span>Progress</span>
                    <span>{kpi.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div className={`bg-${kpi.color}-500 h-1.5 rounded-full`} style={{ width: `${kpi.progress}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full mt-4 py-2 border border-dashed border-gray-300 rounded-lg text-xs font-bold text-gray-500 hover:bg-gray-50 transition-colors">
              + Set New KPI
            </button>
          </div>

          <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-xl p-6 text-white shadow-lg flex flex-col justify-between">
            <div>
              <h3 className="text-sm font-bold text-indigo-100 mb-2 uppercase tracking-wider">KPI Performance Overview</h3>
              <p className="text-xs text-indigo-200 mb-6 leading-relaxed">
                Your department is on track to hit 2 out of 3 primary objectives this quarter. We recommend focusing resources on the "Frontend Architecture" deployment to ensure timely completion.
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
               <div className="text-[10px] uppercase font-bold text-indigo-200 tracking-wider mb-2">Overall Department Score</div>
               <div className="text-4xl font-black">79<span className="text-xl text-indigo-300">/100</span></div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "reviews" && (
        <div className="bg-white rounded-xl border border-gray-200/80 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
            <h2 className="text-sm font-bold text-gray-800 flex items-center">
              <OperationsIcon className="w-4 h-4 mr-2 text-purple-500" />
              Q3 Performance Reviews
            </h2>
            <span className="bg-orange-100 text-orange-700 text-[10px] font-bold px-2 py-1 rounded">2 Pending Actions</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50 text-gray-500 text-[10px] uppercase tracking-wider">
                  <th className="p-3 font-semibold border-b border-gray-100">Employee</th>
                  <th className="p-3 font-semibold border-b border-gray-100">Self-Evaluation</th>
                  <th className="p-3 font-semibold border-b border-gray-100">Lead Evaluation</th>
                  <th className="p-3 font-semibold border-b border-gray-100">Status</th>
                  <th className="p-3 font-semibold border-b border-gray-100 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="text-xs">
                {[
                  { employee: "Alex Morgan", self: "Completed", lead: "Completed", status: "Requires Manager Approval", statusColor: "orange" },
                  { employee: "Samantha Lee", self: "Completed", lead: "Pending", status: "Waiting on Team Lead", statusColor: "blue" },
                  { employee: "James Wilson", self: "Completed", lead: "Completed", status: "Requires Manager Approval", statusColor: "orange" },
                ].map((review, i) => (
                  <tr key={i} className="border-b border-gray-50 hover:bg-gray-50/50 transition">
                    <td className="p-3 font-bold text-gray-800">{review.employee}</td>
                    <td className="p-3 text-gray-600">{review.self}</td>
                    <td className="p-3 text-gray-600">{review.lead}</td>
                    <td className="p-3">
                      <span className={`px-2 py-1 rounded-md text-[10px] font-bold bg-${review.statusColor}-50 text-${review.statusColor}-600`}>
                        {review.status}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <button className="text-blue-600 font-semibold hover:underline">Review</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === "promotions" && (
        <div className="bg-white rounded-xl border border-gray-200/80 shadow-xs p-6">
          <h2 className="text-sm font-bold text-gray-800 flex items-center mb-4">
            <TrophyIcon className="w-4 h-4 mr-2 text-yellow-500" />
            Pending Promotion Approvals
          </h2>
          <div className="space-y-4">
            <div className="border border-purple-100 bg-purple-50/30 rounded-xl p-5 flex flex-col md:flex-row justify-between md:items-center gap-4">
              <div>
                <div className="flex items-center space-x-2 mb-1">
                  <h3 className="text-sm font-bold text-gray-900">Alex Morgan</h3>
                  <span className="bg-purple-100 text-purple-700 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">Promotion</span>
                </div>
                <div className="text-xs text-gray-600 flex items-center space-x-2">
                  <span className="line-through text-gray-400">Fullstack Developer</span>
                  <span>&rarr;</span>
                  <span className="font-bold text-purple-700">Senior Fullstack Developer</span>
                </div>
                <p className="text-[11px] text-gray-500 mt-2 italic max-w-lg">
                  "Alex has consistently exceeded targets for 3 consecutive quarters and has taken on leadership responsibilities within the squad." - Mark T. (Team Lead)
                </p>
              </div>
              <div className="flex space-x-2">
                 <button className="bg-emerald-50 text-emerald-600 hover:bg-emerald-100 font-bold py-2 px-4 rounded-lg transition-colors border border-emerald-200 text-xs">Approve</button>
                 <button className="bg-red-50 text-red-600 hover:bg-red-100 font-bold py-2 px-4 rounded-lg transition-colors border border-red-200 text-xs">Reject</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

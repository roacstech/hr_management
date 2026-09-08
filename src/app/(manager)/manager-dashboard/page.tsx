"use client";

import React from "react";
import { OperationsIcon, HomeIcon, FolderIcon } from "@/components/SidebarIcons";

export default function ManagerOverviewDashboard() {
  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-black mb-1">Engineering Department</h1>
            <p className="text-sm text-purple-100 max-w-2xl">
              Department Overview Dashboard. Manage your resources, track attendance, and monitor headcount.
            </p>
          </div>
          <div className="hidden md:flex space-x-4">
            <div className="bg-white/10 rounded-xl p-4 text-center backdrop-blur-sm border border-white/20">
              <div className="text-3xl font-bold">42</div>
              <div className="text-[10px] uppercase font-bold text-purple-200 tracking-wider">Total Headcount</div>
            </div>
            <div className="bg-white/10 rounded-xl p-4 text-center backdrop-blur-sm border border-white/20">
              <div className="text-3xl font-bold">38</div>
              <div className="text-[10px] uppercase font-bold text-purple-200 tracking-wider">Present Today</div>
            </div>
          </div>
        </div>
        <div className="absolute right-0 top-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Attendance Graph Widget Placeholder */}
        <div className="bg-white rounded-xl shadow-xs border border-gray-100 p-6 lg:col-span-2">
          <h3 className="text-sm font-bold text-gray-800 flex items-center mb-4">
            <OperationsIcon className="w-4 h-4 mr-2 text-purple-500" />
            Weekly Attendance Trends
          </h3>
          <div className="h-64 flex items-end justify-between space-x-2 border-b border-gray-100 pb-2">
            {/* Mock Bar Chart */}
            {[
              { day: "Mon", val: 95 },
              { day: "Tue", val: 92 },
              { day: "Wed", val: 98 },
              { day: "Thu", val: 85 },
              { day: "Fri", val: 90 },
            ].map((d, i) => (
              <div key={i} className="flex flex-col items-center w-full group">
                <div className="w-full flex justify-center items-end h-48 bg-gray-50 rounded-t-lg relative group-hover:bg-purple-50 transition-colors">
                  <div 
                    className="w-1/2 bg-purple-500 rounded-t-md transition-all duration-500 group-hover:bg-purple-600" 
                    style={{ height: `${d.val}%` }}
                  ></div>
                  <span className="absolute -top-6 text-[10px] font-bold text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">{d.val}%</span>
                </div>
                <div className="text-xs font-semibold text-gray-500 mt-2">{d.day}</div>
              </div>
            ))}
          </div>
          <div className="flex justify-center mt-4 space-x-6 text-[10px] font-bold text-gray-500 uppercase tracking-wider">
            <div className="flex items-center"><span className="w-3 h-3 rounded bg-purple-500 mr-2"></span> Present</div>
            <div className="flex items-center"><span className="w-3 h-3 rounded bg-gray-200 mr-2"></span> Absent / Leave</div>
          </div>
        </div>

        {/* Resource Distribution */}
        <div className="bg-white rounded-xl shadow-xs border border-gray-100 p-6">
          <h3 className="text-sm font-bold text-gray-800 flex items-center mb-4">
            <FolderIcon className="w-4 h-4 mr-2 text-blue-500" />
            Resource Distribution
          </h3>
          <div className="space-y-4">
            {[
              { team: "Frontend Development", count: 12, percent: 28, color: "blue" },
              { team: "Backend Development", count: 15, percent: 35, color: "indigo" },
              { team: "QA & Testing", count: 8, percent: 19, color: "purple" },
              { team: "DevOps", count: 7, percent: 18, color: "cyan" },
            ].map((team, idx) => (
              <div key={idx}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-semibold text-gray-700">{team.team}</span>
                  <span className="text-gray-500 font-medium">{team.count} employees</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div className={`bg-${team.color}-500 h-2 rounded-full`} style={{ width: `${team.percent}%` }}></div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 pt-4 border-t border-gray-100 text-center">
             <button className="text-xs font-bold text-purple-600 hover:text-purple-700">View Full Roster &rarr;</button>
          </div>
        </div>

        {/* Headcount Tracking */}
        <div className="bg-white rounded-xl shadow-xs border border-gray-100 p-6 lg:col-span-3">
           <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-bold text-gray-800">Recent Headcount Changes</h3>
              <button className="text-xs font-semibold bg-gray-50 hover:bg-gray-100 text-gray-600 px-3 py-1.5 rounded-lg border border-gray-200 transition-colors">Export Report</button>
           </div>
           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="border border-green-100 bg-green-50/50 rounded-xl p-4 flex items-center space-x-4">
                 <div className="w-12 h-12 rounded-full bg-green-100 text-green-600 flex items-center justify-center font-bold text-lg">+3</div>
                 <div>
                    <div className="text-sm font-bold text-gray-900">New Hires</div>
                    <div className="text-[11px] text-gray-500">Joined this quarter</div>
                 </div>
              </div>
              <div className="border border-orange-100 bg-orange-50/50 rounded-xl p-4 flex items-center space-x-4">
                 <div className="w-12 h-12 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center font-bold text-lg">-1</div>
                 <div>
                    <div className="text-sm font-bold text-gray-900">Departures</div>
                    <div className="text-[11px] text-gray-500">Left this quarter</div>
                 </div>
              </div>
              <div className="border border-blue-100 bg-blue-50/50 rounded-xl p-4 flex items-center space-x-4">
                 <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-lg">+2</div>
                 <div>
                    <div className="text-sm font-bold text-gray-900">Open Roles</div>
                    <div className="text-[11px] text-gray-500">Currently recruiting</div>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}

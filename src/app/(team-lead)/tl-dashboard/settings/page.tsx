"use client";

import React, { useState } from "react";
import { GearIcon, BellIcon, AttendanceIcon, LeaveTrackerIcon } from "@/components/SidebarIcons";
import { useTenant } from "@/context/TenantContext";

export default function TeamLeadSettingsPage() {
  const { teamLeadProfile, currentOrg, showToast } = useTenant();

  // Settings State
  const [settings, setSettings] = useState({
    gracePeriod: 15,
    missingClockOut: 9,
    autoFridayPing: true,
    overtimePreApproval: true,
    slackWebhook: true,
    emailDigests: "daily",
    rosterSort: "status",
    autoApproveLeaves: false,
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    showToast("Team Lead settings saved successfully!", "success");
  };

  return (
    <div className="max-w-4xl space-y-6 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center">
          <GearIcon className="w-6 h-6 mr-3 text-amber-500" size={24} />
          Team Settings
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Configure attendance thresholds, approval rules, and notification preferences for your direct reports.
        </p>
      </div>

      <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-100 rounded-xl p-5 shadow-sm">
        <div className="flex items-center">
          <div className="w-12 h-12 rounded-full bg-amber-500 text-white font-bold flex items-center justify-center shrink-0 shadow-md border-2 border-white text-lg overflow-hidden">
            {teamLeadProfile?.profileImageUrl ? (
               <img src={teamLeadProfile.profileImageUrl} alt="TL" className="w-full h-full object-cover" />
            ) : (
               teamLeadProfile?.avatar || "TL"
            )}
          </div>
          <div className="ml-4">
            <h3 className="text-base font-bold text-gray-900">{teamLeadProfile?.name || "Sarah Chen"}'s Team Workspace</h3>
            <p className="text-xs text-gray-600 mt-0.5 font-medium">
              Managing <span className="font-bold text-amber-700">{teamLeadProfile?.directReportsCount ?? 6}</span> Direct Reports in <span className="font-bold text-gray-800">{currentOrg.name}</span>
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Time & Attendance */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden transition-shadow hover:shadow-md">
          <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center">
            <AttendanceIcon className="w-5 h-5 text-gray-500 mr-2" size={20} />
            <h2 className="text-sm font-bold text-gray-800 uppercase tracking-wide">Time & Attendance Rules</h2>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Punctuality Grace Period</label>
              <select
                value={settings.gracePeriod}
                onChange={(e) => setSettings({ ...settings, gracePeriod: Number(e.target.value) })}
                className="w-full bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition outline-none cursor-pointer text-gray-700 font-medium"
              >
                <option value={5}>5 Minutes (Strict)</option>
                <option value={10}>10 Minutes Grace</option>
                <option value={15}>15 Minutes Grace (Default)</option>
                <option value={30}>30 Minutes Grace (Flexible)</option>
              </select>
              <p className="text-xs text-gray-400 mt-2 font-medium">Arrivals beyond this window will trigger a "Late Arrival" flag.</p>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Missing Clock-Out Threshold</label>
              <select
                value={settings.missingClockOut}
                onChange={(e) => setSettings({ ...settings, missingClockOut: Number(e.target.value) })}
                className="w-full bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition outline-none cursor-pointer text-gray-700 font-medium"
              >
                <option value={8}>8 Hours on Shift</option>
                <option value={9}>9 Hours on Shift</option>
                <option value={10}>10 Hours on Shift</option>
                <option value={12}>12 Hours on Shift</option>
              </select>
              <p className="text-xs text-gray-400 mt-2 font-medium">Automatically flags shifts that exceed this duration without a clock-out.</p>
            </div>
          </div>
        </div>

        {/* Approvals & Workflows */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden transition-shadow hover:shadow-md">
          <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center">
            <LeaveTrackerIcon className="w-5 h-5 text-gray-500 mr-2" size={20} />
            <h2 className="text-sm font-bold text-gray-800 uppercase tracking-wide">Approvals & Workflows</h2>
          </div>
          <div className="p-6 space-y-5">
            <label className="flex items-start space-x-3.5 cursor-pointer group p-2 -m-2 rounded-lg hover:bg-amber-50/50 transition">
              <div className="pt-0.5">
                <input
                  type="checkbox"
                  checked={settings.overtimePreApproval}
                  onChange={(e) => setSettings({ ...settings, overtimePreApproval: e.target.checked })}
                  className="w-4 h-4 rounded text-amber-600 border-gray-300 focus:ring-amber-500 cursor-pointer"
                />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-800 group-hover:text-amber-700 transition">Require explicit TL pre-approval for Overtime</p>
                <p className="text-xs text-gray-500 mt-1 font-medium">If disabled, employees can log overtime hours automatically based on their clock-out time.</p>
              </div>
            </label>
            
            <label className="flex items-start space-x-3.5 cursor-pointer group p-2 -m-2 rounded-lg hover:bg-amber-50/50 transition border-t border-gray-50">
              <div className="pt-0.5">
                <input
                  type="checkbox"
                  checked={settings.autoApproveLeaves}
                  onChange={(e) => setSettings({ ...settings, autoApproveLeaves: e.target.checked })}
                  className="w-4 h-4 rounded text-amber-600 border-gray-300 focus:ring-amber-500 cursor-pointer"
                />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-800 group-hover:text-amber-700 transition">Auto-Approve Sick Leaves (under 2 days)</p>
                <p className="text-xs text-gray-500 mt-1 font-medium">Automatically bypasses TL review for short sick leaves to reduce your approval desk queue.</p>
              </div>
            </label>
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden transition-shadow hover:shadow-md">
          <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center">
            <BellIcon className="w-5 h-5 text-gray-500 mr-2" size={20} />
            <h2 className="text-sm font-bold text-gray-800 uppercase tracking-wide">Alerts & Notifications</h2>
          </div>
          <div className="p-6 space-y-5">
            <label className="flex items-start space-x-3.5 cursor-pointer group p-2 -m-2 rounded-lg hover:bg-amber-50/50 transition">
              <div className="pt-0.5">
                <input
                  type="checkbox"
                  checked={settings.autoFridayPing}
                  onChange={(e) => setSettings({ ...settings, autoFridayPing: e.target.checked })}
                  className="w-4 h-4 rounded text-amber-600 border-gray-300 focus:ring-amber-500 cursor-pointer"
                />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-800 group-hover:text-amber-700 transition">Auto-Ping direct team on Friday</p>
                <p className="text-xs text-gray-500 mt-1 font-medium">Sends an automated reminder to all direct reports to submit their timesheets before the weekend.</p>
              </div>
            </label>

            <label className="flex items-start space-x-3.5 cursor-pointer group p-2 -m-2 rounded-lg hover:bg-amber-50/50 transition border-t border-gray-50">
              <div className="pt-0.5">
                <input
                  type="checkbox"
                  checked={settings.slackWebhook}
                  onChange={(e) => setSettings({ ...settings, slackWebhook: e.target.checked })}
                  className="w-4 h-4 rounded text-amber-600 border-gray-300 focus:ring-amber-500 cursor-pointer"
                />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-800 group-hover:text-amber-700 transition">Real-time chat alerts (Slack / MS Teams)</p>
                <p className="text-xs text-gray-500 mt-1 font-medium">Receive instant webhook pings for urgent PTO filings or completely missed shifts.</p>
              </div>
            </label>
          </div>
        </div>

        <div className="flex items-center justify-end pt-4">
          <button
            type="submit"
            className="px-6 py-3 bg-amber-500 hover:bg-amber-600 active:scale-95 text-white text-sm font-bold rounded-xl shadow-md shadow-amber-500/20 transition-all duration-200"
          >
            Save Team Preferences
          </button>
        </div>
      </form>
    </div>
  );
}

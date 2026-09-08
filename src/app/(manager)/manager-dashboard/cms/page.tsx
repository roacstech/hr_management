"use client";

import React, { useState } from "react";
import { BuildingIcon, PlusIcon } from "@/components/SidebarIcons";

export default function ManagerCMSPage() {
  const [isPublishing, setIsPublishing] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Department CMS Board</h1>
          <p className="text-xs text-gray-500 mt-1">Publish updates, goals, and targets visible strictly to your department.</p>
        </div>
        <button 
          onClick={() => setIsPublishing(!isPublishing)}
          className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold py-2 px-4 rounded-lg shadow-md shadow-blue-500/20 transition-all flex items-center"
        >
          <PlusIcon className="w-3.5 h-3.5 mr-1.5" />
          {isPublishing ? "Cancel" : "New Post"}
        </button>
      </div>

      {isPublishing && (
        <div className="bg-white p-6 rounded-xl border border-blue-200 shadow-lg shadow-blue-100/50 animate-in fade-in slide-in-from-top-4 duration-300">
          <h2 className="text-sm font-bold text-gray-900 mb-4 border-b border-gray-100 pb-2 flex items-center">
            <BuildingIcon className="w-4 h-4 mr-2 text-blue-500" />
            Publish New Department Update
          </h2>
          <form className="space-y-4 text-xs" onSubmit={(e) => { e.preventDefault(); setIsPublishing(false); }}>
            <div>
              <label className="block text-gray-500 font-medium mb-1.5">Post Title</label>
              <input type="text" placeholder="E.g., Q4 Engineering Goals Overview" className="w-full border border-gray-200 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" required />
            </div>
            <div>
              <label className="block text-gray-500 font-medium mb-1.5">Visibility</label>
              <select className="w-full border border-gray-200 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all">
                <option>Entire Engineering Department</option>
                <option>Frontend Team Only</option>
                <option>Backend Team Only</option>
                <option>Team Leads Only</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-500 font-medium mb-1.5">Content</label>
              <textarea rows={5} placeholder="Write your update here..." className="w-full border border-gray-200 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" required></textarea>
            </div>
            <div className="flex justify-between items-center pt-2">
              <label className="flex items-center space-x-2 text-gray-600 cursor-pointer">
                <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                <span>Pin to top of Department Hub</span>
              </label>
              <button type="submit" className="bg-blue-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-blue-700 shadow-md">
                Publish Update
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Published Posts */}
          <div className="bg-white rounded-xl border border-gray-200/80 shadow-xs overflow-hidden">
            <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h2 className="text-sm font-bold text-gray-800 flex items-center">
                <BuildingIcon className="w-4 h-4 mr-2 text-indigo-500" />
                Recent Department Publications
              </h2>
            </div>
            <div className="divide-y divide-gray-100">
              {[
                { title: "Engineering All-Hands Recap & Action Items", date: "Sep 7, 2026", visibility: "Entire Department", pinned: true },
                { title: "New API Rate Limiting Targets for Q4", date: "Sep 5, 2026", visibility: "Backend Team", pinned: false },
                { title: "Updated Frontend Component Guidelines", date: "Aug 28, 2026", visibility: "Frontend Team", pinned: false },
                { title: "Welcome to our new Engineering hires!", date: "Aug 25, 2026", visibility: "Entire Department", pinned: false },
              ].map((post, i) => (
                <div key={i} className="p-5 hover:bg-gray-50/50 transition cursor-pointer group">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-sm font-bold text-gray-900 group-hover:text-blue-600 flex items-center">
                      {post.pinned && <span className="text-[10px] bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded mr-2 uppercase tracking-wider">Pinned</span>}
                      {post.title}
                    </h3>
                    <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="text-xs text-blue-600 font-semibold hover:underline">Edit</button>
                      <button className="text-xs text-red-600 font-semibold hover:underline">Delete</button>
                    </div>
                  </div>
                  <div className="flex items-center text-[10px] text-gray-500 font-medium space-x-3">
                    <span>Published: {post.date}</span>
                    <span>•</span>
                    <span className="bg-gray-100 px-2 py-0.5 rounded text-gray-600">Visible to: {post.visibility}</span>
                    <span>•</span>
                    <span>145 Views</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Department Targets */}
          <div className="bg-white rounded-xl border border-gray-200/80 shadow-xs p-6">
            <h3 className="text-sm font-bold text-gray-800 mb-4 flex items-center justify-between">
              Active Department Goals
              <button className="text-xs text-blue-600 font-semibold hover:underline">Edit Goals</button>
            </h3>
            <div className="space-y-4">
              <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-4">
                <div className="text-xs font-bold text-indigo-900 mb-1">Goal 1: Launch V2 Platform</div>
                <p className="text-[11px] text-indigo-700">Ensure all core microservices are migrated by end of Q4.</p>
              </div>
              <div className="bg-emerald-50 border border-emerald-100 rounded-lg p-4">
                <div className="text-xs font-bold text-emerald-900 mb-1">Goal 2: Technical Debt Reduction</div>
                <p className="text-[11px] text-emerald-700">Allocate 20% of sprint velocity strictly to tech debt.</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-indigo-600 to-blue-700 rounded-xl p-6 text-white shadow-lg">
             <h3 className="text-sm font-bold text-indigo-100 mb-2">Need to reach everyone?</h3>
             <p className="text-xs text-indigo-200 mb-4 leading-relaxed">
               As a manager, you can also submit company-wide announcements to HR for approval on the main Company Hub.
             </p>
             <button className="w-full bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white text-xs font-bold py-2 rounded-lg transition-colors border border-white/30">
               Request Company Announcement
             </button>
          </div>
        </div>
      </div>
    </div>
  );
}

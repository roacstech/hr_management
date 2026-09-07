"use client";

import React, { useState } from "react";
import { BuildingIcon, SearchIcon, StarIcon, FolderIcon } from "@/components/SidebarIcons";

export default function CompanyHubPage() {
  const [activeTab, setActiveTab] = useState("news");

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Company Hub</h1>
          <p className="text-xs text-gray-500 mt-1">Read news, team updates, and access the Knowledge Base.</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-white border border-gray-200/80 p-1 rounded-xl shadow-xs w-fit">
        <button
          onClick={() => setActiveTab("news")}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
            activeTab === "news" 
              ? "bg-blue-50 text-blue-700 shadow-sm" 
              : "text-gray-500 hover:text-gray-800 hover:bg-gray-50"
          }`}
        >
          Company News
        </button>
        <button
          onClick={() => setActiveTab("knowledge")}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
            activeTab === "knowledge" 
              ? "bg-blue-50 text-blue-700 shadow-sm" 
              : "text-gray-500 hover:text-gray-800 hover:bg-gray-50"
          }`}
        >
          Knowledge Base
        </button>
      </div>

      {activeTab === "news" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Featured Article */}
            <div className="bg-white rounded-xl border border-gray-200/80 shadow-xs overflow-hidden group cursor-pointer hover:border-blue-200 transition-all">
              <div className="h-48 bg-gradient-to-r from-blue-600 to-cyan-500 flex items-center justify-center relative overflow-hidden">
                <BuildingIcon className="w-16 h-16 text-white/20 absolute -right-4 -bottom-4 transform rotate-12 scale-150" />
                <div className="text-center relative z-10 px-6">
                  <span className="bg-white/20 text-white backdrop-blur-sm px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider mb-3 inline-block">Featured Update</span>
                  <h2 className="text-2xl font-black text-white">Q3 Townhall Meeting Wrap-Up</h2>
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-3 space-x-3">
                  <span>Published by HR</span>
                  <span>•</span>
                  <span>Sep 6, 2026</span>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed mb-4">
                  Thank you to everyone who joined our quarterly townhall meeting. We discussed our outstanding achievements in the last quarter and our strategic goals for the remainder of the year. If you missed it, you can catch up on the highlights here.
                </p>
                <div className="text-blue-600 text-xs font-bold hover:underline">Read Full Article &rarr;</div>
              </div>
            </div>

            {/* Other News List */}
            <div className="bg-white rounded-xl border border-gray-200/80 shadow-xs p-2">
              {[
                { title: "New Health Benefit Plan Enrollment Open", date: "Sep 2, 2026", excerpt: "Annual enrollment for health and dental plans is now open through the end of the month." },
                { title: "Welcome to the new Team Members", date: "Aug 28, 2026", excerpt: "Please join us in welcoming 5 new developers to the engineering team this week." },
                { title: "Office Closure for Labor Day", date: "Aug 20, 2026", excerpt: "Just a reminder that the office will be closed on Monday in observance of Labor Day." },
              ].map((news, i) => (
                <div key={i} className="p-4 hover:bg-gray-50 rounded-lg transition cursor-pointer border-b border-gray-50 last:border-0">
                  <h3 className="text-sm font-bold text-gray-900 mb-1 hover:text-blue-600 transition-colors">{news.title}</h3>
                  <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed mb-2">{news.excerpt}</p>
                  <div className="text-[10px] text-gray-400 font-semibold">{news.date}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-gray-200/80 shadow-xs p-5">
              <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center">
                <StarIcon className="w-4 h-4 mr-2 text-yellow-500" />
                Upcoming Events
              </h3>
              <div className="space-y-3">
                <div className="flex space-x-3 items-start">
                  <div className="bg-blue-50 border border-blue-100 rounded-lg p-2 text-center min-w-[50px]">
                    <div className="text-[10px] text-blue-600 font-bold uppercase">Sep</div>
                    <div className="text-lg font-black text-blue-800 leading-none">12</div>
                  </div>
                  <div className="pt-1">
                    <div className="text-xs font-bold text-gray-900">Virtual Hackathon</div>
                    <div className="text-[11px] text-gray-500 mt-0.5">10:00 AM - Online</div>
                  </div>
                </div>
                <div className="flex space-x-3 items-start">
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-2 text-center min-w-[50px]">
                    <div className="text-[10px] text-gray-600 font-bold uppercase">Sep</div>
                    <div className="text-lg font-black text-gray-800 leading-none">25</div>
                  </div>
                  <div className="pt-1">
                    <div className="text-xs font-bold text-gray-900">End of Month Sync</div>
                    <div className="text-[11px] text-gray-500 mt-0.5">3:00 PM - Main Conf Room</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "knowledge" && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-gray-200/80 shadow-xs p-6 flex items-center">
            <div className="relative flex-1 max-w-2xl">
              <SearchIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input 
                type="text" 
                placeholder="Search the Knowledge Base for policies, guides, or forms..." 
                className="w-full bg-gray-50 border border-gray-200 text-sm text-gray-800 rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all shadow-inner"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { category: "Employee Handbook", desc: "Core company policies and code of conduct.", icon: FolderIcon, items: ["Code of Conduct 2026", "Work From Home Policy", "Anti-Harassment Guidelines"] },
              { category: "Benefits & Perks", desc: "Details on health, retirement, and wellness.", icon: StarIcon, items: ["Health Insurance Summary", "401(k) Matching Rules", "Gym Membership Reimbursement"] },
              { category: "IT & Security", desc: "Tech guides and security protocols.", icon: BuildingIcon, items: ["VPN Setup Guide", "Password Requirements", "Software Request Process"] },
            ].map((section, idx) => {
              const Icon = section.icon;
              return (
                <div key={idx} className="bg-white rounded-xl border border-gray-200/80 shadow-xs p-5">
                  <div className="flex items-center mb-2">
                    <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center mr-3">
                      <Icon className="w-4 h-4" />
                    </div>
                    <h3 className="text-sm font-bold text-gray-900">{section.category}</h3>
                  </div>
                  <p className="text-[11px] text-gray-500 mb-4">{section.desc}</p>
                  <ul className="space-y-2">
                    {section.items.map((item, i) => (
                      <li key={i}>
                        <a href="#" className="text-xs text-gray-700 hover:text-blue-600 font-medium flex items-center transition-colors">
                          <span className="w-1 h-1 rounded-full bg-gray-300 mr-2"></span>
                          {item}
                        </a>
                      </li>
                    ))}
                  </ul>
                  <button className="text-[11px] font-bold text-blue-600 mt-4 hover:underline">View All Articles</button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

"use client";

import { useState } from "react";
import { useTenant } from "@/context/TenantContext";
import { TeamSpacePost } from "@/lib/types";
import { PlusIcon, CloseIcon } from "@/components/SidebarIcons";

export default function TeamSpaceCMSPage() {
  const {
    teamSpacePosts,
    createTeamSpacePost,
    togglePostReaction,
    addPostComment,
    employees,
    showToast,
  } = useTenant();

  const [activeCategory, setActiveCategory] = useState<"ALL" | "Goal" | "Schedule" | "Recognition" | "Announcement">("ALL");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});

  // Form State
  const [postForm, setPostForm] = useState({
    category: "Goal" as TeamSpacePost["category"],
    title: "",
    content: "",
    priority: "Normal" as TeamSpacePost["priority"],
    pinned: false,
    targetEmployeeName: "Carlos Mendez",
    badge: "🌟 Sprint MVP",
    goalProgress: 60,
    goalTargetDate: "2026-09-25",
    shiftName: "Frontend General Shift",
    shiftTiming: "09:00 AM - 06:00 PM PST",
    rosterSummary: "Core Platform Team",
    effectiveDates: "Sep 14 - Sep 20, 2026",
  });

  const filteredPosts = teamSpacePosts.filter(
    (p) => activeCategory === "ALL" || p.category === activeCategory
  );

  const goalPostsCount = teamSpacePosts.filter((p) => p.category === "Goal").length;
  const schedulePostsCount = teamSpacePosts.filter((p) => p.category === "Schedule").length;
  const recognitionPostsCount = teamSpacePosts.filter((p) => p.category === "Recognition").length;

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!postForm.title.trim() || !postForm.content.trim()) return;

    createTeamSpacePost({
      category: postForm.category,
      title: postForm.title,
      content: postForm.content,
      authorName: "Sarah Chen",
      authorRole: "Frontend Tech Lead",
      authorAvatar: "SC",
      priority: postForm.priority,
      pinned: postForm.pinned,
      targetEmployeeName: postForm.category === "Recognition" ? postForm.targetEmployeeName : undefined,
      badge: postForm.category === "Recognition" ? postForm.badge : undefined,
      goalProgress: postForm.category === "Goal" ? Number(postForm.goalProgress) : undefined,
      goalTargetDate: postForm.category === "Goal" ? postForm.goalTargetDate : undefined,
      scheduleDetails:
        postForm.category === "Schedule"
          ? {
              shiftName: postForm.shiftName,
              timing: postForm.shiftTiming,
              rosterSummary: postForm.rosterSummary,
              effectiveDates: postForm.effectiveDates,
            }
          : undefined,
    });

    setIsCreateModalOpen(false);
    setPostForm({
      category: "Goal",
      title: "",
      content: "",
      priority: "Normal",
      pinned: false,
      targetEmployeeName: "Carlos Mendez",
      badge: "🌟 Sprint MVP",
      goalProgress: 60,
      goalTargetDate: "2026-09-25",
      shiftName: "Frontend General Shift",
      shiftTiming: "09:00 AM - 06:00 PM PST",
      rosterSummary: "Core Platform Team",
      effectiveDates: "Sep 14 - Sep 20, 2026",
    });
  };

  const handleReaction = (postId: string, emoji: string) => {
    togglePostReaction(postId, emoji, "Sarah Chen");
  };

  const handleAddComment = (postId: string) => {
    const text = commentInputs[postId]?.trim();
    if (!text) return;

    addPostComment(postId, {
      authorName: "Sarah Chen",
      authorRole: "Frontend Tech Lead",
      authorAvatar: "SC",
      content: text,
    });

    setCommentInputs((prev) => ({ ...prev, [postId]: "" }));
  };

  return (
    <div className="space-y-6 pb-16 font-sans">
      {/* 1. Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-200/90 shadow-xs">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-[11px] font-bold text-amber-700 bg-amber-50 border border-amber-200/60 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              Team Space CMS Feed
            </span>
            <span className="text-[11px] font-semibold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full">
              Direct Engineering Reports
            </span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mt-2 tracking-tight">
            Team Space (CMS Feed)
          </h1>
          <p className="text-gray-500 text-xs mt-0.5 max-w-2xl">
            Post team-specific goals, shift schedules, or recognition alerts for your immediate direct reports. Keep the team aligned, motivated, and informed.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsCreateModalOpen(true)}
          className="inline-flex items-center px-4 py-2 bg-[#007aff] hover:bg-[#006ee0] active:scale-95 text-white text-xs font-bold rounded-lg shadow-sm transition cursor-pointer shrink-0"
        >
          <PlusIcon className="w-3.5 h-3.5 mr-1.5 text-white" size={14} />
          Create Team Post
        </button>
      </div>

      {/* 2. Top Feed Highlight Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-gray-200/90 shadow-xs space-y-1">
          <p className="text-xs text-gray-500 font-medium">Active Team Goals</p>
          <p className="text-2xl font-extrabold text-blue-600">{goalPostsCount}</p>
          <span className="text-[11px] text-gray-400 font-medium">Sprint OKRs & deliverables</span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gray-200/90 shadow-xs space-y-1">
          <p className="text-xs text-gray-500 font-medium">Published Shift Rosters</p>
          <p className="text-2xl font-extrabold text-indigo-600">{schedulePostsCount}</p>
          <span className="text-[11px] text-gray-400 font-medium">Rotations & on-call assignments</span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gray-200/90 shadow-xs space-y-1">
          <p className="text-xs text-gray-500 font-medium">Peer Recognition Alerts</p>
          <p className="text-2xl font-extrabold text-amber-600">{recognitionPostsCount}</p>
          <span className="text-[11px] text-amber-700 font-medium">Kudos & celebratory badges</span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gray-200/90 shadow-xs space-y-1">
          <p className="text-xs text-gray-500 font-medium">Total Feed Engagement</p>
          <p className="text-2xl font-extrabold text-emerald-600">
            {teamSpacePosts.reduce((acc, p) => acc + p.reactions.reduce((rAcc, r) => rAcc + r.count, 0), 0)} Reactions
          </p>
          <span className="text-[11px] text-emerald-700 font-medium">Direct team collaboration</span>
        </div>
      </div>

      {/* 3. Category Filter Tabs */}
      <div className="bg-white p-2 rounded-xl border border-gray-200/90 shadow-xs flex items-center justify-between">
        <div className="flex flex-wrap items-center gap-1 text-xs">
          {[
            { id: "ALL", label: `All Updates (${teamSpacePosts.length})` },
            { id: "Goal", label: `🎯 Team Goals (${goalPostsCount})` },
            { id: "Schedule", label: `📅 Shift Schedules (${schedulePostsCount})` },
            { id: "Recognition", label: `🏆 Recognition & Kudos (${recognitionPostsCount})` },
            { id: "Announcement", label: "📢 Direct Bulletins" },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveCategory(tab.id as any)}
              className={`px-3.5 py-2 rounded-lg font-semibold transition cursor-pointer ${
                activeCategory === tab.id
                  ? "bg-blue-600 text-white shadow-xs"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* 4. Feed Stream */}
      <div className="space-y-4">
        {filteredPosts.map((post) => {
          return (
            <div
              key={post.id}
              className={`bg-white rounded-2xl border transition-all p-6 shadow-xs ${
                post.pinned
                  ? "border-amber-300 ring-1 ring-amber-100 bg-gradient-to-b from-amber-50/15 to-white"
                  : "border-gray-200/90"
              }`}
            >
              {/* Post Header */}
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-900 text-white font-bold flex items-center justify-center text-sm shadow-xs">
                    {post.authorAvatar || "TL"}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <p className="font-bold text-gray-900 leading-tight">
                        {post.authorName}
                      </p>
                      <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-amber-100 text-amber-800">
                        {post.authorRole}
                      </span>
                      {post.pinned && (
                        <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200 flex items-center space-x-1">
                          <span>📌 Pinned</span>
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-gray-400 mt-0.5">
                      {new Date(post.createdAt).toLocaleString(undefined, {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>

                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10.5px] font-bold uppercase tracking-wider ${
                    post.category === "Goal"
                      ? "bg-blue-100 text-blue-800"
                      : post.category === "Schedule"
                      ? "bg-purple-100 text-purple-800"
                      : post.category === "Recognition"
                      ? "bg-amber-100 text-amber-800"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {post.category}
                </span>
              </div>

              {/* Title & Body */}
              <h3 className="text-base font-bold text-gray-900 tracking-tight mb-1.5">
                {post.title}
              </h3>
              <p className="text-gray-700 text-xs sm:text-sm leading-relaxed mb-4">
                {post.content}
              </p>

              {/* Specific Category Widgets */}
              {/* A. Goal Progress Widget */}
              {post.category === "Goal" && post.goalProgress !== undefined && (
                <div className="mb-4 p-4 rounded-xl bg-blue-50/60 border border-blue-100 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-blue-900">Sprint Milestone Completion</span>
                    <span className="font-black text-blue-700 text-sm">
                      {post.goalProgress}%
                    </span>
                  </div>
                  <div className="w-full bg-blue-200/80 rounded-full h-2.5 overflow-hidden">
                    <div
                      className="bg-blue-600 h-2.5 rounded-full transition-all duration-500"
                      style={{ width: `${post.goalProgress}%` }}
                    />
                  </div>
                  {post.goalTargetDate && (
                    <p className="text-[11px] text-blue-700 font-medium">
                      🎯 Target Delivery Deadline: {post.goalTargetDate}
                    </p>
                  )}
                </div>
              )}

              {/* B. Schedule Details Widget */}
              {post.category === "Schedule" && post.scheduleDetails && (
                <div className="mb-4 p-4 rounded-xl bg-purple-50/60 border border-purple-100 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-purple-700 font-medium">Shift Name:</span>
                    <p className="font-bold text-purple-950 mt-0.5">
                      {post.scheduleDetails.shiftName}
                    </p>
                    <p className="text-purple-800 text-[11px] mt-0.5">
                      ⏰ {post.scheduleDetails.timing}
                    </p>
                  </div>
                  <div>
                    <span className="text-purple-700 font-medium">Coverage Summary:</span>
                    <p className="font-bold text-purple-950 mt-0.5">
                      {post.scheduleDetails.rosterSummary}
                    </p>
                    <p className="text-purple-800 text-[11px] mt-0.5">
                      📅 Effective: {post.scheduleDetails.effectiveDates}
                    </p>
                  </div>
                </div>
              )}

              {/* C. Recognition Kudos Widget */}
              {post.category === "Recognition" && post.targetEmployeeName && (
                <div className="mb-4 p-4 rounded-xl bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-yellow-500/10 border border-amber-300/70 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">🏆</span>
                    <div>
                      <span className="text-[11px] uppercase tracking-wider font-bold text-amber-800">
                        Honoring Direct Report
                      </span>
                      <p className="font-extrabold text-sm text-gray-900">
                        {post.targetEmployeeName}
                      </p>
                    </div>
                  </div>
                  {post.badge && (
                    <span className="px-3 py-1 rounded-full text-xs font-black bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-xs">
                      {post.badge}
                    </span>
                  )}
                </div>
              )}

              {/* Social Reactions Bar */}
              <div className="pt-3 border-t border-gray-100 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center space-x-2 text-xs">
                  {["👍", "🚀", "👏", "❤️", "🔥"].map((emoji) => {
                    const reaction = post.reactions.find((r) => r.emoji === emoji);
                    const hasReacted = reaction?.users.includes("Sarah Chen");

                    return (
                      <button
                        key={emoji}
                        type="button"
                        onClick={() => handleReaction(post.id, emoji)}
                        className={`px-2.5 py-1 rounded-lg border font-semibold flex items-center space-x-1.5 transition cursor-pointer ${
                          hasReacted
                            ? "bg-blue-50 border-blue-300 text-blue-800 shadow-xs"
                            : "bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100"
                        }`}
                      >
                        <span>{emoji}</span>
                        <span>{reaction?.count || 0}</span>
                      </button>
                    );
                  })}
                </div>

                <span className="text-[11px] text-gray-400 font-medium">
                  {post.comments.length} Comments
                </span>
              </div>

              {/* Comments Stream */}
              {post.comments.length > 0 && (
                <div className="mt-4 pt-3 border-t border-gray-100 space-y-2.5">
                  {post.comments.map((comment) => (
                    <div key={comment.id} className="flex items-start space-x-2.5 text-xs bg-gray-50/70 p-2.5 rounded-xl border border-gray-100">
                      <div className="w-6 h-6 rounded-md bg-slate-700 text-white font-bold text-[10px] flex items-center justify-center shrink-0">
                        {comment.authorAvatar || "TM"}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <p className="font-bold text-gray-900 leading-tight">
                            {comment.authorName}{" "}
                            <span className="font-normal text-gray-400 text-[10.5px]">
                              • {comment.authorRole}
                            </span>
                          </p>
                          <span className="text-[10px] text-gray-400">{comment.timestamp}</span>
                        </div>
                        <p className="text-gray-700 text-[11.5px] mt-0.5 leading-relaxed">
                          {comment.content}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Add Comment Input */}
              <div className="mt-3 flex items-center space-x-2">
                <input
                  type="text"
                  value={commentInputs[post.id] || ""}
                  onChange={(e) =>
                    setCommentInputs({ ...commentInputs, [post.id]: e.target.value })
                  }
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleAddComment(post.id);
                  }}
                  placeholder="Write a message or reply to this update..."
                  className="flex-1 bg-gray-50 text-xs text-gray-800 placeholder-gray-400 px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-blue-500 focus:bg-white transition"
                />
                <button
                  type="button"
                  onClick={() => handleAddComment(post.id)}
                  className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-lg transition shadow-xs cursor-pointer"
                >
                  Reply
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* 5. Create Team Post Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 backdrop-blur-[1px] animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-gray-200 animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <div>
                <h3 className="text-base font-bold text-gray-900 tracking-tight">
                  New Team Space Post
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Publish goals, shift schedules, or recognition alerts
                </p>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="w-7 h-7 rounded-md bg-gray-100 hover:bg-gray-200 text-gray-500 flex items-center justify-center cursor-pointer"
              >
                <CloseIcon className="w-3.5 h-3.5" />
              </button>
            </div>

            <form onSubmit={handleCreatePost} className="space-y-4 pt-4 text-xs">
              {/* Category Picker */}
              <div>
                <label className="block font-semibold text-gray-700 mb-1.5">
                  Post Category
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: "Goal", label: "🎯 Team Goal" },
                    { id: "Schedule", label: "📅 Shift Schedule" },
                    { id: "Recognition", label: "🏆 Recognition" },
                    { id: "Announcement", label: "📢 Bulletin" },
                  ].map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setPostForm({ ...postForm, category: cat.id as any })}
                      className={`p-2 rounded-lg font-bold text-center border transition cursor-pointer ${
                        postForm.category === cat.id
                          ? "bg-blue-50 border-blue-500 text-blue-700 shadow-xs"
                          : "bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100"
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  Post Title
                </label>
                <input
                  type="text"
                  required
                  value={postForm.title}
                  onChange={(e) => setPostForm({ ...postForm, title: e.target.value })}
                  placeholder={
                    postForm.category === "Goal"
                      ? "e.g. 🎯 Sprint 43: Core Microservice Migration"
                      : postForm.category === "Schedule"
                      ? "e.g. 📅 Week 38 Shift Rotation & On-Call Roster"
                      : postForm.category === "Recognition"
                      ? "e.g. 🏆 Team Kudos: Outstanding Performance Award"
                      : "e.g. 📢 Important Team Meeting Reminder"
                  }
                  className="w-full bg-white text-sm border border-gray-300 rounded-lg px-3 py-2 focus:ring-1 focus:ring-blue-500"
                />
              </div>

              {/* Category Specific Controls */}
              {postForm.category === "Goal" && (
                <div className="p-3 bg-blue-50 rounded-xl border border-blue-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="font-bold text-blue-900">
                      Initial Progress: {postForm.goalProgress}%
                    </label>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={postForm.goalProgress}
                    onChange={(e) => setPostForm({ ...postForm, goalProgress: Number(e.target.value) })}
                    className="w-full accent-blue-600 cursor-pointer"
                  />
                  <div>
                    <label className="block font-semibold text-blue-950 mb-1">
                      Target Completion Date
                    </label>
                    <input
                      type="date"
                      value={postForm.goalTargetDate}
                      onChange={(e) => setPostForm({ ...postForm, goalTargetDate: e.target.value })}
                      className="w-full bg-white text-xs border border-blue-300 rounded-lg px-3 py-1.5"
                    />
                  </div>
                </div>
              )}

              {postForm.category === "Schedule" && (
                <div className="p-3 bg-purple-50 rounded-xl border border-purple-200 space-y-2.5">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block font-semibold text-purple-950 mb-0.5">Shift Name</label>
                      <input
                        type="text"
                        value={postForm.shiftName}
                        onChange={(e) => setPostForm({ ...postForm, shiftName: e.target.value })}
                        className="w-full bg-white text-xs border border-purple-300 rounded-lg px-2.5 py-1.5"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-purple-950 mb-0.5">Shift Timing</label>
                      <input
                        type="text"
                        value={postForm.shiftTiming}
                        onChange={(e) => setPostForm({ ...postForm, shiftTiming: e.target.value })}
                        className="w-full bg-white text-xs border border-purple-300 rounded-lg px-2.5 py-1.5"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block font-semibold text-purple-950 mb-0.5">Effective Dates</label>
                    <input
                      type="text"
                      value={postForm.effectiveDates}
                      onChange={(e) => setPostForm({ ...postForm, effectiveDates: e.target.value })}
                      className="w-full bg-white text-xs border border-purple-300 rounded-lg px-2.5 py-1.5"
                    />
                  </div>
                </div>
              )}

              {postForm.category === "Recognition" && (
                <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 space-y-2.5">
                  <div>
                    <label className="block font-semibold text-amber-950 mb-1">
                      Direct Report Recipient
                    </label>
                    <select
                      value={postForm.targetEmployeeName}
                      onChange={(e) => setPostForm({ ...postForm, targetEmployeeName: e.target.value })}
                      className="w-full bg-white text-xs border border-amber-300 rounded-lg px-3 py-1.5 font-bold"
                    >
                      <option value="Carlos Mendez">Carlos Mendez (Junior Cloud Engineer)</option>
                      <option value="Liam O'Connor">Liam O'Connor (QA Automation Engineer)</option>
                      <option value="Maya Lin">Maya Lin (Frontend Engineer)</option>
                      <option value="Ethan Walker">Ethan Walker (UI Systems Developer)</option>
                      <option value="Rachel Kim">Rachel Kim (Growth Specialist)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-semibold text-amber-950 mb-1">
                      Award Badge
                    </label>
                    <select
                      value={postForm.badge}
                      onChange={(e) => setPostForm({ ...postForm, badge: e.target.value })}
                      className="w-full bg-white text-xs border border-amber-300 rounded-lg px-3 py-1.5 font-bold"
                    >
                      <option value="🌟 Sprint MVP">🌟 Sprint MVP</option>
                      <option value="⚡ Speed Demon">⚡ Speed Demon</option>
                      <option value="🎯 Target Achiever">🎯 Target Achiever</option>
                      <option value="💡 Innovation Star">💡 Innovation Star</option>
                      <option value="🛡️ Quality Guardian">🛡️ Quality Guardian</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Content / Body */}
              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  Message Content / Details
                </label>
                <textarea
                  rows={4}
                  required
                  value={postForm.content}
                  onChange={(e) => setPostForm({ ...postForm, content: e.target.value })}
                  placeholder="Share details, sprint objectives, shoutouts, or schedule notices..."
                  className="w-full bg-white text-sm border border-gray-300 rounded-lg p-3 focus:ring-1 focus:ring-blue-500"
                />
              </div>

              {/* Priority & Pinned */}
              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center space-x-2">
                  <label className="font-semibold text-gray-700">Priority:</label>
                  <select
                    value={postForm.priority}
                    onChange={(e) => setPostForm({ ...postForm, priority: e.target.value as any })}
                    className="bg-gray-50 border border-gray-300 rounded-md px-2 py-1 text-xs"
                  >
                    <option value="Normal">Normal</option>
                    <option value="Important">Important</option>
                    <option value="Urgent">Urgent</option>
                  </select>
                </div>

                <label className="flex items-center space-x-2 text-xs font-semibold text-gray-700 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={postForm.pinned}
                    onChange={(e) => setPostForm({ ...postForm, pinned: e.target.checked })}
                    className="w-4 h-4 rounded text-blue-600 border-gray-300"
                  />
                  <span>Pin to top of feed</span>
                </label>
              </div>

              <div className="flex items-center justify-end space-x-2 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-lg transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-sm transition cursor-pointer"
                >
                  Publish Post
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

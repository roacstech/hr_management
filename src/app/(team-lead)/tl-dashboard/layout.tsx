"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import {
  AttendanceIcon,
  LeaveTrackerIcon,
  BuildingIcon,
  GearIcon,
  BellIcon,
  PlusIcon,
  UserAvatarIcon,
  CloseIcon,
  LogoutIcon,
  TimeTrackerIcon,
} from "@/components/SidebarIcons";
import { TenantProvider, useTenant } from "@/context/TenantContext";
import AttendanceWidget from "@/components/AttendanceWidget";

function TeamLeadLayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const {
    currentOrg,
    notifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    clearAllNotifications,
    leaveRequests,
    timesheetCorrections,
    teamLeadProfile,
    showToast,
  } = useTenant();

  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
  const [isAttendanceMenuOpen, setIsAttendanceMenuOpen] = useState(false);

  const notificationDrawerRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const quickAddRef = useRef<HTMLDivElement>(null);
  const attendanceRef = useRef<HTMLDivElement>(null);

  // Total pending items requiring TL attention
  const pendingLeaves = leaveRequests.filter((l) => l.status === "Pending").length;
  const pendingCorrections = timesheetCorrections.filter((c) => c.status === "Pending").length;
  const totalPendingApprovals = pendingLeaves + pendingCorrections;

  // Main fixed sidebar dock items for Team Lead
  const dockMenuItems = [
    {
      name: "Dashboard",
      path: "/tl-dashboard/roster",
      icon: AttendanceIcon,
      badge: null,
    },
    {
      name: "My Attendance",
      path: "/tl-dashboard/attendance",
      icon: TimeTrackerIcon,
      badge: null,
    },
    {
      name: "My Leave",
      path: "/tl-dashboard/apply-leave",
      icon: LeaveTrackerIcon,
      badge: null,
    },
    {
      name: "Approvals",
      path: "/tl-dashboard/desk",
      icon: LeaveTrackerIcon,
      badge: totalPendingApprovals > 0 ? totalPendingApprovals : null,
    },
    {
      name: "Team Space",
      path: "/tl-dashboard/cms",
      icon: BuildingIcon,
      badge: null,
    },
    
    
  ];

  // Handle ESC key to close drawers / popups
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsNotificationsOpen(false);
        setIsProfileMenuOpen(false);
        setIsQuickAddOpen(false);
        setIsAttendanceMenuOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Handle Click Outside Drawers & Dropdowns
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (isNotificationsOpen && notificationDrawerRef.current && !notificationDrawerRef.current.contains(target)) {
        const bellBtn = document.getElementById("tl-bell-btn");
        if (!bellBtn || !bellBtn.contains(target)) {
          setIsNotificationsOpen(false);
        }
      }
      if (profileRef.current && !profileRef.current.contains(target)) {
        setIsProfileMenuOpen(false);
      }
      if (quickAddRef.current && !quickAddRef.current.contains(target)) {
        setIsQuickAddOpen(false);
      }
      if (attendanceRef.current && !attendanceRef.current.contains(target)) {
        setIsAttendanceMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isNotificationsOpen]);

  const isDockItemActive = (path: string) => {
    return pathname === path || pathname.startsWith(path + "/");
  };

  const unreadNotificationsCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="h-screen w-screen overflow-hidden flex bg-[#f8fafc] text-gray-900 antialiased font-sans">
      {/* 1. FIXED SLIM DARK DOCK SIDEBAR */}
      <aside className="w-[76px] h-screen shrink-0 bg-[#12182c] flex flex-col items-center justify-between py-3.5 px-1.5 border-r border-[#1e2642] z-30 select-none">
        <div className="w-full flex flex-col items-center">
          {/* Logo Brand Mark - Team Lead Gold Accent */}
          <Link
            href="/tl-dashboard/roster"
            className="flex flex-col items-center group transition-transform active:scale-95 mb-4"
            title="CrewSync Team Lead Workspace"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 via-orange-500 to-yellow-400 flex items-center justify-center text-white font-black text-xs shadow-md shadow-amber-500/25 group-hover:scale-105 transition-all duration-200">
              TL
            </div>
          </Link>

          {/* Primary Nav Menu List */}
          <nav className="w-full flex flex-col items-center space-y-2.5">
            {dockMenuItems.map((item) => {
              const active = isDockItemActive(item.path);
              const Icon = item.icon;

              return (
                <Link
                  key={item.name}
                  href={item.path}
                  className="flex flex-col items-center group w-full focus:outline-none relative"
                  title={item.name}
                >
                  <div
                    className={`w-[36px] h-[36px] rounded-lg flex items-center justify-center transition-all duration-200 relative ${
                      active
                        ? "bg-[#007aff] text-white shadow-md shadow-blue-600/35 scale-100 ring-2 ring-blue-400/20"
                        : "bg-[#1a223e]/70 text-[#93a2c7] hover:bg-[#222c50] hover:text-white border border-[#242f55]/60 hover:scale-105"
                    }`}
                  >
                    <Icon className="w-[17px] h-[17px]" size={17} />
                    {item.badge && item.badge > 0 && (
                      <span className="absolute -top-1 -right-1 w-4 h-4 bg-blue-600 text-white rounded-full text-[9px] font-extrabold flex items-center justify-center shadow-xs ring-2 ring-[#12182c]">
                        {item.badge}
                      </span>
                    )}
                  </div>
                  <span
                    className={`text-[9px] font-medium mt-1 text-center leading-tight tracking-tight max-w-[70px] transition-colors duration-200 ${
                      active
                        ? "text-white font-semibold"
                        : "text-[#8ea0c9] group-hover:text-white"
                    }`}
                  >
                    {item.name}
                  </span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Shortcut Back to Login */}
        <div className="w-full pt-3 flex flex-col items-center border-t border-[#1e2748]">
          <Link
            href="/login"
            className="w-7 h-7 rounded-md bg-[#1d2645]/50 hover:bg-red-500/20 text-gray-400 hover:text-red-400 flex items-center justify-center transition-all duration-200 text-xs font-semibold"
            title="Switch User / Sign Out"
          >
            <LogoutIcon className="w-3.5 h-3.5" size={14} />
          </Link>
          <span className="text-[8.5px] text-gray-400 mt-0.5">Logout</span>
        </div>
      </aside>

      {/* 2. NOTIFICATIONS OFFCANVAS DRAWER */}
      <div
        className={`fixed inset-0 bg-black/30 z-40 backdrop-blur-[1px] transition-opacity duration-300 ease-out ${
          isNotificationsOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsNotificationsOpen(false)}
      />

      <div
        ref={notificationDrawerRef}
        className={`fixed right-0 top-0 h-screen w-80 sm:w-[380px] bg-[#f8fafc] z-50 shadow-2xl border-l border-gray-200 flex flex-col transition-transform duration-300 ease-out transform ${
          isNotificationsOpen ? "translate-x-0" : "translate-x-full pointer-events-none"
        }`}
      >
        <div className="p-4 bg-white border-b border-gray-200 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-2">
            <h3 className="text-base font-bold text-gray-900 tracking-tight">
              Team Lead Activity
            </h3>
            {unreadNotificationsCount > 0 && (
              <span
                suppressHydrationWarning
                className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-blue-100 text-blue-700"
              >
                {unreadNotificationsCount} New
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={() => setIsNotificationsOpen(false)}
            className="w-7 h-7 rounded-md bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-800 flex items-center justify-center transition cursor-pointer"
            title="Close"
          >
            <CloseIcon className="w-3.5 h-3.5" size={14} />
          </button>
        </div>

        <div className="flex-1 p-4 overflow-y-auto space-y-3">
          {notifications.length === 0 ? (
            <div className="bg-white rounded-lg p-6 border border-gray-200/80 shadow-xs flex flex-col items-center justify-center text-center mt-8">
              <p className="text-sm font-semibold text-gray-600">No Notifications</p>
              <p className="text-xs text-gray-400 mt-1">Direct team roster and approvals are up to date.</p>
            </div>
          ) : (
            <>
              <div className="flex justify-between items-center px-1">
                <span className="text-xs font-semibold text-gray-500">Live Team Feed</span>
                <div className="flex items-center space-x-2">
                  {unreadNotificationsCount > 0 && (
                    <>
                      <button
                        type="button"
                        onClick={() => markAllNotificationsAsRead()}
                        className="text-xs text-blue-600 hover:text-blue-800 hover:underline font-medium cursor-pointer transition"
                      >
                        Mark all as read
                      </button>
                      <span className="text-gray-300">·</span>
                    </>
                  )}
                  <button
                    type="button"
                    onClick={() => clearAllNotifications()}
                    className="text-xs text-gray-500 hover:text-gray-800 hover:underline font-medium cursor-pointer transition"
                  >
                    Clear all
                  </button>
                </div>
              </div>

              {notifications.map((n) => (
                <div
                  key={n.id}
                  onClick={() => {
                    markNotificationAsRead(n.id);
                    if (n.link) {
                      setIsNotificationsOpen(false);
                      router.push(n.link);
                    }
                  }}
                  className={`p-3.5 rounded-lg border text-xs space-y-1.5 transition cursor-pointer group ${
                    !n.read
                      ? "bg-white border-amber-200 shadow-xs ring-1 ring-amber-50"
                      : "bg-white/80 border-gray-200/80 text-gray-600 opacity-80 hover:opacity-100"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center space-x-1.5 min-w-0">
                      {!n.read && (
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                      )}
                      <span className="font-bold text-gray-900 leading-tight truncate">{n.title}</span>
                    </div>
                    <div className="flex items-center space-x-2 shrink-0">
                      <span className="text-[10px] text-gray-400 font-medium">{n.timestamp}</span>
                      {!n.read && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            markNotificationAsRead(n.id);
                          }}
                          className="text-[10px] text-blue-600 hover:text-blue-800 font-bold hover:underline bg-blue-50 hover:bg-blue-100 px-1.5 py-0.5 rounded transition cursor-pointer"
                          title="Mark this notification as read"
                        >
                          Mark as read
                        </button>
                      )}
                    </div>
                  </div>
                  <p className="text-gray-600 leading-relaxed text-[11.5px]">{n.message}</p>
                </div>
              ))}
            </>
          )}
        </div>
      </div>

      {/* 3. MAIN WORKSPACE VIEW */}
      <div className="flex-1 h-screen flex flex-col min-w-0 overflow-hidden">
        {/* Sleek Enterprise Top Navbar */}
        <header className="h-14 bg-[#141b34] border-b border-[#1e2748] flex items-center justify-between px-5 shrink-0 z-20 select-none">
          {/* Left: Top Navbar Left Spacer */}
          <div className="flex items-center space-x-3" />

          {/* TOP RIGHT CORNER MENUS */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Quick Add Button (+) */}
            <div className="relative" ref={quickAddRef}>
              <button
                type="button"
                onClick={() => {
                  setIsQuickAddOpen((p) => !p);
                  setIsNotificationsOpen(false);
                  setIsProfileMenuOpen(false);
                  setIsAttendanceMenuOpen(false);
                }}
                className="h-8 px-2.5 rounded-lg bg-[#007aff] hover:bg-[#006ee0] active:scale-95 text-white flex items-center space-x-1.5 transition-all duration-150 shadow-md shadow-blue-500/25 cursor-pointer focus:outline-none text-xs font-semibold"
                title="Quick Action"
              >
                <PlusIcon className="w-3.5 h-3.5 text-white" size={14} />
                <span className="hidden sm:inline">Quick Action</span>
              </button>

              {/* Quick Add Dropdown Menu */}
              {isQuickAddOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-2xl border border-gray-100 p-2 z-50 animate-in fade-in zoom-in-95 duration-100 select-none">
                  <div className="px-3 py-1.5 border-b border-gray-100 mb-1">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Team Lead Shortcuts</p>
                  </div>
                  <Link
                    href="/tl-dashboard/desk"
                    onClick={() => setIsQuickAddOpen(false)}
                    className="flex items-center px-3 py-2 text-xs font-semibold text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-md transition group"
                  >
                    <LeaveTrackerIcon className="w-4 h-4 mr-2.5 text-gray-400 group-hover:text-blue-600 transition-colors shrink-0" size={16} />
                    <span>Review Approvals</span>
                    {totalPendingApprovals > 0 && (
                      <span className="ml-auto bg-amber-100 text-amber-800 text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                        {totalPendingApprovals}
                      </span>
                    )}
                  </Link>
                  <Link
                    href="/tl-dashboard/roster"
                    onClick={() => setIsQuickAddOpen(false)}
                    className="flex items-center px-3 py-2 text-xs font-semibold text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-md transition group"
                  >
                    <AttendanceIcon className="w-4 h-4 mr-2.5 text-gray-400 group-hover:text-blue-600 transition-colors shrink-0" size={16} />
                    <span>Track Live Shifts</span>
                  </Link>
                  <Link
                    href="/tl-dashboard/cms"
                    onClick={() => setIsQuickAddOpen(false)}
                    className="flex items-center px-3 py-2 text-xs font-semibold text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-md transition group"
                  >
                    <BuildingIcon className="w-4 h-4 mr-2.5 text-gray-400 group-hover:text-blue-600 transition-colors shrink-0" size={16} />
                    <span>Post in Team Space</span>
                  </Link>
                </div>
              )}
            </div>

            {/* Notification Bell Icon */}
            <button
              id="tl-bell-btn"
              type="button"
              onClick={() => {
                setIsNotificationsOpen((p) => !p);
                setIsQuickAddOpen(false);
                setIsProfileMenuOpen(false);
                setIsAttendanceMenuOpen(false);
              }}
              className="w-8 h-8 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 flex items-center justify-center transition-all duration-150 cursor-pointer focus:outline-none relative"
              title="Team Notifications"
            >
              <BellIcon className="w-4 h-4" size={16} />
              {unreadNotificationsCount > 0 && (
                <span
                  suppressHydrationWarning
                  className="absolute -top-1 -right-1 min-w-[16px] h-[16px] px-1 rounded-full bg-amber-500 text-white text-[9.5px] font-bold flex items-center justify-center ring-2 ring-[#141b34]"
                >
                  {unreadNotificationsCount}
                </span>
              )}
            </button>

            {/* Attendance Widget Toggle */}
            <div className="relative" ref={attendanceRef}>
              <button
                type="button"
                onClick={() => {
                  setIsAttendanceMenuOpen((p) => !p);
                  setIsQuickAddOpen(false);
                  setIsNotificationsOpen(false);
                  setIsProfileMenuOpen(false);
                }}
                className="w-8 h-8 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 flex items-center justify-center transition-all duration-150 cursor-pointer focus:outline-none"
                title="Mark Attendance"
              >
                <AttendanceIcon className="w-4 h-4" size={16} />
              </button>

              {isAttendanceMenuOpen && (
                <div className="absolute right-0 mt-3 pt-6 z-50 animate-in fade-in zoom-in-95 duration-100">
                  <AttendanceWidget />
                </div>
              )}
            </div>

            {/* Settings Gear Icon */}
            <Link
              href="/tl-dashboard/settings"
              className="w-8 h-8 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 flex items-center justify-center transition-all duration-150 cursor-pointer focus:outline-none"
              title="Team Lead Settings & Preferences"
            >
              <GearIcon className="w-4 h-4" size={16} />
            </Link>

            {/* User Avatar Icon */}
            <div className="relative" ref={profileRef}>
              <button
                type="button"
                onClick={() => {
                  setIsProfileMenuOpen((p) => !p);
                  setIsQuickAddOpen(false);
                  setIsNotificationsOpen(false);
                  setIsAttendanceMenuOpen(false);
                }}
                className="w-8 h-8 rounded-lg border border-amber-400/40 hover:border-amber-400 bg-amber-500/10 transition cursor-pointer flex items-center justify-center focus:outline-none overflow-hidden"
                title="Team Lead Profile"
              >
                {teamLeadProfile?.profileImageUrl ? (
                  <img
                    src={teamLeadProfile.profileImageUrl}
                    alt={teamLeadProfile?.name || "TL"}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-amber-300 text-xs font-black">
                    {teamLeadProfile?.avatar || "SC"}
                  </span>
                )}
              </button>

              {isProfileMenuOpen && (
                <div className="absolute right-0 mt-3 w-60 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50 animate-in fade-in zoom-in-95 duration-100 text-xs">
                  <div className="px-4 py-2.5 border-b border-gray-100 flex items-center space-x-2.5">
                    <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-800 font-bold flex items-center justify-center text-xs overflow-hidden shrink-0">
                      {teamLeadProfile?.profileImageUrl ? (
                        <img
                          src={teamLeadProfile.profileImageUrl}
                          alt={teamLeadProfile?.name || "TL"}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        teamLeadProfile?.avatar || "SC"
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-bold text-gray-900 leading-tight truncate">
                        {teamLeadProfile?.name || "Sarah Chen"}
                      </p>
                      <p className="text-[11px] text-gray-500 truncate leading-tight mt-0.5">
                        {teamLeadProfile?.designation || "Frontend Tech Lead"}
                      </p>
                      <span className="inline-block mt-1 px-1.5 py-0.5 rounded text-[9.5px] font-semibold bg-amber-50 text-amber-700 border border-amber-200/60">
                        {teamLeadProfile?.role || "Team Lead"}
                      </span>
                    </div>
                  </div>
                  <Link
                    href="/tl-dashboard/profile"
                    onClick={() => setIsProfileMenuOpen(false)}
                    className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition font-medium"
                  >
                    <UserAvatarIcon className="w-3.5 h-3.5 mr-2 text-gray-400" size={15} />
                    My Profile
                  </Link>
                  <Link
                    href="/tl-dashboard/settings"
                    onClick={() => setIsProfileMenuOpen(false)}
                    className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition font-medium"
                  >
                    <GearIcon className="w-3.5 h-3.5 mr-2 text-gray-400" size={15} />
                    Team Preferences
                  </Link>
                  <Link
                    href="/login"
                    className="flex items-center px-4 py-2 text-red-600 hover:bg-red-50 transition font-semibold border-t border-gray-100 mt-1"
                  >
                    <LogoutIcon className="w-3.5 h-3.5 mr-2 text-red-500" size={15} />
                    Sign Out
                  </Link>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Independently Scrollable Page Workspace Area */}
        <main className="flex-1 overflow-y-auto p-6 sm:p-8 bg-[#f8fafc]">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>

      {/* Team Lead Settings Page is handled by /tl-dashboard/settings route */}
    </div>
  );
}

export default function TeamLeadLayout({ children }: { children: React.ReactNode }) {
  return (
    <TenantProvider>
      <TeamLeadLayoutContent>{children}</TeamLeadLayoutContent>
    </TenantProvider>
  );
}

"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import {
  HomeIcon,
  OperationsIcon,
  TrophyIcon,
  BuildingIcon,
  GearIcon,
  SearchIcon,
  BellIcon,
  PlusIcon,
  UserAvatarIcon,
  CloseIcon,
  LogoutIcon,
} from "@/components/SidebarIcons";
import { TenantProvider, useTenant } from "@/context/TenantContext";

function ManagerPortalLayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const {
    notifications,
    markNotificationAsRead,
    clearAllNotifications,
  } = useTenant();

  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);

  const notificationDrawerRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const quickAddRef = useRef<HTMLDivElement>(null);

  // Main fixed sidebar dock items for Manager
  const dockMenuItems = [
    { name: "Overview", path: "/manager-dashboard", icon: HomeIcon, exact: true },
    { name: "Approvals", path: "/manager-dashboard/approvals", icon: OperationsIcon },
    // { name: "Performance", path: "/manager-dashboard/performance", icon: TrophyIcon },
    { name: "Dept Hub", path: "/manager-dashboard/cms", icon: BuildingIcon },
  ];

  // Handle ESC key to close drawers / popups
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsNotificationsOpen(false);
        setIsProfileMenuOpen(false);
        setIsQuickAddOpen(false);
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
        const bellBtn = document.getElementById("top-bell-notification-btn");
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
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isNotificationsOpen]);

  const isDockItemActive = (item: { path: string; exact?: boolean }) => {
    if (item.exact) {
      return pathname === item.path;
    }
    return pathname === item.path || pathname.startsWith(item.path + "/");
  };

  const unreadNotificationsCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="h-screen w-screen overflow-hidden flex bg-[#f8fafc] text-gray-900 antialiased font-sans">
      {/* 1. FIXED SLIM DARK DOCK SIDEBAR */}
      <aside className="w-[76px] h-screen shrink-0 bg-[#12182c] flex flex-col items-center justify-between py-3.5 px-1.5 border-r border-[#1e2642] z-30 select-none">
        <div className="w-full flex flex-col items-center">
          {/* Logo Brand Mark */}
          <Link
            href="/manager-dashboard"
            className="flex flex-col items-center group transition-transform active:scale-95 mb-4"
            title="CrewSync Manager Portal"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-500 via-violet-500 to-indigo-500 flex items-center justify-center text-white font-black text-sm shadow-md shadow-purple-500/20 group-hover:scale-105 transition-all duration-200">
              M
            </div>
          </Link>

          {/* Primary Nav Menu List */}
          <nav className="w-full flex flex-col items-center space-y-2">
            {dockMenuItems.map((item) => {
              const active = isDockItemActive(item);
              const Icon = item.icon;

              return (
                <Link
                  key={item.name}
                  href={item.path}
                  className="flex flex-col items-center group w-full focus:outline-none"
                  title={item.name}
                >
                  <div
                    className={`w-[36px] h-[36px] rounded-lg flex items-center justify-center transition-all duration-200 ${
                      active
                        ? "bg-[#007aff] text-white shadow-md shadow-blue-600/35 scale-100 ring-2 ring-blue-400/20"
                        : "bg-[#1a223e]/70 text-[#93a2c7] hover:bg-[#222c50] hover:text-white border border-[#242f55]/60 hover:scale-105"
                    }`}
                  >
                    <Icon className="w-[17px] h-[17px]" size={17} />
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
            title="Switch User / Logout"
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
              Manager Notifications
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
              <p className="text-xs text-gray-400 mt-1">You are all caught up!</p>
            </div>
          ) : (
            <>
              <div className="flex justify-between items-center px-1">
                <span className="text-xs font-semibold text-gray-500">Activity Stream</span>
                <button
                  type="button"
                  onClick={() => clearAllNotifications()}
                  className="text-xs text-blue-600 hover:underline font-medium"
                >
                  Clear all
                </button>
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
                  className={`p-3.5 rounded-lg border text-xs space-y-1.5 transition cursor-pointer ${
                    !n.read
                      ? "bg-white border-blue-200 shadow-xs ring-1 ring-blue-50"
                      : "bg-white/80 border-gray-200/80 text-gray-600 opacity-80 hover:opacity-100"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-gray-900 leading-tight">{n.title}</span>
                    <span className="text-[10px] text-gray-400 font-medium">{n.timestamp}</span>
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
          <div className="flex items-center space-x-3">
             <span className="text-white text-sm font-bold opacity-80">Manager Space</span>
          </div>

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
                }}
                className="h-8 px-2.5 rounded-lg bg-[#007aff] hover:bg-[#006ee0] active:scale-95 text-white flex items-center space-x-1.5 transition-all duration-150 shadow-md shadow-blue-500/25 cursor-pointer focus:outline-none text-xs font-semibold"
                title="Quick Action"
              >
                <PlusIcon className="w-3.5 h-3.5 text-white" size={14} />
                <span className="hidden sm:inline">Action</span>
              </button>

              {/* Quick Add Dropdown Menu */}
              {isQuickAddOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-2xl border border-gray-100 p-2 z-50 animate-in fade-in zoom-in-95 duration-100 select-none">
                   <Link
                     href="/manager-dashboard/performance"
                     onClick={() => setIsQuickAddOpen(false)}
                     className="flex items-center px-3 py-2 text-xs font-semibold text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-md transition group"
                   >
                     <TrophyIcon className="w-4 h-4 mr-2.5 text-gray-400 group-hover:text-blue-600 transition-colors shrink-0" size={16} />
                     <span>New Appraisal</span>
                   </Link>
                   <Link
                     href="/manager-dashboard/cms"
                     onClick={() => setIsQuickAddOpen(false)}
                     className="flex items-center px-3 py-2 text-xs font-semibold text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-md transition group"
                   >
                     <BuildingIcon className="w-4 h-4 mr-2.5 text-gray-400 group-hover:text-blue-600 transition-colors shrink-0" size={16} />
                     <span>Post Update</span>
                   </Link>
                </div>
              )}
            </div>

            {/* Notification Bell Icon */}
            <button
              id="top-bell-notification-btn"
              type="button"
              onClick={() => {
                setIsNotificationsOpen((p) => !p);
                setIsQuickAddOpen(false);
                setIsProfileMenuOpen(false);
              }}
              className="w-8 h-8 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 flex items-center justify-center transition-all duration-150 cursor-pointer focus:outline-none relative"
              title="Notifications"
            >
              <BellIcon className="w-4 h-4" size={16} />
              {unreadNotificationsCount > 0 && (
                <span
                  suppressHydrationWarning
                  className="absolute -top-1 -right-1 min-w-[16px] h-[16px] px-1 rounded-full bg-blue-500 text-white text-[9.5px] font-bold flex items-center justify-center ring-2 ring-[#141b34]"
                >
                  {unreadNotificationsCount}
                </span>
              )}
            </button>

            {/* User Avatar Icon */}
            <div className="relative" ref={profileRef}>
              <button
                type="button"
                onClick={() => {
                  setIsProfileMenuOpen((p) => !p);
                  setIsQuickAddOpen(false);
                  setIsNotificationsOpen(false);
                }}
                className="w-8 h-8 rounded-lg border border-white/20 hover:border-blue-400 bg-white/10 transition cursor-pointer flex items-center justify-center focus:outline-none overflow-hidden"
                title="Manager Account"
              >
                <UserAvatarIcon className="w-5 h-5 text-gray-200" size={20} />
              </button>

              {isProfileMenuOpen && (
                <div className="absolute right-0 mt-3 w-60 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50 animate-in fade-in zoom-in-95 duration-100 text-xs">
                  <div className="px-4 py-2.5 border-b border-gray-100 flex items-center space-x-2.5">
                    <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-800 font-bold flex items-center justify-center text-xs">
                      SJ
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-bold text-gray-900 leading-tight truncate">Sarah Jenkins</p>
                      <p className="text-[11px] text-gray-500 truncate leading-tight mt-0.5">
                        Engineering Director
                      </p>
                      <span className="inline-block mt-1 px-1.5 py-0.5 rounded text-[9.5px] font-semibold bg-gray-100 text-gray-800">
                        Department Manager
                      </span>
                    </div>
                  </div>
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
    </div>
  );
}

export default function ManagerPortalLayout({ children }: { children: React.ReactNode }) {
  return (
    <TenantProvider>
      <ManagerPortalLayoutContent>{children}</ManagerPortalLayoutContent>
    </TenantProvider>
  );
}

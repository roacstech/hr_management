"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import {
  HomeIcon,
  OnboardingIcon,
  LeaveTrackerIcon,
  AttendanceIcon,
  MoreIcon,
  OperationsIcon,
  ReportsIcon,
  TrophyIcon,
  FolderIcon,
  EngagementIcon,
  StarIcon,
  TasksIcon,
  CompensationIcon,
  BuildingIcon,
  GearIcon,
  SearchIcon,
  BellIcon,
  PlusIcon,
  UserAvatarIcon,
  CloseIcon,
  LogoutIcon,
} from "@/components/SidebarIcons";
import EmptyState from "@/components/EmptyState";
import { TenantProvider, useTenant } from "@/context/TenantContext";

interface ServiceItem {
  id: string;
  title: string;
  path: string;
  icon: React.ComponentType<{ className?: string; size?: number }>;
}

function HRAdminLayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const {
    notifications,
    markNotificationAsRead,
    clearAllNotifications,
  } = useTenant();

  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [quickActionSearch, setQuickActionSearch] = useState("");

  const quickActionsList: Array<{
    title: string;
    path: string;
    icon: React.ComponentType<{ className?: string; size?: number }>;
  }> = [
    { title: "New Employee", path: "/hr-dashboard/employees?action=add", icon: OnboardingIcon },
    { title: "Bulk Import Staff", path: "/hr-dashboard/employees?action=import", icon: FolderIcon },
    { title: "Process Payroll", path: "/hr-dashboard/payroll", icon: CompensationIcon },
    { title: "Leave Policies", path: "/hr-dashboard/settings?tab=leave-policies", icon: LeaveTrackerIcon },
    { title: "Work Shifts", path: "/hr-dashboard/settings?tab=work-shifts", icon: BuildingIcon },
    { title: "New Announcement", path: "/hr-dashboard/cms?action=new-announcement", icon: StarIcon },
    { title: "Knowledge Base Article", path: "/hr-dashboard/cms?tab=handbook", icon: TrophyIcon },
    { title: "Subscription & Limits", path: "/hr-dashboard/settings?tab=subscription", icon: GearIcon },
    { title: "Audit Trail", path: "/hr-dashboard/settings?tab=audit-logs", icon: ReportsIcon },
  ];

  const filteredQuickActions = quickActionsList.filter((item) =>
    item.title.toLowerCase().includes(quickActionSearch.toLowerCase().trim())
  );

  const offcanvasRef = useRef<HTMLDivElement>(null);
  const notificationDrawerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const quickAddRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  // Main fixed sidebar dock items
  const dockMenuItems = [
    { name: "Dashboard", path: "/hr-dashboard", icon: HomeIcon, exact: true },
    { name: "Employees", path: "/hr-dashboard/employees", icon: OnboardingIcon },
    { name: "Payroll", path: "/hr-dashboard/payroll", icon: CompensationIcon },
    { name: "Leaves", path: "/hr-dashboard/leave-tracker", icon: LeaveTrackerIcon },
    { name: "Attendance", path: "/hr-dashboard/attendance", icon: AttendanceIcon },
    { name: "Bulletins", path: "/hr-dashboard/cms", icon: BuildingIcon },
    { name: "Settings", path: "/hr-dashboard/settings", icon: GearIcon },
  ];

  // Services inside the More Offcanvas Drawer
  const servicesList: ServiceItem[] = [
    { id: "performance", title: "Performance Appraisals", path: "/hr-dashboard/performance", icon: TrophyIcon },
    { id: "files", title: "Document Vault", path: "/hr-dashboard/files", icon: FolderIcon },
    { id: "engagement", title: "Employee Surveys & Culture", path: "/hr-dashboard/engagement", icon: EngagementIcon },
    { id: "hr-letters", title: "Official HR Letters", path: "/hr-dashboard/hr-letters", icon: StarIcon },
    { id: "travel", title: "Business Travel Requests", path: "/hr-dashboard/travel", icon: StarIcon },
    { id: "tasks", title: "Operations Tasks", path: "/hr-dashboard/tasks", icon: TasksIcon },
    { id: "operations", title: "Workforce Operations", path: "/hr-dashboard/operations", icon: OperationsIcon },
    { id: "reports", title: "Executive Reports", path: "/hr-dashboard/reports", icon: ReportsIcon },
    { id: "onboarding", title: "Candidate Pipelines", path: "/hr-dashboard/onboarding", icon: OnboardingIcon },
  ];

  const filteredServices = servicesList.filter((service) =>
    service.title.toLowerCase().includes(searchQuery.toLowerCase().trim())
  );

  // Focus search input when offcanvas opens
  useEffect(() => {
    if (isMoreOpen) {
      const timer = setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isMoreOpen]);

  // Handle ESC key to close offcanvas / drawers / popups
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsMoreOpen(false);
        setIsQuickAddOpen(false);
        setIsNotificationsOpen(false);
        setIsProfileMenuOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Handle Click Outside Drawers & Dropdowns
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (isMoreOpen && offcanvasRef.current && !offcanvasRef.current.contains(target)) {
        const moreBtn = document.getElementById("more-menu-toggle-btn");
        if (!moreBtn || !moreBtn.contains(target)) {
          setIsMoreOpen(false);
        }
      }
      if (isNotificationsOpen && notificationDrawerRef.current && !notificationDrawerRef.current.contains(target)) {
        const bellBtn = document.getElementById("top-bell-notification-btn");
        if (!bellBtn || !bellBtn.contains(target)) {
          setIsNotificationsOpen(false);
        }
      }
      if (quickAddRef.current && !quickAddRef.current.contains(target)) {
        setIsQuickAddOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(target)) {
        setIsProfileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMoreOpen, isNotificationsOpen]);

  const isDockItemActive = (item: { path: string; exact?: boolean }) => {
    if (item.exact) {
      return pathname === item.path;
    }
    return pathname === item.path || pathname.startsWith(item.path + "/");
  };

  const isMoreActive =
    isMoreOpen ||
    servicesList.some((s) => pathname === s.path || pathname.startsWith(s.path + "/"));

  const unreadNotificationsCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="h-screen w-screen overflow-hidden flex bg-[#f8fafc] text-gray-900 antialiased font-sans">
      {/* 1. FIXED SLIM DARK DOCK SIDEBAR */}
      <aside className="w-[76px] h-screen shrink-0 bg-[#12182c] flex flex-col items-center justify-between py-3.5 px-1.5 border-r border-[#1e2642] z-30 select-none">
        <div className="w-full flex flex-col items-center">
          {/* Logo Brand Mark */}
          <Link
            href="/hr-dashboard"
            className="flex flex-col items-center group transition-transform active:scale-95 mb-4"
            title="CrewSync HR Portal"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-500 flex items-center justify-center text-white font-black text-sm shadow-md shadow-blue-500/20 group-hover:scale-105 transition-all duration-200">
              C
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
                  onClick={() => setIsMoreOpen(false)}
                  className="flex flex-col items-center group w-full focus:outline-none"
                  title={item.name}
                >
                  <div
                    className={`w-[36px] h-[36px] rounded-lg flex items-center justify-center transition-all duration-200 ${
                      active && !isMoreOpen
                        ? "bg-[#007aff] text-white shadow-md shadow-blue-600/35 scale-100 ring-2 ring-blue-400/20"
                        : "bg-[#1a223e]/70 text-[#93a2c7] hover:bg-[#222c50] hover:text-white border border-[#242f55]/60 hover:scale-105"
                    }`}
                  >
                    <Icon className="w-[17px] h-[17px]" size={17} />
                  </div>
                  <span
                    className={`text-[9px] font-medium mt-1 text-center leading-tight tracking-tight max-w-[70px] transition-colors duration-200 ${
                      active && !isMoreOpen
                        ? "text-white font-semibold"
                        : "text-[#8ea0c9] group-hover:text-white"
                    }`}
                  >
                    {item.name}
                  </span>
                </Link>
              );
            })}

            {/* "More" Toggle Button */}
            <button
              id="more-menu-toggle-btn"
              type="button"
              onClick={() => setIsMoreOpen((prev) => !prev)}
              className="flex flex-col items-center group w-full focus:outline-none cursor-pointer pt-0.5"
              title="More HR Modules"
            >
              <div
                className={`w-[36px] h-[36px] rounded-lg flex items-center justify-center transition-all duration-200 ${
                  isMoreActive
                    ? "bg-[#007aff] text-white shadow-md shadow-blue-600/35 scale-100 ring-2 ring-blue-400/20"
                    : "bg-[#1a223e]/70 text-[#93a2c7] hover:bg-[#222c50] hover:text-white border border-[#242f55]/60 hover:scale-105"
                }`}
              >
                <MoreIcon className="w-[17px] h-[17px]" size={17} />
              </div>
              <span
                className={`text-[9px] font-medium mt-1 text-center leading-tight tracking-tight max-w-[70px] transition-colors duration-200 ${
                  isMoreActive ? "text-white font-semibold" : "text-[#8ea0c9] group-hover:text-white"
                }`}
              >
                More
              </span>
            </button>
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

      {/* 2. SERVICES OFFCANVAS DRAWER */}
      {isMoreOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/35 z-35 backdrop-blur-[1px] transition-opacity duration-200"
            onClick={() => setIsMoreOpen(false)}
          />
          <div
            ref={offcanvasRef}
            className="fixed left-[76px] top-0 h-screen w-80 sm:w-[330px] bg-white z-40 shadow-2xl border-r border-gray-200 flex flex-col animate-in slide-in-from-left duration-200 ease-out"
          >
            <div className="p-4 border-b border-gray-100 space-y-3">
              <div className="relative flex items-center">
                <SearchIcon className="w-4 h-4 text-gray-400 absolute left-3 pointer-events-none" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search HR modules..."
                  className="w-full bg-white text-xs sm:text-sm text-gray-800 placeholder-gray-400 pl-9 pr-8 py-2 rounded-md border border-gray-200 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition shadow-xs"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="absolute right-2.5 text-gray-400 hover:text-gray-600"
                  >
                    <CloseIcon className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              <div className="flex items-center justify-between pt-0.5 px-0.5">
                <h3 className="text-xs sm:text-sm font-bold text-gray-900 tracking-tight">
                  Additional Services
                </h3>
                <Link
                  href="/hr-dashboard/settings"
                  onClick={() => setIsMoreOpen(false)}
                  className="inline-flex items-center text-[11px] sm:text-xs font-semibold text-blue-600 hover:text-blue-700 transition"
                >
                  <GearIcon className="w-3 h-3 mr-1" />
                  Settings
                </Link>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-3 space-y-2">
              {filteredServices.length > 0 ? (
                filteredServices.map((service) => {
                  const Icon = service.icon;
                  const active = pathname === service.path;

                  return (
                    <button
                      key={service.id}
                      type="button"
                      onClick={() => {
                        setIsMoreOpen(false);
                        router.push(service.path);
                      }}
                      className={`w-full flex items-center px-3.5 py-2.5 rounded-md border text-left transition-all duration-150 group cursor-pointer ${
                        active
                          ? "bg-blue-50/80 border-blue-200 shadow-xs text-blue-700"
                          : "bg-white border-gray-100 hover:border-gray-200 hover:bg-gray-50/80 hover:shadow-xs text-gray-800"
                      }`}
                    >
                      <div
                        className={`w-7 h-7 rounded-sm flex items-center justify-center mr-3 transition-colors shrink-0 ${
                          active
                            ? "text-blue-600 bg-blue-100/60"
                            : "text-gray-600 group-hover:text-blue-600 group-hover:bg-blue-50"
                        }`}
                      >
                        <Icon className="w-4 h-4" size={16} />
                      </div>
                      <span className="text-xs sm:text-sm font-medium tracking-tight">
                        {service.title}
                      </span>
                    </button>
                  );
                })
              ) : (
                <EmptyState
                  title="No service found"
                  description={`No services match "${searchQuery}"`}
                  className="my-4 p-4 border-none shadow-none"
                />
              )}
            </div>
          </div>
        </>
      )}

      {/* 3. NOTIFICATIONS OFFCANVAS DRAWER */}
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
              Tenant Notifications
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
              <EmptyState
                title="No Notifications Found"
                description="Everything is up to date for this organization."
                className="border-none shadow-none p-0"
              />
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

      {/* 4. MAIN WORKSPACE VIEW */}
      <div className="flex-1 h-screen flex flex-col min-w-0 overflow-hidden">
        {/* Sleek Enterprise Top Navbar */}
        <header className="h-14 bg-[#141b34] border-b border-[#1e2748] flex items-center justify-between px-5 shrink-0 z-20 select-none">
          {/* Left: Top Navbar Left Spacer */}
          <div className="flex items-center space-x-3" />

          {/* TOP RIGHT CORNER MENUS */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* 1. Quick Add Button (+) */}
            <div className="relative" ref={quickAddRef}>
              <button
                type="button"
                onClick={() => {
                  setIsQuickAddOpen((p) => !p);
                  setIsNotificationsOpen(false);
                  setIsProfileMenuOpen(false);
                }}
                className="h-8 px-2.5 rounded-lg bg-[#007aff] hover:bg-[#006ee0] active:scale-95 text-white flex items-center space-x-1.5 transition-all duration-150 shadow-md shadow-blue-500/25 cursor-pointer focus:outline-none text-xs font-semibold"
                title="Quick Create"
              >
                <PlusIcon className="w-3.5 h-3.5 text-white" size={14} />
                {/* <span className="hidden sm:inline">Quick Action</span> */}
              </button>

              {/* Quick Add Dropdown Menu */}
              {isQuickAddOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-2xl border border-gray-100 p-3 z-50 animate-in fade-in zoom-in-95 duration-100 select-none">
                  <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                    <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wide">
                      HR Quick Actions
                    </h3>
                  </div>

                  <div className="my-2">
                    <input
                      type="text"
                      placeholder="Search actions..."
                      value={quickActionSearch}
                      onChange={(e) => setQuickActionSearch(e.target.value)}
                      autoFocus
                      className="w-full bg-white text-xs text-gray-800 placeholder-gray-400 px-3 py-1.5 rounded-md border border-gray-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition shadow-2xs"
                    />
                  </div>

                  <div className="max-h-64 overflow-y-auto space-y-1">
                    {filteredQuickActions.length > 0 ? (
                      filteredQuickActions.map((action) => {
                        const Icon = action.icon;
                        return (
                          <Link
                            key={action.title}
                            href={action.path}
                            onClick={() => {
                              setIsQuickAddOpen(false);
                              setQuickActionSearch("");
                            }}
                            className="flex items-center px-3 py-2 text-xs font-semibold text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-md transition group"
                          >
                            <Icon
                              className="w-4 h-4 mr-2.5 text-gray-400 group-hover:text-blue-600 transition-colors shrink-0"
                              size={16}
                            />
                            <span>{action.title}</span>
                          </Link>
                        );
                      })
                    ) : (
                      <p className="text-xs text-gray-400 py-3 text-center">No actions found</p>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* 2. Search Icon Button */}
            <button
              type="button"
              onClick={() => setIsMoreOpen(true)}
              className="w-8 h-8 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 flex items-center justify-center transition-all duration-150 cursor-pointer focus:outline-none"
              title="Search HR Modules"
            >
              <SearchIcon className="w-4 h-4" size={16} />
            </button>

            {/* 3. Notification Bell Icon */}
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

            {/* 4. Settings Gear Icon */}
            <Link
              href="/hr-dashboard/settings"
              className="w-8 h-8 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 flex items-center justify-center transition-all duration-150 cursor-pointer focus:outline-none"
              title="Company Settings"
            >
              <GearIcon className="w-4 h-4" size={16} />
            </Link>

            {/* 5. User Avatar Icon */}
            <div className="relative" ref={profileRef}>
              <button
                type="button"
                onClick={() => {
                  setIsProfileMenuOpen((p) => !p);
                  setIsQuickAddOpen(false);
                  setIsNotificationsOpen(false);
                }}
                className="w-8 h-8 rounded-lg border border-white/20 hover:border-blue-400 bg-white/10 transition cursor-pointer flex items-center justify-center focus:outline-none overflow-hidden"
                title="Tenant Admin Account"
              >
                <UserAvatarIcon className="w-5 h-5 text-gray-200" size={20} />
              </button>

              {isProfileMenuOpen && (
                <div className="absolute right-0 mt-3 w-60 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50 animate-in fade-in zoom-in-95 duration-100 text-xs">
                  <div className="px-4 py-2.5 border-b border-gray-100 flex items-center space-x-2.5">
                    <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-800 font-bold flex items-center justify-center text-xs">
                      AP
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-bold text-gray-900 leading-tight truncate">Amira Patel</p>
                      <p className="text-[11px] text-gray-500 truncate leading-tight mt-0.5">
                        HR Operations Director
                      </p>
                      <span className="inline-block mt-1 px-1.5 py-0.5 rounded text-[9.5px] font-semibold bg-emerald-100 text-emerald-800">
                        Tenant Admin
                      </span>
                    </div>
                  </div>
                  <Link
                    href="/hr-dashboard/settings"
                    onClick={() => setIsProfileMenuOpen(false)}
                    className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition font-medium"
                  >
                    <GearIcon className="w-3.5 h-3.5 mr-2 text-gray-400" size={15} />
                    Company Settings & Shifts
                  </Link>
                  <Link
                    href="/hr-dashboard/settings?tab=subscription"
                    onClick={() => setIsProfileMenuOpen(false)}
                    className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition font-medium"
                  >
                    <BuildingIcon className="w-3.5 h-3.5 mr-2 text-gray-400" size={15} />
                    Billing & Subscription
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
    </div>
  );
}

export default function HRAdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <TenantProvider>
      <HRAdminLayoutContent>{children}</HRAdminLayoutContent>
    </TenantProvider>
  );
}

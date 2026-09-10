"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, useRef, useMemo, useCallback, Suspense } from "react";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  Search,
  Bell,
  Plus,
  LogOut,
  Sun,
  Moon,
  CloudSun,
  MapPin,
} from "lucide-react";
import {
  HomeIcon,
  OnboardingIcon,
  LeaveTrackerIcon,
  AttendanceIcon,
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
  UserAvatarIcon,
  CloseIcon,
  LogoutIcon,
} from "@/components/SidebarIcons";
import EmptyState from "@/components/EmptyState";
import { TenantProvider, useTenant } from "@/context/TenantContext";

interface SubNavItem {
  name: string;
  path: string;
  icon: React.ComponentType<{ className?: string; size?: number }>;
  badge?: string | number;
  exact?: boolean;
}

interface NavGroupItem {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string; size?: number }>;
  path?: string;
  exact?: boolean;
  subItems?: SubNavItem[];
}

function HRAdminLayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const {
    notifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    clearAllNotifications,
    leaveRequests,
  } = useTenant();

  // Theme State: 'light' default
  const [theme, setTheme] = useState<"light" | "dark">("light");

  // Single clean collapse state
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Dropdown & Drawer States
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  // Search Filters
  const [sidebarFilter, setSidebarFilter] = useState("");
  const [quickActionSearch, setQuickActionSearch] = useState("");

  const notificationDrawerRef = useRef<HTMLDivElement>(null);
  const quickAddRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const sidebarSearchRef = useRef<HTMLInputElement>(null);

  const toggleCollapse = () => {
    setIsCollapsed((prev) => !prev);
  };

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  // Handle ESC key to close popups
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsQuickAddOpen(false);
        setIsNotificationsOpen(false);
        setIsProfileMenuOpen(false);
        setIsMobileOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Handle Click Outside Drawers & Dropdowns
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        isNotificationsOpen &&
        notificationDrawerRef.current &&
        !notificationDrawerRef.current.contains(target)
      ) {
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
  }, [isNotificationsOpen]);

  const pendingLeavesCount = useMemo(
    () => leaveRequests.filter((l) => l.status === "Pending").length,
    [leaveRequests]
  );

  const unreadNotificationsCount = useMemo(
    () => notifications.filter((n) => !n.read).length,
    [notifications]
  );

  // Unified, Clean, Professional Navigation Structure (No messy tab switches!)
  const navGroups: NavGroupItem[] = useMemo(
    () => [
      {
        id: "dashboard",
        name: "Dashboard",
        path: "/hr-dashboard",
        icon: HomeIcon,
        exact: true,
      },
      {
        id: "workforce",
        name: "Employees",
        icon: OnboardingIcon,
        subItems: [
          { name: "Employee Directory", path: "/hr-dashboard/employees", icon: OnboardingIcon },
          { name: "Attendance Logs", path: "/hr-dashboard/attendance", icon: AttendanceIcon },
          {
            name: "Leave Tracker",
            path: "/hr-dashboard/leave-tracker",
            icon: LeaveTrackerIcon,
            badge: pendingLeavesCount > 0 ? pendingLeavesCount : undefined,
          },
          { name: "Payroll & Compensation", path: "/hr-dashboard/payroll", icon: CompensationIcon },
        ],
      },
      {
        id: "talent",
        name: "Hiring & Reviews",
        icon: TrophyIcon,
        subItems: [
          { name: "Onboarding Pipeline", path: "/hr-dashboard/onboarding", icon: OnboardingIcon },
          { name: "Performance Reviews", path: "/hr-dashboard/performance", icon: TrophyIcon },
          { name: "Surveys & Culture", path: "/hr-dashboard/engagement", icon: EngagementIcon },
        ],
      },
      {
        id: "operations",
        name: "Company & Documents",
        icon: OperationsIcon,
        subItems: [
          { name: "Workforce Operations", path: "/hr-dashboard/operations", icon: OperationsIcon },
          { name: "Tasks & Workflows", path: "/hr-dashboard/tasks", icon: TasksIcon },
          { name: "Bulletins & CMS", path: "/hr-dashboard/cms", icon: BuildingIcon },
          { name: "Official HR Letters", path: "/hr-dashboard/hr-letters", icon: StarIcon },
          { name: "Business Travel", path: "/hr-dashboard/travel", icon: StarIcon },
          { name: "Document Vault", path: "/hr-dashboard/files", icon: FolderIcon },
          { name: "Executive Reports", path: "/hr-dashboard/reports", icon: ReportsIcon },
        ],
      },
      {
        id: "personal",
        name: "My Workspace",
        icon: UserAvatarIcon,
        subItems: [
          { name: "My Profile", path: "/portal/profile", icon: UserAvatarIcon, exact: true },
          { name: "My Attendance", path: "/hr-dashboard/attendance?view=my", icon: AttendanceIcon },
          { name: "My Leave Requests", path: "/hr-dashboard/leave-tracker?view=my", icon: LeaveTrackerIcon },
          { name: "My Payslips", path: "/hr-dashboard/payroll?view=my", icon: CompensationIcon },
        ],
      },
      {
        id: "settings",
        name: "Company Settings",
        path: "/hr-dashboard/settings",
        icon: GearIcon,
      },
    ],
    [pendingLeavesCount]
  );

  const isItemActive = useCallback(
    (item: { path: string; exact?: boolean }) => {
      const isMyView = searchParams.get("view") === "my";
      const itemHasMyView = item.path.includes("view=my");

      // Disallow matching personal view items when in company view, and vice-versa
      if (isMyView !== itemHasMyView) {
        return false;
      }

      const itemBasePath = item.path.split("?")[0];
      if (item.exact) {
        return pathname === itemBasePath;
      }
      return pathname === itemBasePath || pathname.startsWith(itemBasePath + "/");
    },
    [pathname, searchParams]
  );

  const isGroupActive = useCallback(
    (group: NavGroupItem) => {
      if (group.path) {
        return isItemActive({ path: group.path, exact: group.exact });
      }
      if (group.subItems) {
        return group.subItems.some((sub) => isItemActive(sub));
      }
      return false;
    },
    [isItemActive]
  );

  // User-toggled open/collapsed overrides for dropdown groups
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});

  const toggleGroup = useCallback(
    (groupId: string, defaultOpen: boolean) => {
      setOpenGroups((prev) => {
        const currentlyOpen = prev[groupId] !== undefined ? prev[groupId] : defaultOpen;
        return {
          ...prev,
          [groupId]: !currentlyOpen,
        };
      });
    },
    []
  );

  // Filtered navigation for search
  const filteredNavGroups = useMemo(() => {
    if (!sidebarFilter.trim()) return navGroups;
    const query = sidebarFilter.toLowerCase().trim();

    return navGroups
      .map((group) => {
        if (group.subItems) {
          const matchingSubs = group.subItems.filter(
            (sub) =>
              sub.name.toLowerCase().includes(query) ||
              group.name.toLowerCase().includes(query)
          );
          if (matchingSubs.length > 0) {
            return {
              ...group,
              subItems: matchingSubs,
            };
          }
          return null;
        } else {
          if (group.name.toLowerCase().includes(query)) {
            return group;
          }
          return null;
        }
      })
      .filter((g): g is NavGroupItem => g !== null);
  }, [navGroups, sidebarFilter]);

  // Current active group for dynamic sidebar header and breadcrumb
  const currentGroup = useMemo(() => {
    for (const group of navGroups) {
      if (group.path && isItemActive({ path: group.path, exact: group.exact })) {
        return group;
      }
      if (group.subItems) {
        for (const sub of group.subItems) {
          if (isItemActive(sub)) {
            return group;
          }
        }
      }
    }
    return null;
  }, [navGroups, isItemActive]);

  // Current page title for header breadcrumb
  const currentPageTitle = useMemo(() => {
    if (!currentGroup) return "Dashboard";
    if (currentGroup.path && isItemActive({ path: currentGroup.path, exact: currentGroup.exact })) {
      return currentGroup.name;
    }
    if (currentGroup.subItems) {
      for (const sub of currentGroup.subItems) {
        if (isItemActive(sub)) {
          return sub.name;
        }
      }
    }
    return currentGroup.name;
  }, [currentGroup, isItemActive]);

  // Quick action options
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

  const isLight = theme === "light";

  return (
    <div className="h-screen w-screen overflow-hidden flex bg-[#f8fafc] text-gray-900 antialiased font-sans">
      {/* MOBILE BACKDROP */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-xs transition-opacity"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* 1. CLEAN SLEEK SIDEBAR */}
      <aside
        className={`fixed lg:static top-0 bottom-0 left-0 z-50 flex flex-col justify-between select-none transition-all duration-300 ease-in-out ${
          isLight ? "light-sidebar" : "dark-sidebar"
        } ${isCollapsed ? "w-[72px]" : "w-64"} ${
          isMobileOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* BRAND & HEADER - CLEAN MINIMAL */}
        <div
          className={`shrink-0 px-4 py-4 flex items-center ${
            isLight ? "light-sidebar-header" : "dark-sidebar-header"
          }`}
        >
          <Link
            href="/hr-dashboard"
            onClick={() => setIsMobileOpen(false)}
            className="flex items-center space-x-3 overflow-hidden group focus:outline-none w-full"
            title="CrewSync HR Suite"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-base shadow-sm shrink-0 group-hover:scale-105 transition-transform duration-200">
              C
            </div>

            {!isCollapsed && (
              <div className="min-w-0 flex-1">
                <span
                  className={`font-bold text-[14.5px] tracking-tight truncate block ${
                    isLight ? "text-gray-900" : "text-white"
                  }`}
                >
                  CrewSync
                </span>
                <span
                  className={`text-[11px] font-medium block -mt-0.5 truncate ${
                    isLight ? "text-gray-500" : "text-slate-400"
                  }`}
                >
                  HR Portal
                </span>
              </div>
            )}
          </Link>

          {/* Mobile Close Button */}
          <button
            type="button"
            onClick={() => setIsMobileOpen(false)}
            className={`lg:hidden w-8 h-8 rounded-lg flex items-center justify-center transition focus:outline-none cursor-pointer ml-auto ${
              isLight
                ? "text-gray-500 hover:text-gray-800 hover:bg-gray-100"
                : "text-slate-400 hover:text-white hover:bg-white/[0.08]"
            }`}
            title="Close Sidebar"
          >
            <X size={18} />
          </button>
        </div>

        {/* SEARCH / FILTER (Expanded Mode Only) */}
        {!isCollapsed && (
          <div className="px-3 pt-2 pb-1 shrink-0">
            <div className="relative flex items-center">
              <Search
                className={`w-3.5 h-3.5 absolute left-3 pointer-events-none ${
                  isLight ? "text-gray-400" : "text-slate-400"
                }`}
              />
              <input
                ref={sidebarSearchRef}
                type="text"
                value={sidebarFilter}
                onChange={(e) => setSidebarFilter(e.target.value)}
                placeholder="Search modules..."
                className={`w-full text-xs pl-8 pr-7 py-2 rounded-lg border focus:outline-none focus:ring-1 transition shadow-2xs ${
                  isLight
                    ? "bg-gray-50/80 text-gray-800 placeholder-gray-400 border-gray-200 focus:bg-white focus:border-blue-500 focus:ring-blue-500/20"
                    : "bg-[#141b2d] text-slate-200 placeholder-slate-400 border-slate-700/60 focus:border-blue-500 focus:ring-blue-500/30"
                }`}
              />
              {sidebarFilter && (
                <button
                  type="button"
                  onClick={() => setSidebarFilter("")}
                  className={`absolute right-2.5 ${isLight ? "text-gray-400 hover:text-gray-700" : "text-slate-400 hover:text-white"}`}
                  title="Clear search"
                >
                  <X size={13} />
                </button>
              )}
            </div>
          </div>
        )}

        {/* NAVIGATION LINKS WITH CLEAN ACCORDION DROPDOWNS */}
        <div
          className={`flex-1 overflow-y-auto px-2.5 py-3 space-y-1 ${
            isLight ? "light-scrollbar" : "dark-scrollbar"
          }`}
        >
          {filteredNavGroups.length > 0 ? (
            filteredNavGroups.map((group) => {
              const Icon = group.icon;
              const hasSubItems = Boolean(group.subItems && group.subItems.length > 0);
              const groupActive = isGroupActive(group);
              const isGroupOpen = Boolean(
                sidebarFilter.trim()
                  ? true
                  : openGroups[group.id] !== undefined
                  ? openGroups[group.id]
                  : groupActive
              );

              // 1. Direct Link (Dashboard, Company Settings)
              if (!hasSubItems && group.path) {
                const active = isItemActive({ path: group.path, exact: group.exact });

                return (
                  <Link
                    key={group.id}
                    href={group.path}
                    onClick={() => setIsMobileOpen(false)}
                    title={isCollapsed ? group.name : undefined}
                    className={`group relative flex items-center rounded-xl transition-[background-color,box-shadow,color] duration-150 select-none ${
                      isCollapsed ? "w-10 h-10 mx-auto justify-center" : "px-3 py-2.5 text-[13px]"
                    } ${
                      active
                        ? isLight
                          ? "bg-blue-600 text-white font-bold shadow-[0_2.5px_0_#1d4ed8,0_5px_10px_rgba(37,99,235,0.22),inset_0_1px_0_rgba(255,255,255,0.28)] border border-blue-600 [text-shadow:0_1px_1px_rgba(0,0,0,0.25)]"
                          : "dark-sidebar-nav-active text-white font-bold shadow-[0_2.5px_0_#1e3a8a,0_5px_12px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.2)] border border-blue-500/40 [text-shadow:0_1px_2px_rgba(0,0,0,0.6)]"
                        : isLight
                        ? "border border-transparent text-gray-700 hover:bg-slate-100/90 hover:text-gray-900 font-medium"
                        : "border border-transparent text-slate-300 hover:text-white hover:bg-white/[0.08] font-medium"
                    }`}
                  >
                    <div
                      className={`flex items-center justify-center shrink-0 ${
                        active
                          ? "text-white"
                          : isLight
                          ? "text-gray-500 group-hover:text-blue-600"
                          : "text-slate-400 group-hover:text-blue-400"
                      }`}
                    >
                      <Icon className={isCollapsed ? "w-5 h-5" : "w-4 h-4 mr-3"} size={isCollapsed ? 20 : 16} />
                    </div>

                    {!isCollapsed && <span className="truncate flex-1 tracking-tight">{group.name}</span>}

                    {isCollapsed && (
                      <div className="absolute left-full ml-3 px-2.5 py-1 rounded-md bg-gray-900 text-white text-xs font-semibold whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-150 z-50 shadow-xl">
                        {group.name}
                      </div>
                    )}
                  </Link>
                );
              }

              // 2. Dropdown Group (Workforce, Talent, Operations, My Personal Space)
              return (
                <div key={group.id} className="space-y-0.5">
                  <button
                    type="button"
                    onClick={() => {
                      if (isCollapsed) {
                        setIsCollapsed(false);
                      }
                      toggleGroup(group.id, groupActive);
                    }}
                    title={isCollapsed ? group.name : undefined}
                    className={`group relative w-full flex items-center rounded-xl transition-[background-color,box-shadow,color] duration-150 select-none cursor-pointer ${
                      isCollapsed ? "w-10 h-10 mx-auto justify-center" : "px-3 py-2.5 text-[13px]"
                    } ${
                      groupActive && !isGroupOpen
                        ? isLight
                          ? "bg-blue-50 text-blue-700 font-bold border border-blue-200/80 shadow-[0_2px_0_#bfdbfe,0_3px_6px_rgba(37,99,235,0.08),inset_0_1px_0_#ffffff] [text-shadow:0_1px_0_rgba(255,255,255,0.9)]"
                          : "bg-blue-950/40 text-blue-300 font-bold border border-blue-800/60 shadow-[0_2px_0_#172554,inset_0_1px_0_rgba(255,255,255,0.08)] [text-shadow:0_1px_2px_rgba(0,0,0,0.5)]"
                        : isLight
                        ? "border border-transparent text-gray-700 hover:bg-slate-100/90 hover:text-gray-900 font-medium"
                        : "border border-transparent text-slate-300 hover:text-white hover:bg-white/[0.08] font-medium"
                    }`}
                  >
                    <div
                      className={`flex items-center justify-center shrink-0 ${
                        groupActive
                          ? isLight
                            ? "text-blue-600"
                            : "text-blue-400"
                          : isLight
                          ? "text-gray-500 group-hover:text-blue-600"
                          : "text-slate-400 group-hover:text-blue-400"
                      }`}
                    >
                      <Icon className={isCollapsed ? "w-5 h-5" : "w-4 h-4 mr-3"} size={isCollapsed ? 20 : 16} />
                    </div>

                    {!isCollapsed && (
                      <>
                        <span className="truncate flex-1 tracking-tight text-left">{group.name}</span>
                        <ChevronDown
                          size={15}
                          className={`transition-transform duration-200 text-gray-400 group-hover:text-gray-700 ${
                            isGroupOpen ? "rotate-180 text-blue-600" : ""
                          }`}
                        />
                      </>
                    )}

                    {isCollapsed && (
                      <div className="absolute left-full ml-3 px-2.5 py-1 rounded-md bg-gray-900 text-white text-xs font-semibold whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-150 z-50 shadow-xl">
                        {group.name}
                      </div>
                    )}
                  </button>

                  {/* Dropdown Sub-Items List */}
                  {!isCollapsed && isGroupOpen && group.subItems && (
                    <div
                      className={`ml-5 pl-2.5 py-0.5 space-y-0.5 border-l-2 transition-all duration-200 ${
                        isLight ? "border-gray-200" : "border-slate-800"
                      }`}
                    >
                      {group.subItems.map((sub) => {
                        const active = isItemActive(sub);
                        const SubIcon = sub.icon;

                        return (
                          <Link
                            key={sub.name + sub.path}
                            href={sub.path}
                            onClick={() => {
                              setIsMobileOpen(false);
                              setOpenGroups((prev) => ({ ...prev, [group.id]: true }));
                            }}
                            className={`group flex items-center px-2.5 py-1.5 rounded-lg text-xs transition-[background-color,box-shadow,color] duration-150 select-none ${
                              active
                                ? isLight
                                  ? "bg-blue-600 text-white font-bold shadow-[0_2px_0_#1d4ed8,0_3px_6px_rgba(37,99,235,0.22),inset_0_1px_0_rgba(255,255,255,0.25)] border border-blue-600 [text-shadow:0_1px_1px_rgba(0,0,0,0.25)]"
                                  : "dark-sidebar-nav-active text-white font-bold shadow-[0_2px_0_#1e3a8a,0_4px_8px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.2)] border border-blue-500/40 [text-shadow:0_1px_2px_rgba(0,0,0,0.6)]"
                                : isLight
                                ? "border border-transparent text-gray-600 hover:text-gray-900 hover:bg-slate-100 font-medium"
                                : "border border-transparent text-slate-400 hover:text-white hover:bg-white/[0.06] font-medium"
                            }`}
                          >
                            <SubIcon
                              className={`w-3.5 h-3.5 mr-2 shrink-0 ${
                                active
                                  ? "text-white"
                                  : isLight
                                  ? "text-gray-400 group-hover:text-blue-600"
                                  : "text-slate-500 group-hover:text-blue-400"
                              }`}
                              size={14}
                            />
                            <span className="truncate flex-1">{sub.name}</span>
                            {sub.badge !== undefined && (
                              <span
                                className={`ml-1.5 px-1.5 py-0.5 text-[9.5px] font-bold rounded-full ${
                                  active
                                    ? "bg-white/20 text-white"
                                    : "bg-blue-100 text-blue-700"
                                }`}
                              >
                                {sub.badge}
                              </span>
                            )}
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="py-6 px-2 text-center text-xs text-gray-400">
              <p>No modules found</p>
              <button
                type="button"
                onClick={() => setSidebarFilter("")}
                className="mt-2 text-blue-600 hover:underline font-medium text-xs"
              >
                Clear filter
              </button>
            </div>
          )}
        </div>

        {/* BOTTOM USER & CONTROLS FOOTER */}
        <div
          className={`shrink-0 p-3 border-t space-y-2 ${
            isLight
              ? "border-gray-200/80 bg-gray-50/70"
              : "border-white/[0.06] bg-[#070b13]/90"
          }`}
        >
          {/* User Profile Card */}
          <div
            className={`flex items-center rounded-xl p-1.5 transition ${
              isCollapsed
                ? "justify-center"
                : isLight
                ? "space-x-2.5 bg-white border border-gray-200/80 shadow-2xs"
                : "space-x-2.5 bg-white/[0.03] border border-white/[0.04]"
            }`}
          >
            <div className="relative shrink-0">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-bold text-xs flex items-center justify-center shadow-xs">
                AP
              </div>
              <span
                className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ${
                  isLight ? "ring-white" : "ring-[#090d16]"
                }`}
              />
            </div>

            {!isCollapsed && (
              <div className="min-w-0 flex-1">
                <p
                  className={`text-xs font-bold truncate leading-tight ${
                    isLight ? "text-gray-900" : "text-white"
                  }`}
                >
                  Amira Patel
                </p>
                <p
                  className={`text-[10px] truncate leading-tight mt-0.5 ${
                    isLight ? "text-gray-500" : "text-slate-400"
                  }`}
                >
                  HR Admin
                </p>
              </div>
            )}

            {!isCollapsed && (
              <div className="flex items-center space-x-1 shrink-0">
                <button
                  type="button"
                  onClick={toggleTheme}
                  className={`p-1.5 rounded-lg transition cursor-pointer ${
                    isLight
                      ? "text-gray-500 hover:text-gray-800 hover:bg-gray-100"
                      : "text-slate-400 hover:text-white hover:bg-white/[0.08]"
                  }`}
                  title={isLight ? "Dark Theme" : "Light Theme"}
                >
                  {isLight ? <Moon size={14} /> : <Sun size={14} className="text-amber-400" />}
                </button>
                <Link
                  href="/login"
                  className={`p-1.5 rounded-lg transition ${
                    isLight
                      ? "text-gray-400 hover:text-rose-600 hover:bg-rose-50"
                      : "text-slate-400 hover:text-rose-400 hover:bg-rose-500/10"
                  }`}
                  title="Sign Out"
                >
                  <LogOut size={14} />
                </Link>
              </div>
            )}
          </div>


          {/* Minimal Collapse Button */}
          {!isCollapsed ? (
            <button
              type="button"
              onClick={toggleCollapse}
              className={`w-full py-1.5 px-2.5 rounded-xl transition-[background-color,box-shadow,color] duration-150 text-xs font-semibold flex items-center justify-center cursor-pointer select-none ${
                isLight
                  ? "text-gray-700 hover:text-gray-900 hover:bg-gray-100 bg-white border border-gray-200/90 shadow-[0_2px_0_#e2e8f0,0_3px_6px_rgba(0,0,0,0.04),inset_0_1px_0_#ffffff] [text-shadow:0_1px_0_rgba(255,255,255,0.9)]"
                  : "text-slate-200 hover:text-white hover:bg-white/[0.08] bg-white/[0.04] border border-white/[0.08] shadow-[0_2px_0_#0f172a,inset_0_1px_0_rgba(255,255,255,0.06)]"
              }`}
              title="Collapse Sidebar"
            >
              <ChevronLeft size={14} />
              <span className="ml-1 text-[11px]">Collapse</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={toggleCollapse}
              className={`w-full h-8 rounded-xl flex items-center justify-center transition-[background-color,box-shadow,color] duration-150 cursor-pointer select-none ${
                isLight
                  ? "text-gray-600 hover:text-gray-900 hover:bg-gray-100 bg-white border border-gray-200/90 shadow-[0_2px_0_#e2e8f0,0_3px_6px_rgba(0,0,0,0.04),inset_0_1px_0_#ffffff]"
                  : "text-slate-200 hover:text-white hover:bg-white/[0.08] bg-white/[0.04] border border-white/[0.08] shadow-[0_2px_0_#0f172a,inset_0_1px_0_rgba(255,255,255,0.06)]"
              }`}
              title="Expand Sidebar"
            >
              <ChevronRight size={15} />
            </button>
          )}
        </div>
      </aside>

      {/* 2. MAIN WORKSPACE VIEW */}
      <div className="flex-1 h-screen flex flex-col min-w-0 overflow-hidden">
        {/* Enterprise Top Navbar */}
        <header className="h-16 bg-white border-b border-gray-200/80 flex items-center justify-between px-4 sm:px-6 shrink-0 z-20 select-none gap-3 shadow-xs">
          {/* Left: Mobile Menu Toggle & Clean Breadcrumb (NO messy badges!) */}
          <div className="flex items-center space-x-3 min-w-0">
            <button
              type="button"
              onClick={() => setIsMobileOpen(true)}
              className="lg:hidden w-9 h-9 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 flex items-center justify-center transition focus:outline-none cursor-pointer"
              title="Open Navigation"
            >
              <Menu size={20} />
            </button>

            {/* Clean Breadcrumb without messy badges */}
            <div className="flex items-center space-x-2 text-xs sm:text-sm font-medium text-gray-500 min-w-0">
              {currentGroup && currentGroup.name !== currentPageTitle && (
                <>
                  <span className="hidden md:inline hover:text-gray-700 transition">
                    {currentGroup.name}
                  </span>
                  <span className="hidden md:inline text-gray-300">/</span>
                </>
              )}
              <h1 className="font-bold text-gray-900 truncate tracking-tight text-sm sm:text-base">
                {currentPageTitle}
              </h1>
            </div>
          </div>


          {/* Right Corner Menus */}
          <div className="flex items-center space-x-2 sm:space-x-3 shrink-0">
            {/* Weather & Location Indicator (Left of New Action) */}
            <div
              className="hidden sm:flex items-center gap-2.5 h-9 px-3 rounded-lg bg-slate-50 hover:bg-slate-100/80 border border-slate-200/80 text-xs select-none transition-colors shadow-2xs cursor-default"
              title="Today's Weather: 24°C Sunny · San Francisco HQ"
            >
              <div className="flex items-center gap-1.5 text-slate-600 font-medium">
                <MapPin size={13} className="text-blue-600 shrink-0" />
                <span className="truncate max-w-[130px] md:max-w-none">San Francisco HQ</span>
              </div>
              <span className="w-1 h-1 rounded-full bg-slate-300 shrink-0" />
              <div className="flex items-center gap-1.5 font-bold text-slate-800">
                <CloudSun size={15} className="text-amber-500 shrink-0" />
                <span>24°C</span>
                <span className="text-[11px] font-normal text-slate-400 hidden md:inline">Sunny</span>
              </div>
            </div>

            {/* 1. Quick Add Button (+) */}
            <div className="relative" ref={quickAddRef}>
              <button
                type="button"
                onClick={() => {
                  setIsQuickAddOpen((p) => !p);
                  setIsNotificationsOpen(false);
                  setIsProfileMenuOpen(false);
                }}
                className="h-9 px-3 sm:px-3.5 rounded-lg bg-blue-600 hover:bg-blue-700 active:scale-95 text-white flex items-center space-x-1.5 transition-all duration-150 shadow-sm shadow-blue-500/25 cursor-pointer focus:outline-none text-xs font-semibold"
                title="Quick Action"
              >
                <Plus size={15} className="text-white" />
                <span className="hidden sm:inline">New Action</span>
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
                            className="flex items-center px-3 py-2 text-xs font-semibold text-gray-700 hover:text-blue-600 hover:bg-blue-50/60 rounded-lg transition group"
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

            {/* 2. Notification Bell Icon */}
            <button
              id="top-bell-notification-btn"
              type="button"
              onClick={() => {
                setIsNotificationsOpen((p) => !p);
                setIsQuickAddOpen(false);
                setIsProfileMenuOpen(false);
              }}
              className="w-9 h-9 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-gray-100 flex items-center justify-center transition-all duration-150 cursor-pointer focus:outline-none relative"
              title="Notifications"
            >
              <Bell size={18} />
              {unreadNotificationsCount > 0 && (
                <span
                  suppressHydrationWarning
                  className="absolute top-1 right-1 min-w-[17px] h-[17px] px-1 rounded-full bg-blue-600 text-white text-[9.5px] font-bold flex items-center justify-center ring-2 ring-white"
                >
                  {unreadNotificationsCount}
                </span>
              )}
            </button>

            {/* 3. User Avatar Icon & Simple Clean Dropdown */}
            <div className="relative" ref={profileRef}>
              <button
                type="button"
                onClick={() => {
                  setIsProfileMenuOpen((p) => !p);
                  setIsQuickAddOpen(false);
                  setIsNotificationsOpen(false);
                }}
                className="w-9 h-9 rounded-lg bg-blue-50 hover:bg-blue-100 border border-blue-200 transition cursor-pointer flex items-center justify-center focus:outline-none overflow-hidden"
                title="Tenant Admin Account"
              >
                <span className="text-xs font-bold text-blue-700">AP</span>
              </button>

              {/* Clean Profile Menu with NO redundant links */}
              {isProfileMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50 animate-in fade-in zoom-in-95 duration-100 text-xs">
                  <div className="px-4 py-2.5 border-b border-gray-100 flex items-center space-x-2.5">
                    <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-800 font-bold flex items-center justify-center text-xs">
                      AP
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-bold text-gray-900 leading-tight truncate">Amira Patel</p>
                      <p className="text-[11px] text-gray-500 truncate leading-tight mt-0.5">
                        HR Admin
                      </p>
                    </div>
                  </div>

                  <Link
                    href="/portal/profile"
                    onClick={() => setIsProfileMenuOpen(false)}
                    className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition font-medium"
                  >
                    <UserAvatarIcon className="w-4 h-4 mr-2 text-gray-400" size={16} />
                    View My Profile
                  </Link>

                  <Link
                    href="/login"
                    className="flex items-center px-4 py-2.5 text-red-600 hover:bg-red-50 transition font-medium border-t border-gray-100"
                  >
                    <LogoutIcon className="w-3.5 h-3.5 mr-2 text-red-500" size={15} />
                    Sign Out
                  </Link>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* 3. NOTIFICATIONS SLIDE-OVER DRAWER */}
        <div
          className={`fixed inset-0 bg-black/30 z-50 backdrop-blur-xs transition-opacity duration-300 ease-out ${
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
                    className={`p-3.5 rounded-xl border text-xs space-y-1.5 transition cursor-pointer ${
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

        {/* 4. WORKSPACE CONTENT AREA */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-[#f8fafc]">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}

export default function HRAdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <TenantProvider>
      <Suspense fallback={null}>
        <HRAdminLayoutContent>{children}</HRAdminLayoutContent>
      </Suspense>
    </TenantProvider>
  );
}

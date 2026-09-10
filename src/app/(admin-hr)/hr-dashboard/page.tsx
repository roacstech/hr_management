"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Building2,
  Calendar,
  CalendarCheck,
  FileText,
  User,
  Users,
  Download,
  Plus,
  Briefcase,
  Clock,
  UserCheck,
  ArrowRight,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Sun,
  Sparkles,
  Menu,
  MapPin,
  LogOut,
  LogIn,
  PieChart,
  PartyPopper,
  Gift,
  Award,
} from "lucide-react";
import { useTenant } from "@/context/TenantContext";

// Reusable Animated Count-Up Hook and Components for Percentages
function useCountUp(target: number, duration = 600) {
  const [val, setVal] = useState(0);

  useEffect(() => {
    const start = 0;
    const startTime = performance.now();
    let frameId: number;

    const animate = (time: number) => {
      const elapsed = time - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      setVal(Math.round(start + (target - start) * ease));
      if (progress < 1) {
        frameId = requestAnimationFrame(animate);
      }
    };

    frameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameId);
  }, [target, duration]);

  return val;
}

function SvgPercentageText({
  x,
  y,
  value,
  fontSize = "13",
}: {
  x: string | number;
  y: string | number;
  value: number;
  fontSize?: string;
}) {
  const count = useCountUp(value);
  return (
    <text
      x={x}
      y={y}
      fill="#ffffff"
      fontSize={fontSize}
      fontWeight="900"
      textAnchor="middle"
      className="font-mono select-none [text-shadow:0_1px_2px_rgba(0,0,0,0.45)] pointer-events-none"
    >
      {count}%
    </text>
  );
}

function LegendPercentage({ value }: { value: number }) {
  const count = useCountUp(value);
  return <>{count}%</>;
}

function PalmTreeIcon({ className = "w-4.5 h-4.5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22V11" />
      <path d="M12 11c-2.5-3-6-4.5-9-4 0 3 1.5 6.5 4 8" />
      <path d="M12 11c2.5-3 6-4.5 9-4 0 3-1.5 6.5-4 8" />
      <path d="M12 11c-1-3-1.5-7 0-9 1.5 2 1 6 0 9" />
    </svg>
  );
}

function StethoscopeIcon({ className = "w-4.5 h-4.5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 3v5a5 5 0 0 0 10 0V3" />
      <path d="M10 13v2a4 4 0 0 0 8 0v-3" />
      <circle cx="18" cy="10" r="2" />
    </svg>
  );
}

function HolidayCalendarIllustration({ className = "w-20 h-16" }: { className?: string }) {
  return (
    <svg className={className} viewBox="15 15 130 85" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="aura-blur" x="0" y="0" width="160" height="110" filterUnits="userSpaceOnUse">
          <feGaussianBlur stdDeviation="8" />
        </filter>
        <linearGradient id="cal-header-grad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#ff4d4d" />
          <stop offset="100%" stopColor="#f43f5e" />
        </linearGradient>
        <linearGradient id="leaf-grad-1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#34d399" />
          <stop offset="100%" stopColor="#059669" />
        </linearGradient>
        <linearGradient id="leaf-grad-2" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#10b981" />
          <stop offset="100%" stopColor="#047857" />
        </linearGradient>
      </defs>

      {/* Soft Blue Atmospheric Cloud / Aura */}
      <ellipse cx="80" cy="52" rx="58" ry="34" fill="#dbeafe" opacity="0.8" filter="url(#aura-blur)" />
      <ellipse cx="50" cy="40" rx="30" ry="20" fill="#e0f2fe" opacity="0.9" filter="url(#aura-blur)" />
      <ellipse cx="110" cy="42" rx="28" ry="20" fill="#e0f2fe" opacity="0.9" filter="url(#aura-blur)" />

      {/* Foliage - Left side */}
      <path d="M42 66C35 55 38 42 48 38C48 48 45 60 42 66Z" fill="url(#leaf-grad-1)" />
      <path d="M32 58C28 48 34 38 42 36C40 46 36 54 32 58Z" fill="url(#leaf-grad-2)" />
      <path d="M48 72C40 65 38 52 46 46C48 55 48 65 48 72Z" fill="#10b981" />
      <circle cx="36" cy="62" r="3" fill="#fb923c" />
      <circle cx="44" cy="42" r="2.5" fill="#f43f5e" />

      {/* Foliage - Right side */}
      <path d="M118 66C125 55 122 42 112 38C112 48 115 60 118 66Z" fill="url(#leaf-grad-1)" />
      <path d="M128 58C132 48 126 38 118 36C120 46 124 54 128 58Z" fill="url(#leaf-grad-2)" />
      <path d="M112 72C120 65 122 52 114 46C112 55 112 65 112 72Z" fill="#10b981" />
      <circle cx="124" cy="62" r="3" fill="#fb923c" />
      <circle cx="116" cy="42" r="2.5" fill="#f43f5e" />

      {/* Calendar Base Drop Shadow */}
      <ellipse cx="80" cy="88" rx="38" ry="5" fill="#cbd5e1" opacity="0.5" />

      {/* Desk Calendar Body */}
      <rect x="52" y="32" width="56" height="52" rx="7" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1.5" />
      
      {/* Calendar Top Header Strip (Red) */}
      <path d="M52 39C52 35.134 55.134 32 59 32H101C104.866 32 108 35.134 108 39V47H52V39Z" fill="url(#cal-header-grad)" />

      {/* Spiral Binder Rings */}
      <g stroke="#334155" strokeWidth="2.5" strokeLinecap="round">
        <path d="M64 27V36" />
        <path d="M96 27V36" />
      </g>
      <circle cx="64" cy="38" r="1.5" fill="#ffffff" />
      <circle cx="96" cy="38" r="1.5" fill="#ffffff" />

      {/* HOLIDAY text */}
      <text
        x="80"
        y="58"
        textAnchor="middle"
        fill="#ef4444"
        fontSize="8"
        fontWeight="800"
        letterSpacing="0.5"
        fontFamily="sans-serif"
      >
        HOLIDAY
      </text>

      {/* Calendar Grid Date Placeholders */}
      <g fill="#e0f2fe" stroke="#bae6fd" strokeWidth="0.75">
        <rect x="58" y="63" width="9" height="7" rx="1.5" />
        <rect x="71" y="63" width="9" height="7" rx="1.5" />
        <rect x="84" y="63" width="9" height="7" rx="1.5" />
        <rect x="93" y="63" width="9" height="7" rx="1.5" />
        <rect x="58" y="72" width="9" height="7" rx="1.5" />
        <rect x="71" y="72" width="9" height="7" rx="1.5" fill="#fecdd3" stroke="#fda4af" />
        <rect x="84" y="72" width="9" height="7" rx="1.5" />
        <rect x="93" y="72" width="9" height="7" rx="1.5" />
      </g>
    </svg>
  );
}

function HolidayPalmCalendarIllustration({ className = "w-24 h-24" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="palm-trunk" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#b45309" />
          <stop offset="100%" stopColor="#78350f" />
        </linearGradient>
        <linearGradient id="palm-leaf-1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#34d399" />
          <stop offset="100%" stopColor="#059669" />
        </linearGradient>
        <linearGradient id="palm-leaf-2" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#10b981" />
          <stop offset="100%" stopColor="#047857" />
        </linearGradient>
      </defs>

      {/* Ground soft shadow */}
      <ellipse cx="60" cy="114" rx="46" ry="4" fill="#cbd5e1" opacity="0.45" />

      {/* Palm Tree Trunk */}
      <path
        d="M74 112 C74 85 70 65 62 48 C67 47 70 48 71 58 C77 75 80 112 80 112 Z"
        fill="url(#palm-trunk)"
      />
      {/* Palm trunk rings */}
      <path d="M72 100 C74 98 78 99 79 101" stroke="#92400e" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M69 86 C72 84 76 85 77 87" stroke="#92400e" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M66 72 C69 70 73 71 74 73" stroke="#92400e" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M63 58 C66 56 69 57 70 59" stroke="#92400e" strokeWidth="1.5" strokeLinecap="round" />

      {/* Palm Leaves */}
      <path d="M66 48 C50 36 34 44 30 54 C40 55 52 52 66 48 Z" fill="url(#palm-leaf-1)" />
      <path d="M66 48 C54 26 42 28 35 34 C46 38 56 42 66 48 Z" fill="url(#palm-leaf-2)" />
      <path d="M66 48 C62 20 70 16 73 16 C76 26 73 38 66 48 Z" fill="#34d399" />
      <path d="M66 48 C78 28 92 28 98 35 C88 40 78 44 66 48 Z" fill="url(#palm-leaf-1)" />
      <path d="M66 48 C82 38 98 46 102 56 C92 56 80 52 66 48 Z" fill="url(#palm-leaf-2)" />

      {/* Coconuts */}
      <circle cx="64" cy="50" r="3" fill="#713f12" />
      <circle cx="70" cy="51" r="2.5" fill="#854d0e" />

      {/* Desk Calendar (In front of palm tree base) */}
      <ellipse cx="44" cy="110" rx="28" ry="4" fill="#94a3b8" opacity="0.3" />
      <path d="M16 74 L22 64 V108 L16 104 Z" fill="#b91c1c" />
      <rect x="22" y="64" width="50" height="44" rx="6" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1.5" />
      <path d="M22 70 C22 66.686 24.686 64 28 64 H66 C69.314 64 72 66.686 72 70 V75 H22 V70 Z" fill="#ef4444" />

      {/* Binder Rings */}
      <g stroke="#1e293b" strokeWidth="2.5" strokeLinecap="round">
        <path d="M34 58 V68" />
        <path d="M60 58 V68" />
      </g>
      <circle cx="34" cy="69" r="1.5" fill="#ffffff" />
      <circle cx="60" cy="69" r="1.5" fill="#ffffff" />

      {/* HOLIDAY text */}
      <text
        x="47"
        y="83"
        textAnchor="middle"
        fill="#ef4444"
        fontSize="6.5"
        fontWeight="800"
        letterSpacing="0.4"
        fontFamily="sans-serif"
      >
        HOLIDAY
      </text>

      {/* Calendar Grid Date Dots */}
      <g fill="#e2e8f0">
        <rect x="28" y="87" width="7" height="4" rx="1" />
        <rect x="38" y="87" width="7" height="4" rx="1" fill="#fecdd3" />
        <rect x="48" y="87" width="7" height="4" rx="1" />
        <rect x="58" y="87" width="7" height="4" rx="1" />

        <rect x="28" y="95" width="7" height="4" rx="1" />
        <rect x="38" y="95" width="7" height="4" rx="1" />
        <rect x="48" y="95" width="7" height="4" rx="1" fill="#fecdd3" />
        <rect x="58" y="95" width="7" height="4" rx="1" />
      </g>
    </svg>
  );
}

export default function HRDashboardRootPage() {
  const {
    employees,
    leaveRequests,
    attendanceRecords,
    showToast,
  } = useTenant();

  // Top-Tier View Switcher: 'company' | 'personal'
  const [activeView, setActiveView] = useState<"company" | "personal">("company");

  // Personal Attendance Punch State (Progress Ring UI)
  const [isPunchedIn, setIsPunchedIn] = useState<boolean>(true);
  const [punchInTime, setPunchInTime] = useState<string>("08:50 AM");

  const handleTogglePunch = () => {
    if (isPunchedIn) {
      setIsPunchedIn(false);
      const now = new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
      showToast?.(`Punch-out recorded at ${now}`, "info");
    } else {
      setIsPunchedIn(true);
      const now = new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
      setPunchInTime(now);
      showToast?.(`Punch-in recorded at ${now}`, "success");
    }
  };

  // Active Job Openings View Mode: 'chart' | 'roles'
  const [jobsViewMode, setJobsViewMode] = useState<"chart" | "roles">("chart");
  const [hoveredJobDept, setHoveredJobDept] = useState<string | null>(null);

  // Distribution View Mode: 'department' | 'location'
  const [breakdownMode, setBreakdownMode] = useState<"department" | "location">("department");

  // Company & Recruitment Calendar State (Dynamic Month, Day, and Category Filter)
  const [calendarYear, setCalendarYear] = useState<number>(2026);
  const [calendarMonth, setCalendarMonth] = useState<number>(8); // 8 = September (0-indexed)
  const [selectedCalendarDay, setSelectedCalendarDay] = useState<number>(9);
  const [showMonthSidebar, setShowMonthSidebar] = useState<boolean>(true);
  const [calendarCategoryFilter, setCalendarCategoryFilter] = useState<"all" | "interview" | "holiday" | "onboarding">("all");

  // 1. Department Breakdown (5 Departments - cx:100, cy:100, r:90 big chart)
  const departmentBreakdown = [
    {
      name: "Engineering",
      lead: "David Chen",
      count: 3,
      pct: 43,
      color: "#6366f1",
      path: "M 100 100 L 100.00 10.00 A 90 90 0 0 1 139.05 181.09 Z",
      tx: 154.4,
      ty: 87.6,
    },
    {
      name: "Operations & HR",
      lead: "Amira Patel",
      count: 1,
      pct: 14,
      color: "#10b981",
      path: "M 100 100 L 139.05 181.09 A 90 90 0 0 1 60.95 181.09 Z",
      tx: 100.0,
      ty: 155.8,
    },
    {
      name: "Product & Design",
      lead: "Sophia Williams",
      count: 1,
      pct: 14,
      color: "#f59e0b",
      path: "M 100 100 L 60.95 181.09 A 90 90 0 0 1 12.26 120.03 Z",
      tx: 56.4,
      ty: 134.8,
    },
    {
      name: "Sales & Growth",
      lead: "Elena Rostova",
      count: 1,
      pct: 14,
      color: "#06b6d4",
      path: "M 100 100 L 12.26 120.03 A 90 90 0 0 1 29.64 43.89 Z",
      tx: 45.6,
      ty: 87.6,
    },
    {
      name: "Finance & Legal",
      lead: "Michael Chang",
      count: 1,
      pct: 14,
      color: "#8b5cf6",
      path: "M 100 100 L 29.64 43.89 A 90 90 0 0 1 100.00 10.00 Z",
      tx: 75.8,
      ty: 49.7,
    },
  ];

  // 2. Workplace Deployment & Today's Attendance (Total 7 staff - cx:100, cy:100, r:90)
  const locationBreakdown = [
    {
      name: "On-site HQ",
      sub: "San Francisco Campus",
      count: 4,
      pct: 57,
      color: "#6366f1",
      path: "M 100 100 L 100.00 10.00 A 90 90 0 1 1 60.95 181.09 Z",
      tx: 154.4,
      ty: 112.4,
    },
    {
      name: "Remote Active",
      sub: "Distributed / US Virtual",
      count: 2,
      pct: 29,
      color: "#06b6d4",
      path: "M 100 100 L 60.95 181.09 A 90 90 0 0 1 29.64 43.89 Z",
      tx: 45.6,
      ty: 112.4,
    },
    {
      name: "Approved Leave",
      sub: "Out of Office (PTO)",
      count: 1,
      pct: 14,
      color: "#f59e0b",
      path: "M 100 100 L 29.64 43.89 A 90 90 0 0 1 100.00 10.00 Z",
      tx: 75.8,
      ty: 49.7,
    },
  ];


  // 3. Company & Recruitment Operations Calendar Dataset (Multi-Month: Aug, Sep, Oct 2026)
  interface CompanyCalendarEvent {
    id: string;
    category: "interview" | "holiday" | "onboarding";
    title: string;
    time?: string;
    candidateName?: string;
    role?: string;
    round?: string;
    interviewers?: string;
    location?: string;
    description?: string;
    badge: string;
    badgeColor: string;
    dotColor: string;
    theme?: "emerald" | "purple" | "indigo" | "rose" | "cyan";
  }

  const companyCalendarEvents: Record<string, CompanyCalendarEvent[]> = {
    // August 2026
    "2026-08-03": [
      {
        id: "aug-onb-1",
        category: "onboarding",
        title: "New Team Welcome",
        time: "09:30 AM – 11:30 AM",
        location: "HQ Room 2 & Online",
        description: "2 new members joining Sales and Marketing.",
        badge: "New Hires",
        badgeColor: "bg-cyan-50 text-cyan-700 border-cyan-200/80",
        dotColor: "#06b6d4",
      },
    ],
    "2026-08-19": [
      {
        id: "aug-int-1",
        category: "interview",
        title: "Technical Interview",
        candidateName: "Maya Zhao",
        role: "Senior Full-Stack Engineer",
        round: "Round 2 • Tech Screen",
        interviewers: "David Chen, Tariq Mansoor",
        time: "10:30 AM – 11:30 AM",
        location: "Google Meet",
        description: "Coding screen and system architecture.",
        badge: "Interview",
        badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200/80",
        dotColor: "#10b981",
      },
    ],

    // September 2026
    "2026-09-02": [
      {
        id: "sep-int-1",
        category: "interview",
        title: "Technical Screen",
        candidateName: "Lucas Vance",
        role: "Senior Full-Stack Engineer",
        round: "Round 1 • Tech Screen",
        interviewers: "David Chen",
        time: "11:00 AM – 12:00 PM",
        location: "Google Meet",
        description: "Initial coding screen and problem solving.",
        badge: "Interview",
        badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200/80",
        dotColor: "#10b981",
      },
    ],
    "2026-09-07": [
      {
        id: "sep-hol-1",
        category: "holiday",
        title: "Labor Day",
        time: "All Day",
        location: "All Offices",
        description: "Official public holiday. All offices closed.",
        badge: "Public Holiday",
        badgeColor: "bg-rose-50 text-rose-700 border-rose-200/80",
        dotColor: "#f43f5e",
      },
    ],
    "2026-09-09": [
      {
        id: "sep-int-2",
        category: "interview",
        title: "System Design Interview",
        candidateName: "Alex Thorne",
        role: "Senior Full-Stack Engineer",
        round: "Round 2 • System Design",
        interviewers: "David Chen, Tariq Mansoor",
        time: "10:00 AM – 11:00 AM",
        location: "Google Meet",
        description: "Architecture and backend scalability discussion.",
        badge: "Interview",
        badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200/80",
        dotColor: "#10b981",
        theme: "emerald",
      },
      {
        id: "sep-int-3",
        category: "interview",
        title: "Culture & Team Fit",
        candidateName: "Priya Sharma",
        role: "Product Operations Lead",
        round: "Round 3 • Culture Fit",
        interviewers: "Amira Patel, Chloe Bennett",
        time: "02:30 PM – 03:15 PM",
        location: "Room B / Meet",
        description: "Cross-functional collaboration and leadership fit.",
        badge: "Interview",
        badgeColor: "bg-purple-50 text-purple-700 border-purple-200/80",
        dotColor: "#8b5cf6",
        theme: "purple",
      },
    ],
    "2026-09-11": [
      {
        id: "sep-int-4",
        category: "interview",
        title: "Final Executive Round",
        candidateName: "Marcus Cole",
        role: "Growth Marketing Specialist",
        round: "Final Round",
        interviewers: "Amira Patel",
        time: "03:30 PM – 04:30 PM",
        location: "Boardroom / Meet",
        description: "Final hiring decision and offer discussion.",
        badge: "Interview",
        badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200/80",
        dotColor: "#10b981",
      },
    ],
    "2026-09-14": [
      {
        id: "sep-onb-1",
        category: "onboarding",
        title: "New Team Welcome",
        time: "09:30 AM – 11:30 AM",
        location: "Main HQ & Virtual",
        description: "3 new team members starting in Engineering & Product.",
        badge: "New Hires",
        badgeColor: "bg-cyan-50 text-cyan-700 border-cyan-200/80",
        dotColor: "#06b6d4",
      },
    ],
    "2026-09-17": [
      {
        id: "sep-int-5",
        category: "interview",
        title: "Design Portfolio Review",
        candidateName: "Elena Chen",
        role: "Senior UI/UX Designer",
        round: "Round 2 • Portfolio",
        interviewers: "Maya Lin, Sarah Jenkins",
        time: "01:00 PM – 02:00 PM",
        location: "Google Meet",
        description: "Reviewing past product design case studies.",
        badge: "Interview",
        badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200/80",
        dotColor: "#10b981",
      },
    ],
    "2026-09-21": [
      {
        id: "sep-hol-2",
        category: "holiday",
        title: "Autumn Equinox",
        time: "All Day",
        location: "All Offices",
        description: "Official public holiday. All offices closed.",
        badge: "Public Holiday",
        badgeColor: "bg-rose-50 text-rose-700 border-rose-200/80",
        dotColor: "#f43f5e",
      },
    ],
    "2026-09-24": [
      {
        id: "sep-int-6",
        category: "interview",
        title: "Live Coding Interview",
        candidateName: "Devon Miller",
        role: "Senior Full-Stack Engineer",
        round: "Round 2 • Coding",
        interviewers: "Tariq Mansoor",
        time: "11:30 AM – 12:30 PM",
        location: "Google Meet",
        description: "Live algorithm and API problem solving.",
        badge: "Interview",
        badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200/80",
        dotColor: "#10b981",
      },
    ],
    "2026-09-28": [
      {
        id: "sep-onb-2",
        category: "onboarding",
        title: "New Team Welcome",
        time: "10:00 AM – 11:30 AM",
        location: "San Francisco Hub",
        description: "DevOps Engineer starting today.",
        badge: "New Hires",
        badgeColor: "bg-cyan-50 text-cyan-700 border-cyan-200/80",
        dotColor: "#06b6d4",
      },
    ],

    // October 2026
    "2026-10-02": [
      {
        id: "oct-int-1",
        category: "interview",
        title: "Final Interview",
        candidateName: "Zachary Taylor",
        role: "Product Operations Lead",
        round: "Final Round",
        interviewers: "Amira Patel",
        time: "02:00 PM – 03:00 PM",
        location: "Google Meet",
        description: "Executive discussion on operations targets.",
        badge: "Interview",
        badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200/80",
        dotColor: "#10b981",
      },
    ],
    "2026-10-05": [
      {
        id: "oct-onb-1",
        category: "onboarding",
        title: "Q4 New Team Cohort",
        time: "09:30 AM – 11:30 AM",
        location: "Main HQ & Hybrid",
        description: "4 new engineers and designers joining.",
        badge: "New Hires",
        badgeColor: "bg-cyan-50 text-cyan-700 border-cyan-200/80",
        dotColor: "#06b6d4",
      },
    ],
    "2026-10-12": [
      {
        id: "oct-hol-1",
        category: "holiday",
        title: "Indigenous Peoples' Day",
        time: "All Day",
        location: "All Offices",
        description: "Official public holiday. All offices closed.",
        badge: "Public Holiday",
        badgeColor: "bg-rose-50 text-rose-700 border-rose-200/80",
        dotColor: "#f43f5e",
      },
    ],
    "2026-10-23": [
      {
        id: "oct-int-2",
        category: "interview",
        title: "Design Presentation",
        candidateName: "Avery Brooks",
        role: "Senior UI/UX Designer",
        round: "Round 2 • Design Review",
        interviewers: "Maya Lin, Sarah Jenkins",
        time: "11:00 AM – 12:00 PM",
        location: "Google Meet",
        description: "Design system review and prototype test.",
        badge: "Interview",
        badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200/80",
        dotColor: "#10b981",
      },
    ],

    // November 2026
    "2026-11-04": [
      {
        id: "nov-int-1",
        category: "interview",
        title: "Final Interview",
        candidateName: "Elena Chen",
        role: "Senior UI/UX Designer",
        round: "Final Round",
        interviewers: "Amira Patel",
        time: "11:00 AM – 12:00 PM",
        location: "Google Meet",
        description: "Final interview with HR Director.",
        badge: "Interview",
        badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200/80",
        dotColor: "#10b981",
      },
    ],
    "2026-11-16": [
      {
        id: "nov-onb-1",
        category: "onboarding",
        title: "November New Team Cohort",
        time: "09:30 AM – 11:30 AM",
        location: "HQ Training Room",
        description: "2 new engineers joining the platform team.",
        badge: "New Hires",
        badgeColor: "bg-cyan-50 text-cyan-700 border-cyan-200/80",
        dotColor: "#06b6d4",
      },
    ],
    "2026-11-26": [
      {
        id: "nov-hol-1",
        category: "holiday",
        title: "Thanksgiving Day",
        time: "All Day",
        location: "All Offices",
        description: "Official public holiday. All offices closed.",
        badge: "Public Holiday",
        badgeColor: "bg-rose-50 text-rose-700 border-rose-200/80",
        dotColor: "#f43f5e",
      },
    ],
  };

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  // 4. Active Job Requisitions
  const activeJobRequisitions = [
    {
      title: "Senior Full-Stack Engineer",
      dept: "Engineering",
      location: "HQ San Francisco • Hybrid",
      applicants: 42,
      inInterview: 6,
      daysOpen: 12,
      priority: "Urgent",
      priorityColor: "bg-rose-500 text-white",
    },
    {
      title: "Product Operations Lead",
      dept: "Operations",
      location: "US Remote • Distributed",
      applicants: 35,
      inInterview: 4,
      daysOpen: 8,
      priority: "Active",
      priorityColor: "bg-blue-600 text-white",
    },
    {
      title: "Senior UI/UX Product Designer",
      dept: "Product",
      location: "HQ San Francisco • On-site",
      applicants: 28,
      inInterview: 5,
      daysOpen: 15,
      priority: "Active",
      priorityColor: "bg-blue-600 text-white",
    },
    {
      title: "Growth Marketing Specialist",
      dept: "Sales & Mktg",
      location: "New York Hub • Hybrid",
      applicants: 37,
      inInterview: 3,
      daysOpen: 5,
      priority: "New",
      priorityColor: "bg-emerald-500 text-white",
    },
  ];

  // 5. Job Openings by Department Stats (Donut Chart & Breakdown)
  const jobDepartmentStats = [
    {
      name: "Engineering",
      shortName: "Engineering",
      roles: 3,
      pct: 37.5,
      color: "#7c69af",
      dashArray: "125.95 225.91",
      dashOffset: "0",
      applicants: 42,
      inInterview: 6,
    },
    {
      name: "Operations",
      shortName: "Operations",
      roles: 2,
      pct: 25.0,
      color: "#3b82f6",
      dashArray: "83.96 267.90",
      dashOffset: "-129.95",
      applicants: 35,
      inInterview: 4,
    },
    {
      name: "Product",
      shortName: "Product",
      roles: 2,
      pct: 25.0,
      color: "#f59e0b",
      dashArray: "83.96 267.90",
      dashOffset: "-217.91",
      applicants: 28,
      inInterview: 5,
    },
    {
      name: "Sales & Mktg",
      shortName: "Sales & Mktg",
      roles: 1,
      pct: 12.5,
      color: "#10b981",
      dashArray: "41.98 309.88",
      dashOffset: "-305.87",
      applicants: 37,
      inInterview: 3,
    },
  ];

  // Dynamic greeting based on current local time
  const currentHour = new Date().getHours();
  const greetingText =
    currentHour < 12
      ? "Good morning, Amira"
      : currentHour < 17
      ? "Good afternoon, Amira"
      : "Good evening, Amira";

  const formattedDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  // Pending Leave Requests for Approvals & Action Items
  const pendingLeaves = leaveRequests.filter((r) => r.status === "Pending");

  // Amira's Personal Employee Details
  const myEmployee =
    employees.find((e) => e.name === "Amira Patel") || employees[0];
  const myAttendance = attendanceRecords.filter(
    (a) => a.employeeId === myEmployee?.id || a.employeeName === "Amira Patel"
  );
  const myLeaveRequests = leaveRequests.filter(
    (r) => r.employeeId === myEmployee?.id || r.employeeName === "Amira Patel"
  );

  // Dynamic Month & Calendar Engine for Company & Recruitment Calendar
  const handlePrevMonth = () => {
    if (calendarMonth === 0) {
      setCalendarMonth(11);
      setCalendarYear((y) => y - 1);
    } else {
      setCalendarMonth((m) => m - 1);
    }
    setSelectedCalendarDay(1);
  };

  const handleNextMonth = () => {
    if (calendarMonth === 11) {
      setCalendarMonth(0);
      setCalendarYear((y) => y + 1);
    } else {
      setCalendarMonth((m) => m + 1);
    }
    setSelectedCalendarDay(1);
  };

  const handleJumpToday = () => {
    setCalendarYear(2026);
    setCalendarMonth(8); // September
    setSelectedCalendarDay(9);
  };

  const currentMonthName = monthNames[calendarMonth];

  // Dynamic Calendar Math for calendarYear and calendarMonth (Fixed 6-row / 42-slot grid so height never shifts)
  const daysInCurrentMonth = new Date(calendarYear, calendarMonth + 1, 0).getDate();
  const firstDayWeekday = new Date(calendarYear, calendarMonth, 1).getDay(); // 0 = Sun, 1 = Mon, ..., 6 = Sat
  const trailingEmptySlots = 42 - firstDayWeekday - daysInCurrentMonth;

  // Selected date events (for single day view)
  const selectedDateKey = `${calendarYear}-${String(calendarMonth + 1).padStart(2, "0")}-${String(selectedCalendarDay).padStart(2, "0")}`;
  const selectedDateEvents = companyCalendarEvents[selectedDateKey] || [];

  // Month event entries and month-wide events
  const monthPrefix = `${calendarYear}-${String(calendarMonth + 1).padStart(2, "0")}`;
  const currentMonthEventEntries = Object.entries(companyCalendarEvents)
    .filter(([k]) => k.startsWith(monthPrefix))
    .sort(([dateA], [dateB]) => dateA.localeCompare(dateB));

  const currentMonthEventList = currentMonthEventEntries.flatMap(([, evs]) => evs);

  const monthInterviewCount = currentMonthEventList.filter((e) => e.category === "interview").length;
  const monthHolidayCount = currentMonthEventList.filter((e) => e.category === "holiday").length;
  const monthOnboardingCount = currentMonthEventList.filter((e) => e.category === "onboarding").length;

  return (
    <div className="space-y-8 pb-14 font-sans">
      {/* 0. TOP-TIER 3D TACTILE BEVELED SWITCHER (JITTER-FREE / ZERO SHAKE) */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-200/80">
        <div className="inline-flex items-center p-1.5 rounded-2xl bg-gradient-to-b from-slate-100 to-slate-200/70 border border-slate-300/80 shadow-[0_2px_5px_rgba(0,0,0,0.05),inset_0_1px_1px_rgba(255,255,255,0.9)]">
          <button
            type="button"
            onClick={() => setActiveView("company")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-[background-color,box-shadow,color] duration-150 cursor-pointer select-none ${
              activeView === "company"
                ? "bg-white text-slate-900 shadow-[0_3px_0_#cbd5e1,0_6px_12px_rgba(0,0,0,0.07),inset_0_1px_0_#ffffff] border border-slate-200/90 [text-shadow:0_1px_0_rgba(255,255,255,1)]"
                : "border border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-200/50"
            }`}
          >
            <Building2 className={`w-3.5 h-3.5 shrink-0 ${activeView === "company" ? "text-slate-900" : "text-slate-500"}`} />
            <span className="whitespace-nowrap">Company Overview</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveView("personal")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-[background-color,box-shadow,color] duration-150 cursor-pointer select-none ${
              activeView === "personal"
                ? "bg-white text-slate-900 shadow-[0_3px_0_#cbd5e1,0_6px_12px_rgba(0,0,0,0.07),inset_0_1px_0_#ffffff] border border-slate-200/90 [text-shadow:0_1px_0_rgba(255,255,255,1)]"
                : "border border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-200/50"
            }`}
          >
            <User className={`w-3.5 h-3.5 shrink-0 ${activeView === "personal" ? "text-slate-900" : "text-slate-500"}`} />
            <span className="whitespace-nowrap">My Workspace</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 1. COMPANY OVERVIEW VIEW (ADMIN EXECUTIVE DASHBOARD)                       */}
      {/* ========================================================================= */}
      {activeView === "company" && (
        <div className="space-y-8 animate-in fade-in duration-200">
          {/* ========================================================================= */}
          {/* EXECUTIVE WORKFORCE HEADER: COMPACT PIE, ALIGNED CARDS & PULSE SECTION     */}
          {/* ========================================================================= */}
          <div className="space-y-4">
            {/* 1. CLEAN TOP GREETING BAR (PREMIUM PRODUCT STYLE) */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-1">
              <div>
                <h3 className="text-2xl sm:text-[26px] font-black text-slate-900 tracking-tight flex items-center gap-2">
                  <span suppressHydrationWarning>{greetingText}</span>
                  <span>👋</span>
                </h3>
                <p className="text-xs text-slate-500 font-medium flex items-center gap-1.5 mt-0.5">
                  <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span suppressHydrationWarning>{formattedDate}</span>
                  <span className="text-slate-300">•</span>
                  <span className="font-semibold text-slate-700">San Francisco HQ</span>
                </p>
              </div>

              {/* View Mode Toggle: [ By Department ] [ By Work Mode ] */}
              <div className="inline-flex p-1 rounded-2xl bg-slate-100 border border-slate-200/90 shadow-[0_2px_4px_rgba(0,0,0,0.04),inset_0_1px_1px_rgba(255,255,255,0.8)] self-start sm:self-auto">
                <button
                  type="button"
                  onClick={() => setBreakdownMode("department")}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer select-none ${
                    breakdownMode === "department"
                      ? "bg-white text-slate-900 shadow-[0_2px_0_#cbd5e1,0_4px_8px_rgba(0,0,0,0.06),inset_0_1px_0_#ffffff] border border-slate-200/90 [text-shadow:0_1px_0_rgba(255,255,255,1)]"
                      : "text-slate-600 hover:text-slate-900 border border-transparent"
                  }`}
                >
                  <Building2 className="w-3.5 h-3.5 shrink-0 text-slate-700" />
                  <span>By Department</span>
                </button>
                <button
                  type="button"
                  onClick={() => setBreakdownMode("location")}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer select-none ${
                    breakdownMode === "location"
                      ? "bg-white text-slate-900 shadow-[0_2px_0_#cbd5e1,0_4px_8px_rgba(0,0,0,0.06),inset_0_1px_0_#ffffff] border border-slate-200/90 [text-shadow:0_1px_0_rgba(255,255,255,1)]"
                      : "text-slate-600 hover:text-slate-900 border border-transparent"
                  }`}
                >
                  <Users className="w-3.5 h-3.5 shrink-0 text-slate-700" />
                  <span>By Work Mode</span>
                </button>
              </div>
            </div>

            {/* 2. MAIN WORKFORCE CARD: 3 COMPACT COHESIVE SECTIONS (ZERO EMPTY SPACE) */}
            <div className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-[0_3px_12px_rgba(0,0,0,0.04),inset_0_1px_0_#ffffff]">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
                {/* Section 1 (4 cols): Big Round Pie Chart with Simple Soft Shadow */}
                <div className="lg:col-span-4 flex flex-col items-center justify-between p-3.5 bg-slate-50/50 rounded-2xl border border-slate-100">
                  <div className="w-full flex items-center justify-between border-b border-slate-200/60 pb-1.5">
                    <span className="text-[10.5px] font-extrabold uppercase tracking-wider text-slate-700">
                      Distribution
                    </span>
                    {/* Shows Total Departments in Department mode and Total Modes in Location mode */}
                    <span className="text-[10px] font-bold text-slate-600 bg-white px-2 py-0.5 rounded-md border border-slate-200/90 shadow-2xs">
                      {breakdownMode === "department"
                        ? `${departmentBreakdown.length} Departments`
                        : `${locationBreakdown.length} Work Modes`}
                    </span>
                  </div>

                  {/* Big Centered Pie Chart */}
                  <div className="relative w-48 h-48 sm:w-52 sm:h-52 lg:w-56 lg:h-56 flex items-center justify-center py-2 my-auto">
                    <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-md overflow-visible">
                      {/* Solid Round Pie with Simple Clean Shadow */}
                      {(breakdownMode === "department" ? departmentBreakdown : locationBreakdown).map((item) => (
                        <path
                          key={`slice-${item.name}`}
                          d={item.path}
                          fill={item.color}
                        />
                      ))}

                      {/* Clean Percentage Numbers with subtle text-shadow */}
                      {(breakdownMode === "department" ? departmentBreakdown : locationBreakdown).map((item) => (
                        <SvgPercentageText
                          key={`pct-${breakdownMode}-${item.name}`}
                          x={item.tx}
                          y={item.ty + 4}
                          value={item.pct}
                          fontSize="13"
                        />
                      ))}
                    </svg>
                  </div>

                  {/* Summary Footer: Dynamic based on breakdownMode */}
                  <div className="w-full pt-2 flex items-center justify-between text-[10.5px] px-1 text-slate-500 border-t border-slate-200/60 font-medium shrink-0">
                    {breakdownMode === "department" ? (
                      <>
                        <span>Staff Allocation:</span>
                        <span className="font-semibold text-slate-700">7 Active Staff</span>
                      </>
                    ) : (
                      <>
                        <span>Active Presence:</span>
                        <span className="font-semibold text-slate-700">6 Present • 1 Scheduled Leave</span>
                      </>
                    )}
                  </div>
                </div>

                {/* Section 2 (4 cols): Department Matrix & Workplace Coverage - Normal Top Alignment & Inside Shadow */}
                <div className="lg:col-span-4 bg-slate-50/90 rounded-2xl border border-slate-200/80 p-3.5 shadow-xs flex flex-col justify-start">
                  {/* Card Header */}
                  <div className="flex items-center justify-between border-b border-slate-200/60 pb-2 shrink-0">
                    <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-700">
                      {breakdownMode === "department" ? "Department Matrix" : "Workplace Coverage"}
                    </span>
                    <span className="text-[10px] font-bold text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200 shadow-2xs">
                      {breakdownMode === "department" ? `${departmentBreakdown.length} Units` : "Today"}
                    </span>
                  </div>

                  {/* Content List: Starts right at top with normal space, cards have tactile inside shadow */}
                  <div className="mt-2.5 overflow-y-auto max-h-[225px] light-scrollbar pr-1 space-y-2">
                    {breakdownMode === "department" ? (
                      departmentBreakdown.map((dept) => (
                        <div
                          key={`grid-dept-${dept.name}`}
                          className="p-2.5 rounded-xl bg-white border border-slate-200/90 shadow-[inset_0_1px_3px_rgba(0,0,0,0.05),0_1px_2px_rgba(0,0,0,0.03)] hover:shadow-[inset_0_1px_4px_rgba(0,0,0,0.08)] transition-all w-full"
                        >
                          {/* Line 1: Color Dot + Heading on SAME LINE with Percentage on Right */}
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2 min-w-0">
                              <span className="w-2.5 h-2.5 rounded-full shrink-0 shadow-2xs" style={{ backgroundColor: dept.color }} />
                              <span className="font-bold text-slate-800 text-xs truncate">{dept.name}</span>
                            </div>
                            <span className="font-mono text-xs font-black text-slate-900 shrink-0">
                              <LegendPercentage key={`leg-pct-${dept.name}`} value={dept.pct} />
                            </span>
                          </div>
                          {/* Line 2: Staff Count + Lead */}
                          <div className="flex items-center justify-between text-[10.5px] text-slate-400 mt-1 pl-4.5">
                            <span>{dept.count} staff</span>
                            <span className="truncate">Lead: {dept.lead}</span>
                          </div>
                        </div>
                      ))
                    ) : (
                      locationBreakdown.map((loc) => (
                        <div
                          key={`grid-loc-${loc.name}`}
                          className="p-2.5 rounded-xl bg-white border border-slate-200/90 shadow-[inset_0_1px_3px_rgba(0,0,0,0.05),0_1px_2px_rgba(0,0,0,0.03)] hover:shadow-[inset_0_1px_4px_rgba(0,0,0,0.08)] transition-all w-full"
                        >
                          {/* Line 1: Color Dot + Heading on SAME LINE with Percentage on Right */}
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2 min-w-0">
                              <span className="w-2.5 h-2.5 rounded-full shrink-0 shadow-2xs" style={{ backgroundColor: loc.color }} />
                              <span className="font-bold text-slate-800 text-xs truncate">{loc.name}</span>
                            </div>
                            <span className="font-mono text-xs font-black text-slate-900 shrink-0">
                              <LegendPercentage key={`leg-pct-loc-${loc.name}`} value={loc.pct} />
                            </span>
                          </div>
                          {/* Line 2: Staff Count + Location Subtitle */}
                          <div className="flex items-center justify-between text-[10.5px] text-slate-400 mt-1 pl-4.5">
                            <span>{loc.count} staff</span>
                            <span className="truncate">{loc.sub}</span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Section 3 (4 cols): TODAY'S PRIORITIES - Clean, Simple, Normal Words */}
                {/* Section 3 (4 cols): TODAY'S OVERVIEW - Faithful Vertical Timeline UI */}
                <div className="lg:col-span-4 bg-slate-50/90 rounded-2xl border border-slate-200/80 p-3.5 sm:p-4 shadow-xs flex flex-col justify-between">
                  {/* Header */}
                  <div className="flex items-center justify-between border-b border-slate-200/60 pb-2 shrink-0">
                    <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-700">
                      {"Today's Overview"}
                    </span>
                  </div>

                  {/* Vertical Timeline Track with Connected Nodes - Evenly Distributed */}
                  <div className="relative py-3.5 sm:py-4 flex-1 flex flex-col justify-between gap-4 sm:gap-5">
                    {/* Continuous Vertical Connector Spine centered on 36px nodes */}
                    <div className="absolute left-[17px] top-5 bottom-5 w-[2px] bg-slate-200/90 rounded-full" />

                    {/* Timeline Item 1: Open Jobs */}
                    <div className="relative flex items-center gap-3.5 group">
                      {/* Node on the spine */}
                      <div className="relative z-10 w-9 h-9 rounded-full bg-indigo-600 text-white shadow-xs flex items-center justify-center shrink-0">
                        <Briefcase className="w-4 h-4 text-white" />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-bold text-slate-800 text-xs sm:text-[13px] truncate">2 Job Openings</span>
                          <Link
                            href="/hr-dashboard/onboarding"
                            className="text-[11px] sm:text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 px-3 py-1.5 rounded-lg shadow-xs transition-colors shrink-0 flex items-center gap-1"
                          >
                            View Jobs →
                          </Link>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-0.5 truncate">5 candidates applied</p>
                      </div>
                    </div>

                    {/* Timeline Item 2: Leave Request */}
                    <div className="relative flex items-center gap-3.5 group">
                      {/* Node on the spine */}
                      <div className="relative z-10 w-9 h-9 rounded-full bg-amber-500 text-white shadow-xs flex items-center justify-center shrink-0">
                        <Clock className="w-4 h-4 text-white" />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-bold text-slate-800 text-xs sm:text-[13px] truncate">1 Leave Request</span>
                          <Link
                            href="/hr-dashboard/leave-tracker?view=team"
                            className="text-[11px] sm:text-xs font-bold text-white bg-amber-500 hover:bg-amber-600 px-3 py-1.5 rounded-lg shadow-xs transition-colors shrink-0 flex items-center gap-1"
                          >
                            Review →
                          </Link>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-0.5 truncate">Carlos Mendez • Vacation</p>
                      </div>
                    </div>

                    {/* Timeline Item 3: Next Office Holiday */}
                    <div className="relative flex items-center gap-3.5 group">
                      {/* Node on the spine */}
                      <div className="relative z-10 w-9 h-9 rounded-full bg-emerald-500 text-white shadow-xs flex items-center justify-center shrink-0">
                        <Calendar className="w-4 h-4 text-white" />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-bold text-slate-800 text-xs sm:text-[13px] truncate">Next Office Holiday</span>
                          <span className="font-mono text-[11px] sm:text-xs font-bold text-white bg-emerald-600 px-3 py-1.5 rounded-lg shadow-xs shrink-0">
                            Mon, Oct 12
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-0.5 truncate">Autumn Holiday • Closed</p>
                      </div>
                    </div>
                  </div>

                  {/* Summary Footer: Total All Requests */}
                  <div className="pt-2 flex items-center justify-between text-[10.5px] px-1 text-slate-500 border-t border-slate-200/60 font-medium shrink-0">
                    <span>Total All Requests:</span>
                    <span className="font-semibold text-slate-700">
                      {pendingLeaves.length === 0
                        ? "0 Pending (All Cleared)"
                        : `${pendingLeaves.length} Pending`}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* WEEKLY ATTENDANCE & ACTIVE REQUISITIONS (HR ADMIN CORE MODULES)            */}
          {/* ========================================================================= */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
            {/* Left Card (8 cols): Company & Recruitment Operations Calendar */}
            <div className="lg:col-span-8 bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-[0_3px_12px_rgba(0,0,0,0.04),inset_0_1px_0_#ffffff] flex flex-col justify-between space-y-4 overflow-hidden">
              {/* Card Top Header with 2026 Year Badge */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-3">
                  <div className="relative z-10 w-9 h-9 rounded-full bg-[#7c69af] text-white shadow-xs flex items-center justify-center shrink-0">
                    <Calendar className="w-4.5 h-4.5 text-white" />
                  </div>
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                      Company &amp; Hiring Calendar
                    </h3>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold text-[#7c69af] bg-[#7c69af]/10 border border-[#7c69af]/20 shadow-2xs">
                      {calendarYear}
                    </span>
                  </div>
                </div>
              </div>

              {/* Evo-Calendar Integrated Container: Months Sidebar (Left) + Clean Grid (Center) + Agenda (Right) */}
              <div className="flex flex-col md:flex-row rounded-2xl border border-slate-200/90 overflow-hidden bg-white shadow-2xs items-stretch flex-1 md:h-[390px]">
                {/* 1. Left Months Sidebar (Evo-Calendar Signature Purple) */}
                <div
                  className={`bg-[#7c69af] text-white flex flex-col shrink-0 border-b md:border-b-0 md:border-r border-[#6c589e] transition-all duration-300 ease-in-out h-full ${
                    showMonthSidebar
                      ? "w-full md:w-[108px] opacity-100"
                      : "w-0 md:w-0 h-0 md:h-full opacity-0 overflow-hidden border-none pointer-events-none p-0"
                  }`}
                >
                  {/* Year Navigation Header */}
                  <div className="flex items-center justify-between px-2 py-2 border-b border-white/15 shrink-0">
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => setCalendarYear((y) => y - 1)}
                        className="w-5 h-5 flex items-center justify-center rounded text-white/80 hover:text-white hover:bg-white/20 transition-colors cursor-pointer"
                        title="Previous year"
                      >
                        <ChevronLeft className="w-3.5 h-3.5" />
                      </button>
                      <span className="text-xs font-bold text-white tracking-wider">
                        {calendarYear}
                      </span>
                      <button
                        type="button"
                        onClick={() => setCalendarYear((y) => y + 1)}
                        className="w-5 h-5 flex items-center justify-center rounded text-white/80 hover:text-white hover:bg-white/20 transition-colors cursor-pointer"
                        title="Next year"
                      >
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowMonthSidebar(false)}
                      className="w-5 h-5 flex items-center justify-center rounded text-white/75 hover:text-white hover:bg-white/20 transition-colors cursor-pointer"
                      title="Collapse months"
                    >
                      <Menu className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* 12 Months Stack - Clean with No Scrollbar */}
                  <div className="p-1 space-y-0.5 overflow-hidden flex-1 flex flex-col justify-between">
                    {monthNames.map((mName, idx) => {
                      const isCurrent = calendarMonth === idx;
                      return (
                        <button
                          key={mName}
                          type="button"
                          onClick={() => {
                            setCalendarMonth(idx);
                            setSelectedCalendarDay(1);
                          }}
                          className={`w-full text-left px-2 py-0.5 sm:py-1 rounded-md text-[11px] font-medium transition-colors cursor-pointer truncate ${
                            isCurrent
                              ? "bg-[#5e4a8b] text-white font-bold shadow-2xs"
                              : "text-white/80 hover:text-white hover:bg-white/15"
                          }`}
                        >
                          {mName}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 2. Center Clean Calendar Grid */}
                <div className="flex-1 p-3.5 sm:p-4 flex flex-col justify-between min-w-0 h-full overflow-hidden">
                  {/* Calendar Grid Header: Toggle Icon + Centered Month + Next/Prev Chevrons */}
                  <div className="flex items-center justify-between pb-2 shrink-0">
                    <div className="w-7 h-7 flex items-center justify-center shrink-0">
                      {!showMonthSidebar && (
                        <button
                          type="button"
                          onClick={() => setShowMonthSidebar(true)}
                          className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-500 hover:text-[#7c69af] hover:bg-[#7c69af]/10 transition-colors cursor-pointer"
                          title="Open months menu"
                        >
                          <Menu className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={handlePrevMonth}
                        aria-label="Previous month"
                        className="w-7 h-7 flex items-center justify-center rounded-lg text-[#7c69af] hover:bg-[#7c69af]/10 transition-colors cursor-pointer"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <h4 className="text-sm sm:text-base font-bold text-[#7c69af] uppercase tracking-widest text-center min-w-[130px]">
                        {currentMonthName}
                      </h4>
                      <button
                        type="button"
                        onClick={handleNextMonth}
                        aria-label="Next month"
                        className="w-7 h-7 flex items-center justify-center rounded-lg text-[#7c69af] hover:bg-[#7c69af]/10 transition-colors cursor-pointer"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="w-7 h-7 shrink-0" />
                  </div>

                  {/* Weekday Names (Sun Mon Tue Wed Thu Fri Sat) */}
                  <div className="grid grid-cols-7 text-center pb-2 text-xs font-semibold text-slate-400">
                    {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                      <div key={day} className="py-0.5">
                        {day}
                      </div>
                    ))}
                  </div>

                  {/* Clean Days Grid - Fixed 6 Rows (42 Slots) so height never shifts */}
                  <div className="grid grid-cols-7 gap-y-1.5 py-1">
                    {/* Leading Empty Slots */}
                    {Array.from({ length: firstDayWeekday }).map((_, i) => (
                      <div key={`empty-lead-${i}`} className="h-8 sm:h-8.5" />
                    ))}

                    {/* Days of Month */}
                    {Array.from({ length: daysInCurrentMonth }).map((_, i) => {
                      const dayNum = i + 1;
                      const dateKey = `${calendarYear}-${String(calendarMonth + 1).padStart(2, "0")}-${String(dayNum).padStart(2, "0")}`;
                      const cellEvents = companyCalendarEvents[dateKey] || [];
                      const isSelected = selectedCalendarDay === dayNum;
                      const hasHoliday = cellEvents.some((e) => e.category === "holiday");
                      const hasInterview = cellEvents.some((e) => e.category === "interview");
                      const hasOnboarding = cellEvents.some((e) => e.category === "onboarding");

                      return (
                        <div key={`day-${dayNum}`} className="h-8 sm:h-8.5 flex items-center justify-center">
                          <button
                            type="button"
                            onClick={() => setSelectedCalendarDay(dayNum)}
                            className={`group relative w-7.5 h-7.5 sm:w-8 sm:h-8 rounded-full flex flex-col items-center justify-center transition-all cursor-pointer ${
                              isSelected
                                ? "bg-[#7c69af] text-white font-bold shadow-xs scale-105"
                                : "text-slate-700 hover:bg-[#7c69af]/10 hover:text-[#7c69af] font-medium"
                            }`}
                          >
                            <span className="text-xs leading-none">{dayNum}</span>
                            {cellEvents.length > 0 && (
                              <div className="flex items-center justify-center gap-0.5 mt-0.5 h-1">
                                {hasHoliday && (
                                  <span
                                    className={`w-1 h-1 rounded-full ${
                                      isSelected ? "bg-white" : "bg-rose-500"
                                    }`}
                                  />
                                )}
                                {hasInterview && (
                                  <span
                                    className={`w-1 h-1 rounded-full ${
                                      isSelected ? "bg-white" : "bg-emerald-500"
                                    }`}
                                  />
                                )}
                                {hasOnboarding && (
                                  <span
                                    className={`w-1 h-1 rounded-full ${
                                      isSelected ? "bg-white" : "bg-cyan-500"
                                    }`}
                                  />
                                )}
                              </div>
                            )}
                          </button>
                        </div>
                      );
                    })}

                    {/* Trailing Empty Slots - Fills up to 42 cells (6 full rows) */}
                    {Array.from({ length: trailingEmptySlots }).map((_, i) => (
                      <div key={`empty-trail-${i}`} className="h-8 sm:h-8.5" />
                    ))}
                  </div>

                  {/* Clean Dot Legend Line */}
                  <div className="flex items-center justify-center gap-3 sm:gap-4 pt-2 border-t border-slate-100 text-[10px] sm:text-[11px] font-medium text-slate-500 whitespace-nowrap shrink-0">
                    <span className="inline-flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      <span>Interviews</span>
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-rose-500" />
                      <span>Holidays</span>
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-cyan-500" />
                      <span>New Hires</span>
                    </span>
                  </div>
                </div>

                {/* 3. Right Agenda Panel (Selected Day Events matching Evo-Calendar) */}
                <div className="w-full md:w-[320px] xl:w-[350px] border-t md:border-t-0 md:border-l border-slate-100 p-4 sm:p-5 flex flex-col justify-between bg-white shrink-0 h-full overflow-hidden">
                  {/* Header: Date Title + Event Count Pill */}
                  <div className="flex items-start justify-between pb-3.5 border-b border-slate-100">
                    <div>
                      <h4 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight leading-tight">
                        {currentMonthName} {selectedCalendarDay < 10 ? `0${selectedCalendarDay}` : selectedCalendarDay}, {calendarYear}
                      </h4>
                      <p className="text-xs text-slate-400 font-medium mt-0.5">
                        {new Date(calendarYear, calendarMonth, selectedCalendarDay).toLocaleDateString("en-US", { weekday: "long" })}
                      </p>
                    </div>

                    <span
                      className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border shrink-0 ${
                        selectedDateEvents.length > 0
                          ? "text-emerald-700 bg-emerald-50 border-emerald-200/80"
                          : "text-slate-500 bg-slate-100 border-slate-200/70"
                      }`}
                    >
                      <div className={`w-4 h-4 rounded-full ${selectedDateEvents.length > 0 ? "bg-emerald-500" : "bg-slate-300"} text-white flex items-center justify-center shrink-0 shadow-2xs`}>
                        <Calendar className="w-2.5 h-2.5 text-white" />
                      </div>
                      <span>{selectedDateEvents.length} {selectedDateEvents.length === 1 ? "event" : "events"}</span>
                    </span>
                  </div>

                  {/* Events Scroll Container: Smooth Scrollable when more data */}
                  <div className="space-y-3 max-h-[300px] overflow-y-auto overflow-x-hidden pr-1.5 flex-1 min-h-0 light-scrollbar py-2 overscroll-contain">
                    {selectedDateEvents.length > 0 ? (
                      selectedDateEvents.map((event) => {
                        if (event.category === "interview") {
                          return (
                            <div
                              key={event.id}
                              className="relative overflow-hidden pl-4 pr-3 py-3 rounded-2xl border border-emerald-100/90 bg-white shadow-sm hover:shadow-md space-y-2 hover:-translate-y-0.5 transition-all duration-150"
                            >
                              {/* Green Accent Bar for all Interviews (matching calendar legend) */}
                              <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-emerald-500 rounded-l-2xl" />

                              {/* Top Row: Candidate & Role (Left) vs Small Time (Right) */}
                              <div className="flex items-start justify-between gap-2">
                                <div className="min-w-0 flex-1">
                                  <h5 className="text-sm font-bold text-slate-900 leading-tight truncate">
                                    {event.candidateName}
                                  </h5>
                                  <p className="text-[11px] text-slate-500 font-medium mt-0.5 truncate">
                                    {event.role}
                                  </p>
                                </div>

                                <div className="flex items-center gap-1 text-[11px] font-medium text-slate-400 shrink-0 pt-0.5">
                                  <Clock className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                                  <span>{event.time}</span>
                                </div>
                              </div>

                              {/* Bottom Row: Interviewers */}
                              <div className="pt-2 border-t border-emerald-50 flex items-center gap-1.5 text-xs">
                                <div className="w-5 h-5 rounded-full bg-emerald-500 text-white shadow-2xs flex items-center justify-center shrink-0">
                                  <Users className="w-2.5 h-2.5 text-white" />
                                </div>
                                <span className="truncate text-xs font-medium text-slate-600">{event.interviewers}</span>
                              </div>
                            </div>
                          );
                        }

                        if (event.category === "holiday") {
                          return (
                            <div
                              key={event.id}
                              className="relative overflow-hidden pl-4 pr-3 py-3 rounded-2xl border border-rose-100/90 bg-white shadow-sm hover:shadow-md space-y-2 hover:-translate-y-0.5 transition-all duration-150"
                            >
                              {/* Red Accent Bar for all Holidays (matching calendar legend) */}
                              <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-rose-500 rounded-l-2xl" />

                              {/* Top Row: Title & Description (Left) vs Time (Right) */}
                              <div className="flex items-start justify-between gap-2">
                                <div className="min-w-0 flex-1">
                                  <h5 className="text-sm font-bold text-slate-900 leading-tight truncate">
                                    {event.title}
                                  </h5>
                                  <p className="text-[11px] text-slate-500 font-medium mt-0.5 truncate">
                                    {event.description}
                                  </p>
                                </div>

                                <div className="flex items-center gap-1 text-[11px] font-medium text-slate-400 shrink-0 pt-0.5">
                                  <Sun className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                                  <span>{event.time || "All Day"}</span>
                                </div>
                              </div>

                              {/* Bottom Row: Location */}
                              <div className="pt-2 border-t border-rose-50 flex items-center gap-1.5 text-slate-600 font-medium truncate text-xs min-w-0">
                                <div className="w-5 h-5 rounded-full bg-rose-500 text-white shadow-2xs flex items-center justify-center shrink-0">
                                  <Building2 className="w-2.5 h-2.5 text-white" />
                                </div>
                                <span className="truncate text-xs font-medium text-slate-600">{event.location || "All Offices"}</span>
                              </div>
                            </div>
                          );
                        }

                        return (
                          <div
                            key={event.id}
                            className="relative overflow-hidden pl-4 pr-3 py-3 rounded-2xl border border-cyan-100/90 bg-white shadow-sm hover:shadow-md space-y-2 hover:-translate-y-0.5 transition-all duration-150"
                          >
                            {/* Simple Solid Left Accent Bar */}
                            <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-cyan-500 rounded-l-2xl" />

                            {/* Top Row: Title & Description (Left) vs Time (Right) */}
                            <div className="flex items-start justify-between gap-2">
                              <div className="min-w-0 flex-1">
                                <h5 className="text-sm font-bold text-slate-900 leading-tight truncate">
                                  {event.title}
                                </h5>
                                <p className="text-[11px] text-slate-500 font-medium mt-0.5 truncate">
                                  {event.description}
                                </p>
                              </div>

                              <div className="flex items-center gap-1 text-[11px] font-medium text-slate-400 shrink-0 pt-0.5">
                                <Clock className="w-3.5 h-3.5 text-cyan-600 shrink-0" />
                                <span>{event.time}</span>
                              </div>
                            </div>

                            {/* Bottom Row: Location */}
                            <div className="pt-2 border-t border-cyan-50 flex items-center gap-1.5 text-slate-600 font-medium truncate text-xs min-w-0">
                              <div className="w-5 h-5 rounded-full bg-cyan-500 text-white shadow-2xs flex items-center justify-center shrink-0">
                                <Building2 className="w-2.5 h-2.5 text-white" />
                              </div>
                              <span className="truncate text-xs font-medium text-slate-600">{event.location}</span>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="h-full min-h-[220px] flex flex-col items-center justify-center text-center p-4 rounded-2xl bg-slate-50/60 border border-slate-200/60 space-y-2">
                        <div className="w-9 h-9 rounded-xl bg-white border border-slate-200/80 shadow-2xs flex items-center justify-center text-slate-400">
                          <Calendar className="w-4 h-4 text-slate-400" />
                        </div>
                        <div>
                          <h5 className="text-xs font-bold text-slate-800">
                            No Events Scheduled
                          </h5>
                          <p className="text-[11px] text-slate-400 mt-0.5 max-w-[200px] leading-relaxed">
                            Regular workday for all teams. No interviews or holidays on this date.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Footer Note */}
                  <div className="pt-3 border-t border-slate-100 flex items-center gap-2 text-xs text-slate-400 font-medium">
                    <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>Have a productive day!</span>
                  </div>
                </div>
              </div>

              {/* Card Footer: Monthly Summary & Link to Recruitment Module */}
              <div className="pt-2.5 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-3 text-slate-500 text-[11px]">
                  <span>
                    Monthly Total:{" "}
                    <strong className="text-slate-800 font-semibold">
                      {monthInterviewCount} {monthInterviewCount === 1 ? "Interview" : "Interviews"} • {monthHolidayCount} {monthHolidayCount === 1 ? "Holiday" : "Holidays"} • {monthOnboardingCount} Cohorts
                    </strong>
                  </span>
                </div>
                <Link
                  href="/hr-dashboard/onboarding"
                  className="font-bold text-[#7c69af] hover:text-[#6c589e] flex items-center gap-1 transition-colors self-start sm:self-auto"
                >
                  <span>Hiring Pipeline</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Right Card (4 cols): Active Job Openings Chart & Velocity */}
            <div className="lg:col-span-4 bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-[0_3px_12px_rgba(0,0,0,0.04),inset_0_1px_0_#ffffff] flex flex-col justify-between space-y-4">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                  Job Openings
                </h3>

                {/* View Mode Toggle: Chart vs Roles */}
                <div className="flex items-center bg-slate-100 p-0.5 rounded-xl border border-slate-200/60 text-xs font-semibold">
                  <button
                    type="button"
                    onClick={() => setJobsViewMode("chart")}
                    className={`px-2.5 py-1 rounded-lg transition-all flex items-center gap-1.5 text-[11px] ${
                      jobsViewMode === "chart"
                        ? "bg-white text-[#7c69af] shadow-xs font-bold"
                        : "text-slate-500 hover:text-slate-900"
                    }`}
                    title="View Breakdown Chart"
                  >
                    <PieChart className="w-3 h-3" />
                    <span>Chart</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setJobsViewMode("roles")}
                    className={`px-2.5 py-1 rounded-lg transition-all flex items-center gap-1.5 text-[11px] ${
                      jobsViewMode === "roles"
                        ? "bg-white text-[#7c69af] shadow-xs font-bold"
                        : "text-slate-500 hover:text-slate-900"
                    }`}
                    title="View Listed Roles"
                  >
                    <Briefcase className="w-3 h-3" />
                    <span>Roles</span>
                  </button>
                </div>
              </div>

              {/* Main Content: Chart View or Roles View */}
              {jobsViewMode === "chart" ? (
                <div className="flex-1 flex flex-col justify-between py-1 space-y-4">
                  {/* Donut Chart & Department Matrix */}
                  <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-5">
                    {/* Donut Ring Chart */}
                    <div className="relative w-36 h-36 sm:w-40 sm:h-40 flex items-center justify-center shrink-0">
                      <svg
                        className="w-full h-full transform -rotate-90 origin-center"
                        viewBox="0 0 160 160"
                      >
                        {/* Background subtle ring track */}
                        <circle
                          cx="80"
                          cy="80"
                          r="56"
                          fill="none"
                          stroke="#f1f5f9"
                          strokeWidth="16"
                        />
                        {/* Dynamic Department Segments */}
                        {jobDepartmentStats.map((dept) => {
                          const isHovered = hoveredJobDept === dept.name;
                          return (
                            <circle
                              key={dept.name}
                              cx="80"
                              cy="80"
                              r="56"
                              fill="none"
                              stroke={dept.color}
                              strokeWidth={isHovered ? 19 : 16}
                              strokeDasharray={dept.dashArray}
                              strokeDashoffset={dept.dashOffset}
                              strokeLinecap="butt"
                              className="transition-all duration-300 cursor-pointer"
                              onMouseEnter={() => setHoveredJobDept(dept.name)}
                              onMouseLeave={() => setHoveredJobDept(null)}
                            />
                          );
                        })}
                      </svg>

                      {/* Donut Center Display */}
                      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center px-2">
                        <span className="text-3xl font-extrabold text-slate-900 tracking-tight leading-none">
                          {hoveredJobDept
                            ? jobDepartmentStats.find((d) => d.name === hoveredJobDept)?.roles
                            : "8"}
                        </span>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-1.5">
                          Open Roles
                        </span>
                      </div>
                    </div>

                    {/* Department Progress Breakdown */}
                    <div className="flex-1 w-full space-y-2">
                      {jobDepartmentStats.map((dept) => {
                        const isHovered = hoveredJobDept === dept.name;
                        return (
                          <div
                            key={dept.name}
                            onMouseEnter={() => setHoveredJobDept(dept.name)}
                            onMouseLeave={() => setHoveredJobDept(null)}
                            className={`p-2 rounded-xl border transition-all cursor-pointer ${
                              isHovered
                                ? "bg-slate-50/90 border-slate-200 shadow-2xs"
                                : "bg-white border-transparent hover:bg-slate-50/60"
                            }`}
                          >
                            <div className="flex items-center justify-between text-xs">
                              <div className="flex items-center gap-2">
                                <span
                                  className="w-2.5 h-2.5 rounded-full shrink-0 shadow-2xs"
                                  style={{ backgroundColor: dept.color }}
                                />
                                <span className="font-bold text-slate-800">
                                  {dept.name}
                                </span>
                              </div>
                              <div className="flex items-center gap-1.5">
                                <span className="font-extrabold text-slate-900">
                                  {dept.roles}
                                </span>
                                <span className="text-[11px] text-slate-400 font-medium">
                                  {dept.roles === 1 ? "role" : "roles"}
                                </span>
                              </div>
                            </div>

                            {/* Micro Progress Bar */}
                            <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden mt-1.5">
                              <div
                                className="h-full rounded-full transition-all duration-500"
                                style={{
                                  width: `${dept.pct}%`,
                                  backgroundColor: dept.color,
                                }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Recruitment Pipeline Velocity KPI Strip */}
                  <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100">
                    <div className="bg-slate-50/80 rounded-2xl p-2.5 border border-slate-100/90 text-center">
                      <span className="text-[11px] font-medium text-slate-500 block truncate">
                        Applicants
                      </span>
                      <span className="text-base sm:text-lg font-extrabold text-slate-900 block leading-tight">
                        142
                      </span>
                      <span className="text-[10px] font-bold text-emerald-600 block mt-0.5">
                        ↑ 18 new
                      </span>
                    </div>

                    <div className="bg-slate-50/80 rounded-2xl p-2.5 border border-slate-100/90 text-center">
                      <span className="text-[11px] font-medium text-slate-500 block truncate">
                        Interviewing
                      </span>
                      <span className="text-base sm:text-lg font-extrabold text-slate-900 block leading-tight">
                        18
                      </span>
                      <span className="text-[10px] font-bold text-[#7c69af] block mt-0.5">
                        Active rounds
                      </span>
                    </div>

                    <div className="bg-slate-50/80 rounded-2xl p-2.5 border border-slate-100/90 text-center">
                      <span className="text-[11px] font-medium text-slate-500 block truncate">
                        Offers
                      </span>
                      <span className="text-base sm:text-lg font-extrabold text-slate-900 block leading-tight">
                        4
                      </span>
                      <span className="text-[10px] font-bold text-amber-600 block mt-0.5">
                        Pending
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                /* Roles View Mode: Clean Requisition List */
                <div className="divide-y divide-slate-100 flex-1 flex flex-col justify-between py-1">
                  {activeJobRequisitions.map((job, idx) => (
                    <div
                      key={idx}
                      className="py-3 px-2.5 -mx-2.5 rounded-xl hover:bg-slate-50/80 transition-colors flex items-center justify-between gap-3 group cursor-pointer"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="text-xs sm:text-[13px] font-bold text-slate-900 group-hover:text-[#7c69af] transition-colors truncate">
                            {job.title}
                          </h4>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shadow-2xs ${job.priorityColor} shrink-0`}>
                            {job.priority}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 font-medium mt-1 truncate">
                          {job.dept} <span className="text-slate-300">•</span> {job.location}
                        </p>
                      </div>

                      <div className="text-right shrink-0">
                        <div className="flex items-baseline justify-end gap-1">
                          <span className="text-xs sm:text-sm font-bold text-slate-900">{job.applicants}</span>
                          <span className="text-[11px] text-slate-500 font-medium">Applicants</span>
                        </div>
                        <p className="text-[11px] font-semibold text-[#7c69af] mt-0.5 flex items-center justify-end gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                          {job.inInterview} in interview
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Action Link Footer */}
              <div className="pt-2.5 border-t border-slate-100">
                <Link
                  href="/hr-dashboard/onboarding"
                  className="flex items-center justify-between text-xs font-bold text-[#7c69af] hover:text-[#6c589e] bg-[#7c69af]/5 hover:bg-[#7c69af]/10 px-3.5 py-2.5 rounded-2xl border border-[#7c69af]/15 transition-colors group"
                >
                  <span className="flex items-center gap-2">
                    <UserCheck className="w-4 h-4 text-[#7c69af]" />
                    <span>Manage Candidate Pipeline &amp; Onboarding</span>
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. MY PERSONAL WORKSPACE VIEW (AMIRA PATEL EMPLOYEE PORTAL)               */}
      {/* ========================================================================= */}
      {activeView === "personal" && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* 1. CLEAN TOP GREETING BAR (MATCHING COMPANY OVERVIEW) */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-1">
            <div>
              <h3 className="text-2xl sm:text-[26px] font-black text-slate-900 tracking-tight flex items-center gap-2">
                <span suppressHydrationWarning>{greetingText}</span>
                <span>👋</span>
              </h3>
              <p className="text-xs text-slate-500 font-medium flex items-center gap-1.5 mt-0.5">
                <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span suppressHydrationWarning>{formattedDate}</span>
                <span className="text-slate-300">•</span>
                <span className="font-semibold text-slate-700">San Francisco HQ</span>
              </p>
            </div>

            {/* The 2 Action Buttons (Matching Company Overview header alignment) */}
            <div className="flex items-center gap-2.5 self-start sm:self-auto shrink-0">
              <Link
                href="/hr-dashboard/leave-tracker?view=my&action=apply"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-[#7c69af] hover:bg-[#6c589e] text-white shadow-xs shadow-[#7c69af]/20 transition-all duration-150 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Apply for Leave</span>
              </Link>
              <Link
                href="/portal/profile"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200/90 shadow-2xs transition-all duration-150 cursor-pointer"
              >
                <User className="w-3.5 h-3.5 text-slate-600" />
                <span>View Full Profile</span>
              </Link>
            </div>
          </div>

          {/* Personal Top Grid: Today's Shift & Leave Balances (Payslip Removed) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-stretch">
            {/* Card 1: Today's Shift & Punch Card */}
            <div className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-[0_3px_12px_rgba(0,0,0,0.04),inset_0_1px_0_#ffffff] flex flex-col justify-between space-y-4">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-3">
                  <div className="relative z-10 w-9 h-9 rounded-full bg-emerald-500 text-white shadow-xs flex items-center justify-center shrink-0">
                    <Clock className="w-4.5 h-4.5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                      Today&apos;s Work Status
                    </h3>
                    <p className="text-[11px] text-slate-400 font-medium">
                      Keep going! You&apos;re on track.
                    </p>
                  </div>
                </div>

                <span
                  className={`text-xs font-bold px-3 py-1 rounded-full border shrink-0 flex items-center gap-1.5 ${
                    isPunchedIn
                      ? "bg-emerald-50 text-emerald-700 border-emerald-200/80"
                      : "bg-slate-100 text-slate-600 border-slate-200"
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      isPunchedIn ? "bg-emerald-500 animate-pulse" : "bg-slate-400"
                    }`}
                  />
                  {isPunchedIn ? "Checked In" : "Checked Out"}
                </span>
              </div>

              {/* Attendance Body: Progress Ring + Timeline cluster (Left) & Action Panel (Right) */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-6 py-2">
                {/* Left Cluster: Progress Ring + Vertical Timeline with spacious clean layout */}
                <div className="flex items-center gap-6 sm:gap-8 lg:gap-10">
                  {/* 1. Progress Ring */}
                  <div className="relative w-28 h-28 sm:w-30 sm:h-30 flex items-center justify-center shrink-0">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
                      {/* Track Ring */}
                      <circle
                        cx="60"
                        cy="60"
                        r="48"
                        stroke="#f1f5f9"
                        strokeWidth="8.5"
                        fill="none"
                      />
                      {/* Animated Progress Arc */}
                      <circle
                        cx="60"
                        cy="60"
                        r="48"
                        stroke="#10b981"
                        strokeWidth="8.5"
                        strokeDasharray="301.6"
                        strokeDashoffset={isPunchedIn ? "90.5" : "0"}
                        strokeLinecap="round"
                        fill="none"
                        className="transition-all duration-700 ease-out"
                      />
                    </svg>
                    {/* Ring Inner Content: Clean, spacious, uncrowded */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center select-none pointer-events-none px-1">
                      <p className="text-lg sm:text-xl font-black text-slate-900 tracking-tight leading-none">
                        {isPunchedIn ? "2h 42m" : "8.2 hrs"}
                      </p>
                      <p className="text-[10.5px] font-bold text-slate-400 uppercase tracking-wider mt-1.5">
                        Worked
                      </p>
                    </div>
                  </div>

                  {/* 2. Vertical Timeline (Generous spacing, clean alignment) */}
                  <div className="flex flex-col justify-center shrink-0">
                    {/* Punch In Node */}
                    <div className="flex items-start gap-3">
                      <div className="flex flex-col items-center mt-0.5">
                        <div className="w-3.5 h-3.5 rounded-full bg-emerald-500 ring-4 ring-emerald-100 shrink-0" />
                        <div className="w-0.5 h-7 sm:h-8 bg-slate-200 my-1 rounded-full" />
                      </div>
                      <div className="min-w-0 pt-0.5">
                        <p className="text-sm font-black text-slate-900 leading-none">
                          {punchInTime}
                        </p>
                        <p className="text-[11px] font-bold text-emerald-600 mt-1">
                          Punch In
                        </p>
                      </div>
                    </div>

                    {/* Punch Out Node */}
                    <div className="flex items-start gap-3">
                      <div className="w-3.5 h-3.5 rounded-full border-2 border-slate-300 bg-white ring-2 ring-slate-100 shrink-0 mt-0.5" />
                      <div className="min-w-0">
                        <p className="text-sm font-black text-slate-700 leading-none">
                          {isPunchedIn ? "--:--" : "06:00 PM"}
                        </p>
                        <p className="text-[11px] font-semibold text-slate-400 mt-1">
                          Punch Out
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 3. Right Action Panel: Full Color Button, Location & Shift Hours */}
                <div className="w-full sm:w-auto sm:min-w-[210px] sm:max-w-[240px] p-4 rounded-2xl bg-slate-50/80 border border-slate-100/90 space-y-3 flex flex-col justify-center shrink-0">
                  <button
                    type="button"
                    onClick={handleTogglePunch}
                    className={`w-full py-2.5 px-4 rounded-xl font-bold text-xs sm:text-sm shadow-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      isPunchedIn
                        ? "bg-[#f43f5e] hover:bg-[#e11d48] active:scale-[0.98] text-white shadow-rose-500/20"
                        : "bg-emerald-500 hover:bg-emerald-600 active:scale-[0.98] text-white shadow-emerald-500/20"
                    }`}
                  >
                    {isPunchedIn ? (
                      <>
                        <LogOut className="w-4 h-4 text-white" />
                        <span>Punch Out</span>
                      </>
                    ) : (
                      <>
                        <LogIn className="w-4 h-4 text-white" />
                        <span>Punch In</span>
                      </>
                    )}
                  </button>

                  <div className="space-y-1.5 pt-0.5 text-xs text-slate-600 font-medium">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">San Francisco HQ</span>
                    </div>
                    <div className="flex items-center gap-2 whitespace-nowrap">
                      <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>09:00 AM – 06:00 PM</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Link Footer */}
              <div className="pt-2.5 border-t border-slate-100">
                <Link
                  href="/hr-dashboard/attendance?view=my"
                  className="flex items-center justify-between text-xs font-bold text-[#7c69af] hover:text-[#6c589e] bg-[#7c69af]/5 hover:bg-[#7c69af]/10 px-3.5 py-2.5 rounded-2xl border border-[#7c69af]/15 transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-[#7c69af]" />
                    View Attendance Calendar
                  </span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Card 2: My Leave Balances (Exact "6. Circular Rings" Mockup Match) */}
            <div className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-[0_3px_12px_rgba(0,0,0,0.04),inset_0_1px_0_#ffffff] flex flex-col justify-between space-y-4">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-3">
                  <div className="relative z-10 w-9 h-9 rounded-full bg-[#7c69af] text-white shadow-xs flex items-center justify-center shrink-0">
                    <PieChart className="w-4.5 h-4.5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                      My Leave Balances
                    </h3>
                    <p className="text-[11px] text-slate-400 font-medium">
                      Your time off, your well-being.
                    </p>
                  </div>
                </div>

                <span className="text-xs font-bold text-white bg-[#7c69af] px-3 py-1 rounded-full shadow-xs shrink-0">
                  2026 Policy
                </span>
              </div>

              {/* 3 Circular Rings & Total Summary Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 sm:gap-4 items-center py-1">
                {/* Left: 3 Circular Rings (sm:col-span-8) */}
                <div className="sm:col-span-8 grid grid-cols-3 gap-2 sm:gap-3 text-center items-center">
                  {/* 1. Annual Leave Ring */}
                  <div className="flex flex-col items-center">
                    <div className="relative w-18 h-18 sm:w-20 sm:h-20 flex items-center justify-center shrink-0">
                      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 80 80">
                        <circle cx="40" cy="40" r="32" stroke="#f1f5f9" strokeWidth="6.5" fill="none" />
                        <circle
                          cx="40"
                          cy="40"
                          r="32"
                          stroke="#10b981"
                          strokeWidth="6.5"
                          strokeDasharray="201.06"
                          strokeDashoffset="67.02"
                          strokeLinecap="round"
                          fill="none"
                          className="transition-all duration-700 ease-out"
                        />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-center select-none pointer-events-none">
                        <p className="text-base sm:text-lg font-black text-slate-900 leading-tight">10</p>
                        <p className="text-[10px] font-bold text-slate-400 -mt-0.5">/ 15</p>
                      </div>
                    </div>
                    <p className="text-xs font-bold text-slate-900 mt-2">Annual</p>
                    <p className="text-[11px] font-semibold text-emerald-600 mt-0.5">67% used</p>
                  </div>

                  {/* 2. Sick Leave Ring */}
                  <div className="flex flex-col items-center">
                    <div className="relative w-18 h-18 sm:w-20 sm:h-20 flex items-center justify-center shrink-0">
                      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 80 80">
                        <circle cx="40" cy="40" r="32" stroke="#f1f5f9" strokeWidth="6.5" fill="none" />
                        <circle
                          cx="40"
                          cy="40"
                          r="32"
                          stroke="#3b82f6"
                          strokeWidth="6.5"
                          strokeDasharray="201.06"
                          strokeDashoffset="16.75"
                          strokeLinecap="round"
                          fill="none"
                          className="transition-all duration-700 ease-out"
                        />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-center select-none pointer-events-none">
                        <p className="text-base sm:text-lg font-black text-slate-900 leading-tight">11</p>
                        <p className="text-[10px] font-bold text-slate-400 -mt-0.5">/ 12</p>
                      </div>
                    </div>
                    <p className="text-xs font-bold text-slate-900 mt-2">Sick</p>
                    <p className="text-[11px] font-semibold text-blue-600 mt-0.5">92% used</p>
                  </div>

                  {/* 3. Casual Leave Ring */}
                  <div className="flex flex-col items-center">
                    <div className="relative w-18 h-18 sm:w-20 sm:h-20 flex items-center justify-center shrink-0">
                      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 80 80">
                        <circle cx="40" cy="40" r="32" stroke="#f1f5f9" strokeWidth="6.5" fill="none" />
                        <circle
                          cx="40"
                          cy="40"
                          r="32"
                          stroke="#f97316"
                          strokeWidth="6.5"
                          strokeDasharray="201.06"
                          strokeDashoffset="40.21"
                          strokeLinecap="round"
                          fill="none"
                          className="transition-all duration-700 ease-out"
                        />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-center select-none pointer-events-none">
                        <p className="text-base sm:text-lg font-black text-slate-900 leading-tight">8</p>
                        <p className="text-[10px] font-bold text-slate-400 -mt-0.5">/ 10</p>
                      </div>
                    </div>
                    <p className="text-xs font-bold text-slate-900 mt-2">Casual</p>
                    <p className="text-[11px] font-semibold text-orange-600 mt-0.5">80% used</p>
                  </div>
                </div>

                {/* Right: Total Summary (sm:col-span-4) */}
                <div className="sm:col-span-4 flex flex-col items-center justify-center text-center sm:border-l sm:border-slate-100 sm:pl-3 py-1">
                  <Calendar className="w-6 h-6 text-[#7c69af]" />
                  <p className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-tight mt-1">
                    29
                  </p>
                  <p className="text-[11px] sm:text-xs font-bold text-slate-600 mt-0.5">
                    Days Available
                  </p>
                  <span className="text-[10.5px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200/80 mt-2 inline-block">
                    Active &amp; Accruing
                  </span>
                </div>
              </div>

              {/* Action Link Footer */}
              <div className="pt-2.5 border-t border-slate-100">
                <Link
                  href="/hr-dashboard/leave-tracker?view=my"
                  className="flex items-center justify-between text-xs font-bold text-[#7c69af] hover:text-[#6c589e] bg-[#7c69af]/5 hover:bg-[#7c69af]/10 px-3.5 py-2.5 rounded-2xl border border-[#7c69af]/15 transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-[#7c69af]" />
                    View Detailed Leave History
                  </span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>

          {/* Personal 3-Column Bottom Section: Leaves, Holidays, Celebrations */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 items-stretch">
            {/* 1. Left Card: My Recent Leave Applications */}
            <div className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-[0_3px_12px_rgba(0,0,0,0.04),inset_0_1px_0_#ffffff] flex flex-col justify-between space-y-3.5">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                <div>
                  <h3 className="text-[15px] sm:text-base font-extrabold text-slate-900 uppercase tracking-wide">
                    My Activity
                  </h3>
                </div>
                <Link
                  href="/hr-dashboard/leave-tracker?view=my&action=apply"
                  className="text-xs font-bold text-white bg-[#7c69af] hover:bg-[#6c589e] px-3.5 py-1.5 rounded-full shadow-xs transition-colors shrink-0 flex items-center gap-1"
                >
                  + Apply Leave
                </Link>
              </div>

              {/* Rows List (5 items matching density) */}
              <div className="divide-y divide-slate-100 flex-1 flex flex-col justify-between">
                {/* 1. Casual Leave */}
                <div className="py-2 px-1 flex items-center justify-between gap-3 hover:bg-slate-50/50 rounded-xl transition-colors">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-full bg-emerald-500 text-white shadow-xs flex items-center justify-center shrink-0">
                      <PalmTreeIcon className="w-4 h-4 text-white" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs sm:text-[13px] font-bold text-slate-900 leading-tight truncate">Casual Leave</p>
                      <p className="text-[10.5px] text-slate-400 font-medium">1 Day · Aug 14</p>
                    </div>
                  </div>
                  <span className="text-[11px] font-bold text-white bg-emerald-500 px-3 py-0.5 rounded-full shadow-2xs shrink-0">
                    Approved
                  </span>
                </div>

                {/* 2. Sick Leave */}
                <div className="py-2 px-1 flex items-center justify-between gap-3 hover:bg-slate-50/50 rounded-xl transition-colors">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-full bg-blue-600 text-white shadow-xs flex items-center justify-center shrink-0">
                      <StethoscopeIcon className="w-4 h-4 text-white" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs sm:text-[13px] font-bold text-slate-900 leading-tight truncate">Sick Leave</p>
                      <p className="text-[10.5px] text-slate-400 font-medium">2 Days · Aug 02-03</p>
                    </div>
                  </div>
                  <span className="text-[11px] font-bold text-white bg-blue-600 px-3 py-0.5 rounded-full shadow-2xs shrink-0">
                    Pending
                  </span>
                </div>

                {/* 3. Annual Leave */}
                <div className="py-2 px-1 flex items-center justify-between gap-3 hover:bg-slate-50/50 rounded-xl transition-colors">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-full bg-rose-500 text-white shadow-xs flex items-center justify-center shrink-0">
                      <Briefcase className="w-4 h-4 text-white" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs sm:text-[13px] font-bold text-slate-900 leading-tight truncate">Annual Leave</p>
                      <p className="text-[10.5px] text-slate-400 font-medium">5 Days · Jul 10-14</p>
                    </div>
                  </div>
                  <span className="text-[11px] font-bold text-white bg-rose-500 px-3 py-0.5 rounded-full shadow-2xs shrink-0">
                    Rejected
                  </span>
                </div>

                {/* 4. Remote Work */}
                <div className="py-2 px-1 flex items-center justify-between gap-3 hover:bg-slate-50/50 rounded-xl transition-colors">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-full bg-emerald-500 text-white shadow-xs flex items-center justify-center shrink-0">
                      <Clock className="w-4 h-4 text-white" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs sm:text-[13px] font-bold text-slate-900 leading-tight truncate">Work From Home</p>
                      <p className="text-[10.5px] text-slate-400 font-medium">1 Day · Jun 28</p>
                    </div>
                  </div>
                  <span className="text-[11px] font-bold text-white bg-emerald-500 px-3 py-0.5 rounded-full shadow-2xs shrink-0">
                    Approved
                  </span>
                </div>

                {/* 5. Personal Leave */}
                <div className="py-2 px-1 flex items-center justify-between gap-3 hover:bg-slate-50/50 rounded-xl transition-colors">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-full bg-emerald-500 text-white shadow-xs flex items-center justify-center shrink-0">
                      <UserCheck className="w-4 h-4 text-white" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs sm:text-[13px] font-bold text-slate-900 leading-tight truncate">Personal Leave</p>
                      <p className="text-[10.5px] text-slate-400 font-medium">2 Days · May 14-15</p>
                    </div>
                  </div>
                  <span className="text-[11px] font-bold text-white bg-emerald-500 px-3 py-0.5 rounded-full shadow-2xs shrink-0">
                    Approved
                  </span>
                </div>
              </div>

              {/* Action Link Footer */}
              <div className="pt-2 flex justify-end border-t border-slate-100/80">
                <Link
                  href="/hr-dashboard/leave-tracker?view=my"
                  className="text-xs font-bold text-[#7c69af] hover:text-[#6c589e] flex items-center gap-1.5 transition-colors"
                >
                  <span>View All</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* 2. Center Card: Upcoming Company Holidays (Exact Match to User Mockup) */}
            <div className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-[0_3px_12px_rgba(0,0,0,0.04),inset_0_1px_0_#ffffff] flex flex-col justify-between space-y-3.5">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                <div>
                  <h3 className="text-[15px] sm:text-base font-extrabold text-slate-900 uppercase tracking-wide">
                    Holidays
                  </h3>
                </div>
                {/* 1st Image/Icon replacing 2026 Calendar */}
                <div className="shrink-0 -my-2 sm:-my-2.5">
                  <HolidayCalendarIllustration className="w-20 h-13 sm:w-24 sm:h-15 drop-shadow-xs" />
                </div>
              </div>

              {/* Main Body: Left Panel (Enlarged Centered Palm Illustration) + Right Panel (5 Holidays) */}
              <div className="flex items-stretch gap-3.5 sm:gap-4 flex-1">
                {/* Left Panel: Light blue/gray background with Title & Centered Palm Calendar Illustration */}
                <div className="w-28 sm:w-32 shrink-0 bg-[#f0f6fa] rounded-2xl p-2.5 sm:p-3 flex flex-col justify-between items-center text-center border border-slate-100/90">
                  {/* Top: Title */}
                  <div className="pt-1">
                    <h4 className="text-xs sm:text-[13px] font-black text-slate-900 leading-tight">
                      Upcoming<br />Holidays
                    </h4>
                    <p className="text-[10px] text-slate-400 font-semibold mt-0.5">2026 Schedule</p>
                  </div>

                  {/* 2nd Image: Centered and a little bigger */}
                  <div className="flex-1 flex items-center justify-center py-2 w-full">
                    <HolidayPalmCalendarIllustration className="w-26 h-26 sm:w-28 sm:h-28 drop-shadow-xs" />
                  </div>
                </div>

                {/* Right Panel: 5 Company Holidays */}
                <div className="flex-1 flex flex-col justify-between min-w-0 space-y-2">
                  {/* Holiday 1: Nov 26 */}
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-rose-50 border border-rose-100/80 flex flex-col items-center justify-center shrink-0">
                      <span className="text-[8.5px] sm:text-[9px] font-black text-rose-500 uppercase tracking-wider leading-none">NOV</span>
                      <span className="text-xs sm:text-sm font-black text-rose-600 leading-tight">26</span>
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-slate-900 text-xs sm:text-[12.5px] leading-tight truncate">Thanksgiving Day</p>
                      <p className="text-[10px] text-slate-400 font-medium truncate">Mandatory Paid</p>
                    </div>
                  </div>

                  {/* Holiday 2: Nov 27 */}
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-orange-50 border border-orange-100/80 flex flex-col items-center justify-center shrink-0">
                      <span className="text-[8.5px] sm:text-[9px] font-black text-orange-500 uppercase tracking-wider leading-none">NOV</span>
                      <span className="text-xs sm:text-sm font-black text-orange-600 leading-tight">27</span>
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-slate-900 text-xs sm:text-[12.5px] leading-tight truncate">Day After Thanksgiving</p>
                      <p className="text-[10px] text-slate-400 font-medium truncate">Observed Holiday</p>
                    </div>
                  </div>

                  {/* Holiday 3: Dec 25 */}
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-amber-50 border border-amber-100/80 flex flex-col items-center justify-center shrink-0">
                      <span className="text-[8.5px] sm:text-[9px] font-black text-amber-600 uppercase tracking-wider leading-none">DEC</span>
                      <span className="text-xs sm:text-sm font-black text-amber-600 leading-tight">25</span>
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-slate-900 text-xs sm:text-[12.5px] leading-tight truncate">Christmas Day Holiday</p>
                      <p className="text-[10px] text-slate-400 font-medium truncate">Winter Recess</p>
                    </div>
                  </div>

                  {/* Holiday 4: Dec 31 */}
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-emerald-50 border border-emerald-100/80 flex flex-col items-center justify-center shrink-0">
                      <span className="text-[8.5px] sm:text-[9px] font-black text-emerald-600 uppercase tracking-wider leading-none">DEC</span>
                      <span className="text-xs sm:text-sm font-black text-emerald-600 leading-tight">31</span>
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-slate-900 text-xs sm:text-[12.5px] leading-tight truncate">New Year's Eve</p>
                      <p className="text-[10px] text-slate-400 font-medium truncate">Half-Day Recess</p>
                    </div>
                  </div>

                  {/* Holiday 5: Jan 01 */}
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-blue-50 border border-blue-100/80 flex flex-col items-center justify-center shrink-0">
                      <span className="text-[8.5px] sm:text-[9px] font-black text-blue-600 uppercase tracking-wider leading-none">JAN</span>
                      <span className="text-xs sm:text-sm font-black text-blue-600 leading-tight">01</span>
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-slate-900 text-xs sm:text-[12.5px] leading-tight truncate">New Year's Day 2027</p>
                      <p className="text-[10px] text-slate-400 font-medium truncate">Federal Holiday</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Link Footer */}
              <div className="pt-2 flex justify-end border-t border-slate-100/80">
                <Link
                  href="/hr-dashboard/leave-tracker?view=my"
                  className="text-xs font-bold text-[#2563eb] hover:text-blue-700 flex items-center gap-1.5 transition-colors"
                >
                  <span>View All Holidays</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* 3. Right Card: Upcoming Celebrations */}
            <div className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-[0_3px_12px_rgba(0,0,0,0.04),inset_0_1px_0_#ffffff] flex flex-col justify-between space-y-3.5">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                <div>
                  <h3 className="text-[15px] sm:text-base font-extrabold text-slate-900 uppercase tracking-wide">
                    Upcoming Celebrations
                  </h3>
                </div>
                <span className="text-xs font-bold text-white bg-amber-500 px-3.5 py-1 rounded-full shadow-2xs shrink-0">
                  This Week
                </span>
              </div>

              {/* Celebrations List (5 items matching density) */}
              <div className="divide-y divide-slate-100 flex-1 flex flex-col justify-between">
                {/* 1. Sarah Jenkins */}
                <div className="py-2 px-1 flex items-center justify-between gap-3 hover:bg-slate-50/50 rounded-xl transition-colors">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-full bg-pink-500 text-white shadow-xs flex items-center justify-center shrink-0">
                      <Gift className="w-4 h-4 text-white" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs sm:text-[13px] font-bold text-slate-900 leading-tight truncate">Sarah Jenkins</p>
                      <p className="text-[10.5px] text-slate-400 font-medium">🎂 Birthday · Tomorrow, Sep 11</p>
                    </div>
                  </div>
                  <span className="font-sans font-bold text-pink-600 bg-pink-50 border border-pink-200/80 px-2.5 py-0.5 rounded-xl text-[11px] shrink-0">
                    Tomorrow
                  </span>
                </div>

                {/* 2. Michael Chang */}
                <div className="py-2 px-1 flex items-center justify-between gap-3 hover:bg-slate-50/50 rounded-xl transition-colors">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-full bg-amber-500 text-white shadow-xs flex items-center justify-center shrink-0">
                      <Award className="w-4 h-4 text-white" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs sm:text-[13px] font-bold text-slate-900 leading-tight truncate">Michael Chang</p>
                      <p className="text-[10.5px] text-slate-400 font-medium">🎖️ 3rd Anniversary · Sep 12</p>
                    </div>
                  </div>
                  <span className="font-sans font-bold text-amber-700 bg-amber-50 border border-amber-200/80 px-2.5 py-0.5 rounded-xl text-[11px] shrink-0">
                    3 Years
                  </span>
                </div>

                {/* 3. Priya Patel */}
                <div className="py-2 px-1 flex items-center justify-between gap-3 hover:bg-slate-50/50 rounded-xl transition-colors">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-full bg-violet-500 text-white shadow-xs flex items-center justify-center shrink-0">
                      <PartyPopper className="w-4 h-4 text-white" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs sm:text-[13px] font-bold text-slate-900 leading-tight truncate">Priya Patel</p>
                      <p className="text-[10.5px] text-slate-400 font-medium">🎉 Birthday · Sep 15</p>
                    </div>
                  </div>
                  <span className="font-sans font-bold text-violet-700 bg-violet-50 border border-violet-200/80 px-2.5 py-0.5 rounded-xl text-[11px] shrink-0">
                    In 5 Days
                  </span>
                </div>

                {/* 4. Alex Rivera */}
                <div className="py-2 px-1 flex items-center justify-between gap-3 hover:bg-slate-50/50 rounded-xl transition-colors">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-full bg-blue-600 text-white shadow-xs flex items-center justify-center shrink-0">
                      <Sparkles className="w-4 h-4 text-white" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs sm:text-[13px] font-bold text-slate-900 leading-tight truncate">Alex Rivera</p>
                      <p className="text-[10.5px] text-slate-400 font-medium">🌟 5th Anniversary · Sep 18</p>
                    </div>
                  </div>
                  <span className="font-sans font-bold text-blue-700 bg-blue-50 border border-blue-200/80 px-2.5 py-0.5 rounded-xl text-[11px] shrink-0">
                    5 Years
                  </span>
                </div>

                {/* 5. David Chen */}
                <div className="py-2 px-1 flex items-center justify-between gap-3 hover:bg-slate-50/50 rounded-xl transition-colors">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-full bg-pink-500 text-white shadow-xs flex items-center justify-center shrink-0">
                      <Gift className="w-4 h-4 text-white" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs sm:text-[13px] font-bold text-slate-900 leading-tight truncate">David Chen</p>
                      <p className="text-[10.5px] text-slate-400 font-medium">🎂 Birthday · Sep 22</p>
                    </div>
                  </div>
                  <span className="font-sans font-bold text-pink-600 bg-pink-50 border border-pink-200/80 px-2.5 py-0.5 rounded-xl text-[11px] shrink-0">
                    In 12 Days
                  </span>
                </div>
              </div>

              {/* Action Link Footer */}
              <div className="pt-2 flex justify-end border-t border-slate-100/80">
                <Link
                  href="/hr-dashboard/employees"
                  className="text-xs font-bold text-amber-600 hover:text-amber-700 flex items-center gap-1.5 transition-colors"
                >
                  <span>View All Celebrations</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

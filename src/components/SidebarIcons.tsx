import React from "react";

export interface IconProps {
  className?: string;
  size?: number;
}

export function HomeIcon({ className = "w-4 h-4", size }: IconProps) {
  return (
    <svg
      width={size || 18}
      height={size || 18}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <path d="M12 2.8c.6 0 1.2.25 1.6.7l6.8 6.5c.6.6.9 1.4.9 2.2V19c0 1.7-1.3 3-3 3h-2.5c-.8 0-1.5-.7-1.5-1.5v-4.5c0-.6-.4-1-1-1h-2.6c-.6 0-1 .4-1 1V20.5c0 .8-.7 1.5-1.5 1.5H5.7c-1.7 0-3-1.3-3-3v-6.8c0-.8.3-1.6.9-2.2l6.8-6.5c.4-.45 1-.7 1.6-.7z" />
    </svg>
  );
}

export function OnboardingIcon({ className = "w-4 h-4", size }: IconProps) {
  return (
    <svg
      width={size || 18}
      height={size || 18}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <rect x="4.5" y="4" width="15" height="17" rx="3.5" />
      <path d="M10 2.5h4" />
      <circle cx="12" cy="10" r="2.2" />
      <path d="M8.5 16.5c.5-1.8 1.9-2.5 3.5-2.5s3 .7 3.5 2.5" />
    </svg>
  );
}

export function LeaveTrackerIcon({ className = "w-4 h-4", size }: IconProps) {
  return (
    <svg
      width={size || 18}
      height={size || 18}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M12 3.5c-4.4 0-8 3-8 6.5h16c0-3.5-3.6-6.5-8-6.5z" />
      <path d="M12 3.5v14" />
      <path d="M12 3.5c-1.8 2-2.8 4.2-3 6.5M12 3.5c1.8 2 2.8 4.2 3 6.5" />
      <path d="M4 19c1.5 1 3.5 1 5 0s3.5-1 5 0 3.5 1 5 0" />
    </svg>
  );
}

export function AttendanceIcon({ className = "w-4 h-4", size }: IconProps) {
  return (
    <svg
      width={size || 18}
      height={size || 18}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <rect x="4" y="4.5" width="16" height="15.5" rx="3.5" />
      <path d="M8 2.5v3.5M16 2.5v3.5" />
      <path d="M4 9h16" />
      <path d="M8.5 14l2.5 2.5 5-5" />
    </svg>
  );
}

export function TimeTrackerIcon({ className = "w-4 h-4", size }: IconProps) {
  return (
    <svg
      width={size || 18}
      height={size || 18}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <circle cx="12" cy="13.5" r="7.5" />
      <path d="M12 3v3M9.5 3h5M18.5 7.5l-1.5 1.5" />
      <path d="M10.8 11.5l3.6 2-3.6 2z" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function MoreIcon({ className = "w-4 h-4", size }: IconProps) {
  return (
    <svg
      width={size || 18}
      height={size || 18}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <circle cx="6.5" cy="12" r="1.6" />
      <circle cx="12" cy="12" r="1.6" />
      <circle cx="17.5" cy="12" r="1.6" />
    </svg>
  );
}

export function OperationsIcon({ className = "w-4 h-4", size }: IconProps) {
  return (
    <svg
      width={size || 18}
      height={size || 18}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M7 6L4 9l3 3" />
      <path d="M4 9h9.5a4.5 4.5 0 0 1 4.5 4.5v.5" />
      <path d="M17 18l3-3-3-3" />
      <path d="M20 15h-9.5a4.5 4.5 0 0 1-4.5-4.5v-.5" />
    </svg>
  );
}

export function ReportsIcon({ className = "w-4 h-4", size }: IconProps) {
  return (
    <svg
      width={size || 18}
      height={size || 18}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M12 12V4a8 8 0 1 1-8 8h8z" />
      <path d="M14.5 10.5h6.5A7.8 7.8 0 0 0 14.5 3.5v7z" />
    </svg>
  );
}

export function TrophyIcon({ className = "w-4 h-4", size }: IconProps) {
  return (
    <svg
      width={size || 18}
      height={size || 18}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M6 9H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h2" />
      <path d="M18 9h2a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2h-2" />
      <path d="M6 3h12v7a6 6 0 0 1-12 0V3z" />
      <path d="M12 16v4" />
      <path d="M8 20h8" />
    </svg>
  );
}

export function FolderIcon({ className = "w-4 h-4", size }: IconProps) {
  return (
    <svg
      width={size || 18}
      height={size || 18}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
      <line x1="9" y1="14" x2="15" y2="14" />
    </svg>
  );
}

export function EngagementIcon({ className = "w-4 h-4", size }: IconProps) {
  return (
    <svg
      width={size || 18}
      height={size || 18}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <circle cx="12" cy="12" r="3" />
      <circle cx="19" cy="6" r="2" />
      <circle cx="5" cy="6" r="2" />
      <circle cx="19" cy="18" r="2" />
      <circle cx="5" cy="18" r="2" />
      <path d="M14.5 10.5L17.5 7.5M9.5 10.5L6.5 7.5M14.5 13.5L17.5 16.5M9.5 13.5L6.5 16.5" />
    </svg>
  );
}

export function StarIcon({ className = "w-4 h-4", size }: IconProps) {
  return (
    <svg
      width={size || 18}
      height={size || 18}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}

export function TasksIcon({ className = "w-4 h-4", size }: IconProps) {
  return (
    <svg
      width={size || 18}
      height={size || 18}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <rect x="5" y="4" width="14" height="17" rx="3" />
      <path d="M9 3h6a1 1 0 0 1 1 1v1H8V4a1 1 0 0 1 1-1z" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  );
}

export function CompensationIcon({ className = "w-4 h-4", size }: IconProps) {
  return (
    <svg
      width={size || 18}
      height={size || 18}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <rect x="2" y="6" width="20" height="12" rx="2" />
      <circle cx="12" cy="12" r="2.5" />
      <path d="M6 12h.01M18 12h.01" />
    </svg>
  );
}

export function BuildingIcon({ className = "w-4 h-4", size }: IconProps) {
  return (
    <svg
      width={size || 18}
      height={size || 18}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <rect x="4" y="3" width="16" height="18" rx="2" />
      <path d="M9 7h1M14 7h1M9 11h1M14 11h1M9 15h1M14 15h1M10 21v-3h4v3" />
    </svg>
  );
}

export function GearIcon({ className = "w-4 h-4", size }: IconProps) {
  return (
    <svg
      width={size || 18}
      height={size || 18}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  );
}

export function SearchIcon({ className = "w-4 h-4", size }: IconProps) {
  return (
    <svg
      width={size || 18}
      height={size || 18}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

export function BellIcon({ className = "w-4 h-4", size }: IconProps) {
  return (
    <svg
      width={size || 18}
      height={size || 18}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  );
}

export function PlusIcon({ className = "w-4 h-4", size }: IconProps) {
  return (
    <svg
      width={size || 18}
      height={size || 18}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}

export function UserAvatarIcon({ className = "w-8 h-8", size }: IconProps) {
  return (
    <svg
      width={size || 32}
      height={size || 32}
      viewBox="0 0 32 32"
      fill="none"
      className={className}
    >
      <circle cx="16" cy="16" r="16" fill="#E2E8F0" />
      <circle cx="16" cy="12" r="4.5" fill="#94A3B8" />
      <path
        d="M8.5 25c1.8-3.5 4.5-5 7.5-5s5.7 1.5 7.5 5A15.8 15.8 0 0 1 16 31.8c-2.8 0-5.4-.7-7.5-6.8z"
        fill="#94A3B8"
      />
    </svg>
  );
}

export function CloseIcon({ className = "w-4 h-4", size }: IconProps) {
  return (
    <svg
      width={size || 16}
      height={size || 16}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

export function LogoutIcon({ className = "w-4 h-4", size }: IconProps) {
  return (
    <svg
      width={size || 16}
      height={size || 16}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  );
}


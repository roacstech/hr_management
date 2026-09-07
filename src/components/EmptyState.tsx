import React from "react";

export interface EmptyStateProps {
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export function NoDataIllustration({ className = "w-52 h-44" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 260 210"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Background Soft Glow Circle & Accent Dots */}
      <circle cx="130" cy="105" r="72" fill="#EEF2FA" />
      <circle cx="195" cy="48" r="6.5" fill="#F1F5F9" />
      <circle cx="82" cy="148" r="6" fill="#F1F5F9" />
      <circle cx="65" cy="80" r="3" fill="#E2E8F0" />
      <circle cx="205" cy="125" r="3" fill="#E2E8F0" />

      {/* BACK CARD: Bar Chart Window */}
      <g filter="drop-shadow(0 2px 4px rgba(0,0,0,0.02))">
        {/* Card Body */}
        <rect
          x="55"
          y="50"
          width="100"
          height="115"
          rx="10"
          fill="#FFFFFF"
          stroke="#E2E8F0"
          strokeWidth="1.5"
        />
        {/* Card Header Bar */}
        <path
          d="M55 60C55 54.4772 59.4772 50 65 50H145C150.523 50 155 54.4772 155 60V68H55V60Z"
          fill="#CBD5E1"
          fillOpacity="0.6"
        />
        {/* Header Control Dots */}
        <circle cx="67" cy="59" r="2.5" fill="#94A3B8" />
        <circle cx="75" cy="59" r="2.5" fill="#94A3B8" />
        <circle cx="83" cy="59" r="2.5" fill="#94A3B8" />

        {/* Bar Chart Columns */}
        <rect x="68" y="96" width="12" height="50" rx="3" fill="#E2E8F0" />
        <rect x="85" y="80" width="12" height="66" rx="3" fill="#CBD5E1" fillOpacity="0.8" />
        <rect x="102" y="112" width="12" height="34" rx="3" fill="#E2E8F0" />
        <rect x="119" y="88" width="12" height="58" rx="3" fill="#CBD5E1" fillOpacity="0.6" />
      </g>

      {/* FRONT CARD: Donut Chart Window */}
      <g filter="drop-shadow(0 6px 12px rgba(15,23,42,0.06))">
        {/* Card Body */}
        <rect
          x="108"
          y="72"
          width="105"
          height="122"
          rx="10"
          fill="#FFFFFF"
          stroke="#E2E8F0"
          strokeWidth="1.5"
        />
        {/* Card Header Bar */}
        <path
          d="M108 82C108 76.4772 112.477 72 118 72H203C208.523 72 213 76.4772 213 82V90H108V82Z"
          fill="#CBD5E1"
          fillOpacity="0.75"
        />
        {/* Header Control Dots */}
        <circle cx="120" cy="81" r="2.5" fill="#94A3B8" />
        <circle cx="128" cy="81" r="2.5" fill="#94A3B8" />
        <circle cx="136" cy="81" r="2.5" fill="#94A3B8" />

        {/* Donut Chart Graphics */}
        {/* Donut Base Ring */}
        <circle cx="160.5" cy="126" r="26" stroke="#F1F5F9" strokeWidth="10" fill="none" />
        {/* Main Accent Sector (Dark Slate / Lavender) */}
        <circle
          cx="160.5"
          cy="126"
          r="26"
          stroke="#94A3B8"
          strokeWidth="10"
          strokeDasharray="45 120"
          strokeDashoffset="10"
          fill="none"
          strokeLinecap="round"
        />
        {/* Secondary Sector */}
        <circle
          cx="160.5"
          cy="126"
          r="26"
          stroke="#CBD5E1"
          strokeWidth="10"
          strokeDasharray="60 100"
          strokeDashoffset="75"
          fill="none"
        />

        {/* Bottom Text Skeleton Placeholder Lines */}
        <rect x="123" y="166" width="68" height="4.5" rx="2.25" fill="#CBD5E1" fillOpacity="0.8" />
        <rect x="123" y="176" width="45" height="4.5" rx="2.25" fill="#CBD5E1" fillOpacity="0.5" />
      </g>
    </svg>
  );
}

export default function EmptyState({
  title = "No data available",
  description = "We don't have enough data to show any graphs",
  actionLabel,
  onAction,
  className = "",
}: EmptyStateProps) {
  return (
    <div
      className={`bg-white rounded-2xl p-8 border border-gray-100/90 shadow-xs flex flex-col items-center justify-center text-center space-y-3.5 ${className}`}
    >
      <NoDataIllustration className="w-56 h-48" />
      <div className="space-y-1 max-w-sm">
        <h3 className="text-lg font-semibold text-[#475569] tracking-tight">
          {title}
        </h3>
        <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
          {description}
        </p>
      </div>

      {actionLabel && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="mt-2 inline-flex items-center px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-md shadow-sm transition active:scale-95 cursor-pointer"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}

import React from "react";

export function NotificationEmptyIllustration({ className = "w-44 h-44" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 260 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Soft background glow circles */}
      <circle cx="130" cy="110" r="75" fill="#EBF2FC" />
      <circle cx="130" cy="110" r="55" fill="#DFEBFB" />

      {/* Floating Sparkles / Confetti */}
      <circle cx="68" cy="72" r="2.5" stroke="#93C5FD" strokeWidth="1.5" fill="none" />
      <circle cx="195" cy="85" r="2" fill="#93C5FD" />
      <path d="M60 95L64 95M62 93L62 97" stroke="#93C5FD" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M190 60L194 60M192 58L192 62" stroke="#93C5FD" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M185 130 Q192 120 198 135" stroke="#93C5FD" strokeWidth="1.5" fill="none" strokeLinecap="round" />

      {/* Delivery Parcel Box */}
      <path d="M125 110L165 95L185 105L145 120Z" fill="#3B82F6" />
      <path d="M145 120L185 105V135L145 150Z" fill="#2563EB" />
      <path d="M125 110L145 120V150L125 140Z" fill="#1D4ED8" />
      <path d="M145 95L165 85L178 92L158 102Z" fill="#60A5FA" />
      
      {/* Box Open Flaps */}
      <path d="M165 95L182 82L192 90L175 103Z" fill="#93C5FD" />
      <path d="M125 110L112 100L125 92L138 102Z" fill="#93C5FD" />

      {/* Character Base Ground Shadow */}
      <ellipse cx="120" cy="155" rx="55" ry="6" fill="#DBEAFE" />

      {/* Character Wings */}
      <ellipse cx="90" cy="98" rx="14" ry="20" transform="rotate(-25 90 98)" fill="#BFDBFE" fillOpacity="0.8" />
      <ellipse cx="85" cy="105" rx="11" ry="16" transform="rotate(-35 85 105)" fill="#93C5FD" fillOpacity="0.7" />

      {/* Character Body - Striped Blue Bee/Robot */}
      <path
        d="M100 102C100 88 111 76 125 76C139 76 150 88 150 102V125C150 138 139 146 125 146C111 146 100 138 100 125V102Z"
        fill="#FFFFFF"
        stroke="#2563EB"
        strokeWidth="2"
      />
      {/* Blue Stripes */}
      <path d="M102 108C108 112 142 112 148 108" stroke="#2563EB" strokeWidth="6" strokeLinecap="round" />
      <path d="M104 122C110 126 140 126 146 122" stroke="#2563EB" strokeWidth="6" strokeLinecap="round" />
      <path d="M108 135C114 138 136 138 142 135" stroke="#2563EB" strokeWidth="5" strokeLinecap="round" />

      {/* Character Head */}
      <circle cx="125" cy="74" r="23" fill="#FFFFFF" stroke="#2563EB" strokeWidth="2" />

      {/* Blue Hat / Helmet Band */}
      <path d="M110 56C118 52 134 52 142 56L145 64C137 60 115 60 107 64Z" fill="#93C5FD" />

      {/* Antenna & Glowing Red Tip */}
      <path d="M125 51V41" stroke="#2563EB" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="125" cy="38" r="4.5" fill="#EF4444" />
      <circle cx="125" cy="38" r="7.5" fill="#F87171" fillOpacity="0.3" />

      {/* Eye & Pupil */}
      <circle cx="137" cy="73" r="8" fill="#FFFFFF" stroke="#2563EB" strokeWidth="2" />
      <circle cx="139" cy="73" r="5" fill="#1E40AF" />
      <circle cx="141" cy="71" r="2" fill="#FFFFFF" />

      {/* Blush Cheek & Cute Mouth */}
      <circle cx="144" cy="81" r="2.5" fill="#FCA5A5" />
      <path d="M136 84Q140 87 144 84" stroke="#2563EB" strokeWidth="1.5" strokeLinecap="round" fill="none" />

      {/* Arms Holding the Box */}
      <path d="M122 108Q135 106 148 102" stroke="#2563EB" strokeWidth="3" strokeLinecap="round" />
      <circle cx="150" cy="102" r="3.5" fill="#FFFFFF" stroke="#2563EB" strokeWidth="2" />
      
      <path d="M115 110Q126 116 138 114" stroke="#2563EB" strokeWidth="3" strokeLinecap="round" />
      <circle cx="140" cy="114" r="3.5" fill="#FFFFFF" stroke="#2563EB" strokeWidth="2" />

      {/* Little Feet */}
      <ellipse cx="118" cy="151" rx="5" ry="3.5" fill="#93C5FD" stroke="#2563EB" strokeWidth="1.5" />
      <ellipse cx="132" cy="151" rx="5" ry="3.5" fill="#93C5FD" stroke="#2563EB" strokeWidth="1.5" />
    </svg>
  );
}

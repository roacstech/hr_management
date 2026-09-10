"use client";

import React, { useState, useEffect } from "react";
import { useTenant } from "@/context/TenantContext";

export default function AttendanceWidget() {
  const { teamLeadProfile } = useTenant();
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isCheckedIn) {
      interval = setInterval(() => {
        setElapsedTime((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isCheckedIn]);

  const handleCheckInOut = () => {
    if (isCheckedIn) {
      // Check out logic
      setIsCheckedIn(false);
    } else {
      // Check in logic
      setIsCheckedIn(true);
    }
  };

  const formatTime = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return {
      hours: hours.toString().padStart(2, "0"),
      minutes: minutes.toString().padStart(2, "0"),
      seconds: seconds.toString().padStart(2, "0"),
    };
  };

  const time = formatTime(elapsedTime);

  return (
    <div className="bg-white rounded-xl shadow-xl border border-gray-100 p-6 flex flex-col items-center w-64 relative pt-12">
      {/* Avatar sticking out */}
      <div className="absolute -top-8 left-1/2 -translate-x-1/2 w-16 h-16 bg-gray-200 rounded-2xl shadow-md flex items-center justify-center overflow-hidden border-4 border-white">
        {teamLeadProfile?.profileImageUrl ? (
          <img
            src={teamLeadProfile.profileImageUrl}
            alt={teamLeadProfile?.name || "TL"}
            className="w-full h-full object-cover"
          />
        ) : (
          <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        )}
      </div>

      {/* Name */}
      <h3 className="text-sm font-medium text-gray-800 text-center mb-2">
        1 - {teamLeadProfile?.name || "malarkannanmadhavan"}
      </h3>

      {/* Status */}
      <p
        className={`text-sm mb-4 ${
          isCheckedIn ? "text-emerald-500" : "text-rose-500"
        }`}
      >
        {isCheckedIn ? "Checked-in" : "Yet to check-in"}
      </p>

      {/* Timer */}
      <div className="flex items-center space-x-1.5 mb-5 text-lg font-medium text-gray-800">
        <div className="bg-gray-100 px-2 py-1 rounded-md min-w-[36px] text-center">
          {time.hours}
        </div>
        <span>:</span>
        <div className="bg-gray-100 px-2 py-1 rounded-md min-w-[36px] text-center">
          {time.minutes}
        </div>
        <span>:</span>
        <div className="bg-gray-100 px-2 py-1 rounded-md min-w-[36px] text-center">
          {time.seconds}
        </div>
      </div>

      {/* Action Button */}
      <button
        onClick={handleCheckInOut}
        className={`w-32 py-1.5 rounded-md border bg-white font-medium transition cursor-pointer ${
          isCheckedIn
            ? "border-rose-500 text-rose-500 hover:bg-rose-50"
            : "border-emerald-500 text-emerald-500 hover:bg-emerald-50"
        }`}
      >
        {isCheckedIn ? "Check-out" : "Check-in"}
      </button>
    </div>
  );
}

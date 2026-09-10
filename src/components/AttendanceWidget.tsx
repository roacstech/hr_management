"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useTenant } from "@/context/TenantContext";

export default function AttendanceWidget() {
  const { teamLeadProfile } = useTenant();
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [isCompletedToday, setIsCompletedToday] = useState(false);
  const [checkInTime, setCheckInTime] = useState<string | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [dbUserName, setDbUserName] = useState<string | null>(null);

  // Fetch live attendance state from MySQL database
  const fetchAttendanceStatus = useCallback(async () => {
    try {
      const res = await fetch("/api/team-lead/attendance");
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setIsCheckedIn(data.isCheckedIn);
          setIsCompletedToday(Boolean(data.isCompletedToday));
          setCheckInTime(data.checkInTime);
          if (data.user?.name) {
            setDbUserName(data.user.name);
          }

          if (data.isCheckedIn && data.checkInTime) {
            const startMs = new Date(data.checkInTime).getTime();
            const elapsed = Math.max(0, Math.floor((Date.now() - startMs) / 1000));
            setElapsedTime(elapsed);
          } else if (data.isCompletedToday && data.workHours) {
            // Checked out for the day: display total worked hours
            setElapsedTime(Math.round(data.workHours * 3600));
          } else {
            setElapsedTime(0);
          }
        }
      }
    } catch (err) {
      console.error("Failed to load attendance:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAttendanceStatus();
  }, [fetchAttendanceStatus]);

  // Real-time ticking synchronized with exact database checkInTime
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isCheckedIn && checkInTime) {
      const startMs = new Date(checkInTime).getTime();
      // Tick immediately
      setElapsedTime(Math.max(0, Math.floor((Date.now() - startMs) / 1000)));

      interval = setInterval(() => {
        setElapsedTime(Math.max(0, Math.floor((Date.now() - startMs) / 1000)));
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isCheckedIn, checkInTime]);

  const handleCheckInOut = async () => {
    if (isActionLoading) return;
    try {
      setIsActionLoading(true);
      const action = isCheckedIn ? "check-out" : "check-in";

      const res = await fetch("/api/team-lead/attendance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setIsCheckedIn(data.isCheckedIn);
        setCheckInTime(data.checkInTime || null);

        if (data.isCheckedIn && data.checkInTime) {
          const startMs = new Date(data.checkInTime).getTime();
          setElapsedTime(Math.max(0, Math.floor((Date.now() - startMs) / 1000)));
          setIsCompletedToday(false);
        } else if (data.workHours) {
          setElapsedTime(Math.round(data.workHours * 3600));
          setIsCompletedToday(true);
        } else {
          setElapsedTime(0);
        }

        // Notify other components (like Attendance History page)
        if (typeof window !== "undefined") {
          window.dispatchEvent(
            new CustomEvent("attendance-updated", { detail: data })
          );
        }
      } else {
        alert(data.error || "Failed to update attendance in database.");
      }
    } catch (err) {
      console.error("Error updating attendance:", err);
      alert("Network error updating attendance.");
    } finally {
      setIsActionLoading(false);
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
  const displayName = dbUserName || teamLeadProfile?.name || "Sarah Chen";

  return (
    <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 p-6 flex flex-col items-center w-64 relative pt-12 select-none">
      {/* Avatar sticking out */}
      <div className="absolute -top-8 left-1/2 -translate-x-1/2 w-16 h-16 bg-white rounded-2xl shadow-md flex items-center justify-center overflow-hidden border-4 border-white">
        {teamLeadProfile?.profileImageUrl ? (
          <img
            src={teamLeadProfile.profileImageUrl}
            alt={displayName}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-blue-50/80 flex items-center justify-center">
            {/* Cute robot avatar matching design */}
            <svg
              className="w-10 h-10 text-blue-600"
              viewBox="0 0 32 32"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect x="5" y="11" width="22" height="17" rx="5" fill="#E0EDFF" stroke="#2563EB" strokeWidth="2" />
              <circle cx="16" cy="5" r="2.5" fill="#2563EB" />
              <path d="M16 7.5V11" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" />
              <circle cx="11.5" cy="17.5" r="2" fill="#1D4ED8" />
              <circle cx="20.5" cy="17.5" r="2" fill="#1D4ED8" />
              <path d="M12.5 22.5C13.5 23.5 15 24 16 24C17 24 18.5 23.5 19.5 22.5" stroke="#1D4ED8" strokeWidth="2" strokeLinecap="round" />
              <rect x="2" y="16" width="3" height="7" rx="1.5" fill="#2563EB" />
              <rect x="27" y="16" width="3" height="7" rx="1.5" fill="#2563EB" />
            </svg>
          </div>
        )}
      </div>

      {/* Name */}
      <h3 className="text-sm font-semibold text-gray-800 text-center mb-1">
        1 - {displayName}
      </h3>

      {/* Status */}
      <p
        className={`text-xs font-medium mb-4 transition-colors ${
          isLoading
            ? "text-gray-400"
            : isCheckedIn
            ? "text-emerald-600 font-semibold"
            : isCompletedToday
            ? "text-blue-600 font-semibold"
            : "text-rose-500"
        }`}
      >
        {isLoading
          ? "Syncing status..."
          : isCheckedIn
          ? "Checked-in"
          : isCompletedToday
          ? "Checked-out (Completed)"
          : "Yet to check-in"}
      </p>

      {/* Timer */}
      <div className="flex items-center space-x-1.5 mb-5 text-lg font-bold text-gray-800 font-mono">
        <div className="bg-gray-100 px-2 py-1 rounded-md min-w-[38px] text-center border border-gray-200/60">
          {time.hours}
        </div>
        <span className="text-gray-400">:</span>
        <div className="bg-gray-100 px-2 py-1 rounded-md min-w-[38px] text-center border border-gray-200/60">
          {time.minutes}
        </div>
        <span className="text-gray-400">:</span>
        <div className="bg-gray-100 px-2 py-1 rounded-md min-w-[38px] text-center border border-gray-200/60">
          {time.seconds}
        </div>
      </div>

      {/* Action Button */}
      <button
        type="button"
        disabled={isLoading || isActionLoading}
        onClick={handleCheckInOut}
        className={`w-32 py-1.5 rounded-lg border text-sm font-semibold transition flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
          isCheckedIn
            ? "border-rose-500 text-rose-500 hover:bg-rose-50 active:bg-rose-100"
            : "border-emerald-600 text-emerald-600 hover:bg-emerald-50 active:bg-emerald-100"
        }`}
      >
        {isActionLoading ? (
          <>
            <svg
              className="animate-spin -ml-1 mr-1 h-3.5 w-3.5 text-current"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Saving...
          </>
        ) : isCheckedIn ? (
          "Check-out"
        ) : (
          "Check-in"
        )}
      </button>
    </div>
  );
}

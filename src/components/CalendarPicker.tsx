"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";

export interface CalendarPickerProps {
  id?: string;
  label?: string;
  value: string; // ISO string 'YYYY-MM-DD' or ''
  onChange: (date: string) => void;
  minDate?: string; // 'YYYY-MM-DD'
  maxDate?: string;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  className?: string;
  align?: "left" | "right" | "auto";
}

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const DAY_NAMES = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

export default function CalendarPicker({
  id,
  label,
  value,
  onChange,
  minDate,
  maxDate,
  placeholder = "Select date...",
  disabled = false,
  required = false,
  className = "",
  align = "auto",
}: CalendarPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const [autoAlign, setAutoAlign] = useState<"left" | "right">("left");

  useEffect(() => {
    if (align !== "auto") return;
    if (isOpen && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      if (window.innerWidth - rect.left < 310 || rect.right + 80 > window.innerWidth) {
        setAutoAlign("right");
      } else {
        setAutoAlign("left");
      }
    }
  }, [isOpen, align]);

  const effectiveAlign = align === "auto" ? autoAlign : align;

  // Parse current value or default to current month/year
  const selectedDate = useMemo(() => {
    if (!value) return null;
    const parts = value.split("-").map(Number);
    if (parts.length === 3) {
      return new Date(parts[0], parts[1] - 1, parts[2]);
    }
    return null;
  }, [value]);

  const [viewYear, setViewYear] = useState<number>(() => {
    return selectedDate ? selectedDate.getFullYear() : new Date().getFullYear();
  });

  const [viewMonth, setViewMonth] = useState<number>(() => {
    return selectedDate ? selectedDate.getMonth() : new Date().getMonth();
  });

  // When value changes from outside, update view year/month
  useEffect(() => {
    if (selectedDate) {
      setViewYear(selectedDate.getFullYear());
      setViewMonth(selectedDate.getMonth());
    }
  }, [value]);

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // ESC key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  // Navigation handlers
  const handlePrevMonth = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((prev) => prev - 1);
    } else {
      setViewMonth((prev) => prev - 1);
    }
  };

  const handleNextMonth = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((prev) => prev + 1);
    } else {
      setViewMonth((prev) => prev + 1);
    }
  };

  // Check if date is disabled
  const isDateDisabled = (year: number, month: number, day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    if (minDate && dateStr < minDate) return true;
    if (maxDate && dateStr > maxDate) return true;
    return false;
  };

  const handleSelectDate = (year: number, month: number, day: number) => {
    if (isDateDisabled(year, month, day)) return;
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    onChange(dateStr);
    setIsOpen(false);
  };

  const handleSelectToday = (e: React.MouseEvent) => {
    e.stopPropagation();
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();
    const day = today.getDate();
    if (!isDateDisabled(year, month, day)) {
      handleSelectDate(year, month, day);
    }
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange("");
    setIsOpen(false);
  };

  // Generate days matrix
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const firstDayIndex = new Date(viewYear, viewMonth, 1).getDay(); // 0 = Sun
  const daysInPrevMonth = new Date(viewYear, viewMonth, 0).getDate();

  const calendarDays = useMemo(() => {
    const days: Array<{
      day: number;
      month: number;
      year: number;
      isCurrentMonth: boolean;
      isSelected: boolean;
      isToday: boolean;
      isDisabled: boolean;
    }> = [];

    const today = new Date();
    const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

    // Prev month days
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      const day = daysInPrevMonth - i;
      const m = viewMonth === 0 ? 11 : viewMonth - 1;
      const y = viewMonth === 0 ? viewYear - 1 : viewYear;
      const dStr = `${y}-${String(m + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
      days.push({
        day,
        month: m,
        year: y,
        isCurrentMonth: false,
        isSelected: value === dStr,
        isToday: dStr === todayStr,
        isDisabled: isDateDisabled(y, m, day),
      });
    }

    // Current month days
    for (let day = 1; day <= daysInMonth; day++) {
      const dStr = `${viewYear}-${String(viewMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
      days.push({
        day,
        month: viewMonth,
        year: viewYear,
        isCurrentMonth: true,
        isSelected: value === dStr,
        isToday: dStr === todayStr,
        isDisabled: isDateDisabled(viewYear, viewMonth, day),
      });
    }

    // Next month days to fill 42 cells (6 rows)
    const remaining = 42 - days.length;
    for (let day = 1; day <= remaining; day++) {
      const m = viewMonth === 11 ? 0 : viewMonth + 1;
      const y = viewMonth === 11 ? viewYear + 1 : viewYear;
      const dStr = `${y}-${String(m + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
      days.push({
        day,
        month: m,
        year: y,
        isCurrentMonth: false,
        isSelected: value === dStr,
        isToday: dStr === todayStr,
        isDisabled: isDateDisabled(y, m, day),
      });
    }

    return days;
  }, [viewYear, viewMonth, daysInMonth, firstDayIndex, daysInPrevMonth, value, minDate, maxDate]);

  // Formatted date display text
  const displayText = useMemo(() => {
    if (!value) return "";
    try {
      const [y, m, d] = value.split("-").map(Number);
      const date = new Date(y, m - 1, d);
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return value;
    }
  }, [value]);

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      {label && (
        <label className="block text-xs font-bold text-gray-700 mb-1.5">
          {label} {required && <span className="text-rose-500">*</span>}
        </label>
      )}

      {/* Clickable Input Box - Clicking ANYWHERE opens calendar */}
      <div
        id={id}
        tabIndex={disabled ? -1 : 0}
        role="button"
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        onClick={() => {
          if (!disabled) setIsOpen((prev) => !prev);
        }}
        onKeyDown={(e) => {
          if ((e.key === "Enter" || e.key === " ") && !disabled) {
            e.preventDefault();
            setIsOpen((prev) => !prev);
          }
        }}
        className={`w-full p-2.5 bg-gray-50 border rounded-xl text-xs flex items-center justify-between select-none transition-all duration-150 cursor-pointer ${
          disabled
            ? "bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed"
            : isOpen
            ? "bg-white border-blue-500 ring-2 ring-blue-500/20 shadow-xs"
            : "border-gray-200 hover:border-blue-400 hover:bg-white text-gray-800"
        }`}
      >
        <div className="flex items-center gap-2 overflow-hidden">
          <svg
            className={`w-4 h-4 shrink-0 transition-colors ${
              value ? "text-blue-600" : "text-gray-400"
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <span className={`truncate font-medium ${value ? "text-gray-900 font-semibold" : "text-gray-400"}`}>
            {displayText || placeholder}
          </span>
        </div>

        <div className="flex items-center gap-1.5 shrink-0 ml-2">
          {value && !disabled && (
            <span
              onClick={handleClear}
              className="w-4 h-4 rounded-full hover:bg-gray-200 text-gray-400 hover:text-gray-600 flex items-center justify-center transition text-[10px]"
              title="Clear date"
            >
              ✕
            </span>
          )}
          <svg
            className={`w-3.5 h-3.5 text-gray-400 transition-transform duration-200 ${
              isOpen ? "rotate-180 text-blue-600" : ""
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {/* Hidden input for HTML form validation if required */}
      <input
        type="text"
        required={required}
        value={value}
        onChange={() => {}}
        tabIndex={-1}
        className="sr-only"
        aria-hidden="true"
      />

      {/* Custom Professional Calendar Popover */}
      {isOpen && (
        <div className={`absolute top-full ${effectiveAlign === "right" ? "right-0" : "left-0"} mt-1.5 z-[100] w-72 max-w-[calc(100vw-2.5rem)] bg-white rounded-2xl shadow-2xl border border-gray-200/90 p-4 animate-in fade-in zoom-in-95 duration-150 select-none`}>
          {/* Calendar Header with Month/Year Navigation */}
          <div className="flex items-center justify-between mb-3.5 pb-2.5 border-b border-gray-100">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-extrabold text-gray-900">
                {MONTH_NAMES[viewMonth]}
              </span>
              <span className="text-xs font-semibold text-gray-500">
                {viewYear}
              </span>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={handlePrevMonth}
                className="w-7 h-7 rounded-lg hover:bg-gray-100 active:bg-gray-200 text-gray-600 flex items-center justify-center transition cursor-pointer"
                title="Previous Month"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                type="button"
                onClick={handleNextMonth}
                className="w-7 h-7 rounded-lg hover:bg-gray-100 active:bg-gray-200 text-gray-600 flex items-center justify-center transition cursor-pointer"
                title="Next Month"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>

          {/* Days of week header */}
          <div className="grid grid-cols-7 gap-1 text-center mb-1.5">
            {DAY_NAMES.map((dayName, idx) => (
              <span
                key={dayName}
                className={`text-[11px] font-bold py-1 ${
                  idx === 0 || idx === 6 ? "text-gray-400" : "text-gray-500"
                }`}
              >
                {dayName}
              </span>
            ))}
          </div>

          {/* Calendar Days Grid */}
          <div className="grid grid-cols-7 gap-1 text-center">
            {calendarDays.map((item, index) => {
              let cellStyle = "text-gray-800 hover:bg-blue-50 hover:text-blue-700 cursor-pointer";

              if (item.isDisabled) {
                cellStyle = "text-gray-300 cursor-not-allowed bg-transparent";
              } else if (item.isSelected) {
                cellStyle = "bg-blue-600 text-white font-extrabold shadow-sm shadow-blue-500/30 hover:bg-blue-700 cursor-pointer";
              } else if (!item.isCurrentMonth) {
                cellStyle = "text-gray-300 hover:bg-gray-50 cursor-pointer";
              } else if (item.isToday) {
                cellStyle = "text-blue-600 font-extrabold bg-blue-50/70 border border-blue-200 hover:bg-blue-100 cursor-pointer";
              }

              return (
                <button
                  key={`${item.year}-${item.month}-${item.day}-${index}`}
                  type="button"
                  disabled={item.isDisabled}
                  onClick={() => handleSelectDate(item.year, item.month, item.day)}
                  className={`w-8 h-8 rounded-lg text-xs flex items-center justify-center transition-all duration-100 ${cellStyle}`}
                >
                  {item.day}
                </button>
              );
            })}
          </div>

          {/* Calendar Footer Actions */}
          <div className="mt-3.5 pt-2.5 border-t border-gray-100 flex items-center justify-between text-xs">
            <button
              type="button"
              onClick={handleSelectToday}
              className="font-bold text-blue-600 hover:text-blue-800 px-2 py-1 rounded-md hover:bg-blue-50 transition cursor-pointer"
            >
              Today
            </button>
            <div className="flex items-center gap-2">
              {value && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="text-gray-500 hover:text-gray-800 px-2 py-1 rounded-md hover:bg-gray-100 transition cursor-pointer"
                >
                  Clear
                </button>
              )}
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="text-gray-600 hover:text-gray-900 font-medium px-2 py-1 rounded-md hover:bg-gray-100 transition cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

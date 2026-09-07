"use client";

import React from "react";

export default function EmployeeProfilePage() {
  return (
    <div className="p-8 max-w-5xl mx-auto space-y-6">
      <div className="bg-white p-6 rounded-xl border border-gray-200/80 shadow-xs flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold text-gray-900">My Profile</h1>
          <p className="text-gray-500 text-xs mt-0.5">Manage your personal and professional information.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Read-Only Professional Data */}
        <div className="md:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-xl border border-gray-200/80 shadow-xs">
            <h2 className="text-sm font-bold text-gray-900 mb-4 border-b border-gray-100 pb-2">Professional Data</h2>
            <div className="space-y-4 text-xs">
              <div>
                <span className="text-gray-400 text-[11px] block">Full Name</span>
                <span className="font-semibold text-gray-900 text-sm">Alex Morgan</span>
              </div>
              <div>
                <span className="text-gray-400 text-[11px] block">Employee ID</span>
                <span className="font-semibold text-gray-900 text-sm">EMP-1048</span>
              </div>
              <div>
                <span className="text-gray-400 text-[11px] block">Department</span>
                <span className="font-semibold text-gray-900 text-sm">Engineering</span>
              </div>
              <div>
                <span className="text-gray-400 text-[11px] block">Role</span>
                <span className="font-semibold text-gray-900 text-sm">Fullstack Developer</span>
              </div>
              <div>
                <span className="text-gray-400 text-[11px] block">Manager</span>
                <span className="font-semibold text-gray-900 text-sm">Sarah Jenkins</span>
              </div>
              <div>
                <span className="text-gray-400 text-[11px] block">Date of Join</span>
                <span className="font-semibold text-gray-900 text-sm">Oct 12, 2023</span>
              </div>
            </div>
            <div className="mt-4 p-3 bg-blue-50 text-blue-700 rounded-lg text-[11px] leading-relaxed">
              <strong>Note:</strong> Professional data is read-only. Contact HR if you need to request changes to your role or department.
            </div>
          </div>
        </div>

        {/* Editable Personal Files */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-xl border border-gray-200/80 shadow-xs">
            <div className="flex justify-between items-center mb-4 border-b border-gray-100 pb-2">
              <h2 className="text-sm font-bold text-gray-900">Personal Information</h2>
              <button className="text-xs text-blue-600 font-semibold hover:underline">Edit</button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-gray-400 text-[11px] block">Personal Email</span>
                <span className="font-medium text-gray-800">alex.m.personal@gmail.com</span>
              </div>
              <div>
                <span className="text-gray-400 text-[11px] block">Phone Number</span>
                <span className="font-medium text-gray-800">+1 (555) 123-4567</span>
              </div>
              <div className="sm:col-span-2">
                <span className="text-gray-400 text-[11px] block">Home Address</span>
                <span className="font-medium text-gray-800">123 Tech Lane, Apt 4B, Silicon Valley, CA 94000</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-200/80 shadow-xs">
            <div className="flex justify-between items-center mb-4 border-b border-gray-100 pb-2">
              <h2 className="text-sm font-bold text-gray-900">Emergency Contacts</h2>
              <button className="text-xs text-blue-600 font-semibold hover:underline">Add New</button>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 rounded-lg border border-gray-100">
                <div>
                  <div className="text-xs font-bold text-gray-900">Jane Morgan (Spouse)</div>
                  <div className="text-[11px] text-gray-500">+1 (555) 987-6543</div>
                </div>
                <button className="text-xs text-gray-500 hover:text-blue-600 font-medium">Edit</button>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-200/80 shadow-xs">
            <div className="flex justify-between items-center mb-4 border-b border-gray-100 pb-2">
              <h2 className="text-sm font-bold text-gray-900">Bank Details</h2>
              <button className="text-xs text-blue-600 font-semibold hover:underline">Update</button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-gray-400 text-[11px] block">Bank Name</span>
                <span className="font-medium text-gray-800">Chase Bank</span>
              </div>
              <div>
                <span className="text-gray-400 text-[11px] block">Account Name</span>
                <span className="font-medium text-gray-800">Alex Morgan</span>
              </div>
              <div>
                <span className="text-gray-400 text-[11px] block">Account Number</span>
                <span className="font-medium text-gray-800">**** **** 1234</span>
              </div>
              <div>
                <span className="text-gray-400 text-[11px] block">Routing Number</span>
                <span className="font-medium text-gray-800">****5678</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
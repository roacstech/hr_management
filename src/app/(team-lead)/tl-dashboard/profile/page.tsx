"use client";

import { useState, useEffect, useRef } from "react";
import { useTenant } from "@/context/TenantContext";
import { TeamLeadProfile, WorkExperience, EducationDetail, DependentDetail } from "@/lib/mock-data";
import Link from "next/link";

const FieldRow = ({
  label,
  value,
  editContent,
  isEditing,
}: {
  label: string;
  value?: React.ReactNode;
  editContent?: React.ReactNode;
  isEditing: boolean;
}) => (
  <div className="py-2.5 border-b border-gray-100 last:border-0">
    <div className="flex items-start gap-4">
      <span className="w-48 shrink-0 text-[11.5px] text-gray-500 pt-0.5">{label}</span>
      <div className="flex-1 text-[12px] font-medium text-gray-800">
        {isEditing && editContent ? editContent : (value || <span className="text-gray-300">-</span>)}
      </div>
    </div>
  </div>
);

const Section = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <div className="bg-white rounded-xl border border-gray-200 shadow-xs overflow-hidden">
    <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100 bg-gray-50/60">
      <h3 className="text-xs font-bold text-blue-600 uppercase tracking-wider">{title}</h3>
    </div>
    <div className="px-5 py-1">{children}</div>
  </div>
);

const InlineInput = ({
  value,
  onChange,
  type = "text",
  placeholder = "",
}: {
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
}) => (
  <input
    type={type}
    value={value}
    placeholder={placeholder}
    onChange={(e) => onChange(e.target.value)}
    className="w-full px-2.5 py-1.5 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-xs bg-white text-gray-800 placeholder-gray-400 transition"
  />
);

const DateInput = ({
  value,
  onChange,
  placeholder = "dd-MMM-yyyy",
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) => {
  const hiddenDateRef = useRef<HTMLInputElement>(null);

  const handlePickerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value; // YYYY-MM-DD
    if (raw) {
      const [y, m, d] = raw.split("-");
      const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      const formatted = `${d}-${months[parseInt(m, 10) - 1]}-${y}`;
      onChange(formatted);
    }
  };

  return (
    <div className="relative flex items-center w-full">
      <input
        type="text"
        value={value || ""}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full pl-3 pr-8 py-2 bg-white border border-gray-200 rounded-lg text-xs text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition"
      />
      <button
        type="button"
        onClick={() => {
          try {
            hiddenDateRef.current?.showPicker?.();
          } catch {
            hiddenDateRef.current?.focus();
          }
        }}
        title="Open calendar"
        className="absolute right-2 p-1 text-gray-400 hover:text-blue-600 cursor-pointer transition"
      >
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </button>
      <input
        ref={hiddenDateRef}
        type="date"
        onChange={handlePickerChange}
        className="sr-only absolute pointer-events-none opacity-0"
        tabIndex={-1}
      />
    </div>
  );
};

export default function TeamLeadProfilePage() {
  const { currentOrg, teamLeadProfile, updateTeamLeadProfile, showToast } = useTenant();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<TeamLeadProfile>(teamLeadProfile);
  const [skillInput, setSkillInput] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (teamLeadProfile) {
      setFormData(teamLeadProfile);
    }
  }, [teamLeadProfile]);

  const handleChange = (field: keyof TeamLeadProfile, value: any) =>
    setFormData((prev) => ({ ...prev, [field]: value }));

  const handleSaveAll = () => {
    // Filter out completely empty rows in dynamic tables
    const cleaned: TeamLeadProfile = {
      ...formData,
      workExperience: (formData.workExperience || []).filter(
        (w) => w.companyName.trim() || w.jobTitle.trim() || w.jobDescription.trim() || w.fromDate || w.toDate
      ),
      educationDetails: (formData.educationDetails || []).filter(
        (e) => e.instituteName.trim() || e.degree.trim() || e.specialization.trim() || e.dateOfCompletion
      ),
      dependentDetails: (formData.dependentDetails || []).filter(
        (d) => d.name.trim() || d.relationship.trim() || d.dateOfBirth
      ),
    };

    updateTeamLeadProfile(cleaned);
    setFormData(cleaned);
    setIsEditing(false);
    showToast("Profile details updated successfully!", "success");
  };

  const handleCancelAll = () => {
    setFormData(teamLeadProfile);
    setIsEditing(false);
  };

  // Dynamic Row Handlers: Work Experience
  const handleAddWorkExperience = () => {
    const newRow: WorkExperience = {
      id: `we-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
      companyName: "",
      jobTitle: "",
      fromDate: "",
      toDate: "",
      jobDescription: "",
      relevant: true,
    };
    setFormData((prev) => ({
      ...prev,
      workExperience: [...(prev.workExperience || []), newRow],
    }));
  };

  const handleUpdateWorkExperience = (id: string, field: keyof WorkExperience, value: any) => {
    setFormData((prev) => ({
      ...prev,
      workExperience: (prev.workExperience || []).map((row) =>
        row.id === id ? { ...row, [field]: value } : row
      ),
    }));
  };

  const handleDeleteWorkExperience = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      workExperience: (prev.workExperience || []).filter((row) => row.id !== id),
    }));
  };

  // Dynamic Row Handlers: Education Details
  const handleAddEducation = () => {
    const newRow: EducationDetail = {
      id: `ed-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
      instituteName: "",
      degree: "",
      specialization: "",
      dateOfCompletion: "",
    };
    setFormData((prev) => ({
      ...prev,
      educationDetails: [...(prev.educationDetails || []), newRow],
    }));
  };

  const handleUpdateEducation = (id: string, field: keyof EducationDetail, value: any) => {
    setFormData((prev) => ({
      ...prev,
      educationDetails: (prev.educationDetails || []).map((row) =>
        row.id === id ? { ...row, [field]: value } : row
      ),
    }));
  };

  const handleDeleteEducation = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      educationDetails: (prev.educationDetails || []).filter((row) => row.id !== id),
    }));
  };

  // Dynamic Row Handlers: Dependent Details
  const handleAddDependent = () => {
    const newRow: DependentDetail = {
      id: `dep-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
      name: "",
      relationship: "",
      dateOfBirth: "",
    };
    setFormData((prev) => ({
      ...prev,
      dependentDetails: [...(prev.dependentDetails || []), newRow],
    }));
  };

  const handleUpdateDependent = (id: string, field: keyof DependentDetail, value: any) => {
    setFormData((prev) => ({
      ...prev,
      dependentDetails: (prev.dependentDetails || []).map((row) =>
        row.id === id ? { ...row, [field]: value } : row
      ),
    }));
  };

  const handleDeleteDependent = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      dependentDetails: (prev.dependentDetails || []).filter((row) => row.id !== id),
    }));
  };

  // Skills
  const handleAddSkill = (e: React.KeyboardEvent | React.MouseEvent) => {
    if ("key" in e && e.key !== "Enter") return;
    e.preventDefault();
    const trimmed = skillInput.trim();
    if (trimmed && !(formData.skills || []).includes(trimmed)) {
      setFormData((prev) => ({ ...prev, skills: [...(prev.skills || []), trimmed] }));
      setSkillInput("");
    }
  };

  const handleRemoveSkill = (s: string) =>
    setFormData((prev) => ({ ...prev, skills: (prev.skills || []).filter((x) => x !== s) }));

  // Profile Image
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      showToast("Image must be smaller than 5MB.", "error");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      handleChange("profileImageUrl", result);
      updateTeamLeadProfile({ profileImageUrl: result });
      showToast("Profile image uploaded!", "success");
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    handleChange("profileImageUrl", "");
    updateTeamLeadProfile({ profileImageUrl: "" });
    if (fileInputRef.current) fileInputRef.current.value = "";
    showToast("Profile image removed.", "info");
  };

  const age = formData.dateOfBirth
    ? Math.floor((Date.now() - new Date(formData.dateOfBirth).getTime()) / (365.25 * 24 * 3600 * 1000))
    : null;

  const fmt = (d?: string) => {
    if (!d) return "-";
    if (/^\d{1,2}-[A-Za-z]{3}-\d{4}$/.test(d.trim())) return d;
    try {
      const date = new Date(d);
      return isNaN(date.getTime()) ? d : date.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
    } catch {
      return d;
    }
  };

  return (
    <div className="space-y-5 max-w-5xl mx-auto pb-24 font-sans">
      {/* Back Navigation */}
      <div className="flex items-center pt-2">
        <Link
          href="/tl-dashboard"
          className="inline-flex items-center text-xs font-bold text-gray-500 hover:text-blue-600 transition-colors"
        >
          <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Dashboard
        </Link>
      </div>

      {/* Hero Card with Profile Right Corner Action */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-xs overflow-hidden">
        <div className="h-24 bg-gradient-to-r from-slate-900 via-[#19223f] to-amber-950 p-5 flex items-end justify-end">
          <span className="text-[11px] font-semibold text-amber-300/80 bg-black/20 px-3 py-1 rounded-md backdrop-blur-xs border border-amber-400/20">
            {currentOrg.name} - Engineering Division
          </span>
        </div>

        <div className="px-6 pb-5 pt-0">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            {/* Avatar & Summary */}
            <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
              <div className="relative group shrink-0">
                <div className="-mt-10 w-20 h-20 rounded-2xl bg-gradient-to-br from-amber-500 via-orange-500 to-amber-600 text-white font-black text-xl flex items-center justify-center ring-4 ring-white shadow-lg overflow-hidden">
                  {formData.profileImageUrl ? (
                    <img src={formData.profileImageUrl} alt={formData.name} className="w-full h-full object-cover" />
                  ) : (
                    formData.avatar
                  )}
                </div>
                {isEditing && (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    title="Change Photo"
                    className="absolute -bottom-1.5 -right-1.5 w-6 h-6 bg-gray-900 text-white rounded-full flex items-center justify-center shadow-md hover:bg-blue-600 transition cursor-pointer"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </button>
                )}
                <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
              </div>

              <div className="pt-1 sm:pt-3">
                <div className="flex items-center space-x-2">
                  <h2 className="text-lg font-bold text-gray-900">{formData.name}</h2>
                  <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-amber-50 text-amber-700 border border-amber-200">
                    {formData.role}
                  </span>
                </div>
                <p className="text-xs font-medium text-gray-600 mt-0.5">
                  {formData.designation} - {formData.department}
                </p>
                <p className="text-[11px] text-gray-400 mt-0.5">
                  ID: {formData.employeeId} - {formData.workLocation}
                </p>
              </div>
            </div>

            {/* Profile Section Right Corner Actions */}
            <div className="flex flex-wrap items-center gap-2">
              {isEditing ? (
                <>
                  <button
                    type="button"
                    id="save-profile-top-btn"
                    onClick={handleSaveAll}
                    className="inline-flex items-center px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow-sm transition cursor-pointer gap-1.5"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                    </svg>
                    Save Changes
                  </button>
                  <button
                    type="button"
                    id="cancel-profile-top-btn"
                    onClick={handleCancelAll}
                    className="inline-flex items-center px-3.5 py-2 bg-white hover:bg-gray-100 border border-gray-300 text-gray-700 text-xs font-semibold rounded-lg shadow-sm transition cursor-pointer gap-1.5"
                  >
                    <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    Cancel
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  id="edit-profile-btn"
                  onClick={() => setIsEditing(true)}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg shadow-sm transition cursor-pointer gap-1.5"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                  Edit Profile
                </button>
              )}

              {isEditing && (
                <>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="inline-flex items-center px-3 py-2 bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 text-xs font-semibold rounded-lg shadow-xs transition cursor-pointer"
                  >
                    <svg className="w-3.5 h-3.5 mr-1.5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                    </svg>
                    {formData.profileImageUrl ? "Change Photo" : "Upload Photo"}
                  </button>
                  {formData.profileImageUrl && (
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="px-3 py-2 bg-white hover:bg-rose-50 text-rose-600 border border-rose-200 text-xs font-semibold rounded-lg transition cursor-pointer"
                    >
                      Remove Photo
                    </button>
                  )}
                </>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5 pt-4 border-t border-gray-100 text-xs">
            {[
              { label: "Reporting Manager", value: formData.reportingManager },
              { label: "Direct Reports", value: `${formData.directReportsCount} Members` },
              { label: "Assigned Shift", value: formData.shiftHours },
              { label: "Date of Joining", value: fmt(formData.joiningDate) },
            ].map((m) => (
              <div key={m.label} className="p-2.5 bg-gray-50/70 rounded-lg border border-gray-100">
                <span className="text-gray-400 text-[10px] block font-medium">{m.label}</span>
                <span className="font-bold text-gray-900 mt-0.5 block text-[11px] truncate">{m.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* About Me */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-xs overflow-hidden">
        <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100 bg-gray-50/60">
          <h3 className="text-xs font-bold text-blue-600 uppercase tracking-wider">About Me</h3>
        </div>
        <div className="p-5">
          {isEditing ? (
            <>
              <label className="block font-semibold text-gray-700 mb-1.5 text-xs">Professional Summary</label>
              <textarea
                rows={4}
                value={formData.bio || ""}
                onChange={(e) => handleChange("bio", e.target.value)}
                placeholder="Write a brief professional summary about yourself..."
                className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-xs leading-relaxed bg-white"
              />
              <div className="pt-3">
                <label className="block font-semibold text-gray-700 mb-2 text-xs">Skills and Expertise</label>
                <div className="flex flex-wrap gap-1.5">
                  {(formData.skills || []).map((skill) => (
                    <span
                      key={skill}
                      className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-slate-100 text-slate-800 border border-slate-200"
                    >
                      {skill}
                      <button
                        type="button"
                        onClick={() => handleRemoveSkill(skill)}
                        className="ml-1.5 text-slate-400 hover:text-rose-600 cursor-pointer font-bold"
                      >
                        x
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex items-center space-x-2 mt-2 max-w-sm">
                  <input
                    type="text"
                    placeholder="Add skill..."
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyDown={handleAddSkill}
                    className="flex-1 px-3 py-1.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-xs bg-white"
                  />
                  <button
                    type="button"
                    onClick={handleAddSkill}
                    className="px-3 py-1.5 bg-gray-900 text-white font-bold rounded-lg text-xs hover:bg-black transition cursor-pointer"
                  >
                    Add
                  </button>
                </div>
              </div>
            </>
          ) : formData.bio || (formData.skills && formData.skills.length > 0) ? (
            <>
              {formData.bio && <p className="text-xs text-gray-700 leading-relaxed">{formData.bio}</p>}
              {formData.skills && formData.skills.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {formData.skills.map((s) => (
                    <span
                      key={s}
                      className="px-2.5 py-1 rounded-md text-xs font-semibold bg-slate-100 text-slate-800 border border-slate-200"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-6 text-gray-400">
              <p className="text-xs text-gray-500">No summary added yet. Click &quot;Edit Profile&quot; to write about yourself.</p>
            </div>
          )}
        </div>
      </div>

      {/* Basic Information */}
      <Section title="Basic Information">
        <div className="grid grid-cols-1 sm:grid-cols-2">
          <div className="sm:pr-6 sm:border-r sm:border-gray-100">
            <FieldRow label="Employee ID" value={formData.employeeId} isEditing={false} />
            <FieldRow
              label="First Name"
              value={formData.firstName}
              isEditing={isEditing}
              editContent={<InlineInput value={formData.firstName} onChange={(v) => handleChange("firstName", v)} />}
            />
            <FieldRow
              label="Last Name"
              value={formData.lastName}
              isEditing={isEditing}
              editContent={<InlineInput value={formData.lastName} onChange={(v) => handleChange("lastName", v)} />}
            />
          </div>
          <div className="sm:pl-6">
            <FieldRow
              label="Nick Name"
              value={formData.nickName}
              isEditing={isEditing}
              editContent={<InlineInput value={formData.nickName} onChange={(v) => handleChange("nickName", v)} />}
            />
            <FieldRow label="Email Address" value={formData.email} isEditing={false} />
          </div>
        </div>
      </Section>

      {/* Work Information */}
      <Section title="Work Information">
        <div className="grid grid-cols-1 sm:grid-cols-2">
          <div className="sm:pr-6 sm:border-r sm:border-gray-100">
            <FieldRow label="Department" value={formData.department} isEditing={false} />
            <FieldRow label="Location" value={formData.workLocation} isEditing={false} />
            <FieldRow label="Designation" value={formData.designation} isEditing={false} />
          </div>
          <div className="sm:pl-6">
            <FieldRow label="Role" value={formData.role} isEditing={false} />
            <FieldRow label="Employment Type" value={formData.employmentType} isEditing={false} />
            <FieldRow label="Employee Status" value={formData.employeeStatus} isEditing={false} />
            <FieldRow
              label="Source of Hire"
              value={formData.sourceOfHire}
              isEditing={isEditing}
              editContent={<InlineInput value={formData.sourceOfHire} onChange={(v) => handleChange("sourceOfHire", v)} />}
            />
            <FieldRow label="Date of Joining" value={fmt(formData.joiningDate)} isEditing={false} />
            <FieldRow label="Current Experience" value={formData.currentExperience} isEditing={false} />
            <FieldRow label="Total Experience" value={formData.totalExperience} isEditing={false} />
          </div>
        </div>
      </Section>

      {/* Hierarchy Information */}
      <Section title="Hierarchy Information">
        <div className="grid grid-cols-1 sm:grid-cols-2">
          <div className="sm:pr-6 sm:border-r sm:border-gray-100">
            <FieldRow label="Reporting Manager" value={formData.reportingManager} isEditing={false} />
            <FieldRow label="Team" value={formData.team} isEditing={false} />
          </div>
          <div className="sm:pl-6">
            <FieldRow label="Direct Reports" value={`${formData.directReportsCount} Members`} isEditing={false} />
          </div>
        </div>
      </Section>

      {/* Personal Details */}
      <Section title="Personal Details">
        <div className="grid grid-cols-1 sm:grid-cols-2">
          <div className="sm:pr-6 sm:border-r sm:border-gray-100">
            <FieldRow
              label="Date of Birth"
              value={fmt(formData.dateOfBirth)}
              isEditing={isEditing}
              editContent={
                <DateInput
                  value={formData.dateOfBirth || ""}
                  onChange={(v) => handleChange("dateOfBirth", v)}
                />
              }
            />
            <FieldRow label="Age" value={age ? `${age} years` : "-"} isEditing={false} />
            <FieldRow
              label="Gender"
              value={formData.gender}
              isEditing={isEditing}
              editContent={
                <select
                  value={formData.gender || "Male"}
                  onChange={(e) => handleChange("gender", e.target.value)}
                  className="w-full px-2.5 py-1.5 border border-gray-200 rounded-md text-xs bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Non-binary">Non-binary</option>
                  <option value="Prefer not to say">Prefer not to say</option>
                </select>
              }
            />
            <FieldRow
              label="Marital Status"
              value={formData.maritalStatus}
              isEditing={isEditing}
              editContent={
                <select
                  value={formData.maritalStatus || "Single"}
                  onChange={(e) => handleChange("maritalStatus", e.target.value)}
                  className="w-full px-2.5 py-1.5 border border-gray-200 rounded-md text-xs bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
                >
                  <option value="Single">Single</option>
                  <option value="Married">Married</option>
                  <option value="Divorced">Divorced</option>
                  <option value="Widowed">Widowed</option>
                </select>
              }
            />
          </div>
          <div className="sm:pl-6">
            <FieldRow
              label="Ask me about / Expertise"
              value={formData.expertise}
              isEditing={isEditing}
              editContent={
                <InlineInput
                  value={formData.expertise || ""}
                  onChange={(v) => handleChange("expertise", v)}
                  placeholder="e.g. React, UI Architecture"
                />
              }
            />
          </div>
        </div>
      </Section>

      {/* Identity Information - Editable PAN, UAN, Aadhaar */}
      <Section title="Identity Information">
        <div className="grid grid-cols-1 sm:grid-cols-2">
          <div className="sm:pr-6 sm:border-r sm:border-gray-100">
            <FieldRow
              label="UAN"
              value={
                formData.uan ? (
                  <span className="font-mono text-gray-800">{formData.uan}</span>
                ) : (
                  <span className="text-gray-300">-</span>
                )
              }
              isEditing={isEditing}
              editContent={
                <InlineInput
                  value={formData.uan || ""}
                  onChange={(v) => handleChange("uan", v)}
                  placeholder="e.g. 100904928192"
                />
              }
            />
            <FieldRow
              label="PAN"
              value={
                formData.pan ? (
                  <span className="font-mono uppercase text-gray-800">{formData.pan}</span>
                ) : (
                  <span className="text-gray-300">-</span>
                )
              }
              isEditing={isEditing}
              editContent={
                <InlineInput
                  value={formData.pan || ""}
                  onChange={(v) => handleChange("pan", v.toUpperCase())}
                  placeholder="e.g. ABCDE1234F"
                />
              }
            />
          </div>
          <div className="sm:pl-6">
            <FieldRow
              label="Aadhaar"
              value={
                formData.aadhaar ? (
                  <span className="font-mono text-gray-800">{formData.aadhaar}</span>
                ) : (
                  <span className="text-gray-300">-</span>
                )
              }
              isEditing={isEditing}
              editContent={
                <InlineInput
                  value={formData.aadhaar || ""}
                  onChange={(v) => handleChange("aadhaar", v)}
                  placeholder="e.g. 1234 5678 9012"
                />
              }
            />
          </div>
        </div>
      </Section>

      {/* Contact Details */}
      <Section title="Contact Details">
        <div className="grid grid-cols-1 sm:grid-cols-2">
          <div className="sm:pr-6 sm:border-r sm:border-gray-100">
            <FieldRow
              label="Work Phone Number"
              value={formData.workPhone}
              isEditing={isEditing}
              editContent={<InlineInput value={formData.workPhone || ""} onChange={(v) => handleChange("workPhone", v)} />}
            />
            <FieldRow
              label="Extension"
              value={formData.extension}
              isEditing={isEditing}
              editContent={<InlineInput value={formData.extension || ""} onChange={(v) => handleChange("extension", v)} />}
            />
            <FieldRow
              label="Seating Location"
              value={formData.seatingLocation}
              isEditing={isEditing}
              editContent={<InlineInput value={formData.seatingLocation || ""} onChange={(v) => handleChange("seatingLocation", v)} />}
            />
            <FieldRow label="Tags" value={(formData.tags || []).join(", ") || "-"} isEditing={false} />
            <FieldRow
              label="Present Address"
              value={formData.presentAddress}
              isEditing={isEditing}
              editContent={<InlineInput value={formData.presentAddress || ""} onChange={(v) => handleChange("presentAddress", v)} />}
            />
            <FieldRow
              label="Permanent Address"
              value={formData.permanentAddress}
              isEditing={isEditing}
              editContent={<InlineInput value={formData.permanentAddress || ""} onChange={(v) => handleChange("permanentAddress", v)} />}
            />
          </div>
          <div className="sm:pl-6">
            <FieldRow
              label="Personal Mobile Number"
              value={formData.phone}
              isEditing={isEditing}
              editContent={<InlineInput value={formData.phone || ""} onChange={(v) => handleChange("phone", v)} />}
            />
            <FieldRow
              label="Personal Email Address"
              value={formData.personalEmail}
              isEditing={isEditing}
              editContent={<InlineInput type="email" value={formData.personalEmail || ""} onChange={(v) => handleChange("personalEmail", v)} />}
            />
          </div>
        </div>
      </Section>

      {/* Emergency Contact */}
      <Section title="Emergency Contact">
        <div className="grid grid-cols-1 sm:grid-cols-2">
          <div className="sm:pr-6 sm:border-r sm:border-gray-100">
            <FieldRow
              label="Contact Name"
              value={formData.emergencyContact?.name}
              isEditing={isEditing}
              editContent={
                <InlineInput
                  value={formData.emergencyContact?.name || ""}
                  onChange={(v) => handleChange("emergencyContact", { ...formData.emergencyContact, name: v })}
                />
              }
            />
            <FieldRow
              label="Relationship"
              value={formData.emergencyContact?.relationship}
              isEditing={isEditing}
              editContent={
                <InlineInput
                  value={formData.emergencyContact?.relationship || ""}
                  onChange={(v) => handleChange("emergencyContact", { ...formData.emergencyContact, relationship: v })}
                />
              }
            />
          </div>
          <div className="sm:pl-6">
            <FieldRow
              label="Phone Number"
              value={formData.emergencyContact?.phone}
              isEditing={isEditing}
              editContent={
                <InlineInput
                  value={formData.emergencyContact?.phone || ""}
                  onChange={(v) => handleChange("emergencyContact", { ...formData.emergencyContact, phone: v })}
                />
              }
            />
          </div>
        </div>
      </Section>

      {/* Work experience (Matching User's Screenshot) */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-xs overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h3 className="text-sm font-semibold text-gray-800">Work experience</h3>
          {isEditing && (
            <button
              type="button"
              id="add-work-experience-btn"
              onClick={handleAddWorkExperience}
              className="px-3.5 py-1.5 text-xs font-semibold text-blue-600 bg-white border border-blue-400 hover:bg-blue-50 rounded-md transition shadow-2xs cursor-pointer"
            >
              Add Row
            </button>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-[#eef2f9] text-gray-600 border-b border-gray-200">
                <th className="px-4 py-3 text-left font-medium whitespace-nowrap min-w-[150px]">Company name</th>
                <th className="px-4 py-3 text-left font-medium whitespace-nowrap min-w-[150px]">Job Title</th>
                <th className="px-4 py-3 text-left font-medium whitespace-nowrap min-w-[160px]">From Date</th>
                <th className="px-4 py-3 text-left font-medium whitespace-nowrap min-w-[160px]">To Date</th>
                <th className="px-4 py-3 text-left font-medium whitespace-nowrap min-w-[200px]">Job Description</th>
                <th className="px-4 py-3 text-left font-medium whitespace-nowrap min-w-[120px]">Relevant</th>
                {isEditing && <th className="px-3 py-3 text-center font-medium w-12"></th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {(!formData.workExperience || formData.workExperience.length === 0) ? (
                <tr>
                  <td colSpan={isEditing ? 7 : 6} className="px-4 py-8 text-center text-gray-400">
                    {isEditing ? (
                      <div className="flex flex-col items-center justify-center space-y-2">
                        <span>No work experience added yet.</span>
                        <button
                          type="button"
                          onClick={handleAddWorkExperience}
                          className="text-blue-600 hover:underline font-semibold text-xs cursor-pointer"
                        >
                          + Click here to add a row
                        </button>
                      </div>
                    ) : (
                      "No work experience records found."
                    )}
                  </td>
                </tr>
              ) : (
                formData.workExperience.map((we) => (
                  <tr key={we.id} className="hover:bg-gray-50/60 transition-colors">
                    {isEditing ? (
                      <>
                        <td className="px-3 py-3 align-top">
                          <input
                            type="text"
                            value={we.companyName}
                            placeholder="Company name"
                            onChange={(e) => handleUpdateWorkExperience(we.id, "companyName", e.target.value)}
                            className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </td>
                        <td className="px-3 py-3 align-top">
                          <input
                            type="text"
                            value={we.jobTitle}
                            placeholder="Job Title"
                            onChange={(e) => handleUpdateWorkExperience(we.id, "jobTitle", e.target.value)}
                            className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </td>
                        <td className="px-3 py-3 align-top">
                          <DateInput
                            value={we.fromDate || ""}
                            onChange={(v) => handleUpdateWorkExperience(we.id, "fromDate", v)}
                            placeholder="dd-MMM-yyyy"
                          />
                        </td>
                        <td className="px-3 py-3 align-top">
                          <DateInput
                            value={we.toDate || ""}
                            onChange={(v) => handleUpdateWorkExperience(we.id, "toDate", v)}
                            placeholder="dd-MMM-yyyy"
                          />
                        </td>
                        <td className="px-3 py-3 align-top">
                          <textarea
                            rows={2}
                            value={we.jobDescription || ""}
                            placeholder="Job Description"
                            onChange={(e) => handleUpdateWorkExperience(we.id, "jobDescription", e.target.value)}
                            className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs resize-y focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </td>
                        <td className="px-3 py-3 align-top">
                          <select
                            value={we.relevant ? "Yes" : "No"}
                            onChange={(e) => handleUpdateWorkExperience(we.id, "relevant", e.target.value === "Yes")}
                            className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 cursor-pointer"
                          >
                            <option value="Yes">Yes</option>
                            <option value="No">No</option>
                          </select>
                        </td>
                        <td className="px-2 py-3 text-center align-middle">
                          <button
                            type="button"
                            onClick={() => handleDeleteWorkExperience(we.id)}
                            title="Delete Row"
                            className="p-1 text-gray-400 hover:text-red-600 rounded hover:bg-red-50 transition cursor-pointer"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="px-4 py-3 font-semibold text-gray-800">{we.companyName}</td>
                        <td className="px-4 py-3 text-gray-700">{we.jobTitle}</td>
                        <td className="px-4 py-3 text-gray-600">{fmt(we.fromDate)}</td>
                        <td className="px-4 py-3 text-gray-600">{we.toDate ? fmt(we.toDate) : "Present"}</td>
                        <td className="px-4 py-3 text-gray-600 max-w-xs">{we.jobDescription || "-"}</td>
                        <td className="px-4 py-3">
                          {we.relevant ? (
                            <span className="px-2.5 py-0.5 text-[10px] font-bold rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                              Yes
                            </span>
                          ) : (
                            <span className="px-2.5 py-0.5 text-[10px] font-bold rounded-full bg-gray-100 text-gray-500">
                              No
                            </span>
                          )}
                        </td>
                      </>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Education Details (Matching User's Screenshot) */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-xs overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h3 className="text-sm font-semibold text-gray-800">Education Details</h3>
          {isEditing && (
            <button
              type="button"
              id="add-education-btn"
              onClick={handleAddEducation}
              className="px-3.5 py-1.5 text-xs font-semibold text-blue-600 bg-white border border-blue-400 hover:bg-blue-50 rounded-md transition shadow-2xs cursor-pointer"
            >
              Add Row
            </button>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-[#eef2f9] text-gray-600 border-b border-gray-200">
                <th className="px-4 py-3 text-left font-medium whitespace-nowrap min-w-[180px]">Institute Name</th>
                <th className="px-4 py-3 text-left font-medium whitespace-nowrap min-w-[160px]">Degree/Diploma</th>
                <th className="px-4 py-3 text-left font-medium whitespace-nowrap min-w-[160px]">Specialization</th>
                <th className="px-4 py-3 text-left font-medium whitespace-nowrap min-w-[160px]">Date of Completion</th>
                {isEditing && <th className="px-3 py-3 text-center font-medium w-12"></th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {(!formData.educationDetails || formData.educationDetails.length === 0) ? (
                <tr>
                  <td colSpan={isEditing ? 5 : 4} className="px-4 py-8 text-center text-gray-400">
                    {isEditing ? (
                      <div className="flex flex-col items-center justify-center space-y-2">
                        <span>No education details added yet.</span>
                        <button
                          type="button"
                          onClick={handleAddEducation}
                          className="text-blue-600 hover:underline font-semibold text-xs cursor-pointer"
                        >
                          + Click here to add a row
                        </button>
                      </div>
                    ) : (
                      "No education records found."
                    )}
                  </td>
                </tr>
              ) : (
                formData.educationDetails.map((ed) => (
                  <tr key={ed.id} className="hover:bg-gray-50/60 transition-colors">
                    {isEditing ? (
                      <>
                        <td className="px-3 py-3 align-top">
                          <input
                            type="text"
                            value={ed.instituteName}
                            placeholder="Institute Name"
                            onChange={(e) => handleUpdateEducation(ed.id, "instituteName", e.target.value)}
                            className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </td>
                        <td className="px-3 py-3 align-top">
                          <input
                            type="text"
                            value={ed.degree}
                            placeholder="Degree/Diploma"
                            onChange={(e) => handleUpdateEducation(ed.id, "degree", e.target.value)}
                            className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </td>
                        <td className="px-3 py-3 align-top">
                          <input
                            type="text"
                            value={ed.specialization}
                            placeholder="Specialization"
                            onChange={(e) => handleUpdateEducation(ed.id, "specialization", e.target.value)}
                            className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </td>
                        <td className="px-3 py-3 align-top">
                          <DateInput
                            value={ed.dateOfCompletion || ""}
                            onChange={(v) => handleUpdateEducation(ed.id, "dateOfCompletion", v)}
                            placeholder="dd-MMM-yyyy"
                          />
                        </td>
                        <td className="px-2 py-3 text-center align-middle">
                          <button
                            type="button"
                            onClick={() => handleDeleteEducation(ed.id)}
                            title="Delete Row"
                            className="p-1 text-gray-400 hover:text-red-600 rounded hover:bg-red-50 transition cursor-pointer"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="px-4 py-3 font-semibold text-gray-800">{ed.instituteName}</td>
                        <td className="px-4 py-3 text-gray-700">{ed.degree}</td>
                        <td className="px-4 py-3 text-gray-600">{ed.specialization || "-"}</td>
                        <td className="px-4 py-3 text-gray-600">{fmt(ed.dateOfCompletion)}</td>
                      </>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Dependent Details (Matching User's Screenshot) */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-xs overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h3 className="text-sm font-semibold text-gray-800">Dependent Details</h3>
          {isEditing && (
            <button
              type="button"
              id="add-dependent-btn"
              onClick={handleAddDependent}
              className="px-3.5 py-1.5 text-xs font-semibold text-blue-600 bg-white border border-blue-400 hover:bg-blue-50 rounded-md transition shadow-2xs cursor-pointer"
            >
              Add Row
            </button>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-[#eef2f9] text-gray-600 border-b border-gray-200">
                <th className="px-4 py-3 text-left font-medium whitespace-nowrap min-w-[200px]">Name</th>
                <th className="px-4 py-3 text-left font-medium whitespace-nowrap min-w-[180px]">Relationship</th>
                <th className="px-4 py-3 text-left font-medium whitespace-nowrap min-w-[160px]">Date of Birth</th>
                {isEditing && <th className="px-3 py-3 text-center font-medium w-12"></th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {(!formData.dependentDetails || formData.dependentDetails.length === 0) ? (
                <tr>
                  <td colSpan={isEditing ? 4 : 3} className="px-4 py-8 text-center text-gray-400">
                    {isEditing ? (
                      <div className="flex flex-col items-center justify-center space-y-2">
                        <span>No dependent details added yet.</span>
                        <button
                          type="button"
                          onClick={handleAddDependent}
                          className="text-blue-600 hover:underline font-semibold text-xs cursor-pointer"
                        >
                          + Click here to add a row
                        </button>
                      </div>
                    ) : (
                      "No dependent records found."
                    )}
                  </td>
                </tr>
              ) : (
                formData.dependentDetails.map((dep) => (
                  <tr key={dep.id} className="hover:bg-gray-50/60 transition-colors">
                    {isEditing ? (
                      <>
                        <td className="px-3 py-3 align-top">
                          <input
                            type="text"
                            value={dep.name}
                            placeholder="Name"
                            onChange={(e) => handleUpdateDependent(dep.id, "name", e.target.value)}
                            className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </td>
                        <td className="px-3 py-3 align-top">
                          <select
                            value={dep.relationship || ""}
                            onChange={(e) => handleUpdateDependent(dep.id, "relationship", e.target.value)}
                            className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 cursor-pointer"
                          >
                            <option value="">Select</option>
                            <option value="Spouse">Spouse</option>
                            <option value="Child">Child</option>
                            <option value="Father">Father</option>
                            <option value="Mother">Mother</option>
                            <option value="Sibling">Sibling</option>
                            <option value="Other">Other</option>
                          </select>
                        </td>
                        <td className="px-3 py-3 align-top">
                          <DateInput
                            value={dep.dateOfBirth || ""}
                            onChange={(v) => handleUpdateDependent(dep.id, "dateOfBirth", v)}
                            placeholder="dd-MMM-yyyy"
                          />
                        </td>
                        <td className="px-2 py-3 text-center align-middle">
                          <button
                            type="button"
                            onClick={() => handleDeleteDependent(dep.id)}
                            title="Delete Row"
                            className="p-1 text-gray-400 hover:text-red-600 rounded hover:bg-red-50 transition cursor-pointer"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="px-4 py-3 font-semibold text-gray-800">{dep.name}</td>
                        <td className="px-4 py-3 text-gray-700">{dep.relationship}</td>
                        <td className="px-4 py-3 text-gray-600">{fmt(dep.dateOfBirth)}</td>
                      </>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Sticky Bottom Floating Bar when in Edit Mode */}
      {isEditing && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-white/95 backdrop-blur-md border border-gray-200 shadow-2xl rounded-2xl px-6 py-3 flex items-center gap-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="flex items-center gap-2 pr-2 border-r border-gray-200">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse"></span>
            <span className="text-xs font-bold text-gray-800">Editing Profile</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              id="save-profile-bottom-btn"
              onClick={handleSaveAll}
              className="inline-flex items-center px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow-sm transition cursor-pointer gap-1.5"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
              </svg>
              Save Changes
            </button>
            <button
              type="button"
              id="cancel-profile-bottom-btn"
              onClick={handleCancelAll}
              className="inline-flex items-center px-3.5 py-2 bg-white hover:bg-gray-100 border border-gray-300 text-gray-700 text-xs font-semibold rounded-lg shadow-sm transition cursor-pointer gap-1.5"
            >
              <svg className="w-3.5 h-3.5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
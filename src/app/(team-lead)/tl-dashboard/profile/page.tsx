"use client";

import { useState, useEffect, useRef } from "react";
import { useTenant } from "@/context/TenantContext";
import { TeamLeadProfile } from "@/lib/mock-data";
import Link from "next/link";

const FieldRow = ({
  label,
  value,
  editContent,
  isEditing,
}: {
  label: string;
  value?: string | React.ReactNode;
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
  isEditing,
  sectionKey,
  onEdit,
  onSave,
  onCancel,
  readOnly,
}: {
  title: string;
  children: React.ReactNode;
  isEditing: boolean;
  sectionKey: string;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
  readOnly?: boolean;
}) => (
  <div className="bg-white rounded-xl border border-gray-200 shadow-xs overflow-hidden">
    <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100 bg-gray-50/60">
      <h3 className="text-xs font-bold text-blue-600 uppercase tracking-wider">{title}</h3>
      {!readOnly && (!isEditing ? (
        <button type="button" id={`edit-${sectionKey}-btn`} onClick={onEdit} title={`Edit ${title}`}
          className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition cursor-pointer">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
          </svg>
        </button>
      ) : (
        <div className="flex items-center space-x-1">
          <button type="button" id={`save-${sectionKey}-btn`} onClick={onSave} title="Save"
            className="p-1.5 text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition cursor-pointer">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          </button>
          <button type="button" id={`cancel-${sectionKey}-btn`} onClick={onCancel} title="Cancel"
            className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition cursor-pointer">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      ))}
    </div>
    <div className="px-5 py-1">{children}</div>
  </div>
);

const InlineInput = ({ value, onChange, type = "text" }: { value: string; onChange: (v: string) => void; type?: string }) => (
  <input type={type} value={value} onChange={(e) => onChange(e.target.value)}
    className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-xs" />
);

type SectionKey = "basic" | "work" | "hierarchy" | "personal" | "identity" | "contact" | "bio" | "emergency";

export default function TeamLeadProfilePage() {
  const { currentOrg, teamLeadProfile, updateTeamLeadProfile, showToast } = useTenant();
  const [editingSection, setEditingSection] = useState<SectionKey | null>(null);
  const [formData, setFormData] = useState<TeamLeadProfile>(teamLeadProfile);
  const [skillInput, setSkillInput] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (teamLeadProfile) setFormData(teamLeadProfile);
  }, [teamLeadProfile]);

  const handleChange = (field: keyof TeamLeadProfile, value: any) =>
    setFormData((prev) => ({ ...prev, [field]: value }));

  const handleSave = (section: SectionKey) => {
    updateTeamLeadProfile(formData);
    showToast("Profile updated successfully!", "success");
    setEditingSection(null);
  };

  const handleCancel = () => {
    setFormData(teamLeadProfile);
    setEditingSection(null);
  };

  const sp = (key: SectionKey) => ({
    isEditing: editingSection === key,
    sectionKey: key,
    onEdit: () => setEditingSection(key),
    onSave: () => handleSave(key),
    onCancel: handleCancel,
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { showToast("Image must be smaller than 5MB.", "error"); return; }
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

  const handleAddSkill = (e: React.KeyboardEvent | React.MouseEvent) => {
    if ("key" in e && e.key !== "Enter") return;
    e.preventDefault();
    const trimmed = skillInput.trim();
    if (trimmed && !formData.skills.includes(trimmed)) {
      setFormData((prev) => ({ ...prev, skills: [...prev.skills, trimmed] }));
      setSkillInput("");
    }
  };

  const handleRemoveSkill = (s: string) =>
    setFormData((prev) => ({ ...prev, skills: prev.skills.filter((x) => x !== s) }));

  const age = formData.dateOfBirth
    ? Math.floor((Date.now() - new Date(formData.dateOfBirth).getTime()) / (365.25 * 24 * 3600 * 1000))
    : null;

  const fmt = (d: string) =>
    d ? new Date(d).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" }) : "-";

  const isEditingBio = editingSection === "bio";

  return (
    <div className="space-y-5 max-w-5xl mx-auto pb-20 font-sans">
      {/* Back Navigation */}
      <div className="flex items-center pt-2">
        <Link href="/tl-dashboard" className="inline-flex items-center text-xs font-bold text-gray-500 hover:text-blue-600 transition-colors">
          <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Dashboard
        </Link>
      </div>

      {/* Header */}
      {/* <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-xs">
        <div className="flex items-center space-x-2">
          <h1 className="text-xl font-bold text-gray-900 tracking-tight">My Profile</h1>
          <span className="px-2.5 py-0.5 text-xs font-bold rounded-full bg-amber-100 text-amber-800">Team Lead</span>
        </div>
        <p className="text-xs text-gray-500 mt-0.5">Manage your personal profile, leadership details, contact information, and preferences.</p>
      </div> */}

      {/* Hero Card */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-xs overflow-hidden">
        <div className="h-24 bg-gradient-to-r from-slate-900 via-[#19223f] to-amber-950 p-5 flex items-end justify-end">
          <span className="text-[11px] font-semibold text-amber-300/80 bg-black/20 px-3 py-1 rounded-md backdrop-blur-xs border border-amber-400/20">
            {currentOrg.name} - Engineering Division
          </span>
        </div>
        <div className="px-6 pb-5 pt-0">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
              <div className="relative group shrink-0">
                <div className="-mt-10 w-20 h-20 rounded-2xl bg-gradient-to-br from-amber-500 via-orange-500 to-amber-600 text-white font-black text-xl flex items-center justify-center ring-4 ring-white shadow-lg overflow-hidden">
                  {formData.profileImageUrl ? (
                    <img src={formData.profileImageUrl} alt={formData.name} className="w-full h-full object-cover" />
                  ) : formData.avatar}
                </div>
                <button type="button" onClick={() => fileInputRef.current?.click()}
                  className="absolute -bottom-1.5 -right-1.5 w-6 h-6 bg-gray-900 text-white rounded-full flex items-center justify-center shadow-md hover:bg-blue-600 transition cursor-pointer">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </button>
                <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
              </div>
              <div className="pt-1 sm:pt-3">
                <div className="flex items-center space-x-2">
                  <h2 className="text-lg font-bold text-gray-900">{formData.name}</h2>
                  <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-amber-50 text-amber-700 border border-amber-200">{formData.role}</span>
                </div>
                <p className="text-xs font-medium text-gray-600 mt-0.5">{formData.designation} - {formData.department}</p>
                <p className="text-[11px] text-gray-400 mt-0.5">ID: {formData.employeeId} - {formData.workLocation}</p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <button type="button" id="upload-photo-btn" onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center px-3 py-1.5 bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 text-xs font-semibold rounded-lg shadow-xs transition cursor-pointer">
                <svg className="w-3.5 h-3.5 mr-1.5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
                {formData.profileImageUrl ? "Change Photo" : "Upload Photo"}
              </button>
              {formData.profileImageUrl && (
                <button type="button" id="remove-photo-btn" onClick={handleRemoveImage}
                  className="px-3 py-1.5 bg-white hover:bg-rose-50 text-rose-600 border border-rose-200 text-xs font-semibold rounded-lg transition cursor-pointer">
                  Remove Photo
                </button>
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
          {!isEditingBio ? (
            <button type="button" onClick={() => setEditingSection("bio")}
              className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition cursor-pointer">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
            </button>
          ) : (
            <div className="flex items-center space-x-1">
              <button type="button" onClick={() => handleSave("bio")} className="p-1.5 text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition cursor-pointer">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
              </button>
              <button type="button" onClick={handleCancel} className="p-1.5 text-gray-500 hover:bg-gray-100 rounded-lg transition cursor-pointer">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
          )}
        </div>
        <div className="p-5">
          {isEditingBio ? (
            <>
              <textarea rows={4} value={formData.bio} onChange={(e) => handleChange("bio", e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-xs leading-relaxed" />
              <div className="pt-3">
                <label className="block font-semibold text-gray-700 mb-2 text-xs">Skills and Expertise</label>
                <div className="flex flex-wrap gap-1.5">
                  {formData.skills.map((skill) => (
                    <span key={skill} className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-slate-100 text-slate-800 border border-slate-200">
                      {skill}
                      <button type="button" onClick={() => handleRemoveSkill(skill)} className="ml-1.5 text-slate-400 hover:text-rose-600 cursor-pointer font-bold">x</button>
                    </span>
                  ))}
                </div>
                <div className="flex items-center space-x-2 mt-2 max-w-sm">
                  <input type="text" placeholder="Add skill..." value={skillInput} onChange={(e) => setSkillInput(e.target.value)} onKeyDown={handleAddSkill}
                    className="flex-1 px-3 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-xs" />
                  <button type="button" onClick={handleAddSkill} className="px-3 py-1.5 bg-gray-900 text-white font-bold rounded-lg text-xs hover:bg-black transition cursor-pointer">Add</button>
                </div>
              </div>
            </>
          ) : formData.bio ? (
            <>
              <p className="text-xs text-gray-700 leading-relaxed">{formData.bio}</p>
              <div className="flex flex-wrap gap-1.5 mt-3">
                {formData.skills.map((s) => (
                  <span key={s} className="px-2.5 py-1 rounded-md text-xs font-semibold bg-slate-100 text-slate-800 border border-slate-200">{s}</span>
                ))}
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-10 text-gray-400">
              <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center mb-3">
                <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </div>
              <p className="text-sm font-medium text-gray-600">Write a short introduction about yourself</p>
            </div>
          )}
        </div>
      </div>

      {/* Basic Information */}
      <Section title="Basic Information" {...sp("basic")}>
        <div className="grid grid-cols-1 sm:grid-cols-2">
          <div className="sm:pr-6 sm:border-r sm:border-gray-100">
            <FieldRow label="Employee ID" value={formData.employeeId} isEditing={editingSection === "basic"} />
            <FieldRow label="First Name" value={formData.firstName} isEditing={editingSection === "basic"}
              editContent={<InlineInput value={formData.firstName} onChange={(v) => handleChange("firstName", v)} />} />
            <FieldRow label="Last Name" value={formData.lastName} isEditing={editingSection === "basic"}
              editContent={<InlineInput value={formData.lastName} onChange={(v) => handleChange("lastName", v)} />} />
          </div>
          <div className="sm:pl-6">
            <FieldRow label="Nick Name" value={formData.nickName} isEditing={editingSection === "basic"}
              editContent={<InlineInput value={formData.nickName} onChange={(v) => handleChange("nickName", v)} />} />
            <FieldRow label="Email Address" value={formData.email} isEditing={editingSection === "basic"} />
          </div>
        </div>
      </Section>

      {/* Work Information */}
      <Section title="Work Information" {...sp("work")}>
        <div className="grid grid-cols-1 sm:grid-cols-2">
          <div className="sm:pr-6 sm:border-r sm:border-gray-100">
            <FieldRow label="Department" value={formData.department} isEditing={editingSection === "work"} />
            <FieldRow label="Location" value={formData.workLocation} isEditing={editingSection === "work"} />
            <FieldRow label="Designation" value={formData.designation} isEditing={editingSection === "work"} />
          </div>
          <div className="sm:pl-6">
            <FieldRow label="Role" value={formData.role} isEditing={editingSection === "work"} />
            <FieldRow label="Employment Type" value={formData.employmentType} isEditing={editingSection === "work"} />
            <FieldRow label="Employee Status" value={formData.employeeStatus} isEditing={editingSection === "work"} />
            <FieldRow label="Source of Hire" value={formData.sourceOfHire} isEditing={editingSection === "work"}
              editContent={<InlineInput value={formData.sourceOfHire} onChange={(v) => handleChange("sourceOfHire", v)} />} />
            <FieldRow label="Date of Joining" value={fmt(formData.joiningDate)} isEditing={editingSection === "work"} />
            <FieldRow label="Current Experience" value={formData.currentExperience} isEditing={editingSection === "work"} />
            <FieldRow label="Total Experience" value={formData.totalExperience} isEditing={editingSection === "work"} />
          </div>
        </div>
      </Section>

      {/* Hierarchy Information */}
      <Section title="Hierarchy Information" {...sp("hierarchy")} readOnly>
        <FieldRow label="Reporting Manager" value={formData.reportingManager} isEditing={false} />
        <FieldRow label="Team" value={formData.team} isEditing={false} />
        <FieldRow label="Direct Reports" value={`${formData.directReportsCount} Members`} isEditing={false} />
      </Section>

      {/* Personal Details */}
      <Section title="Personal Details" {...sp("personal")}>
        <div className="grid grid-cols-1 sm:grid-cols-2">
          <div className="sm:pr-6 sm:border-r sm:border-gray-100">
            <FieldRow label="Date of Birth" value={fmt(formData.dateOfBirth)} isEditing={editingSection === "personal"}
              editContent={<InlineInput type="date" value={formData.dateOfBirth} onChange={(v) => handleChange("dateOfBirth", v)} />} />
            <FieldRow label="Age" value={age ? `${age} years` : "-"} isEditing={editingSection === "personal"} />
            <FieldRow label="Gender" value={formData.gender} isEditing={editingSection === "personal"}
              editContent={
                <select value={formData.gender} onChange={(e) => handleChange("gender", e.target.value)}
                  className="w-full px-2 py-1 border border-gray-300 rounded-md text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500">
                  <option>Male</option><option>Female</option><option>Non-binary</option><option>Prefer not to say</option>
                </select>
              } />
            <FieldRow label="Marital Status" value={formData.maritalStatus} isEditing={editingSection === "personal"}
              editContent={
                <select value={formData.maritalStatus} onChange={(e) => handleChange("maritalStatus", e.target.value)}
                  className="w-full px-2 py-1 border border-gray-300 rounded-md text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500">
                  <option>Single</option><option>Married</option><option>Divorced</option><option>Widowed</option>
                </select>
              } />
          </div>
          <div className="sm:pl-6">
            <FieldRow label="Ask me about / Expertise" value={formData.expertise} isEditing={editingSection === "personal"}
              editContent={<InlineInput value={formData.expertise} onChange={(v) => handleChange("expertise", v)} />} />
          </div>
        </div>
      </Section>

      {/* Identity Information */}
      <Section title="Identity Information" {...sp("identity")} readOnly>
        <FieldRow label="UAN" value={<span className="tracking-widest font-mono text-gray-600">{formData.uan ? "••••••••••" : "-"}</span>} isEditing={false} />
        <FieldRow label="PAN" value={<span className="tracking-widest font-mono text-gray-600">{formData.pan ? "••••••••••" : "-"}</span>} isEditing={false} />
        <FieldRow label="Aadhaar" value={<span className="tracking-widest font-mono text-gray-600">{formData.aadhaar ? "••••••••••" : "-"}</span>} isEditing={false} />
      </Section>

      {/* Contact Details */}
      <Section title="Contact Details" {...sp("contact")}>
        <div className="grid grid-cols-1 sm:grid-cols-2">
          <div className="sm:pr-6 sm:border-r sm:border-gray-100">
            <FieldRow label="Work Phone Number" value={formData.workPhone} isEditing={editingSection === "contact"}
              editContent={<InlineInput value={formData.workPhone} onChange={(v) => handleChange("workPhone", v)} />} />
            <FieldRow label="Extension" value={formData.extension} isEditing={editingSection === "contact"}
              editContent={<InlineInput value={formData.extension} onChange={(v) => handleChange("extension", v)} />} />
            <FieldRow label="Seating Location" value={formData.seatingLocation} isEditing={editingSection === "contact"}
              editContent={<InlineInput value={formData.seatingLocation} onChange={(v) => handleChange("seatingLocation", v)} />} />
            <FieldRow label="Tags" value={formData.tags.join(", ") || "-"} isEditing={editingSection === "contact"} />
            <FieldRow label="Present Address" value={formData.presentAddress} isEditing={editingSection === "contact"}
              editContent={<InlineInput value={formData.presentAddress} onChange={(v) => handleChange("presentAddress", v)} />} />
            <FieldRow label="Permanent Address" value={formData.permanentAddress} isEditing={editingSection === "contact"}
              editContent={<InlineInput value={formData.permanentAddress} onChange={(v) => handleChange("permanentAddress", v)} />} />
          </div>
          <div className="sm:pl-6">
            <FieldRow label="Personal Mobile Number" value={formData.phone} isEditing={editingSection === "contact"}
              editContent={<InlineInput value={formData.phone} onChange={(v) => handleChange("phone", v)} />} />
            <FieldRow label="Personal Email Address" value={formData.personalEmail} isEditing={editingSection === "contact"}
              editContent={<InlineInput type="email" value={formData.personalEmail} onChange={(v) => handleChange("personalEmail", v)} />} />
          </div>
        </div>
      </Section>

      {/* Emergency Contact */}
      <Section title="Emergency Contact" {...sp("emergency")}>
        <div className="grid grid-cols-1 sm:grid-cols-2">
          <div className="sm:pr-6 sm:border-r sm:border-gray-100">
            <FieldRow label="Contact Name" value={formData.emergencyContact.name} isEditing={editingSection === "emergency"}
              editContent={<InlineInput value={formData.emergencyContact.name} onChange={(v) => handleChange("emergencyContact", { ...formData.emergencyContact, name: v })} />} />
            <FieldRow label="Relationship" value={formData.emergencyContact.relationship} isEditing={editingSection === "emergency"}
              editContent={<InlineInput value={formData.emergencyContact.relationship} onChange={(v) => handleChange("emergencyContact", { ...formData.emergencyContact, relationship: v })} />} />
          </div>
          <div className="sm:pl-6">
            <FieldRow label="Phone Number" value={formData.emergencyContact.phone} isEditing={editingSection === "emergency"}
              editContent={<InlineInput value={formData.emergencyContact.phone} onChange={(v) => handleChange("emergencyContact", { ...formData.emergencyContact, phone: v })} />} />
          </div>
        </div>
      </Section>

      {/* Work Experience */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-xs overflow-hidden">
        <div className="px-5 py-3 border-b border-gray-100 bg-gray-50/60">
          <h3 className="text-xs font-bold text-blue-600 uppercase tracking-wider">Work Experience</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-[11.5px]">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                {["Company Name", "Job Title", "From Date", "To Date", "Job Description", "Relevant"].map((h) => (
                  <th key={h} className="px-4 py-2.5 text-left font-semibold text-gray-500 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {formData.workExperience.length === 0 ? (
                <tr><td colSpan={6} className="px-4 py-6 text-center text-gray-400 text-xs">No rows found</td></tr>
              ) : formData.workExperience.map((we) => (
                <tr key={we.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                  <td className="px-4 py-2.5 font-medium text-gray-800">{we.companyName}</td>
                  <td className="px-4 py-2.5 text-gray-700">{we.jobTitle}</td>
                  <td className="px-4 py-2.5 text-gray-600">{fmt(we.fromDate)}</td>
                  <td className="px-4 py-2.5 text-gray-600">{we.toDate ? fmt(we.toDate) : "Present"}</td>
                  <td className="px-4 py-2.5 text-gray-600 max-w-xs truncate">{we.jobDescription}</td>
                  <td className="px-4 py-2.5">
                    {we.relevant
                      ? <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">Yes</span>
                      : <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-gray-100 text-gray-500">No</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Education Details */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-xs overflow-hidden">
        <div className="px-5 py-3 border-b border-gray-100 bg-gray-50/60">
          <h3 className="text-xs font-bold text-blue-600 uppercase tracking-wider">Education Details</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-[11.5px]">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                {["Institute Name", "Degree / Diploma", "Specialization", "Date of Completion"].map((h) => (
                  <th key={h} className="px-4 py-2.5 text-left font-semibold text-gray-500 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {formData.educationDetails.length === 0 ? (
                <tr><td colSpan={4} className="px-4 py-6 text-center text-gray-400 text-xs">No rows found</td></tr>
              ) : formData.educationDetails.map((ed) => (
                <tr key={ed.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                  <td className="px-4 py-2.5 font-medium text-gray-800">{ed.instituteName}</td>
                  <td className="px-4 py-2.5 text-gray-700">{ed.degree}</td>
                  <td className="px-4 py-2.5 text-gray-600">{ed.specialization}</td>
                  <td className="px-4 py-2.5 text-gray-600">{fmt(ed.dateOfCompletion)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Dependent Details */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-xs overflow-hidden">
        <div className="px-5 py-3 border-b border-gray-100 bg-gray-50/60">
          <h3 className="text-xs font-bold text-blue-600 uppercase tracking-wider">Dependent Details</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-[11.5px]">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                {["Name", "Relationship", "Date of Birth"].map((h) => (
                  <th key={h} className="px-4 py-2.5 text-left font-semibold text-gray-500 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {formData.dependentDetails.length === 0 ? (
                <tr><td colSpan={3} className="px-4 py-6 text-center text-gray-400 text-xs">No rows found</td></tr>
              ) : formData.dependentDetails.map((dep) => (
                <tr key={dep.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                  <td className="px-4 py-2.5 font-medium text-gray-800">{dep.name}</td>
                  <td className="px-4 py-2.5 text-gray-700">{dep.relationship}</td>
                  <td className="px-4 py-2.5 text-gray-600">{fmt(dep.dateOfBirth)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
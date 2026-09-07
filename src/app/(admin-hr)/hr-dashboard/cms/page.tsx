"use client";

import { useState, useMemo } from "react";
import { useTenant } from "@/context/TenantContext";
import {
  Announcement,
  AnnouncementAudience,
  AnnouncementPriority,
  AnnouncementStatus,
  KnowledgeBaseArticle,
} from "@/lib/types";
import {
  CloseIcon,
  SearchIcon,
  PlusIcon,
  BuildingIcon,
  StarIcon,
  FolderIcon,
} from "@/components/SidebarIcons";
import EmptyState from "@/components/EmptyState";

export default function CMSAuthoringPage() {
  const {
    currentOrg,
    announcements,
    knowledgeBaseCategories,
    knowledgeBaseArticles,
    createAnnouncement,
    updateAnnouncement,
    deleteAnnouncement,
    createArticle,
    updateArticle,
    showToast,
  } = useTenant();

  const [activeSection, setActiveSection] = useState<"announcements" | "handbook">("announcements");

  // Announcements State
  const [announcementSearch, setAnnouncementSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [isAnnModalOpen, setIsAnnModalOpen] = useState(false);
  const [editingAnn, setEditingAnn] = useState<Announcement | null>(null);
  const [previewAnn, setPreviewAnn] = useState<Announcement | null>(null);

  // Announcement Form State
  const [annForm, setAnnForm] = useState({
    title: "",
    summary: "",
    content: "",
    category: "General News" as Announcement["category"],
    audience: "Entire Company" as AnnouncementAudience,
    audienceTargetName: "",
    priority: "Normal" as AnnouncementPriority,
    status: "Published" as AnnouncementStatus,
    publishDate: new Date().toISOString().split("T")[0],
    expiryDate: "",
    featuredImage: "",
    authorName: "Amira Patel",
    authorRole: "HR Operations Director",
  });

  // Knowledge Base State
  const [kbSearch, setKbSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [readingArticle, setReadingArticle] = useState<KnowledgeBaseArticle | null>(null);
  const [isArticleModalOpen, setIsArticleModalOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState<KnowledgeBaseArticle | null>(null);

  // Article Form State
  const [artForm, setArtForm] = useState({
    title: "",
    categoryId: "",
    content: "",
    tags: "policy, compliance, general",
    version: "v1.0",
    status: "Published" as "Draft" | "Published" | "Archived",
    attachmentName: "Handbook_Attachment.pdf",
    attachmentSize: "1.2 MB",
  });

  // Filtered Announcements
  const filteredAnnouncements = useMemo(() => {
    return announcements.filter((ann) => {
      const matchesSearch =
        !announcementSearch ||
        ann.title.toLowerCase().includes(announcementSearch.toLowerCase()) ||
        ann.summary.toLowerCase().includes(announcementSearch.toLowerCase());
      const matchesStatus = statusFilter === "all" || ann.status === statusFilter;
      const matchesPriority = priorityFilter === "all" || ann.priority === priorityFilter;
      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [announcements, announcementSearch, statusFilter, priorityFilter]);

  // Filtered Knowledge Base Articles
  const filteredArticles = useMemo(() => {
    return knowledgeBaseArticles.filter((art) => {
      const matchesSearch =
        !kbSearch ||
        art.title.toLowerCase().includes(kbSearch.toLowerCase()) ||
        art.content.toLowerCase().includes(kbSearch.toLowerCase()) ||
        art.tags.some((t) => t.toLowerCase().includes(kbSearch.toLowerCase()));
      const matchesCategory = selectedCategory === "all" || art.categoryId === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [knowledgeBaseArticles, kbSearch, selectedCategory]);

  // Save Announcement
  const handleSaveAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingAnn) {
      updateAnnouncement(editingAnn.id, annForm);
    } else {
      createAnnouncement(annForm);
    }
    setIsAnnModalOpen(false);
    setEditingAnn(null);
  };

  // Open New Announcement Modal
  const handleOpenNewAnnouncement = () => {
    setEditingAnn(null);
    setAnnForm({
      title: "",
      summary: "",
      content: "",
      category: "Company All-Hands",
      audience: "Entire Company",
      audienceTargetName: "",
      priority: "Normal",
      status: "Published",
      publishDate: new Date().toISOString().split("T")[0],
      expiryDate: "",
      featuredImage: "",
      authorName: "Amira Patel",
      authorRole: "HR Operations Director",
    });
    setIsAnnModalOpen(true);
  };

  // Open Edit Announcement Modal
  const handleOpenEditAnnouncement = (ann: Announcement) => {
    setEditingAnn(ann);
    setAnnForm({
      title: ann.title,
      summary: ann.summary,
      content: ann.content,
      category: ann.category,
      audience: ann.audience,
      audienceTargetName: ann.audienceTargetName || "",
      priority: ann.priority,
      status: ann.status,
      publishDate: ann.publishDate,
      expiryDate: ann.expiryDate || "",
      featuredImage: ann.featuredImage || "",
      authorName: ann.authorName,
      authorRole: ann.authorRole,
    });
    setIsAnnModalOpen(true);
  };

  // Save Article
  const handleSaveArticle = (e: React.FormEvent) => {
    e.preventDefault();
    const cat = knowledgeBaseCategories.find((c) => c.id === artForm.categoryId) || knowledgeBaseCategories[0];
    const tagsArr = artForm.tags.split(",").map((t) => t.trim()).filter(Boolean);

    if (editingArticle) {
      updateArticle(editingArticle.id, {
        title: artForm.title,
        categoryId: cat.id,
        categoryName: cat.name,
        content: artForm.content,
        tags: tagsArr,
        version: artForm.version,
        status: artForm.status,
        attachmentName: artForm.attachmentName,
      });
    } else {
      createArticle({
        title: artForm.title,
        categoryId: cat.id,
        categoryName: cat.name,
        content: artForm.content,
        tags: tagsArr,
        version: artForm.version,
        status: artForm.status,
        attachmentName: artForm.attachmentName,
        attachmentSize: artForm.attachmentSize,
        authorName: "Amira Patel",
      });
    }
    setIsArticleModalOpen(false);
    setEditingArticle(null);
  };

  // Open New Article Modal
  const handleOpenNewArticle = () => {
    setEditingArticle(null);
    setArtForm({
      title: "",
      categoryId: knowledgeBaseCategories[0]?.id || "",
      content: "# Title\n\n### Section 1: Guidelines\nExplain the organization rules clearly.",
      tags: "policy, workplace, guidelines",
      version: "v1.0",
      status: "Published",
      attachmentName: "Policy_Document.pdf",
      attachmentSize: "1.5 MB",
    });
    setIsArticleModalOpen(true);
  };

  return (
    <div className="space-y-6 pb-16 font-sans">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-gray-200/90 shadow-xs flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-[11px] font-bold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              {currentOrg.name} CMS Authoring Studio
            </span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mt-1.5 tracking-tight">
            Company Bulletins & Knowledge Base
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Broadcast targeted news and publish internal company policies, code of conduct, and employee handbooks.
          </p>
        </div>

        <div className="flex items-center space-x-2.5">
          {activeSection === "announcements" ? (
            <button
              type="button"
              onClick={handleOpenNewAnnouncement}
              className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-lg shadow-sm transition"
            >
              <PlusIcon className="w-3.5 h-3.5 mr-1.5 text-white" size={14} />
               New Bulletin
            </button>
          ) : (
            <button
              type="button"
              onClick={handleOpenNewArticle}
              className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-lg shadow-sm transition"
            >
              <PlusIcon className="w-3.5 h-3.5 mr-1.5 text-white" size={14} />
              + New Article
            </button>
          )}
        </div>
      </div>

      {/* Section Switcher Tabs */}
      <div className="border-b border-gray-200 flex space-x-6 text-xs font-semibold">
        <button
          type="button"
          onClick={() => setActiveSection("announcements")}
          className={`pb-3 border-b-2 transition flex items-center space-x-2 ${
            activeSection === "announcements"
              ? "border-blue-600 text-blue-600 font-bold"
              : "border-transparent text-gray-500 hover:text-gray-800"
          }`}
        >
          <StarIcon className="w-4 h-4" size={16} />
          <span>Company Bulletins & Announcements ({announcements.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSection("handbook")}
          className={`pb-3 border-b-2 transition flex items-center space-x-2 ${
            activeSection === "handbook"
              ? "border-blue-600 text-blue-600 font-bold"
              : "border-transparent text-gray-500 hover:text-gray-800"
          }`}
        >
          <BuildingIcon className="w-4 h-4" size={16} />
          <span>Employee Handbook / Knowledge Base ({knowledgeBaseArticles.length})</span>
        </button>
      </div>

      {/* SECTION 1: ANNOUNCEMENTS */}
      {activeSection === "announcements" && (
        <div className="space-y-4">
          {/* Filter Bar */}
          <div className="bg-white p-4 rounded-xl border border-gray-200/90 shadow-xs flex flex-col sm:flex-row gap-3 text-xs">
            <div className="relative flex-1">
              <SearchIcon className="w-4 h-4 text-gray-400 absolute left-3 top-2.5 pointer-events-none" />
              <input
                type="text"
                placeholder="Search bulletins by headline or summary..."
                value={announcementSearch}
                onChange={(e) => setAnnouncementSearch(e.target.value)}
                className="w-full bg-white pl-9 pr-3 py-1.5 rounded-lg border border-gray-200 text-xs outline-none focus:border-blue-500"
              />
            </div>

            <div className="flex gap-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-white border border-gray-200 rounded-lg p-1.5 text-xs text-gray-700"
              >
                <option value="all">All Statuses</option>
                <option value="Published">Published</option>
                <option value="Draft">Draft</option>
                <option value="Scheduled">Scheduled</option>
                <option value="Archived">Archived</option>
              </select>

              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="bg-white border border-gray-200 rounded-lg p-1.5 text-xs text-gray-700"
              >
                <option value="all">All Priorities</option>
                <option value="Normal">Normal</option>
                <option value="Important">Important</option>
                <option value="Urgent">Urgent</option>
              </select>
            </div>
          </div>

          {/* Announcements Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredAnnouncements.map((ann) => (
              <div
                key={ann.id}
                className="bg-white rounded-2xl border border-gray-200/90 shadow-xs hover:border-blue-300 transition overflow-hidden flex flex-col justify-between"
              >
                <div className="p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                        ann.priority === "Urgent"
                          ? "bg-rose-100 text-rose-800"
                          : ann.priority === "Important"
                          ? "bg-amber-100 text-amber-800"
                          : "bg-blue-50 text-blue-700"
                      }`}
                    >
                      {ann.priority} • {ann.category}
                    </span>

                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        ann.status === "Published"
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {ann.status}
                    </span>
                  </div>

                  <h3 className="font-bold text-gray-900 text-sm leading-snug">{ann.title}</h3>

                  <p className="text-gray-600 text-xs line-clamp-3 leading-relaxed">
                    {ann.summary}
                  </p>

                  <div className="pt-2 text-[11px] text-gray-400 space-y-0.5 border-t border-gray-100">
                    <p>Audience: <strong>{ann.audience}</strong></p>
                    <p>Published: {ann.publishDate} by {ann.authorName}</p>
                  </div>
                </div>

                <div className="p-3.5 bg-gray-50/70 border-t border-gray-100 flex items-center justify-between text-xs">
                  <button
                    type="button"
                    onClick={() => setPreviewAnn(ann)}
                    className="text-blue-600 hover:text-blue-800 font-semibold"
                  >
                    Preview Bulletin →
                  </button>

                  <div className="space-x-2">
                    <button
                      type="button"
                      onClick={() => handleOpenEditAnnouncement(ann)}
                      className="text-gray-600 hover:text-gray-900 font-medium"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteAnnouncement(ann.id)}
                      className="text-rose-600 hover:text-rose-800 font-medium"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredAnnouncements.length === 0 && (
            <EmptyState
              title="No bulletins found"
              description="No company announcements matching your search criteria."
              className="border-none shadow-none py-12"
            />
          )}
        </div>
      )}

      {/* SECTION 2: KNOWLEDGE BASE / HANDBOOK */}
      {activeSection === "handbook" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Sidebar Categories (3 cols) */}
          <div className="lg:col-span-3 bg-white p-4 rounded-2xl border border-gray-200/90 shadow-xs space-y-3 text-xs">
            <h3 className="font-bold text-gray-900 uppercase tracking-wider text-[11px]">
              Handbook Categories
            </h3>

            <div className="space-y-1">
              <button
                type="button"
                onClick={() => setSelectedCategory("all")}
                className={`w-full flex items-center justify-between p-2 rounded-lg text-left transition ${
                  selectedCategory === "all"
                    ? "bg-blue-50 text-blue-700 font-bold"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <span>All Articles</span>
                <span className="font-mono text-[11px]">{knowledgeBaseArticles.length}</span>
              </button>

              {knowledgeBaseCategories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`w-full flex items-center justify-between p-2 rounded-lg text-left transition ${
                    selectedCategory === cat.id
                      ? "bg-blue-50 text-blue-700 font-bold"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <span className="truncate">{cat.name}</span>
                  <span className="font-mono text-[11px]">
                    {knowledgeBaseArticles.filter((a) => a.categoryId === cat.id).length}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Articles Grid (9 cols) */}
          <div className="lg:col-span-9 space-y-4">
            <div className="bg-white p-4 rounded-xl border border-gray-200/90 shadow-xs text-xs">
              <div className="relative">
                <SearchIcon className="w-4 h-4 text-gray-400 absolute left-3 top-2.5 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search knowledge base articles, policies, SOC2 tags..."
                  value={kbSearch}
                  onChange={(e) => setKbSearch(e.target.value)}
                  className="w-full bg-white pl-9 pr-3 py-1.5 rounded-lg border border-gray-200 text-xs outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div className="space-y-3">
              {filteredArticles.map((art) => (
                <div
                  key={art.id}
                  className="bg-white p-5 rounded-2xl border border-gray-200/90 shadow-xs hover:border-blue-300 transition space-y-2.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700">
                      {art.categoryName}
                    </span>
                    <span className="text-gray-400 text-[11px] font-mono">
                      Version: {art.version} • {art.viewCount} Views
                    </span>
                  </div>

                  <h3
                    onClick={() => setReadingArticle(art)}
                    className="text-sm font-bold text-gray-900 hover:text-blue-600 transition cursor-pointer leading-snug"
                  >
                    {art.title}
                  </h3>

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {art.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 rounded bg-gray-100 text-gray-600 text-[10.5px]"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>

                  <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
                    <span>Last revised {art.lastUpdated} by {art.authorName}</span>
                    <div className="space-x-3">
                      <button
                        type="button"
                        onClick={() => setReadingArticle(art)}
                        className="text-blue-600 hover:text-blue-800 font-semibold"
                      >
                        Read Article →
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setEditingArticle(art);
                          setArtForm({
                            title: art.title,
                            categoryId: art.categoryId,
                            content: art.content,
                            tags: art.tags.join(", "),
                            version: art.version,
                            status: art.status,
                            attachmentName: art.attachmentName || "",
                            attachmentSize: art.attachmentSize || "",
                          });
                          setIsArticleModalOpen(true);
                        }}
                        className="text-gray-600 hover:text-gray-900"
                      >
                        Edit
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {filteredArticles.length === 0 && (
                <EmptyState
                  title="No articles found"
                  description="No handbook articles matched your search term."
                  className="border-none shadow-none py-12"
                />
              )}
            </div>
          </div>
        </div>
      )}

      {/* MODAL: CREATE / EDIT ANNOUNCEMENT */}
      {isAnnModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden text-xs">
            <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-slate-50/60">
              <h3 className="text-base font-bold text-gray-900">
                {editingAnn ? "Edit Bulletin" : "Publish New Company Bulletin"}
              </h3>
              <button
                type="button"
                onClick={() => setIsAnnModalOpen(false)}
                className="w-7 h-7 rounded bg-gray-100 text-gray-500 flex items-center justify-center cursor-pointer"
              >
                <CloseIcon className="w-3.5 h-3.5" size={14} />
              </button>
            </div>

            <form onSubmit={handleSaveAnnouncement} className="p-6 overflow-y-auto space-y-4">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Headline / Title *</label>
                <input
                  type="text"
                  required
                  value={annForm.title}
                  onChange={(e) => setAnnForm({ ...annForm, title: e.target.value })}
                  placeholder="e.g. Q4 Company All-Hands Townhall"
                  className="w-full rounded-md border border-gray-200 p-2 text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Brief Summary *</label>
                <input
                  type="text"
                  required
                  value={annForm.summary}
                  onChange={(e) => setAnnForm({ ...annForm, summary: e.target.value })}
                  placeholder="Short one-line excerpt for dashboard notification..."
                  className="w-full rounded-md border border-gray-200 p-2 text-xs"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Category</label>
                  <select
                    value={annForm.category}
                    onChange={(e) =>
                      setAnnForm({ ...annForm, category: e.target.value as Announcement["category"] })
                    }
                    className="w-full rounded-md border border-gray-200 p-2 text-xs bg-white"
                  >
                    <option value="Company All-Hands">Company All-Hands</option>
                    <option value="Policy Update">Policy Update</option>
                    <option value="Holiday & Celebration">Holiday & Celebration</option>
                    <option value="Health & Safety">Health & Safety</option>
                    <option value="General News">General News</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Target Audience</label>
                  <select
                    value={annForm.audience}
                    onChange={(e) =>
                      setAnnForm({ ...annForm, audience: e.target.value as AnnouncementAudience })
                    }
                    className="w-full rounded-md border border-gray-200 p-2 text-xs bg-white"
                  >
                    <option value="Entire Company">Entire Company</option>
                    <option value="Department">Department</option>
                    <option value="Team">Team</option>
                    <option value="Selected Employees">Selected Employees</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Priority</label>
                  <select
                    value={annForm.priority}
                    onChange={(e) =>
                      setAnnForm({ ...annForm, priority: e.target.value as AnnouncementPriority })
                    }
                    className="w-full rounded-md border border-gray-200 p-2 text-xs bg-white"
                  >
                    <option value="Normal">Normal</option>
                    <option value="Important">Important</option>
                    <option value="Urgent">Urgent</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Full Announcement Body</label>
                <textarea
                  rows={6}
                  required
                  value={annForm.content}
                  onChange={(e) => setAnnForm({ ...annForm, content: e.target.value })}
                  placeholder="Detailed markdown or text content..."
                  className="w-full rounded-md border border-gray-200 p-2 text-xs font-mono"
                />
              </div>

              <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsAnnModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold"
                >
                  Publish Bulletin Now
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: PREVIEW ANNOUNCEMENT */}
      {previewAnn && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 w-full max-w-xl max-h-[85vh] overflow-y-auto p-6 space-y-4 text-xs">
            <div className="flex justify-between items-start border-b border-gray-100 pb-3">
              <div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800 uppercase">
                  {previewAnn.priority} • {previewAnn.category}
                </span>
                <h3 className="text-lg font-bold text-gray-900 mt-2">{previewAnn.title}</h3>
                <p className="text-gray-400 text-[11px]">
                  Published {previewAnn.publishDate} by {previewAnn.authorName} • Audience: {previewAnn.audience}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setPreviewAnn(null)}
                className="w-7 h-7 rounded bg-gray-100 text-gray-500 flex items-center justify-center"
              >
                <CloseIcon className="w-3.5 h-3.5" size={14} />
              </button>
            </div>

            <div className="prose prose-xs max-w-none text-gray-700 leading-relaxed whitespace-pre-line">
              {previewAnn.content}
            </div>

            <div className="pt-3 border-t border-gray-100 flex justify-end">
              <button
                type="button"
                onClick={() => setPreviewAnn(null)}
                className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 font-semibold"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: ARTICLE READER */}
      {readingArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden text-xs">
            <div className="p-5 border-b border-gray-100 bg-slate-50 flex items-center justify-between">
              <div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800">
                  {readingArticle.categoryName} • Version {readingArticle.version}
                </span>
                <h3 className="text-base font-bold text-gray-900 mt-1">{readingArticle.title}</h3>
              </div>
              <button
                type="button"
                onClick={() => setReadingArticle(null)}
                className="w-7 h-7 rounded bg-gray-100 text-gray-500 flex items-center justify-center"
              >
                <CloseIcon className="w-3.5 h-3.5" size={14} />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 text-xs text-gray-700 leading-relaxed whitespace-pre-line">
              {readingArticle.content}

              {readingArticle.attachmentName && (
                <div className="p-3 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-between mt-4">
                  <div className="flex items-center space-x-2">
                    <FolderIcon className="w-4 h-4 text-blue-600" size={16} />
                    <span className="font-semibold text-gray-900">{readingArticle.attachmentName}</span>
                    <span className="text-gray-400">({readingArticle.attachmentSize})</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => showToast(`Downloaded attachment ${readingArticle.attachmentName}`)}
                    className="text-blue-600 hover:underline font-bold"
                  >
                    Download PDF
                  </button>
                </div>
              )}
            </div>

            <div className="p-4 border-t border-gray-100 flex justify-between items-center bg-gray-50">
              <span className="text-gray-400 text-[11px]">
                Published {readingArticle.publishedDate} • Last revised {readingArticle.lastUpdated}
              </span>
              <button
                type="button"
                onClick={() => setReadingArticle(null)}
                className="px-4 py-1.5 rounded-lg bg-white border border-gray-200 font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: CREATE / EDIT ARTICLE */}
      {isArticleModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden text-xs">
            <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-slate-50/60">
              <h3 className="text-base font-bold text-gray-900">
                {editingArticle ? "Edit Handbook Article" : "Create New Handbook Article"}
              </h3>
              <button
                type="button"
                onClick={() => setIsArticleModalOpen(false)}
                className="w-7 h-7 rounded bg-gray-100 text-gray-500 flex items-center justify-center"
              >
                <CloseIcon className="w-3.5 h-3.5" size={14} />
              </button>
            </div>

            <form onSubmit={handleSaveArticle} className="p-6 overflow-y-auto space-y-4">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Article Title *</label>
                <input
                  type="text"
                  required
                  value={artForm.title}
                  onChange={(e) => setArtForm({ ...artForm, title: e.target.value })}
                  placeholder="e.g. Remote Work Equipment Stipend Policy"
                  className="w-full rounded-md border border-gray-200 p-2 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Category</label>
                  <select
                    value={artForm.categoryId}
                    onChange={(e) => setArtForm({ ...artForm, categoryId: e.target.value })}
                    className="w-full rounded-md border border-gray-200 p-2 bg-white"
                  >
                    {knowledgeBaseCategories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Version</label>
                  <input
                    type="text"
                    value={artForm.version}
                    onChange={(e) => setArtForm({ ...artForm, version: e.target.value })}
                    className="w-full rounded-md border border-gray-200 p-2 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Tags (Comma Separated)</label>
                <input
                  type="text"
                  value={artForm.tags}
                  onChange={(e) => setArtForm({ ...artForm, tags: e.target.value })}
                  placeholder="policy, remote, expenses, it"
                  className="w-full rounded-md border border-gray-200 p-2"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Article Content (Markdown)</label>
                <textarea
                  rows={8}
                  required
                  value={artForm.content}
                  onChange={(e) => setArtForm({ ...artForm, content: e.target.value })}
                  className="w-full rounded-md border border-gray-200 p-2 font-mono text-xs"
                />
              </div>

              <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsArticleModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold"
                >
                  Save & Publish Article
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

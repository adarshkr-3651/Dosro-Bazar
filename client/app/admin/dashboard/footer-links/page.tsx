"use client";

import { useState, useEffect } from "react";
import { 
  FileText, Plus, Edit2, Trash2, Save, Loader2, 
  HelpCircle, ChevronRight, Layers, ArrowUpDown, ArrowLeft
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { toast } from "sonner";
import { 
  getFooterLinksAdminAction, 
  updateFooterLinkAction, 
  deleteFooterLinkAction 
} from "@/app/lib/admin-data-actions";

interface FooterLinkItem {
  _id: string;
  title: string;
  category: string;
  content: string;
  order: number;
  updatedAt?: string;
}

const CATEGORIES = ["About Us", "Help Center", "Terms of Service"];

export default function FooterLinksAdminPage() {
  const [links, setLinks] = useState<FooterLinkItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Form State
  const [editingId, setEditingId] = useState<string | null>(null); // null means new link or none
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formTitle, setFormTitle] = useState("");
  const [formCategory, setFormCategory] = useState("About Us");
  const [formContent, setFormContent] = useState("");
  const [formOrder, setFormOrder] = useState<number>(0);

  // Filter Category Tab
  const [activeTab, setActiveTab] = useState<string>("All");

  const fetchLinks = async () => {
    setLoading(true);
    try {
      const res = await getFooterLinksAdminAction();
      if (res.success) {
        setLinks(res.data || []);
      } else {
        toast.error(res.error || "Failed to load footer links");
      }
    } catch {
      toast.error("An error occurred while fetching footer links");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLinks();
  }, []);

  const handleOpenNewForm = () => {
    setEditingId(null);
    setFormTitle("");
    setFormCategory("About Us");
    setFormContent("");
    setFormOrder(0);
    setIsFormOpen(true);
  };

  const handleEditClick = (link: FooterLinkItem) => {
    setEditingId(link._id);
    setFormTitle(link.title);
    setFormCategory(link.category);
    setFormContent(link.content);
    setFormOrder(link.order);
    setIsFormOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim() || !formContent.trim()) {
      toast.error("Title and Content are required fields.");
      return;
    }

    setSaving(true);
    try {
      const payload = {
        title: formTitle,
        category: formCategory,
        content: formContent,
        order: Number(formOrder)
      };

      const res = await updateFooterLinkAction(editingId, payload);
      if (res.success) {
        toast.success(editingId ? "Link updated successfully" : "Link created successfully");
        setIsFormOpen(false);
        fetchLinks();
      } else {
        toast.error(res.error || "Failed to save link");
      }
    } catch {
      toast.error("Failed to save link");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this footer link? This action is irreversible.")) {
      return;
    }

    setDeletingId(id);
    try {
      const res = await deleteFooterLinkAction(id);
      if (res.success) {
        toast.success("Footer link deleted successfully");
        fetchLinks();
      } else {
        toast.error(res.error || "Failed to delete link");
      }
    } catch {
      toast.error("Failed to delete link");
    } finally {
      setDeletingId(null);
    }
  };

  const filteredLinks = activeTab === "All" 
    ? links 
    : links.filter(link => link.category === activeTab);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-40">
        <Loader2 className="w-12 h-12 text-emerald-600 animate-spin mb-4" />
        <p className="text-slate-400 font-bold uppercase tracking-[0.2em] text-xs">Querying Footer Configuration...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-500">
            Footer <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600">Links Manager</span>
          </h1>
          <p className="text-slate-500 text-lg flex items-center gap-2">
            <Layers className="w-4 h-4 text-emerald-600" /> Manage informational and legal overlay page contents
          </p>
        </div>
        {!isFormOpen && (
          <Button 
            onClick={handleOpenNewForm}
            className="h-12 px-6 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-2xl flex items-center gap-2 shadow-lg transition-all active:scale-95"
          >
            <Plus className="w-5 h-5" />
            Create Footer Page
          </Button>
        )}
      </div>

      {isFormOpen ? (
        /* Edit / Create Form */
        <Card className="bg-white border-slate-200 shadow-sm rounded-3xl overflow-hidden">
          <CardHeader className="bg-slate-50/50 border-b border-slate-100 py-6 px-8 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-xl text-slate-900 flex items-center gap-3">
                <FileText className="w-5 h-5 text-emerald-600" /> {editingId ? "Edit Page Content" : "Create New Overlay Page"}
              </CardTitle>
              <CardDescription className="text-slate-500 font-medium mt-1">
                {editingId ? "Modify details of the selected footer overlay" : "Add a brand new page to the marketplace footer"}
              </CardDescription>
            </div>
            <Button
              variant="ghost"
              onClick={() => setIsFormOpen(false)}
              className="text-slate-500 hover:text-slate-800 flex items-center gap-2 font-semibold"
            >
              <ArrowLeft className="w-4 h-4" /> Back to List
            </Button>
          </CardHeader>
          <CardContent className="p-8">
            <form onSubmit={handleSave} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Title */}
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1">Page / Link Title</Label>
                  <Input 
                    id="title"
                    placeholder="e.g. About Us"
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    className="h-12 bg-slate-50 border-slate-200 focus:border-emerald-500/50 rounded-xl font-bold text-slate-900"
                    required
                  />
                </div>

                {/* Category Column */}
                <div className="space-y-2">
                  <Label htmlFor="category" className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1">Footer Category Column</Label>
                  <select 
                    id="category"
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="h-12 w-full bg-slate-50 border border-slate-200 focus:border-emerald-500/50 rounded-xl px-4 text-sm font-semibold text-slate-900 focus:outline-none"
                  >
                    {CATEGORIES.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                {/* Order */}
                <div className="space-y-2">
                  <Label htmlFor="order" className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1">Display Order (Ascending)</Label>
                  <Input 
                    id="order"
                    type="number"
                    value={formOrder}
                    onChange={(e) => setFormOrder(Number(e.target.value))}
                    className="h-12 bg-slate-50 border-slate-200 focus:border-emerald-500/50 rounded-xl font-semibold text-slate-900"
                    min="0"
                  />
                </div>
              </div>

              {/* Rich Content (HTML or Markdown) */}
              <div className="space-y-2">
                <div className="flex justify-between items-center pl-1">
                  <Label htmlFor="content" className="text-xs font-bold text-slate-500 uppercase tracking-widest">Page Content (HTML/Rich-text)</Label>
                  <span className="text-[10px] text-amber-600 bg-amber-50 px-2 py-0.5 border border-amber-200 rounded font-black uppercase tracking-wider">Supports HTML / Custom Layouts</span>
                </div>
                <textarea 
                  id="content"
                  placeholder="<h1>Heading</h1><p>Write details here...</p>"
                  value={formContent}
                  onChange={(e) => setFormContent(e.target.value)}
                  className="w-full min-h-[350px] p-6 bg-slate-50 border border-slate-200 focus:border-emerald-500/50 rounded-2xl text-slate-900 font-mono text-sm focus:outline-none leading-relaxed"
                  required
                />
                <p className="text-[11px] text-slate-400 italic">
                  Note: For special templates like <strong>Contact Us</strong> or <strong>FAQs</strong>, set the content value to <code>contact_us_form</code> or <code>faqs_accordion</code> to load the interactive frontend modules.
                </p>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t">
                <Button 
                  type="button"
                  variant="ghost"
                  onClick={() => setIsFormOpen(false)}
                  className="h-12 px-6 hover:bg-slate-100 font-semibold rounded-2xl"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit"
                  disabled={saving}
                  className="h-12 px-8 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-2xl flex items-center gap-2 shadow-lg"
                >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  Save Page
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      ) : (
        /* Links List */
        <div className="space-y-6">
          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2 border-b pb-4">
            {["All", ...CATEGORIES].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all border ${
                  activeTab === tab 
                    ? "bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-500/10" 
                    : "bg-white text-slate-500 border-slate-200 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {filteredLinks.length === 0 ? (
            <Card className="p-12 text-center bg-white border-slate-200 rounded-3xl">
              <HelpCircle className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-slate-800">No footer pages found</h3>
              <p className="text-sm text-slate-400 mt-1">There are no custom pages created for the current category filter.</p>
              <Button onClick={handleOpenNewForm} className="mt-4 bg-emerald-600 text-white rounded-xl">
                Add First Page
              </Button>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredLinks.map((link) => (
                <Card 
                  key={link._id} 
                  className="bg-white border-slate-200 shadow-sm rounded-3xl overflow-hidden hover:shadow-md transition-all group flex flex-col justify-between"
                >
                  <CardHeader className="bg-slate-50/50 border-b border-slate-100 p-6 flex flex-row items-start justify-between">
                    <div>
                      <span className="text-[9px] font-black uppercase tracking-wider px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-full">
                        {link.category}
                      </span>
                      <h3 className="font-extrabold text-slate-800 text-base mt-3 flex items-center gap-1.5 group-hover:text-emerald-600 transition-colors">
                        {link.title}
                      </h3>
                    </div>
                    <span className="text-[10px] font-black text-slate-400 border border-slate-200 rounded-lg px-2 py-1 bg-white">
                      Order: {link.order}
                    </span>
                  </CardHeader>
                  <CardContent className="p-6 flex-1 flex flex-col justify-between">
                    <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed mb-6 font-mono bg-slate-50 p-3 rounded-xl border border-slate-100">
                      {link.content}
                    </p>
                    <div className="flex items-center justify-between pt-4 border-t border-slate-50 flex-shrink-0">
                      <span className="text-[10px] text-slate-400 font-medium">
                        Updated: {link.updatedAt ? new Date(link.updatedAt).toLocaleDateString() : "Just now"}
                      </span>
                      <div className="flex gap-2">
                        <Button 
                          onClick={() => handleEditClick(link)}
                          size="icon" 
                          variant="outline" 
                          className="h-8 w-8 rounded-lg text-slate-500 hover:text-slate-800 hover:border-slate-400"
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                        </Button>
                        <Button 
                          onClick={() => handleDelete(link._id)}
                          size="icon" 
                          variant="outline" 
                          disabled={deletingId === link._id}
                          className="h-8 w-8 rounded-lg text-rose-500 hover:bg-rose-50 hover:text-rose-700 hover:border-rose-300"
                        >
                          {deletingId === link._id ? (
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          ) : (
                            <Trash2 className="h-3.5 w-3.5" />
                          )}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

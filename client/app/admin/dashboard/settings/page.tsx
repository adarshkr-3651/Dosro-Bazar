"use client";

import { useState, useEffect } from "react";
import { 
  Settings, User, Shield, Bell, 
  Monitor, Globe, Lock, Info,
  Save, RefreshCw, AlertTriangle,
  Mail, Phone, Clock, Loader2,
  CheckCircle2, Server, Terminal,
  Cpu, Activity
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Switch } from "@/app/components/ui/switch";
import { Separator } from "@/app/components/ui/separator";
import { getAdminProfile } from "@/app/lib/admin-actions";
import { toast } from "sonner";

export default function SettingsPage() {
  const [loading, setLoading] = useState(true);
  const [admin, setAdmin] = useState<any>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      const profile = await getAdminProfile();
      setAdmin(profile);
      setLoading(false);
    };
    fetchProfile();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    // Simulating a save operation for platform settings
    await new Promise(r => setTimeout(r, 1000));
    setSaving(false);
    toast.success("Preferences saved successfully");
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center py-40">
        <Loader2 className="w-12 h-12 text-slate-300 animate-spin mb-4" />
        <p className="text-slate-400 font-bold uppercase tracking-[0.2em] text-xs">Accessing System Configuration...</p>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-500">
            System <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Preferences</span>
          </h1>
          <p className="text-slate-500 text-lg flex items-center gap-2">
            <Settings className="w-4 h-4 text-blue-600" /> Administrative configuration hub
          </p>
        </div>
        <Button 
          onClick={handleSave}
          disabled={saving}
          className="h-12 px-6 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-2xl flex items-center gap-2 shadow-lg transition-all active:scale-95"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Commit Changes
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sidebar Navigation (Visual Only for now) */}
        <div className="space-y-4">
            <Card className="bg-white border-slate-200 shadow-sm rounded-3xl overflow-hidden p-2">
                <div className="space-y-1">
                    {[
                        { icon: User, label: "Admin Profile", active: true },
                        { icon: Bell, label: "Notifications", active: false },
                        { icon: Shield, label: "Security & Access", active: false },
                        { icon: Globe, label: "Localization", active: false },
                        { icon: Info, label: "System Information", active: false },
                    ].map((item) => (
                        <button 
                            key={item.label}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold transition-all ${
                                item.active 
                                ? 'bg-blue-50 text-blue-600 border border-blue-100 shadow-sm' 
                                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                            }`}
                        >
                            <item.icon className={`w-4 h-4 ${item.active ? 'text-blue-600' : 'text-slate-400'}`} />
                            {item.label}
                        </button>
                    ))}
                </div>
            </Card>

            <Card className="bg-emerald-600 text-white p-6 rounded-3xl shadow-xl shadow-emerald-500/20 border-none relative overflow-hidden group">
                <div className="relative z-10 space-y-4">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-100">Server Status</p>
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <Server className="w-5 h-5" />
                            <h3 className="font-bold">Main Node: Active</h3>
                        </div>
                        <p className="text-emerald-100/70 text-xs font-medium">Internal API responding correctly.</p>
                    </div>
                    <div className="pt-2">
                        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-emerald-100 bg-emerald-700/50 w-fit px-3 py-1.5 rounded-lg border border-emerald-500/30">
                            <Activity className="w-3 h-3 animate-pulse" /> Health: 99.9%
                        </div>
                    </div>
                </div>
                <div className="absolute -bottom-6 -right-6 opacity-10 group-hover:scale-110 transition-transform">
                    <Cpu className="w-32 h-32" />
                </div>
            </Card>
        </div>

        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-8">
            {/* Profile Section */}
            <Card className="bg-white border-slate-200 shadow-sm rounded-[2rem] overflow-hidden">
                <CardHeader className="bg-slate-50/50 border-b border-slate-100 py-6 px-8">
                    <CardTitle className="text-lg text-slate-900 flex items-center gap-3">
                        <User className="w-5 h-5 text-blue-600" /> Personal Identity
                    </CardTitle>
                    <CardDescription className="text-slate-500 font-medium italic">Your administrative profile as seen by other moderators.</CardDescription>
                </CardHeader>
                <CardContent className="p-8 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1">Display Name</Label>
                            <Input defaultValue={admin?.username} className="h-12 bg-slate-50 border-slate-200 focus:border-blue-500/50 rounded-xl font-bold" />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1">Primary Email</Label>
                            <Input defaultValue={admin?.email} disabled className="h-12 bg-slate-100 border-slate-200 text-slate-500 rounded-xl cursor-not-allowed italic" />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1">Phone Node</Label>
                            <Input defaultValue={admin?.phone} className="h-12 bg-slate-50 border-slate-200 focus:border-blue-500/50 rounded-xl" />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1">Access Tier</Label>
                            <div className="h-12 px-4 bg-blue-50 text-blue-700 border border-blue-100 rounded-xl flex items-center gap-2 font-black uppercase text-[10px] tracking-widest">
                                <Shield className="w-4 h-4" /> {admin?.role} Level Access
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Platform Controls */}
            <Card className="bg-white border-slate-200 shadow-sm rounded-[2rem] overflow-hidden">
                <CardHeader className="bg-slate-50/50 border-b border-slate-100 py-6 px-8">
                    <CardTitle className="text-lg text-slate-900 flex items-center gap-3">
                        <Monitor className="w-5 h-5 text-emerald-600" /> Platform Modifiers
                    </CardTitle>
                    <CardDescription className="text-slate-500 font-medium italic">Fine-tune how the administrative ecosystem behaves.</CardDescription>
                </CardHeader>
                <CardContent className="p-8 space-y-6">
                    <div className="flex items-center justify-between p-4 hover:bg-slate-50 rounded-2xl transition-colors group">
                        <div className="space-y-0.5">
                            <p className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">Broadcast Notifications</p>
                            <p className="text-xs text-slate-500 font-medium">Receive real-time alerts for critical system events.</p>
                        </div>
                        <Switch defaultChecked />
                    </div>
                    <Separator className="bg-slate-100" />
                    <div className="flex items-center justify-between p-4 hover:bg-slate-50 rounded-2xl transition-colors group">
                        <div className="space-y-0.5">
                            <p className="text-sm font-bold text-slate-900 group-hover:text-amber-600 transition-colors">Maintenance Mode Overlay</p>
                            <p className="text-xs text-slate-500 font-medium italic">Enables a global "Under Maintenance" portal for end-users.</p>
                        </div>
                        <Switch />
                    </div>
                    <Separator className="bg-slate-100" />
                    <div className="flex items-center justify-between p-4 hover:bg-slate-50 rounded-2xl transition-colors group">
                        <div className="space-y-0.5">
                            <p className="text-sm font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">Automatic Cache Purge</p>
                            <p className="text-xs text-slate-500 font-medium">Refresh telemetry data every 15 minutes automatically.</p>
                        </div>
                        <Switch defaultChecked />
                    </div>
                </CardContent>
            </Card>

            {/* Danger Zone */}
            <Card className="bg-rose-50 border-rose-200 shadow-sm rounded-[2rem] overflow-hidden border">
                <CardHeader className="py-6 px-8 border-b border-rose-200 bg-rose-100/50">
                    <CardTitle className="text-lg text-rose-900 flex items-center gap-3 font-black uppercase tracking-tighter">
                        <AlertTriangle className="w-5 h-5 text-rose-600" /> Danger Zone
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-8 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="space-y-1 text-center md:text-left">
                        <p className="text-sm font-bold text-rose-900">Revoke Platform Session</p>
                        <p className="text-xs text-rose-700/60 font-medium">Logs you out and invalidates all active administrative tokens on this node.</p>
                    </div>
                    <Button variant="outline" className="h-11 px-8 rounded-xl border-rose-300 text-rose-700 hover:bg-rose-500 hover:text-white font-black uppercase tracking-widest text-[10px] transition-all">
                        Invalidate Session
                    </Button>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}

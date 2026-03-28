import { MessageSquare, Calendar, ShieldCheck } from "lucide-react";

export default function AdInquiryPage() {
    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex flex-col gap-2">
                <h1 className="text-4xl font-extrabold tracking-tight text-white flex items-center gap-3">
                    <MessageSquare className="w-10 h-10 text-emerald-500" />
                    Ad Inquiries
                </h1>
                <p className="text-zinc-500 text-lg">Detailed requests from corporate partners for platform advertisement packages.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { label: "New Inquiries", value: "8", icon: MessageSquare, color: "text-blue-500" },
                    { label: "Scheduled Calls", value: "3", icon: Calendar, color: "text-amber-500" },
                    { label: "Converted Deals", value: "24", icon: ShieldCheck, color: "text-emerald-500" },
                ].map((stat) => (
                    <div key={stat.label} className="p-6 rounded-2xl bg-zinc-900/40 border border-zinc-800">
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-zinc-400 font-bold uppercase tracking-widest text-xs">{stat.label}</span>
                            <stat.icon className={`w-5 h-5 ${stat.color}`} />
                        </div>
                        <div className="text-3xl font-black text-white">{stat.value}</div>
                    </div>
                ))}
            </div>

            <div className="h-[400px] border border-dashed border-zinc-800 rounded-3xl flex items-center justify-center">
                <div className="text-center space-y-2">
                    <p className="text-zinc-500 font-bold uppercase tracking-widest text-xs">Side-panel Reserved for Ad Inquiries</p>
                    <p className="text-zinc-700 text-sm">CRM integration and inquiry tracking will be finalized in the next milestone.</p>
                </div>
            </div>
        </div>
    );
}

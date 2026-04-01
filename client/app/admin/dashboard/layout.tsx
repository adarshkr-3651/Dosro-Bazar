import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "../../lib/admin-actions";
import Link from "next/link";
import { 
    LayoutDashboard, Users, Package, Settings, LogOut, ShieldCheck, 
    Search, Bell, Megaphone, UserCheck, MessageSquare, FileText, Store, CreditCard
} from "lucide-react";
import LogoutButton from "../../components/admin/LogoutButton";

export default async function AdminDashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const authenticated = await isAdminAuthenticated();

    if (!authenticated) {
        // Redirect to the new admin login page
        redirect("/admin");
    }

    const navItems = [
        { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
        { label: "Sellers", href: "/admin/dashboard/sellers", icon: Store },
        { label: "Items", href: "/admin/dashboard/items", icon: Package },
        { label: "Users", href: "/admin/dashboard/users", icon: Users },
        { label: "Advertisement", href: "/admin/dashboard/advertisement", icon: Megaphone },
        { label: "Ad Invoices", href: "/admin/dashboard/invoices", icon: CreditCard },
        { label: "Ad Inquiry", href: "/admin/dashboard/ad-inquiry", icon: MessageSquare },
        { label: "Verifications", href: "/admin/dashboard/verifications", icon: UserCheck },
        { label: "Reports", href: "/admin/dashboard/reports", icon: FileText },
        { label: "Settings", href: "/admin/dashboard/settings", icon: Settings },
    ];

    return (
        <div className="flex min-h-screen bg-slate-50 text-slate-600 font-sans selection:bg-emerald-500/30">
            {/* Sidebar */}
            <aside className="w-64 border-r border-slate-200 bg-white flex flex-col sticky top-0 h-screen overflow-y-auto custom-scrollbar shadow-sm">
                <div className="p-6 flex items-center gap-3 border-b border-slate-100 flex-shrink-0">
                    <div className="p-2 bg-emerald-500/5 rounded-lg">
                        <ShieldCheck className="w-6 h-6 text-emerald-600" />
                    </div>
                    <span className="font-bold text-slate-900 tracking-tight">Dosro Bazar Admin</span>
                </div>

                <nav className="flex-1 px-4 py-8 space-y-1">
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-50 hover:text-slate-900 transition-all group"
                        >
                            <item.icon className="w-5 h-5 text-slate-400 group-hover:text-emerald-600 transition-colors" />
                            <span className="font-medium text-sm">{item.label}</span>
                        </Link>
                    ))}
                </nav>

                <div className="p-4 border-t border-slate-100 flex-shrink-0">
                    <LogoutButton />
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0">
                <header className="h-20 border-b border-slate-200 bg-white/80 backdrop-blur-md flex items-center justify-between px-8 sticky top-0 z-10">
                    <div className="flex items-center gap-4 bg-slate-50 px-4 py-2 rounded-xl border border-slate-200 focus-within:border-emerald-500/50 focus-within:bg-white transition-all w-96">
                        <Search className="w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search administration..."
                            className="bg-transparent border-none outline-none text-sm w-full placeholder:text-slate-400 text-slate-900"
                        />
                    </div>

                    <div className="flex items-center gap-6">
                        <button className="relative p-2 text-slate-400 hover:text-slate-900 transition-colors">
                            <Bell className="w-5 h-5" />
                            <span className="absolute top-2 right-2 w-2 h-2 bg-emerald-500 rounded-full border border-white" />
                        </button>
                        <div className="flex items-center gap-3 pl-6 border-l border-slate-200">
                            <div className="text-right">
                                <p className="text-sm font-semibold text-slate-900">System Admin</p>
                                <p className="text-xs text-slate-400">Root Access</p>
                            </div>
                            <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-emerald-600 font-bold">
                                SA
                            </div>
                        </div>
                    </div>
                </header>

                <main className="flex-1 p-8 overflow-y-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}

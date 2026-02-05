import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "../lib/admin-actions";
import Link from "next/link";
import { LayoutDashboard, Users, Package, Settings, LogOut, ShieldCheck, Search, Bell } from "lucide-react";
import LogoutButton from "../components/admin/LogoutButton";

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const authenticated = await isAdminAuthenticated();

    if (!authenticated) {
        redirect("/adminlogin");
    }

    const navItems = [
        { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
        { label: "Users", href: "/admin/users", icon: Users },
        { label: "Items", href: "/admin/items", icon: Package },
        { label: "Settings", href: "/admin/settings", icon: Settings },
    ];

    return (
        <div className="flex min-h-screen bg-zinc-950 text-zinc-300 font-sans selection:bg-emerald-500/30">
            {/* Sidebar */}
            <aside className="w-64 border-r border-zinc-900 bg-zinc-950 flex flex-col sticky top-0 h-screen">
                <div className="p-6 flex items-center gap-3 border-b border-zinc-900/50">
                    <div className="p-2 bg-emerald-500/10 rounded-lg">
                        <ShieldCheck className="w-6 h-6 text-emerald-500" />
                    </div>
                    <span className="font-bold text-white tracking-tight">Remarket Hub Admin</span>
                </div>

                <nav className="flex-1 px-4 py-8 space-y-2">
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-zinc-900 hover:text-white transition-all group"
                        >
                            <item.icon className="w-5 h-5 text-zinc-500 group-hover:text-emerald-500 transition-colors" />
                            <span className="font-medium">{item.label}</span>
                        </Link>
                    ))}
                </nav>

                <div className="p-4 border-t border-zinc-900/50">
                    <LogoutButton />
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0">
                <header className="h-20 border-b border-zinc-900/50 bg-zinc-950/50 backdrop-blur-md flex items-center justify-between px-8 sticky top-0 z-10">
                    <div className="flex items-center gap-4 bg-zinc-900/50 px-4 py-2 rounded-xl border border-zinc-800 focus-within:border-emerald-500/50 transition-all w-96">
                        <Search className="w-4 h-4 text-zinc-500" />
                        <input
                            type="text"
                            placeholder="Search administration..."
                            className="bg-transparent border-none outline-none text-sm w-full placeholder:text-zinc-600"
                        />
                    </div>

                    <div className="flex items-center gap-6">
                        <button className="relative p-2 text-zinc-500 hover:text-white transition-colors">
                            <Bell className="w-5 h-5" />
                            <span className="absolute top-2 right-2 w-2 h-2 bg-emerald-500 rounded-full border border-zinc-950" />
                        </button>
                        <div className="flex items-center gap-3 pl-6 border-l border-zinc-900/50">
                            <div className="text-right">
                                <p className="text-sm font-semibold text-white">System Admin</p>
                                <p className="text-xs text-zinc-500">Root Access</p>
                            </div>
                            <div className="w-10 h-10 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center text-emerald-500 font-bold">
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

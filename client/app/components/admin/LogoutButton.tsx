"use client";

import { logoutAdmin } from "../../lib/admin-actions";
import { LogOut } from "lucide-react";

export default function LogoutButton() {
    return (
        <button
            onClick={async () => {
                await logoutAdmin();
            }}
            className="flex w-full items-center gap-3 px-4 py-3 rounded-xl hover:bg-zinc-900 hover:text-white text-zinc-500 transition-all font-medium"
        >
            <LogOut className="w-5 h-5" />
            Sign Out
        </button>
    );
}

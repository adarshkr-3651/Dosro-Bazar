"use server";

// NOTE: All actions in this file are Server Actions that proxy requests to the
// backend Node/Express API using the admin token from the server-side cookie store.

import { cookies } from "next/headers";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://127.0.0.1:5000";

async function getAdminCookieHeader() {
    const cookieStore = await cookies();
    const adminToken = cookieStore.get("admin_access_token")?.value;
    const userToken = cookieStore.get("accessToken")?.value;
    const parts: string[] = [];
    if (adminToken) parts.push(`admin_access_token=${adminToken}`);
    if (userToken) parts.push(`accessToken=${userToken}`);
    return parts.join("; ");
}

// ── USERS ────────────────────────────────────────────────────────────────────

export async function getUsersAction(page = 1, search = "") {
    const cookieHeader = await getAdminCookieHeader();
    try {
        const params = new URLSearchParams({ page: String(page), limit: "12", search });
        const res = await fetch(`${BACKEND_URL}/admin/users?${params}`, {
            headers: { Cookie: cookieHeader },
            cache: "no-store",
        });
        if (!res.ok) throw new Error(`Server returned ${res.status}`);
        return await res.json();
    } catch (error: any) { return { success: false, error: error.message || "Failed to fetch users" }; }
}

export async function getUserStatsAction() {
    const cookieHeader = await getAdminCookieHeader();
    try {
        const res = await fetch(`${BACKEND_URL}/admin/users/stats`, {
            headers: { Cookie: cookieHeader },
            cache: "no-store",
        });
        if (!res.ok) throw new Error(`Server returned ${res.status}`);
        return await res.json();
    } catch (error: any) { return { success: false, error: error.message }; }
}

export async function deleteUserAction(id: string) {
    const cookieHeader = await getAdminCookieHeader();
    try {
        const res = await fetch(`${BACKEND_URL}/admin/users/${id}`, {
            method: "DELETE",
            headers: { Cookie: cookieHeader },
        });
        return await res.json();
    } catch { return { success: false, error: "Failed to delete user" }; }
}

export async function updateUserAction(id: string, data: Record<string, string>) {
    const cookieHeader = await getAdminCookieHeader();
    try {
        const res = await fetch(`${BACKEND_URL}/admin/users/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json", Cookie: cookieHeader },
            body: JSON.stringify(data),
        });
        return await res.json();
    } catch { return { success: false, error: "Failed to update user" }; }
}

// ── ITEMS ─────────────────────────────────────────────────────────────────────

export async function getItemsAction(page = 1, search = "", isFlagged = false) {
    const cookieHeader = await getAdminCookieHeader();
    try {
        const params = new URLSearchParams({ page: String(page), limit: "12", search });
        if (isFlagged) params.append("isFlagged", "true");
        const res = await fetch(`${BACKEND_URL}/admin/items?${params}`, {
            headers: { Cookie: cookieHeader },
            cache: "no-store",
        });
        if (!res.ok) {
            const text = await res.text();
            console.error(`[AdminDataActions] getItemsAction failed (${res.status}):`, text.substring(0, 100));
            throw new Error(`Server returned ${res.status}`);
        }
        return await res.json();
    } catch (error: any) { return { success: false, error: error.message || "Failed to fetch items" }; }
}

export async function getItemStatsAction() {
    const cookieHeader = await getAdminCookieHeader();
    try {
        const res = await fetch(`${BACKEND_URL}/admin/items/stats`, {
            headers: { Cookie: cookieHeader },
            cache: "no-store",
        });
        if (!res.ok) throw new Error(`Server returned ${res.status}`);
        return await res.json();
    } catch (error: any) { return { success: false, error: error.message }; }
}

export async function deleteItemAction(id: string) {
    const cookieHeader = await getAdminCookieHeader();
    try {
        const res = await fetch(`${BACKEND_URL}/admin/items/${id}`, {
            method: "DELETE",
            headers: { Cookie: cookieHeader },
        });
        if (!res.ok) throw new Error(`Server returned ${res.status}`);
        return await res.json();
    } catch (error: any) { return { success: false, error: error.message || "Failed to delete item" }; }
}

export async function approveItemAction(id: string) {
    const cookieHeader = await getAdminCookieHeader();
    try {
        const res = await fetch(`${BACKEND_URL}/admin/items/${id}/approve`, {
            method: "PUT",
            headers: { Cookie: cookieHeader },
        });
        if (!res.ok) {
            const text = await res.text();
            console.error(`[AdminDataActions] approveItemAction failed (${res.status}):`, text.substring(0, 100));
            throw new Error(`Server returned ${res.status}`);
        }
        return await res.json();
    } catch (error: any) { return { success: false, error: error.message || "Failed to approve item" }; }
}

// ── SELLERS (users who have submitted an ID proof, regardless of role) ──────

export async function getSellersAction(page = 1, search = "") {
    const cookieHeader = await getAdminCookieHeader();
    try {
        // Show all users who have submitted an ID proof document (seller candidates)
        // We use hasIdProof=true instead of role=seller because many submitters are
        // still role='buyer' until ALL profile criteria are met automatically.
        const params = new URLSearchParams({ page: String(page), limit: "12", hasIdProof: "true" });
        if (search) params.set("search", search);
        const res = await fetch(`${BACKEND_URL}/admin/users?${params}`, {
            headers: { Cookie: cookieHeader },
            cache: "no-store",
        });
        return await res.json();
    } catch { return { success: false, error: "Failed to fetch sellers" }; }
}

// ── VERIFICATIONS (users with idProof submitted to the platform) ────────────

export async function getVerificationsAction(page = 1, status = "") {
    const cookieHeader = await getAdminCookieHeader();
    try {
        const params = new URLSearchParams({ page: String(page), limit: "12", hasIdProof: "true" });
        // If a specific status tab is selected, filter at the DB level so pagination
        // is accurate. For 'all' tab we only need the hasIdProof filter.
        if (status) params.set("verificationStatus", status);
        const res = await fetch(`${BACKEND_URL}/admin/users?${params}`, {
            headers: { Cookie: cookieHeader },
            cache: "no-store",
        });
        return await res.json();
    } catch { return { success: false, error: "Failed to fetch verifications" }; }
}

// ── AD STATS (for Reports page) ──────────────────────────────────────────────

export async function getAdStatsAction() {
    const cookieHeader = await getAdminCookieHeader();
    try {
        const res = await fetch(`${BACKEND_URL}/advertisements`, {
            headers: { Cookie: cookieHeader },
            cache: "no-store",
        });
        const data = await res.json();
        if (!data.success) return { success: false };
        const ads = data.ads || [];
        return {
            success: true,
            data: {
                total: ads.length,
                running: ads.filter((a: any) => a.status === "running").length,
                stopped: ads.filter((a: any) => a.status === "stopped").length,
                expired: ads.filter((a: any) => a.status === "expired").length,
            },
        };
    } catch { return { success: false }; }
}

export async function updateVerificationAction(id: string, verificationStatus: string) {
    const cookieHeader = await getAdminCookieHeader();
    try {
        const res = await fetch(`${BACKEND_URL}/admin/users/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json", Cookie: cookieHeader },
            body: JSON.stringify({ verificationStatus }),
        });
        return await res.json();
    } catch { return { success: false, error: "Failed to update verification" }; }
}

// ── DASHBOARD ─────────────────────────────────────────────────────────────────

export async function getDashboardAction() {
    const cookieHeader = await getAdminCookieHeader();
    try {
        const res = await fetch(`${BACKEND_URL}/admin/dashboard`, {
            headers: { Cookie: cookieHeader },
            cache: "no-store",
        });
        return await res.json();
    } catch { return { success: false, error: "Failed to fetch dashboard data" }; }
}

// ── SETTINGS ──────────────────────────────────────────────────────────────────

export async function getSettingsAction() {
    const cookieHeader = await getAdminCookieHeader();
    try {
        const res = await fetch(`${BACKEND_URL}/admin/settings`, {
            headers: { Cookie: cookieHeader },
            cache: "no-store",
        });
        
        if (!res.ok) {
            const text = await res.text();
            console.error(`[AdminDataActions] Fetch failed (${res.status}):`, text.substring(0, 100));
            throw new Error(`Server returned ${res.status}`);
        }
        
        const data = await res.json();
        return data;
    } catch (error: any) { 
        console.error("[AdminDataActions] Exception in getSettingsAction:", error);
        return { success: false, error: error.message || "Unknown Fetch Error" }; 
    }
}

export async function updateSettingAction(key: string, value: any) {
    const cookieHeader = await getAdminCookieHeader();
    try {
        const res = await fetch(`${BACKEND_URL}/admin/settings`, {
            method: "PUT",
            headers: { "Content-Type": "application/json", Cookie: cookieHeader },
            body: JSON.stringify({ key, value }),
        });
        
        if (!res.ok) {
            const text = await res.text();
            console.error(`[AdminDataActions] Update failed (${res.status}):`, text.substring(0, 100));
            throw new Error(`Server returned ${res.status}`);
        }
        
        const data = await res.json();
        return data;
    } catch (error: any) { 
        return { success: false, error: error.message || "Failed to update setting" }; 
    }
}

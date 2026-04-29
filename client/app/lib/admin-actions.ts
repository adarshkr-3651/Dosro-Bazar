"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

export async function loginAdmin(formData: FormData) {
    const username = formData.get("username");
    const password = formData.get("password");

    try {
        const response = await fetch(`${BACKEND_URL}/admin-auth/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ username, password }),
        });

        const data = await response.json();

        if (data.success) {
            const cookieStore = await cookies();
            
            // CRITICAL FIX: Server Actions run in Node.js, so 'fetch' does not automatically 
            // send the backend's 'Set-Cookie' header to the user's browser. We have to proxy it manually.
            const setCookieHeader = response.headers.get("set-cookie");
            if (setCookieHeader) {
                const match = setCookieHeader.match(/admin_access_token=([^;]+)/);
                if (match && match[1]) {
                    cookieStore.set("admin_access_token", match[1], {
                        httpOnly: true,
                        secure: process.env.NODE_ENV === "production",
                        maxAge: 60 * 60 * 24, // 1 day
                        path: "/",
                    });
                }
            }
            
            cookieStore.set("admin_session", "authenticated", {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                maxAge: 60 * 60 * 24, // 1 day
                path: "/",
            });

            return { success: true };
        } else {
            return { success: false, error: data.error || data.message || "Authentication failed" };
        }
    } catch (error) {
        console.error("Login Error:", error);
        return { success: false, error: "Unable to connect to administration server" };
    }
}

export async function logoutAdmin() {
    const cookieStore = await cookies();
    cookieStore.delete("admin_session");
    cookieStore.delete("admin_access_token");
    
    try {
        await fetch(`${BACKEND_URL}/admin-auth/logout`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
        });
    } catch (e) {
        console.error("Logout fetch error (ignored):", e);
    }
    
    redirect("/admin");
}

export async function createAdmin(adminData: any) {
    const cookieStore = await cookies();
    const adminToken = cookieStore.get("admin_access_token")?.value;
    const userToken = cookieStore.get("accessToken")?.value;

    const cookiesToPass = [];
    if (adminToken) cookiesToPass.push(`admin_access_token=${adminToken}`);
    if (userToken) cookiesToPass.push(`accessToken=${userToken}`);
    const cookieHeader = cookiesToPass.join("; ");

    try {
        const response = await fetch(`${BACKEND_URL}/admin-auth/create-admin`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Cookie": cookieHeader
            },
            body: JSON.stringify(adminData),
        });

        const data = await response.json();

        if (data.success) {
            return { success: true, message: data.message };
        } else {
            return { success: false, error: data.error || data.message || "Failed to create administrator" };
        }
    } catch (error) {
        console.error("Create Admin Error:", error);
        return { success: false, error: "Unable to connect to administration server" };
    }
}

export async function getAdminProfile() {
    const cookieStore = await cookies();
    const adminToken = cookieStore.get("admin_access_token")?.value;
    const userToken = cookieStore.get("accessToken")?.value;

    const cookiesToPass = [];
    if (adminToken) cookiesToPass.push(`admin_access_token=${adminToken}`);
    if (userToken) cookiesToPass.push(`accessToken=${userToken}`);
    const cookieHeader = cookiesToPass.join("; ");

    try {
        const response = await fetch(`${BACKEND_URL}/admin-auth/me`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Cookie": cookieHeader
            },
        });

        const data = await response.json();
        return data.success ? data.admin : null;
    } catch (error) {
        console.error("Get Profile Error:", error);
        return null;
    }
}

export async function isAdminAuthenticated() {
    const cookieStore = await cookies();
    return cookieStore.get("admin_session")?.value === "authenticated";
}

export async function getAdBookings() {
    const cookieStore = await cookies();
    const adminToken = cookieStore.get("admin_access_token")?.value;
    const userToken = cookieStore.get("accessToken")?.value;

    const cookiesToPass = [];
    if (adminToken) cookiesToPass.push(`admin_access_token=${adminToken}`);
    if (userToken) cookiesToPass.push(`accessToken=${userToken}`);
    const cookieHeader = cookiesToPass.join("; ");

    try {
        const response = await fetch(`${BACKEND_URL}/advertisements/bookings/all`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Cookie": cookieHeader
            },
        });

        const data = await response.json();
        return data.success ? data.bookings : [];
    } catch (error) {
        console.error("Get Ad Bookings Error:", error);
        return [];
    }
}

export async function getAdvanceBookingsAction() {
    const cookieStore = await cookies();
    const adminToken = cookieStore.get("admin_access_token")?.value;
    const userToken = cookieStore.get("accessToken")?.value;

    const cookiesToPass = [];
    if (adminToken) cookiesToPass.push(`admin_access_token=${adminToken}`);
    if (userToken) cookiesToPass.push(`accessToken=${userToken}`);
    const cookieHeader = cookiesToPass.join("; ");

    try {
        const response = await fetch(`${BACKEND_URL}/admin/advance-bookings`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Cookie": cookieHeader
            },
        });

        const data = await response.json();
        return data.success ? { success: true, data: data.data } : { success: false, error: data.message };
    } catch (error) {
        console.error("Get Advance Bookings Error:", error);
        return { success: false, error: "Connection error" };
    }
}

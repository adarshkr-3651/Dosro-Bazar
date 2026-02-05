"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function loginAdmin(formData: FormData) {
    const username = formData.get("username");
    const password = formData.get("password");

    const envUsername = process.env.ADMIN_USERNAME || "admin";
    const envPassword = process.env.ADMIN_PASSWORD || "adminpassword123";

    if (username === envUsername && password === envPassword) {
        const cookieStore = await cookies();
        cookieStore.set("admin_session", "authenticated", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 60 * 60 * 24, // 1 day
            path: "/",
        });
        return { success: true };
    }

    return { success: false, error: "Invalid credentials" };
}

export async function logoutAdmin() {
    const cookieStore = await cookies();
    cookieStore.delete("admin_session");
    redirect("/adminlogin");
}

export async function isAdminAuthenticated() {
    const cookieStore = await cookies();
    return cookieStore.get("admin_session")?.value === "authenticated";
}

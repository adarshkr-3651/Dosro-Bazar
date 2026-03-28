"use server";

import { cookies } from "next/headers";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

export async function createAdAction(formData: FormData) {
    const cookieStore = await cookies();
    const adminToken = cookieStore.get("admin_access_token")?.value;
    const userToken = cookieStore.get("accessToken")?.value;

    const cookiesToPass = [];
    if (adminToken) cookiesToPass.push(`admin_access_token=${adminToken}`);
    if (userToken) cookiesToPass.push(`accessToken=${userToken}`);
    const cookieHeader = cookiesToPass.join("; ");

    try {
        const response = await fetch(`${BACKEND_URL}/advertisements/create`, {
            method: "POST",
            headers: {
                "Cookie": cookieHeader
            },
            body: formData,
        });

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Create Ad Error:", error);
        return { success: false, error: "Failed to connect to ad server" };
    }
}

export async function getAllAdsAction() {
    const cookieStore = await cookies();
    const adminToken = cookieStore.get("admin_access_token")?.value;
    const userToken = cookieStore.get("accessToken")?.value;

    const cookiesToPass = [];
    if (adminToken) cookiesToPass.push(`admin_access_token=${adminToken}`);
    if (userToken) cookiesToPass.push(`accessToken=${userToken}`);
    const cookieHeader = cookiesToPass.join("; ");

    try {
        const response = await fetch(`${BACKEND_URL}/advertisements`, {
            method: "GET",
            headers: {
                "Cookie": cookieHeader
            },
            cache: "no-store"
        });

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Get Ads Error:", error);
        return { success: false, ads: [] };
    }
}

export async function updateAdStatusAction(id: string, status: string) {
    const cookieStore = await cookies();
    const adminToken = cookieStore.get("admin_access_token")?.value;
    const userToken = cookieStore.get("accessToken")?.value;

    const cookiesToPass = [];
    if (adminToken) cookiesToPass.push(`admin_access_token=${adminToken}`);
    if (userToken) cookiesToPass.push(`accessToken=${userToken}`);
    const cookieHeader = cookiesToPass.join("; ");

    try {
        const response = await fetch(`${BACKEND_URL}/advertisements/${id}/status`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Cookie": cookieHeader
            },
            body: JSON.stringify({ status }),
        });

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Update Status Error:", error);
        return { success: false, error: "Failed to update ad status" };
    }
}

export async function deleteAdAction(id: string) {
    const cookieStore = await cookies();
    const adminToken = cookieStore.get("admin_access_token")?.value;
    const userToken = cookieStore.get("accessToken")?.value;

    let cookieHeader = "";
    if (adminToken) cookieHeader += `admin_access_token=${adminToken}; `;
    if (userToken) cookieHeader += `accessToken=${userToken}; `;

    try {
        const response = await fetch(`${BACKEND_URL}/advertisements/${id}`, {
            method: "DELETE",
            headers: {
                "Cookie": cookieHeader
            }
        });

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Delete Ad Error:", error);
        return { success: false, error: "Failed to delete advertisement" };
    }
}

export async function submitAdEnquiryAction(id: string, enquiryData: { name?: string, email?: string, phone?: string, message?: string }) {
    try {
        const response = await fetch(`${BACKEND_URL}/advertisements/${id}/enquire`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(enquiryData),
        });

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Submit Enquiry Error:", error);
        return { success: false, error: "Failed to submit inquiry to server" };
    }
}

export async function editAdAction(id: string, formData: FormData) {
    const cookieStore = await cookies();
    const adminToken = cookieStore.get("admin_access_token")?.value;
    const userToken = cookieStore.get("accessToken")?.value;

    const cookiesToPass = [];
    if (adminToken) cookiesToPass.push(`admin_access_token=${adminToken}`);
    if (userToken) cookiesToPass.push(`accessToken=${userToken}`);
    const cookieHeader = cookiesToPass.join("; ");

    try {
        const response = await fetch(`${BACKEND_URL}/advertisements/${id}`, {
            method: "PUT",
            headers: {
                "Cookie": cookieHeader
            },
            body: formData,
        });

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Edit Ad Error:", error);
        return { success: false, error: "Failed to connect to ad server for editing." };
    }
}

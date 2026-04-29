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

export async function getAllAdsAction(status?: string) {
    const cookieStore = await cookies();
    const adminToken = cookieStore.get("admin_access_token")?.value;
    const userToken = cookieStore.get("accessToken")?.value;

    const cookiesToPass = [];
    if (adminToken) cookiesToPass.push(`admin_access_token=${adminToken}`);
    if (userToken) cookiesToPass.push(`accessToken=${userToken}`);
    const cookieHeader = cookiesToPass.join("; ");

    try {
        const url = status 
            ? `${BACKEND_URL}/advertisements?status=${status}`
            : `${BACKEND_URL}/advertisements`;

        const response = await fetch(url, {
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
export async function submitAdminAdInquiryAction(enquiryData: { name: string, email: string, phone: string, message: string }) {
    try {
        const response = await fetch(`${BACKEND_URL}/advertisements/inquiry/admin`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(enquiryData),
        });

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Submit Admin Inquiry Error:", error);
        return { success: false, error: "Failed to connect to server" };
    }
}

export async function getAdminAdInquiriesAction() {
    const cookieStore = await cookies();
    const adminToken = cookieStore.get("admin_access_token")?.value;

    try {
        const response = await fetch(`${BACKEND_URL}/advertisements/inquiries/all`, {
            method: "GET",
            headers: {
                "Cookie": `admin_access_token=${adminToken}`
            },
            cache: "no-store"
        });

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Get Ad Inquiries Error:", error);
        return { success: false, data: [] };
    }
}

export async function updateAdInquiryStatusAction(id: string, status: string) {
    const cookieStore = await cookies();
    const adminToken = cookieStore.get("admin_access_token")?.value;

    try {
        const response = await fetch(`${BACKEND_URL}/advertisements/inquiries/${id}/status`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Cookie": `admin_access_token=${adminToken}`
            },
            body: JSON.stringify({ status }),
        });

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Update Inquiry Status Error:", error);
        return { success: false, error: "Failed to update status" };
    }
}

export async function deleteAdInquiryAction(id: string) {
    const cookieStore = await cookies();
    const adminToken = cookieStore.get("admin_access_token")?.value;

    try {
        const response = await fetch(`${BACKEND_URL}/advertisements/inquiries/${id}`, {
            method: "DELETE",
            headers: {
                "Cookie": `admin_access_token=${adminToken}`
            }
        });

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Delete Inquiry Error:", error);
        return { success: false, error: "Failed to delete inquiry" };
    }
}

export async function initiateAdBookingAction(formData: FormData) {
    try {
        const response = await fetch(`${BACKEND_URL}/advertisements/book`, {
            method: "POST",
            body: formData, // Send FormData directly for multer to handle image
        });

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Initiate Ad Booking Error:", error);
        return { success: false, error: "Failed to connect to server" };
    }
}

export async function verifyKhaltiPaymentAction(pidx: string, amount: number, purchase_order_id: string) {
    try {
        const response = await fetch(`${BACKEND_URL}/advertisements/payment/khalti/verify`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ pidx, amount, purchase_order_id }),
        });

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Verify Khalti Error:", error);
        return { success: false, error: "Failed to verify Khalti payment" };
    }
}
export async function getSettingsAction() {
    const cookieStore = await cookies();
    const adminToken = cookieStore.get("admin_access_token")?.value;

    try {
        const response = await fetch(`${BACKEND_URL}/advertisements/settings`, {
            method: "GET",
            headers: {
                "Cookie": `admin_access_token=${adminToken}`
            },
            cache: "no-store"
        });

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Get Settings Error:", error);
        return { success: false, data: [] };
    }
}

export async function updateSettingAction(key: string, value: any) {
    const cookieStore = await cookies();
    const adminToken = cookieStore.get("admin_access_token")?.value;

    try {
        const response = await fetch(`${BACKEND_URL}/advertisements/settings`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Cookie": `admin_access_token=${adminToken}`
            },
            body: JSON.stringify({ key, value }),
        });

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Update Setting Error:", error);
        return { success: false, error: "Failed to update setting" };
    }
}

export async function getAllBoostsAction() {
    const cookieStore = await cookies();
    const adminToken = cookieStore.get("admin_access_token")?.value;

    try {
        const response = await fetch(`${BACKEND_URL}/admin/boosts`, {
            method: "GET",
            headers: {
                "Cookie": `admin_access_token=${adminToken}`
            },
            cache: "no-store"
        });

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Get Boosts Error:", error);
        return { success: false, data: [] };
    }
}

export async function deleteBoostAction(id: string) {
    const cookieStore = await cookies();
    const adminToken = cookieStore.get("admin_access_token")?.value;

    try {
        const response = await fetch(`${BACKEND_URL}/admin/boosts/${id}`, {
            method: "DELETE",
            headers: {
                "Cookie": `admin_access_token=${adminToken}`
            }
        });

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Delete Boost Error:", error);
        return { success: false, error: "Failed to delete boost" };
    }
}

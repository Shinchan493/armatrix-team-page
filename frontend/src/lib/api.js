/**
 * API helper for talking to the FastAPI backend.
 *
 * NEXT_PUBLIC_API_URL is read at build time from .env.local (dev)
 * or Vercel environment variables (production).
 */

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export async function fetchTeamMembers() {
    const res = await fetch(`${API_BASE}/api/team/`, { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to fetch team members");
    return res.json();
}

export async function fetchTeamMember(id) {
    const res = await fetch(`${API_BASE}/api/team/${id}`, { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to fetch team member");
    return res.json();
}

export async function createTeamMember(data) {
    const res = await fetch(`${API_BASE}/api/team/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || "Failed to create member");
    }
    return res.json();
}

export async function updateTeamMember(id, data) {
    const res = await fetch(`${API_BASE}/api/team/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || "Failed to update member");
    }
    return res.json();
}

export async function deleteTeamMember(id) {
    const res = await fetch(`${API_BASE}/api/team/${id}`, {
        method: "DELETE",
    });
    if (!res.ok) throw new Error("Failed to delete member");
    return res.json();
}

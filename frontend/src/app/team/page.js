"use client";

import { useState, useEffect, useCallback } from "react";
import { fetchTeamMembers } from "@/lib/api";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import TeamGrid from "@/components/TeamGrid";
import TeamModal from "@/components/TeamModal";
import AdminPanel from "@/components/AdminPanel";
import Footer from "@/components/Footer";

export default function TeamPage() {
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedMember, setSelectedMember] = useState(null);

    const loadMembers = useCallback(async () => {
        try {
            setLoading(true);
            const data = await fetchTeamMembers();
            setMembers(data);
            setError(null);
        } catch (err) {
            setError("Failed to load team members. Is the backend running?");
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadMembers();
    }, [loadMembers]);

    return (
        <>
            <Navbar />
            <main>
                <HeroSection />

                {loading ? (
                    <div style={{
                        textAlign: "center",
                        padding: "80px 40px",
                        color: "var(--text-tertiary)",
                    }}>
                        <div style={{
                            width: "40px",
                            height: "40px",
                            border: "3px solid var(--border-subtle)",
                            borderTopColor: "var(--accent-cyan)",
                            borderRadius: "50%",
                            animation: "spin 0.8s linear infinite",
                            margin: "0 auto 16px",
                        }} />
                        Loading team...
                        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                    </div>
                ) : error ? (
                    <div style={{
                        textAlign: "center",
                        padding: "80px 40px",
                        color: "#ff4d4d",
                    }}>
                        <p>{error}</p>
                        <button
                            onClick={loadMembers}
                            style={{
                                marginTop: "16px",
                                padding: "10px 24px",
                                border: "1px solid rgba(255,77,77,0.3)",
                                borderRadius: "12px",
                                color: "#ff4d4d",
                                background: "transparent",
                                cursor: "pointer",
                            }}
                        >
                            Retry
                        </button>
                    </div>
                ) : (
                    <TeamGrid
                        members={members}
                        onCardClick={(member) => setSelectedMember(member)}
                    />
                )}

                <AdminPanel members={members} onMembersChange={loadMembers} />
            </main>

            <Footer />

            {selectedMember && (
                <TeamModal
                    member={selectedMember}
                    onClose={() => setSelectedMember(null)}
                />
            )}
        </>
    );
}

"use client";

import { useState } from "react";
import { createTeamMember, updateTeamMember, deleteTeamMember } from "@/lib/api";
import styles from "./AdminPanel.module.css";

const EMPTY_FORM = {
    name: "",
    role: "",
    bio: "",
    photo_url: "",
    linkedin_url: "",
    github_url: "",
};

export default function AdminPanel({ members, onMembersChange }) {
    const [isOpen, setIsOpen] = useState(false);
    const [form, setForm] = useState(EMPTY_FORM);
    const [editingId, setEditingId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const resetForm = () => {
        setForm(EMPTY_FORM);
        setEditingId(null);
        setError("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setSuccess("");

        // Auto-generate photo_url if left empty
        const data = {
            ...form,
            photo_url:
                form.photo_url ||
                `https://api.dicebear.com/7.x/notionists/svg?seed=${encodeURIComponent(form.name)}&backgroundColor=transparent`,
            linkedin_url: form.linkedin_url || null,
            github_url: form.github_url || null,
        };

        try {
            if (editingId) {
                await updateTeamMember(editingId, data);
                setSuccess(`Updated ${data.name}!`);
            } else {
                await createTeamMember(data);
                setSuccess(`Added ${data.name}!`);
            }
            resetForm();
            onMembersChange(); // refresh the list
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (member) => {
        setEditingId(member.id);
        setForm({
            name: member.name,
            role: member.role,
            bio: member.bio,
            photo_url: member.photo_url,
            linkedin_url: member.linkedin_url || "",
            github_url: member.github_url || "",
        });
        setError("");
        setSuccess("");
    };

    const handleDelete = async (member) => {
        if (!confirm(`Delete ${member.name}? This cannot be undone.`)) return;
        setLoading(true);
        try {
            await deleteTeamMember(member.id);
            setSuccess(`Deleted ${member.name}`);
            onMembersChange();
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className={styles.section}>
            <div className={styles.header}>
                <p className={styles.eyebrow}>Internal tools</p>
                <h3 className={styles.title}>Manage team members</h3>
            </div>

            <button
                className={styles.toggle}
                onClick={() => setIsOpen(!isOpen)}
            >
                <span className={styles.toggleIcon}>{isOpen ? "−" : "+"}</span>
                <span>{isOpen ? "Hide team management" : "Open team management"}</span>
            </button>

            {isOpen && (
                <div className={styles.panel}>
                    {/* Form */}
                    <form className={styles.form} onSubmit={handleSubmit}>
                        <h3 className={styles.formTitle}>
                            {editingId ? "Edit Member" : "Add New Member"}
                        </h3>

                        <div className={styles.formGrid}>
                            <div className={styles.field}>
                                <label htmlFor="admin-name">Name *</label>
                                <input
                                    id="admin-name"
                                    name="name"
                                    value={form.name}
                                    onChange={handleChange}
                                    placeholder="Full name"
                                    required
                                />
                            </div>

                            <div className={styles.field}>
                                <label htmlFor="admin-role">Role *</label>
                                <input
                                    id="admin-role"
                                    name="role"
                                    value={form.role}
                                    onChange={handleChange}
                                    placeholder="Job title"
                                    required
                                />
                            </div>

                        </div>

                        <div className={styles.field}>
                            <label htmlFor="admin-bio">Bio *</label>
                            <textarea
                                id="admin-bio"
                                name="bio"
                                value={form.bio}
                                onChange={handleChange}
                                placeholder="Short bio (1-2 sentences)"
                                rows={3}
                                required
                            />
                        </div>

                        <div className={styles.formGrid}>
                            <div className={styles.field}>
                                <label htmlFor="admin-photo">Photo URL</label>
                                <input
                                    id="admin-photo"
                                    name="photo_url"
                                    value={form.photo_url}
                                    onChange={handleChange}
                                    placeholder="Auto-generated if empty"
                                />
                            </div>

                            <div className={styles.field}>
                                <label htmlFor="admin-linkedin">LinkedIn URL</label>
                                <input
                                    id="admin-linkedin"
                                    name="linkedin_url"
                                    value={form.linkedin_url}
                                    onChange={handleChange}
                                    placeholder="https://linkedin.com/in/..."
                                />
                            </div>

                            <div className={styles.field}>
                                <label htmlFor="admin-github">GitHub URL</label>
                                <input
                                    id="admin-github"
                                    name="github_url"
                                    value={form.github_url}
                                    onChange={handleChange}
                                    placeholder="https://github.com/..."
                                />
                            </div>
                        </div>

                        {error && <p className={styles.error}>{error}</p>}
                        {success && <p className={styles.success}>{success}</p>}

                        <div className={styles.actions}>
                            <button type="submit" className={styles.btnPrimary} disabled={loading}>
                                {loading ? "Saving..." : editingId ? "Update Member" : "Add Member"}
                            </button>
                            {editingId && (
                                <button
                                    type="button"
                                    className={styles.btnSecondary}
                                    onClick={resetForm}
                                >
                                    Cancel Edit
                                </button>
                            )}
                        </div>
                    </form>

                    {/* Members list for edit/delete */}
                    <div className={styles.membersList}>
                        <h3 className={styles.formTitle}>Current Members</h3>
                        {members.map((m) => (
                            <div key={m.id} className={styles.memberRow}>
                                <div className={styles.memberInfo}>
                                    <strong>{m.name}</strong>
                                    <span>{m.role}</span>
                                </div>
                                <div className={styles.memberActions}>
                                    <button
                                        className={styles.btnEdit}
                                        onClick={() => handleEdit(m)}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        className={styles.btnDelete}
                                        onClick={() => handleDelete(m)}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </section>
    );
}

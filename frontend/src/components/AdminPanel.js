"use client";

import { useState } from "react";
import { createTeamMember, updateTeamMember, deleteTeamMember } from "@/lib/api";
import styles from "./AdminPanel.module.css";

const EMPTY_FORM = {
    name: "",
    role: "",
    department: "Engineering",
    bio: "",
    photo_url: "",
    linkedin: "",
    twitter: "",
    order: 0,
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
        setForm((prev) => ({
            ...prev,
            [name]: name === "order" ? parseInt(value) || 0 : value,
        }));
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
            linkedin: form.linkedin || null,
            twitter: form.twitter || null,
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
            department: member.department,
            bio: member.bio,
            photo_url: member.photo_url,
            linkedin: member.linkedin || "",
            twitter: member.twitter || "",
            order: member.order || 0,
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
            <button
                className={styles.toggle}
                onClick={() => setIsOpen(!isOpen)}
            >
                <span className={styles.toggleIcon}>{isOpen ? "−" : "+"}</span>
                <span>Admin Panel — Manage Team Members</span>
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

                            <div className={styles.field}>
                                <label htmlFor="admin-dept">Department *</label>
                                <select
                                    id="admin-dept"
                                    name="department"
                                    value={form.department}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="Leadership">Leadership</option>
                                    <option value="Engineering">Engineering</option>
                                    <option value="Design">Design</option>
                                    <option value="Operations">Operations</option>
                                    <option value="Marketing">Marketing</option>
                                </select>
                            </div>

                            <div className={styles.field}>
                                <label htmlFor="admin-order">Display Order</label>
                                <input
                                    id="admin-order"
                                    name="order"
                                    type="number"
                                    value={form.order}
                                    onChange={handleChange}
                                    placeholder="0"
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
                                    name="linkedin"
                                    value={form.linkedin}
                                    onChange={handleChange}
                                    placeholder="https://linkedin.com/in/..."
                                />
                            </div>

                            <div className={styles.field}>
                                <label htmlFor="admin-twitter">Twitter/X Handle</label>
                                <input
                                    id="admin-twitter"
                                    name="twitter"
                                    value={form.twitter}
                                    onChange={handleChange}
                                    placeholder="@handle"
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
                                    <span>{m.role} · {m.department}</span>
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

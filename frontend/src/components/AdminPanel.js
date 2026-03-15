"use client";

import { useState } from "react";
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
} from "@dnd-kit/core";
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    useSortable,
    verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { createTeamMember, updateTeamMember, deleteTeamMember, reorderTeamMembers } from "@/lib/api";
import styles from "./AdminPanel.module.css";

function SortableRow({ member, onEdit, onDelete }) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
        id: member.id,
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
        zIndex: isDragging ? 10 : "auto",
    };

    return (
        <div ref={setNodeRef} style={style} className={styles.memberRow}>
            <button
                className={styles.dragHandle}
                {...attributes}
                {...listeners}
                aria-label="Drag to reorder"
            >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                    <circle cx="5" cy="3" r="1.5" />
                    <circle cx="11" cy="3" r="1.5" />
                    <circle cx="5" cy="8" r="1.5" />
                    <circle cx="11" cy="8" r="1.5" />
                    <circle cx="5" cy="13" r="1.5" />
                    <circle cx="11" cy="13" r="1.5" />
                </svg>
            </button>
            <div className={styles.memberInfo}>
                <strong>{member.name}</strong>
                <span>{member.role}</span>
            </div>
            <div className={styles.memberActions}>
                <button className={styles.btnEdit} onClick={() => onEdit(member)}>
                    Edit
                </button>
                <button className={styles.btnDelete} onClick={() => onDelete(member)}>
                    Delete
                </button>
            </div>
        </div>
    );
}

const EMPTY_FORM = {
    name: "",
    role: "",
    bio: "",
    photo_url: "",
    linkedin_url: "",
    github_url: "",
};

export default function AdminPanel({ members, onMembersChange, onSilentRefresh, setMembers }) {
    const [isOpen, setIsOpen] = useState(false);
    const [form, setForm] = useState(EMPTY_FORM);
    const [editingId, setEditingId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [photoSource, setPhotoSource] = useState("url"); // "url" | "file"
    const [photoFileName, setPhotoFileName] = useState("");
    const [reordering, setReordering] = useState(false);

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    );

    const handleDragEnd = async (event) => {
        const { active, over } = event;
        if (!over || active.id === over.id) return;

        const oldIndex = members.findIndex((m) => m.id === active.id);
        const newIndex = members.findIndex((m) => m.id === over.id);
        const reordered = arrayMove(members, oldIndex, newIndex);

        // Optimistic update — instantly reflect new order in UI
        setMembers(reordered);

        setReordering(true);
        try {
            await reorderTeamMembers(reordered.map((m) => m.id));
        } catch (err) {
            setError("Failed to save new order");
            // Revert on failure
            onSilentRefresh();
        } finally {
            setReordering(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const resetForm = () => {
        setForm(EMPTY_FORM);
        setEditingId(null);
        setError("");
        setPhotoSource("url");
        setPhotoFileName("");
    };

    const handleFileSelect = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (!file.type.startsWith("image/")) {
            setError("Please select an image file.");
            return;
        }
        if (file.size > 5 * 1024 * 1024) {
            setError("Image must be under 5 MB.");
            return;
        }
        setPhotoFileName(file.name);
        const reader = new FileReader();
        reader.onload = () => {
            setForm((prev) => ({ ...prev, photo_url: reader.result }));
        };
        reader.readAsDataURL(file);
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

                        <div className={styles.field}>
                            <label>Photo</label>
                            <div className={styles.photoSourceSelect}>
                                <button
                                    type="button"
                                    className={`${styles.photoSourceOption} ${photoSource === "url" ? styles.active : ""}`}
                                    onClick={() => setPhotoSource("url")}
                                >
                                    Paste URL
                                </button>
                                <button
                                    type="button"
                                    className={`${styles.photoSourceOption} ${photoSource === "file" ? styles.active : ""}`}
                                    onClick={() => setPhotoSource("file")}
                                >
                                    Upload File
                                </button>
                            </div>

                            {photoSource === "url" ? (
                                <input
                                    id="admin-photo"
                                    name="photo_url"
                                    value={form.photo_url}
                                    onChange={handleChange}
                                    placeholder="Auto-generated if empty"
                                />
                            ) : (
                                <div className={styles.fileInputWrapper}>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFileSelect}
                                        className={styles.fileInput}
                                    />
                                    {photoFileName && (
                                        <div className={styles.photoPreview}>
                                            {form.photo_url && (
                                                <img
                                                    src={form.photo_url}
                                                    alt="Preview"
                                                    className={styles.photoPreviewImg}
                                                />
                                            )}
                                            <span className={styles.photoPreviewName}>{photoFileName}</span>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        <div className={styles.formGrid}>
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

                    {/* Members list with drag-and-drop reordering */}
                    <div className={styles.membersList}>
                        <h3 className={styles.formTitle}>
                            Current Members
                            {reordering && <span className={styles.reorderingBadge}>Saving...</span>}
                        </h3>
                        <p className={styles.reorderHint}>Drag to reorder</p>
                        <DndContext
                            sensors={sensors}
                            collisionDetection={closestCenter}
                            onDragEnd={handleDragEnd}
                        >
                            <SortableContext
                                items={members.map((m) => m.id)}
                                strategy={verticalListSortingStrategy}
                            >
                                {members.map((m) => (
                                    <SortableRow
                                        key={m.id}
                                        member={m}
                                        onEdit={handleEdit}
                                        onDelete={handleDelete}
                                    />
                                ))}
                            </SortableContext>
                        </DndContext>
                    </div>
                </div>
            )}
        </section>
    );
}

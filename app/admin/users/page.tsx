"use client";

import { useEffect, useMemo, useState } from "react";
import { FiSearch, FiPlus, FiEdit2, FiTrash2, FiSave } from "react-icons/fi";

type UserRole = "USER" | "ADMIN" | "ANALYST";

type UserStatus = "ACTIVE" | "INACTIVE";

type UserItem = {
  id: string;
  name: string | null;
  email: string;
  role: UserRole;
  status: UserStatus;
  createdAt: string;
  _count: {
    reviews: number;
    bookmarks: number;
  };
};

const emptyForm = {
  name: "",
  email: "",
  password: "",
  role: "USER" as UserRole,
  status: "ACTIVE" as UserStatus,
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserItem[]>([]);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/admin/users", { cache: "no-store" });
      if (!response.ok) throw new Error("Failed to fetch users");
      const data = (await response.json()) as { users: UserItem[] };
      setUsers(data.users ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchUsers();
  }, []);

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const payload: Record<string, string> = {
      name: form.name.trim(),
      email: form.email.trim(),
      password: form.password,
      role: form.role,
      status: form.status,
    };

    if (editingId && !form.password) {
      delete payload.password;
    }
    if (editingId) {
      delete payload.email;
    }

    if (!payload.name || (!editingId && (!payload.email || !payload.password))) {
      setError(editingId ? "Name is required." : "Name, email, and password are required.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        editingId ? `/api/admin/users/${editingId}` : "/api/admin/users",
        {
          method: editingId ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        const { error: message } = (await response.json()) as { error?: string };
        throw new Error(message ?? "Failed to save user");
      }

      resetForm();
      await fetchUsers();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (user: UserItem) => {
    setEditingId(user.id);
    setForm({
      name: user.name ?? "",
      email: user.email,
      password: "",
      role: user.role,
      status: user.status,
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to remove this user?")) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/admin/users/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const { error: message } = (await response.json()) as { error?: string };
        throw new Error(message ?? "Failed to delete user");
      }

      if (editingId === id) {
        resetForm();
      }

      await fetchUsers();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = useMemo(() => {
    const q = search.trim().toLowerCase();
    return users.filter((user) => {
      const matchesQuery = q
        ? `${user.name ?? ""} ${user.email}`.toLowerCase().includes(q)
        : true;
      const matchesRole = roleFilter === "all" || user.role === roleFilter;
      const matchesStatus = statusFilter === "all" || user.status === statusFilter;
      return matchesQuery && matchesRole && matchesStatus;
    });
  }, [users, search, roleFilter, statusFilter]);

  return (
    <div className="admin-page">
      <div className="page-header">
        <h1>User Management</h1>
        <p>Manage system access, roles, and user status.</p>
      </div>

      <div className="admin-controls">
        <div className="search-wrapper">
          <FiSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search users by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select
          className="admin-select"
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
        >
          <option value="all">All roles</option>
          <option value="USER">User</option>
          <option value="ADMIN">Admin</option>
          <option value="ANALYST">Analyst</option>
        </select>
        <select
          className="admin-select"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">All status</option>
          <option value="ACTIVE">Active</option>
          <option value="INACTIVE">Inactive</option>
        </select>
        <button type="button" onClick={resetForm} className="btn-create">
          <FiPlus />
          Add User
        </button>
      </div>

      <form onSubmit={handleSubmit} className="admin-form">
        <h2>
          {editingId ? (
            <>
              <FiEdit2 /> Edit User
            </>
          ) : (
            <>
              <FiPlus /> Create User
            </>
          )}
        </h2>

        <div className="form-grid">
          <div className="form-group">
            <label>Name *</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Email *</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              disabled={Boolean(editingId)}
            />
          </div>
          <div className="form-group">
            <label>{editingId ? "New Password" : "Password *"}</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder={editingId ? "Leave empty to keep" : "Min 6 characters"}
              required={!editingId}
            />
          </div>
          <div className="form-group">
            <label>Role</label>
            <select name="role" value={form.role} onChange={handleChange}>
              <option value="USER">User</option>
              <option value="ADMIN">Admin</option>
              <option value="ANALYST">Analyst</option>
            </select>
          </div>
          <div className="form-group">
            <label>Status</label>
            <select name="status" value={form.status} onChange={handleChange}>
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
            </select>
          </div>
        </div>

        <div className="form-actions">
          {editingId && (
            <button type="button" onClick={resetForm} className="btn-cancel">
              Cancel
            </button>
          )}
          <button type="submit" className="btn-save" disabled={loading}>
            <span className="flex items-center gap-2">
              <FiSave />
              {editingId ? "Update User" : "Save User"}
            </span>
          </button>
        </div>

        {error && <p className="text-sm text-red-400 mt-3">{error}</p>}
      </form>

      <div className="admin-table-wrapper">
        <table>
          <thead>
            <tr>
              <th>User</th>
              <th>Role</th>
              <th>Status</th>
              <th>Activity</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="text-center py-8 opacity-50">
                  Loading users...
                </td>
              </tr>
            ) : filteredUsers.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-8 opacity-50">
                  No users found.
                </td>
              </tr>
            ) : (
              filteredUsers.map((user) => (
                <tr key={user.id}>
                  <td>
                    <div className="user-info">
                      <div className="user-avatar">
                        {user.name?.[0]?.toUpperCase() ?? user.email[0]?.toUpperCase()}
                      </div>
                      <div>
                        <div className="col-name">{user.name ?? "Unnamed"}</div>
                        <div className="meta">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className={`role-badge role-${user.role.toLowerCase()}`}>
                      {user.role}
                    </span>
                  </td>
                  <td>
                    <span
                      className={`badges ${
                        user.status === "ACTIVE" ? "badge-active" : "badge-inactive"
                      }`}
                    >
                      {user.status}
                    </span>
                  </td>
                  <td>
                    <span className="meta">
                      {user._count.reviews} reviews · {user._count.bookmarks} bookmarks
                    </span>
                  </td>
                  <td>{new Date(user.createdAt).toLocaleDateString("uz-UZ")}</td>
                  <td>
                    <div className="action-buttons">
                      <button
                        type="button"
                        onClick={() => handleEdit(user)}
                        className="btn-edit"
                        title="Edit user"
                      >
                        <FiEdit2 />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(user.id)}
                        className="btn-delete"
                        title="Remove user"
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

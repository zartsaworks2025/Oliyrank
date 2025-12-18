"use client";

import { useState } from "react";
import {
    FiSearch,
    FiPlus,
    FiEdit2,
    FiTrash2,
    FiShield,
    FiMail,
    FiUser
} from "react-icons/fi";

type User = {
    id: number;
    name: string;
    email: string;
    role: "Admin" | "Editor" | "Viewer";
    status: "active" | "inactive";
    lastLogin: string;
};

const initialUsers: User[] = [
    {
        id: 1,
        name: "Javohir (Admin)",
        email: "admin@oliyrank.uz",
        role: "Admin",
        status: "active",
        lastLogin: "2 mins ago",
    },
    {
        id: 2,
        name: "Content Manager",
        email: "editor@oliyrank.uz",
        role: "Editor",
        status: "active",
        lastLogin: "1 day ago",
    },
    {
        id: 3,
        name: "Guest Viewer",
        email: "viewer@example.com",
        role: "Viewer",
        status: "inactive",
        lastLogin: "Never",
    },
];

export default function AdminUsersPage() {
    const [users, setUsers] = useState<User[]>(initialUsers);
    const [search, setSearch] = useState("");

    const filteredUsers = users.filter(
        (u) =>
            u.name.toLowerCase().includes(search.toLowerCase()) ||
            u.email.toLowerCase().includes(search.toLowerCase())
    );

    const handleDelete = (id: number) => {
        if (confirm("Are you sure you want to remove this user?")) {
            setUsers(users.filter((u) => u.id !== id));
        }
    };

    const getRoleBadgeClass = (role: string) => {
        switch (role) {
            case "Admin":
                return "role-admin";
            case "Editor":
                return "role-editor";
            default:
                return "role-viewer";
        }
    };

    return (
        <div className="admin-page">
            <div className="page-header">
                <h1>User Management</h1>
                <p>Manage system access, roles, and permissions.</p>
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
                <button className="btn-create">
                    <FiPlus />
                    Add User
                </button>
            </div>

            <div className="admin-table-wrapper">
                <table>
                    <thead>
                        <tr>
                            <th>User</th>
                            <th>Role</th>
                            <th>Status</th>
                            <th>Last Login</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUsers.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="text-center">
                                    No users found.
                                </td>
                            </tr>
                        ) : (
                            filteredUsers.map((user) => (
                                <tr key={user.id}>
                                    <td>
                                        <div className="user-info">
                                            <div className="user-avatar">
                                                <FiUser />
                                            </div>
                                            <div>
                                                <div className="col-name">{user.name}</div>
                                                <div className="meta">
                                                    <FiMail size={10} /> {user.email}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <span
                                            className={`role-badge ${getRoleBadgeClass(user.role)}`}
                                        >
                                            <FiShield className="mr-1" size={10} />
                                            {user.role}
                                        </span>
                                    </td>
                                    <td>
                                        <span
                                            className={`badges ${user.status === "active"
                                                    ? "badge-active"
                                                    : "badge-inactive"
                                                }`}
                                        >
                                            {user.status}
                                        </span>
                                    </td>
                                    <td><span className="meta">{user.lastLogin}</span></td>
                                    <td>
                                        <div className="action-buttons">
                                            <button className="btn-edit" title="Edit Role">
                                                <FiEdit2 />
                                            </button>
                                            <button
                                                className="btn-delete"
                                                onClick={() => handleDelete(user.id)}
                                                title="Remove User"
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

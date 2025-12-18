"use client";

import { useMemo, useState } from "react";
import { FiSearch, FiPlus, FiEdit2, FiTrash2, FiSave, FiX } from "react-icons/fi";

type UniversityStatus = "active" | "inactive";

type University = {
  id: number;
  name: string;
  country: string;
  city: string;
  rank: number;
  score: number;
  status: UniversityStatus;
};

const initialData: University[] = [
  {
    id: 1,
    name: "Toshkent Davlat Universiteti",
    country: "O‘zbekiston",
    city: "Toshkent",
    rank: 1,
    score: 95,
    status: "active",
  },
  {
    id: 2,
    name: "Samarqand Davlat Universiteti",
    country: "O‘zbekiston",
    city: "Samarqand",
    rank: 2,
    score: 90,
    status: "active",
  },
];

export default function AdminUniversitiesPage() {
  const [universities, setUniversities] = useState<University[]>(initialData);
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState({
    name: "",
    country: "",
    city: "",
    rank: "",
    score: "",
    status: "active" as UniversityStatus,
  });

  const resetForm = () => {
    setForm({
      name: "",
      country: "",
      city: "",
      rank: "",
      score: "",
      status: "active",
    });
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const rankNumber = Number(form.rank);
    const scoreNumber = Number(form.score);

    if (!form.name.trim()) return;
    if (Number.isNaN(rankNumber) || Number.isNaN(scoreNumber)) return;

    if (editingId == null) {
      const newUniversity: University = {
        id: Date.now(),
        name: form.name.trim(),
        country: form.country.trim() || "—",
        city: form.city.trim() || "—",
        rank: rankNumber,
        score: scoreNumber,
        status: form.status,
      };

      setUniversities((prev) =>
        [...prev, newUniversity].sort((a, b) => a.rank - b.rank)
      );
    } else {
      setUniversities((prev) =>
        prev
          .map((u) =>
            u.id === editingId
              ? {
                ...u,
                name: form.name.trim(),
                country: form.country.trim() || "—",
                city: form.city.trim() || "—",
                rank: rankNumber,
                score: scoreNumber,
                status: form.status,
              }
              : u
          )
          .sort((a, b) => a.rank - b.rank)
      );
    }

    resetForm();
  };

  const handleEdit = (u: University) => {
    setEditingId(u.id);
    setForm({
      name: u.name,
      country: u.country === "—" ? "" : u.country,
      city: u.city === "—" ? "" : u.city,
      rank: String(u.rank),
      score: String(u.score),
      status: u.status,
    });
  };

  const handleDelete = (id: number) => {
    if (!confirm("Are you sure you want to delete this university?")) return;
    setUniversities((prev) => prev.filter((u) => u.id !== id));
    if (editingId === id) {
      resetForm();
    }
  };

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return [...universities].sort((a, b) => a.rank - b.rank);

    return universities
      .filter(
        (u) =>
          u.name.toLowerCase().includes(q) ||
          u.country.toLowerCase().includes(q) ||
          u.city.toLowerCase().includes(q)
      )
      .sort((a, b) => a.rank - b.rank);
  }, [universities, search]);

  return (
    <div className="admin-page">
      <div className="page-header">
        <h1>University Rankings</h1>
        <p>
          Manage university data, scores, and rankings. Changes are currently
          stored in frontend state only.
        </p>
      </div>

      <div className="admin-controls">
        <div className="search-wrapper">
          <FiSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search universities..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <button type="button" onClick={resetForm} className="btn-create">
          <FiPlus className="text-lg" />
          Add University
        </button>
      </div>

      <form onSubmit={handleSubmit} className="admin-form">
        <h2>
          {editingId ? (
            <>
              <FiEdit2 /> Edit University
            </>
          ) : (
            <>
              <FiPlus /> Add New University
            </>
          )}
        </h2>

        <div className="form-grid">
          <div className="form-group">
            <label>University Name *</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              placeholder="e.g. National University"
            />
          </div>

          <div className="form-group">
            <label>Country</label>
            <input
              type="text"
              name="country"
              value={form.country}
              onChange={handleChange}
              placeholder="e.g. Uzbekistan"
            />
          </div>

          <div className="form-group">
            <label>City</label>
            <input
              type="text"
              name="city"
              value={form.city}
              onChange={handleChange}
              placeholder="e.g. Tashkent"
            />
          </div>

          <div className="form-group">
            <label>Rank Position *</label>
            <input
              type="number"
              name="rank"
              value={form.rank}
              onChange={handleChange}
              min={1}
              required
              placeholder="e.g. 1"
            />
          </div>

          <div className="form-group">
            <label>Score (0-100) *</label>
            <input
              type="number"
              name="score"
              value={form.score}
              onChange={handleChange}
              min={0}
              max={100}
              required
              placeholder="e.g. 95"
            />
          </div>

          <div className="form-group">
            <label>Status</label>
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>

        <div className="form-actions">
          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="btn-cancel"
            >
              Cancel
            </button>
          )}
          <button type="submit" className="btn-save">
            <span className="flex items-center gap-2">
              <FiSave />
              {editingId ? "Update University" : "Save University"}
            </span>
          </button>
        </div>
      </form>

      <div className="admin-table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Rank</th>
              <th>University Name</th>
              <th>Country</th>
              <th>City</th>
              <th>Score</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-8 opacity-50">
                  No universities found matching your search.
                </td>
              </tr>
            ) : (
              filtered.map((u) => (
                <tr key={u.id}>
                  <td className="font-bold text-white">#{u.rank}</td>
                  <td className="col-name">{u.name}</td>
                  <td>{u.country}</td>
                  <td>{u.city}</td>
                  <td className="font-mono">{u.score}</td>
                  <td>
                    <span
                      className={`badges ${u.status === "active" ? "badge-active" : "badge-inactive"
                        }`}
                    >
                      {u.status === "active" ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button
                        type="button"
                        onClick={() => handleEdit(u)}
                        className="btn-edit"
                        title="Edit"
                      >
                        <FiEdit2 />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(u.id)}
                        className="btn-delete"
                        title="Delete"
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

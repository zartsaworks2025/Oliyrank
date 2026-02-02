"use client";

import { useEffect, useMemo, useState } from "react";
import { FiSearch, FiPlus, FiEdit2, FiTrash2, FiSave } from "react-icons/fi";

type InstitutionType = "UNIVERSITY" | "LEARNING_CENTER";

type InstitutionStatus = "ACTIVE" | "INACTIVE";

type Institution = {
  id: number;
  name: string;
  type: InstitutionType;
  status: InstitutionStatus;
  country: string | null;
  city: string | null;
  website: string | null;
};

type Overview = {
  institutions: number;
  activeInstitutions: number;
  users: number;
  pendingReviews: number;
  reviews: number;
  latestPeriod: { name: string; status: string } | null;
};

const emptyForm = {
  name: "",
  type: "UNIVERSITY" as InstitutionType,
  status: "ACTIVE" as InstitutionStatus,
  country: "",
  city: "",
  website: "",
};

export default function AdminInstitutionsPage() {
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [overview, setOverview] = useState<Overview | null>(null);
  const [overviewLoading, setOverviewLoading] = useState(false);

  const fetchOverview = async () => {
    setOverviewLoading(true);
    try {
      const response = await fetch("/api/admin/overview", { cache: "no-store" });
      if (response.ok) {
        const data = (await response.json()) as Overview;
        setOverview(data);
      }
    } finally {
      setOverviewLoading(false);
    }
  };

  const fetchInstitutions = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/admin/institutions", {
        cache: "no-store",
      });
      if (!response.ok) {
        throw new Error("Failed to fetch institutions");
      }
      const data = (await response.json()) as Institution[];
      setInstitutions(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchInstitutions();
    void fetchOverview();
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

    if (!form.name.trim()) return;

    const payload = {
      name: form.name.trim(),
      type: form.type,
      status: form.status,
      country: form.country.trim() || null,
      city: form.city.trim() || null,
      website: form.website.trim() || null,
    };

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        editingId ? `/api/admin/institutions/${editingId}` : "/api/admin/institutions",
        {
          method: editingId ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to save institution");
      }

      resetForm();
      await fetchInstitutions();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (institution: Institution) => {
    setEditingId(institution.id);
    setForm({
      name: institution.name,
      type: institution.type,
      status: institution.status,
      country: institution.country ?? "",
      city: institution.city ?? "",
      website: institution.website ?? "",
    });
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this institution?")) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/admin/institutions/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete institution");
      }

      if (editingId === id) {
        resetForm();
      }

      await fetchInstitutions();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return institutions;

    return institutions.filter((item) =>
      [item.name, item.country ?? "", item.city ?? ""]
        .join(" ")
        .toLowerCase()
        .includes(q)
    );
  }, [institutions, search]);

  return (
    <div className="admin-page">
      <div className="page-header">
        <h1>Institutions</h1>
        <p>Manage universities and learning centers stored in the database.</p>
      </div>

      <div className="admin-stats">
        {overviewLoading ? (
          <div className="admin-stats__loading">Loading overview...</div>
        ) : overview ? (
          <>
            <div className="admin-stat-card">
              <span>Total institutions</span>
              <strong>{overview.institutions}</strong>
            </div>
            <div className="admin-stat-card">
              <span>Active institutions</span>
              <strong>{overview.activeInstitutions}</strong>
            </div>
            <div className="admin-stat-card">
              <span>Users</span>
              <strong>{overview.users}</strong>
            </div>
            <div className="admin-stat-card">
              <span>Pending reviews</span>
              <strong>{overview.pendingReviews}</strong>
            </div>
            <div className="admin-stat-card">
              <span>Latest period</span>
              <strong>{overview.latestPeriod?.name ?? "—"}</strong>
            </div>
          </>
        ) : (
          <div className="admin-stats__loading">Overview unavailable.</div>
        )}
      </div>

      <div className="admin-controls">
        <div className="search-wrapper">
          <FiSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search institutions..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <button type="button" onClick={resetForm} className="btn-create">
          <FiPlus className="text-lg" />
          Add Institution
        </button>
      </div>

      <form onSubmit={handleSubmit} className="admin-form">
        <h2>
          {editingId ? (
            <>
              <FiEdit2 /> Edit Institution
            </>
          ) : (
            <>
              <FiPlus /> Add New Institution
            </>
          )}
        </h2>

        <div className="form-grid">
          <div className="form-group">
            <label>Institution Name *</label>
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
            <label>Type *</label>
            <select name="type" value={form.type} onChange={handleChange}>
              <option value="UNIVERSITY">University</option>
              <option value="LEARNING_CENTER">Learning Center</option>
            </select>
          </div>

          <div className="form-group">
            <label>Status</label>
            <select name="status" value={form.status} onChange={handleChange}>
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
            </select>
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
            <label>Website</label>
            <input
              type="url"
              name="website"
              value={form.website}
              onChange={handleChange}
              placeholder="https://example.uz"
            />
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
              {editingId ? "Update Institution" : "Save Institution"}
            </span>
          </button>
        </div>

        {error && <p className="text-sm text-red-400 mt-3">{error}</p>}
      </form>

      <div className="admin-table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Type</th>
              <th>Country</th>
              <th>City</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="text-center py-8 opacity-50">
                  Loading institutions...
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-8 opacity-50">
                  No institutions found matching your search.
                </td>
              </tr>
            ) : (
              filtered.map((institution) => (
                <tr key={institution.id}>
                  <td className="col-name">{institution.name}</td>
                  <td>{institution.type === "UNIVERSITY" ? "University" : "Learning Center"}</td>
                  <td>{institution.country ?? "—"}</td>
                  <td>{institution.city ?? "—"}</td>
                  <td>
                    <span
                      className={`badges ${
                        institution.status === "ACTIVE" ? "badge-active" : "badge-inactive"
                      }`}
                    >
                      {institution.status === "ACTIVE" ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button
                        type="button"
                        onClick={() => handleEdit(institution)}
                        className="btn-edit"
                        title="Edit"
                      >
                        <FiEdit2 />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(institution.id)}
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

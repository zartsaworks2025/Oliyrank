"use client";

import { useState } from "react";
import { FiSave, FiBell, FiMonitor, FiGlobe, FiCheck } from "react-icons/fi";

const SettingsSection = ({
    title,
    icon: Icon,
    children,
}: {
    title: string;
    icon: React.ElementType;
    children: React.ReactNode;
}) => (
    <div className="settings-section">
        <h2 className="section-title">
            <Icon />
            {title}
        </h2>
        <div className="form-grid">{children}</div>
    </div>
);

export default function AdminSettingsPage() {
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleSave = () => {
        setLoading(true);
        // Simulate API call
        setTimeout(() => {
            setLoading(false);
            setSuccess(true);
            setTimeout(() => setSuccess(false), 3000);
        }, 1000);
    };

    return (
        <div className="admin-page">
            <div className="page-header">
                <h1>Settings</h1>
                <p>Configure global system preferences and defaults.</p>
            </div>

            <div className="settings-container">
                <SettingsSection title="General Settings" icon={FiGlobe}>
                    <div className="form-group">
                        <label>Site Name</label>
                        <input type="text" defaultValue="OliyRank" />
                    </div>
                    <div className="form-group">
                        <label>System Language</label>
                        <select defaultValue="uz">
                            <option value="uz">O‘zbekcha</option>
                            <option value="en">English</option>
                            <option value="ru">Русский</option>
                        </select>
                    </div>
                    <div className="form-group" style={{ gridColumn: "1 / -1" }}>
                        <label>Support Email</label>
                        <input type="email" defaultValue="support@oliyrank.uz" />
                    </div>
                </SettingsSection>

                <SettingsSection title="Appearance" icon={FiMonitor}>
                    <div className="form-group">
                        <label>Interface Theme</label>
                        <select defaultValue="dark" disabled>
                            <option value="dark">Dark (Default)</option>
                            <option value="light">Light</option>
                            <option value="system">System</option>
                        </select>
                        <p className="meta" style={{ marginTop: "0.5rem" }}>
                            Currently locked to Dark theme for Admin Panel.
                        </p>
                    </div>
                    <div className="form-group">
                        <label>Density</label>
                        <select defaultValue="comfortable">
                            <option value="comfortable">Comfortable</option>
                            <option value="compact">Compact</option>
                        </select>
                    </div>
                </SettingsSection>

                <SettingsSection title="Notifications" icon={FiBell}>
                    <div className="form-group">
                        <label className="checkbox-label">
                            <span>Email Alerts</span>
                            <input type="checkbox" defaultChecked />
                        </label>
                        <p className="meta" style={{ paddingLeft: "0.5rem" }}>
                            Receive emails about new university registrations.
                        </p>
                    </div>
                    <div className="form-group">
                        <label className="checkbox-label">
                            <span>Weekly Reports</span>
                            <input type="checkbox" />
                        </label>
                    </div>
                </SettingsSection>

                <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginTop: "2rem", paddingBottom: "3rem" }}>
                    <button
                        onClick={handleSave}
                        disabled={loading}
                        className="btn-primary"
                    >
                        {loading ? (
                            "Saving..."
                        ) : (
                            <>
                                <FiSave /> Save Changes
                            </>
                        )}
                    </button>

                    {success && (
                        <span className="success-message">
                            <FiCheck /> Settings saved successfully!
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
}

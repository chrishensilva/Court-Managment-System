import React, { useState, useEffect } from 'react';
import './Account.css';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';
import API_BASE_URL from './config';

const Account = () => {
    const { user } = useAuth();
    const { toast } = useToast();

    const [profile, setProfile] = useState({
        fullname: '',
        email: '',
        phone: '',
        avatar_url: null,
        role: user?.role || 'User'
    });

    const [passwordForm, setPasswordForm] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const [loginHistory, setLoginHistory] = useState([]);

    // Admin only SMTP
    const [smtp, setSmtp] = useState({
        email: '',
        password: '********'
    });

    // Admin only Subscription
    const [subscription, setSubscription] = useState({
        plan_name: 'Professional',
        renewal_date: '',
        status: 'Active'
    });

    const [preferences, setPreferences] = useState({
        notifications: { caseAssigned: true, reminder: true },
        language: 'English'
    });

    useEffect(() => {
        fetchProfile();
        fetchLoginHistory();
        if (user?.role === 'admin') {
            fetchSMTP();
            fetchSubscription();
        }
    }, [user]);

    const fetchProfile = async () => {
        try {
            const resp = await fetch(`${API_BASE_URL}/getProfile`, {
                credentials: 'include'
            });
            const data = await resp.json();
            if (data) {
                setProfile(prev => ({ ...prev, ...data }));
                if (data.notifications) {
                    try {
                        const notifs = typeof data.notifications === 'string'
                            ? JSON.parse(data.notifications)
                            : data.notifications;
                        setPreferences(prev => ({ ...prev, notifications: notifs, language: data.language || 'English' }));
                    } catch (e) {
                        console.error("Failed to parse notifications", e);
                    }
                }
            }
        } catch (err) {
            console.error("Failed to fetch profile", err);
        }
    };

    const fetchLoginHistory = async () => {
        try {
            const resp = await fetch(`${API_BASE_URL}/getLoginActivity`, {
                credentials: 'include'
            });
            const data = await resp.json();
            if (Array.isArray(data)) {
                setLoginHistory(data);
            }
        } catch (err) {
            console.error("Failed to fetch login history", err);
        }
    };

    const fetchSMTP = async () => {
        try {
            const resp = await fetch(`${API_BASE_URL}/getSMTP`, {
                credentials: 'include'
            });
            const data = await resp.json();
            if (data && !data.error) {
                setSmtp(data);
            }
        } catch (err) {
            console.error("Failed to fetch SMTP", err);
        }
    };

    const fetchSubscription = async () => {
        try {
            const resp = await fetch(`${API_BASE_URL}/getSubscription`, {
                credentials: 'include'
            });
            const data = await resp.json();
            if (data && !data.error) {
                setSubscription(data);
            }
        } catch (err) {
            console.error("Failed to fetch subscription", err);
        }
    };

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        try {
            const resp = await fetch(`${API_BASE_URL}/updateProfile`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(profile)
            });
            const data = await resp.json();
            if (data.status === 'success') {
                toast('Profile updated successfully', 'success');
            } else {
                toast(data.message || 'Error updating profile', 'error');
            }
        } catch (err) {
            toast('Server error', 'error');
        }
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        if (passwordForm.newPassword !== passwordForm.confirmPassword) {
            return toast('Passwords do not match', 'error');
        }
        try {
            const resp = await fetch(`${API_BASE_URL}/changePassword`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(passwordForm)
            });
            const data = await resp.json();
            if (data.status === 'success') {
                toast('Password changed successfully', 'success');
                setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
            } else {
                toast(data.message || 'Error changing password', 'error');
            }
        } catch (err) {
            toast('Server error', 'error');
        }
    };

    const handleSMTPUpdate = async (e) => {
        e.preventDefault();
        try {
            const resp = await fetch(`${API_BASE_URL}/updateSMTP`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(smtp)
            });
            const data = await resp.json();
            if (data.status === 'success') {
                toast('SMTP settings updated', 'success');
            } else {
                toast('Error updating SMTP', 'error');
            }
        } catch (err) {
            toast('Server error', 'error');
        }
    };

    const testSMTP = async () => {
        toast('Testing SMTP connection...', 'info');
        try {
            const resp = await fetch(`${API_BASE_URL}/testSMTP`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(smtp)
            });
            const data = await resp.json();
            if (data.status === 'success') {
                toast('SMTP Test Successful!', 'success');
            } else {
                toast(`SMTP Test Failed: ${data.message}`, 'error');
            }
        } catch (err) {
            toast('Server error', 'error');
        }
    };

    const handlePreferenceUpdate = async (newPrefs) => {
        setPreferences(newPrefs);
        try {
            await fetch(`${API_BASE_URL}/updatePreferences`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(newPrefs)
            });
        } catch (err) {
            console.error("Failed to update preferences", err);
        }
    };

    const handleAvatarChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('avatar', file);

        try {
            const resp = await fetch(`${API_BASE_URL}/uploadAvatar`, {
                method: 'POST',
                credentials: 'include',
                body: formData
            });
            const data = await resp.json();
            if (data.status === 'success') {
                setProfile({ ...profile, avatar_url: data.avatar_url });
                toast('Profile picture updated', 'success');
            } else {
                toast(data.message || 'Upload failed', 'error');
            }
        } catch (err) {
            toast('Server error during upload', 'error');
        }
    };

    return (
        <div className="account-container">
            <div className="account-header">
                <h1>My Account</h1>
                <p>Manage your profile, security, and preferences.</p>
            </div>

            <div className="account-grid">
                {/* Profile Card */}
                <div className="account-card card-1">
                    <div className="card-title">
                        <span className="icon">👤</span> Personal Profile
                    </div>
                    <div className="profile-main">
                        <div className="avatar-wrapper" onClick={() => document.getElementById('avatar-input').click()} style={{ cursor: 'pointer' }}>
                            <img src={profile.avatar_url || 'https://via.placeholder.com/100'} alt="Avatar" className="avatar" />
                            <div className="avatar-overlay">Change</div>
                            <input type="file" id="avatar-input" hidden accept="image/*" onChange={handleAvatarChange} />
                        </div>
                        <div className="role-badge">{profile.role}</div>

                        <form onSubmit={handleProfileUpdate} style={{ width: '100%' }}>
                            <div className="form-group">
                                <label>Full Name</label>
                                <input
                                    type="text"
                                    value={profile.fullname}
                                    onChange={(e) => setProfile({ ...profile, fullname: e.target.value })}
                                    placeholder="Enter full name"
                                />
                            </div>
                            <div className="form-group">
                                <label>Email Address</label>
                                <input
                                    type="email"
                                    value={profile.email}
                                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                                    placeholder="email@example.com"
                                />
                            </div>
                            <div className="form-group">
                                <label>Phone Number</label>
                                <input
                                    type="text"
                                    value={profile.phone}
                                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                                    placeholder="+94 77 123 4567"
                                />
                            </div>
                            <button type="submit" className="btn-primary">Save Changes</button>
                        </form>
                    </div>
                </div>

                {/* Security Card */}
                <div className="account-card card-2">
                    <div className="card-title">
                        <span className="icon">🛡️</span> Security Hub
                    </div>
                    <form onSubmit={handlePasswordChange}>
                        <div className="form-group">
                            <label>Current Password</label>
                            <input
                                type="password"
                                value={passwordForm.currentPassword}
                                onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                                placeholder="••••••••"
                            />
                        </div>
                        <div className="form-group">
                            <label>New Password</label>
                            <input
                                type="password"
                                value={passwordForm.newPassword}
                                onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                                placeholder="••••••••"
                            />
                        </div>
                        <div className="form-group">
                            <label>Confirm New Password</label>
                            <input
                                type="password"
                                value={passwordForm.confirmPassword}
                                onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                                placeholder="••••••••"
                            />
                        </div>
                        <button type="submit" className="btn-primary">Update Password</button>
                    </form>

                    <div style={{ marginTop: '2rem' }}>
                        <h4 style={{ marginBottom: '1rem', fontSize: '0.9rem', color: '#666' }}>Two-Factor Authentication (2FA)</h4>
                        <div className="toggle-group">
                            <span className="toggle-label">Enable 2FA Protection</span>
                            <input type="checkbox" disabled title="Coming soon in v1.1" />
                        </div>
                        <p style={{ fontSize: '0.75rem', color: '#888', marginTop: '0.5rem' }}>
                            Protect sensitive legal data with an extra layer of security.
                        </p>
                    </div>

                    <div style={{ marginTop: '2rem' }}>
                        <h4 style={{ marginBottom: '1rem', fontSize: '0.9rem', color: '#666' }}>Login Activity (Last 5)</h4>
                        <table className="activity-table">
                            <thead>
                                <tr>
                                    <th>Date & Time</th>
                                    <th>IP / Device</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loginHistory.length > 0 ? loginHistory.map((log, idx) => (
                                    <tr key={idx}>
                                        <td>{new Date(log.timestamp).toLocaleString()}</td>
                                        <td>
                                            {log.ip_address}
                                            <span className="device-info">{log.device_type?.substring(0, 30)}...</span>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan="2" style={{ textAlign: 'center', color: '#888' }}>No activity found</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* SMTP Card (Admin Only) */}
                {user?.role === 'admin' && (
                    <div className="account-card card-3">
                        <div className="card-title">
                            <span className="icon">📧</span> Automated Email (Admin)
                        </div>
                        <div className="smtp-guide">
                            <strong>Setup Guide:</strong> Use the firm's Gmail to send notifications. <br />
                            <a href="https://myaccount.google.com/apppasswords" target="_blank" rel="noreferrer" style={{ fontWeight: '600' }}>→ Generate 16-digit App Password</a>
                        </div>
                        <form onSubmit={handleSMTPUpdate}>
                            <div className="form-group">
                                <label>Sender Gmail Address</label>
                                <input
                                    type="email"
                                    value={smtp.email}
                                    onChange={(e) => setSmtp({ ...smtp, email: e.target.value })}
                                    placeholder="your-firm@gmail.com"
                                />
                            </div>
                            <div className="form-group">
                                <label>Gmail App Password</label>
                                <input
                                    type="password"
                                    value={smtp.password}
                                    onChange={(e) => setSmtp({ ...smtp, password: e.target.value })}
                                    placeholder="•••• •••• •••• ••••"
                                />
                            </div>
                            <button type="submit" className="btn-primary">Save SMTP Configuration</button>
                            <button type="button" className="btn-secondary" onClick={testSMTP}>Test Connection</button>
                        </form>
                    </div>
                )}

                {/* Subscription Card (Admin Only) */}
                {user?.role === 'admin' && (
                    <div className="account-card card-4">
                        <div className="card-title">
                            <span className="icon">💳</span> Subscription & Billing
                        </div>
                        <div style={{ padding: '0.5rem 0' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                                <span style={{ color: '#666' }}>Plan Status:</span>
                                <span className="sub-status">{subscription.plan_name}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                                <span style={{ color: '#666' }}>Renewal Date:</span>
                                <span style={{ fontWeight: '600' }}>{subscription.renewal_date ? new Date(subscription.renewal_date).toLocaleDateString() : 'N/A'}</span>
                            </div>
                            <button className="btn-secondary">View Invoice Archive</button>
                            <button className="btn-secondary" style={{ marginTop: '0.5rem' }}>Update Payment Method</button>
                        </div>
                    </div>
                )}

                {/* Preferences Card */}
                <div className="account-card card-5">
                    <div className="card-title">
                        <span className="icon">⚙️</span> Preferences & Access
                    </div>

                    {user?.role === 'editor' && (
                        <div style={{ marginBottom: '2rem', padding: '1rem', background: '#f0f4f8', borderRadius: '8px' }}>
                            <h4 style={{ marginBottom: '0.5rem', fontSize: '0.85rem', color: '#2c5282', fontWeight: '700' }}>PERMISSION SUMMARY</h4>
                            <ul style={{ fontSize: '0.8rem', color: '#4a5568', paddingLeft: '1.2rem', margin: 0 }}>
                                {user.permissions?.map((p, i) => (
                                    <li key={i} style={{ marginBottom: '0.2rem' }}>Access to: {p.charAt(0).toUpperCase() + p.slice(1)}</li>
                                ))}
                            </ul>
                        </div>
                    )}

                    <div className="form-group">
                        <label>Interface Language</label>
                        <select
                            value={preferences.language}
                            onChange={(e) => handlePreferenceUpdate({ ...preferences, language: e.target.value })}
                        >
                            <option value="English">English</option>
                            <option value="Sinhala">Sinhala (v1.1)</option>
                            <option value="Tamil">Tamil (v1.1)</option>
                        </select>
                    </div>

                    <h4 style={{ margin: '1.5rem 0 1rem', fontSize: '0.9rem', color: '#666' }}>Notification Toggles</h4>
                    <div className="toggle-group">
                        <span className="toggle-label">New Case Assigned</span>
                        <input
                            type="checkbox"
                            checked={preferences.notifications.caseAssigned}
                            onChange={(e) => handlePreferenceUpdate({
                                ...preferences,
                                notifications: { ...preferences.notifications, caseAssigned: e.target.checked }
                            })}
                        />
                    </div>
                    <div className="toggle-group">
                        <span className="toggle-label">Next Date Reminders</span>
                        <input
                            type="checkbox"
                            checked={preferences.notifications.reminder}
                            onChange={(e) => handlePreferenceUpdate({
                                ...preferences,
                                notifications: { ...preferences.notifications, reminder: e.target.checked }
                            })}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Account;

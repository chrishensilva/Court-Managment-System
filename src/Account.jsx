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

    const [smtp, setSmtp] = useState({
        email: '',
        password: '********'
    });

    const [subscription, setSubscription] = useState({
        plan_name: 'Professional',
        renewal_date: '',
        status: 'Active'
    });

    const [preferences, setPreferences] = useState({
        notifications: { caseAssigned: true, reminder: true },
        language: 'English'
    });

    const [isSaving, setIsSaving] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadAllData = async () => {
            setIsLoading(true);
            try {
                await Promise.all([
                    fetchProfile(),
                    fetchLoginHistory(),
                    fetchSMTP(),
                    user?.role === 'admin' ? fetchSubscription() : Promise.resolve()
                ]);
            } finally {
                setIsLoading(false);
            }
        };
        loadAllData();
    }, [user]);

    const fetchProfile = async () => {
        try {
            const resp = await fetch(`${API_BASE_URL}/getProfile`, { 
                credentials: 'include',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            const data = await resp.json();
            if (data && !data.error) {
                setProfile(prev => ({ ...prev, ...data }));
                if (data.notifications) {
                    try {
                        const notifs = typeof data.notifications === 'string' ? JSON.parse(data.notifications) : data.notifications;
                        if (notifs && typeof notifs === 'object') {
                            setPreferences(prev => ({ 
                                ...prev, 
                                notifications: { ...prev.notifications, ...notifs }, 
                                language: data.language || prev.language 
                            }));
                        }
                    } catch (e) {
                        console.error("Failed to parse notifications:", e);
                    }
                }
            }
        } catch (err) {
            console.error("Profile fetch error:", err);
        }
    };

    const fetchLoginHistory = async () => {
        try {
            const resp = await fetch(`${API_BASE_URL}/getLoginActivity`, { 
                credentials: 'include',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            const data = await resp.json();
            if (Array.isArray(data)) setLoginHistory(data);
        } catch (err) {
            console.error("Login history fetch error:", err);
        }
    };

    const fetchSMTP = async () => {
        try {
            const resp = await fetch(`${API_BASE_URL}/getSMTP`, { 
                credentials: 'include',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            const data = await resp.json();
            if (data && !data.error) setSmtp(data);
        } catch (err) {
            console.error("SMTP fetch error:", err);
        }
    };

    const fetchSubscription = async () => {
        try {
            const resp = await fetch(`${API_BASE_URL}/getSubscription`, { 
                credentials: 'include',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            const data = await resp.json();
            if (data && !data.error) setSubscription(data);
        } catch (err) {
            console.error("Subscription fetch error:", err);
        }
    };

    const handleProfileUpdate = async (e) => {
        if (e) e.preventDefault();
        setIsSaving(true);
        try {
            const resp = await fetch(`${API_BASE_URL}/updateProfile`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                credentials: 'include',
                body: JSON.stringify(profile)
            });
            const data = await resp.json();
            if (data.status === 'success') {
                toast('Profile updated', 'success');
                return true;
            }
            toast(data.message || 'Update failed', 'error');
            return false;
        } catch (err) {
            toast('Connection error', 'error');
            return false;
        } finally {
            setIsSaving(false);
        }
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        if (!passwordForm.currentPassword) return toast('Current password required', 'error');
        if (passwordForm.newPassword !== passwordForm.confirmPassword) return toast('Passwords do not match', 'error');
        if (passwordForm.newPassword.length < 6) return toast('Password too short', 'error');

        setIsSaving(true);
        try {
            const resp = await fetch(`${API_BASE_URL}/changePassword`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                credentials: 'include',
                body: JSON.stringify(passwordForm)
            });
            const data = await resp.json();
            if (data.status === 'success') {
                toast('Password updated', 'success');
                setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
            } else {
                toast(data.message || 'Change failed', 'error');
            }
        } catch (err) {
            toast('Server error', 'error');
        } finally {
            setIsSaving(false);
        }
    };

    const handleSMTPUpdate = async (e) => {
        if (e) e.preventDefault();
        setIsSaving(true);
        try {
            const resp = await fetch(`${API_BASE_URL}/updateSMTP`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                credentials: 'include',
                body: JSON.stringify(smtp)
            });
            const data = await resp.json();
            if (data.status === 'success') {
                toast('SMTP saved', 'success');
                return true;
            }
            return false;
        } catch (err) {
            return false;
        } finally {
            setIsSaving(false);
        }
    };

    const testSMTP = async () => {
        toast('Testing SMTP...', 'info');
        try {
            const resp = await fetch(`${API_BASE_URL}/testSMTP`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                credentials: 'include',
                body: JSON.stringify(smtp)
            });
            const data = await resp.json();
            if (data.status === 'success') toast('SMTP Connected!', 'success');
            else toast(`Failed: ${data.message}`, 'error');
        } catch (err) {
            toast('Server error', 'error');
        }
    };

    const handlePreferenceUpdate = async (newPrefs) => {
        setPreferences(newPrefs);
        try {
            await fetch(`${API_BASE_URL}/updatePreferences`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                credentials: 'include',
                body: JSON.stringify(newPrefs)
            });
        } catch (err) {
            console.error("Preferences sync error:", err);
        }
    };

    const handleSaveAll = async () => {
        setIsSaving(true);
        const results = await Promise.all([
            handleProfileUpdate(),
            user?.role === 'admin' ? handleSMTPUpdate() : Promise.resolve(true)
        ]);
        if (results.every(r => r)) {
            toast('All changes saved successfully', 'success');
        }
        setIsSaving(false);
    };

    const handleAvatarChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('avatar', file);

        toast('Uploading picture...', 'info');
        try {
            const resp = await fetch(`${API_BASE_URL}/uploadAvatar`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: formData
            });
            const data = await resp.json();
            if (data.status === 'success') {
                setProfile(prev => ({ ...prev, avatar_url: data.avatar_url }));
                toast('Picture updated', 'success');
            } else {
                toast(data.message || 'Upload failed', 'error');
            }
        } catch (err) {
            toast('Upload error', 'error');
        }
    };

    if (isLoading) {
        return (
            <div className="account-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
                <div className="loading-spinner"></div>
                <p>Loading your account details...</p>
            </div>
        );
    }

    return (
        <div className="account-container">
            <div className="account-header">
                <div>
                    <h1>My Account</h1>
                    <p>Manage your profile, security, and preferences.</p>
                </div>
                <button
                    className="btn-primary"
                    onClick={handleSaveAll}
                    disabled={isSaving}
                    style={{ padding: '0.8rem 2rem', fontSize: '1rem', width: 'auto' }}
                >
                    {isSaving ? 'Saving...' : 'Save All Settings'}
                </button>
            </div>

            <div className={`account-grid ${isSaving ? 'saving-fade' : ''}`}>
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
                                    value={profile.fullname || ''}
                                    onChange={(e) => setProfile({ ...profile, fullname: e.target.value })}
                                    placeholder="Enter full name"
                                />
                            </div>
                            <div className="form-group">
                                <label>Email Address</label>
                                <input
                                    type="email"
                                    value={profile.email || ''}
                                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                                    placeholder="email@example.com"
                                />
                            </div>
                            <div className="form-group">
                                <label>Phone Number</label>
                                <input
                                    type="text"
                                    value={profile.phone || ''}
                                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                                    placeholder="+94 77 123 4567"
                                />
                            </div>
                            <button type="submit" className="btn-primary" disabled={isSaving}>
                                {isSaving ? '...' : 'Save Profile'}
                            </button>
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
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>New Password</label>
                            <input
                                type="password"
                                value={passwordForm.newPassword}
                                onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                                placeholder="Min 6 characters"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Confirm New Password</label>
                            <input
                                type="password"
                                value={passwordForm.confirmPassword}
                                onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                                placeholder="Confirm new password"
                                required
                            />
                        </div>
                        <button type="submit" className="btn-primary" disabled={isSaving}>
                            {isSaving ? 'Updating...' : 'Update Password'}
                        </button>
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
                                            <div style={{ fontWeight: '600' }}>{log.ip_address}</div>
                                            <div className="device-info" title={log.device_type}>
                                                {log.device_type?.substring(0, 30)}...
                                            </div>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan="2" style={{ textAlign: 'center', color: '#888', padding: '1rem' }}>No activity found</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* SMTP Card */}
                <div className="account-card card-3">
                    <div className="card-title">
                        <span className="icon">📧</span> Automated Email
                    </div>
                    <div className="smtp-guide">
                        <strong>Setup Guide:</strong> Use a Gmail account to send notifications automatically. <br />
                        <a href="https://myaccount.google.com/apppasswords" target="_blank" rel="noreferrer" style={{ color: 'var(--primary)', fontWeight: '600' }}>→ Generate 16-digit App Password</a>
                    </div>
                    <form onSubmit={handleSMTPUpdate}>
                        <div className="form-group">
                            <label>Sender Gmail Address</label>
                            <input
                                type="email"
                                value={smtp.email}
                                onChange={(e) => setSmtp({ ...smtp, email: e.target.value })}
                                placeholder="your-email@gmail.com"
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
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <button type="submit" className="btn-primary" disabled={isSaving} style={{ flex: 2 }}>
                                {isSaving ? '...' : 'Save SMTP'}
                            </button>
                            <button type="button" className="btn-secondary" onClick={testSMTP} style={{ flex: 1 }}>Test</button>
                        </div>
                    </form>
                </div>

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
                            <button className="btn-secondary" disabled>View Invoice Archive (v1.1)</button>
                            <button className="btn-secondary" style={{ marginTop: '0.5rem' }} disabled>Update Payment Method</button>
                        </div>
                    </div>
                )}

                {/* Preferences Card */}
                <div className="account-card card-5">
                    <div className="card-title">
                        <span className="icon">⚙️</span> Preferences & Access
                    </div>

                    {user?.role === 'editor' && (
                        <div style={{ marginBottom: '2rem', padding: '1rem', background: 'var(--bg-main)', borderRadius: '8px', border: '1px solid var(--border)' }}>
                            <h4 style={{ marginBottom: '0.5rem', fontSize: '0.85rem', color: 'var(--primary)', fontWeight: '700' }}>PERMISSION SUMMARY</h4>
                            <ul style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', paddingLeft: '1.2rem', margin: 0 }}>
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

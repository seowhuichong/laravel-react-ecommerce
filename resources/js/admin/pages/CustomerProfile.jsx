import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../context/AdminAuthContext';

/* ── helpers ── */
const fmt = (d) => d ? new Date(d).toLocaleDateString() : '—';
const initials = (name) =>
    name?.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() || '?';

/* ── Confirm Modal ── */
function ConfirmDialog({ message, onConfirm, onCancel }) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-sm w-full p-6">
                <h3 className="text-base font-semibold text-slate-800 mb-2">Confirm Deletion</h3>
                <p className="text-sm text-slate-500 mb-6">{message}</p>
                <div className="flex justify-end gap-3">
                    <button onClick={onCancel}
                        className="px-4 py-2 text-sm border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors">
                        Cancel
                    </button>
                    <button onClick={onConfirm}
                        className="px-4 py-2 text-sm bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors">
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
}

/* ── Info Row ── */
function InfoRow({ label, value }) {
    return (
        <div className="flex justify-between items-start py-2.5 border-b border-slate-100 last:border-0">
            <dt className="text-sm text-slate-400 flex-shrink-0 w-36">{label}</dt>
            <dd className="text-sm font-medium text-slate-700 text-right">{value || '—'}</dd>
        </div>
    );
}

/* ── Section Card ── */
function Card({ title, children, action }) {
    return (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                <h2 className="text-sm font-semibold text-slate-700">{title}</h2>
                {action}
            </div>
            <div className="px-6 py-4">{children}</div>
        </div>
    );
}

/* ── Stat Badge ── */
function StatBadge({ label, value, color }) {
    const colors = {
        indigo: 'bg-indigo-50 text-indigo-700 border-indigo-100',
        amber: 'bg-amber-50 text-amber-700 border-amber-100',
        green: 'bg-green-50 text-green-700 border-green-100',
        rose: 'bg-rose-50 text-rose-700 border-rose-100',
    };
    return (
        <div className={`flex flex-col items-center justify-center px-6 py-4 rounded-xl border ${colors[color] ?? colors.indigo}`}>
            <span className="text-2xl font-bold tabular-nums">{value ?? '0'}</span>
            <span className="text-xs font-medium mt-1 opacity-70">{label}</span>
        </div>
    );
}

/* ── Main Page ── */
export default function CustomerProfile() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { api } = useAdminAuth();

    const [customer, setCustomer] = useState(null);
    const [loading, setLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);

    const [editing, setEditing] = useState(false);
    const [form, setForm] = useState({});
    const [saving, setSaving] = useState(false);
    const [errors, setErrors] = useState({});
    const [success, setSuccess] = useState('');
    const [confirm, setConfirm] = useState(false);

    useEffect(() => {
        setLoading(true);
        api.get(`/api/admin/customers/${id}`)
            .then(res => {
                setCustomer(res.data.user);
                const u = res.data.user;
                setForm({
                    name: u.name ?? '',
                    email: u.email ?? '',
                    phone: u.phone ?? '',
                    gender: u.gender ?? '',
                    date_of_birth: u.date_of_birth ? u.date_of_birth.substring(0, 10) : '',
                });
            })
            .catch(err => {
                if (err.response?.status === 404) setNotFound(true);
            })
            .finally(() => setLoading(false));
    }, [id]);

    const inputCls = (field) =>
        `block w-full px-3 py-2 border ${errors[field] ? 'border-red-300' : 'border-slate-200'} rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent`;

    const handleSave = async () => {
        setSaving(true);
        setErrors({});
        setSuccess('');
        try {
            const res = await api.put(`/api/admin/customers/${id}`, form);
            setCustomer(prev => ({ ...prev, ...res.data.user }));
            setSuccess('Customer updated successfully.');
            setEditing(false);
        } catch (err) {
            if (err.response?.data?.errors) setErrors(err.response.data.errors);
            else setErrors({ general: err.response?.data?.message || 'Update failed.' });
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        try {
            await api.delete(`/api/admin/customers/${id}`);
            navigate('/admin/customers');
        } catch {
            setErrors({ general: 'Delete failed. Please try again.' });
            setConfirm(false);
        }
    };

    /* ── Loading / Not Found ── */
    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }
    if (notFound || !customer) {
        return (
            <div className="flex flex-col items-center justify-center h-64 gap-4">
                <p className="text-slate-400 text-sm">Customer not found.</p>
                <button onClick={() => navigate('/admin/customers')}
                    className="text-sm text-indigo-600 hover:underline">
                    ← Back to Customers
                </button>
            </div>
        );
    }

    /* ── Render ── */
    return (
        <>
            {/* Page header */}
            <div className="mb-6">
                <button
                    onClick={() => navigate('/admin/customers')}
                    className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-indigo-600 transition-colors mb-4"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Back to Customers
                </button>

                {/* Hero header card */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-5">
                        {/* Avatar */}
                        <div className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-2xl flex-shrink-0">
                            {initials(customer.name)}
                        </div>

                        {/* Meta */}
                        <div className="flex-1 min-w-0">
                            <h1 className="text-xl font-bold text-slate-800 truncate">{customer.name}</h1>
                            <p className="text-sm text-slate-500">{customer.email}</p>
                            <p className="text-xs text-slate-400 mt-1">
                                Customer #{customer.id} · Joined {fmt(customer.created_at)}
                            </p>
                        </div>

                        {/* Quick stats */}
                        <div className="flex gap-3 flex-shrink-0">
                            <StatBadge label="Points" value={customer.points} color="indigo" />
                            <StatBadge label="Credits" value={customer.credits} color="amber" />
                            <StatBadge label="Addresses" value={customer.addresses?.length ?? 0} color="green" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Alerts */}
            {success && (
                <div className="mb-4 flex items-center gap-2 text-green-700 bg-green-50 border border-green-200 rounded-lg px-4 py-3 text-sm">
                    <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {success}
                </div>
            )}
            {errors.general && (
                <div className="mb-4 text-red-700 bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm">
                    {errors.general}
                </div>
            )}

            {/* Two-column grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Left column — Profile Info */}
                <div className="lg:col-span-2 space-y-6">

                    {/* Profile Information */}
                    <Card
                        title="Profile Information"
                        action={
                            !editing ? (
                                <button onClick={() => setEditing(true)}
                                    className="inline-flex items-center gap-1.5 text-xs font-medium text-indigo-600 hover:text-indigo-800 transition-colors">
                                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    </svg>
                                    Edit
                                </button>
                            ) : (
                                <button onClick={() => { setEditing(false); setErrors({}); }}
                                    className="text-xs text-slate-400 hover:text-slate-600 font-medium transition-colors">
                                    Cancel
                                </button>
                            )
                        }
                    >
                        {!editing ? (
                            <dl>
                                <InfoRow label="Full Name" value={customer.name} />
                                <InfoRow label="Email" value={customer.email} />
                                <InfoRow label="Phone" value={customer.phone} />
                                <InfoRow label="Gender" value={customer.gender
                                    ? customer.gender.charAt(0).toUpperCase() + customer.gender.slice(1)
                                    : null} />
                                <InfoRow label="Date of Birth" value={fmt(customer.date_of_birth)} />
                            </dl>
                        ) : (
                            <div className="space-y-4">
                                {/* Name */}
                                <div>
                                    <label className="block text-xs font-medium text-slate-500 mb-1">Full Name</label>
                                    <input value={form.name}
                                        onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                                        className={inputCls('name')} />
                                    {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name[0]}</p>}
                                </div>
                                {/* Email */}
                                <div>
                                    <label className="block text-xs font-medium text-slate-500 mb-1">Email</label>
                                    <input type="email" value={form.email}
                                        onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                                        className={inputCls('email')} />
                                    {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email[0]}</p>}
                                </div>
                                {/* Phone */}
                                <div>
                                    <label className="block text-xs font-medium text-slate-500 mb-1">Phone</label>
                                    <input value={form.phone}
                                        onChange={e => setForm(p => ({ ...p, phone: e.target.value }))}
                                        className={inputCls('phone')} />
                                </div>
                                {/* Gender */}
                                <div>
                                    <label className="block text-xs font-medium text-slate-500 mb-1">Gender</label>
                                    <select value={form.gender}
                                        onChange={e => setForm(p => ({ ...p, gender: e.target.value }))}
                                        className={inputCls('gender')}>
                                        <option value="">Prefer not to say</option>
                                        <option value="male">Male</option>
                                        <option value="female">Female</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>
                                {/* DOB */}
                                <div>
                                    <label className="block text-xs font-medium text-slate-500 mb-1">Date of Birth</label>
                                    <input type="date" value={form.date_of_birth}
                                        onChange={e => setForm(p => ({ ...p, date_of_birth: e.target.value }))}
                                        className={inputCls('date_of_birth')} />
                                </div>

                                <button onClick={handleSave} disabled={saving}
                                    className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50">
                                    {saving ? 'Saving…' : 'Save Changes'}
                                </button>
                            </div>
                        )}
                    </Card>

                    {/* Saved Addresses */}
                    <Card title={`Saved Addresses (${customer.addresses?.length ?? 0})`}>
                        {customer.addresses?.length > 0 ? (
                            <div className="space-y-4">
                                {customer.addresses.map(addr => (
                                    <div key={addr.address_id}
                                        className="border border-slate-200 rounded-xl p-4 text-sm">
                                        <div className="flex items-center gap-2 mb-2.5">
                                            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-600">
                                                {addr.address_label}
                                            </span>
                                            {addr.is_default && (
                                                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-green-50 text-green-600">
                                                    Default
                                                </span>
                                            )}
                                        </div>
                                        <p className="font-medium text-slate-800">{addr.recipient_name}</p>
                                        <p className="text-slate-500 text-xs">{addr.recipient_phone}</p>
                                        <p className="text-slate-500 mt-1">
                                            {addr.address_line1}
                                            {addr.address_line2 && `, ${addr.address_line2}`}
                                        </p>
                                        <p className="text-slate-500">
                                            {[addr.city, addr.state, addr.postcode, addr.country]
                                                .filter(Boolean).join(', ')}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm text-slate-400 italic">No saved addresses.</p>
                        )}
                    </Card>
                </div>

                {/* Right column — Stats + Danger */}
                <div className="space-y-6">

                    {/* Points & Credits */}
                    <Card title="Points & Credits">
                        <div className="space-y-3">
                            <div className="flex items-center justify-between py-2.5 border-b border-slate-100">
                                <div className="flex items-center gap-2">
                                    <div className="w-7 h-7 rounded-lg bg-indigo-50 flex items-center justify-center">
                                        <svg className="w-4 h-4 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                                        </svg>
                                    </div>
                                    <span className="text-sm text-slate-600">Reward Points</span>
                                </div>
                                <span className="text-sm font-bold text-indigo-600 tabular-nums">
                                    {customer.points ?? 0}
                                </span>
                            </div>
                            <div className="flex items-center justify-between py-2.5">
                                <div className="flex items-center gap-2">
                                    <div className="w-7 h-7 rounded-lg bg-amber-50 flex items-center justify-center">
                                        <svg className="w-4 h-4 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <span className="text-sm text-slate-600">Store Credits</span>
                                </div>
                                <span className="text-sm font-bold text-amber-600 tabular-nums">
                                    {customer.credits ?? '0.00'}
                                </span>
                            </div>
                        </div>
                    </Card>

                    {/* Account overview */}
                    <Card title="Account Overview">
                        <dl>
                            <InfoRow label="Customer ID" value={`#${customer.id}`} />
                            <InfoRow label="Joined" value={fmt(customer.created_at)} />
                            <InfoRow label="Last Updated" value={fmt(customer.updated_at)} />
                        </dl>
                    </Card>

                    {/* Danger Zone */}
                    <div className="bg-white rounded-xl border border-red-100 shadow-sm overflow-hidden">
                        <div className="px-6 py-4 border-b border-red-100">
                            <h2 className="text-sm font-semibold text-red-600">Danger Zone</h2>
                        </div>
                        <div className="px-6 py-4">
                            <p className="text-xs text-slate-500 mb-4">
                                Permanently delete this customer account. This action cannot be undone and will remove all associated data.
                            </p>
                            <button
                                onClick={() => setConfirm(true)}
                                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 border border-red-200 text-red-600 hover:bg-red-50 text-sm font-medium rounded-lg transition-colors"
                            >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                                Delete Customer Account
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {confirm && (
                <ConfirmDialog
                    message={`Are you sure you want to permanently delete ${customer.name}'s account? This action cannot be undone.`}
                    onConfirm={handleDelete}
                    onCancel={() => setConfirm(false)}
                />
            )}
        </>
    );
}

import React, { useEffect, useRef, useState } from 'react';
import { useAdminAuth } from '../context/AdminAuthContext';

/* ── helpers ── */
const fmt = (d) => d ? new Date(d).toLocaleDateString() : '—';
const initials = (name) => name?.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() || '?';

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

/* ── Customer Drawer ── */
function CustomerDrawer({ customerId, api, onClose, onUpdated, onDeleted }) {
    const [customer, setCustomer] = useState(null);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);
    const [form, setForm] = useState({});
    const [saving, setSaving] = useState(false);
    const [errors, setErrors] = useState({});
    const [success, setSuccess] = useState('');
    const [confirm, setConfirm] = useState(false);

    useEffect(() => {
        setLoading(true);
        setEditing(false);
        setSuccess('');
        setErrors({});
        api.get(`/api/admin/customers/${customerId}`)
            .then(res => {
                setCustomer(res.data.user);
                setForm({
                    name: res.data.user.name,
                    email: res.data.user.email,
                    phone: res.data.user.phone ?? '',
                    gender: res.data.user.gender ?? '',
                    date_of_birth: res.data.user.date_of_birth
                        ? res.data.user.date_of_birth.substring(0, 10) : '',
                });
            })
            .finally(() => setLoading(false));
    }, [customerId]);

    const handleSave = async () => {
        setSaving(true);
        setErrors({});
        setSuccess('');
        try {
            const res = await api.put(`/api/admin/customers/${customerId}`, form);
            setCustomer(prev => ({ ...prev, ...res.data.user }));
            onUpdated(res.data.user);
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
            await api.delete(`/api/admin/customers/${customerId}`);
            onDeleted(customerId);
            onClose();
        } catch {
            setErrors({ general: 'Delete failed. Please try again.' });
            setConfirm(false);
        }
    };

    const inputCls = (field) =>
        `block w-full px-3 py-2 border ${errors[field] ? 'border-red-300' : 'border-slate-200'} rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent`;

    return (
        <>
            {/* Backdrop */}
            <div className="fixed inset-0 z-30 bg-black/30" onClick={onClose} />

            {/* Drawer */}
            <aside className="fixed top-0 right-0 z-40 h-full w-full max-w-md bg-white shadow-2xl flex flex-col overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 flex-shrink-0">
                    <h2 className="text-base font-semibold text-slate-800">Customer Details</h2>
                    <button onClick={onClose}
                        className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {loading ? (
                        <div className="flex items-center justify-center h-32">
                            <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                        </div>
                    ) : customer ? (
                        <>
                            {/* Avatar + meta */}
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-lg flex-shrink-0">
                                    {initials(customer.name)}
                                </div>
                                <div>
                                    <p className="font-semibold text-slate-800">{customer.name}</p>
                                    <p className="text-sm text-slate-500">{customer.email}</p>
                                    <p className="text-xs text-slate-400 mt-0.5">Joined {fmt(customer.created_at)}</p>
                                </div>
                            </div>

                            {/* Alerts */}
                            {success && (
                                <div className="flex items-center gap-2 text-green-700 bg-green-50 border border-green-200 rounded-lg px-4 py-3 text-sm">
                                    <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    {success}
                                </div>
                            )}
                            {errors.general && (
                                <div className="text-red-700 bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm">
                                    {errors.general}
                                </div>
                            )}

                            {/* Profile section */}
                            <div className="bg-slate-50 rounded-xl p-4 space-y-4">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-sm font-semibold text-slate-700">Profile Information</h3>
                                    {!editing ? (
                                        <button onClick={() => setEditing(true)}
                                            className="text-xs text-indigo-600 hover:text-indigo-800 font-medium flex items-center gap-1 transition-colors">
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
                                    )}
                                </div>

                                {!editing ? (
                                    <dl className="space-y-3 text-sm">
                                        {[
                                            ['Full Name', customer.name],
                                            ['Email', customer.email],
                                            ['Phone', customer.phone || '—'],
                                            ['Gender', customer.gender ? customer.gender.charAt(0).toUpperCase() + customer.gender.slice(1) : '—'],
                                            ['Date of Birth', fmt(customer.date_of_birth)],
                                        ].map(([label, val]) => (
                                            <div key={label} className="flex justify-between">
                                                <dt className="text-slate-400">{label}</dt>
                                                <dd className="font-medium text-slate-700 text-right">{val}</dd>
                                            </div>
                                        ))}
                                    </dl>
                                ) : (
                                    <div className="space-y-3">
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
                                            className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50">
                                            {saving ? 'Saving…' : 'Save Changes'}
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Addresses */}
                            <div>
                                <h3 className="text-sm font-semibold text-slate-700 mb-3">
                                    Saved Addresses
                                    <span className="ml-2 text-xs text-slate-400 font-normal">
                                        ({customer.addresses?.length ?? 0})
                                    </span>
                                </h3>

                                {customer.addresses?.length > 0 ? (
                                    <div className="space-y-3">
                                        {customer.addresses.map(addr => (
                                            <div key={addr.address_id}
                                                className="border border-slate-200 rounded-xl p-4 text-sm relative">
                                                <div className="flex items-center gap-2 mb-2">
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
                                                <p className="text-slate-500">{addr.recipient_phone}</p>
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
                            </div>
                        </>
                    ) : (
                        <p className="text-slate-400 text-sm">Customer not found.</p>
                    )}
                </div>

                {/* Footer — Delete */}
                <div className="border-t border-slate-100 px-6 py-4 flex-shrink-0">
                    <button
                        onClick={() => setConfirm(true)}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 border border-red-200 text-red-600 hover:bg-red-50 text-sm font-medium rounded-lg transition-colors">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Delete Customer Account
                    </button>
                </div>
            </aside>

            {confirm && (
                <ConfirmDialog
                    message={`Are you sure you want to permanently delete ${customer?.name}'s account? This action cannot be undone.`}
                    onConfirm={handleDelete}
                    onCancel={() => setConfirm(false)}
                />
            )}
        </>
    );
}

/* ── Main Customers Page ── */
export default function Customers() {
    const { api } = useAdminAuth();
    const [data, setData] = useState(null);
    const [page, setPage] = useState(1);
    const [error, setError] = useState('');
    const [search, setSearch] = useState('');
    const [selectedId, setSelectedId] = useState(null);

    useEffect(() => {
        setData(null);
        api.get(`/api/admin/customers?page=${page}`)
            .then(res => setData(res.data))
            .catch(() => setError('Failed to load customers.'));
    }, [page]);

    const filtered = data?.data.filter(u =>
        !search.trim() ||
        u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase())
    ) ?? [];

    const handleUpdated = (updatedUser) => {
        setData(prev => prev ? {
            ...prev,
            data: prev.data.map(u => u.id === updatedUser.id ? { ...u, ...updatedUser } : u),
        } : prev);
    };

    const handleDeleted = (id) => {
        setData(prev => prev ? {
            ...prev,
            data: prev.data.filter(u => u.id !== id),
            total: prev.total - 1,
        } : prev);
    };

    return (
        <>
            <div>
                {/* Page header */}
                <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div>
                        <h1 className="text-xl font-bold text-slate-800">Customers</h1>
                        <p className="text-sm text-slate-500 mt-0.5">
                            {data ? `${data.total} registered customer${data.total !== 1 ? 's' : ''}` : 'All registered customer accounts'}
                        </p>
                    </div>
                    {/* Search */}
                    <div className="relative">
                        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"
                            fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <input
                            type="text"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            placeholder="Search name or email…"
                            className="pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 w-64"
                        />
                    </div>
                </div>

                {error && (
                    <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm">{error}</div>
                )}

                <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-slate-50 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">
                                    <th className="px-6 py-3">#</th>
                                    <th className="px-6 py-3">Customer</th>
                                    <th className="px-6 py-3">Phone</th>
                                    <th className="px-6 py-3">Joined</th>
                                    <th className="px-6 py-3 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {!data ? (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-10 text-center text-slate-400">
                                            <div className="flex justify-center">
                                                <div className="w-5 h-5 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin" />
                                            </div>
                                        </td>
                                    </tr>
                                ) : filtered.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-10 text-center text-slate-400">
                                            {search ? 'No customers match your search.' : 'No customers found.'}
                                        </td>
                                    </tr>
                                ) : (
                                    filtered.map(u => (
                                        <tr key={u.id}
                                            className={`hover:bg-slate-50 transition-colors cursor-pointer ${selectedId === u.id ? 'bg-indigo-50/50' : ''}`}
                                            onClick={() => setSelectedId(u.id)}>
                                            <td className="px-6 py-3.5 text-slate-400 tabular-nums">{u.id}</td>
                                            <td className="px-6 py-3.5">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-semibold text-xs flex-shrink-0">
                                                        {initials(u.name)}
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-slate-800">{u.name}</p>
                                                        <p className="text-xs text-slate-400">{u.email}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-3.5 text-slate-400">{u.phone || '—'}</td>
                                            <td className="px-6 py-3.5 text-slate-400">{fmt(u.created_at)}</td>
                                            <td className="px-6 py-3.5 text-right">
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); setSelectedId(u.id); }}
                                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors">
                                                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                    </svg>
                                                    View
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {data && data.last_page > 1 && (
                        <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between text-sm text-slate-500">
                            <span>Page {data.current_page} of {data.last_page}</span>
                            <div className="flex gap-2">
                                <button disabled={page <= 1} onClick={() => setPage(p => p - 1)}
                                    className="px-3 py-1 rounded-md border border-slate-200 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
                                    Previous
                                </button>
                                <button disabled={page >= data.last_page} onClick={() => setPage(p => p + 1)}
                                    className="px-3 py-1 rounded-md border border-slate-200 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
                                    Next
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Drawer */}
            {selectedId && (
                <CustomerDrawer
                    customerId={selectedId}
                    api={api}
                    onClose={() => setSelectedId(null)}
                    onUpdated={handleUpdated}
                    onDeleted={handleDeleted}
                />
            )}
        </>
    );
}

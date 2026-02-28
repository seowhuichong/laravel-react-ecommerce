import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../context/AdminAuthContext';

/* ── helpers ── */
const fmt = (d) => d ? new Date(d).toLocaleDateString() : '—';
const initials = (name) => name?.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() || '?';

/* ── Main Customers Page ── */
export default function Customers() {
    const { api } = useAdminAuth();
    const navigate = useNavigate();
    const [data, setData] = useState(null);
    const [page, setPage] = useState(1);
    const [error, setError] = useState('');
    const [search, setSearch] = useState('');

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

    return (
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
                                        className="hover:bg-slate-50 transition-colors cursor-pointer"
                                        onClick={() => navigate(`/admin/customers/${u.id}`)}>
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
                                                onClick={(e) => { e.stopPropagation(); navigate(`/admin/customers/${u.id}`); }}
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
    );
}

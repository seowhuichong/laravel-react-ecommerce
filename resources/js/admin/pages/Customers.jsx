import React, { useEffect, useState } from 'react';
import { useAdminAuth } from '../context/AdminAuthContext';

export default function Customers() {
    const { api } = useAdminAuth();
    const [data, setData] = useState(null);
    const [page, setPage] = useState(1);
    const [error, setError] = useState('');

    useEffect(() => {
        setData(null);
        api.get(`/api/admin/customers?page=${page}`)
            .then(res => setData(res.data))
            .catch(() => setError('Failed to load customers.'));
    }, [page]);

    return (
        <div>
            <div className="mb-6">
                <h1 className="text-xl font-bold text-slate-800">Customers</h1>
                <p className="text-sm text-slate-500 mt-0.5">All registered customer accounts</p>
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
                                <th className="px-6 py-3">Name</th>
                                <th className="px-6 py-3">Email</th>
                                <th className="px-6 py-3">Phone</th>
                                <th className="px-6 py-3">Joined</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {data ? (
                                data.data.length > 0 ? (
                                    data.data.map(u => (
                                        <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                                            <td className="px-6 py-3 text-slate-400 tabular-nums">{u.id}</td>
                                            <td className="px-6 py-3 font-medium text-slate-800">{u.name}</td>
                                            <td className="px-6 py-3 text-slate-500">{u.email}</td>
                                            <td className="px-6 py-3 text-slate-400">{u.phone || '—'}</td>
                                            <td className="px-6 py-3 text-slate-400">
                                                {new Date(u.created_at).toLocaleDateString()}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-10 text-center text-slate-400">No customers found.</td>
                                    </tr>
                                )
                            ) : (
                                <tr>
                                    <td colSpan={5} className="px-6 py-10 text-center text-slate-400">Loading…</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {data && data.last_page > 1 && (
                    <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between text-sm text-slate-500">
                        <span>Page {data.current_page} of {data.last_page}</span>
                        <div className="flex gap-2">
                            <button
                                disabled={page <= 1}
                                onClick={() => setPage(p => p - 1)}
                                className="px-3 py-1 rounded-md border border-slate-200 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                            >
                                Previous
                            </button>
                            <button
                                disabled={page >= data.last_page}
                                onClick={() => setPage(p => p + 1)}
                                className="px-3 py-1 rounded-md border border-slate-200 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

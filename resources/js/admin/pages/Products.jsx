import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../context/AdminAuthContext';

/* ── helpers ── */
const myr = (v) => Number(v || 0).toLocaleString('en-MY', { style: 'currency', currency: 'MYR' });

export default function Products() {
    const { api } = useAdminAuth();
    const navigate = useNavigate();
    const [data, setData] = useState(null);
    const [page, setPage] = useState(1);
    const [error, setError] = useState('');

    useEffect(() => {
        setData(null);
        api.get(`/api/admin/products?page=${page}`)
            .then(res => setData(res.data))
            .catch(() => setError('Failed to load products.'));
    }, [page]);

    return (
        <div>
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-bold text-slate-800">Products</h1>
                    <p className="text-sm text-slate-500 mt-0.5">
                        {data ? `${data.total} product${data.total !== 1 ? 's' : ''} in catalogue` : 'Manage your product catalogue'}
                    </p>
                </div>
            </div>

            {error && (
                <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm flex justify-between items-center">
                    <span>{error}</span>
                    <button onClick={() => setError('')} className="ml-4 text-red-400 hover:text-red-600">✕</button>
                </div>
            )}

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-slate-50 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">
                                <th className="px-6 py-3">#</th>
                                <th className="px-6 py-3">SKU</th>
                                <th className="px-6 py-3">Name (en-MY)</th>
                                <th className="px-6 py-3">Price</th>
                                <th className="px-6 py-3">Status</th>
                                <th className="px-6 py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {!data ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-10 text-center text-slate-400">
                                        <div className="flex justify-center">
                                            <div className="w-5 h-5 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin" />
                                        </div>
                                    </td>
                                </tr>
                            ) : data.data.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-10 text-center text-slate-400">No products found.</td>
                                </tr>
                            ) : (
                                data.data.map(p => {
                                    const enName = p.translations?.find(t => t.language_code === 'en-MY')?.product_name
                                        ?? p.translations?.[0]?.product_name
                                        ?? '—';
                                    return (
                                        <tr key={p.products_id}
                                            className="hover:bg-slate-50 transition-colors cursor-pointer"
                                            onClick={() => navigate(`/admin/products/${p.products_id}`)}>
                                            <td className="px-6 py-3.5 text-slate-400 tabular-nums">{p.products_id}</td>
                                            <td className="px-6 py-3.5 font-mono text-slate-700 text-xs">{p.product_sku}</td>
                                            <td className="px-6 py-3.5 text-slate-700 max-w-xs truncate">{enName}</td>
                                            <td className="px-6 py-3.5 font-medium text-slate-800 tabular-nums">
                                                {myr(p.product_price)}
                                            </td>
                                            <td className="px-6 py-3.5">
                                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${p.product_status === 'Active'
                                                    ? 'bg-emerald-50 text-emerald-700'
                                                    : 'bg-slate-100 text-slate-500'}`}>
                                                    <span className={`w-1.5 h-1.5 rounded-full ${p.product_status === 'Active' ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                                                    {p.product_status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-3.5 text-right">
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); navigate(`/admin/products/${p.products_id}`); }}
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
                                    );
                                })
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

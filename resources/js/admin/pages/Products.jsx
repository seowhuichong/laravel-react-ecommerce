import React, { useEffect, useState } from 'react';
import { useAdminAuth } from '../context/AdminAuthContext';

export default function Products() {
    const { api } = useAdminAuth();
    const [data, setData] = useState(null);
    const [page, setPage] = useState(1);
    const [error, setError] = useState('');
    const [deleting, setDeleting] = useState(null);

    const fetchProducts = () => {
        setData(null);
        api.get(`/api/admin/products?page=${page}`)
            .then(res => setData(res.data))
            .catch(() => setError('Failed to load products.'));
    };

    useEffect(() => { fetchProducts(); }, [page]);

    const handleDelete = async (id) => {
        if (!confirm('Delete this product? This cannot be undone.')) return;
        setDeleting(id);
        try {
            await api.delete(`/api/admin/products/${id}`);
            fetchProducts();
        } catch {
            setError('Failed to delete product.');
        } finally {
            setDeleting(null);
        }
    };

    const toggleActive = async (product) => {
        try {
            const newStatus = product.product_status === 'Active' ? 'Inactive' : 'Active';
            await api.put(`/api/admin/products/${product.products_id}`, { product_status: newStatus });
            fetchProducts();
        } catch {
            setError('Failed to update product.');
        }
    };

    return (
        <div>
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-bold text-slate-800">Products</h1>
                    <p className="text-sm text-slate-500 mt-0.5">Manage your product catalogue</p>
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
                                <th className="px-6 py-3">Friendly URL</th>
                                <th className="px-6 py-3">Price</th>
                                <th className="px-6 py-3">Status</th>
                                <th className="px-6 py-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {data ? (
                                data.data.length > 0 ? (
                                    data.data.map(p => (
                                        <tr key={p.products_id} className="hover:bg-slate-50 transition-colors">
                                            <td className="px-6 py-3 text-slate-400 tabular-nums">{p.products_id}</td>
                                            <td className="px-6 py-3 font-mono text-slate-700">{p.product_sku}</td>
                                            <td className="px-6 py-3 text-slate-500 max-w-xs truncate">{p.product_friendly_url}</td>
                                            <td className="px-6 py-3 font-medium text-slate-800">
                                                {Number(p.product_price).toLocaleString('en-MY', { style: 'currency', currency: 'MYR' })}
                                            </td>
                                            <td className="px-6 py-3">
                                                <button
                                                    onClick={() => toggleActive(p)}
                                                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${p.product_status === 'Active'
                                                        ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                                                        : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                                                        }`}
                                                >
                                                    <span className={`w-1.5 h-1.5 rounded-full ${p.product_status === 'Active' ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                                                    {p.product_status}
                                                </button>
                                            </td>
                                            <td className="px-6 py-3">
                                                <button
                                                    onClick={() => handleDelete(p.products_id)}
                                                    disabled={deleting === p.products_id}
                                                    className="text-red-400 hover:text-red-600 disabled:opacity-40 text-xs font-medium transition-colors"
                                                >
                                                    {deleting === p.products_id ? 'Deleting…' : 'Delete'}
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-10 text-center text-slate-400">No products found.</td>
                                    </tr>
                                )
                            ) : (
                                <tr>
                                    <td colSpan={6} className="px-6 py-10 text-center text-slate-400">Loading…</td>
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

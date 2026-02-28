import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../context/AdminAuthContext';

/* ── helpers ── */
const LOCALES = [
    { code: 'en-MY', label: 'English (en-MY)' },
    { code: 'ms-MY', label: 'Malay (ms-MY)' },
    { code: 'zh-CN', label: '中文 (zh-CN)' },
];

const fmt = (d) => d ? new Date(d).toLocaleDateString() : '—';
const myr = (v) => Number(v || 0).toLocaleString('en-MY', { style: 'currency', currency: 'MYR' });

function getCatName(cat) {
    return cat?.translations?.find(t => t.language_code === 'en-MY')?.name
        ?? cat?.translations?.[0]?.name
        ?? cat?.slug ?? `#${cat?.id}`;
}

/** Build a readable path for a category given the full flat list */
function getCatPath(cat, allCats) {
    const parts = [getCatName(cat)];
    let current = cat;
    for (let i = 0; i < 5; i++) {
        if (!current.parent_id) break;
        const parent = allCats.find(c => c.id === current.parent_id);
        if (!parent) break;
        parts.unshift(getCatName(parent));
        current = parent;
    }
    return parts.join(' › ');
}

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
            <dt className="text-sm text-slate-400 flex-shrink-0 w-40">{label}</dt>
            <dd className="text-sm font-medium text-slate-700 text-right break-all">{value ?? '—'}</dd>
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

/* ── Main Page ── */
export default function ProductProfile() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { api } = useAdminAuth();

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);

    /* Core edit state */
    const [editingCore, setEditingCore] = useState(false);
    const [coreForm, setCoreForm] = useState({});
    const [savingCore, setSavingCore] = useState(false);
    const [coreErrors, setCoreErrors] = useState({});

    /* Translation edit state */
    const [activeLocale, setActiveLocale] = useState('en-MY');
    const [editingTranslation, setEditingTranslation] = useState(false);
    const [transForm, setTransForm] = useState({});
    const [savingTrans, setSavingTrans] = useState(false);
    const [transErrors, setTransErrors] = useState({});

    /* Category state */
    const [allCats, setAllCats] = useState([]);
    const [selectedCatIds, setSelectedCatIds] = useState([]);
    const [savingCats, setSavingCats] = useState(false);
    const [catSearch, setCatSearch] = useState('');

    /* Shared alerts */
    const [success, setSuccess] = useState('');
    const [confirm, setConfirm] = useState(false);

    /* ── Fetch ── */
    useEffect(() => {
        setLoading(true);
        Promise.all([
            api.get(`/api/admin/products/${id}`),
            api.get('/api/admin/categories'),
        ])
            .then(([prodRes, catRes]) => {
                const p = prodRes.data.product;
                setProduct(p);
                setSelectedCatIds((p.categories ?? []).map(c => c.id));
                setAllCats(catRes.data.categories ?? []);
                setCoreForm({
                    product_sku: p.product_sku ?? '',
                    product_barcode: p.product_barcode ?? '',
                    product_vendor: p.product_vendor ?? '',
                    product_price: p.product_price ?? '',
                    product_retail_price: p.product_retail_price ?? '',
                    product_weight: p.product_weight ?? '',
                    product_image: p.product_image ?? '',
                    product_status: p.product_status ?? 'Active',
                    product_friendly_url: p.product_friendly_url ?? '',
                });
            })
            .catch(err => {
                if (err.response?.status === 404) setNotFound(true);
            })
            .finally(() => setLoading(false));
    }, [id]);

    /* Sync translation form when locale or product changes */
    useEffect(() => {
        if (!product) return;
        const t = product.translations?.find(t => t.language_code === activeLocale) ?? {};
        setTransForm({
            product_name: t.product_name ?? '',
            product_description: t.product_description ?? '',
            product_meta_title: t.product_meta_title ?? '',
            product_meta_description: t.product_meta_description ?? '',
        });
        setEditingTranslation(false);
        setTransErrors({});
    }, [activeLocale, product]);

    const inputCls = (err) =>
        `block w-full px-3 py-2 border ${err ? 'border-red-300' : 'border-slate-200'} rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent`;

    /* ── Save core ── */
    const handleSaveCore = async () => {
        setSavingCore(true);
        setCoreErrors({});
        setSuccess('');
        try {
            const res = await api.put(`/api/admin/products/${id}`, coreForm);
            setProduct(prev => ({ ...prev, ...res.data.product }));
            setSuccess('Product updated successfully.');
            setEditingCore(false);
        } catch (err) {
            if (err.response?.data?.errors) setCoreErrors(err.response.data.errors);
            else setCoreErrors({ general: err.response?.data?.message || 'Update failed.' });
        } finally {
            setSavingCore(false);
        }
    };

    /* ── Save translation ── */
    const handleSaveTranslation = async () => {
        setSavingTrans(true);
        setTransErrors({});
        setSuccess('');
        try {
            const res = await api.put(`/api/admin/products/${id}`, {
                translations: { [activeLocale]: transForm },
            });
            setProduct(prev => ({ ...prev, translations: res.data.product?.translations ?? prev.translations }));
            setSuccess(`Translation (${activeLocale}) saved successfully.`);
            setEditingTranslation(false);
        } catch (err) {
            if (err.response?.data?.errors) setTransErrors(err.response.data.errors);
            else setTransErrors({ general: err.response?.data?.message || 'Save failed.' });
        } finally {
            setSavingTrans(false);
        }
    };

    /* ── Delete ── */
    const handleDelete = async () => {
        try {
            await api.delete(`/api/admin/products/${id}`);
            navigate('/admin/products');
        } catch {
            setCoreErrors({ general: 'Delete failed. Please try again.' });
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
    if (notFound || !product) {
        return (
            <div className="flex flex-col items-center justify-center h-64 gap-4">
                <p className="text-slate-400 text-sm">Product not found.</p>
                <button onClick={() => navigate('/admin/products')}
                    className="text-sm text-indigo-600 hover:underline">← Back to Products</button>
            </div>
        );
    }

    const defaultName = product.translations?.find(t => t.language_code === 'en-MY')?.product_name
        ?? product.translations?.[0]?.product_name
        ?? product.product_sku;

    /* ── Render ── */
    return (
        <>
            {/* Back */}
            <div className="mb-6">
                <button
                    onClick={() => navigate('/admin/products')}
                    className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-indigo-600 transition-colors mb-4"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Back to Products
                </button>

                {/* Hero header */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-5">
                        {/* Thumbnail */}
                        <div className="w-16 h-16 rounded-xl bg-slate-100 flex items-center justify-center flex-shrink-0 overflow-hidden border border-slate-200">
                            {product.product_image ? (
                                <img src={product.product_image} alt={defaultName}
                                    className="w-full h-full object-cover" />
                            ) : (
                                <svg className="w-8 h-8 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                                        d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10" />
                                </svg>
                            )}
                        </div>

                        {/* Meta */}
                        <div className="flex-1 min-w-0">
                            <div className="flex flex-wrap items-center gap-2 mb-1">
                                <h1 className="text-xl font-bold text-slate-800 truncate">{defaultName}</h1>
                                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${product.product_status === 'Active'
                                    ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                                    {product.product_status}
                                </span>
                            </div>
                            <p className="text-xs font-mono text-slate-400">SKU: {product.product_sku}</p>
                            <p className="text-xs text-slate-400 mt-0.5">/{product.product_friendly_url}</p>
                        </div>

                        {/* Price badges */}
                        <div className="flex gap-3 flex-shrink-0">
                            <div className="flex flex-col items-center px-5 py-3 rounded-xl bg-indigo-50 border border-indigo-100">
                                <span className="text-lg font-bold text-indigo-700 tabular-nums">{myr(product.product_price)}</span>
                                <span className="text-xs text-indigo-400 mt-0.5">Price</span>
                            </div>
                            <div className="flex flex-col items-center px-5 py-3 rounded-xl bg-slate-50 border border-slate-200">
                                <span className="text-lg font-bold text-slate-600 tabular-nums line-through">{myr(product.product_retail_price)}</span>
                                <span className="text-xs text-slate-400 mt-0.5">Retail</span>
                            </div>
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
            {coreErrors.general && (
                <div className="mb-4 text-red-700 bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm">
                    {coreErrors.general}
                </div>
            )}

            {/* Two-column grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Left — Core Info + Translations */}
                <div className="lg:col-span-2 space-y-6">

                    {/* Core Info */}
                    <Card
                        title="Core Information"
                        action={
                            !editingCore ? (
                                <button onClick={() => setEditingCore(true)}
                                    className="inline-flex items-center gap-1.5 text-xs font-medium text-indigo-600 hover:text-indigo-800 transition-colors">
                                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    </svg>
                                    Edit
                                </button>
                            ) : (
                                <button onClick={() => { setEditingCore(false); setCoreErrors({}); }}
                                    className="text-xs text-slate-400 hover:text-slate-600 font-medium transition-colors">
                                    Cancel
                                </button>
                            )
                        }
                    >
                        {!editingCore ? (
                            <dl>
                                <InfoRow label="SKU" value={product.product_sku} />
                                <InfoRow label="Barcode" value={product.product_barcode} />
                                <InfoRow label="Vendor" value={product.product_vendor} />
                                <InfoRow label="Price" value={myr(product.product_price)} />
                                <InfoRow label="Retail Price" value={myr(product.product_retail_price)} />
                                <InfoRow label="Weight (kg)" value={product.product_weight} />
                                <InfoRow label="Friendly URL" value={product.product_friendly_url} />
                                <InfoRow label="Image URL" value={product.product_image} />
                                <InfoRow label="Status" value={product.product_status} />
                            </dl>
                        ) : (
                            <div className="space-y-4">
                                {/* Row helpers */}
                                {[
                                    { key: 'product_sku', label: 'SKU' },
                                    { key: 'product_barcode', label: 'Barcode' },
                                    { key: 'product_vendor', label: 'Vendor' },
                                    { key: 'product_friendly_url', label: 'Friendly URL' },
                                    { key: 'product_image', label: 'Image URL' },
                                ].map(({ key, label }) => (
                                    <div key={key}>
                                        <label className="block text-xs font-medium text-slate-500 mb-1">{label}</label>
                                        <input value={coreForm[key]}
                                            onChange={e => setCoreForm(p => ({ ...p, [key]: e.target.value }))}
                                            className={inputCls(coreErrors[key])} />
                                        {coreErrors[key] && <p className="mt-1 text-xs text-red-600">{coreErrors[key][0]}</p>}
                                    </div>
                                ))}

                                {/* Numeric row */}
                                <div className="grid grid-cols-3 gap-4">
                                    {[
                                        { key: 'product_price', label: 'Price (MYR)' },
                                        { key: 'product_retail_price', label: 'Retail Price' },
                                        { key: 'product_weight', label: 'Weight (kg)' },
                                    ].map(({ key, label }) => (
                                        <div key={key}>
                                            <label className="block text-xs font-medium text-slate-500 mb-1">{label}</label>
                                            <input type="number" min="0" step="0.01" value={coreForm[key]}
                                                onChange={e => setCoreForm(p => ({ ...p, [key]: e.target.value }))}
                                                className={inputCls(coreErrors[key])} />
                                            {coreErrors[key] && <p className="mt-1 text-xs text-red-600">{coreErrors[key][0]}</p>}
                                        </div>
                                    ))}
                                </div>

                                {/* Status */}
                                <div>
                                    <label className="block text-xs font-medium text-slate-500 mb-1">Status</label>
                                    <select value={coreForm.product_status}
                                        onChange={e => setCoreForm(p => ({ ...p, product_status: e.target.value }))}
                                        className={inputCls(coreErrors.product_status)}>
                                        <option value="Active">Active</option>
                                        <option value="Inactive">Inactive</option>
                                    </select>
                                </div>

                                <button onClick={handleSaveCore} disabled={savingCore}
                                    className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50">
                                    {savingCore ? 'Saving…' : 'Save Core Info'}
                                </button>
                            </div>
                        )}
                    </Card>

                    {/* Translations */}
                    <Card
                        title="Translations"
                        action={
                            !editingTranslation ? (
                                <button onClick={() => setEditingTranslation(true)}
                                    className="inline-flex items-center gap-1.5 text-xs font-medium text-indigo-600 hover:text-indigo-800 transition-colors">
                                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    </svg>
                                    Edit
                                </button>
                            ) : (
                                <button onClick={() => { setEditingTranslation(false); setTransErrors({}); }}
                                    className="text-xs text-slate-400 hover:text-slate-600 font-medium transition-colors">
                                    Cancel
                                </button>
                            )
                        }
                    >
                        {/* Locale tabs */}
                        <div className="flex gap-1 mb-4 border-b border-slate-100 pb-3">
                            {LOCALES.map(({ code, label }) => {
                                const hasTrans = product.translations?.some(t => t.language_code === code);
                                return (
                                    <button key={code}
                                        onClick={() => setActiveLocale(code)}
                                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors relative ${activeLocale === code
                                            ? 'bg-indigo-600 text-white'
                                            : 'text-slate-500 hover:bg-slate-100'}`}>
                                        {label}
                                        {hasTrans && activeLocale !== code && (
                                            <span className="absolute -top-1 -right-1 w-2 h-2 bg-green-400 rounded-full" />
                                        )}
                                    </button>
                                );
                            })}
                        </div>

                        {transErrors.general && (
                            <div className="mb-3 text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2 text-sm">
                                {transErrors.general}
                            </div>
                        )}

                        {!editingTranslation ? (
                            <dl>
                                <InfoRow label="Product Name" value={transForm.product_name} />
                                <InfoRow label="Meta Title" value={transForm.product_meta_title} />
                                <InfoRow label="Meta Description" value={transForm.product_meta_description} />
                                <div className="py-2.5">
                                    <dt className="text-sm text-slate-400 mb-2">Description</dt>
                                    <dd className="text-sm text-slate-700 whitespace-pre-wrap">
                                        {transForm.product_description || <span className="italic text-slate-300">—</span>}
                                    </dd>
                                </div>
                            </dl>
                        ) : (
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-medium text-slate-500 mb-1">Product Name</label>
                                    <input value={transForm.product_name}
                                        onChange={e => setTransForm(p => ({ ...p, product_name: e.target.value }))}
                                        className={inputCls(transErrors['translations.*.product_name'])} />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-slate-500 mb-1">Description</label>
                                    <textarea rows={5} value={transForm.product_description}
                                        onChange={e => setTransForm(p => ({ ...p, product_description: e.target.value }))}
                                        className={`${inputCls(false)} resize-none`} />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-slate-500 mb-1">Meta Title</label>
                                    <input value={transForm.product_meta_title}
                                        onChange={e => setTransForm(p => ({ ...p, product_meta_title: e.target.value }))}
                                        className={inputCls(false)} />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-slate-500 mb-1">Meta Description</label>
                                    <textarea rows={2} value={transForm.product_meta_description}
                                        onChange={e => setTransForm(p => ({ ...p, product_meta_description: e.target.value }))}
                                        className={`${inputCls(false)} resize-none`} />
                                </div>

                                <button onClick={handleSaveTranslation} disabled={savingTrans}
                                    className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50">
                                    {savingTrans ? 'Saving…' : `Save ${activeLocale} Translation`}
                                </button>
                            </div>
                        )}
                    </Card>

                    {/* Categories */}
                    {(() => {
                        // Leaf categories = categories with no children in the full list
                        const childIds = new Set(allCats.filter(c => c.parent_id).map(c => c.parent_id));
                        const leafCats = allCats.filter(c => !childIds.has(c.id));
                        const selectedCats = allCats.filter(c => selectedCatIds.includes(c.id));

                        const filtered = leafCats.filter(c => {
                            if (selectedCatIds.includes(c.id)) return false;
                            const path = getCatPath(c, allCats).toLowerCase();
                            return !catSearch.trim() || path.includes(catSearch.toLowerCase());
                        });

                        const handleSaveCats = async () => {
                            setSavingCats(true);
                            setSuccess('');
                            try {
                                const res = await api.put(`/api/admin/products/${id}`, {
                                    category_ids: selectedCatIds,
                                });
                                setProduct(prev => ({ ...prev, categories: res.data.product?.categories ?? prev.categories }));
                                setSuccess('Categories saved successfully.');
                            } catch {
                                setCoreErrors({ general: 'Failed to save categories.' });
                            } finally {
                                setSavingCats(false);
                            }
                        };

                        return (
                            <Card title="Categories">
                                {/* Selected tags */}
                                <div className="flex flex-wrap gap-2 mb-4 min-h-[2rem]">
                                    {selectedCats.length === 0 ? (
                                        <p className="text-sm text-slate-400 italic">No categories assigned yet.</p>
                                    ) : (
                                        selectedCats.map(cat => (
                                            <span key={cat.id}
                                                className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-medium rounded-full">
                                                <span className="max-w-[200px] truncate">{getCatPath(cat, allCats)}</span>
                                                <button
                                                    onClick={() => setSelectedCatIds(prev => prev.filter(i => i !== cat.id))}
                                                    className="text-indigo-300 hover:text-indigo-700 transition-colors flex-shrink-0">
                                                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                    </svg>
                                                </button>
                                            </span>
                                        ))
                                    )}
                                </div>

                                {/* Leaf picker */}
                                <div className="border border-slate-200 rounded-xl overflow-hidden">
                                    <div className="px-3 py-2 border-b border-slate-100 bg-slate-50">
                                        <input
                                            value={catSearch}
                                            onChange={e => setCatSearch(e.target.value)}
                                            placeholder="Search leaf categories…"
                                            className="w-full text-sm bg-transparent focus:outline-none text-slate-700 placeholder:text-slate-400"
                                        />
                                    </div>
                                    <div className="max-h-48 overflow-y-auto divide-y divide-slate-100">
                                        {filtered.length === 0 ? (
                                            <p className="px-4 py-3 text-sm text-slate-400 italic">
                                                {catSearch ? 'No matching categories.' : 'All leaf categories assigned.'}
                                            </p>
                                        ) : (
                                            filtered.map(cat => (
                                                <button key={cat.id}
                                                    onClick={() => { setSelectedCatIds(prev => [...prev, cat.id]); setCatSearch(''); }}
                                                    className="w-full flex items-center gap-2 px-4 py-2.5 text-left hover:bg-indigo-50 transition-colors group">
                                                    <svg className="w-3.5 h-3.5 text-slate-300 group-hover:text-indigo-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                                    </svg>
                                                    <span className="text-sm text-slate-700 group-hover:text-indigo-700 truncate">{getCatPath(cat, allCats)}</span>
                                                </button>
                                            ))
                                        )}
                                    </div>
                                </div>

                                <button onClick={handleSaveCats} disabled={savingCats}
                                    className="mt-4 w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50">
                                    {savingCats ? 'Saving…' : 'Save Categories'}
                                </button>
                            </Card>
                        );
                    })()}
                </div>

                {/* Right — Overview + Danger */}
                <div className="space-y-6">

                    {/* Product overview */}
                    <Card title="Product Overview">
                        <dl>
                            <InfoRow label="Product ID" value={`#${product.products_id}`} />
                            <InfoRow label="Translations" value={`${product.translations?.length ?? 0} / ${LOCALES.length} locales`} />
                            <InfoRow label="Created" value={fmt(product.created_at)} />
                            <InfoRow label="Updated" value={fmt(product.updated_at)} />
                        </dl>
                    </Card>

                    {/* Quick status toggle */}
                    <Card title="Status">
                        <div className="flex flex-col gap-3">
                            <p className="text-xs text-slate-500">
                                Currently <span className={`font-semibold ${product.product_status === 'Active' ? 'text-emerald-600' : 'text-slate-500'}`}>{product.product_status}</span>.
                                Click below to toggle.
                            </p>
                            <button
                                onClick={async () => {
                                    setSuccess('');
                                    const newStatus = product.product_status === 'Active' ? 'Inactive' : 'Active';
                                    try {
                                        const res = await api.put(`/api/admin/products/${id}`, { product_status: newStatus });
                                        setProduct(prev => ({ ...prev, product_status: res.data.product.product_status }));
                                        setSuccess(`Status changed to ${newStatus}.`);
                                    } catch {
                                        setCoreErrors({ general: 'Status update failed.' });
                                    }
                                }}
                                className={`w-full py-2 text-sm font-medium rounded-lg border transition-colors ${product.product_status === 'Active'
                                    ? 'border-slate-200 text-slate-600 hover:bg-slate-50'
                                    : 'border-emerald-200 text-emerald-700 hover:bg-emerald-50'}`}
                            >
                                {product.product_status === 'Active' ? 'Set as Inactive' : 'Set as Active'}
                            </button>
                        </div>
                    </Card>

                    {/* Danger Zone */}
                    <div className="bg-white rounded-xl border border-red-100 shadow-sm overflow-hidden">
                        <div className="px-6 py-4 border-b border-red-100">
                            <h2 className="text-sm font-semibold text-red-600">Danger Zone</h2>
                        </div>
                        <div className="px-6 py-4">
                            <p className="text-xs text-slate-500 mb-4">
                                Permanently delete this product and all its translations. This cannot be undone.
                            </p>
                            <button
                                onClick={() => setConfirm(true)}
                                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 border border-red-200 text-red-600 hover:bg-red-50 text-sm font-medium rounded-lg transition-colors"
                            >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                                Delete Product
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {confirm && (
                <ConfirmDialog
                    message={`Are you sure you want to permanently delete "${defaultName}"? This will also remove all translations.`}
                    onConfirm={handleDelete}
                    onCancel={() => setConfirm(false)}
                />
            )}
        </>
    );
}

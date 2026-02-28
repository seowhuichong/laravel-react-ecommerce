import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../context/AdminAuthContext';

/* ── helpers ── */
const LOCALES = [
    { code: 'en-MY', label: 'English (en-MY)' },
    { code: 'ms-MY', label: 'Malay (ms-MY)' },
    { code: 'zh-CN', label: '中文 (zh-CN)' },
];

function getName(cat, locale = 'en-MY') {
    return cat?.translations?.find(t => t.language_code === locale)?.name
        ?? cat?.translations?.find(t => t.language_code === 'en-MY')?.name
        ?? cat?.slug ?? '—';
}

const fmt = (d) => d ? new Date(d).toLocaleDateString() : '—';

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
export default function CategoryProfile() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { api } = useAdminAuth();

    const [category, setCategory] = useState(null);
    const [allCats, setAllCats] = useState([]);
    const [loading, setLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);

    /* Core edit */
    const [editingCore, setEditingCore] = useState(false);
    const [coreForm, setCoreForm] = useState({});
    const [savingCore, setSavingCore] = useState(false);
    const [coreErrors, setCoreErrors] = useState({});

    /* Translation edit */
    const [activeLocale, setActiveLocale] = useState('en-MY');
    const [editingTrans, setEditingTrans] = useState(false);
    const [transName, setTransName] = useState('');
    const [savingTrans, setSavingTrans] = useState(false);
    const [transError, setTransError] = useState('');

    /* Shared */
    const [success, setSuccess] = useState('');
    const [confirm, setConfirm] = useState(false);

    /* ── Load ── */
    const load = () => {
        setLoading(true);
        Promise.all([
            api.get(`/api/admin/categories/${id}`),
            api.get('/api/admin/categories'),
        ])
            .then(([catRes, allRes]) => {
                const cat = catRes.data.category;
                setCategory(cat);
                setCoreForm({
                    slug: cat.slug ?? '',
                    parent_id: cat.parent_id ?? '',
                    image: cat.image ?? '',
                    sort_order: cat.sort_order ?? 0,
                    is_active: cat.is_active,
                });
                setAllCats(allRes.data.categories);
            })
            .catch(err => {
                if (err.response?.status === 404) setNotFound(true);
            })
            .finally(() => setLoading(false));
    };

    useEffect(() => { load(); }, [id]);

    /* Sync translation name when locale changes */
    useEffect(() => {
        if (!category) return;
        setTransName(category.translations?.find(t => t.language_code === activeLocale)?.name ?? '');
        setEditingTrans(false);
        setTransError('');
    }, [activeLocale, category]);

    const inputCls = (err) =>
        `block w-full px-3 py-2 border ${err ? 'border-red-300' : 'border-slate-200'} rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500`;

    /* ── Save core ── */
    const handleSaveCore = async () => {
        setSavingCore(true);
        setCoreErrors({});
        setSuccess('');
        try {
            const res = await api.put(`/api/admin/categories/${id}`, {
                ...coreForm,
                parent_id: coreForm.parent_id || null,
            });
            setCategory(prev => ({ ...prev, ...res.data.category }));
            setSuccess('Category updated.');
            setEditingCore(false);
        } catch (err) {
            if (err.response?.data?.errors) setCoreErrors(err.response.data.errors);
            else setCoreErrors({ general: err.response?.data?.message || 'Update failed.' });
        } finally {
            setSavingCore(false);
        }
    };

    /* ── Save translation ── */
    const handleSaveTrans = async () => {
        setSavingTrans(true);
        setTransError('');
        setSuccess('');
        try {
            const res = await api.put(`/api/admin/categories/${id}`, {
                translations: { [activeLocale]: { name: transName } },
            });
            setCategory(prev => ({ ...prev, translations: res.data.category?.translations ?? prev.translations }));
            setSuccess(`Translation (${activeLocale}) saved.`);
            setEditingTrans(false);
        } catch (err) {
            setTransError(err.response?.data?.message || 'Save failed.');
        } finally {
            setSavingTrans(false);
        }
    };

    /* ── Delete ── */
    const handleDelete = async () => {
        try {
            await api.delete(`/api/admin/categories/${id}`);
            navigate('/admin/categories');
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
    if (notFound || !category) {
        return (
            <div className="flex flex-col items-center justify-center h-64 gap-4">
                <p className="text-slate-400 text-sm">Category not found.</p>
                <button onClick={() => navigate('/admin/categories')}
                    className="text-sm text-indigo-600 hover:underline">← Back to Categories</button>
            </div>
        );
    }

    const displayName = getName(category);
    const parentCats = allCats.filter(c => c.id !== category.id);

    /* ── Render ── */
    return (
        <>
            {/* Back + Hero */}
            <div className="mb-6">
                <button onClick={() => navigate('/admin/categories')}
                    className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-indigo-600 transition-colors mb-4">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Back to Categories
                </button>

                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-5">
                        {/* Icon / image */}
                        <div className="w-14 h-14 rounded-xl bg-indigo-50 flex items-center justify-center flex-shrink-0 overflow-hidden border border-indigo-100">
                            {category.image ? (
                                <img src={category.image} alt={displayName} className="w-full h-full object-cover" />
                            ) : (
                                <svg className="w-7 h-7 text-indigo-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                                </svg>
                            )}
                        </div>

                        <div className="flex-1 min-w-0">
                            {/* Breadcrumb */}
                            {category.parent && (
                                <div className="flex items-center gap-1 text-xs text-slate-400 mb-1">
                                    <button onClick={() => navigate(`/admin/categories/${category.parent.id}`)}
                                        className="hover:text-indigo-600 transition-colors">
                                        {getName(category.parent)}
                                    </button>
                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </div>
                            )}
                            <div className="flex flex-wrap items-center gap-2">
                                <h1 className="text-xl font-bold text-slate-800">{displayName}</h1>
                                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${category.is_active
                                    ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                                    {category.is_active ? 'Active' : 'Inactive'}
                                </span>
                            </div>
                            <p className="text-xs text-slate-400 mt-1 font-mono">/{category.slug}</p>
                        </div>

                        <div className="flex gap-3 flex-shrink-0">
                            <div className="flex flex-col items-center px-4 py-3 rounded-xl bg-indigo-50 border border-indigo-100">
                                <span className="text-xl font-bold text-indigo-700">{category.children?.length ?? 0}</span>
                                <span className="text-xs text-indigo-400 mt-0.5">Children</span>
                            </div>
                            <div className="flex flex-col items-center px-4 py-3 rounded-xl bg-slate-50 border border-slate-200">
                                <span className="text-xl font-bold text-slate-600">{category.translations?.length ?? 0}</span>
                                <span className="text-xs text-slate-400 mt-0.5">Translations</span>
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

                {/* Left — Core + Translations */}
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
                                <InfoRow label="Slug" value={category.slug} />
                                <InfoRow label="Parent" value={category.parent ? getName(category.parent) : '— Root —'} />
                                <InfoRow label="Sort Order" value={category.sort_order} />
                                <InfoRow label="Status" value={category.is_active ? 'Active' : 'Inactive'} />
                                <InfoRow label="Image URL" value={category.image} />
                            </dl>
                        ) : (
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-medium text-slate-500 mb-1">Slug <span className="text-red-400">*</span></label>
                                    <input value={coreForm.slug}
                                        onChange={e => setCoreForm(p => ({ ...p, slug: e.target.value }))}
                                        className={inputCls(coreErrors.slug)} />
                                    {coreErrors.slug && <p className="mt-1 text-xs text-red-600">{coreErrors.slug[0]}</p>}
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-slate-500 mb-1">Parent Category</label>
                                    <select value={coreForm.parent_id}
                                        onChange={e => setCoreForm(p => ({ ...p, parent_id: e.target.value }))}
                                        className={inputCls(false)}>
                                        <option value="">— Root (no parent) —</option>
                                        {parentCats.map(c => (
                                            <option key={c.id} value={c.id}>{getName(c)} ({c.slug})</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-medium text-slate-500 mb-1">Sort Order</label>
                                        <input type="number" min={0} value={coreForm.sort_order}
                                            onChange={e => setCoreForm(p => ({ ...p, sort_order: parseInt(e.target.value) || 0 }))}
                                            className={inputCls(false)} />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-slate-500 mb-1">Status</label>
                                        <select value={coreForm.is_active ? '1' : '0'}
                                            onChange={e => setCoreForm(p => ({ ...p, is_active: e.target.value === '1' }))}
                                            className={inputCls(false)}>
                                            <option value="1">Active</option>
                                            <option value="0">Inactive</option>
                                        </select>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-slate-500 mb-1">Image URL</label>
                                    <input value={coreForm.image}
                                        onChange={e => setCoreForm(p => ({ ...p, image: e.target.value }))}
                                        placeholder="https://..."
                                        className={inputCls(false)} />
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
                            !editingTrans ? (
                                <button onClick={() => setEditingTrans(true)}
                                    className="inline-flex items-center gap-1.5 text-xs font-medium text-indigo-600 hover:text-indigo-800 transition-colors">
                                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    </svg>
                                    Edit
                                </button>
                            ) : (
                                <button onClick={() => { setEditingTrans(false); setTransError(''); }}
                                    className="text-xs text-slate-400 hover:text-slate-600 font-medium transition-colors">
                                    Cancel
                                </button>
                            )
                        }
                    >
                        {/* Locale tabs */}
                        <div className="flex gap-1 mb-4 border-b border-slate-100 pb-3">
                            {LOCALES.map(({ code, label }) => {
                                const hasTrans = category.translations?.some(t => t.language_code === code);
                                return (
                                    <button key={code} onClick={() => setActiveLocale(code)}
                                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors relative ${activeLocale === code
                                            ? 'bg-indigo-600 text-white' : 'text-slate-500 hover:bg-slate-100'}`}>
                                        {label}
                                        {hasTrans && activeLocale !== code && (
                                            <span className="absolute -top-1 -right-1 w-2 h-2 bg-green-400 rounded-full" />
                                        )}
                                    </button>
                                );
                            })}
                        </div>

                        {transError && (
                            <div className="mb-3 text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2 text-sm">{transError}</div>
                        )}

                        {!editingTrans ? (
                            <div className="flex justify-between items-center py-2">
                                <dt className="text-sm text-slate-400">Name ({activeLocale})</dt>
                                <dd className="text-sm font-medium text-slate-700">
                                    {transName || <span className="italic text-slate-300">Not set</span>}
                                </dd>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                <div>
                                    <label className="block text-xs font-medium text-slate-500 mb-1">Name ({activeLocale})</label>
                                    <input value={transName}
                                        onChange={e => setTransName(e.target.value)}
                                        placeholder={`Category name in ${activeLocale}`}
                                        className={inputCls(false)} />
                                </div>
                                <button onClick={handleSaveTrans} disabled={savingTrans}
                                    className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50">
                                    {savingTrans ? 'Saving…' : `Save ${activeLocale} Name`}
                                </button>
                            </div>
                        )}
                    </Card>

                    {/* Children */}
                    {category.children && category.children.length > 0 && (
                        <Card title={`Child Categories (${category.children.length})`}>
                            <div className="space-y-2">
                                {category.children.map(child => (
                                    <button key={child.id}
                                        onClick={() => navigate(`/admin/categories/${child.id}`)}
                                        className="w-full flex items-center justify-between px-4 py-3 border border-slate-200 rounded-xl hover:border-indigo-200 hover:bg-indigo-50/50 transition-colors group">
                                        <div className="flex items-center gap-3">
                                            <span className="text-sm font-medium text-slate-700 group-hover:text-indigo-700 transition-colors">
                                                {getName(child)}
                                            </span>
                                            <span className="text-xs font-mono text-slate-400">{child.slug}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${child.is_active
                                                ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                                                {child.is_active ? 'Active' : 'Inactive'}
                                            </span>
                                            <svg className="w-4 h-4 text-slate-300 group-hover:text-indigo-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                            </svg>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </Card>
                    )}
                </div>

                {/* Right — Overview + Danger */}
                <div className="space-y-6">
                    <Card title="Overview">
                        <dl>
                            <InfoRow label="Category ID" value={`#${category.id}`} />
                            <InfoRow label="Parent" value={category.parent ? getName(category.parent) : '— Root —'} />
                            <InfoRow label="Sort Order" value={category.sort_order} />
                            <InfoRow label="Created" value={fmt(category.created_at)} />
                            <InfoRow label="Updated" value={fmt(category.updated_at)} />
                        </dl>
                    </Card>

                    {/* Danger Zone */}
                    <div className="bg-white rounded-xl border border-red-100 shadow-sm overflow-hidden">
                        <div className="px-6 py-4 border-b border-red-100">
                            <h2 className="text-sm font-semibold text-red-600">Danger Zone</h2>
                        </div>
                        <div className="px-6 py-4">
                            <p className="text-xs text-slate-500 mb-4">
                                Deleting this category will also delete all child categories and translations (cascading).
                            </p>
                            <button onClick={() => setConfirm(true)}
                                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 border border-red-200 text-red-600 hover:bg-red-50 text-sm font-medium rounded-lg transition-colors">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                                Delete Category
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {confirm && (
                <ConfirmDialog
                    message={`Are you sure you want to permanently delete "${displayName}"? All child categories will also be deleted.`}
                    onConfirm={handleDelete}
                    onCancel={() => setConfirm(false)}
                />
            )}
        </>
    );
}

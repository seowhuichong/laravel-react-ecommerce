import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../context/AdminAuthContext';

/* ── helpers ── */
const LOCALES = [
    { code: 'en-MY', label: 'EN' },
    { code: 'ms-MY', label: 'MY' },
    { code: 'zh-CN', label: 'ZH' },
];

function getName(cat, locale = 'en-MY') {
    return cat.translations?.find(t => t.language_code === locale)?.name
        ?? cat.translations?.find(t => t.language_code === 'en-MY')?.name
        ?? cat.slug;
}

/* ── Create / Edit Modal ── */
function CategoryModal({ title, initial = {}, allCategories = [], excludeId = null, onSave, onClose, saving, errors }) {
    const [form, setForm] = useState({
        slug: initial.slug ?? '',
        parent_id: initial.parent_id ?? '',
        image: initial.image ?? '',
        sort_order: initial.sort_order ?? 0,
        is_active: initial.is_active !== undefined ? initial.is_active : true,
        translations: {
            'en-MY': { name: initial.translations?.find(t => t.language_code === 'en-MY')?.name ?? '' },
            'ms-MY': { name: initial.translations?.find(t => t.language_code === 'ms-MY')?.name ?? '' },
            'zh-CN': { name: initial.translations?.find(t => t.language_code === 'zh-CN')?.name ?? '' },
        },
    });

    const parentOptions = allCategories.filter(c => c.id !== excludeId);
    const inp = (err) => `block w-full px-3 py-2 border ${err ? 'border-red-300' : 'border-slate-200'} rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500`;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col">
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 flex-shrink-0">
                    <h2 className="text-base font-semibold text-slate-800">{title}</h2>
                    <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
                    {errors.general && (
                        <div className="text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2 text-sm">{errors.general}</div>
                    )}

                    {/* Translations */}
                    <div>
                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Names</p>
                        <div className="space-y-2">
                            {LOCALES.map(({ code, label }) => (
                                <div key={code} className="flex items-center gap-2">
                                    <span className="w-8 text-xs font-bold text-slate-400 flex-shrink-0">{label}</span>
                                    <input
                                        value={form.translations[code]?.name ?? ''}
                                        onChange={e => setForm(p => ({
                                            ...p,
                                            translations: { ...p.translations, [code]: { name: e.target.value } }
                                        }))}
                                        placeholder={`Name (${code})`}
                                        className={inp(false)} />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Slug */}
                    <div>
                        <label className="block text-xs font-medium text-slate-500 mb-1">Slug <span className="text-red-400">*</span></label>
                        <input value={form.slug}
                            onChange={e => setForm(p => ({ ...p, slug: e.target.value }))}
                            placeholder="e.g. health-supplements"
                            className={inp(errors.slug)} />
                        {errors.slug && <p className="mt-1 text-xs text-red-600">{errors.slug[0]}</p>}
                    </div>

                    {/* Parent */}
                    <div>
                        <label className="block text-xs font-medium text-slate-500 mb-1">Parent Category</label>
                        <select value={form.parent_id}
                            onChange={e => setForm(p => ({ ...p, parent_id: e.target.value }))}
                            className={inp(false)}>
                            <option value="">— Root (no parent) —</option>
                            {parentOptions.map(c => (
                                <option key={c.id} value={c.id}>{getName(c)} ({c.slug})</option>
                            ))}
                        </select>
                    </div>

                    {/* Sort Order + Active */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-medium text-slate-500 mb-1">Sort Order</label>
                            <input type="number" min={0} value={form.sort_order}
                                onChange={e => setForm(p => ({ ...p, sort_order: parseInt(e.target.value) || 0 }))}
                                className={inp(false)} />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-slate-500 mb-1">Status</label>
                            <select value={form.is_active ? '1' : '0'}
                                onChange={e => setForm(p => ({ ...p, is_active: e.target.value === '1' }))}
                                className={inp(false)}>
                                <option value="1">Active</option>
                                <option value="0">Inactive</option>
                            </select>
                        </div>
                    </div>

                    {/* Image URL */}
                    <div>
                        <label className="block text-xs font-medium text-slate-500 mb-1">Image URL</label>
                        <input value={form.image}
                            onChange={e => setForm(p => ({ ...p, image: e.target.value }))}
                            placeholder="https://..."
                            className={inp(false)} />
                    </div>
                </div>

                <div className="px-6 py-4 border-t border-slate-100 flex justify-end gap-3 flex-shrink-0">
                    <button onClick={onClose}
                        className="px-4 py-2 text-sm border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors">
                        Cancel
                    </button>
                    <button onClick={() => onSave(form)} disabled={saving}
                        className="px-4 py-2 text-sm bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50">
                        {saving ? 'Saving…' : 'Save'}
                    </button>
                </div>
            </div>
        </div>
    );
}

/* ── Tree Row ── */
function CategoryRow({ cat, depth, expanded, onToggle, onView, onAddChild, childCount }) {
    const indent = depth * 20;
    return (
        <tr className="hover:bg-slate-50 transition-colors">
            {/* Name with indent */}
            <td className="px-4 py-3">
                <div className="flex items-center gap-2" style={{ paddingLeft: indent }}>
                    {childCount > 0 ? (
                        <button onClick={onToggle}
                            className="w-5 h-5 flex items-center justify-center text-slate-400 hover:text-indigo-600 transition-colors flex-shrink-0">
                            <svg className={`w-4 h-4 transition-transform ${expanded ? 'rotate-90' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    ) : (
                        <span className="w-5 h-5 flex-shrink-0 flex items-center justify-center">
                            {depth > 0 && <span className="w-1.5 h-1.5 rounded-full bg-slate-200" />}
                        </span>
                    )}
                    <span className="font-medium text-slate-800 text-sm">{getName(cat)}</span>
                    {childCount > 0 && (
                        <span className="text-xs text-slate-400 font-normal">({childCount})</span>
                    )}
                </div>
            </td>
            <td className="px-4 py-3 font-mono text-xs text-slate-400">{cat.slug}</td>
            <td className="px-4 py-3 text-xs text-slate-400 tabular-nums">{cat.sort_order}</td>
            <td className="px-4 py-3">
                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${cat.is_active
                    ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${cat.is_active ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                    {cat.is_active ? 'Active' : 'Inactive'}
                </span>
            </td>
            <td className="px-4 py-3 text-right">
                <div className="flex items-center justify-end gap-2">
                    <button onClick={onAddChild}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Child
                    </button>
                    <button onClick={onView}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors">
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        View
                    </button>
                </div>
            </td>
        </tr>
    );
}

/* ── Main Page ── */
export default function Categories() {
    const { api } = useAdminAuth();
    const navigate = useNavigate();

    const [allCats, setAllCats] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Track which nodes are expanded (by id)
    const [expanded, setExpanded] = useState(new Set());

    // Create modal state
    const [showCreate, setShowCreate] = useState(false);
    const [createInitial, setCreateInitial] = useState({});
    const [saving, setSaving] = useState(false);
    const [saveErrors, setSaveErrors] = useState({});

    const load = () => {
        setLoading(true);
        api.get('/api/admin/categories')
            .then(res => setAllCats(res.data.categories))
            .catch(() => setError('Failed to load categories.'))
            .finally(() => setLoading(false));
    };

    useEffect(() => { load(); }, []);

    const handleCreate = async (form) => {
        setSaving(true);
        setSaveErrors({});
        try {
            await api.post('/api/admin/categories', {
                ...form,
                parent_id: form.parent_id || null,
            });
            setShowCreate(false);
            load();
        } catch (err) {
            if (err.response?.data?.errors) setSaveErrors(err.response.data.errors);
            else setSaveErrors({ general: err.response?.data?.message || 'Create failed.' });
        } finally {
            setSaving(false);
        }
    };

    const toggleExpanded = (id) => {
        setExpanded(prev => {
            const next = new Set(prev);
            next.has(id) ? next.delete(id) : next.add(id);
            return next;
        });
    };

    /* Build flat list with depth for rendering */
    const buildRows = (cats, parentId = null, depth = 0) => {
        const rows = [];
        const children = cats.filter(c => (c.parent_id ?? null) === parentId);
        for (const cat of children) {
            const grandChildren = cats.filter(c => c.parent_id === cat.id);
            rows.push({ cat, depth, childCount: grandChildren.length });
            if (expanded.has(cat.id)) {
                rows.push(...buildRows(cats, cat.id, depth + 1));
            }
        }
        return rows;
    };

    const rows = buildRows(allCats);
    const rootCount = allCats.filter(c => !c.parent_id).length;

    return (
        <div>
            {/* Header */}
            <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                    <h1 className="text-xl font-bold text-slate-800">Categories</h1>
                    <p className="text-sm text-slate-500 mt-0.5">
                        {loading ? 'Loading…' : `${allCats.length} categories · ${rootCount} root level`}
                    </p>
                </div>
                <button
                    onClick={() => { setCreateInitial({}); setShowCreate(true); setSaveErrors({}); }}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Add Category
                </button>
            </div>

            {error && (
                <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm flex justify-between">
                    <span>{error}</span>
                    <button onClick={() => setError('')}>✕</button>
                </div>
            )}

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-slate-50 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">
                                <th className="px-4 py-3">Name</th>
                                <th className="px-4 py-3">Slug</th>
                                <th className="px-4 py-3">Order</th>
                                <th className="px-4 py-3">Status</th>
                                <th className="px-4 py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {loading ? (
                                <tr>
                                    <td colSpan={5} className="px-4 py-10 text-center">
                                        <div className="flex justify-center">
                                            <div className="w-5 h-5 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin" />
                                        </div>
                                    </td>
                                </tr>
                            ) : rows.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-4 py-10 text-center text-slate-400">
                                        No categories found. Click "Add Category" to create one.
                                    </td>
                                </tr>
                            ) : (
                                rows.map(({ cat, depth, childCount }) => (
                                    <CategoryRow
                                        key={cat.id}
                                        cat={cat}
                                        depth={depth}
                                        childCount={childCount}
                                        expanded={expanded.has(cat.id)}
                                        onToggle={() => toggleExpanded(cat.id)}
                                        onView={() => navigate(`/admin/categories/${cat.id}`)}
                                        onAddChild={() => {
                                            setCreateInitial({ parent_id: cat.id });
                                            setSaveErrors({});
                                            setShowCreate(true);
                                        }}
                                    />
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Create Modal */}
            {showCreate && (
                <CategoryModal
                    title="Add Category"
                    initial={createInitial}
                    allCategories={allCats}
                    onSave={handleCreate}
                    onClose={() => setShowCreate(false)}
                    saving={saving}
                    errors={saveErrors}
                />
            )}
        </div>
    );
}

import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useLocale } from '../context/LocaleContext';
import SEO from '../components/SEO';
import { ChevronRight, SlidersHorizontal, Package } from 'lucide-react';

/* ── helpers ── */
const myr = (v) => `RM ${Number(v || 0).toFixed(2)}`;

const SORT_OPTIONS = [
    { value: 'default', label: 'Featured' },
    { value: 'price_asc', label: 'Price: Low → High' },
    { value: 'price_desc', label: 'Price: High → Low' },
    { value: 'newest', label: 'Newest' },
];

/* ── Product Card ── */
function ProductCard({ product, locale }) {
    const hasDiscount = Number(product.product_retail_price) > Number(product.product_price);
    const discount = hasDiscount
        ? Math.round(((product.product_retail_price - product.product_price) / product.product_retail_price) * 100)
        : 0;

    return (
        <Link
            to={`/${locale}/product/${product.product_friendly_url}`}
            className="group bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-lg hover:border-red-100 transition-all duration-300"
        >
            {/* Image */}
            <div className="relative aspect-square bg-gray-50 overflow-hidden">
                {hasDiscount && (
                    <span className="absolute top-2 left-2 z-10 bg-red-600 text-white text-xs font-bold px-2 py-0.5 rounded">
                        -{discount}%
                    </span>
                )}
                {product.product_image ? (
                    <img
                        src={product.product_image}
                        alt={product.product_name}
                        className="w-full h-full object-contain p-4 transition-transform duration-300 group-hover:scale-105"
                        onError={e => { e.target.src = '/images/placeholders/product-placeholder.png'; }}
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center">
                        <Package className="w-12 h-12 text-gray-200" />
                    </div>
                )}
            </div>

            {/* Info */}
            <div className="p-3">
                <h3 className="text-sm font-medium text-gray-800 line-clamp-2 group-hover:text-red-600 transition-colors min-h-[2.5rem]">
                    {product.product_name}
                </h3>
                <div className="mt-2 flex items-baseline gap-2">
                    <span className="text-base font-bold text-red-600">{myr(product.product_price)}</span>
                    {hasDiscount && (
                        <span className="text-xs text-gray-400 line-through">{myr(product.product_retail_price)}</span>
                    )}
                </div>
            </div>
        </Link>
    );
}

/* ── Skeleton Card ── */
function SkeletonCard() {
    return (
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden animate-pulse">
            <div className="aspect-square bg-gray-100" />
            <div className="p-3 space-y-2">
                <div className="h-3 bg-gray-100 rounded w-full" />
                <div className="h-3 bg-gray-100 rounded w-3/4" />
                <div className="h-4 bg-gray-100 rounded w-1/3 mt-2" />
            </div>
        </div>
    );
}

/* ── Main Page ── */
export default function CategoryPage() {
    const { locale, friendly_url } = useParams();
    const navigate = useNavigate();
    const { locale: ctxLocale } = useLocale();
    const activeLocale = locale ?? ctxLocale;

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [sort, setSort] = useState('default');
    const [page, setPage] = useState(1);

    const load = useCallback(() => {
        setLoading(true);
        setError('');
        axios.get(`/api/${activeLocale}/categories/${friendly_url}`, { params: { sort, page } })
            .then(res => setData(res.data))
            .catch(err => {
                if (err.response?.status === 404) navigate(`/${activeLocale}`);
                else setError('Failed to load category. Please try again.');
            })
            .finally(() => setLoading(false));
    }, [activeLocale, friendly_url, sort, page]);

    useEffect(() => {
        setPage(1);
    }, [friendly_url, sort]);

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        load();
    }, [load]);

    /* ── Loading skeleton ── */
    if (loading && !data) {
        return (
            <div className="min-h-screen bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 py-8">
                    {/* Breadcrumb skeleton */}
                    <div className="flex gap-2 mb-6 animate-pulse">
                        {[1, 2, 3].map(i => <div key={i} className="h-4 bg-gray-200 rounded w-20" />)}
                    </div>
                    {/* Header skeleton */}
                    <div className="h-8 bg-gray-200 rounded w-48 mb-8 animate-pulse" />
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-red-500 mb-4">{error}</p>
                    <button onClick={load} className="text-sm text-red-600 underline">Retry</button>
                </div>
            </div>
        );
    }

    const { category, breadcrumb = [], subcategories = [], products } = data ?? {};

    return (
        <>
            <SEO
                title={`${category?.name} | Products`}
                description={`Browse ${category?.name} products`}
                path={`/categories/${friendly_url}`}
            />

            <div className="min-h-screen bg-gray-50">
                {/* ── Category Banner ── */}
                {category?.image && (
                    <div className="relative h-40 md:h-56 overflow-hidden bg-gray-200">
                        <img
                            src={category.image}
                            alt={category.name}
                            className="w-full h-full object-cover"
                            onError={e => { e.target.style.display = 'none'; }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent flex items-center">
                            <div className="max-w-7xl mx-auto px-4 w-full">
                                <h1 className="text-3xl md:text-4xl font-bold text-white">{category?.name}</h1>
                            </div>
                        </div>
                    </div>
                )}

                <div className="max-w-7xl mx-auto px-4 py-6">
                    {/* ── Breadcrumb ── */}
                    <nav className="flex items-center gap-1 text-sm text-gray-500 mb-6 flex-wrap">
                        <Link to={`/${activeLocale}`} className="hover:text-red-600 transition-colors">Home</Link>
                        {breadcrumb.map((crumb, i) => (
                            <React.Fragment key={crumb.slug}>
                                <ChevronRight className="w-4 h-4 flex-shrink-0" />
                                {i < breadcrumb.length - 1 ? (
                                    <Link
                                        to={`/${activeLocale}/categories/${crumb.slug}`}
                                        className="hover:text-red-600 transition-colors"
                                    >
                                        {crumb.name}
                                    </Link>
                                ) : (
                                    <span className="text-gray-900 font-medium">{crumb.name}</span>
                                )}
                            </React.Fragment>
                        ))}
                    </nav>

                    {/* ── Page heading (no banner) ── */}
                    {!category?.image && (
                        <h1 className="text-2xl font-bold text-gray-900 mb-6">{category?.name}</h1>
                    )}

                    {/* ── Sub-category chips ── */}
                    {subcategories.length > 0 && (
                        <div className="flex gap-2 flex-wrap mb-6">
                            {subcategories.map(sub => (
                                <Link
                                    key={sub.id}
                                    to={`/${activeLocale}/categories/${sub.slug}`}
                                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-gray-200 bg-white text-sm font-medium text-gray-700 hover:border-red-300 hover:text-red-600 hover:bg-red-50 transition-colors"
                                >
                                    {sub.name}
                                    <ChevronRight className="w-3.5 h-3.5" />
                                </Link>
                            ))}
                        </div>
                    )}

                    {/* ── Toolbar ── */}
                    <div className="flex items-center justify-between mb-5 gap-4">
                        <p className="text-sm text-gray-500">
                            {loading ? '…' : `${products?.total ?? 0} product${products?.total !== 1 ? 's' : ''}`}
                        </p>
                        <div className="flex items-center gap-2">
                            <SlidersHorizontal className="w-4 h-4 text-gray-400" />
                            <select
                                value={sort}
                                onChange={e => setSort(e.target.value)}
                                className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-red-500"
                            >
                                {SORT_OPTIONS.map(o => (
                                    <option key={o.value} value={o.value}>{o.label}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* ── Product Grid ── */}
                    {loading ? (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
                        </div>
                    ) : (products?.data?.length ?? 0) === 0 ? (
                        <div className="py-24 text-center">
                            <Package className="w-16 h-16 text-gray-200 mx-auto mb-4" />
                            <p className="text-gray-400 text-lg font-medium">No products found in this category.</p>
                            <p className="text-gray-400 text-sm mt-1">Try browsing a sub-category above.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {products.data.map(p => (
                                <ProductCard key={p.products_id} product={p} locale={activeLocale} />
                            ))}
                        </div>
                    )}

                    {/* ── Pagination ── */}
                    {(products?.last_page ?? 1) > 1 && (
                        <div className="flex items-center justify-center gap-2 mt-10">
                            <button
                                disabled={page <= 1}
                                onClick={() => setPage(p => p - 1)}
                                className="px-4 py-2 text-sm border border-gray-200 rounded-lg bg-white hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                            >
                                ← Previous
                            </button>

                            {/* Page numbers — show up to 7 */}
                            {Array.from({ length: products.last_page }, (_, i) => i + 1)
                                .filter(n => n === 1 || n === products.last_page || Math.abs(n - page) <= 2)
                                .reduce((acc, n, i, arr) => {
                                    if (i > 0 && n - arr[i - 1] > 1) acc.push('…');
                                    acc.push(n);
                                    return acc;
                                }, [])
                                .map((item, i) =>
                                    item === '…' ? (
                                        <span key={`ellipsis-${i}`} className="px-2 text-gray-400">…</span>
                                    ) : (
                                        <button
                                            key={item}
                                            onClick={() => setPage(item)}
                                            className={`w-9 h-9 text-sm rounded-lg border font-medium transition-colors ${item === page
                                                ? 'bg-red-600 border-red-600 text-white'
                                                : 'border-gray-200 bg-white text-gray-700 hover:bg-red-50 hover:border-red-200'}`}
                                        >
                                            {item}
                                        </button>
                                    )
                                )
                            }

                            <button
                                disabled={page >= products.last_page}
                                onClick={() => setPage(p => p + 1)}
                                className="px-4 py-2 text-sm border border-gray-200 rounded-lg bg-white hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                            >
                                Next →
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

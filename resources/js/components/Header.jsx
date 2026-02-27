import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLocale } from '../context/LocaleContext';
import { useAuth } from '../context/AuthContext';
import { useCategories } from '../context/CategoryContext';
import {
    Search, MapPin, User, Heart, ShoppingCart,
    ChevronDown, ChevronRight, Menu, X
} from 'lucide-react';

/* ── Desktop Mega Menu Panel (rendered inside <nav>, spans full width) ──── */
function MegaMenu({ category, locale, onClose }) {
    const [activeL2, setActiveL2] = useState(category.children?.[0] ?? null);

    // Reset active L2 when category changes
    useEffect(() => {
        setActiveL2(category.children?.[0] ?? null);
    }, [category.id]);

    return (
        <div className="absolute left-0 right-0 top-full z-50 bg-white shadow-2xl border-t-2 border-red-600">
            <div className="max-w-7xl mx-auto flex" style={{ minHeight: 200 }}>
                {/* L2 sidebar */}
                <div className="w-64 flex-shrink-0 bg-gray-50 border-r border-gray-200 py-4 overflow-y-auto" style={{ maxHeight: 420 }}>
                    {category.children?.map(l2 => (
                        <div
                            key={l2.id}
                            onMouseEnter={() => setActiveL2(l2)}
                            className={`flex items-center justify-between px-5 py-2.5 cursor-pointer transition-colors
                                ${activeL2?.id === l2.id
                                    ? 'bg-white text-red-600 font-semibold border-r-2 border-red-600'
                                    : 'text-gray-700 hover:bg-white hover:text-red-600'}`}
                        >
                            <Link
                                to={`/${locale}/category/${l2.slug}`}
                                onClick={onClose}
                                className="flex-1 text-sm"
                            >
                                {l2.name}
                            </Link>
                            {l2.children?.length > 0 && (
                                <ChevronRight className="w-3.5 h-3.5 flex-shrink-0 ml-1 opacity-40" />
                            )}
                        </div>
                    ))}
                </div>

                {/* L3 content area */}
                <div className="flex-1 p-6">
                    {activeL2?.children?.length > 0 ? (
                        <>
                            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">
                                {activeL2.name}
                            </p>
                            <div className="grid grid-cols-3 gap-1">
                                {activeL2.children.map(l3 => (
                                    <Link
                                        key={l3.id}
                                        to={`/${locale}/category/${l3.slug}`}
                                        onClick={onClose}
                                        className="block px-3 py-2 text-sm text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                    >
                                        {l3.name}
                                    </Link>
                                ))}
                            </div>
                        </>
                    ) : activeL2 ? (
                        <div className="flex items-center justify-center h-full text-gray-400 text-sm">
                            <Link
                                to={`/${locale}/category/${activeL2.slug}`}
                                onClick={onClose}
                                className="text-red-600 hover:underline font-medium"
                            >
                                View all {activeL2.name}
                            </Link>
                        </div>
                    ) : null}
                </div>
            </div>
        </div>
    );
}

/* ── Mobile Category Accordion ──────────────────────────────────────────── */
function MobileCategoryItem({ category, locale, depth = 0, onClose }) {
    const [open, setOpen] = useState(false);
    const hasChildren = category.children?.length > 0;

    return (
        <li>
            <div
                className="flex items-center justify-between border-b border-gray-100"
                style={{ paddingLeft: `${16 + depth * 16}px` }}
            >
                <Link
                    to={`/${locale}/category/${category.slug}`}
                    onClick={onClose}
                    className="flex-1 py-3 pr-2 text-sm text-gray-800 font-medium"
                >
                    {category.name}
                </Link>
                {hasChildren && (
                    <button onClick={() => setOpen(o => !o)} className="px-4 py-3 text-gray-400">
                        <ChevronDown className={`w-4 h-4 transition-transform ${open ? 'rotate-180' : ''}`} />
                    </button>
                )}
            </div>
            {hasChildren && open && (
                <ul className="bg-gray-50">
                    {category.children.map(child => (
                        <MobileCategoryItem
                            key={child.id}
                            category={child}
                            locale={locale}
                            depth={depth + 1}
                            onClose={onClose}
                        />
                    ))}
                </ul>
            )}
        </li>
    );
}

/* ── Header ─────────────────────────────────────────────────────────────── */
function Header() {
    const { locale } = useLocale();
    const { user, logout } = useAuth();
    const { categories } = useCategories();

    const [searchQuery, setSearchQuery] = useState('');
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [showMobileMenu, setShowMobileMenu] = useState(false);
    const [showMobileSearch, setShowMobileSearch] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [activeCategory, setActiveCategory] = useState(null); // the full category object

    const navigate = useNavigate();
    const userMenuRef = useRef(null);
    const navRef = useRef(null);
    const closeTimer = useRef(null);

    /* scroll */
    useEffect(() => {
        const onScroll = () => setIsScrolled(window.scrollY > 50);
        window.addEventListener('scroll', onScroll);
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    /* outside click for user menu */
    useEffect(() => {
        const handler = (e) => {
            if (userMenuRef.current && !userMenuRef.current.contains(e.target))
                setShowUserMenu(false);
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    /* click outside nav closes mega menu */
    useEffect(() => {
        const handler = (e) => {
            if (navRef.current && !navRef.current.contains(e.target))
                setActiveCategory(null);
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    /* body scroll lock for mobile */
    useEffect(() => {
        document.body.style.overflow = showMobileMenu ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [showMobileMenu]);

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/${locale}/search?q=${searchQuery}`);
            setShowMobileSearch(false);
        }
    };

    const handleLogout = async () => {
        await logout();
        setShowUserMenu(false);
        setShowMobileMenu(false);
        navigate(`/${locale}`);
    };

    /* hover with delay to allow diagonal cursor movement */
    const openMega = useCallback((cat) => {
        clearTimeout(closeTimer.current);
        if (cat.children?.length > 0) setActiveCategory(cat);
        else setActiveCategory(null);
    }, []);

    const closeMega = useCallback(() => {
        closeTimer.current = setTimeout(() => setActiveCategory(null), 120);
    }, []);

    const keepMega = useCallback(() => {
        clearTimeout(closeTimer.current);
    }, []);

    return (
        <header className="w-full">
            {/* Promo Banner */}
            <div className={`bg-red-600 text-white text-center py-2 px-4 text-xs sm:text-sm transition-all duration-300 ${isScrolled ? 'h-0 py-0 opacity-0 overflow-hidden' : 'opacity-100'}`}>
                Free Shipping for Orders above RM100 (Discount Capped at RM6).
            </div>

            {/* Sticky wrapper */}
            <div className={`transition-all duration-300 bg-white ${isScrolled ? 'fixed top-0 left-0 right-0 z-50 shadow-md' : 'relative'}`}>

                {/* ── Main Header Row ── */}
                <div className="border-b border-gray-200">
                    <div className="max-w-7xl mx-auto px-4 py-3 sm:py-4">
                        <div className="flex items-center justify-between gap-2 sm:gap-4 lg:gap-6">
                            {/* Hamburger */}
                            <button onClick={() => setShowMobileMenu(true)} className="lg:hidden text-gray-700 p-1">
                                <Menu className="w-6 h-6" />
                            </button>

                            {/* Logo */}
                            <Link to={`/${locale}`} className="flex-shrink-0">
                                <img src="/images/logo.png" alt="Logo" className="h-8 sm:h-10 lg:h-12" />
                            </Link>

                            {/* Desktop Search */}
                            <form onSubmit={handleSearch} className="hidden lg:flex flex-1 max-w-3xl">
                                <div className="flex items-center border border-gray-300 rounded-md overflow-hidden w-full">
                                    <input
                                        type="text"
                                        value={searchQuery}
                                        onChange={e => setSearchQuery(e.target.value)}
                                        placeholder="What are you looking for?"
                                        className="flex-1 px-4 py-3 text-sm focus:outline-none"
                                    />
                                    <button type="submit" className="bg-gray-100 hover:bg-gray-200 px-6 py-3 transition-colors">
                                        <Search className="w-5 h-5 text-gray-700" />
                                    </button>
                                </div>
                            </form>

                            {/* Right icons */}
                            <div className="flex items-center gap-3 sm:gap-4 lg:gap-6">
                                <button onClick={() => setShowMobileSearch(s => !s)} className="lg:hidden text-gray-700">
                                    <Search className="w-5 h-5 sm:w-6 sm:h-6" />
                                </button>

                                <Link to={`/${locale}/stores`} className="hidden md:flex items-center gap-2 text-sm text-gray-700 hover:text-red-600 transition-colors">
                                    <MapPin className="w-5 h-5" />
                                    <span className="hidden lg:inline">Find a store</span>
                                </Link>

                                {/* User */}
                                <div className="relative" ref={userMenuRef}>
                                    {user ? (
                                        <>
                                            <button onClick={() => setShowUserMenu(s => !s)}
                                                className="flex items-center gap-1 sm:gap-2 text-sm text-gray-700 hover:text-red-600 transition-colors">
                                                <User className="w-5 h-5 sm:w-6 sm:h-6" />
                                                <span className="hidden lg:inline">{user.name.split(' ')[0]}</span>
                                                <ChevronDown className="w-3 h-3 hidden lg:inline" />
                                            </button>
                                            {showUserMenu && (
                                                <div className="absolute right-0 top-full mt-2 w-56 bg-white shadow-lg rounded-lg border border-gray-200 py-2 z-50">
                                                    <div className="px-4 py-3 border-b border-gray-100">
                                                        <p className="text-sm font-medium text-gray-900">{user.name}</p>
                                                        <p className="text-xs text-gray-500 truncate">{user.email}</p>
                                                    </div>
                                                    {[
                                                        [`/${locale}/account`, 'My Account'],
                                                        [`/${locale}/orders`, 'My Orders'],
                                                        [`/${locale}/wishlist`, 'Wishlist'],
                                                    ].map(([to, label]) => (
                                                        <Link key={to} to={to} onClick={() => setShowUserMenu(false)}
                                                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">{label}</Link>
                                                    ))}
                                                    <button onClick={handleLogout}
                                                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 border-t border-gray-100 mt-1">
                                                        Logout
                                                    </button>
                                                </div>
                                            )}
                                        </>
                                    ) : (
                                        <Link to={`/${locale}/login`} className="flex items-center gap-1 sm:gap-2 text-sm text-gray-700 hover:text-red-600 transition-colors">
                                            <User className="w-5 h-5 sm:w-6 sm:h-6" />
                                            <span className="hidden lg:inline">Sign in / Register</span>
                                        </Link>
                                    )}
                                </div>

                                <Link to={`/${locale}/wishlist`} className="hidden sm:block text-gray-700 hover:text-red-600 transition-colors">
                                    <Heart className="w-5 h-5 sm:w-6 sm:h-6" />
                                </Link>

                                <Link to={`/${locale}/cart`} className="relative text-gray-700 hover:text-red-600 transition-colors">
                                    <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6" />
                                    <span className="absolute -top-2 -right-2 bg-red-600 text-white text-[10px] sm:text-xs rounded-full w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center">0</span>
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Mobile search */}
                    {showMobileSearch && (
                        <div className="lg:hidden px-4 pb-3">
                            <form onSubmit={handleSearch}>
                                <div className="flex items-center border border-gray-300 rounded-md overflow-hidden">
                                    <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                                        placeholder="What are you looking for?"
                                        autoFocus
                                        className="flex-1 px-4 py-2.5 text-sm focus:outline-none" />
                                    <button type="submit" className="bg-gray-100 hover:bg-gray-200 px-4 py-2.5 transition-colors">
                                        <Search className="w-5 h-5 text-gray-700" />
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}
                </div>

                {/* ── Desktop Category Nav ── */}
                {/* position:relative here so the mega panel anchors directly below this nav bar */}
                <nav ref={navRef} className="hidden lg:block bg-white border-b border-gray-200 relative">
                    <div className="max-w-7xl mx-auto px-4">
                        <ul className="flex items-center text-sm font-medium">
                            {categories.map(cat => (
                                <li
                                    key={cat.id}
                                    className="relative flex-shrink-0"
                                    onMouseEnter={() => openMega(cat)}
                                    onMouseLeave={closeMega}
                                >
                                    <Link
                                        to={`/${locale}/category/${cat.slug}`}
                                        className={`flex items-center gap-1.5 py-4 px-4 transition-colors whitespace-nowrap
                                            ${activeCategory?.id === cat.id
                                                ? 'text-red-600'
                                                : 'text-gray-800 hover:text-red-600'}`}
                                    >
                                        {cat.name}
                                        {cat.children?.length > 0 && (
                                            <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${activeCategory?.id === cat.id ? 'rotate-180' : ''}`} />
                                        )}
                                    </Link>

                                    {/* Active underline indicator */}
                                    {activeCategory?.id === cat.id && (
                                        <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-600" />
                                    )}
                                </li>
                            ))}

                            <li className="flex-shrink-0 ml-auto">
                                <Link
                                    to={`/${locale}/member-benefits`}
                                    className="block py-4 px-4 text-gray-800 hover:text-red-600 transition-colors whitespace-nowrap"
                                >
                                    Member Benefits
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Single mega-menu panel anchored to the nav — appears below the nav bar */}
                    {activeCategory && activeCategory.children?.length > 0 && (
                        <div onMouseEnter={keepMega} onMouseLeave={closeMega}>
                            <MegaMenu
                                category={activeCategory}
                                locale={locale}
                                onClose={() => setActiveCategory(null)}
                            />
                        </div>
                    )}
                </nav>
            </div>

            {/* ── Mobile Menu Overlay ── */}
            {showMobileMenu && (
                <div className="fixed inset-0 z-50 lg:hidden">
                    <div className="absolute inset-0 bg-black/50" onClick={() => setShowMobileMenu(false)} />
                    <div className="absolute top-0 left-0 bottom-0 w-80 max-w-[85vw] bg-white shadow-xl flex flex-col">
                        {/* Header */}
                        <div className="flex items-center justify-between p-4 border-b border-gray-200 flex-shrink-0">
                            <h2 className="text-base font-semibold text-gray-900">Menu</h2>
                            <button onClick={() => setShowMobileMenu(false)} className="text-gray-500 hover:text-gray-700 p-1">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        {/* User */}
                        <div className="p-4 border-b border-gray-200 bg-gray-50 flex-shrink-0">
                            {user ? (
                                <div>
                                    <p className="text-sm font-medium text-gray-900">{user.name}</p>
                                    <p className="text-xs text-gray-500 truncate">{user.email}</p>
                                </div>
                            ) : (
                                <Link to={`/${locale}/login`} onClick={() => setShowMobileMenu(false)}
                                    className="flex items-center gap-2 text-sm font-medium text-red-600">
                                    <User className="w-5 h-5" /> Sign in / Register
                                </Link>
                            )}
                        </div>

                        {/* Scrollable nav */}
                        <div className="flex-1 overflow-y-auto">
                            <ul>
                                {categories.map(cat => (
                                    <MobileCategoryItem
                                        key={cat.id}
                                        category={cat}
                                        locale={locale}
                                        onClose={() => setShowMobileMenu(false)}
                                    />
                                ))}
                                <li>
                                    <Link to={`/${locale}/member-benefits`} onClick={() => setShowMobileMenu(false)}
                                        className="block px-4 py-3 text-sm font-medium text-gray-800 hover:bg-gray-50 border-b border-gray-100">
                                        Member Benefits
                                    </Link>
                                </li>
                            </ul>

                            {/* Bottom links */}
                            <div className="p-4 space-y-1 mt-2">
                                <Link to={`/${locale}/stores`} onClick={() => setShowMobileMenu(false)}
                                    className="flex items-center gap-3 py-2 px-3 text-sm text-gray-700 hover:bg-gray-50 rounded-lg">
                                    <MapPin className="w-4 h-4" /> Find a store
                                </Link>
                                {user && (
                                    <>
                                        <Link to={`/${locale}/account`} onClick={() => setShowMobileMenu(false)}
                                            className="block py-2 px-3 text-sm text-gray-700 hover:bg-gray-50 rounded-lg">My Account</Link>
                                        <Link to={`/${locale}/orders`} onClick={() => setShowMobileMenu(false)}
                                            className="block py-2 px-3 text-sm text-gray-700 hover:bg-gray-50 rounded-lg">My Orders</Link>
                                        <button onClick={handleLogout}
                                            className="w-full text-left py-2 px-3 text-sm text-red-600 hover:bg-red-50 rounded-lg font-medium">Logout</button>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Spacer when header is fixed */}
            {isScrolled && <div className="h-[108px] sm:h-[116px] lg:h-[140px]" />}
        </header>
    );
}

export default Header;
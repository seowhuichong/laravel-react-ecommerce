import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLocale } from '../context/LocaleContext';
import { useAuth } from '../context/AuthContext';
import {
    Search,
    MapPin,
    User,
    Heart,
    ShoppingCart,
    ChevronDown,
    Menu,
    X
} from 'lucide-react';

function Header() {
    const { locale } = useLocale();
    const { user, logout } = useAuth();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All Categories');
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [showMobileMenu, setShowMobileMenu] = useState(false);
    const [showMobileSearch, setShowMobileSearch] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const navigate = useNavigate();
    const userMenuRef = useRef(null);

    // Handle scroll to hide promo banner and make header sticky
    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 50) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close user menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
                setShowUserMenu(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Prevent body scroll when mobile menu is open
    useEffect(() => {
        if (showMobileMenu) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [showMobileMenu]);

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/${locale}/search?q=${searchQuery}&category=${selectedCategory}`);
            setShowMobileSearch(false);
        }
    };

    const handleLogout = async () => {
        await logout();
        setShowUserMenu(false);
        setShowMobileMenu(false);
        navigate(`/${locale}`);
    };

    const categories = [
        'All Categories',
        'Supplement',
        'Food & Beverage',
        'Medical Supplies',
        'Mom & Baby',
        'Skin Care',
        'Personal Care'
    ];

    return (
        <header className="w-full">
            {/* Promo Banner - Hidden when scrolled */}
            <div
                className={`bg-red-600 text-white text-center py-2 px-4 text-xs sm:text-sm transition-all duration-300 ${isScrolled ? 'h-0 py-0 opacity-0 overflow-hidden' : 'h-auto opacity-100'
                    }`}
            >
                Free Shipping for Orders above RM100 (Discount Capped at RM6).
            </div>

            {/* Sticky Container for Main Header and Nav */}
            <div
                className={`transition-all duration-300 bg-white ${isScrolled ? 'fixed top-0 left-0 right-0 z-50 shadow-md' : 'relative'
                    }`}
            >
                {/* Main Header */}
                <div className="border-b border-gray-200">
                    <div className="max-w-7xl mx-auto px-4 py-3 sm:py-4">
                        <div className="flex items-center justify-between gap-2 sm:gap-4 lg:gap-6">
                            {/* Mobile Menu Button */}
                            <button
                                onClick={() => setShowMobileMenu(!showMobileMenu)}
                                className="lg:hidden text-gray-700 p-1"
                            >
                                <Menu className="w-6 h-6" />
                            </button>

                            {/* Logo */}
                            <Link to={`/${locale}`} className="flex-shrink-0">
                                <img
                                    src="/images/logo.png"
                                    alt="BIG Pharmacy"
                                    className="h-8 sm:h-10 lg:h-12"
                                />
                            </Link>

                            {/* Desktop Search Bar */}
                            <form onSubmit={handleSearch} className="hidden lg:flex flex-1 max-w-3xl">
                                <div className="flex items-center border border-gray-300 rounded-md overflow-hidden w-full">
                                    {/* Category Dropdown */}
                                    <div className="relative">
                                        <select
                                            value={selectedCategory}
                                            onChange={(e) => setSelectedCategory(e.target.value)}
                                            className="appearance-none bg-gray-50 border-r border-gray-300 px-4 py-3 pr-10 text-sm focus:outline-none cursor-pointer"
                                        >
                                            {categories.map((cat) => (
                                                <option key={cat} value={cat}>
                                                    {cat}
                                                </option>
                                            ))}
                                        </select>
                                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600 pointer-events-none" />
                                    </div>

                                    {/* Search Input */}
                                    <input
                                        type="text"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        placeholder="What are you looking for?"
                                        className="flex-1 px-4 py-3 text-sm focus:outline-none"
                                    />

                                    {/* Search Button */}
                                    <button
                                        type="submit"
                                        className="bg-gray-100 hover:bg-gray-200 px-6 py-3 transition-colors"
                                    >
                                        <Search className="w-5 h-5 text-gray-700" />
                                    </button>
                                </div>
                            </form>

                            {/* Right Icons */}
                            <div className="flex items-center gap-3 sm:gap-4 lg:gap-6">
                                {/* Mobile Search Button */}
                                <button
                                    onClick={() => setShowMobileSearch(!showMobileSearch)}
                                    className="lg:hidden text-gray-700"
                                >
                                    <Search className="w-5 h-5 sm:w-6 sm:h-6" />
                                </button>

                                {/* Find a Store - Hidden on mobile */}
                                <Link
                                    to={`/${locale}/stores`}
                                    className="hidden md:flex items-center gap-2 text-sm text-gray-700 hover:text-red-600 transition-colors"
                                >
                                    <MapPin className="w-5 h-5" />
                                    <span className="hidden lg:inline">Find a store</span>
                                </Link>

                                {/* User Menu */}
                                <div className="relative" ref={userMenuRef}>
                                    {user ? (
                                        <>
                                            <button
                                                onClick={() => setShowUserMenu(!showUserMenu)}
                                                className="flex items-center gap-1 sm:gap-2 text-sm text-gray-700 hover:text-red-600 transition-colors"
                                            >
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
                                                    <Link
                                                        to={`/${locale}/account`}
                                                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                                        onClick={() => setShowUserMenu(false)}
                                                    >
                                                        My Account
                                                    </Link>
                                                    <Link
                                                        to={`/${locale}/orders`}
                                                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                                        onClick={() => setShowUserMenu(false)}
                                                    >
                                                        My Orders
                                                    </Link>
                                                    <Link
                                                        to={`/${locale}/wishlist`}
                                                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                                        onClick={() => setShowUserMenu(false)}
                                                    >
                                                        Wishlist
                                                    </Link>
                                                    <button
                                                        onClick={handleLogout}
                                                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 border-t border-gray-100 mt-1"
                                                    >
                                                        Logout
                                                    </button>
                                                </div>
                                            )}
                                        </>
                                    ) : (
                                        <Link
                                            to={`/${locale}/login`}
                                            className="flex items-center gap-1 sm:gap-2 text-sm text-gray-700 hover:text-red-600 transition-colors"
                                        >
                                            <User className="w-5 h-5 sm:w-6 sm:h-6" />
                                            <span className="hidden lg:inline">Sign in/ Register</span>
                                        </Link>
                                    )}
                                </div>

                                {/* Wishlist - Hidden on smallest mobile */}
                                <Link
                                    to={`/${locale}/wishlist`}
                                    className="hidden sm:block text-gray-700 hover:text-red-600 transition-colors"
                                >
                                    <Heart className="w-5 h-5 sm:w-6 sm:h-6" />
                                </Link>

                                {/* Cart */}
                                <Link
                                    to={`/${locale}/cart`}
                                    className="relative text-gray-700 hover:text-red-600 transition-colors"
                                >
                                    <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6" />
                                    <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center text-[10px] sm:text-xs">
                                        0
                                    </span>
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Mobile Search Bar (Toggleable) */}
                    {showMobileSearch && (
                        <div className="lg:hidden px-4 pb-3">
                            <form onSubmit={handleSearch}>
                                <div className="flex flex-col gap-2">
                                    {/* Category Dropdown */}
                                    <div className="relative">
                                        <select
                                            value={selectedCategory}
                                            onChange={(e) => setSelectedCategory(e.target.value)}
                                            className="w-full appearance-none bg-gray-50 border border-gray-300 rounded-md px-4 py-2.5 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                                        >
                                            {categories.map((cat) => (
                                                <option key={cat} value={cat}>
                                                    {cat}
                                                </option>
                                            ))}
                                        </select>
                                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600 pointer-events-none" />
                                    </div>

                                    {/* Search Input with Button */}
                                    <div className="flex items-center border border-gray-300 rounded-md overflow-hidden">
                                        <input
                                            type="text"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            placeholder="What are you looking for?"
                                            className="flex-1 px-4 py-2.5 text-sm focus:outline-none"
                                        />
                                        <button
                                            type="submit"
                                            className="bg-gray-100 hover:bg-gray-200 px-4 py-2.5 transition-colors"
                                        >
                                            <Search className="w-5 h-5 text-gray-700" />
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    )}
                </div>

                {/* Desktop Navigation Menu */}
                <nav className="hidden lg:block bg-white border-b border-gray-200">
                    <div className="max-w-7xl mx-auto px-4">
                        <ul className="flex items-center gap-8 text-sm font-medium">
                            <li className="relative group">
                                <button className="flex items-center gap-2 py-4 text-gray-800 hover:text-red-600 transition-colors">
                                    Supplement
                                    <ChevronDown className="w-4 h-4" />
                                </button>
                            </li>

                            <li className="relative group">
                                <button className="flex items-center gap-2 py-4 text-gray-800 hover:text-red-600 transition-colors">
                                    Food & Beverage
                                    <ChevronDown className="w-4 h-4" />
                                </button>
                            </li>

                            <li className="relative group">
                                <button className="flex items-center gap-2 py-4 text-gray-800 hover:text-red-600 transition-colors">
                                    Medical Supplies
                                    <ChevronDown className="w-4 h-4" />
                                </button>
                            </li>

                            <li className="relative group">
                                <button className="flex items-center gap-2 py-4 text-gray-800 hover:text-red-600 transition-colors">
                                    Mom & Baby
                                    <ChevronDown className="w-4 h-4" />
                                </button>
                            </li>

                            <li className="relative group">
                                <button className="flex items-center gap-2 py-4 text-gray-800 hover:text-red-600 transition-colors">
                                    Skin Care
                                    <ChevronDown className="w-4 h-4" />
                                </button>
                            </li>

                            <li className="relative group">
                                <button className="flex items-center gap-2 py-4 text-gray-800 hover:text-red-600 transition-colors">
                                    Personal Care
                                    <ChevronDown className="w-4 h-4" />
                                </button>
                            </li>

                            <li>
                                <Link
                                    to={`/${locale}/member-benefits`}
                                    className="block py-4 text-gray-800 hover:text-red-600 transition-colors"
                                >
                                    Member Benefits
                                </Link>
                            </li>
                        </ul>
                    </div>
                </nav>
            </div>

            {/* Mobile Menu Overlay */}
            {showMobileMenu && (
                <div className="fixed inset-0 z-50 lg:hidden">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-black bg-opacity-50"
                        onClick={() => setShowMobileMenu(false)}
                    ></div>

                    {/* Sidebar */}
                    <div className="absolute top-0 left-0 bottom-0 w-80 max-w-[85vw] bg-white shadow-xl overflow-y-auto">
                        {/* Menu Header */}
                        <div className="flex items-center justify-between p-4 border-b border-gray-200">
                            <h2 className="text-lg font-semibold text-gray-900">Menu</h2>
                            <button
                                onClick={() => setShowMobileMenu(false)}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        {/* User Info or Login */}
                        <div className="p-4 border-b border-gray-200 bg-gray-50">
                            {user ? (
                                <div>
                                    <p className="text-sm font-medium text-gray-900">{user.name}</p>
                                    <p className="text-xs text-gray-500 truncate">{user.email}</p>
                                </div>
                            ) : (
                                <Link
                                    to={`/${locale}/login`}
                                    onClick={() => setShowMobileMenu(false)}
                                    className="flex items-center gap-2 text-sm font-medium text-red-600"
                                >
                                    <User className="w-5 h-5" />
                                    Sign in / Register
                                </Link>
                            )}
                        </div>

                        {/* Menu Items */}
                        <nav className="p-4">
                            <ul className="space-y-1">
                                <li>
                                    <button className="w-full flex items-center justify-between py-3 px-4 text-gray-800 hover:bg-gray-50 rounded-lg text-left">
                                        <span className="font-medium">Supplement</span>
                                        <ChevronDown className="w-4 h-4" />
                                    </button>
                                </li>
                                <li>
                                    <button className="w-full flex items-center justify-between py-3 px-4 text-gray-800 hover:bg-gray-50 rounded-lg text-left">
                                        <span className="font-medium">Food & Beverage</span>
                                        <ChevronDown className="w-4 h-4" />
                                    </button>
                                </li>
                                <li>
                                    <button className="w-full flex items-center justify-between py-3 px-4 text-gray-800 hover:bg-gray-50 rounded-lg text-left">
                                        <span className="font-medium">Medical Supplies</span>
                                        <ChevronDown className="w-4 h-4" />
                                    </button>
                                </li>
                                <li>
                                    <button className="w-full flex items-center justify-between py-3 px-4 text-gray-800 hover:bg-gray-50 rounded-lg text-left">
                                        <span className="font-medium">Mom & Baby</span>
                                        <ChevronDown className="w-4 h-4" />
                                    </button>
                                </li>
                                <li>
                                    <button className="w-full flex items-center justify-between py-3 px-4 text-gray-800 hover:bg-gray-50 rounded-lg text-left">
                                        <span className="font-medium">Skin Care</span>
                                        <ChevronDown className="w-4 h-4" />
                                    </button>
                                </li>
                                <li>
                                    <button className="w-full flex items-center justify-between py-3 px-4 text-gray-800 hover:bg-gray-50 rounded-lg text-left">
                                        <span className="font-medium">Personal Care</span>
                                        <ChevronDown className="w-4 h-4" />
                                    </button>
                                </li>
                                <li>
                                    <Link
                                        to={`/${locale}/member-benefits`}
                                        onClick={() => setShowMobileMenu(false)}
                                        className="block py-3 px-4 text-gray-800 hover:bg-gray-50 rounded-lg font-medium"
                                    >
                                        Member Benefits
                                    </Link>
                                </li>

                                <li className="pt-4 border-t border-gray-200">
                                    <Link
                                        to={`/${locale}/stores`}
                                        onClick={() => setShowMobileMenu(false)}
                                        className="flex items-center gap-3 py-3 px-4 text-gray-800 hover:bg-gray-50 rounded-lg"
                                    >
                                        <MapPin className="w-5 h-5" />
                                        <span>Find a store</span>
                                    </Link>
                                </li>

                                {user && (
                                    <>
                                        <li>
                                            <Link
                                                to={`/${locale}/account`}
                                                onClick={() => setShowMobileMenu(false)}
                                                className="block py-3 px-4 text-gray-800 hover:bg-gray-50 rounded-lg"
                                            >
                                                My Account
                                            </Link>
                                        </li>
                                        <li>
                                            <Link
                                                to={`/${locale}/orders`}
                                                onClick={() => setShowMobileMenu(false)}
                                                className="block py-3 px-4 text-gray-800 hover:bg-gray-50 rounded-lg"
                                            >
                                                My Orders
                                            </Link>
                                        </li>
                                        <li>
                                            <Link
                                                to={`/${locale}/wishlist`}
                                                onClick={() => setShowMobileMenu(false)}
                                                className="flex items-center gap-3 py-3 px-4 text-gray-800 hover:bg-gray-50 rounded-lg"
                                            >
                                                <Heart className="w-5 h-5" />
                                                <span>Wishlist</span>
                                            </Link>
                                        </li>
                                        <li>
                                            <button
                                                onClick={handleLogout}
                                                className="w-full text-left py-3 px-4 text-red-600 hover:bg-red-50 rounded-lg font-medium"
                                            >
                                                Logout
                                            </button>
                                        </li>
                                    </>
                                )}
                            </ul>
                        </nav>
                    </div>
                </div>
            )}

            {/* Spacer - prevents content jump when header becomes fixed */}
            {isScrolled && <div className="h-[108px] sm:h-[116px] lg:h-[140px]"></div>}
        </header>
    );
}

export default Header;
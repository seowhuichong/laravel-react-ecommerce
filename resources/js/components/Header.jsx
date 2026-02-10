import React, { useState, useContext, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLocale } from '../context/LocaleContext';
import { useAuth } from '../context/AuthContext';
import {
    Search,
    MapPin,
    User,
    Heart,
    ShoppingCart,
    ChevronDown
} from 'lucide-react';

function Header() {
    const { locale } = useLocale();
    const { user, logout } = useAuth();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All Categories');
    const [showUserMenu, setShowUserMenu] = useState(false);
    const navigate = useNavigate();
    const userMenuRef = useRef(null);

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

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/${locale}/search?q=${searchQuery}&category=${selectedCategory}`);
        }
    };

    const handleLogout = async () => {
        await logout();
        setShowUserMenu(false);
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
            {/* Promo Banner */}
            <div className="bg-red-600 text-white text-center py-2 px-4 text-sm">
                Free Shipping for Orders above RM100 (Discount Capped at RM6).
            </div>

            {/* Main Header */}
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 py-4">
                    <div className="flex items-center justify-between gap-6">
                        {/* Logo */}
                        <Link to={`/${locale}`} className="flex-shrink-0">
                            <img
                                src="/images/logo.png"
                                alt="BIG Pharmacy"
                                className="h-12"
                            />
                        </Link>

                        {/* Search Bar */}
                        <form onSubmit={handleSearch} className="flex-1 max-w-3xl">
                            <div className="flex items-center border border-gray-300 rounded-md overflow-hidden">
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
                        <div className="flex items-center gap-6">
                            {/* Find a Store */}
                            <Link
                                to={`/${locale}/stores`}
                                className="flex items-center gap-2 text-sm text-gray-700 hover:text-red-600 transition-colors"
                            >
                                <MapPin className="w-5 h-5" />
                                <span className="hidden lg:inline">Find a store</span>
                            </Link>

                            {/* Sign In / Register OR User Menu */}
                            <div className="relative" ref={userMenuRef}>
                                {user ? (
                                    // Logged in - show user menu
                                    <>
                                        <button
                                            onClick={() => setShowUserMenu(!showUserMenu)}
                                            className="flex items-center gap-2 text-sm text-gray-700 hover:text-red-600 transition-colors"
                                        >
                                            <User className="w-5 h-5" />
                                            <span className="hidden lg:inline">{user.name.split(' ')[0]}</span>
                                            <ChevronDown className="w-3 h-3 hidden lg:inline" />
                                        </button>

                                        {/* User Dropdown */}
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
                                    // Not logged in - show sign in link
                                    <Link
                                        to={`/${locale}/login`}
                                        className="flex items-center gap-2 text-sm text-gray-700 hover:text-red-600 transition-colors"
                                    >
                                        <User className="w-5 h-5" />
                                        <span className="hidden lg:inline">Sign in/ Register</span>
                                    </Link>
                                )}
                            </div>

                            {/* Wishlist */}
                            <Link
                                to={`/${locale}/wishlist`}
                                className="text-gray-700 hover:text-red-600 transition-colors"
                            >
                                <Heart className="w-6 h-6" />
                            </Link>

                            {/* Cart */}
                            <Link
                                to={`/${locale}/cart`}
                                className="relative text-gray-700 hover:text-red-600 transition-colors"
                            >
                                <ShoppingCart className="w-6 h-6" />
                                {/* Cart Count Badge */}
                                <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                    0
                                </span>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Navigation Menu */}
            <nav className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4">
                    <ul className="flex items-center gap-8 text-sm font-medium">
                        <li className="relative group">
                            <button className="flex items-center gap-2 py-4 text-gray-800 hover:text-red-600 transition-colors">
                                Supplement
                                <ChevronDown className="w-4 h-4" />
                            </button>
                            {/* Dropdown would go here */}
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
        </header>
    );
}

export default Header;

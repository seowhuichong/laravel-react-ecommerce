import React, { useContext, useState, useEffect, useRef } from 'react';
import LanguageSwitcher from './LanguageSwitcher';
import { LocaleContext } from '../context/LocaleContext';

const BigHeader = () => {
    const [searchOpen, setSearchOpen] = useState(false);
    const [activeMenu, setActiveMenu] = useState(null);
    const { availableSlugs } = useContext(LocaleContext);
    const searchRef = useRef(null);

    // Close search when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setSearchOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const categories = [
        { name: 'Health Care', sub: ['Vitamins', 'Supplements', 'First Aid'] },
        { name: 'Personal Care', sub: ['Oral Care', 'Hair Care', 'Body Wash'] },
        { name: 'Mother & Baby', sub: ['Diapers', 'Milk Powder', 'Baby Wipes'] }
    ];

    return (
        <header className="w-full relative bg-white border-b border-gray-200">
            {/* 1. TOP PROMO BAR */}
            <div className="bg-[#ee1c25] text-white py-1.5 px-4 text-center text-xs font-bold uppercase tracking-widest">
                Lowest Price Guaranteed • Free Shipping RM80 & Above
            </div>

            {/* 2. MAIN NAV AREA */}
            <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
                {/* Logo */}
                <div className="flex-shrink-0">
                    <a href="/" className="text-3xl font-black italic">
                        <span className="text-[#ee1c25]">BIG</span>
                        <span className="text-[#00529b]">PHARMACY</span>
                    </a>
                </div>

                {/* Search Interaction */}
                <div className="flex-1 max-w-xl px-10 relative" ref={searchRef}>
                    <div
                        onClick={() => setSearchOpen(true)}
                        className={`flex items-center bg-gray-100 rounded-full px-5 py-2.5 cursor-text transition-all ${searchOpen ? 'ring-2 ring-blue-500 bg-white shadow-lg' : ''}`}
                    >
                        <span className="text-gray-400 mr-2">🔍</span>
                        <input
                            type="text"
                            placeholder="Search brands, products..."
                            className="bg-transparent border-none outline-none w-full text-sm"
                        />
                    </div>

                    {/* SEARCH POPUP (The "Big" Feel) */}
                    {searchOpen && (
                        <div className="absolute top-full left-10 right-10 mt-2 bg-white shadow-2xl rounded-xl border border-gray-100 p-5 z-[100] animate-in fade-in slide-in-from-top-2">
                            <p className="text-xs font-bold text-gray-400 uppercase mb-3">Popular Searches</p>
                            <div className="flex flex-wrap gap-2">
                                {['Panadol', 'Mask', 'Vitamin C', 'Artelac'].map(tag => (
                                    <span key={tag} className="px-3 py-1 bg-gray-100 rounded-full text-sm hover:bg-blue-100 cursor-pointer">{tag}</span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Icons & Language */}
                <div className="flex items-center gap-6">
                    <LanguageSwitcher
                        availableSlugs={availableSlugs}
                        pathPattern="/product/:friendly_url"
                    />
                    <div className="h-8 w-[1px] bg-gray-200 mx-2"></div>
                    <div className="flex gap-5 text-gray-600">
                        <button className="relative">🛒<span className="absolute -top-2 -right-2 bg-[#ee1c25] text-white text-[10px] rounded-full h-4 w-4 flex items-center justify-center">0</span></button>
                        <button>👤</button>
                    </div>
                </div>
            </div>

            {/* 3. CATEGORY TABS (The Pop-up Menu) */}
            <nav className="border-t border-gray-100 px-4">
                <div className="max-w-7xl mx-auto flex gap-10">
                    {categories.map((cat, idx) => (
                        <div
                            key={idx}
                            onMouseEnter={() => setActiveMenu(idx)}
                            onMouseLeave={() => setActiveMenu(null)}
                            className="py-3 relative group"
                        >
                            <button className="text-[13px] font-bold uppercase tracking-tight text-gray-700 group-hover:text-[#ee1c25] transition-colors flex items-center gap-1">
                                {cat.name}
                                <span className="text-[8px]">▼</span>
                            </button>

                            {/* MEGA MENU POPUP */}
                            {activeMenu === idx && (
                                <div className="absolute top-full left-0 w-[250px] bg-white shadow-xl border-t-2 border-[#ee1c25] py-4 z-[90]">
                                    {cat.sub.map((sub, sIdx) => (
                                        <a key={sIdx} href="#" className="block px-6 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-[#ee1c25]">
                                            {sub}
                                        </a>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </nav>
        </header>
    );
};

export default BigHeader;
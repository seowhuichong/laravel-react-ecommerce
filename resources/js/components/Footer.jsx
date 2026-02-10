import React, { useState, useContext, useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LocaleContext } from '../context/LocaleContext';
import { Facebook, Linkedin, Instagram } from 'lucide-react';
import LanguageSwitcher from '../components/LanguageSwitcher';
import { useSettings } from '../context/SettingsContext';

function Footer() {
    const { locale, availableSlugs } = useContext(LocaleContext);
    const { settings } = useSettings();
    const location = useLocation();

    // Automatically determine the path pattern based on current route
    const pathPattern = useMemo(() => {
        const path = location.pathname;

        // Remove locale prefix to get the actual path
        const pathWithoutLocale = path.replace(`/${locale}`, '') || '/';

        // Match different route patterns
        if (pathWithoutLocale.startsWith('/product/')) {
            return '/product/:friendly_url';
        } else if (pathWithoutLocale.startsWith('/category/')) {
            return '/category/:friendly_url';
        } else if (pathWithoutLocale === '/login') {
            return '/login';
        } else if (pathWithoutLocale === '/register') {
            return '/register';
        }

        // Default to home pattern
        return '/';
    }, [location.pathname, locale]);

    const companyLinks = [
        { name: 'Big Caring Group', url: '/big-caring-group' },
        { name: 'About Us', url: '/about' },
        { name: 'Contact Us', url: '/contact' },
        { name: 'Work With Us', url: '/careers' },
        { name: 'CARING Corporate Site', url: 'https://caring.com.my', external: true },
        { name: 'CARING E-store Website', url: 'https://estore.caring.com.my', external: true },
    ];

    const shoppingLinks = [
        { name: 'FAQ', url: '/faq' },
        { name: 'How To Order', url: '/how-to-order' },
        { name: 'Return & Refund', url: '/return-refund' },
        { name: 'Shipping & Delivery', url: '/shipping-delivery' },
        { name: 'Payment Terms', url: '/payment-terms' },
        { name: 'Order Tracking', url: '/order-tracking' },
        { name: 'Fake Products Notice', url: '/fake-products-notice' },
    ];

    const accountLinks = [
        { name: 'Purchase History', url: '/account/orders' },
        { name: 'Points', url: '/account/points' },
        { name: 'Edit Information', url: '/account/profile' },
    ];

    const membershipLinks = [
        { name: 'Member Benefits', url: '/membership/benefits' },
        { name: 'Membership T&C', url: '/membership/terms' },
        { name: 'Membership FAQ', url: '/membership/faq' },
    ];

    return (
        <footer className="bg-black text-white">
            {/* Main Footer Content */}
            <div className="max-w-7xl mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
                    {/* Logo and Description */}
                    <div className="lg:col-span-1">
                        <Link to={`/${locale}`} className="inline-block mb-4">
                            <img
                                src="/images/logo.png"
                                alt="BIG Pharmacy"
                                className="h-8"
                            />
                        </Link>
                        <p className="text-gray-400 text-sm leading-relaxed">
                            {settings?.company?.description || 'At BIG Pharmacy, we strive to be the most affordable pharmacy chain in Malaysia. We offer a wide range of products from organic food, supplements, rehabilitation supplies to health & beauty categories. Think pharmacy, think BIG.'}
                        </p>
                    </div>

                    {/* Company Links */}
                    <div>
                        <h3 className="text-white font-semibold mb-4">Company</h3>
                        <ul className="space-y-2">
                            {companyLinks.map((link) => (
                                link.external ? (
                                    <li key={link.name}>
                                        <a
                                            href={link.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-gray-400 hover:text-white text-sm transition-colors"
                                        >
                                            {link.name}
                                        </a>
                                    </li>
                                ) : (
                                    <li key={link.name}>
                                        <Link
                                            to={`/${locale}${link.url}`}
                                            className="text-gray-400 hover:text-white text-sm transition-colors"
                                        >
                                            {link.name}
                                        </Link>
                                    </li>
                                )
                            ))}
                        </ul>
                    </div>

                    {/* Shopping Online Links */}
                    <div>
                        <h3 className="text-white font-semibold mb-4">Shopping Online</h3>
                        <ul className="space-y-2">
                            {shoppingLinks.map((link) => (
                                <li key={link.name}>
                                    <Link
                                        to={`/${locale}${link.url}`}
                                        className="text-gray-400 hover:text-white text-sm transition-colors"
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Account Links */}
                    <div>
                        <h3 className="text-white font-semibold mb-4">Account</h3>
                        <ul className="space-y-2">
                            {accountLinks.map((link) => (
                                <li key={link.name}>
                                    <Link
                                        to={`/${locale}${link.url}`}
                                        className="text-gray-400 hover:text-white text-sm transition-colors"
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* BIG Membership Links */}
                    <div>
                        <h3 className="text-white font-semibold mb-4">BIG Membership</h3>
                        <ul className="space-y-2">
                            {membershipLinks.map((link) => (
                                <li key={link.name}>
                                    <Link
                                        to={`/${locale}${link.url}`}
                                        className="text-gray-400 hover:text-white text-sm transition-colors"
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Social Media Icons */}
                <div className="mt-12 flex gap-4">
                    <a
                        href={settings?.social?.facebook_url || "https://facebook.com/bigpharmacy"}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors"
                        aria-label="Facebook"
                    >
                        <Facebook className="w-5 h-5" />
                    </a>
                    <a
                        href={settings?.social?.linkedin_url || "https://linkedin.com/company/bigpharmacy"}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors"
                        aria-label="LinkedIn"
                    >
                        <Linkedin className="w-5 h-5" />
                    </a>
                    <a
                        href={settings?.social?.instagram_url || "https://instagram.com/bigpharmacy"}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors"
                        aria-label="Instagram"
                    >
                        <Instagram className="w-5 h-5" />
                    </a>
                </div>

                <LanguageSwitcher
                    availableSlugs={availableSlugs}
                    pathPattern={pathPattern}
                />
            </div>

            {/* Bottom Bar - Copyright and Legal Links */}
            <div className="border-t border-gray-800">
                <div className="max-w-7xl mx-auto px-4 py-6">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        {/* Copyright */}
                        <p className="text-gray-400 text-sm text-center md:text-left">
                            {settings?.company?.copyright || '© 2026 CARING EStore Sdn Bhd Registration No.: 200901038640 (881773-W). All Rights Reserved.'}
                        </p>

                        {/* Legal Links */}
                        <div className="flex flex-wrap justify-center gap-6">
                            <Link
                                to={`/${locale}/privacy-policy`}
                                className="text-gray-400 hover:text-white text-sm transition-colors"
                            >
                                Privacy policy
                            </Link>
                            <Link
                                to={`/${locale}/terms-of-service`}
                                className="text-gray-400 hover:text-white text-sm transition-colors"
                            >
                                Terms of service
                            </Link>
                            <Link
                                to={`/${locale}/shipping-policy`}
                                className="text-gray-400 hover:text-white text-sm transition-colors"
                            >
                                Shipping policy
                            </Link>
                            <Link
                                to={`/${locale}/refund-policy`}
                                className="text-gray-400 hover:text-white text-sm transition-colors"
                            >
                                Refund policy
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default Footer;

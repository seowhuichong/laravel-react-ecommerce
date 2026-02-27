import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useLocale } from '../../context/LocaleContext';
import { useAuth } from '../../context/AuthContext';
import { User, MapPin, LogOut, ChevronRight } from 'lucide-react';

function AccountLayout({ children }) {
    const { locale } = useLocale();
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate(`/${locale}/login`);
    };

    const navItems = [
        { to: `/${locale}/account/profile`, icon: User, label: 'My Profile' },
        { to: `/${locale}/account/addresses`, icon: MapPin, label: 'Saved Addresses' },
    ];

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Page Header */}
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-900">My Account</h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Welcome back, <span className="font-medium text-gray-700">{user?.name}</span>
                    </p>
                </div>

                <div className="flex flex-col md:flex-row gap-6">
                    {/* Sidebar */}
                    <aside className="w-full md:w-60 flex-shrink-0">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                            {/* User badge */}
                            <div className="p-5 border-b border-gray-100 bg-gradient-to-r from-red-50 to-orange-50">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                                        <User className="w-5 h-5 text-red-600" />
                                    </div>
                                    <div className="overflow-hidden">
                                        <p className="text-sm font-semibold text-gray-800 truncate">{user?.name}</p>
                                        <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Nav links */}
                            <nav className="p-2">
                                {navItems.map(({ to, icon: Icon, label }) => (
                                    <NavLink
                                        key={to}
                                        to={to}
                                        className={({ isActive }) =>
                                            `flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-colors ${isActive
                                                ? 'bg-red-50 text-red-600 font-semibold'
                                                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                            }`
                                        }
                                    >
                                        <Icon className="w-4 h-4 flex-shrink-0" />
                                        <span className="flex-1">{label}</span>
                                        <ChevronRight className="w-3 h-3 opacity-40" />
                                    </NavLink>
                                ))}

                                <button
                                    onClick={handleLogout}
                                    className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm text-gray-600 hover:bg-red-50 hover:text-red-600 transition-colors mt-1"
                                >
                                    <LogOut className="w-4 h-4 flex-shrink-0" />
                                    <span>Log Out</span>
                                </button>
                            </nav>
                        </div>
                    </aside>

                    {/* Main content */}
                    <main className="flex-1 min-w-0">{children}</main>
                </div>
            </div>
        </div>
    );
}

export default AccountLayout;

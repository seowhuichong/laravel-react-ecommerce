import React, { useEffect, useState } from 'react';
import { useAdminAuth } from '../context/AdminAuthContext';

const StatCard = ({ label, value, icon, color }) => (
    <div className="bg-white rounded-xl border border-slate-200 p-6 flex items-center gap-5 shadow-sm">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${color}`}>
            {icon}
        </div>
        <div>
            <p className="text-sm text-slate-500 font-medium">{label}</p>
            <p className="text-2xl font-bold text-slate-800 mt-0.5">
                {value !== null ? value : <span className="text-slate-300 animate-pulse">—</span>}
            </p>
        </div>
    </div>
);

export default function Dashboard() {
    const { api } = useAdminAuth();
    const [stats, setStats] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        api.get('/api/admin/dashboard')
            .then(res => setStats(res.data))
            .catch(() => setError('Failed to load dashboard data.'));
    }, []);

    return (
        <div>
            <div className="mb-6">
                <h1 className="text-xl font-bold text-slate-800">Dashboard</h1>
                <p className="text-sm text-slate-500 mt-0.5">Welcome back! Here's what's happening.</p>
            </div>

            {error && (
                <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm">{error}</div>
            )}

            {/* Stat cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 mb-8">
                <StatCard
                    label="Total Customers"
                    value={stats?.total_customers ?? null}
                    color="bg-blue-50 text-blue-600"
                    icon={
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                    }
                />
                <StatCard
                    label="Total Products"
                    value={stats?.total_products ?? null}
                    color="bg-violet-50 text-violet-600"
                    icon={
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10" />
                        </svg>
                    }
                />
                <StatCard
                    label="Active Products"
                    value={stats?.active_products ?? null}
                    color="bg-emerald-50 text-emerald-600"
                    icon={
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    }
                />
            </div>

            {/* Recent customers table */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100">
                    <h2 className="text-sm font-semibold text-slate-700">Recent Customers</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-slate-50 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">
                                <th className="px-6 py-3">Name</th>
                                <th className="px-6 py-3">Email</th>
                                <th className="px-6 py-3">Joined</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {stats?.recent_customers?.length > 0 ? (
                                stats.recent_customers.map(u => (
                                    <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-3 font-medium text-slate-800">{u.name}</td>
                                        <td className="px-6 py-3 text-slate-500">{u.email}</td>
                                        <td className="px-6 py-3 text-slate-400">
                                            {new Date(u.created_at).toLocaleDateString()}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={3} className="px-6 py-6 text-center text-slate-400">
                                        {stats ? 'No customers yet.' : 'Loading…'}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

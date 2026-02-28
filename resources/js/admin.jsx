import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AdminAuthProvider } from './admin/context/AdminAuthContext';
import ProtectedRoute from './admin/components/ProtectedRoute';
import AdminLayout from './admin/layouts/AdminLayout';
import Login from './admin/pages/Login';
import Dashboard from './admin/pages/Dashboard';
import Customers from './admin/pages/Customers';
import CustomerProfile from './admin/pages/CustomerProfile';
import Products from './admin/pages/Products';
import ProductProfile from './admin/pages/ProductProfile';
import Categories from './admin/pages/Categories';
import CategoryProfile from './admin/pages/CategoryProfile';

function AdminApp() {
    return (
        <AdminAuthProvider>
            <BrowserRouter>
                <Routes>
                    {/* Public */}
                    <Route path="/admin/login" element={<Login />} />

                    {/* Protected — all admin pages live inside AdminLayout */}
                    <Route
                        path="/admin/*"
                        element={
                            <ProtectedRoute>
                                <AdminLayout>
                                    <Routes>
                                        <Route index element={<Navigate to="dashboard" replace />} />
                                        <Route path="dashboard" element={<Dashboard />} />
                                        <Route path="customers" element={<Customers />} />
                                        <Route path="customers/:id" element={<CustomerProfile />} />
                                        <Route path="products" element={<Products />} />
                                        <Route path="products/:id" element={<ProductProfile />} />
                                        <Route path="categories" element={<Categories />} />
                                        <Route path="categories/:id" element={<CategoryProfile />} />
                                        <Route path="*" element={
                                            <div className="text-center py-20 text-slate-400">
                                                <p className="text-4xl font-bold mb-2">404</p>
                                                <p>Page not found.</p>
                                            </div>
                                        } />
                                    </Routes>
                                </AdminLayout>
                            </ProtectedRoute>
                        }
                    />

                    {/* Fallback — redirect /admin to dashboard */}
                    <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
                </Routes>
            </BrowserRouter>
        </AdminAuthProvider>
    );
}

const root = ReactDOM.createRoot(document.getElementById('admin-app'));
root.render(<AdminApp />);

export default AdminApp;

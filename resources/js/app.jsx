import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { LocaleProvider } from './context/LocaleContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { SettingsProvider } from './context/SettingsContext';
import { CategoryProvider } from './context/CategoryContext';
import Header from './components/Header';
import Home from './pages/Home';
import Product from './pages/Product';
import CategoryPage from './pages/CategoryPage';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Account/Profile';
import Addresses from './pages/Account/Addresses';
import Footer from './components/Footer';
import { useLocale } from './context/LocaleContext';

// Guard: redirect to login if not authenticated
function PrivateRoute({ children }) {
    const { user, loading } = useAuth();
    const { locale } = useLocale();
    if (loading) return null;
    return user ? children : <Navigate to={`/${locale}/login`} replace />;
}

function App() {
    return (
        <HelmetProvider>
            <AuthProvider>
                <LocaleProvider>
                    <SettingsProvider>
                        <CategoryProvider>
                            <BrowserRouter>
                                <Header />
                                <Routes>
                                    <Route path="/" element={<Navigate to="/en-MY" replace />} />
                                    <Route path="/:locale">
                                        <Route index element={<Home />} />
                                        <Route path="product/:friendly_url" element={<Product />} />
                                        <Route path="category/:friendly_url" element={<CategoryPage />} />
                                        <Route path="login" element={<Login />} />
                                        <Route path="register" element={<Register />} />

                                        {/* Protected account pages */}
                                        <Route path="account">
                                            <Route index element={<Navigate to="profile" replace />} />
                                            <Route path="profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
                                            <Route path="addresses" element={<PrivateRoute><Addresses /></PrivateRoute>} />
                                        </Route>

                                        <Route path="*" element={<div className="p-20 text-center">404 - Page Not Found</div>} />
                                    </Route>
                                </Routes>
                                <Footer />
                            </BrowserRouter>
                        </CategoryProvider>
                    </SettingsProvider>
                </LocaleProvider>
            </AuthProvider>
        </HelmetProvider>
    );
}

const root = ReactDOM.createRoot(document.getElementById('app'));
root.render(<App />);

export default App;


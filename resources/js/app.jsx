import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { LocaleProvider } from './context/LocaleContext';
import { AuthProvider } from './context/AuthContext';
import { SettingsProvider } from './context/SettingsContext';
import Header from './components/Header';
import Home from './pages/Home';
import Product from './pages/Product';
import Login from './pages/Login';
import Register from './pages/Register';
import Footer from './components/Footer';

function App() {
    return (
        <HelmetProvider>
            <AuthProvider>
                <LocaleProvider>
                    <SettingsProvider>
                        <BrowserRouter>
                            <Header />
                            <Routes>
                                <Route path="/" element={<Navigate to="/en" replace />} />
                                <Route path="/:locale">
                                    <Route index element={<Home />} />
                                    <Route path="product/:friendly_url" element={<Product />} />
                                    <Route path="login" element={<Login />} />
                                    <Route path="register" element={<Register />} />
                                    <Route path="*" element={<div className="p-20 text-center">404 - Page Not Found</div>} />
                                </Route>
                            </Routes>
                            <Footer />
                        </BrowserRouter>
                    </SettingsProvider>
                </LocaleProvider>
            </AuthProvider>
        </HelmetProvider>
    );
}

const root = ReactDOM.createRoot(document.getElementById('app'));
root.render(<App />);

export default App;

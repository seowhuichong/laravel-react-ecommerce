import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LocaleProvider } from './context/LocaleContext';
import Header from './components/Header';
import Home from './pages/Home';
import Product from './pages/Product';

function App() {
    return (
        <LocaleProvider>
            <BrowserRouter>
                <Header />
                <Routes>
                    <Route path="/:locale">
                        <Route index element={<Home />} />
                        <Route path="product/:friendly_url" element={<Product />} />
                    </Route>
                </Routes>
            </BrowserRouter>
        </LocaleProvider>
    );
}

const root = ReactDOM.createRoot(document.getElementById('app'));
root.render(<App />);

export default App;

import React from 'react';
import SEO from '../components/SEO';

const Home = () => {
    return (
        <>
            <SEO type="website" />

            <div className="home-page">
                <h1>Welcome to the Home Page</h1>
                <p>This is your React + Laravel SPA home page.</p>
            </div>
        </>
    );
};

export default Home;
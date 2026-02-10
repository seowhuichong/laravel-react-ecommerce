import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router-dom';
import { useSettings } from '../context/SettingsContext';

function SEO({
    title,
    description,
    path = '',
    image = null,
    type = 'website',
    noIndex = false
}) {
    const { locale } = useParams();
    const { settings } = useSettings();

    // Use props if provided, otherwise fall back to settings, then to hardcoded defaults
    const finalTitle = title || settings?.seo?.default_title || 'eCommerce Site';
    const finalDescription = description || settings?.seo?.default_description || 'Shop the best products online.';
    const siteName = settings?.seo?.site_name || 'BIG Pharmacy';

    const canonicalUrl = `${window.location.origin}/${locale}${path}`;

    return (
        <Helmet>
            <title>{finalTitle}</title>
            <meta name="description" content={finalDescription} />
            <link rel="canonical" href={canonicalUrl} />
            {noIndex && <meta name="robots" content="noindex, nofollow, noarchive" />}
            <meta property="og:title" content={finalTitle} />
            <meta property="og:description" content={finalDescription} />
            <meta property="og:url" content={canonicalUrl} />
            <meta property="og:type" content={type} />
            {/* Use site name from settings for OG site_name if needed, though not standard property */}
            <meta property="og:site_name" content={siteName} />
            {image && <meta property="og:image" content={image} />}
        </Helmet>
    );
}

export default SEO;
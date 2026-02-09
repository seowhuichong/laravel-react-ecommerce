import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router-dom';

function SEO({
    title = 'eCommerce Site',
    description = 'Shop the best products online.',
    path = '',
    image = null,
    type = 'website',
    noIndex = false
}) {
    const { locale } = useParams();
    const canonicalUrl = `${window.location.origin}/${locale}${path}`;

    return (
        <Helmet>
            <title>{title}</title>
            <meta name="description" content={description} />
            <link rel="canonical" href={canonicalUrl} />
            {noIndex && <meta name="robots" content="noindex, nofollow, noarchive" />}
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
            <meta property="og:url" content={canonicalUrl} />
            <meta property="og:type" content={type} />
            {image && <meta property="og:image" content={image} />}
        </Helmet>
    );
}

export default SEO;
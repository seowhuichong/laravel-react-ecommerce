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
    const availableLocales = ['en-MY', 'ms-MY', 'zh-CN'];
    const finalTitle = title || settings?.seo?.default_title;
    const finalDescription = description || settings?.seo?.default_description;
    const siteName = settings?.seo?.site_name;
    const canonicalUrl = `${window.location.origin}/${locale}${path}`;

    return (
        <Helmet>
            <title>{finalTitle}</title>
            <meta name="description" content={finalDescription} />
            <link rel="canonical" href={canonicalUrl} />
            {noIndex && <meta name="robots" content="noindex, nofollow, noarchive" />}
            <meta property="og:locale" content={locale} />
            <meta property="og:title" content={finalTitle} />
            <meta property="og:description" content={finalDescription} />
            <meta property="og:url" content={canonicalUrl} />
            <meta property="og:type" content={type} />
            <meta property="og:site_name" content={siteName} />
            {image && <meta property="og:image" content={image} />}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={finalTitle} />
            <meta name="twitter:description" content={finalDescription} />
            {image && <meta name="twitter:image" content={image} />}
            {availableLocales
                .filter(altLocale => altLocale !== locale)
                .map(altLocale => (
                    <link
                        key={altLocale}
                        rel="alternate"
                        hrefLang={altLocale}
                        href={`${window.location.origin}/${altLocale}${path}`}
                    />
                ))
            }
            <link
                rel="alternate"
                hrefLang="x-default"
                href={`${window.location.origin}/${availableLocales[0]}${path}`}
            />
        </Helmet>
    );
}

export default SEO;
import React, { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useLocale } from '../context/LocaleContext';
import { useTranslation } from '../hooks/useTranslation';
import SEO from '../components/SEO';

const Product = () => {
    const { friendly_url } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { t } = useTranslation();
    const { locale, setAvailableSlugs } = useLocale()

    useEffect(() => {
        setLoading(true);
        axios.get(`/api/${locale}/products/${friendly_url}`)
            .then(res => {
                setProduct(res.data.product);
                setAvailableSlugs(res.data.slugs);
                setLoading(false);
            })
            .catch(err => {
                if (err.response?.status === 404) {
                    navigate('/');
                } else {
                    setError(t('error_loading_product'));
                    setLoading(false);
                }
            });

        return () => setAvailableSlugs({});
    }, [friendly_url, setAvailableSlugs]);

    if (loading) return <div className="p-10 text-center">{t('loading')}...</div>;
    if (error) return <div className="p-10 text-center text-red-500">{error}</div>;

    return (
        <>
            <SEO
                title={product.product_name}
                description={product.product_description}
                path={`/product/${product.product_friendly_url}`}
                image={product.product.product_image}
                type="product"
            />
            <div className="product-page">
                <h1>{product.product_name}</h1>
                <p>{product.product_description}</p>
                <p>{t('price')}: RM{product.product.product_price}</p>
            </div>
        </>
    );
};

export default Product;

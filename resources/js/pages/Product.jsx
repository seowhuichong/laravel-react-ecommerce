import React, { useEffect, useState } from 'react';
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
    const { locale } = useLocale()

    useEffect(() => {
        setLoading(true);
        axios.get(`/api/${locale}/products/${friendly_url}`)
            .then(res => {
                console.log(res);
                setProduct(res.data);
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

    }, [locale, friendly_url]);

    if (loading) return <div className="p-10 text-center">{t('loading')}...</div>;
    if (error) return <div className="p-10 text-center text-red-500">{error}</div>;

    return (
        <>
            <SEO
                title={product.translation.product_meta_title}
                description={product.translation.product_meta_description}
                path={`/product/${product.product_friendly_url}`}
                image={product.product_image}
                type="product"
            />
            <div className="product-page">
                <h1>{product.translation.product_name}</h1>
                <p>{product.translation.product_description}</p>
                <p>{t('price')}: RM{product.product_price}</p>
            </div>
        </>
    );
};

export default Product;

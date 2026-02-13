import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useLocale } from '../context/LocaleContext';
import { useTranslation } from '../hooks/useTranslation';
import SEO from '../components/SEO';
import {
    Heart,
    Share2,
    ShoppingCart,
    Truck,
    Store,
    Shield,
    ChevronRight,
    Plus,
    Minus,
    AlertCircle
} from 'lucide-react';

const Product = () => {
    const { friendly_url } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [selectedImage, setSelectedImage] = useState(0);
    const [activeTab, setActiveTab] = useState('description');
    const { t } = useTranslation();
    const { locale } = useLocale();

    useEffect(() => {
        setLoading(true);
        axios.get(`/api/${locale}/products/${friendly_url}`)
            .then(res => {
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

    const handleQuantityChange = (action) => {
        if (action === 'increase') {
            setQuantity(prev => prev + 1);
        } else if (action === 'decrease' && quantity > 1) {
            setQuantity(prev => prev - 1);
        }
    };

    const handleAddToCart = () => {
        // Add to cart logic here
        console.log(`Adding ${quantity} of ${product.translation.product_name} to cart`);
    };

    const handleAddToWishlist = () => {
        // Add to wishlist logic here
        console.log('Adding to wishlist');
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">{t('loading')}...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                    <p className="text-red-500 text-lg">{error}</p>
                </div>
            </div>
        );
    }

    const hasDiscount = product.product_retail_price > product.product_price;
    const discountPercentage = hasDiscount
        ? Math.round(((product.product_retail_price - product.product_price) / product.product_retail_price) * 100)
        : 0;

    // Mock images - replace with actual product images
    const productImages = [
        product.product_image,
        product.product_image,
        product.product_image,
    ];

    return (
        <>
            <SEO
                title={product.translation.product_meta_title}
                description={product.translation.product_meta_description}
                path={`/product/${product.product_friendly_url}`}
                image={product.product_image}
                type="product"
            />

            {/* Breadcrumb */}
            <div className="bg-gray-50 border-b">
                <div className="max-w-7xl mx-auto px-4 py-3">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Link to={`/${locale}`} className="hover:text-red-600">
                            Home
                        </Link>
                        <ChevronRight className="w-4 h-4" />
                        <span className="text-gray-900 font-medium line-clamp-1">
                            {product.translation.product_name}
                        </span>
                    </div>
                </div>
            </div>

            {/* Product Section */}
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                    {/* Left Column - Images */}
                    <div className="space-y-4">
                        {/* Main Image */}
                        <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden">
                            {hasDiscount && (
                                <div className="absolute top-4 left-4 bg-red-600 text-white px-3 py-1 rounded-md font-bold text-sm z-10">
                                    -{discountPercentage}%
                                </div>
                            )}
                            <img
                                src={productImages[selectedImage]}
                                alt={product.translation.product_name}
                                className="w-full h-full object-contain p-8"
                                onError={(e) => {
                                    e.target.src = '/images/placeholders/product-placeholder.png';
                                }}
                            />
                        </div>

                        {/* Thumbnail Images */}
                        {productImages.length > 1 && (
                            <div className="grid grid-cols-4 gap-2">
                                {productImages.map((img, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setSelectedImage(index)}
                                        className={`aspect-square bg-gray-100 rounded-lg overflow-hidden border-2 transition-colors ${selectedImage === index
                                            ? 'border-red-600'
                                            : 'border-transparent hover:border-gray-300'
                                            }`}
                                    >
                                        <img
                                            src={img}
                                            alt={`${product.translation.product_name} ${index + 1}`}
                                            className="w-full h-full object-contain p-2"
                                            onError={(e) => {
                                                e.target.src = '/images/placeholders/product-placeholder.png';
                                            }}
                                        />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Right Column - Product Info */}
                    <div className="space-y-6">
                        {/* Brand */}
                        {product.product_vendor && (
                            <div>
                                <Link
                                    to={`/${locale}/brands/${product.product_vendor.toLowerCase()}`}
                                    className="text-sm text-gray-600 hover:text-red-600"
                                >
                                    Brand: <span className="font-medium">{product.product_vendor}</span>
                                </Link>
                            </div>
                        )}

                        {/* Product Name */}
                        <h1 className="text-3xl font-bold text-gray-900">
                            {product.translation.product_name}
                        </h1>

                        {/* Price */}
                        <div className="flex items-baseline gap-3">
                            <span className="text-3xl font-bold text-red-600">
                                RM {product.product_price}
                            </span>
                            {hasDiscount && (
                                <span className="text-xl text-gray-400 line-through">
                                    RM {product.product_retail_price}
                                </span>
                            )}
                        </div>

                        {/* Short Description */}
                        <div className="text-gray-700 leading-relaxed">
                            <p className="line-clamp-3">{product.translation.product_description}</p>
                        </div>

                        {/* Quantity Selector */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-900">
                                Quantity
                            </label>
                            <div className="flex items-center gap-3">
                                <div className="flex items-center border border-gray-300 rounded-md">
                                    <button
                                        onClick={() => handleQuantityChange('decrease')}
                                        className="p-3 hover:bg-gray-50 transition-colors"
                                        disabled={quantity <= 1}
                                    >
                                        <Minus className="w-4 h-4" />
                                    </button>
                                    <span className="px-6 py-2 font-semibold min-w-[60px] text-center">
                                        {quantity}
                                    </span>
                                    <button
                                        onClick={() => handleQuantityChange('increase')}
                                        className="p-3 hover:bg-gray-50 transition-colors"
                                    >
                                        <Plus className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-3">
                            <button
                                onClick={handleAddToCart}
                                className="flex-1 bg-red-600 hover:bg-red-700 text-white px-6 py-4 rounded-md font-semibold flex items-center justify-center gap-2 transition-colors"
                            >
                                <ShoppingCart className="w-5 h-5" />
                                Add to Cart
                            </button>
                            <button
                                onClick={handleAddToWishlist}
                                className="border-2 border-gray-300 hover:border-red-600 hover:text-red-600 p-4 rounded-md transition-colors"
                            >
                                <Heart className="w-5 h-5" />
                            </button>
                            <button className="border-2 border-gray-300 hover:border-gray-400 p-4 rounded-md transition-colors">
                                <Share2 className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Features */}
                        <div className="border-t pt-6 space-y-3">
                            <div className="flex items-center gap-3 text-sm">
                                <Truck className="w-5 h-5 text-red-600" />
                                <span className="text-gray-700">
                                    Enjoy RM6 OFF on Shipping Fee for orders over RM100
                                </span>
                            </div>
                            <div className="flex items-center gap-3 text-sm">
                                <Shield className="w-5 h-5 text-red-600" />
                                <span className="text-gray-700">Lifetime Customer Support</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm">
                                <Store className="w-5 h-5 text-red-600" />
                                <span className="text-gray-700">
                                    In-store pick up - Usually ready in 1 hour
                                </span>
                            </div>
                        </div>

                        {/* SKU */}
                        {product.product_sku && (
                            <div className="text-sm text-gray-600">
                                SKU: <span className="font-medium">{product.product_sku}</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Product Details Tabs */}
                <div className="mt-12 border-t">
                    <div className="flex gap-8 border-b">
                        <button
                            onClick={() => setActiveTab('description')}
                            className={`py-4 px-2 font-semibold transition-colors relative ${activeTab === 'description'
                                ? 'text-red-600'
                                : 'text-gray-600 hover:text-gray-900'
                                }`}
                        >
                            General Information
                            {activeTab === 'description' && (
                                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-600"></div>
                            )}
                        </button>
                        <button
                            onClick={() => setActiveTab('return')}
                            className={`py-4 px-2 font-semibold transition-colors relative ${activeTab === 'return'
                                ? 'text-red-600'
                                : 'text-gray-600 hover:text-gray-900'
                                }`}
                        >
                            Return & Refund
                            {activeTab === 'return' && (
                                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-600"></div>
                            )}
                        </button>
                    </div>

                    <div className="py-8">
                        {activeTab === 'description' && (
                            <div className="prose max-w-none">
                                <div
                                    className="text-gray-700 leading-relaxed"
                                    dangerouslySetInnerHTML={{ __html: product.translation.product_description }}
                                />
                            </div>
                        )}

                        {activeTab === 'return' && (
                            <div className="prose max-w-none">
                                <h3 className="text-lg font-bold mb-4">Return & Refund Policy</h3>
                                <div className="text-gray-700 space-y-4 text-sm">
                                    <p>
                                        <strong>CANCELLATION</strong>
                                    </p>
                                    <p>
                                        1) BIG Pharmacy reserves the rights to cancel any orders if the
                                        product is not available for any reasons.
                                    </p>
                                    <p>
                                        2) You are not allowed to cancel the order once an order
                                        confirmation email is issued.
                                    </p>
                                    <p className="mt-4">
                                        <strong>RETURN / REFUND</strong>
                                    </p>
                                    <p>
                                        3) You shall examine the goods immediately upon receiving. Claims
                                        must be lodged within 7 days.
                                    </p>
                                    <p>
                                        4) Exchange or refund can be arranged for damaged/defective
                                        products, near expiry items, or incorrect orders.
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Related Products Section */}
                <div className="mt-16">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">
                        You May Also Like
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {/* Placeholder for related products */}
                        {[1, 2, 3, 4].map((item) => (
                            <div
                                key={item}
                                className="bg-gray-100 rounded-lg aspect-square animate-pulse"
                            ></div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
};

export default Product;
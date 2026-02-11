import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import { useLocale } from '../context/LocaleContext';

const Home = () => {
    const { locale } = useLocale();
    const [currentSlide, setCurrentSlide] = useState(0);

    // Hero slider images
    const heroSlides = [
        {
            id: 1,
            image: '/images/banners/hero-1.jpg',
            title: 'Your Health, Our Priority',
            subtitle: 'Get up to 50% off on selected health supplements',
            cta: 'Shop Now',
            link: `/${locale}/categories/supplement`
        },
        {
            id: 2,
            image: '/images/banners/hero-2.jpg',
            title: 'New Arrivals in Skincare',
            subtitle: 'Discover the latest beauty essentials',
            cta: 'Explore',
            link: `/${locale}/categories/skin-care`
        },
        {
            id: 3,
            image: '/images/banners/hero-3.jpg',
            title: 'Baby Care Essentials',
            subtitle: 'Everything your little one needs',
            cta: 'View Products',
            link: `/${locale}/categories/mom-baby`
        }
    ];

    // Featured categories
    const categories = [
        {
            name: 'Supplement',
            image: '/images/categories/supplement.jpg',
            link: `/${locale}/categories/supplement`,
            count: '500+ Products'
        },
        {
            name: 'Food & Beverage',
            image: '/images/categories/food.jpg',
            link: `/${locale}/categories/food-beverage`,
            count: '300+ Products'
        },
        {
            name: 'Medical Supplies',
            image: '/images/categories/medical.jpg',
            link: `/${locale}/categories/medical-supplies`,
            count: '250+ Products'
        },
        {
            name: 'Mom & Baby',
            image: '/images/categories/mom-baby.jpg',
            link: `/${locale}/categories/mom-baby`,
            count: '400+ Products'
        },
        {
            name: 'Skin Care',
            image: '/images/categories/skincare.jpg',
            link: `/${locale}/categories/skin-care`,
            count: '600+ Products'
        },
        {
            name: 'Personal Care',
            image: '/images/categories/personal-care.jpg',
            link: `/${locale}/categories/personal-care`,
            count: '450+ Products'
        }
    ];

    // Featured products
    const featuredProducts = [
        {
            id: 1,
            name: 'Blackmores Vitamin C 500mg',
            image: '/images/products/product-1.jpg',
            price: 45.90,
            originalPrice: 59.90,
            discount: 23,
            rating: 4.5,
            reviews: 128
        },
        {
            id: 2,
            name: 'Cetaphil Gentle Skin Cleanser',
            image: '/images/products/product-2.jpg',
            price: 38.50,
            originalPrice: null,
            discount: null,
            rating: 4.8,
            reviews: 256
        },
        {
            id: 3,
            name: 'Ensure Gold Vanilla 850g',
            image: '/images/products/product-3.jpg',
            price: 52.90,
            originalPrice: 65.90,
            discount: 20,
            rating: 4.6,
            reviews: 89
        },
        {
            id: 4,
            name: 'Dettol Antibacterial Soap',
            image: '/images/products/product-4.jpg',
            price: 12.90,
            originalPrice: null,
            discount: null,
            rating: 4.7,
            reviews: 342
        }
    ];

    // Auto-slide effect
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
    };

    return (
        <>
            <SEO type="website" />

            <div className="home-page">
                {/* Hero Slider Section */}
                <section className="relative h-[500px] overflow-hidden">
                    {heroSlides.map((slide, index) => (
                        <div
                            key={slide.id}
                            className={`absolute inset-0 transition-opacity duration-700 ${index === currentSlide ? 'opacity-100' : 'opacity-0'
                                }`}
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent z-10"></div>
                            <img
                                src={slide.image}
                                alt={slide.title}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                    e.target.src = '/images/placeholders/banner-placeholder.png';
                                }}
                            />
                            <div className="absolute inset-0 z-20 flex items-center">
                                <div className="max-w-7xl mx-auto px-4 w-full">
                                    <div className="max-w-xl">
                                        <h1 className="text-5xl font-bold text-white mb-4">
                                            {slide.title}
                                        </h1>
                                        <p className="text-xl text-gray-200 mb-8">
                                            {slide.subtitle}
                                        </p>
                                        <Link
                                            to={slide.link}
                                            className="inline-block bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-md font-semibold transition-colors"
                                        >
                                            {slide.cta}
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}

                    {/* Navigation Arrows */}
                    <button
                        onClick={prevSlide}
                        className="absolute left-4 top-1/2 -translate-y-1/2 z-30 bg-white/80 hover:bg-white p-3 rounded-full transition-colors"
                        aria-label="Previous slide"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <button
                        onClick={nextSlide}
                        className="absolute right-4 top-1/2 -translate-y-1/2 z-30 bg-white/80 hover:bg-white p-3 rounded-full transition-colors"
                        aria-label="Next slide"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </button>

                    {/* Slide Indicators */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 flex gap-2">
                        {heroSlides.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentSlide(index)}
                                className={`w-3 h-3 rounded-full transition-colors ${index === currentSlide ? 'bg-white' : 'bg-white/50'
                                    }`}
                                aria-label={`Go to slide ${index + 1}`}
                            />
                        ))}
                    </div>
                </section>

                {/* Features Section */}
                <section className="py-8 bg-gray-50 border-b">
                    <div className="max-w-7xl mx-auto px-4">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            <div className="flex items-center gap-4">
                                <div className="bg-red-100 p-3 rounded-full">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900">Free Shipping</h3>
                                    <p className="text-sm text-gray-600">Orders above RM100</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="bg-red-100 p-3 rounded-full">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900">Secure Payment</h3>
                                    <p className="text-sm text-gray-600">100% Protected</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="bg-red-100 p-3 rounded-full">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900">Easy Returns</h3>
                                    <p className="text-sm text-gray-600">30-Day Guarantee</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="bg-red-100 p-3 rounded-full">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900">24/7 Support</h3>
                                    <p className="text-sm text-gray-600">Dedicated Support</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Categories Section */}
                <section className="py-16">
                    <div className="max-w-7xl mx-auto px-4">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-3xl font-bold text-gray-900">Shop by Category</h2>
                            <Link to={`/${locale}/categories`} className="text-red-600 hover:text-red-700 font-semibold flex items-center gap-2">
                                View All
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </Link>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                            {categories.map((category) => (
                                <Link
                                    key={category.name}
                                    to={category.link}
                                    className="group"
                                >
                                    <div className="relative overflow-hidden rounded-lg mb-3 aspect-square">
                                        <img
                                            src={category.image}
                                            alt={category.name}
                                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                                            onError={(e) => {
                                                e.target.src = '/images/placeholders/category-placeholder.png';
                                            }}
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                                        <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                                            <p className="text-xs opacity-90">{category.count}</p>
                                        </div>
                                    </div>
                                    <h3 className="font-semibold text-gray-900 text-center group-hover:text-red-600 transition-colors">
                                        {category.name}
                                    </h3>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Promotional Banners */}
                <section className="py-8 bg-gray-50">
                    <div className="max-w-7xl mx-auto px-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="relative rounded-lg overflow-hidden h-64 group cursor-pointer">
                                <img
                                    src="/images/banners/promo-1.jpg"
                                    alt="Wellness Essentials"
                                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                    onError={(e) => {
                                        e.target.src = '/images/placeholders/promo-placeholder.png';
                                    }}
                                />
                                <div className="absolute inset-0 bg-gradient-to-r from-green-900/80 to-transparent flex items-center">
                                    <div className="p-8 text-white">
                                        <h3 className="text-3xl font-bold mb-2">Wellness Essentials</h3>
                                        <p className="mb-4">Up to 40% off vitamins & supplements</p>
                                        <Link to={`/${locale}/promotions/wellness`} className="inline-block bg-white text-green-900 px-6 py-2 rounded-md font-semibold hover:bg-gray-100 transition-colors">
                                            Shop Now
                                        </Link>
                                    </div>
                                </div>
                            </div>
                            <div className="relative rounded-lg overflow-hidden h-64 group cursor-pointer">
                                <img
                                    src="/images/banners/promo-2.jpg"
                                    alt="Beauty & Skincare"
                                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                    onError={(e) => {
                                        e.target.src = '/images/placeholders/promo-placeholder.png';
                                    }}
                                />
                                <div className="absolute inset-0 bg-gradient-to-r from-pink-900/80 to-transparent flex items-center">
                                    <div className="p-8 text-white">
                                        <h3 className="text-3xl font-bold mb-2">Beauty & Skincare</h3>
                                        <p className="mb-4">Premium brands at great prices</p>
                                        <Link to={`/${locale}/promotions/beauty`} className="inline-block bg-white text-pink-900 px-6 py-2 rounded-md font-semibold hover:bg-gray-100 transition-colors">
                                            Explore
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Featured Products */}
                <section className="py-16">
                    <div className="max-w-7xl mx-auto px-4">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-3xl font-bold text-gray-900">Featured Products</h2>
                            <Link to={`/${locale}/products`} className="text-red-600 hover:text-red-700 font-semibold flex items-center gap-2">
                                View All
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </Link>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            {featuredProducts.map((product) => (
                                <div key={product.id} className="group bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
                                    <Link to={`/${locale}/products/${product.id}`} className="block">
                                        <div className="relative aspect-square overflow-hidden bg-gray-100">
                                            {product.discount && (
                                                <span className="absolute top-2 left-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded z-10">
                                                    -{product.discount}%
                                                </span>
                                            )}
                                            <img
                                                src={product.image}
                                                alt={product.name}
                                                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                                onError={(e) => {
                                                    e.target.src = '/images/placeholders/product-placeholder.png';
                                                }}
                                            />
                                        </div>
                                        <div className="p-4">
                                            <h3 className="text-sm font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-red-600 transition-colors">
                                                {product.name}
                                            </h3>
                                            <div className="flex items-center gap-1 mb-2">
                                                <div className="flex text-yellow-400">
                                                    {[...Array(5)].map((_, i) => (
                                                        <svg
                                                            key={i}
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            className={`h-4 w-4 ${i < Math.floor(product.rating) ? 'fill-current' : 'fill-gray-300'}`}
                                                            viewBox="0 0 20 20"
                                                        >
                                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                        </svg>
                                                    ))}
                                                </div>
                                                <span className="text-xs text-gray-500">({product.reviews})</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-lg font-bold text-red-600">
                                                    RM {product.price.toFixed(2)}
                                                </span>
                                                {product.originalPrice && (
                                                    <span className="text-sm text-gray-400 line-through">
                                                        RM {product.originalPrice.toFixed(2)}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </Link>
                                    <div className="p-4 pt-0">
                                        <button className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-md font-semibold transition-colors">
                                            Add to Cart
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Newsletter Section */}
                <section className="py-16 bg-gradient-to-r from-red-600 to-red-700">
                    <div className="max-w-7xl mx-auto px-4">
                        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                            <div className="text-white text-center md:text-left">
                                <h2 className="text-3xl font-bold mb-2">Subscribe to Our Newsletter</h2>
                                <p className="text-red-100">Get the latest deals, health tips, and exclusive offers delivered to your inbox</p>
                            </div>
                            <form className="flex gap-3 w-full md:w-auto">
                                <input
                                    type="email"
                                    placeholder="Enter your email"
                                    className="px-4 py-3 rounded-md w-full md:w-80 text-white bg-white/20 placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white focus:bg-white/30"
                                />
                                <button
                                    type="submit"
                                    className="bg-white text-red-600 px-8 py-3 rounded-md font-semibold hover:bg-gray-100 transition-colors whitespace-nowrap"
                                >
                                    Subscribe
                                </button>
                            </form>
                        </div>
                    </div>
                </section>
            </div>
        </>
    );
};

export default Home;

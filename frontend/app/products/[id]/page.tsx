'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import { ProductDetailSkeleton } from '@/components/Skeletons';
import { productApi } from '@/lib/api';
import { formatPrice, formatDate } from '@/lib/utils';
import type { Product } from '@/types';

export default function ProductDetailPage() {
    const params = useParams();
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        if (params.id) {
            loadProduct(params.id as string);
        }
    }, [params.id]);

    const loadProduct = async (id: string) => {
        try {
            setLoading(true);
            const response = await productApi.getById(id);
            setProduct(response.data);
        } catch (err) {
            console.error('Failed to load product:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleRefresh = async () => {
        if (!product) return;
        try {
            setRefreshing(true);
            const response = await productApi.refresh(product.id);
            setProduct(response.data);
        } catch (err) {
            console.error('Failed to refresh product:', err);
        } finally {
            setRefreshing(false);
        }
    };

    if (loading) {
        return (
            <>
                <Header />
                <main className="container-custom py-12">
                    <ProductDetailSkeleton />
                </main>
                <Footer />
            </>
        );
    }

    if (!product) {
        return (
            <>
                <Header />
                <main className="container-custom py-12">
                    <div className="card p-12 text-center">
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">Product not found</h2>
                        <p className="text-slate-600">The product you're looking for doesn't exist.</p>
                    </div>
                </main>
                <Footer />
            </>
        );
    }

    return (
        <>
            <Header />
            <main className="container-custom py-12">
                {/* Product Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                    <div className="aspect-square relative rounded-xl overflow-hidden bg-slate-100">
                        {product.imageUrl ? (
                            <Image
                                src={product.imageUrl}
                                alt={product.title}
                                fill
                                className="object-cover"
                                priority
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center">
                                <svg className="w-32 h-32 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                </svg>
                            </div>
                        )}
                    </div>

                    <div className="space-y-6">
                        <div>
                            <h1 className="text-3xl font-bold text-slate-900 mb-2">{product.title}</h1>
                            {product.author && (
                                <p className="text-lg text-slate-600">by {product.author}</p>
                            )}
                        </div>

                        <div className="flex items-center space-x-4">
                            <span className="text-4xl font-bold text-blue-600">
                                {formatPrice(product.price, product.currency)}
                            </span>
                            {product.detail?.ratingsAvg && (
                                <div className="flex items-center space-x-2">
                                    <div className="flex">
                                        {[...Array(5)].map((_, i) => (
                                            <svg
                                                key={i}
                                                className={`w-5 h-5 ${i < Math.floor(product.detail!.ratingsAvg!)
                                                        ? 'text-yellow-400 fill-current'
                                                        : 'text-slate-300'
                                                    }`}
                                                viewBox="0 0 20 20"
                                            >
                                                <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                                            </svg>
                                        ))}
                                    </div>
                                    <span className="text-sm text-slate-600">
                                        {product.detail.ratingsAvg.toFixed(1)} ({product.detail.reviewsCount} reviews)
                                    </span>
                                </div>
                            )}
                        </div>

                        {product.detail?.description && (
                            <div>
                                <h2 className="text-lg font-semibold text-slate-900 mb-2">Description</h2>
                                <p className="text-slate-700 leading-relaxed">{product.detail.description}</p>
                            </div>
                        )}

                        {product.detail && (
                            <div className="grid grid-cols-2 gap-4 p-4 bg-slate-50 rounded-lg">
                                {product.detail.isbn && (
                                    <div>
                                        <p className="text-sm text-slate-600">ISBN</p>
                                        <p className="font-medium text-slate-900">{product.detail.isbn}</p>
                                    </div>
                                )}
                                {product.detail.publisher && (
                                    <div>
                                        <p className="text-sm text-slate-600">Publisher</p>
                                        <p className="font-medium text-slate-900">{product.detail.publisher}</p>
                                    </div>
                                )}
                                {product.detail.publicationDate && (
                                    <div>
                                        <p className="text-sm text-slate-600">Publication Date</p>
                                        <p className="font-medium text-slate-900">{product.detail.publicationDate}</p>
                                    </div>
                                )}
                            </div>
                        )}

                        <button
                            onClick={handleRefresh}
                            disabled={refreshing}
                            className="btn btn-outline w-full"
                        >
                            {refreshing ? 'Refreshing...' : 'Refresh Data'}
                        </button>
                    </div>
                </div>

                {/* Reviews */}
                {product.reviews && product.reviews.length > 0 && (
                    <div className="mb-12">
                        <h2 className="text-2xl font-bold text-slate-900 mb-6">Customer Reviews</h2>
                        <div className="space-y-4">
                            {product.reviews.map((review) => (
                                <div key={review.id} className="card p-6">
                                    <div className="flex items-start justify-between mb-2">
                                        <div>
                                            <div className="flex items-center space-x-2 mb-1">
                                                <div className="flex">
                                                    {[...Array(5)].map((_, i) => (
                                                        <svg
                                                            key={i}
                                                            className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400 fill-current' : 'text-slate-300'
                                                                }`}
                                                            viewBox="0 0 20 20"
                                                        >
                                                            <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                                                        </svg>
                                                    ))}
                                                </div>
                                                {review.verified && (
                                                    <span className="badge badge-success">Verified Purchase</span>
                                                )}
                                            </div>
                                            {review.author && (
                                                <p className="text-sm font-medium text-slate-900">{review.author}</p>
                                            )}
                                        </div>
                                        {review.reviewDate && (
                                            <p className="text-sm text-slate-500">{formatDate(review.reviewDate)}</p>
                                        )}
                                    </div>
                                    {review.title && (
                                        <h3 className="font-semibold text-slate-900 mb-2">{review.title}</h3>
                                    )}
                                    {review.text && (
                                        <p className="text-slate-700">{review.text}</p>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </main>
            <Footer />
        </>
    );
}

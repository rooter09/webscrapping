'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import { CategoryCardSkeleton, ProductCardSkeleton } from '@/components/Skeletons';
import { categoryApi, productApi, navigationApi } from '@/lib/api';
import type { Category, Product, Navigation } from '@/types';

export default function CategoryPage() {
    const params = useParams();
    const slug = params?.slug as string;

    const [data, setData] = useState<(Navigation | Category) | null>(null);
    const [type, setType] = useState<'navigation' | 'category' | null>(null);
    const [loading, setLoading] = useState(true);
    const [scraping, setScraping] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (slug) {
            loadData();
        }
    }, [slug]);

    const loadData = async () => {
        try {
            setLoading(true);
            setError(null);
            setData(null);
            setType(null);

            // Try Navigation first (Root level)
            try {
                const navResponse = await navigationApi.getBySlug(slug);
                if (navResponse.data) {
                    setData(navResponse.data);
                    setType('navigation');
                    return;
                }
            } catch (e) {
                // Ignore 404, try Category
            }

            // Try Category (Nested level)
            try {
                const catResponse = await categoryApi.getBySlug(slug);
                if (catResponse.data) {
                    setData(catResponse.data);
                    setType('category');
                    return;
                }
            } catch (e) {
                throw new Error('Item not found');
            }

            throw new Error('Item not found');
        } catch (err) {
            setError('Category not found.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleScrapeSubcategories = async () => {
        if (!data) return;
        try {
            setScraping(true);
            if (type === 'navigation') {
                // Scrape categories for this navigation root
                await categoryApi.scrape(data.url, data.id, undefined);
            } else {
                // Scrape subcategories for this category schema
                // The API signature: scrape(url, navigationId, parentId)
                // We might not know navigationId here easily unless we store it, 
                // but looking at usage we can pass parentId = data.id
                await categoryApi.scrape(data.url, undefined, data.id);
            }
            await loadData();
        } catch (err) {
            console.error('Failed to scrape subcategories', err);
            setError('Failed to scrape subcategories. Please try again.');
        } finally {
            setScraping(false);
        }
    };

    const handleScrapeProducts = async () => {
        if (!data || type !== 'category') return;
        try {
            setScraping(true);
            // Scrape products for this category
            await productApi.scrape(data.url, data.id);
            await loadData();
        } catch (err) {
            console.error('Failed to scrape products', err);
            setError('Failed to scrape products. Please try again.');
        } finally {
            setScraping(false);
        }
    };

    // Helper to safely access children/products depending on type
    const getChildren = () => {
        if (type === 'navigation') return (data as Navigation).categories;
        if (type === 'category') return (data as Category).children;
        return undefined;
    };

    const getProducts = () => {
        if (type === 'category') return (data as Category).products;
        return undefined;
    };

    const children = getChildren();
    const products = getProducts();
    const hasChildren = children && children.length > 0;
    const hasProducts = products && products.length > 0;

    // Heuristic: If it's a category and has productCount, but no products/children logic
    const productCount = (data && 'productCount' in data) ? (data as Category).productCount : 0;
    // Navigation usually implies categories. Category can contain subcats or products.

    return (
        <div className="min-h-screen bg-slate-50">
            <Header />
            <main className="container-custom py-12">
                {loading ? (
                    <div className="space-y-8">
                        <div className="h-12 w-64 bg-slate-200 rounded animate-pulse mb-8" />
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[...Array(6)].map((_, i) => (
                                <CategoryCardSkeleton key={i} />
                            ))}
                        </div>
                    </div>
                ) : error || !data ? (
                    <div className="text-center py-20">
                        <h2 className="text-2xl font-bold text-slate-800 mb-4">{error || 'Category not found'}</h2>
                        <Link href="/" className="text-blue-600 hover:underline">Return Home</Link>
                    </div>
                ) : (
                    <div>
                        {/* Breadcrumb / Header */}
                        <div className="mb-8">
                            <div className="flex items-center text-sm text-slate-500 mb-2">
                                <Link href="/" className="hover:text-blue-600">Home</Link>
                                <span className="mx-2">/</span>
                                <span className="text-slate-900 font-medium">{data.title}</span>
                            </div>
                            <h1 className="text-4xl font-bold text-slate-900">{data.title}</h1>
                            {productCount > 0 && !hasProducts && !hasChildren && (
                                <p className="text-slate-600 mt-2">Found approximately {productCount} products</p>
                            )}
                        </div>

                        {/* Content Logic */}
                        {!hasChildren && !hasProducts ? (
                            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center max-w-2xl mx-auto">
                                <svg className="w-16 h-16 text-slate-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                </svg>
                                <h3 className="text-xl font-bold text-slate-900 mb-2">No items loaded</h3>
                                <p className="text-slate-600 mb-8">This collection is currently empty in our database.</p>

                                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                                    <button
                                        onClick={handleScrapeSubcategories}
                                        disabled={scraping}
                                        className="inline-flex items-center justify-center rounded-lg px-6 py-3 text-sm font-medium bg-white text-slate-700 border border-slate-300 hover:bg-slate-50 transition-all disabled:opacity-50"
                                    >
                                        {scraping ? 'Scraping...' : 'Look for Categories'}
                                    </button>
                                    {type === 'category' && (
                                        <button
                                            onClick={handleScrapeProducts}
                                            disabled={scraping}
                                            className="inline-flex items-center justify-center rounded-lg px-6 py-3 text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 shadow-lg transition-all disabled:opacity-50"
                                        >
                                            {scraping ? 'Scraping...' : 'Fetch Products'}
                                        </button>
                                    )}
                                </div>
                                {scraping && (
                                    <p className="mt-4 text-sm text-blue-600 animate-pulse">
                                        Scraping live data from World of Books... this may take a minute.
                                    </p>
                                )}
                            </div>
                        ) : (
                            <div className="space-y-12">
                                {/* Subcategories */}
                                {hasChildren && (
                                    <section>
                                        <h2 className="text-2xl font-bold text-slate-900 mb-6">
                                            {type === 'navigation' ? 'Categories' : 'Subcategories'}
                                        </h2>
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                            {children!.map((sub) => (
                                                <Link
                                                    key={sub.id}
                                                    href={`/categories/${sub.slug}`} // This will seamlessly work recursively
                                                    className="bg-white rounded-xl shadow hover:shadow-lg transition-all border border-slate-200 p-6 flex items-center justify-between group"
                                                >
                                                    <span className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">{sub.title}</span>
                                                    <span className="text-slate-400 group-hover:translate-x-1 transition-transform">→</span>
                                                </Link>
                                            ))}
                                        </div>
                                    </section>
                                )}

                                {/* Products */}
                                {hasProducts && (
                                    <section>
                                        <h2 className="text-2xl font-bold text-slate-900 mb-6">Products</h2>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                            {products!.map((product) => (
                                                <ProductCard key={product.id} product={product} />
                                            ))}
                                        </div>
                                    </section>
                                )}
                            </div>
                        )}
                    </div>
                )}
            </main>
            <Footer />
        </div>
    );
}

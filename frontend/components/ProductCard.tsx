import Image from 'next/image';
import Link from 'next/link';
import type { Product } from '@/types';
import { formatPrice } from '@/lib/utils';

interface ProductCardProps {
    product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
    return (
        <Link href={`/products/${product.id}`} className="group">
            <div className="card card-hover p-4 h-full">
                <div className="aspect-[3/4] relative mb-4 overflow-hidden rounded-lg bg-slate-100">
                    {product.imageUrl ? (
                        <Image
                            src={product.imageUrl}
                            alt={product.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center">
                            <svg
                                className="w-16 h-16 text-slate-300"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                                />
                            </svg>
                        </div>
                    )}
                </div>

                <div className="space-y-2">
                    <h3 className="font-semibold text-slate-900 line-clamp-2 group-hover:text-blue-600 transition-colors">
                        {product.title}
                    </h3>

                    {product.author && (
                        <p className="text-sm text-slate-600 line-clamp-1">by {product.author}</p>
                    )}

                    <div className="flex items-center justify-between pt-2">
                        <span className="text-lg font-bold text-blue-600">
                            {formatPrice(product.price, product.currency)}
                        </span>

                        {product.detail?.ratingsAvg && (
                            <div className="flex items-center space-x-1">
                                <svg className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
                                    <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                                </svg>
                                <span className="text-sm font-medium text-slate-700">
                                    {product.detail.ratingsAvg.toFixed(1)}
                                </span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Link>
    );
}

export interface Navigation {
    id: string;
    title: string;
    slug: string;
    url: string;
    lastScrapedAt: string;
    createdAt: string;
    updatedAt: string;
    categories?: Category[];
}

export interface Category {
    id: string;
    navigationId?: string;
    parentId?: string;
    title: string;
    slug: string;
    url: string;
    productCount: number;
    lastScrapedAt: string;
    createdAt: string;
    updatedAt: string;
    children?: Category[];
    products?: Product[];
}

export interface Product {
    id: string;
    sourceId: string;
    categoryId?: string;
    title: string;
    author?: string;
    price?: number;
    currency: string;
    imageUrl?: string;
    sourceUrl: string;
    lastScrapedAt: string;
    createdAt: string;
    updatedAt: string;
    category?: Category;
    detail?: ProductDetail;
    reviews?: Review[];
}

export interface ProductDetail {
    id: string;
    productId: string;
    description?: string;
    specs?: Record<string, any>;
    ratingsAvg?: number;
    reviewsCount: number;
    isbn?: string;
    publisher?: string;
    publicationDate?: string;
    relatedProductIds?: string[];
    createdAt: string;
    updatedAt: string;
}

export interface Review {
    id: string;
    productId: string;
    author?: string;
    rating: number;
    text?: string;
    title?: string;
    verified: boolean;
    reviewDate?: string;
    createdAt: string;
}

export interface PaginatedResponse<T> {
    data: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export interface ProductFilters {
    page?: number;
    limit?: number;
    search?: string;
    categoryId?: string;
    minPrice?: number;
    maxPrice?: number;
    minRating?: number;
    author?: string;
    sortBy?: 'price' | 'title' | 'createdAt';
    sortOrder?: 'ASC' | 'DESC';
}

import axios from 'axios';
import type { Navigation, Category, Product, PaginatedResponse, ProductFilters } from '@/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Navigation API
export const navigationApi = {
    getAll: () => api.get<Navigation[]>('/navigation'),
    getById: (id: string) => api.get<Navigation>(`/navigation/${id}`),
    getBySlug: (slug: string) => api.get<Navigation>(`/navigation/slug/${slug}`),
    scrape: (force?: boolean) => api.post<Navigation[]>('/navigation/scrape', {}, { params: { force } }),
};

// Category API
export const categoryApi = {
    getAll: (navigationId?: string) => api.get<Category[]>('/categories', { params: { navigationId } }),
    getById: (id: string) => api.get<Category>(`/categories/${id}`),
    getBySlug: (slug: string) => api.get<Category>(`/categories/slug/${slug}`),
    getByParent: (parentId: string) => api.get<Category[]>(`/categories/parent/${parentId}`),
    scrape: (url: string, navigationId?: string, parentId?: string, force?: boolean) =>
        api.post<Category[]>('/categories/scrape', { url, force }, { params: { navigationId, parentId } }),
};

// Product API
export const productApi = {
    getAll: (filters: ProductFilters = {}) =>
        api.get<PaginatedResponse<Product>>('/products', { params: filters }),
    getById: (id: string) => api.get<Product>(`/products/${id}`),
    getBySourceId: (sourceId: string) => api.get<Product>(`/products/source/${sourceId}`),
    scrape: (url: string, categoryId?: string, maxPages?: number, force?: boolean) =>
        api.post<Product[]>('/products/scrape', { url, force }, { params: { categoryId, maxPages } }),
    refresh: (id: string) => api.post<Product>(`/products/${id}/refresh`),
    scrapeDetail: (id: string, force?: boolean) =>
        api.post<Product>(`/products/${id}/scrape-detail`, {}, { params: { force } }),
};

// View History API
export const viewHistoryApi = {
    create: (data: {
        sessionId: string;
        url: string;
        pathJson: Record<string, any>;
        userId?: string;
        productId?: string;
        categoryId?: string;
    }) => api.post('/view-history', data),
    getBySession: (sessionId: string, limit?: number) =>
        api.get('/view-history/session/' + sessionId, { params: { limit } }),
    getByUser: (userId: string, limit?: number) =>
        api.get('/view-history/user/' + userId, { params: { limit } }),
};

export default api;

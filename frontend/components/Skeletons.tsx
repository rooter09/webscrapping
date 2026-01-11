export function ProductCardSkeleton() {
    return (
        <div className="card p-4 animate-pulse">
            <div className="aspect-[3/4] bg-slate-200 rounded-lg mb-4"></div>
            <div className="h-4 bg-slate-200 rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-slate-200 rounded w-1/2 mb-4"></div>
            <div className="h-6 bg-slate-200 rounded w-1/4"></div>
        </div>
    );
}

export function CategoryCardSkeleton() {
    return (
        <div className="card p-6 animate-pulse">
            <div className="h-6 bg-slate-200 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-slate-200 rounded w-1/2"></div>
        </div>
    );
}

export function ProductDetailSkeleton() {
    return (
        <div className="animate-pulse">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div className="aspect-square bg-slate-200 rounded-xl"></div>
                <div className="space-y-4">
                    <div className="h-8 bg-slate-200 rounded w-3/4"></div>
                    <div className="h-4 bg-slate-200 rounded w-1/2"></div>
                    <div className="h-10 bg-slate-200 rounded w-1/4"></div>
                    <div className="space-y-2">
                        <div className="h-4 bg-slate-200 rounded"></div>
                        <div className="h-4 bg-slate-200 rounded"></div>
                        <div className="h-4 bg-slate-200 rounded w-5/6"></div>
                    </div>
                </div>
            </div>
        </div>
    );
}

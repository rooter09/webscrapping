export function formatPrice(price?: number, currency: string = 'GBP'): string {
    if (price === undefined || price === null) return 'N/A';

    const formatter = new Intl.NumberFormat('en-GB', {
        style: 'currency',
        currency,
    });

    return formatter.format(price);
}

export function formatDate(date: string | Date): string {
    return new Intl.DateTimeFormat('en-GB', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    }).format(new Date(date));
}

export function truncateText(text: string, maxLength: number): string {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + '...';
}

export function createSlug(text: string): string {
    return text
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
}

export function getSessionId(): string {
    if (typeof window === 'undefined') return '';

    let sessionId = sessionStorage.getItem('sessionId');
    if (!sessionId) {
        sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        sessionStorage.setItem('sessionId', sessionId);
    }
    return sessionId;
}

export function saveToHistory(path: string, data: Record<string, any>) {
    if (typeof window === 'undefined') return;

    const history = JSON.parse(localStorage.getItem('browsingHistory') || '[]');
    history.unshift({
        path,
        data,
        timestamp: new Date().toISOString(),
    });

    // Keep only last 50 items
    if (history.length > 50) {
        history.splice(50);
    }

    localStorage.setItem('browsingHistory', JSON.stringify(history));
}

export function getHistory(): Array<{ path: string; data: Record<string, any>; timestamp: string }> {
    if (typeof window === 'undefined') return [];
    return JSON.parse(localStorage.getItem('browsingHistory') || '[]');
}

export function clearHistory() {
    if (typeof window === 'undefined') return;
    localStorage.removeItem('browsingHistory');
}

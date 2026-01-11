import Link from 'next/link';

export default function Header() {
    return (
        <header className="sticky top-0 z-50 w-full border-b border-slate-200/50 bg-white/80 backdrop-blur-lg">
            <div className="container-custom">
                <div className="flex h-16 items-center justify-between">
                    <Link href="/" className="flex items-center space-x-2 group">
                        <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 shadow-lg group-hover:shadow-xl transition-all duration-300">
                            <svg
                                className="w-6 h-6 text-white"
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
                        <div>
                            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                                Product Explorer
                            </h1>
                            <p className="text-xs text-slate-500">World of Books</p>
                        </div>
                    </Link>

                    <nav className="hidden md:flex items-center space-x-6">
                        <Link
                            href="/"
                            className="text-sm font-medium text-slate-700 hover:text-blue-600 transition-colors duration-200"
                        >
                            Home
                        </Link>
                        <Link
                            href="/products"
                            className="text-sm font-medium text-slate-700 hover:text-blue-600 transition-colors duration-200"
                        >
                            Products
                        </Link>
                        <Link
                            href="/about"
                            className="text-sm font-medium text-slate-700 hover:text-blue-600 transition-colors duration-200"
                        >
                            About
                        </Link>
                        <Link
                            href="/contact"
                            className="text-sm font-medium text-slate-700 hover:text-blue-600 transition-colors duration-200"
                        >
                            Contact
                        </Link>
                    </nav>

                    <div className="flex items-center space-x-4">
                        <button
                            className="p-2 rounded-lg hover:bg-slate-100 transition-colors duration-200"
                            aria-label="Search"
                        >
                            <svg
                                className="w-5 h-5 text-slate-600"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
}

import Link from 'next/link';

export default function Footer() {
    return (
        <footer className="border-t border-slate-200 bg-white/50 backdrop-blur-sm mt-20">
            <div className="container-custom py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="col-span-1 md:col-span-2">
                        <div className="flex items-center space-x-2 mb-4">
                            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600">
                                <svg
                                    className="w-5 h-5 text-white"
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
                            <span className="text-lg font-bold text-slate-900">Product Explorer</span>
                        </div>
                        <p className="text-sm text-slate-600 max-w-md">
                            A production-ready product exploration platform with live scraping from World of Books.
                            Built with Next.js, NestJS, and TypeScript.
                        </p>
                    </div>

                    <div>
                        <h3 className="font-semibold text-slate-900 mb-4">Quick Links</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link href="/" className="text-sm text-slate-600 hover:text-blue-600 transition-colors">
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link href="/products" className="text-sm text-slate-600 hover:text-blue-600 transition-colors">
                                    Products
                                </Link>
                            </li>
                            <li>
                                <Link href="/about" className="text-sm text-slate-600 hover:text-blue-600 transition-colors">
                                    About
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-semibold text-slate-900 mb-4">Resources</h3>
                        <ul className="space-y-2">
                            <li>
                                <a
                                    href={process.env.NEXT_PUBLIC_API_URL + '/api'}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-sm text-slate-600 hover:text-blue-600 transition-colors"
                                >
                                    API Documentation
                                </a>
                            </li>
                            <li>
                                <a
                                    href="https://github.com"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-sm text-slate-600 hover:text-blue-600 transition-colors"
                                >
                                    GitHub
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-slate-200 mt-8 pt-8 text-center">
                    <p className="text-sm text-slate-600">
                        © {new Date().getFullYear()} Product Data Explorer. Built for educational purposes.
                    </p>
                </div>
            </div>
        </footer>
    );
}

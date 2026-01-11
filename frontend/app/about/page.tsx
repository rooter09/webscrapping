import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function AboutPage() {
    return (
        <>
            <Header />
            <main className="container-custom py-12">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                        About Product Data Explorer
                    </h1>

                    <div className="space-y-8">
                        <section className="card p-8">
                            <h2 className="text-2xl font-bold text-slate-900 mb-4">Overview</h2>
                            <p className="text-slate-700 leading-relaxed mb-4">
                                Product Data Explorer is a production-ready web application that enables users to explore products
                                from World of Books through an intuitive interface powered by live, on-demand web scraping.
                            </p>
                            <p className="text-slate-700 leading-relaxed">
                                Built as a full-stack demonstration project, it showcases modern web development practices,
                                ethical web scraping, and real-time data processing.
                            </p>
                        </section>

                        <section className="card p-8">
                            <h2 className="text-2xl font-bold text-slate-900 mb-4">Technology Stack</h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <h3 className="font-semibold text-lg text-slate-900 mb-3">Frontend</h3>
                                    <ul className="space-y-2 text-slate-700">
                                        <li className="flex items-center space-x-2">
                                            <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                                            <span>Next.js 14 (App Router)</span>
                                        </li>
                                        <li className="flex items-center space-x-2">
                                            <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                                            <span>TypeScript</span>
                                        </li>
                                        <li className="flex items-center space-x-2">
                                            <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                                            <span>Tailwind CSS</span>
                                        </li>
                                        <li className="flex items-center space-x-2">
                                            <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                                            <span>SWR for data fetching</span>
                                        </li>
                                    </ul>
                                </div>

                                <div>
                                    <h3 className="font-semibold text-lg text-slate-900 mb-3">Backend</h3>
                                    <ul className="space-y-2 text-slate-700">
                                        <li className="flex items-center space-x-2">
                                            <span className="w-2 h-2 bg-indigo-600 rounded-full"></span>
                                            <span>NestJS</span>
                                        </li>
                                        <li className="flex items-center space-x-2">
                                            <span className="w-2 h-2 bg-indigo-600 rounded-full"></span>
                                            <span>TypeScript</span>
                                        </li>
                                        <li className="flex items-center space-x-2">
                                            <span className="w-2 h-2 bg-indigo-600 rounded-full"></span>
                                            <span>PostgreSQL + TypeORM</span>
                                        </li>
                                        <li className="flex items-center space-x-2">
                                            <span className="w-2 h-2 bg-indigo-600 rounded-full"></span>
                                            <span>Crawlee + Playwright</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </section>

                        <section className="card p-8">
                            <h2 className="text-2xl font-bold text-slate-900 mb-4">Key Features</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="flex items-start space-x-3">
                                    <svg className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    <div>
                                        <h3 className="font-semibold text-slate-900">Live Web Scraping</h3>
                                        <p className="text-sm text-slate-600">Real-time data extraction from World of Books</p>
                                    </div>
                                </div>

                                <div className="flex items-start space-x-3">
                                    <svg className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    <div>
                                        <h3 className="font-semibold text-slate-900">Intelligent Caching</h3>
                                        <p className="text-sm text-slate-600">TTL-based caching to minimize server load</p>
                                    </div>
                                </div>

                                <div className="flex items-start space-x-3">
                                    <svg className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    <div>
                                        <h3 className="font-semibold text-slate-900">Advanced Filtering</h3>
                                        <p className="text-sm text-slate-600">Search by price, rating, author, and more</p>
                                    </div>
                                </div>

                                <div className="flex items-start space-x-3">
                                    <svg className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    <div>
                                        <h3 className="font-semibold text-slate-900">Responsive Design</h3>
                                        <p className="text-sm text-slate-600">Optimized for all devices and screen sizes</p>
                                    </div>
                                </div>

                                <div className="flex items-start space-x-3">
                                    <svg className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    <div>
                                        <h3 className="font-semibold text-slate-900">Browsing History</h3>
                                        <p className="text-sm text-slate-600">Track and persist user navigation</p>
                                    </div>
                                </div>

                                <div className="flex items-start space-x-3">
                                    <svg className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    <div>
                                        <h3 className="font-semibold text-slate-900">RESTful API</h3>
                                        <p className="text-sm text-slate-600">Well-documented API with Swagger</p>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <section className="card p-8">
                            <h2 className="text-2xl font-bold text-slate-900 mb-4">Ethical Scraping</h2>
                            <p className="text-slate-700 leading-relaxed mb-4">
                                This project implements responsible web scraping practices:
                            </p>
                            <ul className="space-y-2 text-slate-700">
                                <li className="flex items-start space-x-2">
                                    <span className="text-blue-600 mt-1">•</span>
                                    <span>Respects robots.txt and terms of service</span>
                                </li>
                                <li className="flex items-start space-x-2">
                                    <span className="text-blue-600 mt-1">•</span>
                                    <span>Implements rate limiting (2-3 seconds between requests)</span>
                                </li>
                                <li className="flex items-start space-x-2">
                                    <span className="text-blue-600 mt-1">•</span>
                                    <span>Uses exponential backoff on errors</span>
                                </li>
                                <li className="flex items-start space-x-2">
                                    <span className="text-blue-600 mt-1">•</span>
                                    <span>Caches results aggressively to minimize requests</span>
                                </li>
                                <li className="flex items-start space-x-2">
                                    <span className="text-blue-600 mt-1">•</span>
                                    <span>Monitors and logs all scraping activities</span>
                                </li>
                            </ul>
                        </section>

                        <section className="card p-8 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
                            <h2 className="text-2xl font-bold text-slate-900 mb-4">API Documentation</h2>
                            <p className="text-slate-700 mb-4">
                                Explore the full API documentation with interactive examples:
                            </p>
                            <a
                                href={process.env.NEXT_PUBLIC_API_URL + '/api'}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn btn-primary inline-flex items-center space-x-2"
                            >
                                <span>View API Docs</span>
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                </svg>
                            </a>
                        </section>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}

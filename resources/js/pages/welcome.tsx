import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';

export default function Welcome() {
    const { auth } = usePage<SharedData>().props;

    return (
        <>
            <Head title="Welcome" />
            <div className="from-background relative flex min-h-screen flex-col items-center justify-center bg-gradient-to-br to-gray-50 px-4 dark:to-gray-900">
                {/* Decorative elements */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className="bg-primary/10 absolute top-0 left-1/4 h-32 w-32 rounded-full blur-3xl" />
                    <div className="bg-secondary/10 absolute right-1/4 bottom-0 h-40 w-40 rounded-full blur-3xl" />
                </div>

                <div className="relative z-10 w-full max-w-4xl space-y-8 text-center">
                    {/* Header section */}
                    <div className="space-y-6">
                        <h1 className="from-primary to-primary/80 bg-gradient-to-r bg-clip-text text-5xl font-bold tracking-tight text-transparent">
                            Laravel 12 + React Starter Kit
                        </h1>
                        <p className="text-muted-foreground mx-auto max-w-2xl text-lg">
                            Accelerate your development with a production-ready foundation featuring authentication, role management, customizable
                            settings, and a modern UI.
                        </p>
                    </div>

                    {/* CTA section */}
                    {auth.user ? (
                        <div className="space-y-4">
                            {(() => {
                                let dashboardUrl = '/dashboard';
                                if (auth.user.permissions?.includes('dashboard-system-view')) {
                                    dashboardUrl = '/dashboard-system';
                                } else if (auth.user.permissions?.includes('dashboard-admin-view')) {
                                    dashboardUrl = '/dashboard-admin';
                                } else if (auth.user.permissions?.includes('dashboard-reseller-view')) {
                                    dashboardUrl = '/dashboard-reseller';
                                }
                                return (
                                    <Link
                                        href={dashboardUrl}
                                        className="bg-primary hover:bg-primary/90 inline-flex transform items-center justify-center rounded-lg px-8 py-3 font-medium text-white shadow-md transition-all hover:-translate-y-0.5 hover:shadow-lg"
                                    >
                                        Go to Dashboard
                                        <svg xmlns="http://www.w3.org/2000/svg" className="ml-2 h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                            <path
                                                fillRule="evenodd"
                                                d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                    </Link>
                                );
                            })()}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                            <Link
                                href="/login"
                                className="border-border transform rounded-lg border bg-white px-8 py-3 font-medium shadow-sm transition-all hover:-translate-y-0.5 hover:bg-gray-50 hover:shadow-md dark:bg-gray-800 dark:hover:bg-gray-700"
                            >
                                Sign In
                            </Link>
                            <Link
                                href="/register"
                                className="bg-primary hover:bg-primary/90 transform rounded-lg px-8 py-3 font-medium text-white shadow-md transition-all hover:-translate-y-0.5 hover:shadow-lg"
                            >
                                Get Started
                            </Link>
                        </div>
                    )}

                    {/* Features grid */}
                    <div className="grid grid-cols-1 gap-6 pt-8 md:grid-cols-3">
                        <div className="border-border rounded-xl border bg-white p-6 shadow-sm transition-shadow hover:shadow-md dark:bg-gray-800/50">
                            <div className="text-primary mb-3">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                                    />
                                </svg>
                            </div>
                            <h3 className="mb-2 text-lg font-semibold">Secure Authentication</h3>
                            <p className="text-muted-foreground text-sm">Built-in user authentication with email verification and password reset.</p>
                        </div>
                        <div className="border-border rounded-xl border bg-white p-6 shadow-sm transition-shadow hover:shadow-md dark:bg-gray-800/50">
                            <div className="text-primary mb-3">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                                    />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                            </div>
                            <h3 className="mb-2 text-lg font-semibold">Role Management</h3>
                            <p className="text-muted-foreground text-sm">Flexible role-based permissions system for controlling access.</p>
                        </div>
                        <div className="border-border rounded-xl border bg-white p-6 shadow-sm transition-shadow hover:shadow-md dark:bg-gray-800/50">
                            <div className="text-primary mb-3">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"
                                    />
                                </svg>
                            </div>
                            <h3 className="mb-2 text-lg font-semibold">Modern Dashboard</h3>
                            <p className="text-muted-foreground text-sm">Clean, responsive interface with dark mode support.</p>
                        </div>
                    </div>

                    {/* Footer links */}
                    <div className="text-muted-foreground space-y-2 pt-8 text-sm">
                        <p>
                            Read the{' '}
                            <a
                                href="https://laravel.com/docs"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-primary font-medium hover:underline"
                            >
                                Laravel documentation
                            </a>{' '}
                            or explore{' '}
                            <a
                                href="https://laracasts.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-primary font-medium hover:underline"
                            >
                                Laracasts tutorials
                            </a>
                            .
                        </p>
                        <p>
                            Need quick deployment? Try{' '}
                            <a
                                href="https://cloud.laravel.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-primary font-medium hover:underline"
                            >
                                Laravel Cloud
                            </a>
                            .
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}

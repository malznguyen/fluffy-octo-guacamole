'use client';

import React from 'react';
import Link from 'next/link';

interface AuthLayoutProps {
    children: React.ReactNode;
    imageUrl?: string;
    imagePosition?: 'left' | 'right';
}

export function AuthLayout({
    children,
    imageUrl = 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=1200&auto=format&fit=crop',
    imagePosition = 'left',
}: AuthLayoutProps) {
    return (
        <div className="min-h-screen flex">
            {/* Image Section */}
            <div
                className={cn(
                    'hidden lg:block lg:w-1/2 relative',
                    imagePosition === 'right' && 'order-2'
                )}
            >
                <div className="absolute inset-0 bg-black/10 z-10" />
                <img
                    src={imageUrl}
                    alt="FASH.ON"
                    className="absolute inset-0 w-full h-full object-cover"
                />
                {/* Brand Overlay */}
                <div className="absolute bottom-12 left-12 z-20">
                    <Link href="/" className="text-white">
                        <span className="font-display text-4xl font-bold tracking-tight">
                            FASH.ON
                        </span>
                    </Link>
                </div>
            </div>

            {/* Form Section */}
            <div
                className={cn(
                    'w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-16',
                    imagePosition === 'right' && 'order-1'
                )}
            >
                <div className="w-full max-w-md">
                    {/* Mobile Logo */}
                    <div className="lg:hidden mb-12 text-center">
                        <Link href="/">
                            <span className="font-display text-3xl font-bold tracking-tight">
                                FASH.ON
                            </span>
                        </Link>
                    </div>
                    {children}
                </div>
            </div>
        </div>
    );
}

function cn(...classes: (string | boolean | undefined)[]) {
    return classes.filter(Boolean).join(' ');
}

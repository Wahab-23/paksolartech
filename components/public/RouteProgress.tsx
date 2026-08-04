'use client';

import { useEffect, useState, useTransition } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

export default function RouteProgress() {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [loading, setLoading] = useState(false);
    const [progress, setProgress] = useState(0);

    // Reset loader when pathname or searchParams change
    useEffect(() => {
        if (loading) {
            setProgress(100);
            const timer = setTimeout(() => {
                setLoading(false);
                setProgress(0);
            }, 300);
            return () => clearTimeout(timer);
        }
    }, [pathname, searchParams]);

    // Handle clicks on standard links to trigger instant loading animation
    useEffect(() => {
        const handleAnchorClick = (e: MouseEvent) => {
            const target = e.target as HTMLElement | null;
            const anchor = target?.closest('a');

            if (!anchor) return;

            const href = anchor.getAttribute('href');
            const targetAttr = anchor.getAttribute('target');

            // Skip external links, hash links, new tab links, or identical URLs
            if (
                !href ||
                href.startsWith('http://') ||
                href.startsWith('https://') ||
                href.startsWith('#') ||
                href.startsWith('mailto:') ||
                href.startsWith('tel:') ||
                targetAttr === '_blank'
            ) {
                return;
            }

            const currentUrl = window.location.pathname + window.location.search;
            if (href === currentUrl) return;

            // Trigger instant progress bar
            setLoading(true);
            setProgress(30);

            // Animate progress incrementally while waiting for route transition
            const interval = setInterval(() => {
                setProgress((prev) => {
                    if (prev >= 85) {
                        clearInterval(interval);
                        return 85;
                    }
                    return prev + 15;
                });
            }, 120);

            // Safety cleanup after 4 seconds
            setTimeout(() => {
                clearInterval(interval);
            }, 4000);
        };

        document.addEventListener('click', handleAnchorClick);
        return () => document.removeEventListener('click', handleAnchorClick);
    }, []);

    if (!loading && progress === 0) return null;

    return (
        <div className="pointer-events-none fixed top-0 left-0 right-0 z-[100] h-1 bg-transparent">
            {/* Shimmering Progress Line */}
            <div
                className="h-full bg-linear-to-r from-primary via-emerald-400 to-amber-400 transition-all duration-300 ease-out shadow-[0_0_12px_rgba(var(--primary),0.8)]"
                style={{
                    width: `${progress}%`,
                    opacity: progress === 100 ? 0 : 1,
                    transition: progress === 100 ? 'width 200ms ease-out, opacity 300ms ease-in 100ms' : 'width 300ms ease-out'
                }}
            />
            {/* Glowing Leading Edge */}
            {loading && progress < 100 && (
                <div
                    className="absolute top-0 h-full w-24 bg-linear-to-r from-transparent to-white/80 blur-[2px] transition-all duration-300"
                    style={{ left: `calc(${progress}% - 96px)` }}
                />
            )}
        </div>
    );
}
